import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SelectedDateContextType {
    selectedDate: Date
    changeDate: (date: Date) => void
    resetToToday: () => void
}

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(undefined)

/**
 * Get the default date - if today is weekend, return last Friday
 */
const getDefaultDate = (): Date => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const dayOfWeek = today.getDay()

    // If today is Sunday (0) or Saturday (6), return last Friday
    if (dayOfWeek === 0) {
        // Sunday - go back 2 days to Friday
        const friday = new Date(today)
        friday.setDate(today.getDate() - 2)
        return friday
    } else if (dayOfWeek === 6) {
        // Saturday - go back 1 day to Friday
        const friday = new Date(today)
        friday.setDate(today.getDate() - 1)
        return friday
    }

    // Weekday - return today
    return today
}

export const SelectedDateProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(getDefaultDate())

    const changeDate = (date: Date) => {
        setSelectedDate(date)
    }

    const resetToToday = () => {
        setSelectedDate(getDefaultDate())
    }

    return (
        <SelectedDateContext.Provider value={{ selectedDate, changeDate, resetToToday }}>
            {children}
        </SelectedDateContext.Provider>
    )
}

export const useSelectedDate = () => {
    const context = useContext(SelectedDateContext)
    if (!context) {
        throw new Error('useSelectedDate must be used within a SelectedDateProvider')
    }
    return context
}
