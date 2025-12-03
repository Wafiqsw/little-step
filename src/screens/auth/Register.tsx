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
import { getUserByEmail, createDataWithId, deleteData } from '../../firebase/firestore'
import { normalizeEmail } from '../../utils'
import { registerUser } from '../../firebase/auth'
import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore'
import { db } from '../../firebase'

type RegisterNavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'Register'
>

const Register = () => {
    const navigation = useNavigation<RegisterNavigationProp>()

    const [currentStep, setCurrentStep] = useState(1) // 1, 2, or 3

    // Step 1: Email & TOC
    const [emailData, setEmailData] = useState({
        email: '',
        tocCode: ['', '', '', '', '', ''], // 6 digits
    })
    const [emailErrors, setEmailErrors] = useState({
        email: '',
        tocCode: '',
    })
    const [isValidating, setIsValidating] = useState(false)
    const [validatedUser, setValidatedUser] = useState<any>(null)

    // TOC input refs
    const tocRefs = [
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
        useRef<TextInput>(null),
    ]

    // Step 2: Name & Phone Number
    const [profileData, setProfileData] = useState({
        fullName: '',
        phoneNumber: '',
    })
    const [profileErrors, setProfileErrors] = useState({
        fullName: '',
        phoneNumber: '',
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

        const newTocCode = [...emailData.tocCode]
        newTocCode[index] = value

        setEmailData({ ...emailData, tocCode: newTocCode })

        // Auto-advance to next input
        if (value && index < 5) {
            tocRefs[index + 1].current?.focus()
        }

        // Clear error when typing
        if (emailErrors.tocCode) {
            setEmailErrors({ ...emailErrors, tocCode: '' })
        }
    }

    const handleTocKeyPress = (index: number, key: string) => {
        // Handle backspace to go to previous input
        if (key === 'Backspace' && !emailData.tocCode[index] && index > 0) {
            tocRefs[index - 1].current?.focus()
        }
    }

    const handleStep1Next = async () => {
        // Validate email and TOC
        let hasError = false
        const newErrors = { email: '', tocCode: '' }

        if (!emailData.email.trim()) {
            newErrors.email = 'Email is required'
            hasError = true
        } else if (!/\S+@\S+\.\S+/.test(emailData.email)) {
            newErrors.email = 'Please enter a valid email'
            hasError = true
        }

        const tocCodeComplete = emailData.tocCode.every(digit => digit !== '')
        if (!tocCodeComplete) {
            newErrors.tocCode = 'Please enter complete TOC code'
            hasError = true
        }

        setEmailErrors(newErrors)

        if (hasError) {
            setErrorMessage('Please enter a valid email and TOC code')
            setShowErrorModal(true)
            return
        }

        // Validate email and TOC against Firestore
        setIsValidating(true)
        try {
            const normalizedEmail = normalizeEmail(emailData.email)
            const user = await getUserByEmail(normalizedEmail)

            if (!user) {
                setErrorMessage('Email not found. Please check your email address.')
                setShowErrorModal(true)
                setIsValidating(false)
                return
            }

            const enteredToc = emailData.tocCode.join('')
            if (user.toc !== enteredToc) {
                setErrorMessage('Invalid TOC code. Please check your verification code.')
                setShowErrorModal(true)
                setIsValidating(false)
                return
            }

            // Email and TOC are valid, store user data and go to step 2
            setValidatedUser(user)

            // Prefill form with user data
            setProfileData({
                fullName: user.name || '',
                phoneNumber: user.numphone || '',
            })

            setIsValidating(false)
            setCurrentStep(2)
        } catch (error) {
            setErrorMessage('An error occurred. Please try again.')
            setShowErrorModal(true)
            setIsValidating(false)
        }
    }

    const handleStep2Next = () => {
        // Validate name and phone number
        let hasError = false
        const newErrors = { fullName: '', phoneNumber: '' }

        if (!profileData.fullName.trim()) {
            newErrors.fullName = 'Full name is required'
            hasError = true
        }

        if (!profileData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required'
            hasError = true
        } else if (profileData.phoneNumber.length < 10) {
            newErrors.phoneNumber = 'Phone number must be at least 10 digits'
            hasError = true
        }

        setProfileErrors(newErrors)

        if (hasError) {
            return
        }

        // If valid, go to step 3
        setCurrentStep(3)
    }

    const handleStep3Register = async () => {
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

        try {
            setIsValidating(true)

            const normalizedEmail = normalizeEmail(emailData.email)

            // Step 1: Create Firebase Auth account with user's chosen password
            const userCredential = await registerUser(normalizedEmail, passwordData.password)
            const uid = userCredential.user.uid
            console.log('✅ Firebase Auth account created with UID:', uid)

            // Step 2: Update user data in Firestore with the new UID
            const updatedUserData = {
                name: profileData.fullName,
                numphone: profileData.phoneNumber,
                email: normalizedEmail,
                role: 'guardian' as const,
                registered: true,
                ic: '',
                address: '',
                occupation: '',
            }

            // Create new document with Auth UID
            await createDataWithId('users', uid, updatedUserData)
            console.log('✅ User data saved to Firestore with Auth UID')

            // Step 3: Update all children's guardian references from old pending ID to new Auth UID
            if (validatedUser?.id) {
                try {
                    // Create references for old and new guardian documents
                    const oldGuardianRef = doc(db, 'users', validatedUser.id)
                    const newGuardianRef = doc(db, 'users', uid)

                    // Query all students that have the old guardian reference
                    const studentsRef = collection(db, 'students')
                    const studentsQuery = query(studentsRef, where('guardian', '==', oldGuardianRef))
                    const studentsSnapshot = await getDocs(studentsQuery)

                    console.log(`🔍 Found ${studentsSnapshot.size} student(s) to update`)

                    // Update each student's guardian reference to the new one
                    const updatePromises = studentsSnapshot.docs.map(async (studentDoc) => {
                        await updateDoc(doc(db, 'students', studentDoc.id), {
                            guardian: newGuardianRef
                        })
                        console.log(`✅ Updated guardian reference for student: ${studentDoc.id}`)
                    })

                    await Promise.all(updatePromises)
                    console.log('✅ All student guardian references updated')

                    // Step 4: Delete the old temporary document
                    await deleteData('users', validatedUser.id)
                    console.log('✅ Deleted pending temp user with ID:', validatedUser.id)
                } catch (error) {
                    console.error('❌ Error updating student references:', error)
                    // Continue with registration even if student update fails
                    // The parent account is already created
                }
            }

            console.log('Registration complete:', {
                email: normalizedEmail,
                ...profileData,
                registered: true
            })

            setIsValidating(false)
            setShowSuccessModal(true)
        } catch (error: any) {
            console.error('Error during registration:', error)
            let errorMsg = 'An error occurred during registration. Please try again.'

            if (error?.code === 'auth/email-already-in-use') {
                errorMsg = 'This email is already registered. Please login instead.'
            } else if (error?.code === 'auth/invalid-email') {
                errorMsg = 'Invalid email address.'
            } else if (error?.code === 'auth/weak-password') {
                errorMsg = 'Password is too weak. Please use a stronger password.'
            }

            setErrorMessage(errorMsg)
            setShowErrorModal(true)
            setIsValidating(false)
        }
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

                        {/* Step 1: Email & TOC */}
                        {currentStep === 1 && (
                            <View style={styles.formContainer}>
                                <Form
                                    label="Email Address"
                                    variant="simple"
                                    size="large"
                                    placeholder="Enter your email address"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={emailData.email}
                                    onChangeText={(text) => {
                                        setEmailData({ ...emailData, email: text })
                                        if (emailErrors.email) setEmailErrors({ ...emailErrors, email: '' })
                                    }}
                                    error={emailErrors.email}
                                />

                                {/* TOC Code - 6 boxes */}
                                <View style={styles.tocContainer}>
                                    <Text style={styles.tocLabel}>TOC Code</Text>
                                    <View style={styles.tocBoxesContainer}>
                                        {emailData.tocCode.map((digit, index) => (
                                            <TextInput
                                                key={index}
                                                ref={tocRefs[index]}
                                                style={[
                                                    styles.tocBox,
                                                    emailErrors.tocCode && !digit && styles.tocBoxError,
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
                                    {emailErrors.tocCode && (
                                        <Text style={styles.errorText}>{emailErrors.tocCode}</Text>
                                    )}
                                </View>

                                <View style={styles.buttonContainer}>
                                    <Button
                                        label={isValidating ? "Validating..." : "Next"}
                                        onPress={handleStep1Next}
                                        variant="primary"
                                        size="large"
                                        fullWidth
                                        disabled={isValidating}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Step 2: Name & Phone Number */}
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
                                    label="Phone Number"
                                    variant="simple"
                                    size="large"
                                    placeholder="Enter your phone number"
                                    keyboardType="phone-pad"
                                    value={profileData.phoneNumber}
                                    onChangeText={(text) => {
                                        setProfileData({ ...profileData, phoneNumber: text })
                                        if (profileErrors.phoneNumber) setProfileErrors({ ...profileErrors, phoneNumber: '' })
                                    }}
                                    error={profileErrors.phoneNumber}
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
