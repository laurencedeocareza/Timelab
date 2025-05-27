import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../FirebaseConfig";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  // Create user profile in Firestore
  async createUserProfile(uid: string, fullName: string, email: string) {
    const userRef = doc(db, "users", uid);
    const userData: UserProfile = {
      uid,
      fullName,
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await setDoc(userRef, userData);
    return userData;
  },

  // Get user profile from Firestore
  async getUserProfile(uid: string): Promise<UserProfile | null> {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return userSnap.data() as UserProfile;
    }
    return null;
  },

  // Update user profile
  async updateUserProfile(uid: string, updates: Partial<UserProfile>) {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, {
      ...updates,
      updatedAt: new Date(),
    });
  },

  // Get current user profile
  async getCurrentUserProfile(): Promise<UserProfile | null> {
    const user = auth.currentUser;
    if (!user) return null;

    return await this.getUserProfile(user.uid);
  },
};
