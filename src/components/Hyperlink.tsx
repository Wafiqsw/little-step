import React from 'react'
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TextStyle,
} from 'react-native'
import { Colors, Typography } from '../constants'

export type HyperlinkVariant = 'black' | 'purple'

export interface HyperlinkProps {
  text: string
  onPress?: () => void
  variant?: HyperlinkVariant
  underline?: boolean
  fontSize?: number
  style?: TextStyle
}

const Hyperlink: React.FC<HyperlinkProps> = ({
  text,
  onPress,
  variant = 'black',
  underline = true,
  fontSize,
  style,
}) => {
  const getTextColor = (): string => {
    switch (variant) {
      case 'black':
        return Colors.black
      case 'purple':
        return '#6B6BAD'
      default:
        return Colors.black
    }
  }

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Text
        style={[
          styles.text,
          {
            color: getTextColor(),
            textDecorationLine: underline ? 'underline' : 'none',
            fontSize: fontSize ?? (Typography.body.medium.fontSize as number),
          },
          style,
        ]}
      >
        {text}
      </Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  text: {
    fontSize: Typography.body.medium.fontSize as number,
    fontFamily: Typography.body.medium.fontFamily,
  },
})

export { Hyperlink }