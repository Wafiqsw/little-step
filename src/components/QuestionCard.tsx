import React from 'react'
import { View, Text, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { AnswerCard } from './AnswerCard'

export interface Answer {
  teacherName: string
  answerDate: string
  answer: string
  // Optional ownership props
  isOwner?: boolean
  onEdit?: () => void
  onDelete?: () => void
}

export interface QuestionCardProps {
  parentName: string
  date: string
  question: string
  answers?: Answer[]
  containerStyle?: ViewStyle
  // Owner actions
  isOwner?: boolean
  onEdit?: () => void
  onDelete?: () => void
  // Teacher actions
  isTeacher?: boolean
  onTeacherDelete?: () => void
  // Teacher answer functionality
  showAnswerButton?: boolean
  onAnswerClick?: () => void
  answerButtonLabel?: string
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  parentName,
  date,
  question,
  answers = [],
  containerStyle,
  isOwner = false,
  onEdit,
  onDelete,
  isTeacher = false,
  onTeacherDelete,
  showAnswerButton = false,
  onAnswerClick,
  answerButtonLabel = 'Answer This Question',
}) => {
  return (
    <View style={[styles.qnaItem, containerStyle]}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <View style={styles.questionHeaderLeft}>
            <Icon name="question-circle" size={18} color="#371B34" />
            <Text style={styles.questionLabel}>Question</Text>
          </View>
          {isOwner && (
            <View style={styles.actionButtons}>
              {onEdit && (
                <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
                  <Icon name="edit" size={16} color="#371B34" />
                </TouchableOpacity>
              )}
              {onDelete && (
                <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
                  <Icon name="trash" size={16} color="#FF4979" />
                </TouchableOpacity>
              )}
            </View>
          )}
          {/* Teacher can delete any question */}
          {isTeacher && !isOwner && onTeacherDelete && (
            <View style={styles.actionButtons}>
              <TouchableOpacity onPress={onTeacherDelete} style={styles.actionButton}>
                <Icon name="trash" size={16} color="#FF4979" />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={styles.questionMeta}>
          <Text style={styles.parentName}>{parentName}</Text>
          <Text style={styles.metaDate}>{date}</Text>
        </View>
        <Text style={styles.questionText}>{question}</Text>
      </View>

      {/* Answers */}
      {answers.length > 0 && (
        <View style={styles.answersContainer}>
          {answers.map((answer, index) => (
            <AnswerCard
              key={index}
              teacherName={answer.teacherName}
              answerDate={answer.answerDate}
              answer={answer.answer}
              isOwner={answer.isOwner}
              onEdit={answer.onEdit}
              onDelete={answer.onDelete}
            />
          ))}
        </View>
      )}

      {/* Teacher Answer Button */}
      {showAnswerButton && onAnswerClick && (
        <TouchableOpacity
          style={styles.answerButton}
          onPress={onAnswerClick}
          activeOpacity={0.7}
        >
          <Icon name="reply" size={16} color={Colors.primary[600]} />
          <Text style={styles.answerButtonText}>{answerButtonLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  qnaItem: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    gap: Spacing.md,
    borderWidth: 1,
    borderColor: '#D0D0D0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  questionContainer: {
    gap: Spacing.xs,
  },
  questionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  questionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  questionLabel: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: '#371B34',
  },
  questionMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  parentName: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
  },
  metaDate: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  questionText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.primary,
    lineHeight: 22,
  },
  answersContainer: {
    gap: Spacing.sm,
  },
  answerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary[200],
    marginTop: Spacing.sm,
  },
  answerButtonText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.primary[600],
  },
})

export { QuestionCard }
