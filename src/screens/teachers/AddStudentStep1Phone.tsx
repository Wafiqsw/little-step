import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, ConfirmationModal, Form } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { searchParentByPhone, Parent } from '../../data/MockStudentParent'
import { normalizePhoneNumber, isValidMalaysianPhoneNumber } from '../../utils'
import Icon from 'react-native-vector-icons/FontAwesome'

type Step1NavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'TeacherAddStudentStep1Phone'
>

const AddStudentStep1Phone = () => {
    const navigation = useNavigation<Step1NavigationProp>()
    const [phoneNumber, setPhoneNumber] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [foundParent, setFoundParent] = useState<Parent | null>(null)
    const [error, setError] = useState('')

    const handleAvatarPress = () => {
        navigation.navigate('TeacherProfile')
    }

    const handleCheckPhone = () => {
        // Clear previous errors
        setError('')

        if (!phoneNumber.trim()) {
            setError('Please enter a phone number')
            return
        }

        // Validate phone number format
        if (!isValidMalaysianPhoneNumber(phoneNumber)) {
            setError('Please enter a valid Malaysian phone number (e.g., 0123456789 or +60123456789)')
            return
        }

        // Normalize phone number
        const normalizedPhone = normalizePhoneNumber(phoneNumber)

        const existingParent = searchParentByPhone(normalizedPhone)
        if (existingParent) {
            // Parent found - show modal
            setFoundParent(existingParent)
            setShowModal(true)
        } else {
            // Parent not found - go to step 2 with empty form
            navigation.navigate('TeacherAddStudentStep2Parent', {
                phoneNumber: normalizedPhone,
                existingParent: null,
            })
        }
    }

    const handleUseExisting = () => {
        setShowModal(false)
        const normalizedPhone = normalizePhoneNumber(phoneNumber)
        navigation.navigate('TeacherAddStudentStep2Parent', {
            phoneNumber: normalizedPhone,
            existingParent: foundParent,
        })
    }

    const handleCreateNew = () => {
        setShowModal(false)
        const normalizedPhone = normalizePhoneNumber(phoneNumber)
        navigation.navigate('TeacherAddStudentStep2Parent', {
            phoneNumber: normalizedPhone,
            existingParent: null,
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header showBackButton onAvatarPress={handleAvatarPress} />
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Add New Student</Text>
                <Text style={styles.pageSubtitle}>
                    Let's start by verifying the parent's contact information
                </Text>

                {/* Phone Verification Form */}
                <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                        <Icon name="phone" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Parent Phone Number</Text>
                    </View>
                    {/* Phone Number Input */}
                    <Form
                        label="Phone Number *"
                        variant="simple"
                        size="large"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                        placeholder="e.g., +60123456789 or 0123456789"
                        keyboardType="phone-pad"
                        error={error}
                    />

                    <View style={styles.infoNote}>
                        <Icon name="info-circle" size={16} color={Colors.primary[600]} />
                        <Text style={styles.infoText}>
                            We'll check if this parent is already registered in our system
                        </Text>
                    </View>
                </View>

                <Button
                    label="Check Phone Number"
                    onPress={handleCheckPhone}
                    variant="primary"
                    size="large"
                    fullWidth
                    icon={<Icon name="search" size={18} color={Colors.white} />}
                />
            </ScrollView>

            {/* Parent Found Modal */}
            <ConfirmationModal
                visible={showModal}
                title="Parent Found"
                message={`We found an existing parent with this phone number:\n\n${foundParent?.name}\n${foundParent?.phoneNumber}\n\nWould you like to use this parent or create a new one?`}
                confirmText="Use Existing Parent"
                cancelText="Create New Parent"
                onConfirm={handleUseExisting}
                onCancel={handleCreateNew}
                iconName="user-circle"
                iconColor={Colors.primary[600]}
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
        gap: Spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs,
    },
    sectionTitle: {
        fontSize: Typography.heading.h2.fontSize as number,
        fontWeight: Typography.heading.h2.fontWeight as any,
        color: Colors.black,
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
        padding: Spacing.sm,
        backgroundColor: Colors.primary[50],
        borderRadius: BorderRadius.sm,
    },
    infoText: {
        flex: 1,
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.primary[700],
        lineHeight: 18,
    },
})

export { AddStudentStep1Phone }
