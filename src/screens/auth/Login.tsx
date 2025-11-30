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

    const handleLogin = () => {
        // Validate and login
        console.log('Login:', formData)
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
