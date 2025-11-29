import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { Colors } from '../constants/colors'
import { Spacing, BorderRadius } from '../constants/spacing'
import { Shadows } from '../constants/shadows'
import { FontSize, FontWeight } from '../constants/typography'

interface PickupCardProps {
    name: string
    studentName: string
    variant: 'parent' | 'pickup'
    pickupTime?: string
    hasArrived?: boolean // Whether parent has arrived
    onPress?: () => void
}

const PickupCard = ({ name, studentName, variant, pickupTime, hasArrived = false, onPress }: PickupCardProps) => {
    const circleColor = variant === 'parent' ? Colors.secondary[300] : Colors.primary[300]

    return (
        <TouchableOpacity
            style={styles.container}
            onPress={onPress}
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
})

export { PickupCard }
