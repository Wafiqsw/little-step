export interface Child {
  id: number
  name: string
  age: number
  class: string
}

export interface ParentData {
  name: string
  email: string
  phone: string
  children: Child[]
  emergencyContact: string
}

export const mockParentData: ParentData = {
  name: 'Erin Anderson',
  email: 'erin.anderson@example.com',
  phone: '+1 (555) 123-4567',
  children: [
    { id: 1, name: 'Emma Anderson', age: 4, class: 'Kindergarten A' },
    { id: 2, name: 'Liam Anderson', age: 6, class: 'Grade 1B' },
  ],
  emergencyContact: '+1 (555) 987-6543',
}
