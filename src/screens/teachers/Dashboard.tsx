import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, DateCard, AttendanceSummaryCard, AttendanceCard } from '../../components'
import { SelectedDateProvider, useSelectedDate } from '../../hooks'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { isSameDay } from '../../utils'
import type { AttendanceStatus } from '../../components/AttendanceCard'
import {
  mockStudents,
  mockTeacher,
  generateMockAttendanceRecords,
  type StudentAttendanceRecord
} from '../../data'

// Generate attendance records for all students
const mockAttendanceRecords: StudentAttendanceRecord[] = generateMockAttendanceRecords(
  mockStudents.map(s => s.id)
)

const DashboardContent = () => {
  const { selectedDate } = useSelectedDate()
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Compute students with attendance data for the selected date
  const studentsWithAttendance = useMemo(() => {
    // Check if selected date is in the future
    const isFutureDate = selectedDate > today

    return mockStudents.map(student => {
      if (isFutureDate) {
        return {
          ...student,
          status: 'pending' as AttendanceStatus,
          time: undefined
        }
      }

      // Find attendance record for this student on selected date
      const record = mockAttendanceRecords.find(
        r => r.studentId === student.id && isSameDay(r.date, selectedDate)
      )

      return {
        ...student,
        status: (record?.status || 'pending') as AttendanceStatus,
        time: record?.time
      }
    })
  }, [selectedDate])

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
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Teacher Info Section */}
        <View style={styles.teacherSection}>
          <Text style={styles.teacherName}>{mockTeacher.name}</Text>
          <Text style={styles.teacherClass}>{mockTeacher.class}</Text>
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
            />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
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
})

export { Dashboard }