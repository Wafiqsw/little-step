/**
 * Firestore functions with integrated caching
 *
 * This module wraps the existing firestore functions with a caching layer.
 * Data is first checked in cache, then fetched from Firestore if needed.
 */

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
  DocumentReference,
  DocumentData
} from "firebase/firestore";
import {
  cacheManager,
  UserCache,
  StudentCache,
  AnnouncementCache,
  AttendanceCache,
  AuthorisedPersonCache,
  QuestionCache,
  AnswerCache,
  CacheInvalidation,
  CACHE_KEYS,
  COLLECTION_KEYS,
} from './cache';

/**
 * Cache configuration per collection
 */
const CACHE_TTL = {
  users: 30 * 60 * 1000,        // 30 minutes
  students: 30 * 60 * 1000,     // 30 minutes
  announcements: 15 * 60 * 1000, // 15 minutes
  attendance: 5 * 60 * 1000,    // 5 minutes (more dynamic)
  authorised_person: 15 * 60 * 1000, // 15 minutes
  questions: 10 * 60 * 1000,    // 10 minutes
  answers: 10 * 60 * 1000,      // 10 minutes
};

/**
 * Options for cache-aware functions
 */
interface CacheOptions {
  useCache?: boolean;      // Whether to use cache (default: true)
  forceRefresh?: boolean;  // Force fetch from Firestore (default: false)
  ttl?: number;           // Custom TTL for this request
}

// ==================== CREATE ====================

/**
 * CREATE with cache invalidation
 */
export const createDataWithCache = async <T extends DocumentData>(
  collectionName: string,
  data: T,
  options: CacheOptions = {}
): Promise<DocumentReference<DocumentData>> => {
  const docRef = await addDoc(collection(db, collectionName), data);

  // Invalidate relevant cache
  invalidateCacheForCollection(collectionName);

  console.log(`✅ Created ${collectionName} document:`, docRef.id);
  return docRef;
};

/**
 * CREATE WITH CUSTOM ID with cache invalidation
 */
export const createDataWithIdAndCache = async <T extends DocumentData>(
  collectionName: string,
  id: string,
  data: T,
  options: CacheOptions = {}
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await setDoc(docRef, data);

  // Cache the newly created document
  await cacheDocument(collectionName, id, data, options.ttl);

  // Invalidate collection cache
  invalidateCacheForCollection(collectionName);

  console.log(`✅ Created ${collectionName} document with ID:`, id);
};

// ==================== READ ====================

/**
 * READ ALL with cache
 */
export const getAllDataWithCache = async <T = DocumentData>(
  collectionName: string,
  options: CacheOptions = { useCache: true, forceRefresh: false }
): Promise<Array<T & { id: string }>> => {
  const cacheKey = `${getCachePrefix(collectionName)}all`;

  // Check cache first (unless force refresh)
  if (options.useCache !== false && !options.forceRefresh) {
    const cached = await cacheManager.get<Array<T & { id: string }>>(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for ${collectionName} (all)`);
      return cached;
    }
  }

  // Fetch from Firestore
  console.log(`🔥 Fetching ${collectionName} from Firestore (all)`);
  const snapshot = await getDocs(collection(db, collectionName));
  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));

  // Cache the result
  const ttl = options.ttl || getTTLForCollection(collectionName);
  await cacheManager.set(cacheKey, data, ttl);

  return data;
};

/**
 * READ ONE BY ID with cache
 */
export const getDataByIdWithCache = async <T = DocumentData>(
  collectionName: string,
  id: string,
  options: CacheOptions = { useCache: true, forceRefresh: false }
): Promise<(T & { id: string }) | null> => {
  const cacheKey = `${getCachePrefix(collectionName)}${id}`;

  // Check cache first (unless force refresh)
  if (options.useCache !== false && !options.forceRefresh) {
    const cached = await cacheManager.get<T & { id: string }>(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for ${collectionName}:${id}`);
      return cached;
    }
  }

  // Fetch from Firestore
  console.log(`🔥 Fetching ${collectionName}:${id} from Firestore`);
  const docRef = doc(db, collectionName, id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    return null;
  }

  const data = { id: snapshot.id, ...snapshot.data() } as T & { id: string };

  // Cache the result
  const ttl = options.ttl || getTTLForCollection(collectionName);
  await cacheManager.set(cacheKey, data, ttl);

  return data;
};

