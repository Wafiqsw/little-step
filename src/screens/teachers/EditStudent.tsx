import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, TextInput, ScrollView, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Button, SuccessModal, Form } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { getStudentById } from '../../data/MockStudentParent'
import Icon from 'react-native-vector-icons/FontAwesome'

type EditStudentNavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'TeacherEditStudent'
>

type EditStudentRouteProp = RouteProp<MainNavigatorParamList, 'TeacherEditStudent'>

const EditStudent = () => {
    const navigation = useNavigation<EditStudentNavigationProp>()
    const route = useRoute<EditStudentRouteProp>()
    const { studentId } = route.params

    const [formData, setFormData] = useState({
        studentName: '',
        studentId: '',
        class: '',
        age: '',
        gender: 'male' as 'male' | 'female',
        parentName: '',
        parentPhone: '',
    })
    const [errors, setErrors] = useState({
        studentName: '',
        class: '',
        age: '',
    })
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    useEffect(() => {
        const student = getStudentById(studentId)
        if (student) {
            setFormData({
                studentName: student.studentName,
                studentId: student.studentId,
                class: student.class,
                age: student.age.toString(),
                gender: student.gender,
                parentName: student.parentName,
                parentPhone: student.parentPhone,
            })
        }
    }, [studentId])

    const handleAvatarPress = () => {
        navigation.navigate('TeacherProfile')
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

        console.log('Updating student:', formData)
        setShowSuccessModal(true)
    }

    const handleSuccessClose = () => {
        setShowSuccessModal(false)
        navigation.goBack()
    }

    return (
        <SafeAreaView style={styles.container}>
            <Header showBackButton onAvatarPress={handleAvatarPress} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <Text style={styles.pageTitle}>Edit Student</Text>
                <Text style={styles.pageSubtitle}>
                    Update student information
                </Text>

                {/* Student ID (Read-only) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="id-card" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Student ID</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Student ID</Text>
                        <View style={[styles.inputContainer, styles.inputContainerDisabled]}>
                            <Icon
                                name="id-card"
                                size={18}
                                color={Colors.text.secondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={formData.studentId}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                {/* Student Information (Editable) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="user" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Student Information</Text>
                    </View>

                    {/* Student Name */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Student Name *</Text>
                        <View style={styles.inputContainer}>
                            <Icon
                                name="user"
                                size={18}
                                color={Colors.text.secondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={formData.studentName}
                                onChangeText={(text) =>
                                    setFormData({ ...formData, studentName: text })
                                }
                                placeholder="e.g., Ahmad bin Ali"
                                placeholderTextColor={Colors.text.disabled}
                            />
                        </View>
                    </View>

                    {/* Class */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Class *</Text>
                        <View style={styles.inputContainer}>
                            <Icon
                                name="users"
                                size={18}
                                color={Colors.text.secondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={formData.class}
                                onChangeText={(text) => setFormData({ ...formData, class: text })}
                                placeholder="e.g., Year 1 Amanah"
                                placeholderTextColor={Colors.text.disabled}
                            />
                        </View>
                    </View>

                    {/* Age and Gender Row */}
                    <View style={styles.rowInputs}>
                        <View style={[styles.inputGroup, { flex: 1 }]}>
                            <Text style={styles.label}>Age *</Text>
                            <View style={styles.inputContainer}>
                                <Icon
                                    name="birthday-cake"
                                    size={18}
                                    color={Colors.text.secondary}
                                    style={styles.inputIcon}
                                />
                                <TextInput
                                    style={styles.input}
                                    value={formData.age}
                                    onChangeText={(text) =>
                                        setFormData({ ...formData, age: text })
                                    }
                                    placeholder="7"
                                    placeholderTextColor={Colors.text.disabled}
                                    keyboardType="numeric"
                                />
                            </View>
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

                {/* Parent Details (Read-only) */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Icon name="user-circle" size={20} color={Colors.primary[600]} />
                        <Text style={styles.sectionTitle}>Parent Information</Text>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Parent Name</Text>
                        <View style={[styles.inputContainer, styles.inputContainerDisabled]}>
                            <Icon
                                name="user-circle"
                                size={18}
                                color={Colors.text.secondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={formData.parentName}
                                editable={false}
                            />
                        </View>
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Parent Phone</Text>
                        <View style={[styles.inputContainer, styles.inputContainerDisabled]}>
                            <Icon
                                name="phone"
                                size={18}
                                color={Colors.text.secondary}
                                style={styles.inputIcon}
                            />
                            <TextInput
                                style={styles.input}
                                value={formData.parentPhone}
                                editable={false}
                            />
                        </View>
                    </View>
                </View>

                <Button
                    label="Save Changes"
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
                title="Student Updated Successfully!"
                message="The student information has been updated."
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
    section: {
        gap: Spacing.md,
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
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
})

export { EditStudent }
