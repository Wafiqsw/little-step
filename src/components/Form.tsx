import React from 'react'
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ViewStyle,
  TextStyle,
  DimensionValue,
  TextInputProps,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
  Colors,
  Typography,
  Spacing,
  BorderRadius,
  Shadows,
} from '../constants'

export type FormVariant = 'gradient' | 'simple'
export type FormSize = 'small' | 'medium' | 'large'

export interface FormProps extends TextInputProps {
  label: string
  variant?: FormVariant
  size?: FormSize
  width?: DimensionValue
  borderRadius?: number
  labelStyle?: TextStyle
  inputStyle?: TextStyle
  containerStyle?: ViewStyle
  error?: string
}

const Form: React.FC<FormProps> = ({
  label,
  variant = 'gradient',
  size = 'medium',
  width,
  borderRadius,
  labelStyle,
  inputStyle,
  containerStyle,
  error,
  ...textInputProps
}) => {
  const getSizeStyles = (): ViewStyle => {
    switch (size) {
      case 'small':
        return {
          paddingHorizontal: Spacing.sm,
          paddingVertical: Spacing.xs,
          minHeight: 36,
        }
      case 'medium':
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          minHeight: 44,
        }
      case 'large':
        return {
          paddingHorizontal: Spacing.base,
          paddingVertical: Spacing.md,
          minHeight: 52,
        }
      default:
        return {
          paddingHorizontal: Spacing.md,
          paddingVertical: Spacing.sm,
          minHeight: 44,
        }
    }
  }

  const getFontSize = (): number => {
    switch (size) {
      case 'small':
        return Typography.body.small.fontSize as number
      case 'large':
        return Typography.body.large.fontSize as number
      default:
        return Typography.body.medium.fontSize as number
    }
  }

  const renderInput = () => {
    const inputContent = (
      <TextInput
        style={[
          styles.input,
          getSizeStyles(),
          {
            fontSize: getFontSize(),
            borderRadius: borderRadius ?? BorderRadius.base,
          },
          variant === 'simple' && styles.simpleInput,
          inputStyle,
        ]}
        placeholderTextColor={Colors.text.hint}
        {...textInputProps}
      />
    )

    if (variant === 'gradient') {
      return (
        <View
          style={[
            styles.gradientContainer,
            {
              borderRadius: borderRadius ?? BorderRadius.base,
            },
            Shadows.sm,
          ]}
        >
          <LinearGradient
            colors={['#FCDDEC', '#ECE0B3']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={[
              styles.gradient,
              {
                borderRadius: borderRadius ?? BorderRadius.base,
              },
            ]}
          >
            {inputContent}
          </LinearGradient>
        </View>
      )
    }

    return inputContent
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: width ?? '100%',
        },
        containerStyle,
      ]}
    >
      <Text style={[styles.label, labelStyle]}>{label}</Text>
      {renderInput()}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.label.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  gradientContainer: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    overflow: 'hidden',
  },
  gradient: {
    borderRadius: BorderRadius.base,
  },
  input: {
    color: Colors.black,
    fontFamily: Typography.body.medium.fontFamily,
  },
  simpleInput: {
    backgroundColor: '#F0F0F0',
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  errorText: {
    fontSize: Typography.caption.fontSize as number,
    color: Colors.error.main,
    marginTop: Spacing.xs,
  },
})

export { Form }