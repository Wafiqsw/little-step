import React, { useState } from 'react'
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Logo, MoonCloud, Form, Button, Hyperlink, PasswordInput } from '../../components'
import { Colors, Typography, Spacing } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'


import { loginUser } from '../../firebase/auth'
import { getDataById } from '../../firebase/firestore'
import { Users } from '../../types/Users'

type LoginNavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'Login'
>

const Login = () => {
    const navigation = useNavigation<LoginNavigationProp>()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    })

    const handleLogin = async () => {
        try {
            // Basic validation
            if (!formData.email || !formData.password) {
                console.log('❌ Login Failed: Please fill in all fields')
                setErrors({
                    email: !formData.email ? 'Email is required' : '',
                    password: !formData.password ? 'Password is required' : '',
                })
                return
            }

            console.log('🔄 Attempting login for:', formData.email)

            // Firebase login
            const userCredential = await loginUser(formData.email, formData.password)
            const uid = userCredential.user.uid;

            console.log('✅ Login Success!')
            console.log('User ID:', userCredential.user.uid)
            console.log('Email:', userCredential.user.email)
            console.log('User Data:', userCredential.user)

            const userProfile = await getDataById<Users>("users", uid)
            console.log('User Info', JSON.stringify(userProfile))


            // Navigate based on user role
            if (userProfile && userProfile.role) {
                if (userProfile.role === 'guardian') {
                    console.log('🔄 Navigating to Parent Tab Navigator')
                    navigation.replace('ParentTabNavigator')
                } else if (userProfile.role === 'teacher') {
                    console.log('🔄 Navigating to Teacher Tab Navigator')
                    navigation.replace('TeacherTabNavigator')
                } else {
                    console.log('⚠️ Unknown role:', userProfile.role)
                }
            } else {
                console.log('⚠️ No user profile found in Firestore or missing role')
                setErrors({ ...errors, email: 'User profile not found. Please contact support.' })
            }

        } catch (error: any) {
            console.log('❌ Login Failed!')
            console.log('Error Code:', error.code)
            console.log('Error Message:', error.message)

            // Handle specific Firebase errors
            let errorMessage = 'An error occurred during login'

            if (error.code === 'auth/invalid-email') {
                errorMessage = 'Invalid email address'
                setErrors({ ...errors, email: errorMessage })
            } else if (error.code === 'auth/user-not-found') {
                errorMessage = 'No account found with this email'
                setErrors({ ...errors, email: errorMessage })
            } else if (error.code === 'auth/wrong-password') {
                errorMessage = 'Incorrect password'
                setErrors({ ...errors, password: errorMessage })
            } else if (error.code === 'auth/invalid-credential') {
                errorMessage = 'Invalid email or password'
                setErrors({ ...errors, email: errorMessage })
            } else {
                setErrors({ ...errors, email: errorMessage })
            }

            console.log('Displayed Error:', errorMessage)
        }
    }

    const handleRegister = () => {
        navigation.navigate('Register')
    }

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

                        {/* Logo & Title */}
                        <View style={styles.headerContainer}>
                            <Logo width={70} height={58} />
                            <Text style={styles.title}>Welcome Back</Text>
                            <Text style={styles.subtitle}>Login to continue</Text>
                        </View>

                        {/* Form */}
                        <View style={styles.formContainer}>
                            <Form
                                label="Email"
                                variant="simple"
                                size="large"
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={formData.email}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, email: text })
                                    if (errors.email) setErrors({ ...errors, email: '' })
                                }}
                                error={errors.email}
                            />

                            <PasswordInput
                                label="Password"
                                variant="simple"
                                size="large"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChangeText={(text) => {
                                    setFormData({ ...formData, password: text })
                                    if (errors.password) setErrors({ ...errors, password: '' })
                                }}
                                error={errors.password}
                            />

                            {/* Login Button */}
                            <View style={styles.buttonContainer}>
                                <Button
                                    label="Login"
                                    onPress={handleLogin}
                                    variant="primary"
                                    size="large"
                                    fullWidth
                                />
                            </View>

                            {/* Register Link */}
                            <View style={styles.registerContainer}>
                                <Text style={styles.registerText}>Don't have an account? </Text>
                                <Hyperlink
                                    text="Sign Up"
                                    onPress={handleRegister}
                                    variant="black"
                                    fontSize={Typography.body.medium.fontSize as number}
                                    style={{ color: '#371B34', fontWeight: '700' }}
                                />
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </SafeAreaView>

            {/* MoonCloud at Bottom - Full Width */}
            <View style={styles.moonCloudContainer}>
                <MoonCloud width={Dimensions.get('window').width} height={261} />
            </View>
        </View>
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
    headerContainer: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
        gap: Spacing.sm,
        marginTop: Spacing.xl * 2,
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
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: Spacing.sm,
    },
    registerText: {
        fontSize: Typography.body.medium.fontSize as number,
        color: '#371B34',
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

export { Login }
