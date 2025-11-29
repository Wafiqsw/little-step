import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useRef, useEffect } from 'react'
import { Colors } from '../constants/colors'
import { Spacing, BorderRadius } from '../constants/spacing'
import { Shadows } from '../constants/shadows'
import { FontSize, FontWeight } from '../constants/typography'
import { useSelectedDate } from '../hooks'

interface DateItem {
  date: Date
  dayNumber: string
  dayName: string
  isToday: boolean
}

const DateCard = () => {
  const { selectedDate, changeDate } = useSelectedDate()
  const scrollViewRef = useRef<ScrollView>(null)

  // Helper function to compare dates (defined early so it can be used below)
  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

  // Generate dates excluding weekends (school days only)
  const generateDates = (): DateItem[] => {
    const dates: DateItem[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0) // Reset time for accurate comparison

    // Generate dates from 14 days ago to 7 days ahead, excluding weekends
    for (let i = -14; i <= 7; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      // Skip weekends (0 = Sunday, 6 = Saturday)
      const dayOfWeek = date.getDay()
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        continue
      }

      dates.push({
        date,
        dayNumber: date.getDate().toString().padStart(2, '0'),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
        isToday: i === 0,
      })
    }

    return dates
  }

  const dates = generateDates()

  // Find the index of the selected date in the filtered weekday array
  const selectedIndex = dates.findIndex(item => isSameDay(item.date, selectedDate))

  // Auto-scroll to selected date on mount (align selected date at the leftmost position)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (scrollViewRef.current && selectedIndex !== -1) {
        // Scroll so selected date's card is at the leftmost visible position
        const scrollPosition = selectedIndex * (CARD_WIDTH + Spacing.md)
        scrollViewRef.current.scrollTo({ x: scrollPosition, animated: true })
      }
    }, 100) // Small delay to ensure component is mounted

    return () => clearTimeout(timer)
  }, [selectedIndex])

  const handleDatePress = (date: Date) => {
    changeDate(date)
    console.log('DateCard - Selected date:', date.toDateString())
    console.log('DateCard - Full date object:', date)
  }

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + Spacing.md}
        snapToAlignment="start"
      >
        {dates.map((item, index) => {
          const isSelected = isSameDay(item.date, selectedDate)
          const isToday = item.isToday

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
                isToday && !isSelected && styles.dateCardToday,
              ]}
              onPress={() => handleDatePress(item.date)}
              activeOpacity={0.7}
            >
              <Text style={[
                styles.dayNumber,
                isSelected && styles.dayNumberSelected,
                isToday && !isSelected && styles.dayNumberToday,
              ]}>
                {item.dayNumber}
              </Text>
              <Text style={[
                styles.dayName,
                isSelected && styles.dayNameSelected,
                isToday && !isSelected && styles.dayNameToday,
              ]}>
                {item.dayName}
              </Text>
              {isToday && (
                <View style={styles.todayDot} />
              )}
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const CARD_WIDTH = 56
const CARD_HEIGHT = 64

const styles = StyleSheet.create({
  container: {
    // Removed paddingVertical for cleaner edges
  },
  scrollContent: {
    paddingHorizontal: Spacing.base,
    paddingVertical: Spacing.xs,
    gap: Spacing.md,
  },
  dateCard: {
    width: CARD_WIDTH,
    height: CARD_HEIGHT,
    backgroundColor: Colors.neutral[200],
    borderRadius: BorderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...Shadows.sm,
  },
  dateCardSelected: {
    backgroundColor: Colors.secondary[100],
    ...Shadows.md,
  },
  dateCardToday: {
    backgroundColor: Colors.primary[50],
    borderWidth: 1,
    borderColor: Colors.primary[300],
  },
  dayNumber: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  dayNumberSelected: {
    color: Colors.text.primary,
    fontWeight: FontWeight.bold,
  },
  dayNumberToday: {
    color: Colors.primary[600],
    fontWeight: FontWeight.bold,
  },
  dayName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
  },
  dayNameSelected: {
    color: Colors.text.primary,
    fontWeight: FontWeight.semibold,
  },
  dayNameToday: {
    color: Colors.primary[600],
    fontWeight: FontWeight.semibold,
  },
  todayDot: {
    position: 'absolute',
    bottom: 4,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary[500],
  },
})

export { DateCard }