/**
 * Date utility functions for handling week calculations and date ranges
 */

export interface WeekRange {
  start: Date
  end: Date
  weekNumber: number // 0 = current week, -1 = last week, -2 = 2 weeks ago, etc.
}

/**
 * Get the start (Monday) and end (Sunday) of a specific week
 * @param weeksOffset - Number of weeks to offset (0 = current week, -1 = last week, etc.)
 * @returns WeekRange object with start and end dates
 */
export const getWeekRange = (weeksOffset: number = 0): WeekRange => {
  const now = new Date()
  const dayOfWeek = now.getDay() // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

  // Calculate Monday of current week
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(now)
  monday.setDate(now.getDate() + mondayOffset + (weeksOffset * 7))
  monday.setHours(0, 0, 0, 0)

  // Calculate Sunday of that week
  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return {
    start: monday,
    end: sunday,
    weekNumber: weeksOffset,
  }
}

/**
 * Get the current week range (Monday to Sunday)
 */
export const getCurrentWeekRange = (): WeekRange => {
  return getWeekRange(0)
}

/**
 * Check if a date falls within a specific week range
 * @param date - Date to check
 * @param weekRange - Week range to check against
 * @returns boolean
 */
export const isDateInWeekRange = (date: Date, weekRange: WeekRange): boolean => {
  const dateTime = date.getTime()
  return dateTime >= weekRange.start.getTime() && dateTime <= weekRange.end.getTime()
}

/**
 * Check if a date is within the current week
 * @param date - Date to check
 * @returns boolean
 */
export const isDateInCurrentWeek = (date: Date): boolean => {
  const currentWeek = getCurrentWeekRange()
  return isDateInWeekRange(date, currentWeek)
}

/**
 * Get an array of all days in a week (Monday to Sunday)
 * @param weekRange - Week range to get days for
 * @returns Array of dates
 */
export const getDaysInWeek = (weekRange: WeekRange): Date[] => {
  const days: Date[] = []
  const currentDate = new Date(weekRange.start)

  for (let i = 0; i < 7; i++) {
    days.push(new Date(currentDate))
    currentDate.setDate(currentDate.getDate() + 1)
  }

  return days
}

/**
 * Format a date as "Mon", "Tue", etc.
 * @param date - Date to format
 * @returns Abbreviated day name
 */
export const formatDayName = (date: Date): string => {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  return days[date.getDay()]
}

/**
 * Format a date as day number (1-31)
 * @param date - Date to format
 * @returns Day number as string
 */
export const formatDayNumber = (date: Date): string => {
  return date.getDate().toString().padStart(2, '0')
}

/**
 * Format a date as "Nov", "Dec", etc.
 * @param date - Date to format
 * @returns Abbreviated month name
 */
export const formatMonthName = (date: Date): string => {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return months[date.getMonth()]
}

/**
 * Format a date range as "Nov 25 - Dec 01" or "Nov 25 - 29" if same month
 * @param weekRange - Week range to format
 * @returns Formatted date range string
 */
export const formatWeekRange = (weekRange: WeekRange): string => {
  const startMonth = formatMonthName(weekRange.start)
  const endMonth = formatMonthName(weekRange.end)
  const startDay = weekRange.start.getDate()
  const endDay = weekRange.end.getDate()

  if (startMonth === endMonth) {
    return `${startMonth} ${startDay} - ${endDay}`
  } else {
    return `${startMonth} ${startDay} - ${endMonth} ${endDay}`
  }
}

/**
 * Check if a date is a weekend (Saturday or Sunday)
 * @param date - Date to check
 * @returns boolean
 */
export const isWeekend = (date: Date): boolean => {
  const day = date.getDay()
  return day === 0 || day === 6
}

/**
 * Check if a date is a weekday (Monday to Friday)
 * @param date - Date to check
 * @returns boolean
 */
export const isWeekday = (date: Date): boolean => {
  return !isWeekend(date)
}

/**
 * Get the year for a date
 * @param date - Date to get year from
 * @returns Year as number
 */
export const getYear = (date: Date): number => {
  return date.getFullYear()
}

/**
 * Compare if two dates are the same day (ignoring time)
 * @param date1 - First date
 * @param date2 - Second date
 * @returns boolean
 */
export const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  )
}
