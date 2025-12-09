import React, { useState } from 'react'
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { getCurrentWeekRange, getDaysInWeek, isWeekday } from '../utils'

export interface AttendanceRecord {
  date: Date
  present: boolean
}

export interface ChildAttendanceData {
  childId: string
  childName: string
  attendanceRecords: AttendanceRecord[]
}

export interface ProgressCardProps {
  title: string
  percentage?: number // Optional now - can be calculated from attendance
  attendanceRecords?: AttendanceRecord[] // For single child (backward compatibility)
  childrenAttendance?: ChildAttendanceData[] // For multiple children
  containerStyle?: ViewStyle
  backgroundColor?: string
  onMoreInfoPress?: () => void
  currentIndex?: number // External control of current child index
  onIndexChange?: (index: number) => void // Callback when index changes
}

// Calculate attendance percentage for current week (weekdays only)
const calculateWeeklyAttendance = (records: AttendanceRecord[]): number => {
  // Get all weekdays in the current week (Mon-Fri)
  const currentWeek = getCurrentWeekRange()
  const allDaysInWeek = getDaysInWeek(currentWeek)
  const weekdaysInWeek = allDaysInWeek.filter(day => isWeekday(day))

  // Get today to limit calculation to days that have passed
  const today = new Date()
  today.setHours(23, 59, 59, 999)

  // Only count weekdays up to today
  const relevantWeekdays = weekdaysInWeek.filter(day => day <= today)

  if (relevantWeekdays.length === 0) return 0

  // Count how many days the student was present
  let presentDays = 0

  relevantWeekdays.forEach(weekday => {
    // Check if there's an attendance record for this weekday
    const attendanceRecord = records.find(record => {
      const recordDate = new Date(record.date)
      recordDate.setHours(0, 0, 0, 0)
      const checkDate = new Date(weekday)
      checkDate.setHours(0, 0, 0, 0)
      return recordDate.getTime() === checkDate.getTime()
    })

    // If record exists and present is true, count it
    // If no record exists, it means absent (not counted)
    if (attendanceRecord && attendanceRecord.present) {
      presentDays++
    }
  })

  // Calculate percentage based on weekdays that have passed
  const percentage = (presentDays / relevantWeekdays.length) * 100

  return Math.round(percentage)
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  percentage,
  attendanceRecords,
  childrenAttendance,
  containerStyle,
  backgroundColor = '#E3F2FD',
  onMoreInfoPress,
  currentIndex,
  onIndexChange,
}) => {
  const [internalIndex, setInternalIndex] = useState(0)

  // Use external index if provided, otherwise use internal
  const currentChildIndex = currentIndex !== undefined ? currentIndex : internalIndex

  // Determine if we're showing multiple children or single child
  const isMultipleChildren = childrenAttendance && childrenAttendance.length > 0
  const hasMultipleChildren = childrenAttendance && childrenAttendance.length > 1

  // Get current child data
  const currentChild = isMultipleChildren ? childrenAttendance[currentChildIndex] : null
  const currentAttendance = currentChild?.attendanceRecords || attendanceRecords

  // Calculate percentage from attendance records if provided, otherwise use prop
  const calculatedPercentage = currentAttendance
    ? calculateWeeklyAttendance(currentAttendance)
    : (percentage ?? 0)

  const radius = 35
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (calculatedPercentage / 100) * circumference

  const handlePrevious = () => {
    if (childrenAttendance && currentChildIndex > 0) {
      const newIndex = currentChildIndex - 1
      if (onIndexChange) {
        onIndexChange(newIndex)
      } else {
        setInternalIndex(newIndex)
      }
    }
  }

  const handleNext = () => {
    if (childrenAttendance && currentChildIndex < childrenAttendance.length - 1) {
      const newIndex = currentChildIndex + 1
      if (onIndexChange) {
        onIndexChange(newIndex)
      } else {
        setInternalIndex(newIndex)
      }
    }
  }

  return (
    <View
      style={[styles.container, { backgroundColor }, containerStyle]}
    >
      {/* Left side: Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>

        {/* Child name and navigation for multiple children */}
        {isMultipleChildren && (
          <View style={styles.childNavigationContainer}>
            {hasMultipleChildren && (
              <TouchableOpacity
                onPress={handlePrevious}
                disabled={currentChildIndex === 0}
                style={styles.navButton}
              >
                <Icon
                  name="chevron-left"
                  size={14}
                  color={currentChildIndex === 0 ? Colors.neutral[300] : Colors.neutral[700]}
                />
              </TouchableOpacity>
            )}

            <View style={styles.childInfoContainer}>
              <Text style={styles.childName}>{currentChild?.childName}</Text>
              {hasMultipleChildren && (
                <Text style={styles.childCounter}>
                  {currentChildIndex + 1} of {childrenAttendance.length}
                </Text>
              )}
            </View>

            {hasMultipleChildren && (
              <TouchableOpacity
                onPress={handleNext}
                disabled={currentChildIndex === childrenAttendance.length - 1}
                style={styles.navButton}
              >
                <Icon
                  name="chevron-right"
                  size={14}
                  color={currentChildIndex === childrenAttendance.length - 1 ? Colors.neutral[300] : Colors.neutral[700]}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        <TouchableOpacity
          onPress={onMoreInfoPress}
          style={styles.moreInfoContainer}
          activeOpacity={0.7}
        >
          <Text style={styles.moreInfoText}>more info</Text>
          <Icon name="play" size={10} color="#42A5F5" />
        </TouchableOpacity>
      </View>

      {/* Right side: Circular progress */}
      <View style={styles.progressContainer}>
        <Svg width={80} height={80}>
          {/* Inner circle background fill */}
          <Circle
            cx={40}
            cy={40}
            r={radius}
            fill="#EDE6FC"
          />
          {/* Progress circle - only shows the completed portion */}
          <Circle
            cx={40}
            cy={40}
            r={radius}
            stroke="#5B5D9E"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 40 40)`}
          />
        </Svg>
        <View style={styles.percentageContainer}>
          <Text style={styles.percentageText}>{calculatedPercentage}%</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    minHeight: 100,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
    lineHeight: 28,
    marginBottom: 4,
  },
  childNavigationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginVertical: 4,
  },
  navButton: {
    padding: 4,
  },
  childInfoContainer: {
    flex: 1,
  },
  childName: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.neutral[800],
    marginBottom: 2,
  },
  childCounter: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  moreInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  moreInfoText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: 'bold',
    color: '#42A5F5',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageContainer: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentageText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#5B5D9E',
  },
})
