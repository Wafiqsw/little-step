import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, QuestionCard } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { mockNewsData, getNewsById } from '../../data/MockNews'
import { RouteProp, useRoute } from '@react-navigation/native'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'

type NewsfeedBlogNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'NewsfeedBlog'>
type NewsfeedBlogRouteProp = RouteProp<MainNavigatorParamList, 'NewsfeedBlog'>

const NewsfeedBlog = () => {
  const route = useRoute<NewsfeedBlogRouteProp>()
  const newsId = route.params?.newsId
  const navigation = useNavigation<NewsfeedBlogNavigationProp>()

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const [question, setQuestion] = React.useState('')
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [showAllQuestions, setShowAllQuestions] = React.useState(false)

  // Get news data from mock data using the newsId
  const newsData = newsId ? getNewsById(newsId) : mockNewsData[0]

  // Fallback if news not found
  if (!newsData) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton={true} onAvatarPress={handleAvatarPress}/>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>News article not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const qnaData = newsData.qna

  const getTagColor = (tag: 'urgent' | 'important' | 'general') => {
    switch (tag) {
      case 'urgent':
        return {
          backgroundColor: '#FF4979',
          label: 'Urgent',
        }
      case 'important':
        return {
          backgroundColor: '#FFA726',
          label: 'Important',
        }
      case 'general':
        return {
          backgroundColor: '#62B76F',
          label: 'General',
        }
    }
  }

  const tagStyle = getTagColor(newsData.tag)

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton={true} onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Article Header */}
        <View style={styles.articleHeader}>
          {/* Tag and Date Row */}
          <View style={styles.tagDateRow}>
            <View style={[styles.tag, { backgroundColor: tagStyle.backgroundColor }]}>
              <Text style={styles.tagText}>{tagStyle.label}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Icon name="calendar" size={14} color={Colors.text.secondary} />
              <Text style={styles.dateText}>{newsData.date}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{newsData.title}</Text>

          {/* Author */}
          <View style={styles.authorContainer}>
            <Icon name="user-circle" size={16} color={Colors.text.secondary} />
            <Text style={styles.authorText}>Written by {newsData.author}</Text>
          </View>
        </View>

        {/* Divider */}
        <View style={styles.divider} />

        {/* Article Description */}
        <View style={styles.descriptionContainer}>
          <Text
            style={styles.description}
            numberOfLines={isExpanded ? undefined : 5}
            ellipsizeMode="tail"
          >
            {newsData.description}
          </Text>
          <Button
            label={isExpanded ? 'See Less' : 'See More'}
            variant="secondary"
            onPress={() => setIsExpanded(!isExpanded)}
          />
        </View>


        <View style={styles.divider} />

        {/* Q&A Section */}
        <View style={styles.qnaSection}>
          <Text style={styles.qnaTitle}>Questions & Answers</Text>

          {/* Ask Question Form */}
          <View style={styles.askQuestionContainer}>
            <Text style={styles.askQuestionLabel}>Have a question?</Text>
            <TextInput
              style={styles.questionInput}
              placeholder="Type your question here..."
              placeholderTextColor={Colors.text.secondary}
              multiline
              numberOfLines={4}
              value={question}
              onChangeText={setQuestion}
              textAlignVertical="top"
            />
            <Button
              label="Submit Question"
              variant="primary"
              onPress={() => {
                console.log('Question submitted:', question)
                setQuestion('')
              }}
            />
          </View>

          {/* Q&A List */}
          <View style={styles.qnaList}>
            {(showAllQuestions ? qnaData : qnaData.slice(0, 2)).map((item) => (
              <QuestionCard
                key={item.id}
                parentName={item.parentName}
                date={item.date}
                question={item.question}
                answers={item.answers}
              />
            ))}

            {/* Show More Questions Button */}
            {qnaData.length > 2 && (
              <Button
                label={showAllQuestions ? 'Show Less Questions' : `Show ${qnaData.length - 2} More Questions`}
                variant="secondary"
                onPress={() => setShowAllQuestions(!showAllQuestions)}
              />
            )}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  articleHeader: {
    gap: Spacing.sm,
  },
  tagDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  tag: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
  },
  tagText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.white,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dateText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  title: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.black,
    lineHeight: 32,
  },
  authorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: Spacing.md,
  },
  descriptionContainer: {
    marginBottom: Spacing.md,
    gap: Spacing.sm,
  },
  description: {
    fontSize: Typography.body.large.fontSize as number,
    color: Colors.text.primary,
    lineHeight: 24,
  },
  qnaSection: {
    gap: Spacing.lg,
    marginTop: Spacing.md,
  },
  qnaTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
  },
  askQuestionContainer: {
    backgroundColor: '#F5F5F5',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  askQuestionLabel: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
  },
  questionInput: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.black,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  qnaList: {
    gap: Spacing.md,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  errorText: {
    fontSize: Typography.body.large.fontSize as number,
    color: Colors.text.secondary,
  },
})

export { NewsfeedBlog }
