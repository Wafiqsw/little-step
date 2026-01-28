import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useMemo, useState, useEffect } from 'react'
import { Header, DateCard, AttendanceSummaryCard, AttendanceCard } from '../../components'
import { SelectedDateProvider, useSelectedDate } from '../../hooks'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { isSameDay } from '../../utils'
import type { AttendanceStatus } from '../../components/AttendanceCard'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'
import { db } from '../../firebase'
import { Timestamp, doc, where } from 'firebase/firestore'
import { getAllDataWithCache, queryWithCache, updateDataWithCache, createDataWithCache } from '../../firebase/firestoreWithCache'
import type { Attendance } from '../../types/Attendance'

type DashboardNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'ParentTabNavigator'>

type StudentData = {
  id: string
  name: string
  dateRegistered: Date
}

type AttendanceRecord = {
  studentId: string
  date: Date
  attendance_status: boolean
  arrival_time?: Date
}

const DashboardContent = () => {
  const navigation = useNavigation<DashboardNavigationProp>()
  const { selectedDate } = useSelectedDate()

  const [students, setStudents] = useState<StudentData[]>([])
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([])
  const [loading, setLoading] = useState(true)

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Fetch students from Firestore using cache
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        // Fetch all students using cache
        const studentsData = await getAllDataWithCache('students', { useCache: true })

        const students: StudentData[] = studentsData.map(student => {
          // TODO: Add registration date field to Student type
          // For now, use a default date (beginning of school year)
          const defaultDate = new Date('2025-01-01')

          return {
            id: student.id,
            name: student.name || 'Unknown Student',
            dateRegistered: defaultDate
          }
        })

        setStudents(students)
      } catch (error) {
        console.error('Error fetching students:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStudents()
  }, [])

  // Fetch attendance records for selected date using cache
  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const selectedDateOnly = new Date(selectedDate)
        selectedDateOnly.setHours(0, 0, 0, 0)

        const nextDay = new Date(selectedDateOnly)
        nextDay.setDate(nextDay.getDate() + 1)

        const attendanceData = await queryWithCache(
          'attendance',
          [
            where('date', '>=', Timestamp.fromDate(selectedDateOnly)),
            where('date', '<', Timestamp.fromDate(nextDay))
          ],
          `attendance:date:${selectedDateOnly.toISOString()}`,
          { useCache: true }
        )

        const attendanceRecords: AttendanceRecord[] = attendanceData.map(data => {
          // Extract student ID from student_ref DocumentReference
          const studentId = data.student_ref?.id || ''

          return {
            studentId,
            date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
            attendance_status: data.attendance_status,
            arrival_time: data.arrival_time instanceof Timestamp
              ? data.arrival_time.toDate()
              : data.arrival_time ? new Date(data.arrival_time) : undefined
          }
        })

        setAttendanceRecords(attendanceRecords)
      } catch (error) {
        console.error('Error fetching attendance:', error)
      }
    }

    if (students.length > 0) {
      fetchAttendance()
    }
  }, [selectedDate, students])

  // Handle attendance card click - toggle between present/absent
  const handleAttendanceClick = async (studentId: string, currentStatus: AttendanceStatus) => {
    try {
      const selectedDateOnly = new Date(selectedDate)
      selectedDateOnly.setHours(0, 0, 0, 0)

      // Don't allow marking future dates
      if (selectedDateOnly > today) {
        console.log('Cannot mark attendance for future dates')
        return
      }

      // Toggle status: pending/absent -> present, present -> absent
      const newStatus = currentStatus === 'present' ? false : true
      const now = new Date()

      // Find existing attendance record
      const existingRecord = attendanceRecords.find(r => r.studentId === studentId)

      if (existingRecord) {
        // Update existing record using cache
        const attendanceData = await queryWithCache(
          'attendance',
          [
            where('date', '>=', Timestamp.fromDate(selectedDateOnly)),
            where('date', '<', Timestamp.fromDate(new Date(selectedDateOnly.getTime() + 86400000)))
          ],
          `attendance:date:${selectedDateOnly.toISOString()}`,
          { useCache: true, forceRefresh: true }
        )
        const docToUpdate = attendanceData.find(data => data.student_ref?.id === studentId)

        if (docToUpdate) {
          await updateDataWithCache('attendance', docToUpdate.id, {
            attendance_status: newStatus
          })
        }
      } else {
        // Create new attendance record using cache
        const studentRef = doc(db, 'students', studentId)

        await createDataWithCache('attendance', {
          date: Timestamp.fromDate(selectedDateOnly),
          attendance_status: newStatus,
          student_ref: studentRef
        })
      }

      // Refresh attendance data using cache
      const nextDay = new Date(selectedDateOnly)
      nextDay.setDate(nextDay.getDate() + 1)

      const refreshedData = await queryWithCache(
        'attendance',
        [
          where('date', '>=', Timestamp.fromDate(selectedDateOnly)),
          where('date', '<', Timestamp.fromDate(nextDay))
        ],
        `attendance:date:${selectedDateOnly.toISOString()}`,
        { useCache: true, forceRefresh: true }
      )

      const attendanceData: AttendanceRecord[] = refreshedData.map(data => {
        const studentId = data.student_ref?.id || ''

        return {
          studentId,
          date: data.date instanceof Timestamp ? data.date.toDate() : new Date(data.date),
          attendance_status: data.attendance_status,
          arrival_time: data.arrival_time instanceof Timestamp
            ? data.arrival_time.toDate()
            : data.arrival_time ? new Date(data.arrival_time) : undefined
        }
      })

      setAttendanceRecords(attendanceData)
    } catch (error) {
      console.error('Error updating attendance:', error)
    }
  }

  // Compute students with attendance data for the selected date
  const studentsWithAttendance = useMemo(() => {
    const selectedDateOnly = new Date(selectedDate)
    selectedDateOnly.setHours(0, 0, 0, 0)

    return students.map(student => {
      // Check if selected date is before student joined
      const studentJoinDate = new Date(student.dateRegistered)
      studentJoinDate.setHours(0, 0, 0, 0)

      if (selectedDateOnly < studentJoinDate) {
        return {
          id: student.id,
          name: student.name,
          status: 'pending' as AttendanceStatus,
          time: undefined,
          note: 'Not yet enrolled'
        }
      }

      // Find attendance record for this student on selected date
      const record = attendanceRecords.find(
        r => r.studentId === student.id && isSameDay(r.date, selectedDateOnly)
      )

      // Determine status based on date and record
      let status: AttendanceStatus
      let time: string | undefined

      if (selectedDateOnly > today) {
        // Future date - no record yet
        status = 'pending'
        time = undefined
      } else if (selectedDateOnly < today) {
        // Past date
        if (!record || !record.attendance_status) {
          // No record or status is false = Absent
          status = 'absent'
          time = undefined
        } else {
          // Has record and status is true = Present
          status = 'present'
          time = record.arrival_time?.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        }
      } else {
        // Today
        if (!record) {
          // No record yet
          status = 'pending'
          time = undefined
        } else if (record.attendance_status) {
          // Present
          status = 'present'
          time = record.arrival_time?.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
          })
        } else {
          // Absent
          status = 'absent'
          time = undefined
        }
      }

      return {
        id: student.id,
        name: student.name,
        status,
        time
      }
    })
  }, [selectedDate, today, students, attendanceRecords])

  // Determine the title based on selected date
  const getAttendanceTitle = () => {
    if (isSameDay(selectedDate, today)) {
      return "Today's Attendance"
    } else {
      const dateStr = selectedDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: selectedDate.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      })
      return `Attendance for ${dateStr}`
    }
  }

  // Calculate attendance summary based on filtered data
  const presentCount = studentsWithAttendance.filter(s => s.status === 'present').length
  const absentCount = studentsWithAttendance.filter(s => s.status === 'absent').length

  return (
    <View style={styles.container}>
      <Header onAvatarPress={handleAvatarPress} />
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
          <Text style={styles.loadingText}>Loading students...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Teacher Info Section */}
          <View style={styles.teacherSection}>
            <Text style={styles.teacherName}>Teacher Dashboard</Text>
            <Text style={styles.teacherClass}>My Class</Text>
          </View>

          {/* Date Card */}
          <DateCard />

          {/* Attendance Title */}
          <Text style={styles.attendanceTitle}>{getAttendanceTitle()}</Text>

          {/* Attendance Summary Cards */}
          <View style={styles.summaryContainer}>
            <AttendanceSummaryCard
              variant="present"
              total={presentCount}
              containerStyle={styles.summaryCard}
            />
            <AttendanceSummaryCard
              variant="absent"
              total={absentCount}
              containerStyle={styles.summaryCard}
            />
          </View>

          {/* Attendance List */}
          <View style={styles.attendanceList}>
            {studentsWithAttendance.map((student) => (
              <AttendanceCard
                key={student.id}
                name={student.name}
                status={student.status}
                time={student.time}
                containerStyle={styles.attendanceCard}
                onPress={() => handleAttendanceClick(student.id, student.status)}
              />
            ))}
          </View>
        </ScrollView>
      )}
    </View>
  )
}

const Dashboard = () => {
  return (
    <SelectedDateProvider>
      <DashboardContent />
    </SelectedDateProvider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  teacherSection: {
    marginTop: Spacing.sm,
    marginBottom: Spacing.md,
  },
  teacherName: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  teacherClass: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight as any,
    color: Colors.text.secondary,
  },
  attendanceTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.text.primary,
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  summaryContainer: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  summaryCard: {
    flex: 1,
  },
  attendanceList: {
    gap: Spacing.sm,
  },
  attendanceCard: {
    marginBottom: 0,
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

export { Dashboard }