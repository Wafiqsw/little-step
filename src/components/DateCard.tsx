import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useRef } from 'react'
import { Colors } from '../constants/colors'
import { Spacing, BorderRadius } from '../constants/spacing'
import { Shadows } from '../constants/shadows'
import { FontSize, FontWeight } from '../constants/typography'
import { useSelectedDate } from '../hooks'

interface DateItem {
  date: Date
  dayNumber: string
  dayName: string
}

const DateCard = () => {
  const { selectedDate, changeDate } = useSelectedDate()
  const scrollViewRef = useRef<ScrollView>(null)

  // Generate 14 days starting from today
  const generateDates = (): DateItem[] => {
    const dates: DateItem[] = []
    const today = new Date()

    for (let i = 0; i < 14; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)

      dates.push({
        date,
        dayNumber: date.getDate().toString().padStart(2, '0'),
        dayName: date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase(),
      })
    }

    return dates
  }

  const dates = generateDates()

  const isSameDay = (date1: Date, date2: Date) => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    )
  }

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

          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.dateCard,
                isSelected && styles.dateCardSelected,
              ]}
              onPress={() => handleDatePress(item.date)}
              activeOpacity={0.7}
            >
              <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>
                {item.dayNumber}
              </Text>
              <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>
                {item.dayName}
              </Text>
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
  dayName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
    color: Colors.text.secondary,
  },
  dayNameSelected: {
    color: Colors.text.primary,
    fontWeight: FontWeight.semibold,
  },
})

export { DateCard }