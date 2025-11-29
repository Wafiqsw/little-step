/**
 * Mock Student Attendance Data
 * Generates realistic attendance records for each student across different dates
 */

export type AttendanceStatus = 'present' | 'absent' | 'pending'

export interface StudentAttendanceRecord {
    studentId: string
    date: Date
    status: AttendanceStatus
    time?: string // Check-in time (only for present status)
    notes?: string
}

/**
 * Generate random but consistent attendance pattern for a student on a specific date
 * Uses a deterministic algorithm so the same student/date always produces the same result
 */
const getAttendanceForStudentOnDate = (
    studentId: string,
    date: Date
): { status: AttendanceStatus; time?: string } => {
    // Create a seed from studentId and date for deterministic randomness
    const dateStr = date.toISOString().split('T')[0]
    const seed = parseInt(studentId) * 1000 + date.getDate() * 100 + date.getMonth() * 10

    // Simple pseudo-random function based on seed
    const random = (Math.sin(seed) * 10000) % 1

    // 85% chance of being present (realistic attendance rate)
    const isPresent = random < 0.85

    if (!isPresent) {
        return { status: 'absent' }
    }

    // Generate check-in time between 7:30 AM and 8:30 AM
    const hourSeed = (seed * 7) % 60
    const minuteSeed = (seed * 13) % 60

    const hour = 7
    const minute = 30 + (minuteSeed % 60) // 7:30 - 8:30

    const formattedHour = minute >= 60 ? 8 : 7
    const formattedMinute = minute >= 60 ? minute - 60 : minute

    const time = `${formattedHour.toString().padStart(2, '0')}:${formattedMinute.toString().padStart(2, '0')} AM`

    return { status: 'present', time }
}

/**
 * Generate attendance records for all students for a date range
 * @param studentIds - Array of student IDs
 * @param startDaysAgo - How many days ago to start (e.g., 14 for 2 weeks ago)
 * @param endDaysAgo - How many days ago to end (e.g., 0 for today)
 * @returns Array of attendance records
 */
export const generateAttendanceRecords = (
    studentIds: string[],
    startDaysAgo: number = 14,
    endDaysAgo: number = 0
): StudentAttendanceRecord[] => {
    const records: StudentAttendanceRecord[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Generate records for each day in the range
    for (let daysAgo = startDaysAgo; daysAgo >= endDaysAgo; daysAgo--) {
        const date = new Date(today)
        date.setDate(today.getDate() - daysAgo)

        // Skip weekends (Saturday = 6, Sunday = 0)
        const dayOfWeek = date.getDay()
        if (dayOfWeek === 0 || dayOfWeek === 6) {
            continue
        }

        // Generate attendance for each student on this date
        studentIds.forEach(studentId => {
            const { status, time } = getAttendanceForStudentOnDate(studentId, date)

            records.push({
                studentId,
                date,
                status,
                time,
            })
        })
    }

    return records
}

/**
 * Generate mock attendance records for the past 14 days (2 weeks)
 * This will be used by the Dashboard component
 */
export const generateMockAttendanceRecords = (studentIds: string[]): StudentAttendanceRecord[] => {
    return generateAttendanceRecords(studentIds, 14, 0)
}

/**
 * Get attendance record for a specific student on a specific date
 */
export const getAttendanceRecord = (
    records: StudentAttendanceRecord[],
    studentId: string,
    date: Date
): StudentAttendanceRecord | undefined => {
    return records.find(record => {
        return (
            record.studentId === studentId &&
            record.date.getFullYear() === date.getFullYear() &&
            record.date.getMonth() === date.getMonth() &&
            record.date.getDate() === date.getDate()
        )
    })
}

/**
 * Get all attendance records for a specific date
 */
export const getAttendanceForDate = (
    records: StudentAttendanceRecord[],
    date: Date
): StudentAttendanceRecord[] => {
    return records.filter(record => {
        return (
            record.date.getFullYear() === date.getFullYear() &&
            record.date.getMonth() === date.getMonth() &&
            record.date.getDate() === date.getDate()
        )
    })
}

/**
 * Calculate attendance statistics for a date
 */
export const getAttendanceStats = (
    records: StudentAttendanceRecord[],
    date: Date
): { present: number; absent: number; total: number; percentage: number } => {
    const dateRecords = getAttendanceForDate(records, date)
    const present = dateRecords.filter(r => r.status === 'present').length
    const absent = dateRecords.filter(r => r.status === 'absent').length
    const total = dateRecords.length
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0

    return { present, absent, total, percentage }
}