// ==================== UPDATE ====================

/**
 * UPDATE with cache invalidation
 */
export const updateDataWithCache = async (
  collectionName: string,
  id: string,
  updatedValues: Partial<DocumentData>,
  options: CacheOptions = {}
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await updateDoc(docRef, updatedValues);

  // Invalidate specific document cache
  const cacheKey = `${getCachePrefix(collectionName)}${id}`;
  await cacheManager.remove(cacheKey);

  // Invalidate collection cache
  invalidateCacheForCollection(collectionName);

  console.log(`✅ Updated ${collectionName}:${id} and invalidated cache`);
};

// ==================== DELETE ====================

/**
 * DELETE with cache invalidation
 */
export const deleteDataWithCache = async (
  collectionName: string,
  id: string,
  options: CacheOptions = {}
): Promise<void> => {
  const docRef = doc(db, collectionName, id);
  await deleteDoc(docRef);

  // Invalidate specific document cache
  const cacheKey = `${getCachePrefix(collectionName)}${id}`;
  await cacheManager.remove(cacheKey);

  // Invalidate collection cache
  invalidateCacheForCollection(collectionName);

  console.log(`✅ Deleted ${collectionName}:${id} and invalidated cache`);
};

// ==================== CUSTOM QUERIES ====================

/**
 * READ USER BY PHONE with cache
 */
export const getUserByPhoneWithCache = async <T = DocumentData>(
  numphone: string,
  options: CacheOptions = { useCache: true, forceRefresh: false }
): Promise<(T & { id: string }) | null> => {
  const cacheKey = `${CACHE_KEYS.USERS}phone:${numphone}`;

  // Check cache first
  if (options.useCache !== false && !options.forceRefresh) {
    const cached = await cacheManager.get<T & { id: string }>(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for user by phone: ${numphone}`);
      return cached;
    }
  }

  // Fetch from Firestore
  console.log(`🔍 Searching for user with phone: "${numphone}"`);
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('numphone', '==', numphone));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log('❌ No user found with phone:', numphone);
    return null;
  }

  const userDoc = snapshot.docs[0];
  const data = { id: userDoc.id, ...userDoc.data() } as T & { id: string };

  // Cache the result
  await cacheManager.set(cacheKey, data, CACHE_TTL.users);
  // Also cache by user ID
  await UserCache.set(userDoc.id, data, CACHE_TTL.users);

  console.log('✅ Found user:', data);
  return data;
};

/**
 * READ USER BY EMAIL with cache
 */
export const getUserByEmailWithCache = async <T = DocumentData>(
  email: string,
  options: CacheOptions = { useCache: true, forceRefresh: false }
): Promise<(T & { id: string }) | null> => {
  const normalizedEmail = email.toLowerCase().trim();
  const cacheKey = `${CACHE_KEYS.USERS}email:${normalizedEmail}`;

  // Check cache first
  if (options.useCache !== false && !options.forceRefresh) {
    const cached = await cacheManager.get<T & { id: string }>(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for user by email: ${normalizedEmail}`);
      return cached;
    }
  }

  try {
    console.log(`🔍 Searching for user with email: "${normalizedEmail}"`);
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', normalizedEmail));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log('❌ No user found with email:', normalizedEmail);
      return null;
    }

    const userDoc = snapshot.docs[0];
    const data = { id: userDoc.id, ...userDoc.data() } as T & { id: string };

    // Cache the result
    await cacheManager.set(cacheKey, data, CACHE_TTL.users);
    // Also cache by user ID
    await UserCache.set(userDoc.id, data, CACHE_TTL.users);

    console.log('✅ Found user:', data);
    return data;
  } catch (error: any) {
    console.error('❌ ERROR in getUserByEmailWithCache:');
    console.error('Error code:', error?.code);
    console.error('Error message:', error?.message);
    console.error('Full error:', error);
    throw error;
  }
};

