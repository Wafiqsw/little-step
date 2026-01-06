# Migration Example: Before and After Cache

This document shows a real example of migrating a screen from non-cached to cached data fetching.

## Example: Parent Dashboard

### BEFORE (Without Cache)

```typescript
// src/screens/parents/Dashboard.tsx
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { collection, query, where, getDocs, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { getAllData, getDataById } from '../../firebase/firestore';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // This runs EVERY TIME the screen is focused (tab switch, navigation back, etc.)
  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);

    try {
      // Fetch all students (10-20 Firestore reads)
      const studentsData = await getAllData('students');
      setStudents(studentsData);

      // For each student, fetch attendance (20-40 more reads)
      const attendanceData = [];
      for (const student of studentsData) {
        const attendanceRef = collection(db, 'attendance');
        const q = query(
          attendanceRef,
          where('student_ref', '==', student.id),
          where('date', '>=', startOfWeek),
          where('date', '<=', endOfWeek)
        );
        const snapshot = await getDocs(q);
        attendanceData.push(...snapshot.docs.map(doc => doc.data()));
      }
      setAttendance(attendanceData);

      // Fetch guardian details for each student (20-40 more reads)
      for (const student of studentsData) {
        if (student.guardian) {
          const guardianDoc = await getDoc(student.guardian);
          // Process guardian data...
        }
      }

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData(); // Runs every time screen is focused!
    }, [fetchDashboardData])
  );

  return (
    // ... UI code
  );
};
```

**Problems:**
- 50-100+ Firestore reads per dashboard visit
- Data refetched even if nothing changed
- Slow loading times
- High Firestore costs
- Poor offline experience

---

### AFTER (With Cache)

```typescript
// src/screens/parents/Dashboard.tsx
import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { RefreshControl } from 'react-native';
import {
  getAllDataWithCache,
  getDataByIdWithCache,
  queryWithCache,
  batchGetWithCache
} from '../../firebase/firestoreWithCache';
import { where } from 'firebase/firestore';

const Dashboard = () => {
  const [students, setStudents] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = useCallback(async (forceRefresh = false) => {
    setIsLoading(true);

    try {
      // Fetch all students - uses cache if available (0-1 Firestore reads)
      const studentsData = await getAllDataWithCache('students', { forceRefresh });
      setStudents(studentsData);

      // For each student, fetch attendance with cache (0-5 reads, most from cache)
      const attendanceData = [];
      for (const student of studentsData) {
        const cacheKey = `@cache_attendance:week:${student.id}`;
        const weekAttendance = await queryWithCache(
          'attendance',
          [
            where('student_ref', '==', student.id),
            where('date', '>=', startOfWeek),
            where('date', '<=', endOfWeek)
          ],
          cacheKey,
          { forceRefresh }
        );
        attendanceData.push(...weekAttendance);
      }
      setAttendance(attendanceData);

      // Batch fetch guardian details (0-2 reads, most from cache)
      const guardianRefs = studentsData
        .map(s => s.guardian)
        .filter(g => g != null);
      const guardians = await batchGetWithCache(guardianRefs, { forceRefresh });
      // Process guardians...

    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Pull to refresh
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchDashboardData(true); // Force refresh
    setRefreshing(false);
  }, [fetchDashboardData]);

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData(); // Uses cache, only fetches if expired
    }, [fetchDashboardData])
  );

  return (
    <ScrollView
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* ... UI code */}
    </ScrollView>
  );
};
```

**Benefits:**
- First load: ~50 Firestore reads (same as before)
- Subsequent loads: 0-5 Firestore reads (90% reduction!)
- Much faster loading
- Works offline
- Pull-to-refresh for manual updates
- Lower Firestore costs

---

## Example: Pickup List

### BEFORE

```typescript
// src/screens/parents/PickupList.tsx
import { collection, query, where, getDocs } from 'firebase/firestore';

const fetchAuthorisedPersons = useCallback(async () => {
  setIsLoading(true);

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, 'users', currentUser.uid);

  // Query Firestore every time
  const authorisedRef = collection(db, 'authorised_person');
  const authorisedQuery = query(
    authorisedRef,
    where('assigned_by', '==', userRef),
    where('archived', '==', false)
  );
  const authorisedSnapshot = await getDocs(authorisedQuery);

  const authorisedData = authorisedSnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));

  setAuthorisedPersons(authorisedData);
  setIsLoading(false);
}, []);

useFocusEffect(
  useCallback(() => {
    fetchAuthorisedPersons(); // Refetches every time!
  }, [fetchAuthorisedPersons])
);
```

