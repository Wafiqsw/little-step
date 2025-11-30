import React, { useState, useRef } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    TextInput,
    Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Logo, Form, Button, Hyperlink, PasswordInput, MoonCloud, ResultModal } from '../../components'
import { Colors, Typography, Spacing } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'

type RegisterNavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'Register'
>

const Register = () => {
    const navigation = useNavigation<RegisterNavigationProp>()

    const [currentStep, setCurrentStep] = useState(1) // 1, 2, or 3

    // Step 1: Phone & TOC
    const [phoneData, setPhoneData] = useState({
        phone: '',
        tocCode: ['', '', '', '', '', ''], // 6 digits
    })
    const [phoneErrors, setPhoneErrors] = useState({
        phone: '',
        tocCode: '',
    })

    // TOC input refs
    const tocRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ]

    // Step 2: Name & Email
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
    })
    const [profileErrors, setProfileErrors] = useState({
        fullName: '',
        email: '',
    })

    // Step 3: Password
    const [passwordData, setPasswordData] = useState({
        password: '',
        confirmPassword: '',
    })
    const [passwordErrors, setPasswordErrors] = useState({
        password: '',
        confirmPassword: '',
    })

    const [showErrorModal, setShowErrorModal] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const [showSuccessModal, setShowSuccessModal] = useState(false)

    const handleTocChange = (index: number, value: string) => {
        // Only allow numbers
        if (value && !/^\d+$/.test(value)) return

        const newTocCode = [...phoneData.tocCode]
        newTocCode[index] = value

        setPhoneData({ ...phoneData, tocCode: newTocCode })

        // Auto-advance to next input
        if (value && index < 5) {
            tocRefs[index + 1].current?.focus()
        }

        // Clear error when typing
        if (phoneErrors.tocCode) {
            setPhoneErrors({ ...phoneErrors, tocCode: '' })
        }
    }

    const handleTocKeyPress = (index: number, key: string) => {
        // Handle backspace to go to previous input
        if (key === 'Backspace' && !phoneData.tocCode[index] && index > 0) {
            tocRefs[index - 1].current?.focus()
        }
    }

    const handleStep1Next = () => {
        // Validate phone and TOC
        let hasError = false
        const newErrors = { phone: '', tocCode: '' }

        if (!phoneData.phone.trim()) {
            newErrors.phone = 'Phone number is required'
            hasError = true
        } else if (phoneData.phone.length < 10) {
            newErrors.phone = 'Phone number must be at least 10 digits'
            hasError = true
        }

        const tocCodeComplete = phoneData.tocCode.every(digit => digit !== '')
        if (!tocCodeComplete) {
            newErrors.tocCode = 'Please enter complete TOC code'
            hasError = true
        }

        setPhoneErrors(newErrors)

        if (hasError) {
            setErrorMessage('Please enter a valid phone number and TOC code')
            setShowErrorModal(true)
            return
        }

        // If valid, go to step 2
        setCurrentStep(2)
    }

    const handleStep2Next = () => {
        // Validate name and email
        let hasError = false
        const newErrors = { fullName: '', email: '' }

        if (!profileData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
            hasError = true
        }

        if (!profileData.email.trim()) {
            newErrors.email = 'Email is required'
            hasError = true
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Please enter a valid email'
            hasError = true
        }

        setProfileErrors(newErrors)

        if (hasError) {
            return
        }

        // If valid, go to step 3
        setCurrentStep(3)
    }

    const handleStep3Register = () => {
        // Validate passwords
        let hasError = false
        const newErrors = { password: '', confirmPassword: '' }

        if (!passwordData.password.trim()) {
            newErrors.password = 'Password is required'
            hasError = true
        } else if (passwordData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
            hasError = true
        }

        if (!passwordData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your password'
            hasError = true
        } else if (passwordData.password !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
            hasError = true
        }

        setPasswordErrors(newErrors)

        if (hasError) {
            return
        }

        // All steps complete - register user
        const fullTocCode = phoneData.tocCode.join('')
        console.log('Register:', { ...phoneData, tocCode: fullTocCode, ...profileData, ...passwordData })

        // Show success modal
        setShowSuccessModal(true)
    }

    const handleSuccessClose = () => {
        setShowSuccessModal(false)
        // Navigate to login after closing success modal
        navigation.navigate('Login')
    }

    const handleLogin = () => {
        navigation.navigate('Login')
    }

    // Password validation checks
    const hasMinLength = passwordData.password.length >= 6
    const hasUpperCase = /[A-Z]/.test(passwordData.password)
    const hasLowerCase = /[a-z]/.test(passwordData.password)
    const hasNumber = /[0-9]/.test(passwordData.password)

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.keyboardView}
                >
                    <ScrollView
                        contentContainerStyle={styles.scrollContent}
                        showsVerticalScrollIndicator={false}
                        keyboardShouldPersistTaps="handled"
                    >
                        {/* Tagline */}
                        <View style={styles.taglineContainer}>
                            <Text style={styles.taglineText}>
                                Easy pick-ups, simple attendance, quick updates
                            </Text>
                        </View>

                        {/* Logo */}
                        <View style={styles.logoContainer}>
                            <Logo width={70} height={58} />
                            <Text style={styles.title}>Create Account</Text>
                            <Text style={styles.subtitle}>Step {currentStep} of 3</Text>
                        </View>

                        {/* Step 1: Phone & TOC */}
                        {currentStep === 1 && (
                            <View style={styles.formContainer}>
                                <Form
                                    label="Phone Number"
                                    variant="simple"
                                    size="large"
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                    value={phoneData.phone}
                                    onChangeText={(text) => {
                                        setPhoneData({ ...phoneData, phone: text })
                                        if (phoneErrors.phone) setPhoneErrors({ ...phoneErrors, phone: '' })
                                    }}
                                    error={phoneErrors.phone}
                                />

                                {/* TOC Code - 6 boxes */}
                                <View style={styles.tocContainer}>
                                    <Text style={styles.tocLabel}>TOC Code</Text>
                                    <View style={styles.tocBoxesContainer}>
                                        {phoneData.tocCode.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                ref={tocRefs[index]}
                                                style={[
                                                    styles.tocBox,
                                                    phoneErrors.tocCode && !digit && styles.tocBoxError,
                                                ]}
                                                value={digit}
                                                onChangeText={(value) => handleTocChange(index, value)}
                                                onKeyPress={({ nativeEvent }) => handleTocKeyPress(index, nativeEvent.key)}
                                                keyboardType="number-pad"
                                                maxLength={1}
                                                selectTextOnFocus
                                            />
                                        ))}
                                    </View>
                                    {phoneErrors.tocCode && (
                                        <Text style={styles.errorText}>{phoneErrors.tocCode}</Text>
                                    )}
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Button
                                        label="Next"
                                        onPress={handleStep1Next}
                                        variant="primary"
                                        size="large"
                                        fullWidth
                                    />
                                </View>
                            </View>
                        )}

                        {/* Step 2: Name & Email */}
                        {currentStep === 2 && (
                            <View style={styles.formContainer}>
                                <Form
                                    label="Full Name"
                                    variant="simple"
                                    size="large"
                                    placeholder="Enter your full name"
                                    value={profileData.fullName}
                                    onChangeText={(text) => {
                                        setProfileData({ ...profileData, fullName: text })
                                        if (profileErrors.fullName) setProfileErrors({ ...profileErrors, fullName: '' })
                                    }}
                                    error={profileErrors.fullName}
                                />

                                <Form
                                    label="Email"
                                    variant="simple"
                                    size="large"
                                    placeholder="Enter your email"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={profileData.email}
                                    onChangeText={(text) => {
                                        setProfileData({ ...profileData, email: text })
                                        if (profileErrors.email) setProfileErrors({ ...profileErrors, email: '' })
                                    }}
                                    error={profileErrors.email}
                                />

                                <View style={styles.buttonContainer}>

                                    <Button
                                        label="Next"
                                        onPress={handleStep2Next}
                                        variant="primary"
                                        size="large"
                                        fullWidth
                                    />
                                    <Button
                                        label="Back"
                                        onPress={() => setCurrentStep(1)}
                                        variant="secondary"
                                        size="large"
                                        fullWidth
                                    />
                                </View>
                            </View>
                        )}

                        {/* Step 3: Password */}
                        {currentStep === 3 && (
                            <View style={styles.formContainer}>
                                <PasswordInput
                                    label="Password"
                                    variant="simple"
                                    size="large"
                                    placeholder="Create a password"
                                    value={passwordData.password}
                                    onChangeText={(text) => {
                                        setPasswordData({ ...passwordData, password: text })
                                        if (passwordErrors.password) setPasswordErrors({ ...passwordErrors, password: '' })
                                    }}
                                    error={passwordErrors.password}
                                />

                                {/* Password Requirements */}
                                <View style={styles.requirementsContainer}>
                                    <Text style={styles.requirementsTitle}>Password must contain:</Text>
                                    <View style={styles.requirementItem}>
                                        <Text style={hasMinLength ? styles.requirementMet : styles.requirementUnmet}>
                                            {hasMinLength ? '✓' : '○'} At least 6 characters
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text style={hasUpperCase ? styles.requirementMet : styles.requirementUnmet}>
                                            {hasUpperCase ? '✓' : '○'} One uppercase letter
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text style={hasLowerCase ? styles.requirementMet : styles.requirementUnmet}>
                                            {hasLowerCase ? '✓' : '○'} One lowercase letter
                                        </Text>
                                    </View>
                                    <View style={styles.requirementItem}>
                                        <Text style={hasNumber ? styles.requirementMet : styles.requirementUnmet}>
                                            {hasNumber ? '✓' : '○'} One number
                                        </Text>
                                    </View>
                                </View>

                                <PasswordInput
                                    label="Confirm Password"
                                    variant="simple"
                                    size="large"
                                    placeholder="Confirm your password"
                                    value={passwordData.confirmPassword}
                                    onChangeText={(text) => {
                                        setPasswordData({ ...passwordData, confirmPassword: text })
                                        if (passwordErrors.confirmPassword) setPasswordErrors({ ...passwordErrors, confirmPassword: '' })
                                    }}
                                    error={passwordErrors.confirmPassword}
                                />

                                <View style={styles.buttonContainer}>

                                    <Button
                                        label="Create Account"
                                        onPress={handleStep3Register}
                                        variant="primary"
                                        size="large"
                                        fullWidth
                                    />
                                    <Button
                                        label="Back"
                                        onPress={() => setCurrentStep(2)}
                                        variant="secondary"
                                        size="large"
                                        fullWidth
                                    />
                                </View>
                            </View>
                        )}

                        {/* Login Link */}
                        <View style={styles.loginContainer}>
                            <Text style={styles.loginText}>Already have an account? </Text>
                            <Hyperlink
                                text="Login"
                                onPress={handleLogin}
                                variant="black"
                                fontSize={Typography.body.medium.fontSize as number}
                                style={{ color: '#371B34', fontWeight: '700' }}
                            />
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* MoonCloud at Bottom - Only on Steps 1 & 2 */}
            {currentStep !== 3 && (
                <View style={styles.moonCloudContainer}>
                    <MoonCloud width={Dimensions.get('window').width} height={261} />
                </View>
            )}

            {/* Error Modal */}
            <ResultModal
                visible={showErrorModal}
                variant="error"
                title="Invalid Input"
                message={errorMessage}
                buttonText="OK"
                onClose={() => setShowErrorModal(false)}
            />

            {/* Success Modal */}
            <ResultModal
                visible={showSuccessModal}
                variant="success"
                title="Registration Successful!"
                message="Your account has been created successfully. Please login to continue."
                buttonText="Go to Login"
                onClose={handleSuccessClose}
            />
        </View >
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    safeArea: {
        flex: 1,
        zIndex: 1,
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: Spacing.xl,
        paddingTop: Spacing.xl,
        paddingBottom: Spacing.xl * 2,
    },
    taglineContainer: {
        alignItems: 'center',
        marginBottom: Spacing.lg,
        paddingTop: Spacing.xl,
    },
    taglineText: {
        fontSize: Typography.body.large.fontSize as number,
        fontWeight: '600',
        color: '#371B34',
        textAlign: 'center',
        letterSpacing: 0.3,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
    },
    title: {
        fontSize: Typography.heading.h1.fontSize as number,
        fontWeight: Typography.heading.h1.fontWeight as any,
        color: Colors.black,
        marginTop: Spacing.sm,
    },
    subtitle: {
        fontSize: Typography.body.medium.fontSize as number,
        color: Colors.text.secondary,
    },
    formContainer: {
        gap: Spacing.md,
    },
    buttonContainer: {
        marginTop: Spacing.md,
        gap: Spacing.sm,
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.xl,
    },
    loginText: {
        fontSize: Typography.body.medium.fontSize as number,
        color: '#371B34',
    },
    tocContainer: {
        marginTop: Spacing.sm,
    },
    tocLabel: {
        fontSize: Typography.body.medium.fontSize as number,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: Spacing.sm,
    },
    tocBoxesContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: Spacing.sm,
    },
    tocBox: {
        flex: 1,
        height: 56,
        borderWidth: 1,
        borderColor: Colors.neutral[300],
        borderRadius: 8,
        backgroundColor: Colors.white,
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '600',
        color: Colors.black,
    },
    tocBoxError: {
        borderColor: Colors.error.main,
    },
    errorText: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.error.main,
        marginTop: Spacing.xs,
    },
    requirementsContainer: {
        backgroundColor: Colors.neutral[50],
        padding: Spacing.md,
        borderRadius: 8,
        gap: Spacing.xs,
    },
    requirementsTitle: {
        fontSize: Typography.body.medium.fontSize as number,
        fontWeight: '600',
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    requirementItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    requirementMet: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.success.main,
    },
    requirementUnmet: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.text.secondary,
    },
    moonCloudContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 0,
        pointerEvents: 'none',
    },
})

export { Register }