/**
 * Query with cache (generic query function)
 */
export const queryWithCache = async <T = DocumentData>(
  collectionName: string,
  queryConstraints: any[],
  cacheKey: string,
  options: CacheOptions = { useCache: true, forceRefresh: false }
): Promise<Array<T & { id: string }>> => {
  // Check cache first
  if (options.useCache !== false && !options.forceRefresh) {
    const cached = await cacheManager.get<Array<T & { id: string }>>(cacheKey);
    if (cached) {
      console.log(`📦 Cache hit for query: ${cacheKey}`);
      return cached;
    }
  }

  // Fetch from Firestore
  console.log(`🔥 Executing query: ${cacheKey}`);
  const colRef = collection(db, collectionName);
  const q = query(colRef, ...queryConstraints);
  const snapshot = await getDocs(q);

  const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as T & { id: string }));

  // Cache the result
  const ttl = options.ttl || getTTLForCollection(collectionName);
  await cacheManager.set(cacheKey, data, ttl);

  return data;
};

// ==================== HELPER FUNCTIONS ====================

/**
 * Get cache prefix for collection
 */
function getCachePrefix(collectionName: string): string {
  switch (collectionName) {
    case 'users':
      return CACHE_KEYS.USERS;
    case 'students':
      return CACHE_KEYS.STUDENTS;
    case 'announcements':
      return CACHE_KEYS.ANNOUNCEMENTS;
    case 'attendance':
      return CACHE_KEYS.ATTENDANCE;
    case 'authorised_person':
      return CACHE_KEYS.AUTHORISED_PERSONS;
    case 'questions':
      return CACHE_KEYS.QUESTIONS;
    case 'answers':
      return CACHE_KEYS.ANSWERS;
    default:
      return `@cache_${collectionName}:`;
  }
}

/**
 * Get TTL for collection
 */
function getTTLForCollection(collectionName: string): number {
  return (CACHE_TTL as any)[collectionName] || 15 * 60 * 1000; // Default 15 minutes
}

/**
 * Cache a document
 */
async function cacheDocument(
  collectionName: string,
  id: string,
  data: any,
  customTtl?: number
): Promise<void> {
  const cacheKey = `${getCachePrefix(collectionName)}${id}`;
  const ttl = customTtl || getTTLForCollection(collectionName);
  await cacheManager.set(cacheKey, { id, ...data }, ttl);
}

/**
 * Invalidate cache for entire collection
 */
function invalidateCacheForCollection(collectionName: string): void {
  const prefix = getCachePrefix(collectionName);
  cacheManager.clearByPrefix(prefix);

  // Also clear special collection keys
  if (collectionName === 'students') {
    cacheManager.remove(COLLECTION_KEYS.ALL_STUDENTS);
  } else if (collectionName === 'announcements') {
    cacheManager.remove(COLLECTION_KEYS.ALL_ANNOUNCEMENTS);
    cacheManager.remove(COLLECTION_KEYS.RECENT_ANNOUNCEMENTS);
  }
}

/**
 * Batch fetch with cache (useful for DocumentReferences)
 */
export const batchGetWithCache = async <T = DocumentData>(
  refs: DocumentReference[],
  options: CacheOptions = { useCache: true }
): Promise<Array<(T & { id: string }) | null>> => {
  const results: Array<(T & { id: string }) | null> = [];

  for (const ref of refs) {
    // Extract collection and ID from DocumentReference
    const collectionName = ref.parent.id;
    const id = ref.id;

    const data = await getDataByIdWithCache<T>(collectionName, id, options);
    results.push(data);
  }

  return results;
};

/**
 * Clear all cache (useful for logout or troubleshooting)
 */
export const clearAllCache = async (): Promise<void> => {
  await cacheManager.clearAll();
  console.log('✅ All cache cleared');
};

/**
 * Get cache statistics
 */
export const getCacheStats = async () => {
  return await cacheManager.getStats();
};

// Re-export cache invalidation helpers
export { CacheInvalidation };
