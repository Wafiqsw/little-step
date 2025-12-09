import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Slider, ProgressCard, NavigationCard, ChildAttendanceData } from '../../components'
import { Typography, Colors, Spacing } from '../../constants'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { ParentTabNavigatorParamList } from '../../navigation/type'
import { CompositeNavigationProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { db, auth } from '../../firebase'
import { collection, query, where, getDocs, doc, DocumentReference, Timestamp, updateDoc } from 'firebase/firestore'
import { Student } from '../../types/Student'
import { Attendance } from '../../types/Attendance'

type DashboardNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<ParentTabNavigatorParamList, 'Home'>,
  NativeStackNavigationProp<MainNavigatorParamList>
>

type StudentPickupStatus = {
  studentId: string
  studentName: string
  status: 'not-attending' | 'in-class' | 'waiting-pickup' | 'picked-up'
  lastUpdate?: string
  attendanceStatus: boolean
  arrivalStatus?: boolean
  pickupStatus?: boolean
}

const Dashboard = () => {
  const navigation = useNavigation<DashboardNavigationProp>()
  const [childrenAttendance, setChildrenAttendance] = useState<ChildAttendanceData[]>([])
  const [loadingAttendance, setLoadingAttendance] = useState(true)
  const [studentsPickupStatus, setStudentsPickupStatus] = useState<StudentPickupStatus[]>([])
  const [loadingPickupStatus, setLoadingPickupStatus] = useState(true)
  const [currentChildIndex, setCurrentChildIndex] = useState(0)

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  // Handle arrival confirmation (I've Arrived slider)
  const handleArrivalConfirmed = async (studentId: string, studentName: string) => {
    try {
      console.log(`🚗 Updating arrival status for ${studentName}`)

      // Find today's attendance document for this student
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const studentRef = doc(db, 'students', studentId)
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('student_ref', '==', studentRef)
      )
      const attendanceSnapshot = await getDocs(attendanceQuery)

      // Find today's record
      const todayRecord = attendanceSnapshot.docs.find((docSnap) => {
        const data = docSnap.data() as Attendance
        let recordDate: Date

        if (data.date instanceof Timestamp) {
          recordDate = data.date.toDate()
        } else if (data.date instanceof Date) {
          recordDate = data.date
        } else if (typeof data.date === 'object' && (data.date as any).seconds) {
          recordDate = new Date((data.date as any).seconds * 1000)
        } else {
          return false
        }

        recordDate.setHours(0, 0, 0, 0)
        return recordDate.getTime() === today.getTime()
      })

      if (todayRecord) {
        // Update the attendance document with arrival status
        await updateDoc(todayRecord.ref, {
          arrival_status: true,
          arrival_time: new Date(),
        })

        console.log('✅ Arrival status updated successfully')

        // Refresh pickup status to show the updated data
        await fetchTodaysPickupStatus()
      } else {
        console.log('⚠️ No attendance record found for today')
      }
    } catch (error) {
      console.error('❌ Error updating arrival status:', error)
    }
  }

  // Handle pickup confirmation (Child Picked Up slider)
  const handlePickupConfirmed = async (studentId: string, studentName: string) => {
    try {
      console.log(`👋 Updating pickup status for ${studentName}`)

      // Find today's attendance document for this student
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const studentRef = doc(db, 'students', studentId)
      const attendanceQuery = query(
        collection(db, 'attendance'),
        where('student_ref', '==', studentRef)
      )
      const attendanceSnapshot = await getDocs(attendanceQuery)

      // Find today's record
      const todayRecord = attendanceSnapshot.docs.find((docSnap) => {
        const data = docSnap.data() as Attendance
        let recordDate: Date

        if (data.date instanceof Timestamp) {
          recordDate = data.date.toDate()
        } else if (data.date instanceof Date) {
          recordDate = data.date
        } else if (typeof data.date === 'object' && (data.date as any).seconds) {
          recordDate = new Date((data.date as any).seconds * 1000)
        } else {
          return false
        }

        recordDate.setHours(0, 0, 0, 0)
        return recordDate.getTime() === today.getTime()
      })

      if (todayRecord) {
        // Update the attendance document with pickup status
        await updateDoc(todayRecord.ref, {
          pickup_status: true,
          pickup_time: new Date(),
        })

        console.log('✅ Pickup status updated successfully')

        // Refresh pickup status to show the updated data
        await fetchTodaysPickupStatus()
      } else {
        console.log('⚠️ No attendance record found for today')
      }
    } catch (error) {
      console.error('❌ Error updating pickup status:', error)
    }
  }

  // Helper to determine status based on attendance data
  const determinePickupStatus = (
    attendanceStatus: boolean,
    arrivalStatus?: boolean,
    pickupStatus?: boolean
  ): StudentPickupStatus['status'] => {
    if (!attendanceStatus) return 'not-attending'
    if (pickupStatus) return 'picked-up'
    if (arrivalStatus) return 'waiting-pickup'
    return 'in-class'
  }

  // Helper to get status color
  const getStatusColor = (status: StudentPickupStatus['status']) => {
    switch (status) {
      case 'not-attending':
        return Colors.neutral[400]
      case 'in-class':
        return Colors.info.main
      case 'waiting-pickup':
        return Colors.warning.main
      case 'picked-up':
        return Colors.success.main
      default:
        return Colors.neutral[400]
    }
  }

  // Helper to get status label
  const getStatusLabel = (status: StudentPickupStatus['status']) => {
    switch (status) {
      case 'not-attending':
        return 'Not Attending'
      case 'in-class':
        return 'In Class'
      case 'waiting-pickup':
        return 'Waiting for Pickup'
      case 'picked-up':
        return 'Picked Up'
      default:
        return 'Unknown'
    }
  }

  // Fetch today's pickup status for all students
  const fetchTodaysPickupStatus = async () => {
    try {
      setLoadingPickupStatus(true)
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.log('❌ No authenticated user')
        setStudentsPickupStatus([])
        return
      }

      // Get today's date range (start and end of day)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const endOfDay = new Date()
      endOfDay.setHours(23, 59, 59, 999)

      // Fetch all students for this parent
      const userRef = doc(db, 'users', currentUser.uid)
      const studentsQuery = query(
        collection(db, 'students'),
        where('guardian', '==', userRef)
      )
      const studentsSnapshot = await getDocs(studentsQuery)

      if (studentsSnapshot.empty) {
        console.log('ℹ️ No children found for this parent')
        setStudentsPickupStatus([])
        return
      }

      // For each student, fetch today's attendance
      const pickupStatusData: StudentPickupStatus[] = await Promise.all(
        studentsSnapshot.docs.map(async (studentDoc) => {
          const studentData = studentDoc.data() as Student
          const studentId = studentDoc.id
          const studentName = studentData.name

          // Fetch today's attendance record
          const attendanceQuery = query(
            collection(db, 'attendance'),
            where('student_ref', '==', studentDoc.ref)
          )
          const attendanceSnapshot = await getDocs(attendanceQuery)

          // Find today's record
          const todayRecord = attendanceSnapshot.docs.find((doc) => {
            const data = doc.data() as Attendance
            let recordDate: Date

            if (data.date instanceof Timestamp) {
              recordDate = data.date.toDate()
            } else if (data.date instanceof Date) {
              recordDate = data.date
            } else if (typeof data.date === 'object' && (data.date as any).seconds) {
              recordDate = new Date((data.date as any).seconds * 1000)
            } else {
              return false
            }

            recordDate.setHours(0, 0, 0, 0)
            return recordDate.getTime() === today.getTime()
          })

          const todayAttendance = todayRecord ? (todayRecord.data() as Attendance) : null

          // Determine status
          const attendanceStatus = todayAttendance?.attendance_status ?? false
          const arrivalStatus = todayAttendance?.arrival_status
          const pickupStatusValue = todayAttendance?.pickup_status
          const status = determinePickupStatus(attendanceStatus, arrivalStatus, pickupStatusValue)

          // Get last update time
          let lastUpdate: string | undefined
          if (todayAttendance) {
            if (pickupStatusValue && todayAttendance.pickup_time) {
              const pickupTime = todayAttendance.pickup_time instanceof Timestamp
                ? todayAttendance.pickup_time.toDate()
                : todayAttendance.pickup_time
              lastUpdate = pickupTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            } else if (arrivalStatus && todayAttendance.arrival_time) {
              const arrivalTime = todayAttendance.arrival_time instanceof Timestamp
                ? todayAttendance.arrival_time.toDate()
                : todayAttendance.arrival_time
              lastUpdate = arrivalTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
            }
          }

          return {
            studentId,
            studentName,
            status,
            lastUpdate,
            attendanceStatus,
            arrivalStatus,
            pickupStatus: pickupStatusValue,
          }
        })
      )

      console.log('✅ Fetched pickup status for', pickupStatusData.length, 'students')
      setStudentsPickupStatus(pickupStatusData)
    } catch (error) {
      console.error('❌ Error fetching pickup status:', error)
      setStudentsPickupStatus([])
    } finally {
      setLoadingPickupStatus(false)
    }
  }

  // Fetch children and their weekly attendance from Firestore
  const fetchChildrenAttendance = async () => {
    try {
      setLoadingAttendance(true)
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.log('❌ No authenticated user')
        setChildrenAttendance([])
        return
      }

      // Step 1: Fetch all students (children) where guardian matches current user
      const userRef = doc(db, 'users', currentUser.uid)
      const studentsQuery = query(
        collection(db, 'students'),
        where('guardian', '==', userRef)
      )
      const studentsSnapshot = await getDocs(studentsQuery)

      if (studentsSnapshot.empty) {
        console.log('ℹ️ No children found for this parent')
        setChildrenAttendance([])
        return
      }

      // Step 2: For each student, fetch their weekly attendance
      const childrenData: ChildAttendanceData[] = await Promise.all(
        studentsSnapshot.docs.map(async (studentDoc) => {
          const studentData = studentDoc.data() as Student
          const childId = studentDoc.id
          const childName = studentData.name

          // Fetch attendance records for this student
          const attendanceQuery = query(
            collection(db, 'attendance'),
            where('student_ref', '==', studentDoc.ref)
          )
          const attendanceSnapshot = await getDocs(attendanceQuery)

          // Convert to AttendanceRecord format (ProgressCard will handle week filtering)
          const attendanceRecords = attendanceSnapshot.docs
            .map((doc) => {
              const data = doc.data() as Attendance
              let date: Date

              // Handle Firestore Timestamp conversion
              if (data.date instanceof Timestamp) {
                date = data.date.toDate()
              } else if (data.date instanceof Date) {
                date = data.date
              } else if (typeof data.date === 'object' && (data.date as any).seconds) {
                date = new Date((data.date as any).seconds * 1000)
              } else {
                return null
              }

              return {
                date,
                present: data.attendance_status,
              }
            })
            .filter((record): record is { date: Date; present: boolean } => record !== null)

          return {
            childId,
            childName,
            attendanceRecords,
          }
        })
      )

      console.log('✅ Fetched attendance for', childrenData.length, 'children')
      setChildrenAttendance(childrenData)
    } catch (error) {
      console.error('❌ Error fetching children attendance:', error)
      setChildrenAttendance([])
    } finally {
      setLoadingAttendance(false)
    }
  }

  // Fetch on mount and when screen comes into focus
  useEffect(() => {
    fetchChildrenAttendance()
    fetchTodaysPickupStatus()
  }, [])

  useFocusEffect(
    React.useCallback(() => {
      fetchChildrenAttendance()
      fetchTodaysPickupStatus()
    }, [])
  )



  return (
    <SafeAreaView style={styles.container}>
        <Header onAvatarPress={handleAvatarPress} />
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.welcomeText}>Welcome back, Erin!</Text>
        <Text style={styles.dashboardTitle}>Dashboard</Text>

        {loadingAttendance ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            <Text style={styles.loadingText}>Loading attendance...</Text>
          </View>
        ) : childrenAttendance.length > 0 ? (
          <ProgressCard
            title="Weekly Attendance Progress"
            childrenAttendance={childrenAttendance}
            backgroundColor="#E3F2FD"
            onMoreInfoPress={() => navigation.navigate('AttendanceProgress')}
            currentIndex={currentChildIndex}
            onIndexChange={setCurrentChildIndex}
          />
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No attendance data available</Text>
            <Text style={styles.noDataSubtext}>Check back later for updates</Text>
          </View>
        )}

        <Text style={styles.sectionTitle}>Today's Pickup</Text>

        {loadingPickupStatus ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            <Text style={styles.loadingText}>Loading pickup status...</Text>
          </View>
        ) : studentsPickupStatus.length > 0 ? (
          (() => {
            // Get the current student based on the synchronized index
            const currentStudent = studentsPickupStatus[currentChildIndex]

            if (!currentStudent) {
              return (
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No pickup information</Text>
                  <Text style={styles.noDataSubtext}>Select a student to view pickup status</Text>
                </View>
              )
            }

            return (
              <View style={styles.pickupBox}>
                {/* Student Name */}
                <Text style={styles.studentPickupName}>{currentStudent.studentName}</Text>

                {/* Status Badge */}
                <View style={styles.statusBadge}>
                  <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(currentStudent.status) }]} />
                  <View style={styles.statusTextContainer}>
                    <Text style={styles.statusLabel}>Status</Text>
                    <Text style={[styles.pickupStatusText, { color: getStatusColor(currentStudent.status) }]}>
                      {getStatusLabel(currentStudent.status)}
                    </Text>
                  </View>
                </View>

                {/* Last Update Time */}
                {currentStudent.lastUpdate && (
                  <View style={styles.updateTimeContainer}>
                    <Text style={styles.updateLabel}>Last Updated</Text>
                    <Text style={styles.lastUpdate}>{currentStudent.lastUpdate}</Text>
                  </View>
                )}

                {/* Show sliders only for students who are attending */}
                {currentStudent.attendanceStatus && (
                  <>
                    <View style={styles.divider} />
                    <Text style={styles.notifyTeachersTitle}>Notify Teachers</Text>
                    <View style={styles.sliderContainer}>
                      <Slider
                        variant="primary"
                        label="I've Arrived"
                        popupTitle="Arrival Confirmed!"
                        popupDescription={`Teacher has been notified that you've arrived for ${currentStudent.studentName}.`}
                        onComplete={() => handleArrivalConfirmed(currentStudent.studentId, currentStudent.studentName)}
                      />
                      <Slider
                        variant="secondary"
                        label="Child Picked Up"
                        popupTitle="Pickup Complete!"
                        popupDescription={`Thank you for confirming. ${currentStudent.studentName} has been safely picked up.`}
                        onComplete={() => handlePickupConfirmed(currentStudent.studentId, currentStudent.studentName)}
                      />
                    </View>
                  </>
                )}
              </View>
            )
          })()
        ) : (
          <View style={styles.noDataContainer}>
            <Text style={styles.noDataText}>No pickup information</Text>
            <Text style={styles.noDataSubtext}>No students registered</Text>
          </View>
        )}

        <NavigationCard
          label='Manage Pickup'
          subheading='Manage People That Allow for Pickup'
          iconName='users'
          iconColor='#5B5D9E'
          backgroundColor='#EDE6FC'
          onPress={() => navigation.navigate('People')}
        />

        <NavigationCard
          label='Newsfeed'
          subheading='Checkout all the published news'
          iconName='newspaper-o'
          iconColor='#42A5F5'
          backgroundColor='#E3F2FD'
          onPress={() => navigation.navigate('News')}
        />
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: Spacing.md,
  },
  welcomeText: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: '400',
    color: Colors.black,
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    backgroundColor: '#E3F2FD',
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginTop: Spacing.sm,
  },
  noDataContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 16,
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 100,
  },
  noDataText: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 4,
  },
  noDataSubtext: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pickupBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginBottom: Spacing.md,
  },
  studentPickupName: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: '700',
    color: Colors.neutral[800],
    marginBottom: Spacing.xs,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  pickupStatus: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  pickupStatusText: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  updateTimeContainer: {
    backgroundColor: '#F8F9FA',
    padding: Spacing.sm,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  lastUpdate: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.neutral[700],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xs,
  },
  notifyTeachersTitle: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  sliderContainer: {
    gap: Spacing.md,
  },
})

export {Dashboard}