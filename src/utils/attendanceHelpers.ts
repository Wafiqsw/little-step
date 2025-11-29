/**
 * Attendance calculation utilities
 */

import { AttendanceRecord } from '../components/ProgressCard'
import { isDateInWeekRange, WeekRange, isWeekday, isSameDay } from './dateHelpers'

export interface WeeklyAttendanceData {
  weekRange: WeekRange
  totalDays: number
  presentDays: number
  absentDays: number
  percentage: number
  records: AttendanceRecord[]
}

/**
 * Calculate attendance statistics for a specific week
 * @param allRecords - All attendance records
 * @param weekRange - Week range to calculate for
 * @returns WeeklyAttendanceData
 */
export const calculateWeeklyAttendance = (
  allRecords: AttendanceRecord[],
  weekRange: WeekRange
): WeeklyAttendanceData => {
  // Filter records to only include this week
  const weekRecords = allRecords.filter(record =>
    isDateInWeekRange(record.date, weekRange)
  )

  const presentDays = weekRecords.filter(r => r.present).length
  const totalDays = weekRecords.length
  const absentDays = totalDays - presentDays
  const percentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0

  return {
    weekRange,
    totalDays,
    presentDays,
    absentDays,
    percentage,
    records: weekRecords,
  }
}

/**
 * Get attendance status for a specific date
 * @param date - Date to check
 * @param records - All attendance records
 * @returns 'present' | 'absent' | 'no-record'
 */
export const getAttendanceStatus = (
  date: Date,
  records: AttendanceRecord[]
): 'present' | 'absent' | 'no-record' => {
  const record = records.find(r => isSameDay(r.date, date))

  if (!record) return 'no-record'
  return record.present ? 'present' : 'absent'
}

/**
 * Check if a date should be counted in attendance percentage
 * (typically only weekdays)
 * @param date - Date to check
 * @returns boolean
 */
export const shouldCountInPercentage = (date: Date): boolean => {
  return isWeekday(date)
}
