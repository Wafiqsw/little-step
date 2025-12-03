import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Form, Button, SuccessModal } from '../../components'
import { Typography, Colors, Spacing } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { doc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { createData } from '../../firebase/firestore'

type AddPickupPersonNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'AddPickupPerson'>

interface FormData {
  name: string
  phoneNumber: string
  relationship: string
}

interface FormErrors {
  name?: string
  phoneNumber?: string
  relationship?: string
}

const AddPickupPerson = () => {
  const navigation = useNavigation<AddPickupPersonNavigationProp>()
  const [formData, setFormData] = useState<FormData>({
    name: '',
    phoneNumber: '',
    relationship: '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required'
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

  const handleSave = async () => {
    if (validateForm()) {
      try {
        setIsSaving(true)
        const currentUser = auth.currentUser

        if (!currentUser) {
          console.error('No authenticated user found')
          return
        }

        // Create reference to current user
        const userRef = doc(db, 'users', currentUser.uid)

        // Create authorized person data
        const authorizedPersonData = {
          name: formData.name.trim(),
          numphone: formData.phoneNumber.trim(),
          relationship: formData.relationship.trim(),
          age: 0, // Default age
          archived: false,
          assigned_by: userRef,
        }

        // Save to Firestore
        await createData('authorised_person', authorizedPersonData)

        console.log('✅ Pickup person added successfully')
        setShowSuccessModal(true)
      } catch (error) {
        console.error('❌ Error adding pickup person:', error)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleClearAll = () => {
    setFormData({
      name: '',
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
                label="Name"
                variant="simple"
                placeholder="Enter full name"
                keyboardType="default"
                value={formData.name}
                onChangeText={(text) => {
                  setFormData({ ...formData, name: text })
                  if (errors.name) setErrors({ ...errors, name: '' })
                }}
                error={errors.name}
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
                    label={isSaving ? "Saving..." : "Save Profile"}
                    onPress={handleSave}
                    variant="primary"
                    disabled={isSaving}
                />
            </View>
            <View style={styles.secondaryButtonWrapper}>
                <Button
                    label="Clear All"
                    onPress={handleClearAll}
                    variant="secondary"
                    disabled={isSaving}
                />
            </View>
      </View>

        </ScrollView>

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          title="Pickup Person Added!"
          message={`${formData.name} has been successfully added as a pickup person.`}
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