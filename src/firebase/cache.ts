/**
 * Firebase Cache Manager with AsyncStorage
 *
 * This module provides a persistent caching layer for Firestore data.
 * It uses AsyncStorage for persistence and includes TTL (Time To Live) support.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

// Cache configuration
const CACHE_VERSION = '1.0.0';
const DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes in milliseconds

// Cache key prefixes for different data types
export const CACHE_KEYS = {
  VERSION: '@cache_version',
  USERS: '@cache_users:',
  STUDENTS: '@cache_students:',
  ANNOUNCEMENTS: '@cache_announcements:',
  ATTENDANCE: '@cache_attendance:',
  AUTHORISED_PERSONS: '@cache_authorised_persons:',
  QUESTIONS: '@cache_questions:',
  ANSWERS: '@cache_answers:',
} as const;

// Special cache keys for collections
export const COLLECTION_KEYS = {
  ALL_STUDENTS: '@cache_students:all',
  ALL_ANNOUNCEMENTS: '@cache_announcements:all',
  RECENT_ANNOUNCEMENTS: '@cache_announcements:recent',
} as const;

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Cache Manager Class
 */
class CacheManager {
  private memoryCache: Map<string, CacheEntry<any>> = new Map();

  constructor() {
    this.checkVersion();
  }

  /**
   * Check cache version and clear if outdated
   */
  private async checkVersion() {
    try {
      const storedVersion = await AsyncStorage.getItem(CACHE_KEYS.VERSION);
      if (storedVersion !== CACHE_VERSION) {
        console.log('🔄 Cache version mismatch, clearing cache...');
        await this.clearAll();
        await AsyncStorage.setItem(CACHE_KEYS.VERSION, CACHE_VERSION);
      }
    } catch (error) {
      console.error('❌ Error checking cache version:', error);
    }
  }

  /**
   * Set data in cache (both memory and AsyncStorage)
   */
  async set<T>(key: string, data: T, ttl: number = DEFAULT_TTL): Promise<void> {
    const cacheEntry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl,
    };

    // Store in memory cache
    this.memoryCache.set(key, cacheEntry);

    // Store in AsyncStorage
    try {
      await AsyncStorage.setItem(key, JSON.stringify(cacheEntry));
    } catch (error) {
      console.error(`❌ Error saving to AsyncStorage (${key}):`, error);
    }
  }

  /**
   * Get data from cache
   * Checks memory first, then AsyncStorage
   */
  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.memoryCache.get(key);
    if (memoryEntry) {
      if (this.isValid(memoryEntry)) {
        return memoryEntry.data as T;
      } else {
        // Expired in memory, remove it
        this.memoryCache.delete(key);
      }
    }

    // Check AsyncStorage
    try {
      const stored = await AsyncStorage.getItem(key);
      if (stored) {
        const cacheEntry: CacheEntry<T> = JSON.parse(stored);

        if (this.isValid(cacheEntry)) {
          // Restore to memory cache
          this.memoryCache.set(key, cacheEntry);
          return cacheEntry.data;
        } else {
          // Expired, remove from AsyncStorage
          await AsyncStorage.removeItem(key);
        }
      }
    } catch (error) {
      console.error(`❌ Error reading from AsyncStorage (${key}):`, error);
    }

    return null;
  }

  /**
   * Check if cache entry is still valid (not expired)
   */
  private isValid<T>(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) < entry.ttl;
  }

  /**
   * Remove specific key from cache
   */
  async remove(key: string): Promise<void> {
    this.memoryCache.delete(key);
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`❌ Error removing from AsyncStorage (${key}):`, error);
    }
  }

  /**
   * Clear cache by prefix (e.g., clear all users)
   */
  async clearByPrefix(prefix: string): Promise<void> {
    // Clear from memory cache
    const keysToDelete: string[] = [];
    this.memoryCache.forEach((_, key) => {
      if (key.startsWith(prefix)) {
        keysToDelete.push(key);
      }
    });
    keysToDelete.forEach(key => this.memoryCache.delete(key));

    // Clear from AsyncStorage
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const keysWithPrefix = allKeys.filter(key => key.startsWith(prefix));
      if (keysWithPrefix.length > 0) {
        await AsyncStorage.multiRemove(keysWithPrefix);
      }
    } catch (error) {
      console.error(`❌ Error clearing prefix (${prefix}):`, error);
    }
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<void> {
    this.memoryCache.clear();
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('@cache_'));
      if (cacheKeys.length > 0) {
        await AsyncStorage.multiRemove(cacheKeys);
      }
      console.log('✅ Cache cleared successfully');
    } catch (error) {
      console.error('❌ Error clearing all cache:', error);
    }
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<{
    memorySize: number;
    storageKeys: number;
  }> {
    try {
      const allKeys = await AsyncStorage.getAllKeys();
      const cacheKeys = allKeys.filter(key => key.startsWith('@cache_'));

      return {
        memorySize: this.memoryCache.size,
        storageKeys: cacheKeys.length,
      };
    } catch (error) {
      console.error('❌ Error getting cache stats:', error);
      return {
        memorySize: this.memoryCache.size,
        storageKeys: 0,
      };
    }
  }
}

// Export singleton instance
export const cacheManager = new CacheManager();

/**
 * Helper functions for specific data types
 */

