import { AttendanceRecord } from '../components/ProgressCard'
import { getWeekRange, getDaysInWeek, isWeekday } from '../utils'

// Helper function to create a date for a specific day offset from today
const createDate = (daysOffset: number): Date => {
  const date = new Date()
  date.setDate(date.getDate() + daysOffset)
  date.setHours(9, 0, 0, 0) // Set to 9 AM for consistency
  return date
}

/**
 * Generate attendance records for a specific week
 * @param weeksOffset - Number of weeks from current (0 = current, -1 = last week, -2 = 2 weeks ago)
 * @param attendancePattern - Optional array of booleans for each weekday (Mon-Fri), defaults to all present
 * @returns Array of AttendanceRecord
 */
export const generateWeekAttendance = (
  weeksOffset: number = 0,
  attendancePattern?: boolean[]
): AttendanceRecord[] => {
  const weekRange = getWeekRange(weeksOffset)
  const daysInWeek = getDaysInWeek(weekRange)
  const attendance: AttendanceRecord[] = []

  // Default pattern: all weekdays present
  const defaultPattern = [true, true, true, true, true] // Mon-Fri

  let weekdayIndex = 0
  daysInWeek.forEach(date => {
    if (isWeekday(date)) {
      const pattern = attendancePattern || defaultPattern
      const present = pattern[weekdayIndex % pattern.length]

      // Only add records up to today if it's the current week
      if (weeksOffset === 0) {
        const today = new Date()
        if (date <= today) {
          attendance.push({ date, present })
        }
      } else {
        attendance.push({ date, present })
      }

      weekdayIndex++
    }
  })

  return attendance
}

/**
 * Generate attendance for the last 3 weeks including current week
 * You can customize attendance patterns for each week
 */
export const generateLast3WeeksAttendance = (): AttendanceRecord[] => {
  return [
    // 2 weeks ago - Good attendance (4 out of 5 days)
    ...generateWeekAttendance(-2, [true, true, true, false, true]),

    // Last week - Perfect attendance
    ...generateWeekAttendance(-1, [true, true, true, true, true]),

    // Current week - Mixed attendance (only up to today)
    ...generateWeekAttendance(0, [true, true, false, true, true]),
  ]
}

// Mock attendance data with realistic 3 weeks of data
export const mockAttendanceRecords: AttendanceRecord[] = generateLast3WeeksAttendance()

// Alternative scenarios for testing
export const mockAttendancePerfect3Weeks: AttendanceRecord[] = [
  ...generateWeekAttendance(-2, [true, true, true, true, true]),
  ...generateWeekAttendance(-1, [true, true, true, true, true]),
  ...generateWeekAttendance(0, [true, true, true, true, true]),
]

export const mockAttendancePoor3Weeks: AttendanceRecord[] = [
  ...generateWeekAttendance(-2, [false, true, false, true, false]),
  ...generateWeekAttendance(-1, [true, false, false, true, false]),
  ...generateWeekAttendance(0, [false, false, true, false, true]),
]
