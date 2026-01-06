import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Modal, TouchableOpacity } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, QuestionCard, ConfirmationModal, EditModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { getNewsById } from '../../data/MockNews'
import { RouteProp, useRoute } from '@react-navigation/native'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getDataByIdWithCache, createDataWithCache, updateDataWithCache, deleteDataWithCache } from '../../firebase/firestoreWithCache'
import { Announcement } from '../../types/Announcement'
import { DocumentReference, getDoc, Timestamp, collection, query, where, getDocs, orderBy, doc } from 'firebase/firestore'
import { Users } from '../../types/Users'
import { Questions } from '../../types/Questions'
import { Answers } from '../../types/Answers'
import { auth, db } from '../../firebase/index'

type NewsfeedBlogNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TeacherNewsfeedBlog'>
type NewsfeedBlogRouteProp = RouteProp<MainNavigatorParamList, 'TeacherNewsfeedBlog'>

type AnswerData = {
  id: string
  teacherName: string
  answerDate: string
  answer: string
  answeredByUserId: string  // User ID of answer owner
}

type QuestionData = {
  id: string
  parentName: string
  date: string
  question: string
  answers: AnswerData[]
  askedByUserId: string  // User ID of question owner
}

type AnnouncementData = {
  id: string
  tag: 'urgent' | 'important' | 'general'
  heading: string
  subheading: string
  title: string
  content: string
  date: string
  author: string
  qna: QuestionData[]
}

