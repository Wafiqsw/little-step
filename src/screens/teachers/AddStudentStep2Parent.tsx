import React, { useState } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, Breadcrumb, Form } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'

type Step2NavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'TeacherAddStudentStep2Parent'
>

type Step2RouteProp = RouteProp<MainNavigatorParamList, 'TeacherAddStudentStep2Parent'>

const AddStudentStep2Parent = () => {
    const navigation = useNavigation<Step2NavigationProp>()
    const route = useRoute<Step2RouteProp>()
    const { email, existingParent } = route.params

    const [formData, setFormData] = useState({
        parentName: existingParent?.name || '',
        parentPhone: existingParent?.numphone || '',
    })
    const [errors, setErrors] = useState({
        parentName: '',
        parentPhone: '',
    })

    const isExistingParent = !!existingParent

    const handleAvatarPress = () => {
        navigation.navigate('TeacherProfile')
    }

    const handleNext = () => {
        // Clear previous errors
        setErrors({ parentName: '', parentPhone: '' })

        // Validate form
        let hasError = false
        const newErrors = { parentName: '', parentPhone: '' }

        if (!formData.parentName.trim()) {
            newErrors.parentName = 'Please enter parent name'
            hasError = true
        }

        if (hasError) {
            setErrors(newErrors)
            return
        }

        navigation.navigate('TeacherAddStudentStep3Student', {
            email: email,
            parentName: formData.parentName,
            parentPhone: formData.parentPhone,
            isExistingParent,
            existingParent: existingParent,
        })
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header showBackButton onAvatarPress={handleAvatarPress} />

            {/* Breadcrumb */}
            <Breadcrumb
                steps={['Email', 'Parent Details', 'Student Details']}
                currentStep={1}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Parent Information</Text>
                <Text style={styles.pageSubtitle}>
                    {isExistingParent
                        ? 'Using existing parent information'
                        : 'Enter parent details for the new student'}
                </Text>

                {/* Existing Parent Badge */}
                {isExistingParent && (
                    <View style={styles.existingParentBadge}>
                        <Icon name="check-circle" size={20} color="#4CAF50" />
                        <Text style={styles.existingParentText}>
                            Using Existing Parent Account
                        </Text>
                    </View>
                )}

                {/* Parent Information Form */}
                <View style={styles.formSection}>
                    <View style={styles.sectionHeader}>
                        <Icon name="user-circle" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Parent Details</Text>
                    </View>

                    {/* Parent Name */}
                    <Form
                        label="Parent Name *"
                        variant="simple"
                        size="large"
                        value={formData.parentName}
                        onChangeText={(text) => setFormData({ ...formData, parentName: text })}
                        placeholder="e.g., Ali bin Hassan"
                        editable={!isExistingParent}
                        error={errors.parentName}
                    />

                    {/* Parent Email Address */}
                    <Form
                        label="Parent Email Address *"
                        variant="simple"
                        size="large"
                        value={email}
                        placeholder="e.g., parent@example.com"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={false}
                    />

                    {/* Parent Phone Number (Optional) */}
                    <Form
                        label="Parent Phone Number (Optional)"
                        variant="simple"
                        size="large"
                        value={formData.parentPhone}
                        onChangeText={(text) => setFormData({ ...formData, parentPhone: text })}
                        placeholder="e.g., +60123456789 or 0123456789"
                        keyboardType="phone-pad"
                        editable={!isExistingParent}
                        error={errors.parentPhone}
                    />
                </View>

                <Button
                    label="Next"
                    onPress={handleNext}
                    variant="primary"
                    size="large"
                    fullWidth
                    icon={<Icon name="arrow-right" size={18} color={Colors.white} />}
                    iconPosition="right"
                />
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
    existingParentBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        padding: Spacing.md,
        backgroundColor: '#E8F5E9',
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#4CAF50',
    },
    existingParentText: {
        fontSize: Typography.body.medium.fontSize as number,
        fontWeight: '600',
        color: '#4CAF50',
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
    inputContainerDisabled: {
        backgroundColor: Colors.neutral[100],
        borderColor: Colors.neutral[300],
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
})

export { AddStudentStep2Parent }
