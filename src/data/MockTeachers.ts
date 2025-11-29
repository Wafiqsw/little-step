/**
 * Mock Teacher Data
 */

export interface Teacher {
    id: string
    name: string
    class: string
    subject?: string
    email?: string
    phone?: string
}

export const mockTeachers: Teacher[] = [
    {
        id: '1',
        name: 'Cikgu Aminah',
        class: 'Year 1 Amanah',
        subject: 'Bahasa Melayu',
        email: 'aminah@littlestep.edu.my',
        phone: '+60123456700',
    },
    {
        id: '2',
        name: 'Cikgu Rashid',
        class: 'Year 1 Bestari',
        subject: 'Mathematics',
        email: 'rashid@littlestep.edu.my',
        phone: '+60123456701',
    },
]

// Default teacher for the dashboard
export const mockTeacher: Teacher = mockTeachers[0]
