import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { AnswerCard } from './AnswerCard'

export interface Answer {
  teacherName: string
  answerDate: string
  answer: string
}

export interface QuestionCardProps {
  parentName: string
  date: string
  question: string
  answers?: Answer[]
  containerStyle?: ViewStyle
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  parentName,
  date,
  question,
  answers = [],
  containerStyle,
}) => {
  return (
    <View style={[styles.qnaItem, containerStyle]}>
      {/* Question */}
      <View style={styles.questionContainer}>
        <View style={styles.questionHeader}>
          <Icon name="question-circle" size={18} color="#371B34" />
          <Text style={styles.questionLabel}>Question</Text>
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
            />
          ))}
        </View>
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
    gap: 8,
    marginBottom: 4,
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
})

export { QuestionCard }
