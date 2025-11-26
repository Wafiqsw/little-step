export interface Guardian {
    id: number
    firstName: string
    lastName: string
    fullName: string
    relationship: string
    phoneNumber: string
    variant: 'parent' | 'pickup'
    isArchived: boolean
}

export const mockGuardianData: Guardian[] = [
    // Parents
    {
        id: 1,
        firstName: 'Ahmad',
        lastName: 'Bin Ali',
        fullName: 'Ahmad Bin Ali',
        relationship: 'Father',
        phoneNumber: '+60123456789',
        variant: 'parent',
        isArchived: false,
    },
    {
        id: 2,
        firstName: 'Siti',
        lastName: 'Nurhaliza',
        fullName: 'Siti Nurhaliza',
        relationship: 'Mother',
        phoneNumber: '+60123456790',
        variant: 'parent',
        isArchived: false,
    },

    // Active Pickup Persons
    {
        id: 3,
        firstName: 'Hassan',
        lastName: 'Abdullah',
        fullName: 'Hassan Abdullah',
        relationship: 'Uncle',
        phoneNumber: '+60123456791',
        variant: 'pickup',
        isArchived: false,
    },
    {
        id: 4,
        firstName: 'Fatimah',
        lastName: 'Hassan',
        fullName: 'Fatimah Hassan',
        relationship: 'Aunt',
        phoneNumber: '+60123456792',
        variant: 'pickup',
        isArchived: false,
    },
    {
        id: 5,
        firstName: 'Lim',
        lastName: 'Wei Jie',
        fullName: 'Lim Wei Jie',
        relationship: 'Family Friend',
        phoneNumber: '+60123456793',
        variant: 'pickup',
        isArchived: false,
    },

    // Archived Pickup Persons
    {
        id: 6,
        firstName: 'Raj',
        lastName: 'Kumar',
        fullName: 'Raj Kumar',
        relationship: 'Grandfather',
        phoneNumber: '+60123456794',
        variant: 'pickup',
        isArchived: true,
    },
    {
        id: 7,
        firstName: 'Michelle',
        lastName: 'Tan',
        fullName: 'Michelle Tan',
        relationship: 'Neighbor',
        phoneNumber: '+60123456795',
        variant: 'pickup',
        isArchived: true,
    },
    {
        id: 8,
        firstName: 'Nurul',
        lastName: 'Aisyah',
        fullName: 'Nurul Aisyah',
        relationship: 'Grandmother',
        phoneNumber: '+60123456796',
        variant: 'pickup',
        isArchived: true,
    },
]

// Helper functions
export const getActiveParents = (): Guardian[] => {
    return mockGuardianData.filter(g => g.variant === 'parent' && !g.isArchived)
}

export const getActivePickupPersons = (): Guardian[] => {
    return mockGuardianData.filter(g => g.variant === 'pickup' && !g.isArchived)
}

export const getArchivedPickupPersons = (): Guardian[] => {
    return mockGuardianData.filter(g => g.variant === 'pickup' && g.isArchived)
}

export const getGuardianById = (id: number): Guardian | undefined => {
    return mockGuardianData.find(g => g.id === id)
}

export const getAllActiveGuardians = (): Guardian[] => {
    return mockGuardianData.filter(g => !g.isArchived)
}
