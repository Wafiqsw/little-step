import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, SuccessModal, ResultModal, Form } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { getNewsById } from '../../data/MockNews'
import Icon from 'react-native-vector-icons/FontAwesome'

type CreateFeedNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'TeacherCreateFeed'
>

type CreateFeedRouteProp = RouteProp<MainNavigatorParamList, 'TeacherCreateFeed'>

type TagType = 'urgent' | 'important' | 'general'

const CreateFeed = () => {
  const navigation = useNavigation<CreateFeedNavigationProp>()
  const route = useRoute<CreateFeedRouteProp>()
  const newsId = route.params?.newsId

  // Check if we're in edit mode
  const isEditMode = newsId !== undefined

  // Step tracking (1 or 2)
  const [currentStep, setCurrentStep] = useState(1)

  const [formData, setFormData] = useState({
    tag: 'general' as TagType,
    heading: '',
    subheading: '',
    title: '',
    description: '',
  })

  const [errors, setErrors] = useState({
    heading: '',
    title: '',
    description: '',
  })

  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [showErrorModal, setShowErrorModal] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Load existing news data if in edit mode
  useEffect(() => {
    if (isEditMode && newsId) {
      const existingNews = getNewsById(newsId)
      if (existingNews) {
        setFormData({
          tag: existingNews.tag,
          heading: existingNews.heading,
          subheading: existingNews.subheading,
          title: existingNews.title,
          description: existingNews.description,
        })
      }
    }
  }, [isEditMode, newsId])

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleNextStep = () => {
    // Validate Step 1 fields
    if (!formData.heading.trim()) {
      setErrors({ ...errors, heading: 'Please enter a heading' })
      return
    }
    setErrors({ ...errors, heading: '' })
    setCurrentStep(2)
  }

  const handleBackStep = () => {
    setCurrentStep(1)
  }

  const handlePublish = async () => {
    // Validate Step 2 fields
    const newErrors = {
      heading: '',
      title: '',
      description: '',
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Please enter an article title'
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Please enter article content'
    }

    if (newErrors.title || newErrors.description) {
      setErrors(newErrors)
      return
    }

    try {
      if (isEditMode) {
        // Here you would typically call API to update news
        console.log('Updating news:', newsId, formData)
        // Simulate potential API error
        // throw new Error('Failed to update article')
      } else {
        // Here you would typically call API to create news
        console.log('Publishing news:', formData)
        // Simulate potential API error
        // throw new Error('Failed to publish article')
      }
      // Show success modal
      setShowSuccessModal(true)
    } catch (error) {
      // Show error modal
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'An unexpected error occurred. Please try again.'
      )
      setShowErrorModal(true)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    // Navigate back on success
    navigation.goBack()
  }

  const tags: { value: TagType; label: string; color: string }[] = [
    { value: 'general', label: 'General', color: '#62B76F' },
    { value: 'important', label: 'Important', color: '#FFA726' },
    { value: 'urgent', label: 'Urgent', color: '#FF4979' },
  ]

  // Breadcrumb Component
  const renderBreadcrumb = () => (
    <View style={styles.breadcrumbContainer}>
      <TouchableOpacity
        style={[
          styles.breadcrumbStep,
          currentStep === 1 && styles.breadcrumbStepActive,
          currentStep > 1 && styles.breadcrumbStepCompleted,
        ]}
        onPress={() => setCurrentStep(1)}
        disabled={currentStep === 1}
      >
        <View
          style={[
            styles.breadcrumbCircle,
            currentStep === 1 && styles.breadcrumbCircleActive,
            currentStep > 1 && styles.breadcrumbCircleCompleted,
          ]}
        >
          {currentStep > 1 ? (
            <Icon name="check" size={14} color={Colors.white} />
          ) : (
            <Text
              style={[
                styles.breadcrumbNumber,
                currentStep === 1 && styles.breadcrumbNumberActive,
              ]}
            >
              1
            </Text>
          )}
        </View>
        <Text
          style={[
            styles.breadcrumbLabel,
            currentStep === 1 && styles.breadcrumbLabelActive,
          ]}
        >
          Basic Info
        </Text>
      </TouchableOpacity>

      <View style={styles.breadcrumbLine} />

      <TouchableOpacity
        style={[
          styles.breadcrumbStep,
          currentStep === 2 && styles.breadcrumbStepActive,
        ]}
        disabled
      >
        <View
          style={[
            styles.breadcrumbCircle,
            currentStep === 2 && styles.breadcrumbCircleActive,
          ]}
        >
          <Text
            style={[
              styles.breadcrumbNumber,
              currentStep === 2 && styles.breadcrumbNumberActive,
            ]}
          >
            2
          </Text>
        </View>
        <Text
          style={[
            styles.breadcrumbLabel,
            currentStep === 2 && styles.breadcrumbLabelActive,
          ]}
        >
          Content
        </Text>
      </TouchableOpacity>
    </View>
  )

  // Step 1: Basic Info (Priority, Heading, Subheading)
  const renderStep1 = () => (
    <View style={styles.formSection}>
      {/* Tag Selection */}
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Priority Level *</Text>
        <Text style={styles.labelHint}>
          Choose the priority level for this announcement
        </Text>
        <View style={styles.tagSelector}>
          {tags.map((tag) => (
            <TouchableOpacity
              key={tag.value}
              style={[
                styles.tagOption,
                formData.tag === tag.value && {
                  backgroundColor: tag.color,
                  borderColor: tag.color,
                },
              ]}
              onPress={() => setFormData({ ...formData, tag: tag.value })}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tagOptionText,
                  formData.tag === tag.value && styles.tagOptionTextSelected,
                ]}
              >
                {tag.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Heading */}
      <Form
        label="Heading *"
        variant="simple"
        size="large"
        value={formData.heading}
        onChangeText={(text) => {
          setFormData({ ...formData, heading: text })
          if (errors.heading) setErrors({ ...errors, heading: '' })
        }}
        placeholder="e.g., School Closure Due to Weather"
        maxLength={60}
        error={errors.heading}
      />
      <Text style={styles.charCount}>
        {formData.heading.length}/60 characters
      </Text>

      {/* Subheading */}
      <Form
        label="Subheading (Optional)"
        variant="simple"
        size="large"
        value={formData.subheading}
        onChangeText={(text) =>
          setFormData({ ...formData, subheading: text })
        }
        placeholder="e.g., Important information regarding..."
        maxLength={120}
      />
      <Text style={styles.charCount}>
        {formData.subheading.length}/120 characters
      </Text>

      {/* Next Button */}
      <View style={styles.buttonGroup}>
        <Button
          label="Next"
          onPress={handleNextStep}
          variant="primary"
          size="large"
          fullWidth
        />
      </View>
    </View>
  )

  // Step 2: Content (Title, Description)
  const renderStep2 = () => (
    <View style={styles.formSection}>
      {/* Title */}
      <Form
        label="Article Title *"
        variant="simple"
        size="large"
        value={formData.title}
        onChangeText={(text) => {
          setFormData({ ...formData, title: text })
          if (errors.title) setErrors({ ...errors, title: '' })
        }}
        placeholder="e.g., Important Notice: School Closure..."
        error={errors.title}
      />

      {/* Description */}
      <Form
        label="Article Content *"
        variant="simple"
        size="large"
        value={formData.description}
        onChangeText={(text) => {
          setFormData({ ...formData, description: text })
          if (errors.description) setErrors({ ...errors, description: '' })
        }}
        placeholder="Write the full article content here..."
        multiline
        numberOfLines={12}
        textAlignVertical="top"
        inputStyle={{ minHeight: 200 }}
        error={errors.description}
      />
      <Text style={styles.charCount}>
        {formData.description.length} characters
      </Text>

      {/* Action Buttons */}
      <View style={styles.buttonRow}>
        <View style={styles.buttonHalf}>
          <Button
            label="Back"
            onPress={handleBackStep}
            variant="secondary"
            size="large"
            fullWidth
            icon={<Icon name="arrow-left" size={18} color="#371B34" />}
          />
        </View>
        <View style={styles.buttonHalf}>
          <Button
            label={isEditMode ? 'Update Article' : 'Publish Article'}
            onPress={handlePublish}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>
      </View>
    </View>
  )

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>
          {isEditMode ? 'Edit Announcement' : 'Post Announcement'}
        </Text>
        <Text style={styles.pageSubtitle}>
          {isEditMode
            ? 'Update your announcement information'
            : 'Share important information with parents'}
        </Text>

        {/* Breadcrumb */}
        {renderBreadcrumb()}

        {/* Step Content */}
        {currentStep === 1 ? renderStep1() : renderStep2()}

        {/* Publishing Tips */}
        <View style={styles.infoNote}>
          <Icon name="lightbulb-o" size={16} color={Colors.primary[600]} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Publishing Tips</Text>
            <Text style={styles.infoText}>
              • Use clear and concise language{'\n'}
              • Include all important details (dates, times, locations){'\n'}
              • Proofread before publishing{'\n'}
              • Use appropriate priority level{'\n'}
              • Parents will be notified via push notification
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title={isEditMode ? 'Article Updated!' : 'Article Published!'}
        message={
          isEditMode
            ? 'Your announcement has been updated successfully.'
            : 'Your announcement has been published and parents will be notified.'
        }
        onClose={handleSuccessClose}
      />

      {/* Error Modal */}
      <ResultModal
        visible={showErrorModal}
        variant="error"
        title="Operation Failed"
        message={errorMessage}
        onClose={() => setShowErrorModal(false)}
        buttonText="Try Again"
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
    gap: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
  },
  pageSubtitle: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  breadcrumbContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.xs,
  },
  breadcrumbStep: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  breadcrumbStepActive: {
    // Active step styling handled by circle and label
  },
  breadcrumbStepCompleted: {
    // Completed step styling handled by circle
  },
  breadcrumbCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.neutral[200],
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.neutral[300],
  },
  breadcrumbCircleActive: {
    backgroundColor: '#371B34',
    borderColor: '#371B34',
  },
  breadcrumbCircleCompleted: {
    backgroundColor: '#371B34',
    borderColor: '#371B34',
  },
  breadcrumbNumber: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '700',
    color: Colors.text.secondary,
  },
  breadcrumbNumberActive: {
    color: Colors.white,
  },
  breadcrumbLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  breadcrumbLabelActive: {
    color: '#371B34',
  },
  breadcrumbLine: {
    width: 40,
    height: 2,
    backgroundColor: Colors.neutral[300],
    marginHorizontal: Spacing.xs,
  },
  formSection: {
    gap: Spacing.md,
  },
  inputGroup: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
  },
  labelHint: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    marginTop: -Spacing.xs / 2,
  },
  tagSelector: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  tagOption: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    borderWidth: 2,
    borderColor: Colors.border.light,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  tagOptionText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  tagOptionTextSelected: {
    color: Colors.white,
  },
  charCount: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    textAlign: 'right',
    marginTop: -Spacing.sm,
    marginBottom: Spacing.sm,
  },
  buttonGroup: {
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.md,
  },
  buttonHalf: {
    flex: 1,
  },
  infoNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.primary[50],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.primary[200],
  },
  infoTextContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  infoTitle: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.primary[700],
  },
  infoText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.primary[700],
    lineHeight: 18,
  },
})

export { CreateFeed }
