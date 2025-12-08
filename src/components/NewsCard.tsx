import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'

export type NewsTag = 'urgent' | 'important' | 'general'

export interface NewsCardProps {
  tag: NewsTag
  count?: number
  heading: string
  subheading: string
  onPress?: () => void
  containerStyle?: ViewStyle
  showAskQuestion?: boolean
}

const NewsCard: React.FC<NewsCardProps> = ({
  tag,
  count,
  heading,
  subheading,
  onPress,
  containerStyle,
  showAskQuestion = true,
}) => {
  // Get tag info (label, colors)
  const getTagInfo = (): {
    label: string
    tagColor: string
    backgroundColor: string
    textColor: string
  } => {
    switch (tag) {
      case 'urgent':
        return {
          label: 'Urgent',
          tagColor: '#FF4979',
          backgroundColor: '#FFE5ED',
          textColor: Colors.white,
        }
      case 'important':
        return {
          label: 'Important',
          tagColor: '#FFA726',
          backgroundColor: '#FFF3E0',
          textColor: Colors.white,
        }
      case 'general':
        return {
          label: 'General',
          tagColor: '#62B76F',
          backgroundColor: '#E8F5E9',
          textColor: Colors.white,
        }
      default:
        return {
          label: 'General',
          tagColor: '#62B76F',
          backgroundColor: '#E8F5E9',
          textColor: Colors.white,
        }
    }
  }

  const tagInfo = getTagInfo()

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: tagInfo.backgroundColor },
        containerStyle,
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Row 1: Tag and Count */}
      <View style={styles.row1}>
        {/* Tag */}
        <View
          style={[styles.tagContainer, { backgroundColor: tagInfo.tagColor }]}
        >
          <Text style={[styles.tagText, { color: tagInfo.textColor }]}>
            {tagInfo.label}
          </Text>
        </View>

        {/* Count */}
        {count !== undefined && count > 0 && (
          <View style={styles.countContainer}>
            <Text style={styles.countText}>+{count}</Text>
          </View>
        )}
      </View>

      {/* Row 2: Heading and Subheading */}
      <View style={styles.row2}>
        <Text style={styles.heading} numberOfLines={2} ellipsizeMode="tail">
          {heading}
        </Text>
        <Text style={styles.subheading} numberOfLines={3} ellipsizeMode="tail">
          {subheading}
        </Text>
      </View>

      {/* Row 3: Ask a Question Text */}
      {showAskQuestion && (
        <View style={styles.row3}>
          <Text style={styles.askQuestionText}>Ask a Question</Text>
        </View>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
  },
  row1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagContainer: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    fontFamily: Typography.body.small.fontFamily,
  },
  countContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 4,
    borderRadius: BorderRadius.sm,
    borderWidth: 1,
    borderColor: '#D9D9D9',
  },
  countText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
  },
  row2: {
    gap: 4,
  },
  heading: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: Typography.heading.h4.fontWeight,
    color: Colors.black,
  },
  subheading: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    fontFamily: Typography.body.medium.fontFamily,
  },
  row3: {
    alignItems: 'flex-start',
  },
  askQuestionText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    fontFamily: Typography.body.small.fontFamily,
  },
})

export { NewsCard }
