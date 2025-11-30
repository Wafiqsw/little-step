import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Form, Button, SuccessModal } from '../../components'
import { Typography, Colors, Spacing } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'

type AddPickupPersonNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'AddPickupPerson'>

interface FormData {
  firstName: string
  lastName: string
  phoneNumber: string
  relationship: string
}

interface FormErrors {
  firstName?: string
  lastName?: string
  phoneNumber?: string
  relationship?: string
}

const AddPickupPerson = () => {
  const navigation = useNavigation<AddPickupPersonNavigationProp>()
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    relationship: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required'
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required'
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Phone number is required'
    } else if (!/^\d{10,}$/.test(formData.phoneNumber.replace(/[\s-]/g, ''))) {
      newErrors.phoneNumber = 'Please enter a valid phone number'
    }

    if (!formData.relationship.trim()) {
      newErrors.relationship = 'Relationship is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = () => {
    if (validateForm()) {
      // Save the pickup person data
      console.log('Saving pickup person:', formData)
      setShowSuccessModal(true)
    }
  }

  const handleClearAll = () => {
    setFormData({
      firstName: '',
      lastName: '',
      phoneNumber: '',
      relationship: '',
    })
    setErrors({})
  }

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false)
    navigation.goBack()
  }

  return (
    <SafeAreaView style={styles.container}>
        <Header showBackButton={true} onAvatarPress={handleAvatarPress}/>
        <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        >
        <Text style={styles.dashboardTitle}>Add New Pick Up Person</Text>

        <View style={styles.pickupBox}>
            <Text style={styles.sectionTitle}>Personal Info</Text>
            <Form
                label="First Name"
                variant="simple"
                placeholder="Enter first name"
                keyboardType="default"
                value={formData.firstName}
                onChangeText={(text) => {
                  setFormData({ ...formData, firstName: text })
                  if (errors.firstName) setErrors({ ...errors, firstName: '' })
                }}
                error={errors.firstName}
            />
            <Form
                label="Last Name"
                variant="simple"
                placeholder="Enter last name"
                keyboardType="default"
                value={formData.lastName}
                onChangeText={(text) => {
                  setFormData({ ...formData, lastName: text })
                  if (errors.lastName) setErrors({ ...errors, lastName: '' })
                }}
                error={errors.lastName}
            />
            <Form
                label="Phone Number"
                variant="simple"
                placeholder="Enter phone number"
                keyboardType="phone-pad"
                value={formData.phoneNumber}
                onChangeText={(text) => {
                  setFormData({ ...formData, phoneNumber: text })
                  if (errors.phoneNumber) setErrors({ ...errors, phoneNumber: '' })
                }}
                error={errors.phoneNumber}
            />
            <Form
                label="Relationship"
                variant="simple"
                placeholder="Enter relationship (e.g., Uncle, Aunt, Grandparent)"
                keyboardType="default"
                value={formData.relationship}
                onChangeText={(text) => {
                  setFormData({ ...formData, relationship: text })
                  if (errors.relationship) setErrors({ ...errors, relationship: '' })
                }}
                error={errors.relationship}
            />
        </View>

        <View style={styles.buttonContainer}>
            <View style={styles.primaryButtonWrapper}>
                <Button
                    label="Save Profile"
                    onPress={handleSave}
                    variant="primary"
                />
            </View>
            <View style={styles.secondaryButtonWrapper}>
                <Button
                    label="Clear All"
                    onPress={handleClearAll}
                    variant="secondary"
                />
            </View>
      </View>

        </ScrollView>

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          title="Pickup Person Added!"
          message={`${formData.firstName} ${formData.lastName} has been successfully added as a pickup person.`}
          onClose={handleSuccessModalClose}
        />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent:{
        padding: 16,
        gap: Spacing.md,
    },
    dashboardTitle: {
        fontSize: Typography.heading.h1.fontSize as number,
        fontWeight: Typography.heading.h1.fontWeight as any,
        color: Colors.black,
        marginBottom: Spacing.md,
    },
    pickupBox: {
        backgroundColor: Colors.white,
        borderRadius: 16,
        padding: Spacing.lg,
        gap: Spacing.md,
        shadowColor: '#000',
        shadowOffset: {
        width: 0,
        height: 1,
        },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
        borderWidth: 1,
        borderColor: '#BDBDBD',
    },
    sectionTitle: {
        fontSize: Typography.heading.h3.fontSize as number,
        fontWeight: Typography.heading.h3.fontWeight as any,
        color: Colors.black,
        marginTop: Spacing.md,
        marginBottom: Spacing.sm,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: Spacing.sm,
        marginTop: Spacing.md,
    },
    primaryButtonWrapper: {
        flex: 2,
    },
    secondaryButtonWrapper: {
        flex: 1,
    },
})

export {AddPickupPerson}