// src/firebase/auth.ts
import { auth } from "./index";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  UserCredential
} from "firebase/auth";

// REGISTER
export const registerUser = (email: string, password: string): Promise<UserCredential> =>
  createUserWithEmailAndPassword(auth, email, password);

// LOGIN
export const loginUser = (email: string, password: string): Promise<UserCredential> =>
  signInWithEmailAndPassword(auth, email, password);

// LOGOUT
export const logoutUser = (): Promise<void> => signOut(auth);
