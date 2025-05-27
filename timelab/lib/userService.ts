import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import {
  updatePassword,
  updateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { db, auth } from "../FirebaseConfig";

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export const userService = {
  // Update user email
  async updateUserEmail(newEmail: string, currentPassword: string) {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not authenticated");

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update email in Firebase Auth
    await updateEmail(user, newEmail);

    // Update email in Firestore
    await this.updateUserProfile(user.uid, { email: newEmail });
  },

  // Update user password
  async updateUserPassword(currentPassword: string, newPassword: string) {
    const user = auth.currentUser;
    if (!user || !user.email) throw new Error("User not authenticated");

    // Re-authenticate user
    const credential = EmailAuthProvider.credential(
      user.email,
      currentPassword
    );
    await reauthenticateWithCredential(user, credential);

    // Update password
    await updatePassword(user, newPassword);
  },

  // Update user profile name
  async updateUserProfileName(fullName: string) {
    const user = auth.currentUser;
    if (!user) throw new Error("User not authenticated");

    await this.updateUserProfile(user.uid, { fullName });
  },
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
