import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, PasswordInput, SuccessModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'

type ChangePasswordNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'TeacherTabNavigator'
>

const ChangePassword = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>()

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleChangePassword = () => {
    // Clear previous errors
    setErrors({ currentPassword: '', newPassword: '', confirmPassword: '' })

    // Validate form
    let hasError = false
    const newErrors = { currentPassword: '', newPassword: '', confirmPassword: '' }

    if (!passwordData.currentPassword.trim()) {
      newErrors.currentPassword = 'Please enter your current password'
      hasError = true
    }
    if (!passwordData.newPassword.trim()) {
      newErrors.newPassword = 'Please enter a new password'
      hasError = true
    } else if (passwordData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must be at least 8 characters'
      hasError = true
    } else if (!/[A-Z]/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one uppercase letter'
      hasError = true
    } else if (!/[0-9]/.test(passwordData.newPassword)) {
      newErrors.newPassword = 'Password must contain at least one number'
      hasError = true
    }
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
      hasError = true
    }

    if (hasError) {
      setErrors(newErrors)
      return
    }

    // Here you would typically call API to change password
    console.log('Changing password...')
    // Show success modal
    setShowSuccessModal(true)
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    // Navigate back on success
    navigation.goBack()
  }



  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Change Password</Text>
        <Text style={styles.pageSubtitle}>
          Create a strong password to keep your account secure
        </Text>

        {/* Change Password Form */}
        <View style={styles.formSection}>
          {/* Current Password */}
          <PasswordInput
            label="Current Password"
            variant="simple"
            size="large"
            value={passwordData.currentPassword}
            onChangeText={text => setPasswordData({ ...passwordData, currentPassword: text })}
            placeholder="Enter current password"
            error={errors.currentPassword}
          />

          {/* New Password */}
          <PasswordInput
            label="New Password"
            variant="simple"
            size="large"
            value={passwordData.newPassword}
            onChangeText={text => setPasswordData({ ...passwordData, newPassword: text })}
            placeholder="Enter new password"
            error={errors.newPassword}
          />

          {/* Confirm Password */}
          <PasswordInput
            label="Confirm New Password"
            variant="simple"
            size="large"
            value={passwordData.confirmPassword}
            onChangeText={text => setPasswordData({ ...passwordData, confirmPassword: text })}
            placeholder="Confirm new password"
            error={errors.confirmPassword}
          />

          {/* Password Requirements */}
          <View style={styles.requirementsBox}>
            <Text style={styles.requirementsTitle}>Password Requirements:</Text>
            <View style={styles.requirementItem}>
              <Icon
                name="check-circle"
                size={14}
                color={
                  passwordData.newPassword.length >= 8
                    ? Colors.success.main
                    : Colors.neutral[400]
                }
              />
              <Text style={styles.requirementText}>At least 8 characters</Text>
            </View>
            <View style={styles.requirementItem}>
              <Icon
                name="check-circle"
                size={14}
                color={
                  /[A-Z]/.test(passwordData.newPassword)
                    ? Colors.success.main
                    : Colors.neutral[400]
                }
              />
              <Text style={styles.requirementText}>
                One uppercase letter (A-Z)
              </Text>
            </View>
            <View style={styles.requirementItem}>
              <Icon
                name="check-circle"
                size={14}
                color={
                  /[0-9]/.test(passwordData.newPassword)
                    ? Colors.success.main
                    : Colors.neutral[400]
                }
              />
              <Text style={styles.requirementText}>One number (0-9)</Text>
            </View>
          </View>

          {/* Update Password Button */}
          <Button
            label="Update Password"
            onPress={handleChangePassword}
            variant="primary"
            size="large"
            fullWidth
          />
        </View>

        {/* Security Tips */}
        <View style={styles.infoNote}>
          <Icon name="shield" size={16} color={Colors.warning.main} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Security Tips</Text>
            <Text style={styles.infoText}>
              " Never share your password with anyone{'\n'}
              " Use a unique password for this account{'\n'}
              " Avoid using common words or patterns{'\n'}
              " Update your password regularly
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Password Updated!"
        message="Your password has been changed successfully. Please use your new password the next time you log in."
        onClose={handleSuccessClose}
        buttonText="Done"
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
  formSection: {
    gap: Spacing.lg,
  },
  inputGroup: {
    gap: Spacing.xs,
  },
  label: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border.light,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    height: 56,
  },
  inputIcon: {
    marginRight: Spacing.sm,
  },
  input: {
    flex: 1,
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '400',
    color: Colors.black,
    padding: 0,
  },
  eyeButton: {
    padding: Spacing.xs,
  },
  requirementsBox: {
    backgroundColor: Colors.neutral[50],
    padding: Spacing.md,
    borderRadius: BorderRadius.md,
    gap: Spacing.xs,
  },
  requirementsTitle: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  requirementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  requirementText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  infoNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#FFF3E0',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning.light,
  },
  infoTextContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  infoTitle: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.warning.dark,
  },
  infoText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.warning.dark,
    lineHeight: 18,
  },
})

export { ChangePassword }
