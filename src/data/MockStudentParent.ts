/**
 * Mock Student-Parent Data
 * Enhanced student data with parent information
 */

export interface Parent {
  id: number
  name: string
  phoneNumber: string
  email?: string
  hasAccount: boolean // Whether parent has registered their account
}

export interface StudentWithParent {
  id: number
  studentName: string
  studentId: string // e.g., "STU2025001"
  class: string
  age: number
  gender: 'male' | 'female'
  parentId: number
  parentName: string
  parentPhone: string
  parentHasAccount: boolean
  dateRegistered: string
}

export const mockParents: Parent[] = [
  {
    id: 1,
    name: 'Ali bin Hassan',
    phoneNumber: '+60123456789',
    email: 'ali.hassan@example.com',
    hasAccount: true,
  },
  {
    id: 2,
    name: 'Nurhaliza binti Ahmad',
    phoneNumber: '+60123456790',
    email: 'nurhaliza@example.com',
    hasAccount: true,
  },
  {
    id: 3,
    name: 'Hassan bin Ibrahim',
    phoneNumber: '+60123456791',
    hasAccount: false,
  },
  {
    id: 4,
    name: 'Hakim bin Abdullah',
    phoneNumber: '+60123456792',
    email: 'hakim.abdullah@example.com',
    hasAccount: true,
  },
  {
    id: 5,
    name: 'Ain binti Yusof',
    phoneNumber: '+60123456793',
    hasAccount: false,
  },
  {
    id: 6,
    name: 'Karim bin Ismail',
    phoneNumber: '+60123456794',
    email: 'karim.ismail@example.com',
    hasAccount: true,
  },
  {
    id: 7,
    name: 'Danial bin Omar',
    phoneNumber: '+60123456795',
    hasAccount: false,
  },
  {
    id: 8,
    name: 'Sofea binti Rahman',
    phoneNumber: '+60123456796',
    email: 'sofea.rahman@example.com',
    hasAccount: true,
  },
  {
    id: 9,
    name: 'Ahmad bin Yusuf',
    phoneNumber: '+60123456797',
    hasAccount: false,
  },
  {
    id: 10,
    name: 'Mariam binti Ali',
    phoneNumber: '+60123456798',
    email: 'mariam.ali@example.com',
    hasAccount: true,
  },
]

export const mockStudentsWithParents: StudentWithParent[] = [
  {
    id: 1,
    studentName: 'Ahmad bin Ali',
    studentId: 'STU2025001',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'male',
    parentId: 1,
    parentName: 'Ali bin Hassan',
    parentPhone: '+60123456789',
    parentHasAccount: true,
    dateRegistered: '2025-01-15',
  },
  {
    id: 2,
    studentName: 'Siti Nurhaliza',
    studentId: 'STU2025002',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'female',
    parentId: 2,
    parentName: 'Nurhaliza binti Ahmad',
    parentPhone: '+60123456790',
    parentHasAccount: true,
    dateRegistered: '2025-01-16',
  },
  {
    id: 3,
    studentName: 'Fatimah binti Hassan',
    studentId: 'STU2025003',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'female',
    parentId: 3,
    parentName: 'Hassan bin Ibrahim',
    parentPhone: '+60123456791',
    parentHasAccount: false,
    dateRegistered: '2025-01-17',
  },
  {
    id: 4,
    studentName: 'Muhammad Hakim',
    studentId: 'STU2025004',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'male',
    parentId: 4,
    parentName: 'Hakim bin Abdullah',
    parentPhone: '+60123456792',
    parentHasAccount: true,
    dateRegistered: '2025-01-18',
  },
  {
    id: 5,
    studentName: 'Nurul Ain',
    studentId: 'STU2025005',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'female',
    parentId: 5,
    parentName: 'Ain binti Yusof',
    parentPhone: '+60123456793',
    parentHasAccount: false,
    dateRegistered: '2025-01-19',
  },
  {
    id: 6,
    studentName: 'Zainab Karim',
    studentId: 'STU2025006',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'female',
    parentId: 6,
    parentName: 'Karim bin Ismail',
    parentPhone: '+60123456794',
    parentHasAccount: true,
    dateRegistered: '2025-01-20',
  },
  {
    id: 7,
    studentName: 'Amir Danial',
    studentId: 'STU2025007',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'male',
    parentId: 7,
    parentName: 'Danial bin Omar',
    parentPhone: '+60123456795',
    parentHasAccount: false,
    dateRegistered: '2025-01-21',
  },
  {
    id: 8,
    studentName: 'Aisyah Sofea',
    studentId: 'STU2025008',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'female',
    parentId: 8,
    parentName: 'Sofea binti Rahman',
    parentPhone: '+60123456796',
    parentHasAccount: true,
    dateRegistered: '2025-01-22',
  },
  {
    id: 9,
    studentName: 'Umar Farhan',
    studentId: 'STU2025009',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'male',
    parentId: 9,
    parentName: 'Ahmad bin Yusuf',
    parentPhone: '+60123456797',
    parentHasAccount: false,
    dateRegistered: '2025-01-23',
  },
  {
    id: 10,
    studentName: 'Hana Mariam',
    studentId: 'STU2025010',
    class: 'Year 1 Amanah',
    age: 7,
    gender: 'female',
    parentId: 10,
    parentName: 'Mariam binti Ali',
    parentPhone: '+60123456798',
    parentHasAccount: true,
    dateRegistered: '2025-01-24',
  },
]

// Helper function to get student by ID
export const getStudentById = (id: number): StudentWithParent | undefined => {
  return mockStudentsWithParents.find(student => student.id === id)
}

// Helper function to get all parents
export const getAllParents = (): Parent[] => {
  return mockParents
}

// Helper function to get parent by ID
export const getParentById = (id: number): Parent | undefined => {
  return mockParents.find(parent => parent.id === id)
}

// Helper function to search parents by phone number
export const searchParentByPhone = (phoneNumber: string): Parent | undefined => {
  // Normalize the search query
  const normalizedSearch = phoneNumber.replace(/[^\d+]/g, '')

  return mockParents.find(parent => {
    // Normalize the parent's phone number
    const normalizedParent = parent.phoneNumber.replace(/[^\d+]/g, '')

    // Compare normalized versions
    return normalizedParent === normalizedSearch ||
      normalizedParent.endsWith(normalizedSearch) ||
      normalizedSearch.endsWith(normalizedParent)
  })
}
