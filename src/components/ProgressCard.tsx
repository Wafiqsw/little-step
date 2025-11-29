import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { isDateInCurrentWeek } from '../utils'

export interface AttendanceRecord {
  date: Date
  present: boolean
}

export interface ProgressCardProps {
  title: string
  percentage?: number // Optional now - can be calculated from attendance
  attendanceRecords?: AttendanceRecord[] // For weekly attendance calculation
  containerStyle?: ViewStyle
  backgroundColor?: string
  onMoreInfoPress?: () => void
}

// Calculate attendance percentage for current week
const calculateWeeklyAttendance = (records: AttendanceRecord[]): number => {
  if (!records || records.length === 0) return 0

  // Filter records to only include current week
  const currentWeekRecords = records.filter(record =>
    isDateInCurrentWeek(record.date)
  )

  if (currentWeekRecords.length === 0) return 0

  // Calculate percentage of days present
  const presentDays = currentWeekRecords.filter(record => record.present).length
  const percentage = (presentDays / currentWeekRecords.length) * 100

  return Math.round(percentage)
}

export const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  percentage,
  attendanceRecords,
  containerStyle,
  backgroundColor = '#E3F2FD',
  onMoreInfoPress,
}) => {
  // Calculate percentage from attendance records if provided, otherwise use prop
  const calculatedPercentage = attendanceRecords
    ? calculateWeeklyAttendance(attendanceRecords)
    : (percentage ?? 0)

  const radius = 35
  const strokeWidth = 8
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (calculatedPercentage / 100) * circumference

  return (
    <View
      style={[styles.container, { backgroundColor }, containerStyle]}
    >
      {/* Left side: Text */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
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
            rotation="-90"
            origin="40, 40"
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
