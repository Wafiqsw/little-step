import React from 'react'
import { Modal, View, Text, StyleSheet, ActivityIndicator } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { Button } from './Button'
import { Form } from './Form'

export interface EditModalProps {
    visible: boolean
    title: string
    value: string
    onChangeText: (text: string) => void
    onSave: () => void
    onCancel: () => void
    isLoading?: boolean
    placeholder?: string
    label?: string
}

export const EditModal: React.FC<EditModalProps> = ({
    visible,
    title,
    value,
    onChangeText,
    onSave,
    onCancel,
    isLoading = false,
    placeholder = 'Enter text...',
    label = 'Text',
}) => {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={isLoading ? undefined : onCancel}
        >
            <View style={styles.modalOverlay}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>{title}</Text>
                    <Form
                        label={label}
                        variant="simple"
                        size="large"
                        placeholder={placeholder}
                        multiline
                        numberOfLines={4}
                        value={value}
                        onChangeText={onChangeText}
                        inputStyle={{ minHeight: 100, textAlignVertical: 'top' }}
                    />
                    <View style={styles.modalButtons}>
                        <Button
                            label="Cancel"
                            variant="secondary"
                            onPress={onCancel}
                            disabled={isLoading}
                        />
                        <Button
                            label={isLoading ? "Saving..." : "Save Changes"}
                            variant="primary"
                            onPress={onSave}
                            disabled={!value.trim() || isLoading}
                            icon={isLoading ? <ActivityIndicator size="small" color={Colors.white} /> : undefined}
                        />
                    </View>
                </View>
            </View>
        </Modal>
    )
}

const styles = StyleSheet.create({
    modalOverlay: {
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
        width: '90%',
        maxWidth: 500,
        gap: Spacing.md,
    },
    modalTitle: {
        fontSize: Typography.heading.h2.fontSize as number,
        fontWeight: Typography.heading.h2.fontWeight as any,
        color: Colors.black,
        marginBottom: Spacing.sm,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: Spacing.md,
        marginTop: Spacing.sm,
    },
})
