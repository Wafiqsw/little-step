import React, { useState } from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing } from '../constants'

export interface CheckboxProps {
  label?: string
  checked?: boolean
  onChange?: (checked: boolean) => void
  size?: number
  labelStyle?: TextStyle
  containerStyle?: ViewStyle
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked: controlledChecked,
  onChange,
  size = 24,
  labelStyle,
  containerStyle,
}) => {
  const [internalChecked, setInternalChecked] = useState(false)

  const isChecked = controlledChecked !== undefined ? controlledChecked : internalChecked

  const handlePress = () => {
    const newValue = !isChecked
    if (controlledChecked === undefined) {
      setInternalChecked(newValue)
    }
    onChange?.(newValue)
  }

  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.checkbox,
          {
            width: size,
            height: size,
          },
          isChecked && styles.checkboxChecked,
        ]}
      >
        {isChecked && (
          <Icon name="check" size={size * 0.7} color={Colors.black} />
        )}
      </View>
      {label && (
        <Text style={[styles.label, labelStyle]}>{label}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    borderWidth: 2,
    borderColor: Colors.black,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
  },
  checkboxChecked: {
    backgroundColor: Colors.white,
  },
  label: {
    marginLeft: Spacing.sm,
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.black,
    fontFamily: Typography.body.medium.fontFamily,
  },
})

export { Checkbox }