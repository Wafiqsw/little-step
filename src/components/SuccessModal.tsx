import React from 'react'
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button } from './Button'

interface SuccessModalProps {
    visible: boolean
    title: string
    message: string
    onClose: () => void
    buttonText?: string
}

const SuccessModal = ({
    visible,
    title,
    message,
    onClose,
    buttonText = 'Done',
}: SuccessModalProps) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={styles.modalContainer}>
                    {/* Success Icon */}
                    <View style={styles.iconContainer}>
                        <Icon name="check-circle" size={64} color="#4CAF50" />
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

export { SuccessModal }
