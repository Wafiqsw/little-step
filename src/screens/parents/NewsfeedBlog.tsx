import { View, Text, StyleSheet, ScrollView, TextInput, ActivityIndicator, Modal } from 'react-native'
import React, { useState, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, QuestionCard, Form, SuccessModal, ResultModal, ConfirmationModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { mockNewsData, getNewsById } from '../../data/MockNews'
import { RouteProp, useRoute } from '@react-navigation/native'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { getDataById, createData, updateData, deleteData } from '../../firebase/firestore'
import { Announcement } from '../../types/Announcement'
import { DocumentReference, getDoc, Timestamp, collection, query, where, getDocs, orderBy, doc } from 'firebase/firestore'
import { Users } from '../../types/Users'
import { Questions } from '../../types/Questions'
import { Answers } from '../../types/Answers'
import { auth, db } from '../../firebase/index'

type NewsfeedBlogNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'NewsfeedBlog'>
type NewsfeedBlogRouteProp = RouteProp<MainNavigatorParamList, 'NewsfeedBlog'>

// Local types for UI display (converted from Firestore types)
type AnswerData = {
  id: string
  teacherName: string
  answerDate: string
  answer: string
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
  const [question, setQuestion] = useState('')
  const [isExpanded, setIsExpanded] = useState(false)
  const [showAllQuestions, setShowAllQuestions] = useState(false)
  const [questionError, setQuestionError] = useState('')
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [submittingQuestion, setSubmittingQuestion] = useState(false)

  // Edit/Delete question states
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [editedQuestionText, setEditedQuestionText] = useState('')
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deletingQuestionId, setDeletingQuestionId] = useState<string | null>(null)
  const [isEditingQuestion, setIsEditingQuestion] = useState(false)
  const [isDeletingQuestion, setIsDeletingQuestion] = useState(false)

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
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

          // For each answer, fetch teacher name
          const answers: AnswerData[] = await Promise.all(
            answersSnapshot.docs.map(async (answerDoc) => {
              const answerData = answerDoc.data() as Answers

              let teacherName = 'Unknown'
              try {
                if (answerData.answered_by) {
                  const teacherDoc = await getDoc(answerData.answered_by as DocumentReference<Users>)
                  if (teacherDoc.exists()) {
                    teacherName = teacherDoc.data().name
                  }
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
                answer: answerData.message
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
      // Handle specific Firestore errors
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
        const firestoreData = await getDataById<Announcement>('announcements', announcementId)

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
          const dateField = firestoreData.announcement_date
          console.log('📅 Raw date field:', dateField, 'Type:', typeof dateField)

          if (dateField) {
            try {
              // Check if it's a Firestore Timestamp
              if (dateField instanceof Timestamp) {
                date = dateField.toDate().toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              } else if (dateField instanceof Date) {
                date = dateField.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
              } else if (typeof dateField === 'object' && 'seconds' in dateField) {
                // Handle Timestamp-like object
                date = new Date((dateField as any).seconds * 1000).toLocaleDateString('en-US', {
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
            console.log('❌ No announcement_date field found in Firestore data')
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
                answer: answer.answer
              })),
              askedByUserId: 'mock-user'  // Mock user ID
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
      } catch (error: any) {
        console.error('❌ Error fetching announcement:', error)
        // Log specific error details
        if (error?.code === 'permission-denied') {
          console.error('Permission denied accessing announcements collection')
        } else if (error?.code === 'unavailable') {
          console.error('Firestore service unavailable')
        }

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
              answer: answer.answer
            })),
            askedByUserId: 'mock-user'  // Mock user ID
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

  const handleSubmitQuestion = async () => {
    // Validate question
    if (!question.trim()) {
      setQuestionError('Please enter your question')
      return
    }

    if (!announcement || !auth.currentUser) {
      setErrorMessage('Unable to submit question. Please try again.')
      setShowErrorModal(true)
      return
    }

    try {
      setSubmittingQuestion(true)
      console.log('📝 Submitting question:', question)

      // Create question document
      const questionData = {
        message: question,
        asked_by: doc(db, 'users', auth.currentUser.uid),
        announcement_ref: doc(db, 'announcements', announcement.id),
        date_asked: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }

      const questionId = await createData('questions', questionData)
      console.log('✅ Question submitted with ID:', questionId)

      // Refresh Q&A data
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      // Show success modal
      setShowSuccessModal(true)
      setQuestion('')
      setQuestionError('')
    } catch (error) {
      console.error('❌ Error submitting question:', error)
      // Show error modal
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Failed to submit question. Please try again.'
      )
      setShowErrorModal(true)
    } finally {
      setSubmittingQuestion(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
  }

  // Edit question handler
  const handleEditQuestion = (questionId: string, currentText: string) => {
    setEditingQuestionId(questionId)
    setEditedQuestionText(currentText)
    setShowEditModal(true)
  }

  // Save edited question
  const handleSaveEdit = async () => {
    if (!editingQuestionId || !editedQuestionText.trim() || !announcement) {
      return
    }

    try {
      setIsEditingQuestion(true)
      await updateData('questions', editingQuestionId, {
        message: editedQuestionText,
        updated_at: new Date()
      })

      // Refresh Q&A
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      setShowEditModal(false)
      setEditingQuestionId(null)
      setEditedQuestionText('')
    } catch (error) {
      console.error('Error updating question:', error)
      setErrorMessage('Failed to update question')
      setShowErrorModal(true)
    } finally {
      setIsEditingQuestion(false)
    }
  }

  // Delete question handler
  const handleDeleteQuestion = (questionId: string) => {
    setDeletingQuestionId(questionId)
    setShowDeleteConfirm(true)
  }

  // Confirm delete
  const handleConfirmDelete = async () => {
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
      await Promise.all(answersSnapshot.docs.map(doc => deleteData('answers', doc.id)))

      // Delete the question
      await deleteData('questions', deletingQuestionId)

      // Refresh Q&A
      const updatedQnA = await fetchQnA(announcement.id)
      setAnnouncement({
        ...announcement,
        qna: updatedQnA
      })

      setShowDeleteConfirm(false)
      setDeletingQuestionId(null)
    } catch (error) {
      console.error('Error deleting question:', error)
      setErrorMessage('Failed to delete question')
      setShowErrorModal(true)
    } finally {
      setIsDeletingQuestion(false)
    }
  }

  // Sort questions: user's questions first, then others
  const sortedQuestions = announcement?.qna ? [...announcement.qna].sort((a, b) => {
    const currentUserId = auth.currentUser?.uid || ''
    const aIsOwner = a.askedByUserId === currentUserId
    const bIsOwner = b.askedByUserId === currentUserId

    if (aIsOwner && !bIsOwner) return -1
    if (!aIsOwner && bIsOwner) return 1
    return 0  // Keep original order for same ownership
  }) : []

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

          {/* Ask Question Form */}
          <View style={styles.askQuestionContainer}>
            <Text style={styles.askQuestionLabel}>Have a question?</Text>
            <Form
              label="Your Question"
              variant="simple"
              size="large"
              placeholder="Type your question here..."
              multiline
              numberOfLines={4}
              value={question}
              onChangeText={(text) => {
                setQuestion(text)
                if (questionError) setQuestionError('')
              }}
              inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
              error={questionError}
            />
            <Button
              label={submittingQuestion ? "Submitting..." : "Submit Question"}
              variant="primary"
              onPress={handleSubmitQuestion}
              disabled={submittingQuestion}
            />
          </View>

          {/* Q&A List */}
          <View style={styles.qnaList}>
            {loadingQna ? (
              <View style={styles.qnaLoadingContainer}>
                <ActivityIndicator size="small" color={Colors.primary[600]} />
                <Text style={styles.qnaLoadingText}>Loading questions...</Text>
              </View>
            ) : sortedQuestions.length > 0 ? (
              <>
                {(showAllQuestions ? sortedQuestions : sortedQuestions.slice(0, 2)).map((item) => (
                  <QuestionCard
                    key={item.id}
                    parentName={item.parentName}
                    date={item.date}
                    question={item.question}
                    answers={item.answers}
                    isOwner={item.askedByUserId === auth.currentUser?.uid}
                    onEdit={() => handleEditQuestion(item.id, item.question)}
                    onDelete={() => handleDeleteQuestion(item.id)}
                  />
                ))}

                {/* Show More Questions Button */}
                {sortedQuestions.length > 2 && (
                  <Button
                    label={showAllQuestions ? 'Show Less Questions' : `Show ${sortedQuestions.length - 2} More Questions`}
                    variant="secondary"
                    onPress={() => setShowAllQuestions(!showAllQuestions)}
                  />
                )}
              </>
            ) : (
              <View style={styles.noQuestionsContainer}>
                <Icon name="comments-o" size={48} color={Colors.text.disabled} />
                <Text style={styles.noQuestionsText}>No questions yet</Text>
                <Text style={styles.noQuestionsSubtext}>Be the first to ask a question about this announcement!</Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Question Submitted!"
        message="Your question has been submitted successfully. The teacher will respond soon."
        onClose={handleSuccessClose}
        buttonText="Done"
      />

      {/* Error Modal */}
      <ResultModal
        visible={showErrorModal}
        variant="error"
        title="Submission Failed"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
        buttonText="Try Again"
      />

      {/* Edit Question Modal */}
      <Modal
        visible={showEditModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setShowEditModal(false)
          setEditingQuestionId(null)
          setEditedQuestionText('')
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.editModalContainer}>
            <Text style={styles.modalTitle}>Edit Question</Text>
            <Form
              label="Question"
              variant="simple"
              size="large"
              placeholder="Edit your question..."
              multiline
              numberOfLines={4}
              value={editedQuestionText}
              onChangeText={setEditedQuestionText}
              inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
            />
            <View style={styles.modalButtons}>
              <Button
                label="Cancel"
                variant="secondary"
                onPress={() => {
                  setShowEditModal(false)
                  setEditingQuestionId(null)
                  setEditedQuestionText('')
                }}
              />
              <Button
                label={isEditingQuestion ? "Saving..." : "Save Changes"}
                variant="primary"
                onPress={handleSaveEdit}
                disabled={!editedQuestionText.trim() || isEditingQuestion}
                icon={isEditingQuestion ? <ActivityIndicator size="small" color={Colors.white} /> : undefined}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteConfirm}
        title="Delete Question"
        message="Are you sure you want to delete this question? This action cannot be undone and will also delete all answers."
        confirmText={isDeletingQuestion ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        confirmColor="#FF4979"
        iconName="trash"
        iconColor="#FF4979"
        onConfirm={isDeletingQuestion ? () => { } : handleConfirmDelete}
        onCancel={() => {
          if (!isDeletingQuestion) {
            setShowDeleteConfirm(false)
            setDeletingQuestionId(null)
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
  qnaLoadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  qnaLoadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
  },
  noQuestionsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    gap: Spacing.sm,
    backgroundColor: '#F5F5F5',
    borderRadius: BorderRadius.lg,
  },
  noQuestionsText: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  noQuestionsSubtext: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    textAlign: 'center',
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  editModalContainer: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    width: '90%',
    maxWidth: 500,
    gap: Spacing.md,
  },
  modalTitle: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.sm,
  },
})

export { NewsfeedBlog }
