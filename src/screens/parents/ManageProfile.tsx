import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { mockParentData } from '../../data/MockParent'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'

type ManageProfileNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'TabNavigator'
>

const ManageProfile = () => {
  const navigation = useNavigation<ManageProfileNavigationProp>()

  // Initialize state with mock data
  const [formData, setFormData] = useState({
    name: mockParentData.name,
    email: mockParentData.email,
    phone: mockParentData.phone,
    emergencyContact: mockParentData.emergencyContact,
  })

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const handleSave = () => {
    // Here you would typically save to backend/state management
    console.log('Saving profile data:', formData)
    // Show success message or navigate back
  }

  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name[0]?.toUpperCase() || 'U'
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

          {/* Email */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="envelope"
                size={16}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={text => setFormData({ ...formData, email: text })}
                placeholder="Enter your email"
                placeholderTextColor={Colors.text.disabled}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
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
                value={formData.phone}
                onChangeText={text => setFormData({ ...formData, phone: text })}
                placeholder="Enter your phone number"
                placeholderTextColor={Colors.text.disabled}
                keyboardType="phone-pad"
              />
            </View>
          </View>

          {/* Emergency Contact */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Emergency Contact</Text>
            <View style={styles.inputContainer}>
              <Icon
                name="phone-square"
                size={18}
                color={Colors.text.secondary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={formData.emergencyContact}
                onChangeText={text =>
                  setFormData({ ...formData, emergencyContact: text })
                }
                placeholder="Enter emergency contact number"
                placeholderTextColor={Colors.text.disabled}
                keyboardType="phone-pad"
              />
            </View>
          </View>
        </View>

        {/* Save Button */}
        <Button
          label="Save Changes"
          onPress={handleSave}
          variant="primary"
          size="large"
          fullWidth
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
