/**
 * Mock Student Data
 * Students in Year 1 Amanah class
 */

export interface Student {
    id: string
    name: string
    guardianName?: string
    guardianPhone?: string
}

export const mockStudents: Student[] = [
    {
        id: '1',
        name: 'Ahmad bin Ali',
        guardianName: 'Ali bin Hassan',
        guardianPhone: '+60123456789',
    },
    {
        id: '2',
        name: 'Siti Nurhaliza',
        guardianName: 'Nurhaliza binti Ahmad',
        guardianPhone: '+60123456790',
    },
    {
        id: '3',
        name: 'Fatimah binti Hassan',
        guardianName: 'Hassan bin Ibrahim',
        guardianPhone: '+60123456791',
    },
    {
        id: '4',
        name: 'Muhammad Hakim',
        guardianName: 'Hakim bin Abdullah',
        guardianPhone: '+60123456792',
    },
    {
        id: '5',
        name: 'Nurul Ain',
        guardianName: 'Ain binti Yusof',
        guardianPhone: '+60123456793',
    },
    {
        id: '6',
        name: 'Zainab Karim',
        guardianName: 'Karim bin Ismail',
        guardianPhone: '+60123456794',
    },
    {
        id: '7',
        name: 'Amir Danial',
        guardianName: 'Danial bin Omar',
        guardianPhone: '+60123456795',
    },
    {
        id: '8',
        name: 'Aisyah Sofea',
        guardianName: 'Sofea binti Rahman',
        guardianPhone: '+60123456796',
    },
]
