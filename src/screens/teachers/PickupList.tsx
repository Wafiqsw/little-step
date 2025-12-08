import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, PickupCard } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { db } from '../../firebase'
import { collection, query, where, getDocs, Timestamp, doc } from 'firebase/firestore'
import type { Attendance } from '../../types/Attendance'

type PickupListNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TeacherTabNavigator'>

type StudentPickupData = {
  id: string
  studentName: string
  guardianName: string
  hasArrived: boolean
  pickupTime?: string
  pickupStatus: boolean
}

const PickupList = () => {
  const navigation = useNavigation<PickupListNavigationProp>()
  const [loading, setLoading] = useState(true)
  const [waitingPickups, setWaitingPickups] = useState<StudentPickupData[]>([])
  const [pickedUpStudents, setPickedUpStudents] = useState<StudentPickupData[]>([])

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const fetchTodayPickups = useCallback(async () => {
    setLoading(true)
    try {
      // Get today's date range
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      // Fetch today's attendance records where attendance_status is true
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('date', '>=', Timestamp.fromDate(today)),
        where('date', '<', Timestamp.fromDate(tomorrow)),
        where('attendance_status', '==', true)
      )

      const attendanceSnapshot = await getDocs(attendanceQuery)

      const pickupData: StudentPickupData[] = []

      // Fetch student details for each attendance record
      for (const attendanceDoc of attendanceSnapshot.docs) {
        const data = attendanceDoc.data() as Attendance
        const studentId = data.student_ref?.id

        if (studentId) {
          // Fetch student data
          const studentDoc = await getDocs(query(collection(db, 'students'), where('__name__', '==', studentId)))

          if (!studentDoc.empty) {
            const studentData = studentDoc.docs[0].data()

            // TODO: Fetch guardian name from student's parent reference
            // For now, use placeholder
            const guardianName = 'Parent Name' // Will be fetched from parent reference

            pickupData.push({
              id: studentId,
              studentName: studentData.name || 'Unknown Student',
              guardianName,
              hasArrived: data.arrival_status || false,
              pickupTime: data.pickup_time instanceof Timestamp
                ? data.pickup_time.toDate().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
                : undefined,
              pickupStatus: data.pickup_status || false
            })
          }
        }
      }

      // Separate into waiting and picked up
      const waiting = pickupData.filter(p => !p.pickupStatus)
      const pickedUp = pickupData.filter(p => p.pickupStatus)

      setWaitingPickups(waiting)
      setPickedUpStudents(pickedUp)
    } catch (error) {
      console.error('Error fetching pickup data:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Refetch data whenever screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchTodayPickups()
    }, [fetchTodayPickups])
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header onAvatarPress={handleAvatarPress} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
          <Text style={styles.loadingText}>Loading pickup list...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onAvatarPress={handleAvatarPress} />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Today's Pickup</Text>

        {/* Waiting for Pickup Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Waiting for Pickup</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{waitingPickups.length}</Text>
            </View>
          </View>

          <View style={styles.cardList}>
            {waitingPickups.length > 0 ? (
              waitingPickups.map((pickup) => (
                <PickupCard
                  key={pickup.id}
                  name={pickup.guardianName}
                  studentName={pickup.studentName}
                  variant="parent"
                  hasArrived={pickup.hasArrived}
                  onPress={() => console.log('Pickup pressed:', pickup.studentName)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Takde students waiting for pickup</Text>
              </View>
            )}
          </View>
        </View>

        {/* Already Picked Up Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Already Picked Up</Text>
            <View style={[styles.badge, styles.badgeDismissed]}>
              <Text style={styles.badgeText}>{pickedUpStudents.length}</Text>
            </View>
          </View>

          <View style={styles.cardList}>
            {pickedUpStudents.length > 0 ? (
              pickedUpStudents.map((pickup) => (
                <PickupCard
                  key={pickup.id}
                  name={pickup.guardianName}
                  studentName={pickup.studentName}
                  variant="pickup"
                  pickupTime={pickup.pickupTime}
                  onPress={() => console.log('Picked up student pressed:', pickup.studentName)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>Takde students picked up yet</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.full,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDismissed: {
    backgroundColor: Colors.secondary[100],
  },
  badgeText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight as any,
    color: Colors.text.primary,
  },
  cardList: {
    gap: Spacing.sm,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
  },
})

export { PickupList }
