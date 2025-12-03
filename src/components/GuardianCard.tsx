import { View, Text, StyleSheet, TouchableOpacity, Modal, TextInput } from 'react-native'
import React, { useState } from 'react'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Button } from './Button'
import { Colors } from '../constants/colors'
import { Spacing, BorderRadius } from '../constants/spacing'
import { Shadows } from '../constants/shadows'
import { FontSize, FontWeight } from '../constants/typography'

interface GuardianCardProps {
    name: string
    relationship: string
    variant: 'parent' | 'pickup'
    phoneNumber?: string
    isArchived?: boolean
    onPress?: () => void
    onSave?: (data: { name: string; phoneNumber: string; relationship: string }) => void
    onArchive?: () => void
    onDelete?: () => void
}

const GuardianCard = ({ name, relationship, variant, phoneNumber = '', isArchived = false, onPress, onSave, onArchive, onDelete }: GuardianCardProps) => {
    const [modalVisible, setModalVisible] = useState(false)
    const [showMoreMenu, setShowMoreMenu] = useState(false)
    const [nameValue, setNameValue] = useState(name)
    const [phone, setPhone] = useState(phoneNumber)
    const [relationshipValue, setRelationshipValue] = useState(relationship)

    const circleColor = variant === 'parent' ? Colors.secondary[300] : Colors.primary[300]

    const handleCardPress = () => {
        if (onPress) {
            onPress()
        }
        setModalVisible(true)
    }

    const handleSave = () => {
        if (onSave) {
            onSave({
                name: nameValue,
                phoneNumber: phone,
                relationship: relationshipValue,
            })
        }
        setModalVisible(false)
        setShowMoreMenu(false)
    }

    const handleDiscard = () => {
        // Reset to original values
        setNameValue(name)
        setPhone(phoneNumber)
        setRelationshipValue(relationship)
        setModalVisible(false)
        setShowMoreMenu(false)
    }

    const handleArchive = () => {
        if (onArchive) {
            onArchive()
        }
        setShowMoreMenu(false)
        setModalVisible(false)
    }

    const handleDelete = () => {
        if (onDelete) {
            onDelete()
        }
        setShowMoreMenu(false)
        setModalVisible(false)
    }

    return (
        <>
            <TouchableOpacity
                style={styles.container}
                onPress={handleCardPress}
                activeOpacity={0.7}
            >
                <View style={styles.leftSection}>
                    <View style={[styles.circle, { backgroundColor: circleColor }]} />
                    <View style={styles.textContainer}>
                        <Text style={styles.name}>{name}</Text>
                        <Text style={styles.relationship}>({relationship})</Text>
                    </View>
                </View>

                <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>→</Text>
                </View>
            </TouchableOpacity>

            <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleDiscard}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.modalHeader}>
                            <Text style={styles.modalTitle}>Edit Guardian</Text>
                            <TouchableOpacity
                                style={styles.moreButton}
                                onPress={() => setShowMoreMenu(!showMoreMenu)}
                                activeOpacity={0.7}
                            >
                                <Icon name="ellipsis-v" size={20} color={Colors.text.primary} />
                            </TouchableOpacity>

                            {showMoreMenu && (
                                <View style={styles.dropdownMenu}>
                                    <TouchableOpacity
                                        style={styles.dropdownItem}
                                        onPress={handleArchive}
                                        activeOpacity={0.7}
                                    >
                                        <Icon
                                            name={isArchived ? "upload" : "archive"}
                                            size={18}
                                            color={Colors.text.primary}
                                        />
                                        <Text style={styles.dropdownText}>
                                            {isArchived ? "Unarchive" : "Archive"}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.dropdownItem, styles.dropdownItemLast]}
                                        onPress={handleDelete}
                                        activeOpacity={0.7}
                                    >
                                        <Icon name="trash" size={18} color="#DC2626" />
                                        <Text style={[styles.dropdownText, styles.dropdownTextDelete]}>Delete</Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Name</Text>
                            <TextInput
                                style={styles.input}
                                value={nameValue}
                                onChangeText={setNameValue}
                                placeholder="Enter name"
                                placeholderTextColor={Colors.text.hint}
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Phone Number</Text>
                            <TextInput
                                style={styles.input}
                                value={phone}
                                onChangeText={setPhone}
                                placeholder="Enter phone number"
                                placeholderTextColor={Colors.text.hint}
                                keyboardType="phone-pad"
                            />
                        </View>

                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Relationship</Text>
                            <TextInput
                                style={styles.input}
                                value={relationshipValue}
                                onChangeText={setRelationshipValue}
                                placeholder="Enter relationship"
                                placeholderTextColor={Colors.text.hint}
                            />
                        </View>

                        <View style={styles.bottomSection}>
                            <View style={styles.mainButtonsContainer}>
                                <Button
                                    label="Discard"
                                    onPress={handleDiscard}
                                    variant="secondary"
                                    style={styles.buttonFlex}
                                />
                                <Button
                                    label="Save"
                                    onPress={handleSave}
                                    variant="primary"
                                    style={styles.buttonFlex}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
        </>
    )
}

const CIRCLE_SIZE = 32

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.white,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.base,
        borderRadius: BorderRadius.lg,
        borderWidth: 1,
        borderColor: '#D0D0D0',
        ...Shadows.sm,
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    circle: {
        width: CIRCLE_SIZE,
        height: CIRCLE_SIZE,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.md,
    },
    textContainer: {
        flexDirection: 'column',
        flex: 1,
    },
    name: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
    },
    relationship: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.regular,
        color: Colors.text.secondary,
        marginTop: Spacing.xs / 2,
    },
    arrowContainer: {
        marginLeft: Spacing.sm,
    },
    arrow: {
        fontSize: FontSize.xl,
        color: Colors.text.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        padding: Spacing.xl,
    },
    modalContent: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.xl,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 400,
        ...Shadows.lg,
    },
    modalHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: Spacing.md,
        position: 'relative',
    },
    modalTitle: {
        fontSize: FontSize.xl,
        fontWeight: FontWeight.bold,
        color: Colors.text.primary,
    },
    moreButton: {
        padding: Spacing.xs,
        marginRight: -Spacing.xs,
    },
    dropdownMenu: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.md,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        minWidth: 150,
        overflow: 'hidden',
        ...Shadows.lg,
        zIndex: 1000,
    },
    dropdownItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        gap: Spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    dropdownItemLast: {
        borderBottomWidth: 0,
    },
    dropdownText: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
    },
    dropdownTextDelete: {
        color: '#DC2626',
    },
    inputContainer: {
        marginBottom: Spacing.base,
    },
    inputLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
        marginBottom: Spacing.xs,
    },
    input: {
        borderWidth: 1,
        borderColor: '#D0D0D0',
        borderRadius: BorderRadius.md,
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        fontSize: FontSize.base,
        color: Colors.text.primary,
        backgroundColor: Colors.white,
    },
    bottomSection: {
        borderTopWidth: 1,
        borderTopColor: '#E5E5E5',
        paddingTop: Spacing.base,
        marginTop: Spacing.base,
    },
    mainButtonsContainer: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    buttonFlex: {
        flex: 1,
    },
})

export { GuardianCard }
