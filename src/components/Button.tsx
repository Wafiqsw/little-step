import React from 'react'
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  View,
  DimensionValue,
} from 'react-native'
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../constants'

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
export type ButtonSize = 'small' | 'medium' | 'large'

export interface ButtonProps {
  label: string
  onPress?: () => void
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  width?: DimensionValue
  height?: DimensionValue
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
  backgroundColor?: string
  textColor?: string
  borderRadius?: number
  style?: ViewStyle
  textStyle?: TextStyle
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  fullWidth = false,
  width,
  height,
  icon,
  iconPosition = 'left',
  backgroundColor,
  textColor,
  borderRadius,
  style,
  textStyle,
}) => {
  const getVariantStyles = (): ViewStyle => {
    if (backgroundColor) {
      return { backgroundColor }
    }

    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#371B34',
          borderWidth: 0,
        }
      case 'secondary':
        return {
          backgroundColor: '#FDF4F4',
          borderWidth: 1,
          borderColor: '#CFCECE',
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: Colors.primary[500],
        }
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        }
      case 'danger':
        return {
          backgroundColor: Colors.error.main,
          borderWidth: 0,
        }
      default:
        return {
          backgroundColor: '#371B34',
          borderWidth: 0,
        }
    }
  }

  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.xs,
          minHeight: 36,
        }
      case 'medium':
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          minHeight: 44,
        }
      case 'large':
        return {
          paddingHorizontal: Spacing.xl,
          paddingVertical: Spacing.md,
          minHeight: 52,
        }
      default:
        return {
          paddingHorizontal: Spacing.lg,
          paddingVertical: Spacing.sm,
          minHeight: 44,
        }
    }
  }

  const getTextColor = (): string => {
    if (textColor) {
      return textColor
    }

    if (variant === 'secondary') {
      return Colors.black
    }

    if (variant === 'outline' || variant === 'ghost') {
      return Colors.primary[500]
    }

    return Colors.white
  }

  const getTextStyles = (): TextStyle => {
    const baseTextStyle = size === 'small'
      ? Typography.button.small
      : size === 'large'
      ? Typography.button.large
      : Typography.button.medium

    return {
      ...baseTextStyle,
      color: disabled ? Colors.text.disabled : getTextColor(),
    }
  }

  const isDisabled = disabled || loading

  const customSizeStyle: ViewStyle = {
    borderRadius: borderRadius ?? BorderRadius.base,
    opacity: isDisabled ? 0.5 : 1,
    ...(width !== undefined && { width }),
    ...(height !== undefined && { height }),
    ...(fullWidth && !width && { width: '100%' }),
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
      style={[
        styles.button,
        getVariantStyles(),
        getSizeStyles(),
        customSizeStyle,
        !disabled && variant !== 'ghost' && Shadows.sm,
        style,
      ]}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={getTextColor()}
            style={styles.loader}
          />
        ) : (
          <>
            {icon && iconPosition === 'left' && (
              <View style={styles.iconLeft}>{icon}</View>
            )}
            <Text style={[getTextStyles(), textStyle]}>{label}</Text>
            {icon && iconPosition === 'right' && (
              <View style={styles.iconRight}>{icon}</View>
            )}
          </>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconLeft: {
    marginRight: Spacing.xs,
  },
  iconRight: {
    marginLeft: Spacing.xs,
  },
  loader: {
    marginHorizontal: Spacing.xs,
  },
})

export {Button}