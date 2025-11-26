import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'

export type AttendanceStatus = 'present' | 'absent' | 'pending'

export interface AttendanceCardProps {
  name: string
  status: AttendanceStatus
  time?: string
  containerStyle?: ViewStyle
}

const AttendanceCard: React.FC<AttendanceCardProps> = ({
  name,
  status,
  time,
  containerStyle,
}) => {
  // Get initials from name (first letter of each word, capitalized)
  const getInitials = (fullName: string): string => {
    return fullName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2) // Take first 2 initials max
  }

  // Capitalize first letter of each word
  const capitalizeWords = (str: string): string => {
    return str
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ')
  }

  // Get status text and color
  const getStatusInfo = (): { text: string; color: string } => {
    switch (status) {
      case 'present':
        return { text: 'Present', color: '#62B76F' }
      case 'absent':
        return { text: 'Absent', color: '#FF4979' }
      case 'pending':
        return { text: 'Not Marked Yet', color: '#9E9E9E' }
      default:
        return { text: 'Not Marked Yet', color: '#9E9E9E' }
    }
  }

  // Get avatar color based on status
  const getAvatarColor = (): string => {
    switch (status) {
      case 'present':
        return '#62B76F' // Green
      case 'absent':
        return '#FF4979' // Red
      case 'pending':
        return '#9E9E9E' // Gray
      default:
        return '#9E9E9E'
    }
  }

  const statusInfo = getStatusInfo()

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Column 1: Avatar */}
      <View style={[styles.avatar, { backgroundColor: getAvatarColor() }]}>
        <Text style={styles.avatarText}>{getInitials(name)}</Text>
      </View>

      {/* Column 2: Name and Status */}
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{capitalizeWords(name)}</Text>
        <Text style={[styles.status, { color: statusInfo.color }]}>
          {statusInfo.text}
        </Text>
      </View>

      {/* Column 3: Time */}
      {time && (
        <View style={styles.timeContainer}>
          <Text style={styles.time}>{time}</Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  avatarText: {
    fontSize: Typography.heading.h4.fontSize as number,
    fontWeight: Typography.heading.h4.fontWeight,
    color: Colors.white,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  name: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
    marginBottom: 4,
  },
  status: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    fontFamily: Typography.body.medium.fontFamily,
  },
  timeContainer: {
    alignSelf: 'flex-start',
  },
  time: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    fontFamily: Typography.body.small.fontFamily,
  },
})

export { AttendanceCard }