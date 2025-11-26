import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { Hyperlink } from './Hyperlink'

export type AttendanceSummaryVariant = 'present' | 'absent'

export interface AttendanceSummaryCardProps {
  variant: AttendanceSummaryVariant
  total: number
  onSeeMore?: () => void
  containerStyle?: ViewStyle
}

const AttendanceSummaryCard: React.FC<AttendanceSummaryCardProps> = ({
  variant,
  total,
  onSeeMore,
  containerStyle,
}) => {
  // Get variant info (icon, colors, label)
  const getVariantInfo = (): {
    iconName: string
    iconColor: string
    backgroundColor: string
    label: string
  } => {
    switch (variant) {
      case 'present':
        return {
          iconName: 'check-circle',
          iconColor: '#62B76F',
          backgroundColor: '#E8F5E9',
          label: 'Present',
        }
      case 'absent':
        return {
          iconName: 'times-circle',
          iconColor: '#FF4979',
          backgroundColor: '#FFEBEE',
          label: 'Absent',
        }
      default:
        return {
          iconName: 'check-circle',
          iconColor: '#62B76F',
          backgroundColor: '#E8F5E9',
          label: 'Present',
        }
    }
  }

  const variantInfo = getVariantInfo()

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Column 1: Icon */}
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: variantInfo.backgroundColor },
        ]}
      >
        <Icon
          name={variantInfo.iconName}
          size={40}
          color={variantInfo.iconColor}
        />
      </View>

      {/* Column 2: Text Content */}
      <View style={styles.contentContainer}>
        {/* Row 1: Label */}
        <Text style={styles.label}>{variantInfo.label}</Text>

        {/* Row 2: Total */}
        <Text style={styles.total}>{total}</Text>

        {/* Row 3: See More Link */}
        <Hyperlink
          text="See more"
          onPress={onSeeMore}
          variant="black"
          fontSize={Typography.body.small.fontSize as number}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: BorderRadius.lg,
    backgroundColor: Colors.white,
    alignSelf: 'flex-start',
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.md,
  },
  contentContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  label: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight,
    color: Colors.black,
    marginBottom: 0,
  },
  total: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight,
    color: Colors.black,
    marginBottom: 0,
  },
})

export { AttendanceSummaryCard }
