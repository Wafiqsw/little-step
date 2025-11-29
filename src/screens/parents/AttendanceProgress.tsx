import React, { useState, useMemo } from 'react'
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { mockAttendanceRecords } from '../../data'
import {
  getWeekRange,
  getDaysInWeek,
  formatDayName,
  formatDayNumber,
  formatMonthName,
  formatWeekRange,
  isWeekday,
  isSameDay,
} from '../../utils'


import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'

interface DayAttendance {
  day: string
  date: string
  fullDate: Date
  status: 'present' | 'absent' | 'weekend' | 'no-record'
  countInPercentage: boolean
}

type AttendanceProgressNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'ParentTabNavigator'>



const AttendanceProgress = () => {
  const navigation = useNavigation<AttendanceProgressNavigationProp>();
  

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  // State for current week offset (0 = current week, -1 = last week, -2 = 2 weeks ago)
  const [weekOffset, setWeekOffset] = useState(0)

  // Get week range based on offset
  const currentWeekRange = useMemo(() => getWeekRange(weekOffset), [weekOffset])

  // Build week data from attendance records
  const weekData: DayAttendance[] = useMemo(() => {
    const daysInWeek = getDaysInWeek(currentWeekRange)

    return daysInWeek.map(date => {
      const dayName = formatDayName(date)
      const dayNumber = formatDayNumber(date)
      const isWeekdayDate = isWeekday(date)

      // Find matching attendance record
      const record = mockAttendanceRecords.find(r => isSameDay(r.date, date))

      let status: 'present' | 'absent' | 'weekend' | 'no-record'
      if (!isWeekdayDate) {
        status = 'weekend'
      } else if (!record) {
        status = 'no-record'
      } else {
        status = record.present ? 'present' : 'absent'
      }

      return {
        day: dayName,
        date: dayNumber,
        fullDate: date,
        status,
        countInPercentage: isWeekdayDate && status !== 'no-record',
      }
    })
  }, [currentWeekRange])

  // Calculate attendance percentage (only weekdays with records)
  const weekdayAttendance = weekData.filter(d => d.countInPercentage)
  const presentDays = weekdayAttendance.filter(d => d.status === 'present').length
  const totalWeekdays = weekdayAttendance.length
  const attendancePercentage = totalWeekdays > 0 ? Math.round((presentDays / totalWeekdays) * 100) : 0

  // Navigation handlers
  const goToPreviousWeek = () => {
    if (weekOffset > -2) { // Limit to 3 weeks (0, -1, -2)
      setWeekOffset(weekOffset - 1)
    }
  }

  const goToNextWeek = () => {
    if (weekOffset < 0) { // Can't go beyond current week
      setWeekOffset(weekOffset + 1)
    }
  }

  const isCurrentWeek = weekOffset === 0
  const isOldestWeek = weekOffset === -2

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
        return '#62B76F'
      case 'absent':
        return '#FF4979'
      case 'weekend':
      case 'no-record':
        return Colors.neutral[300]
      default:
        return Colors.neutral[300]
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'present':
        return 'check'
      case 'absent':
        return 'times'
      case 'weekend':
      case 'no-record':
        return 'minus'
      default:
        return 'minus'
    }
  }

  const getWeekTitle = () => {
    if (weekOffset === 0) return 'This Week'
    if (weekOffset === -1) return 'Last Week'
    if (weekOffset === -2) return '2 Weeks Ago'
    return formatWeekRange(currentWeekRange)
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress}/>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Attendance Progress</Text>

        {/* Week Navigation */}
        <View style={styles.weekNavigation}>
          <TouchableOpacity
            onPress={goToPreviousWeek}
            disabled={isOldestWeek}
            style={[styles.navButton, isOldestWeek && styles.navButtonDisabled]}
          >
            <Icon
              name="chevron-left"
              size={20}
              color={isOldestWeek ? Colors.neutral[300] : Colors.primary[500]}
            />
          </TouchableOpacity>

          <View style={styles.weekInfo}>
            <Text style={styles.weekTitle}>{getWeekTitle()}</Text>
            <Text style={styles.weekDateRange}>
              {formatWeekRange(currentWeekRange)}
            </Text>
          </View>

          <TouchableOpacity
            onPress={goToNextWeek}
            disabled={isCurrentWeek}
            style={[styles.navButton, isCurrentWeek && styles.navButtonDisabled]}
          >
            <Icon
              name="chevron-right"
              size={20}
              color={isCurrentWeek ? Colors.neutral[300] : Colors.primary[500]}
            />
          </TouchableOpacity>
        </View>

        {/* Overall Stats Card */}
        <View style={styles.statsCard}>
          <View style={styles.percentageContainer}>
            <View style={styles.percentageCircle}>
              <Text style={styles.percentageText}>{attendancePercentage}%</Text>
            </View>
            <Text style={styles.statsLabel}>Weekly Attendance</Text>
            <Text style={styles.statsSubtext}>
              {presentDays} out of {totalWeekdays} days
            </Text>
          </View>

          <View style={styles.statsDivider} />

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#E8F5E9' }]}>
                <Icon name="check" size={20} color="#62B76F" />
              </View>
              <Text style={styles.statValue}>{presentDays}</Text>
              <Text style={styles.statLabel}>Present</Text>
            </View>

            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFEBEE' }]}>
                <Icon name="times" size={20} color="#FF4979" />
              </View>
              <Text style={styles.statValue}>
                {weekdayAttendance.filter(d => d.status === 'absent').length}
              </Text>
              <Text style={styles.statLabel}>Absent</Text>
            </View>
          </View>
        </View>

        {/* Weekly Chart */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Weekly Overview</Text>

          <View style={styles.chartContainer}>
            {/* Chart Bars */}
            <View style={styles.chartBars}>
              {weekData.map((day, index) => {
                const barHeight = day.status === 'present' ? 100 : day.status === 'absent' ? 40 : 60
                return (
                  <View key={index} style={styles.barContainer}>
                    <View style={styles.barWrapper}>
                      <View
                        style={[
                          styles.bar,
                          {
                            height: barHeight,
                            backgroundColor: getStatusColor(day.status),
                            opacity: day.status === 'weekend' ? 0.3 : 1,
                          },
                        ]}
                      >
                        <Icon
                          name={getStatusIcon(day.status)}
                          size={14}
                          color={Colors.white}
                        />
                      </View>
                    </View>
                    <Text style={styles.barDay}>{day.day}</Text>
                    <Text style={styles.barDate}>{day.date}</Text>
                  </View>
                )
              })}
            </View>

            {/* Legend */}
            <View style={styles.legendContainer}>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#62B76F' }]} />
                <Text style={styles.legendText}>Present</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: '#FF4979' }]} />
                <Text style={styles.legendText}>Absent</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: Colors.neutral[300] }]} />
                <Text style={styles.legendText}>Weekend</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Daily Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Daily Details</Text>

          <View style={styles.detailsList}>
            {weekData.map((day, index) => (
              <View key={index} style={styles.detailCard}>
                <View style={styles.detailLeft}>
                  <Text style={styles.detailDay}>{day.day}</Text>
                  <Text style={styles.detailDate}>
                    {formatMonthName(day.fullDate)} {day.date}
                  </Text>
                </View>

                <View
                  style={[
                    styles.statusBadge,
                    {
                      backgroundColor:
                        day.status === 'present'
                          ? '#E8F5E9'
                          : day.status === 'absent'
                          ? '#FFEBEE'
                          : '#F5F5F5',
                    },
                  ]}
                >
                  <Icon
                    name={getStatusIcon(day.status)}
                    size={12}
                    color={getStatusColor(day.status)}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      { color: getStatusColor(day.status) },
                    ]}
                  >
                    {day.status.charAt(0).toUpperCase() + day.status.slice(1)}
                  </Text>
                </View>

                {!day.countInPercentage && (
                  <Text style={styles.notCountedText}>Not counted</Text>
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Icon name="info-circle" size={16} color="#2196F3" />
          <Text style={styles.infoText}>
            Attendance percentage is calculated based on weekdays (Mon-Fri) only.
            Weekend attendance is tracked but not included in the calculation.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.md,
  },
  percentageContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
  },
  percentageCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E8F5E9',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 8,
    borderColor: '#62B76F',
  },
  percentageText: {
    fontSize: 40,
    fontWeight: '700',
    color: '#62B76F',
  },
  statsLabel: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
    marginTop: Spacing.xs,
  },
  statsSubtext: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  statsDivider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xs,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    gap: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statValue: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: '700',
    color: Colors.black,
  },
  statLabel: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
  },
  chartContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.lg,
  },
  chartBars: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 150,
    gap: Spacing.xs,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  barWrapper: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bar: {
    width: '80%',
    borderRadius: BorderRadius.sm,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 40,
  },
  barDay: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
    marginTop: Spacing.xs,
  },
  barDate: {
    fontSize: Typography.body.small.fontSize as number - 2,
    color: Colors.text.secondary,
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.md,
    flexWrap: 'wrap',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  detailsList: {
    gap: Spacing.sm,
  },
  detailCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  detailLeft: {
    gap: 4,
  },
  detailDay: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
  },
  detailDate: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  statusText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
  },
  notCountedText: {
    fontSize: Typography.body.small.fontSize as number - 2,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  infoNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#E3F2FD',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  infoText: {
    flex: 1,
    fontSize: Typography.body.small.fontSize as number,
    color: '#1976D2',
    lineHeight: 18,
  },
  weekNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.md,
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonDisabled: {
    backgroundColor: Colors.neutral[100],
    opacity: 0.5,
  },
  weekInfo: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  weekTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
  },
  weekDateRange: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
})

export { AttendanceProgress }
