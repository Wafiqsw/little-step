import React, { useState, useEffect } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, SuccessModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'
import { auth } from '../../firebase'
import { getDataById, updateData } from '../../firebase/firestore'
import { Users } from '../../types/Users'

type ManageProfileNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'ParentTabNavigator'
>

const ManageProfile = () => {
  const navigation = useNavigation<ManageProfileNavigationProp>()

  // Initialize state with Users type fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    numphone: '',
    ic: '',
    address: '',
    occupation: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const currentUser = auth.currentUser
        if (!currentUser) {
          console.error('No authenticated user found')
          setIsFetching(false)
          return
        }

        const userData = await getDataById<Users>('users', currentUser.uid)
        if (userData) {
          setFormData({
            name: userData.name || '',
            email: userData.email || '',
            numphone: userData.numphone || '',
            ic: userData.ic || '',
            address: userData.address || '',
            occupation: userData.occupation || '',
          })
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchUserData()
  }, [])

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const handleSave = async () => {
    try {
      setIsLoading(true)
      const currentUser = auth.currentUser

      if (!currentUser) {
        console.error('No authenticated user found')
        return
      }

      // Update user data in Firestore
      await updateData('users', currentUser.uid, {
        name: formData.name,
        numphone: formData.numphone,
        ic: formData.ic,
        address: formData.address,
        occupation: formData.occupation,
        // Email is not updated here (should use Firebase Auth to change email)
      })

      console.log('Profile updated successfully')
      setShowSuccessModal(true)
    } catch (error) {
      console.error('Error updating profile:', error)
      // You might want to show an error modal here
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuccessClose = () => {
    setShowSuccessModal(false)
    // Navigate back on success
    navigation.goBack()
  }

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name[0]?.toUpperCase() || 'U'
  }

  // Show loading state while fetching data
  if (isFetching) {
    return (
      <SafeAreaView style={styles.container}>
        <Header showBackButton onAvatarPress={handleAvatarPress} />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#371B34" />
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Edit Profile</Text>

        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(formData.name)}</Text>
          </View>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="user"
                size={18}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.name}
                onChangeText={text => setFormData({ ...formData, name: text })}
                placeholder="Enter your full name"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>
          </View>

          {/* Email - Read Only */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={[styles.inputContainer, styles.inputDisabled]}>
              <Icon
                name="envelope"
                size={16}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={[styles.input, styles.inputTextDisabled]}
                value={formData.email}
                placeholder="Email address"
                placeholderTextColor={Colors.text.disabled}
                editable={false}
              />
            </View>
            <Text style={styles.helperText}>Email cannot be changed</Text>
          </View>

          {/* Phone Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="phone"
                size={18}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.numphone}
                onChangeText={text => setFormData({ ...formData, numphone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.text.disabled}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* IC Number */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>IC Number</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="id-card"
                size={16}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.ic}
                onChangeText={text => setFormData({ ...formData, ic: text })}
                placeholder="Enter your IC number"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>
          </View>

          {/* Address */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Address</Text>
            <View style={[styles.inputContainer, styles.textAreaContainer]}>
              <Icon
                name="home"
                size={18}
                color={Colors.text.secondary}
                style={[styles.inputIcon, styles.textAreaIcon]}
              />
              <TextInput
                style={[styles.input, styles.textArea]}
                value={formData.address}
                onChangeText={text => setFormData({ ...formData, address: text })}
                placeholder="Enter your address"
                placeholderTextColor={Colors.text.disabled}
                multiline
                numberOfLines={3}
              />
            </View>
          </View>

          {/* Occupation */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Occupation</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="briefcase"
                size={16}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.occupation}
                onChangeText={text => setFormData({ ...formData, occupation: text })}
                placeholder="Enter your occupation"
                placeholderTextColor={Colors.text.disabled}
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <Button
          label={isLoading ? "Saving..." : "Save Changes"}
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
          disabled={isLoading}
        />

        {/* Info Note */}
        <View style={styles.infoNote}>
          <Icon name="info-circle" size={16} color={Colors.info.main} />
          <Text style={styles.infoText}>
            Your information is secure and will only be used for school
            communication and emergency purposes.
          </Text>
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Profile Updated!"
        message="Your profile information has been updated successfully."
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
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
  avatarSection: {
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.lg,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#371B34',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.neutral[200],
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.white,
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
  inputDisabled: {
    backgroundColor: Colors.neutral[100],
  },
  inputTextDisabled: {
    color: Colors.text.secondary,
  },
  helperText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
    marginTop: 4,
  },
  textAreaContainer: {
    height: 'auto',
    minHeight: 100,
    alignItems: 'flex-start',
    paddingVertical: Spacing.sm,
  },
  textAreaIcon: {
    marginTop: 4,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
    paddingTop: 0,
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
  infoText: {
    flex: 1,
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.primary[700],
    lineHeight: 18,
  },
})

export { ManageProfile }
