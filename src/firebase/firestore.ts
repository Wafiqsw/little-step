// src/firebase/firestore.ts
import { db } from "./index";
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  doc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  getDocs as getDocsQuery,
  DocumentReference,
  DocumentData
} from "firebase/firestore";

// CREATE
export const createData = async <T extends DocumentData>(
  collectionName: string,
  data: T
): Promise<DocumentReference<DocumentData>> => {
  return await addDoc(collection(db, collectionName), data);
};

// CREATE WITH CUSTOM ID (e.g., using UID)
export const createDataWithId = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data);
};

// READ ALL
export const getAllData = async <T = DocumentData>(
  collectionName: string
): Promise<Array<T & { id: string }>> => {
  const snapshot = await getDocs(collection(db, collectionName));
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));
};

// READ ONE BY ID
export const getDataById = async <T = DocumentData>(
  collectionName: string,
  id: string
): Promise<(T & { id: string }) | null> => {
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);
  return snapshot.exists() ? { id: snapshot.id, ...snapshot.data() } as T & { id: string } : null;
};



// UPDATE
export const updateData = async (
  collectionName: string,
  id: string,
  updatedValues: Partial<DocumentData>
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  return await updateDoc(docRef, updatedValues);
};

// DELETE
export const deleteData = async (
  collectionName: string,
  id: string
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  return await deleteDoc(docRef);
};

//customs shit for data fetching bro 


// READ USER BY PHONE NUMBER
export const getUserByPhone = async <T = DocumentData>(numphone: string): Promise<(T & { id: string }) | null> => {
  const usersRef = collection(db, 'users');

  // numphone is already normalized to local format (0XXXXXXXXX) by normalizePhoneNumber
  console.log(`🔍 Searching for user with phone: "${numphone}"`);

  const q = query(usersRef, where('numphone', '==', numphone));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log('❌ No user found with phone:', numphone);
    return null;
  }

  // Return the first matching user
  const userDoc = snapshot.docs[0];
  console.log('✅ Found user:', userDoc.data());
  return { id: userDoc.id, ...userDoc.data() } as T & { id: string };
};

// READ USER BY EMAIL
export const getUserByEmail = async <T = DocumentData>(email: string): Promise<(T & { id: string }) | null> => {
  try {
    const usersRef = collection(db, 'users');

    // Normalize email to lowercase for consistent comparison
    const normalizedEmail = email.toLowerCase().trim();
    console.log(`🔍 Searching for user with email: "${normalizedEmail}"`);

    const q = query(usersRef, where('email', '==', normalizedEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('❌ No user found with email:', normalizedEmail);
      return null;
    }

    // Return the first matching user
    const userDoc = snapshot.docs[0];
    console.log('✅ Found user:', userDoc.data());
    return { id: userDoc.id, ...userDoc.data() } as T & { id: string };
  } catch (error: any) {
    console.error('❌ ERROR in getUserByEmail:');
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    throw error;
  }
};