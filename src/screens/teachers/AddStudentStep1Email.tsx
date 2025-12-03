import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, ConfirmationModal, Form } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { normalizeEmail, isValidEmail } from '../../utils'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Users } from '../../types/Users'
import { getUserByEmail } from '../../firebase/firestore'

type Step1NavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'TeacherAddStudentStep1Email'
>

const AddStudentStep1Email = () => {
    const navigation = useNavigation<Step1NavigationProp>()
    const [email, setEmail] = useState('')
    const [showModal, setShowModal] = useState(false)
    const [foundParent, setFoundParent] = useState<Users | null>(null)
    const [error, setError] = useState('')

    const handleAvatarPress = () => {
        navigation.navigate('TeacherProfile')
    }

    const handleCheckEmail = async () => {
        // Clear previous errors
        setError('')

        if (!email.trim()) {
            setError('Please enter an email address')
            return
        }

        // Validate email format
        if (!isValidEmail(email)) {
            setError('Please enter a valid email address')
            return
        }

        // Normalize email
        const normalizedEmail = normalizeEmail(email)

        try {
            // Check if parent exists in Firestore by email
            const existingParent = await getUserByEmail(normalizedEmail)
            console.log('Existing parent:', existingParent)

            if (existingParent) {
                // Parent found - show modal
                console.log('Setting foundParent:', existingParent)
                console.log('Setting showModal to true')
                setFoundParent(existingParent as any)
                setShowModal(true)
                console.log('Modal state updated')
            } else {
                // Parent not found - go to step 2 with empty form
                console.log('No parent found, navigating to step 2')
                navigation.navigate('TeacherAddStudentStep2Parent', {
                    email: normalizedEmail,
                    existingParent: null,
                })
            }
        } catch (error) {
            console.error('Error checking email:', error)
            setError('An error occurred while checking the email. Please try again.')
        }
    }

    const handleUseExisting = () => {
        setShowModal(false)
        const normalizedEmail = normalizeEmail(email)
        navigation.navigate('TeacherAddStudentStep2Parent', {
            email: normalizedEmail,
            existingParent: foundParent,
        })
    }

    const handleCreateNew = () => {
        setShowModal(false)
        const normalizedEmail = normalizeEmail(email)
        navigation.navigate('TeacherAddStudentStep2Parent', {
            email: normalizedEmail,
            existingParent: null,
        })
    }

    const handleCloseModal = () => {
        setShowModal(false)
        setFoundParent(null)
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
                    Let's start by verifying the parent's email address
                </Text>

                {/* Email Verification Form */}
                <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                        <Icon name="envelope" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Parent Email Address</Text>
                    </View>
                    {/* Email Input */}
                    <Form
                        label="Email Address *"
                        variant="simple"
                        size="large"
                        value={email}
                        onChangeText={setEmail}
                        placeholder="e.g., parent@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
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
                    label="Check Email Address"
                    onPress={handleCheckEmail}
                    variant="primary"
                    size="large"
                    fullWidth
                    icon={<Icon name="search" size={18} color={Colors.white} />}
                />
            </ScrollView>

            <ConfirmationModal
                visible={showModal}
                title="Parent Found"
                message={`We found an existing parent with this email address:\n\n${foundParent?.name}\n${foundParent?.email}\n\nWould you like to use this parent or create a new one?`}
                confirmText="Use Existing Parent"
                cancelText="Create New Parent"
                onConfirm={handleUseExisting}
                onCancel={handleCreateNew}
                onClose={handleCloseModal}
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

export { AddStudentStep1Email }
