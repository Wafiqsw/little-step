import React, { useState } from 'react'
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ViewStyle,
    TextStyle,
    DimensionValue,
    TextInputProps,
    TouchableOpacity,
} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import {
    Colors,
    Typography,
    Spacing,
    BorderRadius,
    Shadows,
} from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'

export type PasswordInputVariant = 'gradient' | 'simple'
export type PasswordInputSize = 'small' | 'medium' | 'large'

export interface PasswordInputProps extends Omit<TextInputProps, 'secureTextEntry'> {
    label: string
    variant?: PasswordInputVariant
    size?: PasswordInputSize
    width?: DimensionValue
    borderRadius?: number
    labelStyle?: TextStyle
    inputStyle?: TextStyle
    containerStyle?: ViewStyle
    error?: string
}

const PasswordInput: React.FC<PasswordInputProps> = ({
    label,
    variant = 'gradient',
    size = 'medium',
    width,
    borderRadius,
    labelStyle,
    inputStyle,
    containerStyle,
    error,
    ...textInputProps
}) => {
    const [showPassword, setShowPassword] = useState(false)

    const getSizeStyles = (): ViewStyle => {
        switch (size) {
            case 'small':
                return {
                    paddingHorizontal: Spacing.sm,
                    paddingVertical: Spacing.xs,
                    minHeight: 36,
                }
            case 'medium':
                return {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    minHeight: 44,
                }
            case 'large':
                return {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    minHeight: 52,
                }
            default:
                return {
                    paddingHorizontal: Spacing.md,
                    paddingVertical: Spacing.sm,
                    minHeight: 44,
                }
        }
    }

    const getFontSize = (): number => {
        switch (size) {
            case 'small':
                return Typography.body.small.fontSize as number
            case 'large':
                return Typography.body.large.fontSize as number
            default:
                return Typography.body.medium.fontSize as number
        }
    }

    const renderInput = () => {
        const sizeStyles = getSizeStyles()
        const fontSize = getFontSize()

        const inputContent = (
            <View style={styles.inputWrapper}>
                <Icon
                    name="lock"
                    size={18}
                    color={Colors.text.secondary}
                    style={styles.lockIcon}
                />
                <TextInput
                    style={[
                        styles.input,
                        {
                            fontSize,
                        },
                        inputStyle,
                    ]}
                    placeholderTextColor={Colors.text.hint}
                    secureTextEntry={!showPassword}
                    autoCapitalize="none"
                    {...textInputProps}
                />
                <TouchableOpacity
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeButton}
                >
                    <Icon
                        name={showPassword ? 'eye' : 'eye-slash'}
                        size={18}
                        color={Colors.text.secondary}
                    />
                </TouchableOpacity>
            </View>
        )

        if (variant === 'gradient') {
            return (
                <View
                    style={[
                        styles.gradientContainer,
                        sizeStyles,
                        {
                            borderRadius: borderRadius ?? BorderRadius.base,
                        },
                        Shadows.sm,
                    ]}
                >
                    <LinearGradient
                        colors={['#FCDDEC', '#ECE0B3']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={[
                            styles.gradient,
                            {
                                borderRadius: borderRadius ?? BorderRadius.base,
                            },
                        ]}
                    >
                        {inputContent}
                    </LinearGradient>
                </View>
            )
        }

        return (
            <View
                style={[
                    styles.simpleInputContainer,
                    sizeStyles,
                    {
                        borderRadius: borderRadius ?? BorderRadius.base,
                    },
                ]}
            >
                {inputContent}
            </View>
        )
    }

    return (
        <View
            style={[
                styles.container,
                {
                    width: width ?? '100%',
                },
                containerStyle,
            ]}
        >
            <Text style={[styles.label, labelStyle]}>{label}</Text>
            {renderInput()}
            {error && <Text style={styles.errorText}>{error}</Text>}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        marginBottom: Spacing.md,
    },
    label: {
        fontSize: Typography.label.medium.fontSize as number,
        fontWeight: Typography.label.medium.fontWeight,
        color: Colors.black,
        marginBottom: Spacing.xs,
    },
    gradientContainer: {
        borderWidth: 1,
        borderColor: '#D9D9D9',
        overflow: 'hidden',
    },
    gradient: {
        borderRadius: BorderRadius.base,
    },
    simpleInputContainer: {
        backgroundColor: '#F0F0F0',
        borderWidth: 1,
        borderColor: '#D9D9D9',
        borderRadius: BorderRadius.base,
    },
    inputWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    lockIcon: {
        marginRight: Spacing.sm,
    },
    input: {
        flex: 1,
        color: Colors.black,
        fontFamily: Typography.body.medium.fontFamily,
        padding: 0,
    },
    eyeButton: {
        padding: Spacing.xs,
    },
    errorText: {
        fontSize: Typography.caption.fontSize as number,
        color: Colors.error.main,
        marginTop: Spacing.xs,
    },
})

export { PasswordInput }
