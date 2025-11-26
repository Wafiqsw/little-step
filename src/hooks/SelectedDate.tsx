import React, { createContext, useContext, useState, ReactNode } from 'react'

interface SelectedDateContextType {
    selectedDate: Date
    changeDate: (date: Date) => void
    resetToToday: () => void
}

const SelectedDateContext = createContext<SelectedDateContextType | undefined>(undefined)

export const SelectedDateProvider = ({ children }: { children: ReactNode }) => {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date())

    const changeDate = (date: Date) => {
        setSelectedDate(date)
    }

    const resetToToday = () => {
        setSelectedDate(new Date())
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
