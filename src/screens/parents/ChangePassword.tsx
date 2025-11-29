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
import { Header, Button } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'

type ChangePasswordNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'ParentTabNavigator'
>

const ChangePassword = () => {
  const navigation = useNavigation<ChangePasswordNavigationProp>()

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const handleChangePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.log('Passwords do not match')
      return
    }

    if (passwordData.newPassword.length < 8) {
      console.log('Password must be at least 8 characters')
      return
    }

    // Here you would typically call API to change password
    console.log('Changing password...')
    // Navigate back on success
    // navigation.goBack()
  }

  const togglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
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
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={18}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={passwordData.currentPassword}
                onChangeText={text =>
                  setPasswordData({ ...passwordData, currentPassword: text })
                }
                placeholder="Enter current password"
                placeholderTextColor={Colors.text.disabled}
                secureTextEntry={!showPasswords.current}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('current')}
                style={styles.eyeButton}
              >
                <Icon
                  name={showPasswords.current ? 'eye' : 'eye-slash'}
                  size={18}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* New Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={18}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={passwordData.newPassword}
                onChangeText={text =>
                  setPasswordData({ ...passwordData, newPassword: text })
                }
                placeholder="Enter new password"
                placeholderTextColor={Colors.text.disabled}
                secureTextEntry={!showPasswords.new}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('new')}
                style={styles.eyeButton}
              >
                <Icon
                  name={showPasswords.new ? 'eye' : 'eye-slash'}
                  size={18}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Confirm Password */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Confirm New Password</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="lock"
                size={18}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={passwordData.confirmPassword}
                onChangeText={text =>
                  setPasswordData({ ...passwordData, confirmPassword: text })
                }
                placeholder="Confirm new password"
                placeholderTextColor={Colors.text.disabled}
                secureTextEntry={!showPasswords.confirm}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => togglePasswordVisibility('confirm')}
                style={styles.eyeButton}
              >
                <Icon
                  name={showPasswords.confirm ? 'eye' : 'eye-slash'}
                  size={18}
                  color={Colors.text.secondary}
                />
              </TouchableOpacity>
            </View>
          </View>

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
