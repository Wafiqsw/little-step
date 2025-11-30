import React from 'react'
import { Modal, View, Text, StyleSheet } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button } from './Button'

export type ResultModalVariant = 'success' | 'error'

interface ResultModalProps {
    visible: boolean
    variant?: ResultModalVariant
    title: string
    message: string
    onClose: () => void
    buttonText?: string
}

const ResultModal = ({
    visible,
    variant = 'success',
    title,
    message,
    onClose,
    buttonText = 'Done',
}: ResultModalProps) => {
    const iconConfig = {
        success: {
            name: 'check-circle' as const,
            color: '#4CAF50',
        },
        error: {
            name: 'times-circle' as const,
            color: Colors.error.main,
        },
    }

    const config = iconConfig[variant]

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Icon */}
                    <View style={styles.iconContainer}>
                        <Icon name={config.name} size={64} color={config.color} />
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{title}</Text>

                    {/* Message */}
                    <Text style={styles.message}>{message}</Text>

                    {/* Button */}
                    <Button
                        label={buttonText}
                        onPress={onClose}
                        variant="primary"
                        size="large"
                        fullWidth
                    />
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.lg,
    },
    modalContainer: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 400,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: Spacing.lg,
    },
    title: {
        fontSize: Typography.heading.h2.fontSize as number,
        fontWeight: Typography.heading.h2.fontWeight as any,
        color: Colors.text.primary,
        textAlign: 'center',
        marginBottom: Spacing.sm,
    },
    message: {
        fontSize: Typography.body.medium.fontSize as number,
        color: Colors.text.secondary,
        textAlign: 'center',
        marginBottom: Spacing.xl,
        lineHeight: 22,
    },
})

// Keep SuccessModal as alias for backwards compatibility
export const SuccessModal = (props: Omit<ResultModalProps, 'variant'>) => (
    <ResultModal {...props} variant="success" />
)

export { ResultModal }
