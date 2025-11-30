import React from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Button } from './Button'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'

interface ErrorBoundaryProps {
  children: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
  errorInfo: React.ErrorInfo | null
}

class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    this.setState({
      error,
      errorInfo,
    })
    // You can log the error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  handleTryAgain = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    console.log('ErrorBoundary render - hasError:', this.state.hasError)

    if (this.state.hasError) {
      console.log('ErrorBoundary - Showing error screen')
      return <ErrorFallbackScreen
        error={this.state.error}
        errorInfo={this.state.errorInfo}
        onTryAgain={this.handleTryAgain}
      />
    }

    console.log('ErrorBoundary - Rendering children')
    return this.props.children
  }
}

interface ErrorFallbackScreenProps {
  error: Error | null
  errorInfo: React.ErrorInfo | null
  onTryAgain: () => void
}

const ErrorFallbackScreen: React.FC<ErrorFallbackScreenProps> = ({
  error,
  errorInfo,
  onTryAgain,
}) => {
  const [showDetails, setShowDetails] = React.useState(false)

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Error Icon */}
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <Icon name="exclamation-triangle" size={64} color="#FF4979" />
          </View>
        </View>

        {/* Error Title */}
        <Text style={styles.title}>Oops! Something went wrong</Text>

        {/* Error Description */}
        <Text style={styles.description}>
          We encountered an unexpected error. Don't worry, this has been
          reported to our team. Please try again or go back to the home screen.
        </Text>

        {/* Error Message (if available) */}
        {error && (
          <View style={styles.errorMessageContainer}>
            <View style={styles.errorMessageHeader}>
              <Icon name="info-circle" size={16} color={Colors.error.main} />
              <Text style={styles.errorMessageTitle}>Error Details</Text>
            </View>
            <Text style={styles.errorMessage} numberOfLines={3}>
              {error.message || 'Unknown error occurred'}
            </Text>
          </View>
        )}

        {/* Technical Details Toggle */}
        {(error || errorInfo) && (
          <TouchableOpacity
            style={styles.detailsToggle}
            onPress={() => setShowDetails(!showDetails)}
            activeOpacity={0.7}
          >
            <Text style={styles.detailsToggleText}>
              {showDetails ? 'Hide' : 'Show'} Technical Details
            </Text>
            <Icon
              name={showDetails ? 'chevron-up' : 'chevron-down'}
              size={14}
              color={Colors.primary[600]}
            />
          </TouchableOpacity>
        )}

        {/* Technical Details */}
        {showDetails && (error || errorInfo) && (
          <View style={styles.technicalDetails}>
            {error && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Error Name:</Text>
                <Text style={styles.detailValue}>
                  {error.name || 'Error'}
                </Text>
              </View>
            )}

            {error && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Error Message:</Text>
                <Text style={styles.detailValue}>{error.message}</Text>
              </View>
            )}

            {error?.stack && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Stack Trace:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.stackTraceScroll}
                >
                  <Text style={styles.stackTrace}>{error.stack}</Text>
                </ScrollView>
              </View>
            )}

            {errorInfo?.componentStack && (
              <View style={styles.detailSection}>
                <Text style={styles.detailLabel}>Component Stack:</Text>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  style={styles.stackTraceScroll}
                >
                  <Text style={styles.stackTrace}>
                    {errorInfo.componentStack}
                  </Text>
                </ScrollView>
              </View>
            )}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <Button
            label="Try Again"
            onPress={onTryAgain}
            variant="primary"
            size="large"
            fullWidth
            icon={<Icon name="refresh" size={18} color={Colors.white} />}
          />
        </View>

        {/* Help Section */}
        <View style={styles.helpSection}>
          <Icon name="question-circle" size={16} color={Colors.text.secondary} />
          <View style={styles.helpTextContainer}>
            <Text style={styles.helpTitle}>Need Help?</Text>
            <Text style={styles.helpText}>
              If this problem persists, please contact support with the error
              details shown above.
            </Text>
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
    flexGrow: 1,
    justifyContent: 'center',
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
    alignItems: 'center',
  },
  iconContainer: {
    marginVertical: Spacing.xl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FFF0F0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFD6D6',
  },
  title: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.text.primary,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  description: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: Spacing.xl,
    paddingHorizontal: Spacing.md,
  },
  errorMessageContainer: {
    width: '100%',
    backgroundColor: '#FFF5F5',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#FFD6D6',
    marginBottom: Spacing.md,
  },
  errorMessageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.xs,
  },
  errorMessageTitle: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.error.main,
  },
  errorMessage: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.error.dark,
    fontFamily: 'monospace',
  },
  detailsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  detailsToggleText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.primary[600],
  },
  technicalDetails: {
    width: '100%',
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    marginBottom: Spacing.xl,
    gap: Spacing.md,
  },
  detailSection: {
    gap: Spacing.xs,
  },
  detailLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.text.secondary,
  },
  detailValue: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.primary,
    fontFamily: 'monospace',
  },
  stackTraceScroll: {
    maxHeight: 150,
  },
  stackTrace: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.primary,
    fontFamily: 'monospace',
    lineHeight: 18,
  },
  buttonContainer: {
    width: '100%',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  helpSection: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
    width: '100%',
  },
  helpTextContainer: {
    flex: 1,
    gap: Spacing.xs / 2,
  },
  helpTitle: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  helpText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    lineHeight: 18,
  },
})

export { ErrorBoundary }