// Users
export const UserCache = {
  set: (userId: string, data: any, ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.USERS}${userId}`, data, ttl),
  get: (userId: string) =>
    cacheManager.get(`${CACHE_KEYS.USERS}${userId}`),
  remove: (userId: string) =>
    cacheManager.remove(`${CACHE_KEYS.USERS}${userId}`),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.USERS),
};

// Students
export const StudentCache = {
  set: (studentId: string, data: any, ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.STUDENTS}${studentId}`, data, ttl),
  get: (studentId: string) =>
    cacheManager.get(`${CACHE_KEYS.STUDENTS}${studentId}`),
  remove: (studentId: string) =>
    cacheManager.remove(`${CACHE_KEYS.STUDENTS}${studentId}`),
  setAll: (data: any[], ttl?: number) =>
    cacheManager.set(COLLECTION_KEYS.ALL_STUDENTS, data, ttl),
  getAll: () =>
    cacheManager.get(COLLECTION_KEYS.ALL_STUDENTS),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.STUDENTS),
};

// Announcements
export const AnnouncementCache = {
  set: (announcementId: string, data: any, ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.ANNOUNCEMENTS}${announcementId}`, data, ttl),
  get: (announcementId: string) =>
    cacheManager.get(`${CACHE_KEYS.ANNOUNCEMENTS}${announcementId}`),
  remove: (announcementId: string) =>
    cacheManager.remove(`${CACHE_KEYS.ANNOUNCEMENTS}${announcementId}`),
  setAll: (data: any[], ttl?: number) =>
    cacheManager.set(COLLECTION_KEYS.ALL_ANNOUNCEMENTS, data, ttl),
  getAll: () =>
    cacheManager.get(COLLECTION_KEYS.ALL_ANNOUNCEMENTS),
  setRecent: (data: any[], ttl?: number) =>
    cacheManager.set(COLLECTION_KEYS.RECENT_ANNOUNCEMENTS, data, ttl),
  getRecent: () =>
    cacheManager.get(COLLECTION_KEYS.RECENT_ANNOUNCEMENTS),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.ANNOUNCEMENTS),
};

// Attendance
export const AttendanceCache = {
  set: (date: string, studentId: string, data: any, ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.ATTENDANCE}${date}:${studentId}`, data, ttl),
  get: (date: string, studentId: string) =>
    cacheManager.get(`${CACHE_KEYS.ATTENDANCE}${date}:${studentId}`),
  remove: (date: string, studentId: string) =>
    cacheManager.remove(`${CACHE_KEYS.ATTENDANCE}${date}:${studentId}`),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.ATTENDANCE),
};

// Authorised Persons
export const AuthorisedPersonCache = {
  set: (userId: string, data: any[], ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.AUTHORISED_PERSONS}${userId}`, data, ttl),
  get: (userId: string) =>
    cacheManager.get(`${CACHE_KEYS.AUTHORISED_PERSONS}${userId}`),
  remove: (userId: string) =>
    cacheManager.remove(`${CACHE_KEYS.AUTHORISED_PERSONS}${userId}`),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.AUTHORISED_PERSONS),
};

// Questions
export const QuestionCache = {
  set: (announcementId: string, data: any[], ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.QUESTIONS}${announcementId}`, data, ttl),
  get: (announcementId: string) =>
    cacheManager.get(`${CACHE_KEYS.QUESTIONS}${announcementId}`),
  remove: (announcementId: string) =>
    cacheManager.remove(`${CACHE_KEYS.QUESTIONS}${announcementId}`),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.QUESTIONS),
};

// Answers
export const AnswerCache = {
  set: (questionId: string, data: any[], ttl?: number) =>
    cacheManager.set(`${CACHE_KEYS.ANSWERS}${questionId}`, data, ttl),
  get: (questionId: string) =>
    cacheManager.get(`${CACHE_KEYS.ANSWERS}${questionId}`),
  remove: (questionId: string) =>
    cacheManager.remove(`${CACHE_KEYS.ANSWERS}${questionId}`),
  clear: () =>
    cacheManager.clearByPrefix(CACHE_KEYS.ANSWERS),
};

/**
 * Cache invalidation helpers
 */
export const CacheInvalidation = {
  /**
   * Invalidate cache after user mutations
   */
  onUserUpdate: (userId: string) => {
    UserCache.remove(userId);
  },

  /**
   * Invalidate cache after student mutations
   */
  onStudentUpdate: (studentId: string) => {
    StudentCache.remove(studentId);
    cacheManager.remove(COLLECTION_KEYS.ALL_STUDENTS);
  },

  /**
   * Invalidate cache after announcement mutations
   */
  onAnnouncementUpdate: (announcementId: string) => {
    AnnouncementCache.remove(announcementId);
    cacheManager.remove(COLLECTION_KEYS.ALL_ANNOUNCEMENTS);
    cacheManager.remove(COLLECTION_KEYS.RECENT_ANNOUNCEMENTS);
  },

  /**
   * Invalidate cache after attendance mutations
   */
  onAttendanceUpdate: (date: string, studentId: string) => {
    AttendanceCache.remove(date, studentId);
  },

  /**
   * Invalidate cache after authorised person mutations
   */
  onAuthorisedPersonUpdate: (userId: string) => {
    AuthorisedPersonCache.remove(userId);
  },

  /**
   * Invalidate all cache on logout
   */
  onLogout: () => {
    cacheManager.clearAll();
  },
};
