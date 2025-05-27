import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  getDocs,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";

export interface TimeInterval {
  id: string;
  label: string;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
}

export interface CustomSession {
  id: string;
  name: string;
  userId: string;
  scheduledDate?: Date;
  sessionDuration: number; // in seconds
  intervals: TimeInterval[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export const customTimerService = {
  // Add a new custom session
  async addCustomSession(
    name: string,
    intervals: Omit<TimeInterval, "id">[],
    scheduledDate?: Date,
    sessionDuration?: number
  ) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const intervalObjects: TimeInterval[] = intervals.map(
      (interval, index) => ({
        ...interval,
        id: `interval_${Date.now()}_${index}`,
        totalSeconds:
          interval.hours * 3600 + interval.minutes * 60 + interval.seconds,
      })
    );

    const totalDuration =
      sessionDuration ||
      intervalObjects.reduce((sum, interval) => sum + interval.totalSeconds, 0);

    const sessionData = {
      name,
      userId: user.uid,
      scheduledDate: scheduledDate || null,
      sessionDuration: totalDuration,
      intervals: intervalObjects,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    const docRef = await addDoc(collection(db, "customSessions"), sessionData);
    return docRef.id;
  },

  // Get user's custom sessions
  async getUserCustomSessions() {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "customSessions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as CustomSession[];
  },

  // Listen to user's custom sessions in real-time
  subscribeToUserCustomSessions(callback: (sessions: CustomSession[]) => void) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    const q = query(
      collection(db, "customSessions"),
      where("userId", "==", user.uid),
      orderBy("createdAt", "desc")
    );

    return onSnapshot(q, (querySnapshot) => {
      const sessions = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CustomSession[];
      callback(sessions);
    });
  },

  // Delete a custom session
  async deleteCustomSession(sessionId: string) {
    await deleteDoc(doc(db, "customSessions", sessionId));
  },

  // Update a custom session
  async updateCustomSession(
    sessionId: string,
    updates: Partial<CustomSession>
  ) {
    await updateDoc(doc(db, "customSessions", sessionId), {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  },
};
