import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'

export type NewsTag = 'urgent' | 'important' | 'general'

export interface TeacherNewsCardProps {
  tag: NewsTag
  count?: number
  heading: string
  subheading: string
  onPress?: () => void
  onEdit?: () => void
  onDelete?: () => void
  containerStyle?: ViewStyle
}

const TeacherNewsCard: React.FC<TeacherNewsCardProps> = ({
  tag,
  count,
  heading,
  subheading,
  onPress,
  onEdit,
  onDelete,
  containerStyle,
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
    <View
      style={[
        styles.container,
        { backgroundColor: tagInfo.backgroundColor },
        containerStyle,
      ]}
    >
      <TouchableOpacity
        style={styles.contentArea}
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
      </TouchableOpacity>

      {/* Row 3: Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={onEdit}
          activeOpacity={0.7}
        >
          <Icon name="edit" size={16} color={Colors.primary[600]} />
          <Text style={styles.actionText}>Edit</Text>
        </TouchableOpacity>

        <View style={styles.actionDivider} />

        <TouchableOpacity
          style={styles.actionButton}
          onPress={onDelete}
          activeOpacity={0.7}
        >
          <Icon name="trash" size={16} color="#F44336" />
          <Text style={[styles.actionText, { color: '#F44336' }]}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: '#D9D9D9',
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  contentArea: {
    padding: Spacing.md,
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
  actionRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#D9D9D9',
    backgroundColor: Colors.white,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
  },
  actionDivider: {
    width: 1,
    backgroundColor: '#D9D9D9',
  },
  actionText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.primary[600],
  },
})

export { TeacherNewsCard }
