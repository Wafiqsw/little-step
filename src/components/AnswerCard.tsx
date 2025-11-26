import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'

export interface AnswerCardProps {
  teacherName: string
  answerDate: string
  answer: string
}

const AnswerCard: React.FC<AnswerCardProps> = ({
  teacherName,
  answerDate,
  answer,
}) => {
  return (
    <View style={styles.answerContainer}>
      <View style={styles.answerHeader}>
        <Icon name="comment" size={18} color="#62B76F" />
        <Text style={styles.answerLabel}>Answer</Text>
      </View>
      <View style={styles.answerMeta}>
        <Text style={styles.teacherName}>{teacherName}</Text>
        <Text style={styles.metaDate}>{answerDate}</Text>
      </View>
      <Text style={styles.answerText}>{answer}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  answerContainer: {
    backgroundColor: '#F0F9F2',
    padding: Spacing.sm,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
    borderLeftWidth: 3,
    borderLeftColor: '#62B76F',
  },
  answerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  answerLabel: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: '#62B76F',
  },
  answerMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  teacherName: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
  },
  metaDate: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  answerText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.primary,
    lineHeight: 22,
  },
})

export { AnswerCard }