### AFTER

```typescript
// src/screens/parents/PickupList.tsx
import { queryWithCache, updateDataWithCache } from '../../firebase/firestoreWithCache';
import { where } from 'firebase/firestore';

const fetchAuthorisedPersons = useCallback(async (forceRefresh = false) => {
  setIsLoading(true);

  const currentUser = auth.currentUser;
  if (!currentUser) return;

  const userRef = doc(db, 'users', currentUser.uid);

  // Use cache - only queries Firestore if cache expired
  const cacheKey = `@cache_authorised_persons:${currentUser.uid}:active`;
  const authorisedData = await queryWithCache(
    'authorised_person',
    [
      where('assigned_by', '==', userRef),
      where('archived', '==', false)
    ],
    cacheKey,
    { forceRefresh }
  );

  setAuthorisedPersons(authorisedData);
  setIsLoading(false);
}, []);

// Save with automatic cache invalidation
const handleSave = async (id, data) => {
  setIsSaving(true);

  // Cache is automatically invalidated
  await updateDataWithCache('authorised_person', id, {
    name: data.name.trim(),
    relationship: data.relationship.trim(),
    numphone: data.phoneNumber.trim(),
  });

  // Refetch to update UI with fresh data
  await fetchAuthorisedPersons(true);

  setIsSaving(false);
};
```

---

## Migration Checklist

When migrating a screen to use cache:

- [ ] Replace `getAllData()` with `getAllDataWithCache()`
- [ ] Replace `getDataById()` with `getDataByIdWithCache()`
- [ ] Replace custom queries with `queryWithCache()`
- [ ] Replace multiple `getDoc()` calls with `batchGetWithCache()`
- [ ] Use `createDataWithCache()`, `updateDataWithCache()`, `deleteDataWithCache()` for mutations
- [ ] Add pull-to-refresh with `forceRefresh: true`
- [ ] Remove unnecessary `forceRefresh` in initial loads
- [ ] Test cache behavior with multiple screen visits

## Performance Comparison

### Before Cache
```
Dashboard First Load:   50 reads   (2-3 seconds)
Dashboard Revisit:      50 reads   (2-3 seconds)
Newsfeed First Load:    20 reads   (1-2 seconds)
Newsfeed Revisit:       20 reads   (1-2 seconds)
Pickup List First Load: 10 reads   (0.5-1 second)
Pickup List Revisit:    10 reads   (0.5-1 second)

Total per session:     ~200 reads
```

### After Cache
```
Dashboard First Load:   50 reads   (2-3 seconds)
Dashboard Revisit:       0 reads   (<0.1 seconds) ✨
Newsfeed First Load:    20 reads   (1-2 seconds)
Newsfeed Revisit:        0 reads   (<0.1 seconds) ✨
Pickup List First Load: 10 reads   (0.5-1 second)
Pickup List Revisit:     0 reads   (<0.1 seconds) ✨

Total per session:     ~80 reads (60% reduction!)
```

**After cache expires (15 minutes):**
```
Subsequent loads will refetch, but only when needed!
```

---

## Common Patterns

### Pattern 1: useFocusEffect with Cache

```typescript
// Always use cache on screen focus
useFocusEffect(
  useCallback(() => {
    fetchData(); // Uses cache if available
  }, [fetchData])
);

// User can manually refresh if needed
const onRefresh = async () => {
  await fetchData(true); // Force refresh
};
```

### Pattern 2: Mutations with Invalidation

```typescript
const handleUpdate = async () => {
  // Cache is automatically invalidated
  await updateDataWithCache('students', studentId, updates);

  // Refetch to show updated data
  await fetchStudents(true);
};
```

### Pattern 3: Complex Queries

```typescript
const fetchFilteredData = async (filter, forceRefresh = false) => {
  // Create a unique cache key for this specific query
  const cacheKey = `@cache_students:filter:${filter}`;

  const data = await queryWithCache(
    'students',
    [where('status', '==', filter)],
    cacheKey,
    { forceRefresh }
  );

  return data;
};
```

---

## Need Help?

Check the main [CACHE_USAGE.md](./CACHE_USAGE.md) guide for more details and examples!
