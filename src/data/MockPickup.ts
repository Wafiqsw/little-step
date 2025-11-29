/**
 * Mock Pickup Data
 * Tracks student pickup status for today
 */

export type PickupStatus = 'waiting' | 'dismissed'

export interface PickupRecord {
    studentId: string
    studentName: string
    guardianName: string
    guardianRelationship: string
    status: PickupStatus
    pickupTime?: string // Time when dismissed (only for dismissed status)
    hasArrived?: boolean // Whether parent has arrived (for waiting status)
}

/**
 * Generate mock pickup records for today
 * Some students waiting, some already dismissed
 */
export const mockPickupRecords: PickupRecord[] = [
    // Waiting for pickup
    {
        studentId: '1',
        studentName: 'Ahmad bin Ali',
        guardianName: 'Ali bin Hassan',
        guardianRelationship: 'Father',
        status: 'waiting',
        hasArrived: false,
    },
    {
        studentId: '3',
        studentName: 'Fatimah binti Hassan',
        guardianName: 'Hassan bin Ibrahim',
        guardianRelationship: 'Father',
        status: 'waiting',
        hasArrived: true, // Parent has arrived
    },
    {
        studentId: '5',
        studentName: 'Nurul Ain',
        guardianName: 'Ain binti Yusof',
        guardianRelationship: 'Mother',
        status: 'waiting',
        hasArrived: true, // Parent has arrived
    },
    {
        studentId: '7',
        studentName: 'Amir Danial',
        guardianName: 'Danial bin Omar',
        guardianRelationship: 'Father',
        status: 'waiting',
        hasArrived: false,
    },

    // Already dismissed
    {
        studentId: '2',
        studentName: 'Siti Nurhaliza',
        guardianName: 'Nurhaliza binti Ahmad',
        guardianRelationship: 'Mother',
        status: 'dismissed',
        pickupTime: '12:30 PM',
    },
    {
        studentId: '4',
        studentName: 'Muhammad Hakim',
        guardianName: 'Hakim bin Abdullah',
        guardianRelationship: 'Father',
        status: 'dismissed',
        pickupTime: '12:45 PM',
    },
    {
        studentId: '6',
        studentName: 'Zainab Karim',
        guardianName: 'Karim bin Ismail',
        guardianRelationship: 'Father',
        status: 'dismissed',
        pickupTime: '01:15 PM',
    },
    {
        studentId: '8',
        studentName: 'Aisyah Sofea',
        guardianName: 'Sofea binti Rahman',
        guardianRelationship: 'Mother',
        status: 'dismissed',
        pickupTime: '01:30 PM',
    },
]

/**
 * Get students waiting for pickup
 */
export const getWaitingPickups = (): PickupRecord[] => {
    return mockPickupRecords.filter(record => record.status === 'waiting')
}

/**
 * Get students already dismissed
 */
export const getDismissedPickups = (): PickupRecord[] => {
    return mockPickupRecords.filter(record => record.status === 'dismissed')
}

/**
 * Get pickup counts
 */
export const getPickupCounts = (): { waiting: number; dismissed: number; total: number } => {
    const waiting = getWaitingPickups().length
    const dismissed = getDismissedPickups().length
    return {
        waiting,
        dismissed,
        total: waiting + dismissed,
    }
}
