import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'

export interface NavigationCardProps {
  label: string
  subheading: string
  iconName: string
  iconColor?: string
  backgroundColor?: string
  containerStyle?: ViewStyle
  onPress?: () => void
}

export const NavigationCard: React.FC<NavigationCardProps> = ({
  label,
  subheading,
  iconName,
  iconColor = Colors.primary[500],
  backgroundColor = Colors.white,
  containerStyle,
  onPress,
}) => {
  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor }, containerStyle]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.iconContainer}>
        <Icon name={iconName} size={40} color={iconColor} />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.subheading}>{subheading}</Text>
      </View>

      <View style={styles.arrowContainer}>
        <Icon name="chevron-right" size={20} color={Colors.neutral[400]} />
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
    gap: Spacing.md,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 60,
    height: 60,
  },
  textContainer: {
    flex: 1,
    gap: 4,
  },
  label: {
    fontSize: Typography.heading.h4.fontSize as number,
    fontWeight: Typography.heading.h4.fontWeight as any,
    color: Colors.black,
    lineHeight: 24,
  },
  subheading: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '400',
    color: Colors.text.secondary,
    lineHeight: 18,
  },
  arrowContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})