const NewsfeedBlog = () => {
  const route = useRoute<NewsfeedBlogRouteProp>()
  const newsId = route.params?.newsId
  const navigation = useNavigation<NewsfeedBlogNavigationProp>()

  const [announcement, setAnnouncement] = useState<AnnouncementData | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadingQna, setLoadingQna] = useState(false)
  const [answerText, setAnswerText] = useState('')
  const [selectedQuestionId, setSelectedQuestionId] = useState<string | null>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  // Edit/Delete states
  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null)
  const [editedAnswerText, setEditedAnswerText] = useState('')
  const [showEditAnswerModal, setShowEditAnswerModal] = useState(false)
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null)
  const [deletingAnswerId, setDeletingAnswerId] = useState<string | null>(null)
  const [showDeleteQuestionConfirm, setShowDeleteQuestionConfirm] = useState(false)
  const [showDeleteAnswerConfirm, setShowDeleteAnswerConfirm] = useState(false)
  const [isEditingAnswer, setIsEditingAnswer] = useState(false)
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false)
  const [isDeletingAnswer, setIsDeletingAnswer] = useState(false)

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  // Fetch Q&A for announcement
  const fetchQnA = async (announcementId: string) => {
    try {
      setLoadingQna(true)
      console.log('🔍 Fetching Q&A for announcement:', announcementId)

      // Get all questions for this announcement
      const questionsQuery = query(
        collection(db, 'questions'),
        where('announcement_ref', '==', doc(db, 'announcements', announcementId)),
        orderBy('date_asked', 'desc')
      )
      const questionsSnapshot = await getDocs(questionsQuery)

      // For each question, fetch answers
      const qnaData: QuestionData[] = await Promise.all(
        questionsSnapshot.docs.map(async (questionDoc) => {
          const questionData = questionDoc.data() as Questions

          // Fetch parent name
          let parentName = 'Unknown'
          try {
            if (questionData.asked_by) {
              const parentDoc = await getDoc(questionData.asked_by as DocumentReference<Users>)
              if (parentDoc.exists()) {
                parentName = parentDoc.data().name
              }
            }
          } catch (error) {
            console.error('Error fetching parent:', error)
          }

          // Format question date
          let questionDate = 'No date'
          try {
            const dateField = (questionData as any).date_asked
            if (dateField instanceof Timestamp) {
              questionDate = dateField.toDate().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            } else if (dateField instanceof Date) {
              questionDate = dateField.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })
            }
          } catch (error) {
            console.error('Error formatting question date:', error)
          }

          // Fetch answers for this question
          const answersQuery = query(
            collection(db, 'answers'),
            where('question_ref', '==', questionDoc.ref),
            orderBy('date_sent', 'desc')
          )
          const answersSnapshot = await getDocs(answersQuery)

          // For each answer, fetch teacher name and track ownership
          const answers: AnswerData[] = await Promise.all(
            answersSnapshot.docs.map(async (answerDoc) => {
              const answerData = answerDoc.data() as Answers

              let teacherName = 'Unknown'
              let answeredByUserId = ''
              try {
                if (answerData.answered_by) {
                  const teacherDoc = await getDoc(answerData.answered_by as DocumentReference<Users>)
                  if (teacherDoc.exists()) {
                    teacherName = teacherDoc.data().name
                  }
                  answeredByUserId = (answerData.answered_by as DocumentReference<Users>).id
                }
              } catch (error) {
                console.error('Error fetching teacher:', error)
              }

              // Format answer date
              let answerDate = 'No date'
              try {
                const dateField = (answerData as any).date_sent
                if (dateField instanceof Timestamp) {
                  answerDate = dateField.toDate().toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                } else if (dateField instanceof Date) {
                  answerDate = dateField.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })
                }
              } catch (error) {
                console.error('Error formatting answer date:', error)
              }

              return {
                id: answerDoc.id,
                teacherName,
                answerDate,
                answer: answerData.message,
                answeredByUserId
              }
            })
          )

          // Extract user ID from asked_by reference
          let askedByUserId = ''
          try {
            if (questionData.asked_by) {
              const ref = questionData.asked_by as DocumentReference<Users>
              askedByUserId = ref.id
            }
          } catch (error) {
            console.error('Error extracting user ID:', error)
          }

          return {
            id: questionDoc.id,
            parentName,
            date: questionDate,
            question: questionData.message,
            answers,
            askedByUserId
          }
        })
      )

      console.log('✅ Fetched', qnaData.length, 'questions with answers')
      return qnaData
    } catch (error: any) {
      console.error('❌ Error fetching Q&A:', error)
      if (error?.code === 'permission-denied') {
        console.error('Permission denied accessing questions/answers collections')
      } else if (error?.code === 'unavailable') {
        console.error('Firestore service unavailable')
      }
      return []
    } finally {
      setLoadingQna(false)
    }
  }

  // Fetch announcement from Firestore
  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setLoading(true)

        if (!newsId) {
          setLoading(false)
          return
        }

        // Convert newsId to string for Firestore lookup
        const announcementId = typeof newsId === 'string' ? newsId : newsId.toString()
        console.log('🔍 Fetching announcement with ID:', announcementId)

        // Try to fetch from Firestore
        const firestoreData = await getDataByIdWithCache<Announcement>('announcements', announcementId, { useCache: true })

        if (firestoreData) {
          // Fetch author name
          let authorName = 'Unknown'
          try {
            if (firestoreData.posted_by) {
              const authorDoc = await getDoc(firestoreData.posted_by as DocumentReference<Users>)
              if (authorDoc.exists()) {
                authorName = authorDoc.data().name
              }
            }
          } catch (error) {
            console.error('Error fetching author:', error)
          }

          // Format date - handle Firestore Timestamp
          let date = 'No date'
          // Use announcement_date (snake_case) to match Firestore field name
          const dateField = (firestoreData as any).announcement_date
          console.log('📅 Raw date field:', dateField, 'Type:', typeof dateField)

          if (dateField) {
            try {
              const dateValue: any = dateField
              // Check if it's a Firestore Timestamp
              if (dateValue instanceof Timestamp) {
                date = dateValue.toDate().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              } else if (dateValue instanceof Date) {
                date = dateValue.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              } else if (typeof dateValue === 'object' && dateValue.seconds) {
                // Handle Timestamp-like object
                date = new Date(dateValue.seconds * 1000).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              }
              console.log('📅 Formatted date:', date)
            } catch (error) {
              console.error('Error formatting date:', error)
              date = 'Invalid date'
            }
          } else {
            console.log('❌ No date field found in Firestore data')
          }

          // Fetch Q&A data
          const qnaData = await fetchQnA(announcementId)

          setAnnouncement({
            id: firestoreData.id,
            tag: firestoreData.tag,
            heading: firestoreData.heading,
            subheading: firestoreData.subheading,
            title: firestoreData.title,
            content: firestoreData.content,
            date,
            author: authorName,
            qna: qnaData
          })
        } else {
          // Fallback to mock data
          const mockData = getNewsById(newsId)
          if (mockData) {
            // Convert mock Q&A data to match QuestionData type
            const convertedQna: QuestionData[] = mockData.qna.map(item => ({
              id: item.id.toString(),
              parentName: item.parentName,
              date: item.date,
              question: item.question,
              answers: item.answers.map((answer, index) => ({
                id: `mock-answer-${item.id}-${index}`,
                teacherName: answer.teacherName,
                answerDate: answer.answerDate,
                answer: answer.answer,
                answeredByUserId: 'mock-teacher'
              })),
              askedByUserId: 'mock-parent'
            }))

            setAnnouncement({
              id: mockData.id.toString(),
              tag: mockData.tag,
              heading: mockData.heading,
              subheading: mockData.subheading,
              title: mockData.title,
              content: mockData.description,
              date: mockData.date,
              author: mockData.author,
              qna: convertedQna
            })
          }
        }
      } catch (error) {
        console.error('❌ Error fetching announcement:', error)
        // Fallback to mock data on error
        const mockData = newsId ? getNewsById(newsId) : null
        if (mockData) {
          // Convert mock Q&A data to match QuestionData type
          const convertedQna: QuestionData[] = mockData.qna.map(item => ({
            id: item.id.toString(),
            parentName: item.parentName,
            date: item.date,
            question: item.question,
            answers: item.answers.map((answer, index) => ({
              id: `mock-answer-${item.id}-${index}`,
              teacherName: answer.teacherName,
              answerDate: answer.answerDate,
              answer: answer.answer,
              answeredByUserId: 'mock-teacher'
            })),
            askedByUserId: 'mock-parent'
          }))

          setAnnouncement({
            id: mockData.id.toString(),
            tag: mockData.tag,
            heading: mockData.heading,
            subheading: mockData.subheading,
            title: mockData.title,
            content: mockData.description,
            date: mockData.date,
            author: mockData.author,
            qna: convertedQna
          })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchAnnouncement()
  }, [newsId])

  // Loading state
  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton={true} onAvatarPress={handleAvatarPress} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary[600]} />
          <Text style={styles.loadingText}>Loading announcement...</Text>
        </View>
      </SafeAreaView>
    )
  }

  // Fallback if announcement not found
  if (!announcement) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton={true} onAvatarPress={handleAvatarPress} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Announcement not found</Text>
        </View>
      </SafeAreaView>
    )
  }

  const qnaData = announcement.qna

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

  const tagStyle = getTagColor(announcement.tag)

  const handleAnswerSubmit = async (questionId: string) => {
    if (!answerText.trim() || !announcement || !auth.currentUser) {
      console.log('Please enter an answer')
      return
    }

    setSubmitting(true)
    try {
      // Create answer in Firestore
      await createDataWithCache('answers', {
        message: answerText,
        question_ref: doc(db, 'questions', questionId),
        answered_by: doc(db, 'users', auth.currentUser.uid),
        date_sent: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      })

      // Refresh Q&A
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      setAnswerText('')
      setSelectedQuestionId(null)
    } catch (error) {
      console.error('❌ Error submitting answer:', error)
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancelAnswer = () => {
    setAnswerText('')
    setSelectedQuestionId(null)
  }

  // Teacher delete question handler
  const handleDeleteQuestion = (questionId: string) => {
    setDeletingQuestionId(questionId)
    setShowDeleteQuestionConfirm(true)
  }

  const handleConfirmDeleteQuestion = async () => {
    if (!deletingQuestionId || !announcement) {
      return
    }

    try {
      setIsDeletingQuestion(true)
      // Delete all answers for this question first
      const answersQuery = query(
        collection(db, 'answers'),
        where('question_ref', '==', doc(db, 'questions', deletingQuestionId))
      )
      const answersSnapshot = await getDocs(answersQuery)
      await Promise.all(answersSnapshot.docs.map(doc => deleteDataWithCache('answers', doc.id)))

      // Delete the question
      await deleteDataWithCache('questions', deletingQuestionId)

      // Refresh Q&A
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      setShowDeleteQuestionConfirm(false)
      setDeletingQuestionId(null)
    } catch (error) {
      console.error('Error deleting question:', error)
    } finally {
      setIsDeletingQuestion(false)
    }
  }

  // Edit answer handler
  const handleEditAnswer = (answerId: string, currentText: string) => {
    setEditingAnswerId(answerId)
    setEditedAnswerText(currentText)
    setShowEditAnswerModal(true)
  }

  const handleSaveEditAnswer = async () => {
    if (!editingAnswerId || !editedAnswerText.trim() || !announcement) {
      return
    }

    try {
      setIsEditingAnswer(true)
      await updateDataWithCache('answers', editingAnswerId, {
        message: editedAnswerText,
        updated_at: new Date()
      })

      // Refresh Q&A
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      setShowEditAnswerModal(false)
      setEditingAnswerId(null)
      setEditedAnswerText('')
    } catch (error) {
      console.error('Error updating answer:', error)
    } finally {
      setIsEditingAnswer(false)
    }
  }

  // Delete answer handler
  const handleDeleteAnswer = (answerId: string) => {
    setDeletingAnswerId(answerId)
    setShowDeleteAnswerConfirm(true)
  }

  const handleConfirmDeleteAnswer = async () => {
    if (!deletingAnswerId || !announcement) {
      return
    }

    try {
      setIsDeletingAnswer(true)
      await deleteDataWithCache('answers', deletingAnswerId)

      // Refresh Q&A
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      setShowDeleteAnswerConfirm(false)
      setDeletingAnswerId(null)
    } catch (error) {
      console.error('Error deleting answer:', error)
    } finally {
      setIsDeletingAnswer(false)
    }
  }

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
              <Text style={styles.dateText}>{announcement.date}</Text>
            </View>
          </View>

          {/* Title */}
          <Text style={styles.title}>{announcement.title}</Text>

          {/* Author */}
          <View style={styles.authorContainer}>
            <Icon name="user-circle" size={16} color={Colors.text.secondary} />
            <Text style={styles.authorText}>Written by {announcement.author}</Text>
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
            {announcement.content}
          </Text>
          {/* Only show See More/Less button if content is long enough */}
          {announcement.content.length > 300 && (
            <Button
              label={isExpanded ? 'See Less' : 'See More'}
              variant="secondary"
              onPress={() => setIsExpanded(!isExpanded)}
            />
          )}
        </View>


        <View style={styles.divider} />

        {/* Q&A Section */}
        <View style={styles.qnaSection}>
          <Text style={styles.qnaTitle}>Questions & Answers</Text>

          {/* Info Note for Teachers */}
          <View style={styles.teacherInfoNote}>
            <Icon name="info-circle" size={16} color={Colors.primary[600]} />
            <Text style={styles.teacherInfoText}>
              As a teacher, you can answer parent questions below. Click "Answer" on any question to respond.
            </Text>
          </View>

          {/* Q&A List */}
          <View style={styles.qnaList}>
            {loadingQna ? (
              <View style={styles.qnaLoadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary[600]} />
                <Text style={styles.qnaLoadingText}>Loading questions...</Text>
              </View>
            ) : (showAllQuestions ? qnaData : qnaData.slice(0, 2)).map((item) => (
              <View key={item.id} style={styles.questionContainer}>
                {selectedQuestionId === item.id ? (
                  <>
                    <QuestionCard
                      parentName={item.parentName}
                      date={item.date}
                      question={item.question}
                      answers={item.answers.map(answer => ({
                        teacherName: answer.teacherName,
                        answerDate: answer.answerDate,
                        answer: answer.answer,
                        isOwner: answer.answeredByUserId === auth.currentUser?.uid,
                        onEdit: answer.answeredByUserId === auth.currentUser?.uid
                          ? () => handleEditAnswer(answer.id, answer.answer)
                          : undefined,
                        onDelete: answer.answeredByUserId === auth.currentUser?.uid
                          ? () => handleDeleteAnswer(answer.id)
                          : undefined
                      }))}
                      isTeacher={true}
                      onTeacherDelete={() => handleDeleteQuestion(item.id)}
                    />
                    <View style={styles.answerFormContainer}>
                      <Text style={styles.answerFormLabel}>Your Answer</Text>
                      <TextInput
                        style={styles.answerInput}
                        placeholder="Type your answer here..."
                        placeholderTextColor={Colors.text.secondary}
                        multiline
                        numberOfLines={4}
                        value={answerText}
                        onChangeText={setAnswerText}
                        textAlignVertical="top"
                      />
                      <View style={styles.answerButtonGroup}>
                        <Button
                          label="Cancel"
                          variant="secondary"
                          onPress={handleCancelAnswer}
                          style={styles.answerButton}
                          disabled={submitting}
                        />
                        <Button
                          label={submitting ? "Submitting..." : "Submit Answer"}
                          variant="primary"
                          onPress={() => handleAnswerSubmit(item.id)}
                          style={styles.answerButton}
                          disabled={submitting}
                        />
                      </View>
                    </View>
                  </>
                ) : (
                  <QuestionCard
                    parentName={item.parentName}
                    date={item.date}
                    question={item.question}
                    answers={item.answers.map(answer => ({
                      teacherName: answer.teacherName,
                      answerDate: answer.answerDate,
                      answer: answer.answer,
                      isOwner: answer.answeredByUserId === auth.currentUser?.uid,
                      onEdit: answer.answeredByUserId === auth.currentUser?.uid
                        ? () => handleEditAnswer(answer.id, answer.answer)
                        : undefined,
                      onDelete: answer.answeredByUserId === auth.currentUser?.uid
                        ? () => handleDeleteAnswer(answer.id)
                        : undefined
                    }))}
                    isTeacher={true}
                    onTeacherDelete={() => handleDeleteQuestion(item.id)}
                    showAnswerButton={true}
                    onAnswerClick={() => setSelectedQuestionId(item.id)}
                  />
                )}
              </View>
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

      {/* Edit Answer Modal */}
      <EditModal
        visible={showEditAnswerModal}
        title="Edit Answer"
        label="Answer"
        value={editedAnswerText}
        onChangeText={setEditedAnswerText}
        onSave={handleSaveEditAnswer}
        onCancel={() => {
          setShowEditAnswerModal(false)
          setEditingAnswerId(null)
          setEditedAnswerText('')
        }}
        isLoading={isEditingAnswer}
        placeholder="Edit your answer..."
      />

      {/* Delete Question Confirmation */}
      <ConfirmationModal
        visible={showDeleteQuestionConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This will also delete all answers."
        confirmText={isDeletingQuestion ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmColor="#FF4979"
        iconName="trash"
        iconColor="#FF4979"
        onConfirm={isDeletingQuestion ? () => { } : handleConfirmDeleteQuestion}
        onCancel={() => {
          if (!isDeletingQuestion) {
            setShowDeleteQuestionConfirm(false)
            setDeletingQuestionId(null)
          }
        }}
      />

      {/* Delete Answer Confirmation */}
      <ConfirmationModal
        visible={showDeleteAnswerConfirm}
        title="Delete Answer"
        message="Are you sure you want to delete this answer? This action cannot be undone."
        confirmText={isDeletingAnswer ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmColor="#FF4979"
        iconName="trash"
        iconColor="#FF4979"
        onConfirm={isDeletingAnswer ? () => { } : handleConfirmDeleteAnswer}
        onCancel={() => {
          if (!isDeletingAnswer) {
            setShowDeleteAnswerConfirm(false)
            setDeletingAnswerId(null)
          }
        }}
      />
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
  teacherInfoNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary[200],
    alignItems: 'flex-start',
  },
  teacherInfoText: {
    flex: 1,
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.primary[700],
    lineHeight: 18,
  },
  qnaList: {
    gap: Spacing.md,
  },
  questionContainer: {
    gap: Spacing.sm,
  },
  answerFormContainer: {
    backgroundColor: '#F5F5F5',
    padding: Spacing.md,
    borderRadius: BorderRadius.lg,
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  answerFormLabel: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.black,
  },
  answerInput: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.md,
    padding: Spacing.sm,
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.black,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#D0D0D0',
  },
  answerButtonGroup: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  answerButton: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
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
  qnaLoadingContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  qnaLoadingText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  questionCardWithAnswer: {
    marginBottom: 0,
  },
  answerSection: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  answerFormHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  answerTriggerButton: {
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
  },
  answerTriggerText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.primary[600],
  },
})

export { NewsfeedBlog }
