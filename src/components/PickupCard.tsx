import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native'
import React, { useState } from 'react'
import { Colors } from '../constants/colors'
import { Spacing, BorderRadius } from '../constants/spacing'
import { Shadows } from '../constants/shadows'
import { FontSize, FontWeight } from '../constants/typography'
import { Typography } from '../constants/typography'
import { Button } from './Button'
import Icon from 'react-native-vector-icons/FontAwesome'

interface PickupCardProps {
    name: string
    studentName: string
    variant: 'parent' | 'pickup'
    pickupTime?: string
    hasArrived?: boolean // Whether parent has arrived
    onPress?: () => void
    relationToStudent?: string // e.g., "Mother", "Father", "Guardian"
    phoneNumber?: string
}

const PickupCard = ({
    name,
    studentName,
    variant,
    pickupTime,
    hasArrived = false,
    onPress,
    relationToStudent = 'Parent',
    phoneNumber
}: PickupCardProps) => {
    const [showModal, setShowModal] = useState(false)
    const circleColor = variant === 'parent' ? Colors.secondary[300] : Colors.primary[300]

    const handleCardPress = () => {
        setShowModal(true)
        onPress?.()
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
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{studentName}</Text>
                            {hasArrived && (
                                <View style={styles.arrivedTag}>
                                    <Text style={styles.arrivedText}>Arrived</Text>
                                </View>
                            )}
                        </View>
                        <Text style={styles.parentLabel}>Parent: {name}</Text>
                    </View>
                </View>

                <View style={styles.rightSection}>
                    {pickupTime && (
                        <Text style={styles.pickupTime}>{pickupTime}</Text>
                    )}
                    <View style={styles.arrowContainer}>
                        <Text style={styles.arrow}>→</Text>
                    </View>
                </View>
            </TouchableOpacity>

            {/* Modal */}
            <Modal
                visible={showModal}
                transparent
                animationType="fade"
                onRequestClose={() => setShowModal(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.modalContainer}>
                        {/* Header */}
                        <View style={styles.modalHeader}>
                            <View style={[styles.modalCircle, { backgroundColor: circleColor }]} />
                            <Text style={styles.modalTitle}>{studentName}</Text>
                        </View>

                        {/* Details */}
                        <View style={styles.detailsSection}>
                            <View style={styles.detailRow}>
                                <Icon name="user" size={18} color={Colors.text.secondary} />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Pickup Person</Text>
                                    <Text style={styles.detailValue}>{name}</Text>
                                </View>
                            </View>

                            <View style={styles.detailRow}>
                                <Icon name="heart" size={18} color={Colors.text.secondary} />
                                <View style={styles.detailTextContainer}>
                                    <Text style={styles.detailLabel}>Relation</Text>
                                    <Text style={styles.detailValue}>{relationToStudent}</Text>
                                </View>
                            </View>

                            {phoneNumber && (
                                <View style={styles.detailRow}>
                                    <Icon name="phone" size={18} color={Colors.text.secondary} />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Phone Number</Text>
                                        <Text style={styles.detailValue}>{phoneNumber}</Text>
                                    </View>
                                </View>
                            )}

                            {pickupTime && (
                                <View style={styles.detailRow}>
                                    <Icon name="clock-o" size={18} color={Colors.text.secondary} />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Pickup Time</Text>
                                        <Text style={styles.detailValue}>{pickupTime}</Text>
                                    </View>
                                </View>
                            )}

                            {hasArrived && (
                                <View style={styles.detailRow}>
                                    <Icon name="check-circle" size={18} color="#4CAF50" />
                                    <View style={styles.detailTextContainer}>
                                        <Text style={styles.detailLabel}>Status</Text>
                                        <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
                                            Has Arrived
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Close Button */}
                        <Button
                            label="Close"
                            onPress={() => setShowModal(false)}
                            variant="primary"
                            size="large"
                            fullWidth
                        />
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
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
    },
    name: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
    },
    arrivedTag: {
        backgroundColor: Colors.info.light,
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs / 2,
        borderRadius: BorderRadius.sm,
    },
    arrivedText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.info.dark,
    },
    parentLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.regular,
        color: Colors.text.secondary,
        marginTop: Spacing.xs / 2,
    },
    rightSection: {
        alignItems: 'flex-end',
    },
    pickupTime: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.regular,
        color: Colors.text.secondary,
        marginBottom: Spacing.xs / 2,
    },
    arrowContainer: {
        marginLeft: Spacing.sm,
    },
    arrow: {
        fontSize: FontSize.xl,
        color: Colors.text.primary,
    },
    // Modal styles
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
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: Spacing.xl,
    },
    modalCircle: {
        width: 64,
        height: 64,
        borderRadius: BorderRadius.full,
        marginBottom: Spacing.md,
    },
    modalTitle: {
        fontSize: Typography.heading.h2.fontSize as number,
        fontWeight: Typography.heading.h2.fontWeight as any,
        color: Colors.text.primary,
        textAlign: 'center',
    },
    detailsSection: {
        gap: Spacing.base,
        marginBottom: Spacing.xl,
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: Spacing.md,
    },
    detailTextContainer: {
        flex: 1,
    },
    detailLabel: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.regular,
        color: Colors.text.secondary,
        marginBottom: Spacing.xs / 2,
    },
    detailValue: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.medium,
        color: Colors.text.primary,
    },
})

export { PickupCard }
