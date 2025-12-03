import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, Breadcrumb, SuccessModal, Form } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'
import { sendVerificationEmail } from '../../firebase/emailFunctions'

type Step3NavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'TeacherAddStudentStep3Student'
>

type Step3RouteProp = RouteProp<MainNavigatorParamList, 'TeacherAddStudentStep3Student'>

const AddStudentStep3Student = () => {
    const navigation = useNavigation<Step3NavigationProp>()
    const route = useRoute<Step3RouteProp>()
    const { email, parentName, parentPhone, isExistingParent, existingParent } = route.params

    const [formData, setFormData] = useState({
        studentName: '',
        class: 'Year 1 Amanah',
        age: '',
        gender: 'male' as 'male' | 'female',
    })
    const [errors, setErrors] = useState({
        studentName: '',
        class: '',
        age: '',
    })
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleAvatarPress = () => {
        navigation.navigate('TeacherProfile')
    }

    // Generate random 6-digit TOC (verification code)
    const generateTOC = (): string => {
        return Math.floor(100000 + Math.random() * 900000).toString()
    }

    // Handle registration - you can edit this later to save to Firebase
    const handleRegister = async () => {
        try {
            // Prepare parent data - use existingParent if available, otherwise create new
            const parentData = existingParent || {
                email: email,
                name: parentName,
                numphone: parentPhone || '',
                role: 'guardian' as const,
                toc: generateTOC(),
                ic: '',
                address: '',
                occupation: '',
                registered: false,
            }

            // Prepare student data matching Student type (sub-collection)
            const studentData = {
                name: formData.studentName,
                class: formData.class,
                age: Number(formData.age),
                gender: formData.gender as 'male' | 'female',
                guardianName: parentName,
                guardianEmail: email,
            }

            // Console log as JSON
            console.log(JSON.stringify({
                parentData,
                studentData
            }, null, 2))

            // Send verification email only for new parents
            if (!isExistingParent && parentData.toc) {
                console.log('Sending verification email to:', parentData.email)
                await sendVerificationEmail(
                    parentData.email,
                    parentData.toc,
                    parentData.name,
                    studentData.name
                )
                console.log('Verification email sent successfully!')
            }

            // Show success modal
            setShowSuccessModal(true)
        } catch (error) {
            console.error('Error during registration:', error)
            // You might want to show an error modal here
        }
    }

    const handleSubmit = () => {
        // Clear previous errors
        setErrors({ studentName: '', class: '', age: '' })

        // Validate form
        let hasError = false
        const newErrors = { studentName: '', class: '', age: '' }

        if (!formData.studentName.trim()) {
            newErrors.studentName = 'Please enter student name'
            hasError = true
        }
        if (!formData.class.trim()) {
            newErrors.class = 'Please enter class'
            hasError = true
        }
        if (!formData.age.trim()) {
            newErrors.age = 'Please enter age'
            hasError = true
        } else if (isNaN(Number(formData.age)) || Number(formData.age) < 1 || Number(formData.age) > 18) {
            newErrors.age = 'Please enter a valid age (1-18)'
            hasError = true
        }

        if (hasError) {
            setErrors(newErrors)
            return
        }

        // Call handleRegister to process registration
        handleRegister()
    }

    const handleSuccessClose = () => {
        setShowSuccessModal(false)
        // Navigate back to Manage Students
        navigation.navigate('TeacherManageStudent')
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header showBackButton onAvatarPress={handleAvatarPress} />

            {/* Breadcrumb */}
            <Breadcrumb
                steps={['Email', 'Parent Details', 'Student Details']}
                currentStep={2}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Student Information</Text>
                <Text style={styles.pageSubtitle}>
                    Enter the student's details to complete registration
                </Text>

                {/* Student Information Form */}
                <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                        <Icon name="graduation-cap" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Student Details</Text>
                    </View>

                    {/* Student Name */}
                    <Form
                        label="Student Name *"
                        variant="simple"
                        size="large"
                        value={formData.studentName}
                        onChangeText={(text) => setFormData({ ...formData, studentName: text })}
                        placeholder="e.g., Ahmad bin Ali"
                        error={errors.studentName}
                    />

                    {/* Class */}
                    <Form
                        label="Class *"
                        variant="simple"
                        size="large"
                        value={formData.class}
                        onChangeText={(text) => setFormData({ ...formData, class: text })}
                        placeholder="e.g., Year 1 Amanah"
                        error={errors.class}
                    />

                    {/* Age and Gender Row */}
                    <View style={styles.rowInputs}>
                        <View style={[{ flex: 1 }]}>
                            <Form
                                label="Age *"
                                variant="simple"
                                size="large"
                                value={formData.age}
                                onChangeText={(text) => setFormData({ ...formData, age: text })}
                                placeholder="7"
                                keyboardType="numeric"
                                error={errors.age}
                                containerStyle={{ marginBottom: 0 }}
                            />
                        </View>

                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Gender *</Text>
                            <View style={styles.genderSelector}>
                                <TouchableOpacity
                                    style={[
                                        styles.genderOption,
                                        formData.gender === 'male' && styles.genderOptionSelected,
                                    ]}
                                    onPress={() => setFormData({ ...formData, gender: 'male' })}
                                    activeOpacity={0.7}
                                >
                                    <Icon
                                        name="male"
                                        size={16}
                                        color={
                                            formData.gender === 'male'
                                                ? Colors.white
                                                : Colors.text.secondary
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.genderOptionText,
                                            formData.gender === 'male' &&
                                            styles.genderOptionTextSelected,
                                        ]}
                                    >
                                        Male
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[
                                        styles.genderOption,
                                        formData.gender === 'female' && styles.genderOptionSelected,
                                    ]}
                                    onPress={() => setFormData({ ...formData, gender: 'female' })}
                                    activeOpacity={0.7}
                                >
                                    <Icon
                                        name="female"
                                        size={16}
                                        color={
                                            formData.gender === 'female'
                                                ? Colors.white
                                                : Colors.text.secondary
                                        }
                                    />
                                    <Text
                                        style={[
                                            styles.genderOptionText,
                                            formData.gender === 'female' &&
                                            styles.genderOptionTextSelected,
                                        ]}
                                    >
                                        Female
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Important Note about Email */}
                {!isExistingParent && (
                    <View style={styles.importantNote}>
                        <Icon name="info-circle" size={20} color={Colors.primary[700]} />
                        <View style={styles.importantNoteContent}>
                            <Text style={styles.importantNoteTitle}>Important Note</Text>
                            <Text style={styles.importantNoteText}>
                                After registering the student, a verification code (TOC) will be sent
                                to the parent's email address. The parent needs to use
                                this code to create their account and access the parent portal.
                            </Text>
                        </View>
                    </View>
                )}

                <Button
                    label="Register Student"
                    onPress={handleSubmit}
                    variant="primary"
                    size="large"
                    fullWidth
                    icon={<Icon name="check" size={18} color={Colors.white} />}
                />
            </ScrollView>

            {/* Success Modal */}
            <SuccessModal
                visible={showSuccessModal}
                title="Student Registered Successfully!"
                message="The student has been added to the system. The parent will receive an email with instructions to create their account."
                onClose={handleSuccessClose}
                buttonText="Back to Manage Students"
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
    rowInputs: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    genderSelector: {
        flexDirection: 'row',
        gap: Spacing.sm,
    },
    genderOption: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 6,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.border.light,
        backgroundColor: Colors.white,
    },
    genderOptionSelected: {
        backgroundColor: '#371B34',
        borderColor: '#371B34',
    },
    genderOptionText: {
        fontSize: Typography.body.medium.fontSize as number,
        fontWeight: '600',
        color: Colors.text.secondary,
    },
    genderOptionTextSelected: {
        color: Colors.white,
    },
    importantNote: {
        flexDirection: 'row',
        gap: Spacing.sm,
        padding: Spacing.md,
        backgroundColor: Colors.primary[50],
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: Colors.primary[200],
    },
    importantNoteContent: {
        flex: 1,
        gap: Spacing.xs / 2,
    },
    importantNoteTitle: {
        fontSize: Typography.body.medium.fontSize as number,
        fontWeight: '700',
        color: Colors.primary[700],
    },
    importantNoteText: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.primary[700],
        lineHeight: 18,
    },
})

export { AddStudentStep3Student }
