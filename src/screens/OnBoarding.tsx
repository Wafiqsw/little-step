import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Pressable,
    Dimensions,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import LinearGradient from 'react-native-linear-gradient'
import { Logo, WhiteCloud, Button, Hyperlink } from '../components'
import { Colors, Typography, Spacing } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../navigation/type'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

type OnBoardingNavigationProp = NativeStackNavigationProp<
    MainNavigatorParamList,
    'OnBoarding'
>

const OnBoarding = () => {
    const navigation = useNavigation<OnBoardingNavigationProp>()

    const handleSignUp = () => {
        // Navigate to register screen
        navigation.navigate('Register')
    }

    const handleLogin = () => {
        // Navigate to login screen
        navigation.navigate('Login')
    }

    return (
        <LinearGradient
            colors={['#B8B5E8', '#9B97D8']}
            start={{ x: 0, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={styles.container}
        >
            <SafeAreaView style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>LittleStep</Text>
                    <Text style={styles.subtitle}>by CTIMP</Text>
                </View>

                {/* Main Content */}
                <View style={styles.content}>
                    {/* Cloud Left - Bottom */}
                    <View style={styles.cloudLeft}>
                        <WhiteCloud width={160} height={180} variant="left" />
                    </View>

                    {/* Cloud Right - Top */}
                    <View style={styles.cloudRight}>
                        <WhiteCloud width={160} height={180} variant="right" />
                    </View>

                    {/* Centered Group: Bird + Text */}
                    <View style={styles.centerGroup}>
                        {/* Bird / Logo */}
                        <Logo width={220} height={181} />

                        {/* Text below bird */}
                        <Text style={styles.descriptionText}>
                            Easy Pick-ups, simple{'\n'}
                            attendance, and more...
                        </Text>
                    </View>
                </View>

                {/* Bottom Section */}
                <View style={styles.bottomSection}>
                    {/* Sign Up Button */}
                    <View style={styles.signUpButtonWrapper}>
                        <Button
                            label="Sign Up"
                            onPress={handleSignUp}
                            variant="primary"
                            size="large"
                            fullWidth
                        />
                    </View>

                    {/* Login Link */}
                    <View style={styles.loginContainer}>
                        <Text style={styles.loginText}>Already have an account? </Text>
                        <Hyperlink
                            text="Login"
                            onPress={handleLogin}
                            variant="black"
                            fontSize={Typography.body.medium.fontSize as number}
                            style={{ color: '#3D2E3F' }}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    safeArea: {
        flex: 1,
        paddingHorizontal: Spacing.lg,
    },
    header: {
        alignItems: 'center',
        marginTop: Spacing.xl,
        gap: Spacing.xs,
    },
    title: {
        fontSize: 36,
        fontWeight: '700',
        color: Colors.white,
        letterSpacing: -0.5,
    },
    subtitle: {
        fontSize: Typography.body.medium.fontSize as number,
        fontWeight: '600',
        color: '#3D2E3F',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
    },
    cloudLeft: {
        position: 'absolute',
        left: -60,
        bottom: '10%',
        opacity: 0.5,
        zIndex: 1,
    },
    cloudRight: {
        position: 'absolute',
        right: -60,
        top: '10%',
        opacity: 0.5,
        zIndex: 1,
    },
    centerGroup: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: Spacing.lg,
        zIndex: 2,
    },
    descriptionText: {
        fontSize: Typography.body.large.fontSize as number,
        fontWeight: '500',
        color: Colors.white,
        textAlign: 'center',
        opacity: 0.7,
        lineHeight: 26,
    },
    bottomSection: {
        paddingBottom: Spacing.xl,
        paddingHorizontal: Spacing.xl,
        gap: Spacing.md,
    },
    signUpButtonWrapper: {
        // Button component handles its own styling
    },
    loginContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loginText: {
        fontSize: Typography.body.medium.fontSize as number,
        color: Colors.white,
        opacity: 0.9,
    },
})

export { OnBoarding }
