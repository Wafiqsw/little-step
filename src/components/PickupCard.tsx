import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { Colors } from '../constants/colors'
import { Spacing, BorderRadius } from '../constants/spacing'
import { Shadows } from '../constants/shadows'
import { FontSize, FontWeight } from '../constants/typography'
import { Typography } from '../constants/typography'
import { Button } from './Button'
import Icon from 'react-native-vector-icons/FontAwesome'
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore'
import { db } from '../firebase'
import { AuthorisedPerson } from '../types/AuthorisedPerson'
import { Users } from '../types/Users'

interface PickupCardProps {
    name: string
    studentName: string
    variant: 'parent' | 'pickup'
    pickupTime?: string
    hasArrived?: boolean // Whether parent has arrived
    onPress?: () => void
    relationToStudent?: string // e.g., "Mother", "Father", "Guardian"
    phoneNumber?: string
    guardianUid?: string // UID of the student's main guardian (parent)
}

const PickupCard = ({
    name,
    studentName,
    variant,
    pickupTime,
    hasArrived = false,
    onPress,
    relationToStudent = 'Parent',
    phoneNumber,
    guardianUid
}: PickupCardProps) => {
    const [showModal, setShowModal] = useState(false)
    const [showGuardiansModal, setShowGuardiansModal] = useState(false)
    const [authorisedPersons, setAuthorisedPersons] = useState<(AuthorisedPerson & { id: string })[]>([])
    const [guardianProfile, setGuardianProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)
    const circleColor = variant === 'parent' ? Colors.secondary[300] : Colors.primary[300]

    const handleCardPress = () => {
        setShowModal(true)
        onPress?.()
    }

    const fetchGuardians = async () => {
        if (!guardianUid) {
            console.error('No guardian UID provided')
            return
        }

        try {
            setIsLoading(true)

            // Fetch the guardian's profile
            const guardianDocRef = doc(db, 'users', guardianUid)
            const guardianDoc = await getDoc(guardianDocRef)

            if (guardianDoc.exists()) {
                setGuardianProfile(guardianDoc.data() as Users)
            }

            // Fetch authorized persons assigned by this guardian
            const authorisedRef = collection(db, 'authorised_person')
            const authorisedQuery = query(
                authorisedRef,
                where('assigned_by', '==', guardianDocRef),
                where('archived', '==', false)
            )
            const authorisedSnapshot = await getDocs(authorisedQuery)

            const authorisedData = authorisedSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as (AuthorisedPerson & { id: string })[]

            setAuthorisedPersons(authorisedData)
            console.log(`✅ Fetched guardian profile and ${authorisedData.length} authorized persons`)
        } catch (error) {
            console.error('Error fetching guardians:', error)
        } finally {
            setIsLoading(false)
        }
    }

    const handleViewGuardians = () => {
        setShowModal(false)
        setShowGuardiansModal(true)
        fetchGuardians()
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
                                    <Text style={styles.detailLabel}>Name</Text>
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

                        {/* Buttons */}
                        <View style={styles.buttonGroup}>
                            <Button
                                label="View Guardians"
                                onPress={handleViewGuardians}
                                variant="secondary"
                                size="large"
                                fullWidth
                            />
                            <Button
                                label="Close"
                                onPress={() => setShowModal(false)}
                                variant="primary"
                                size="large"
                                fullWidth
                            />
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Guardians List Modal */}
            <Modal
                visible={showGuardiansModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowGuardiansModal(false)}
            >
                <View style={styles.overlay}>
                    <View style={styles.guardiansModalContainer}>
                        {/* Header */}
                        <View style={styles.guardiansHeader}>
                            <Text style={styles.guardiansTitle}>All Guardians</Text>
                            <TouchableOpacity
                                onPress={() => setShowGuardiansModal(false)}
                                style={styles.closeButton}
                            >
                                <Icon name="times" size={24} color={Colors.text.primary} />
                            </TouchableOpacity>
                        </View>

                        {isLoading ? (
                            <View style={styles.loadingContainer}>
                                <ActivityIndicator size="large" color={Colors.primary[500]} />
                                <Text style={styles.loadingText}>Loading guardians...</Text>
                            </View>
                        ) : (
                            <ScrollView
                                contentContainerStyle={styles.guardiansContent}
                                showsVerticalScrollIndicator={false}
                            >
                                {/* Parent (Main Guardian) */}
                                {guardianProfile && (
                                    <View style={styles.guardianItem}>
                                        <View style={[styles.guardianCircle, { backgroundColor: Colors.secondary[300] }]} />
                                        <View style={styles.guardianInfo}>
                                            <View style={styles.parentBadgeRow}>
                                                <Text style={styles.guardianName}>{guardianProfile.name}</Text>
                                                <View style={styles.parentBadge}>
                                                    <Text style={styles.parentBadgeText}>Parent</Text>
                                                </View>
                                            </View>
                                            <Text style={styles.guardianRelation}>Main Guardian</Text>
                                            <Text style={styles.guardianPhone}>{guardianProfile.numphone}</Text>
                                        </View>
                                    </View>
                                )}

                                {/* Additional Guardians */}
                                {authorisedPersons.length > 0 ? (
                                    authorisedPersons.map((person) => {
                                        const isParent = person.relationship.toLowerCase() === 'mother' || person.relationship.toLowerCase() === 'father'
                                        const circleColor = isParent ? Colors.secondary[300] : Colors.primary[300]

                                        return (
                                            <View key={person.id} style={styles.guardianItem}>
                                                <View style={[styles.guardianCircle, { backgroundColor: circleColor }]} />
                                                <View style={styles.guardianInfo}>
                                                    <Text style={styles.guardianName}>{person.name}</Text>
                                                    <Text style={styles.guardianRelation}>{person.relationship}</Text>
                                                    <Text style={styles.guardianPhone}>{person.numphone}</Text>
                                                </View>
                                            </View>
                                        )
                                    })
                                ) : (
                                    !guardianProfile && <Text style={styles.emptyText}>No guardians registered yet</Text>
                                )}
                            </ScrollView>
                        )}

                        {/* Close Button */}
                        <Button
                            label="Close"
                            onPress={() => setShowGuardiansModal(false)}
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
    buttonGroup: {
        gap: Spacing.sm,
    },
    // Guardians Modal styles
    guardiansModalContainer: {
        backgroundColor: Colors.white,
        borderRadius: BorderRadius.lg,
        padding: Spacing.xl,
        width: '100%',
        maxWidth: 500,
        maxHeight: '80%',
    },
    guardiansHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        paddingBottom: Spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: Colors.neutral[200],
    },
    guardiansTitle: {
        fontSize: Typography.heading.h2.fontSize as number,
        fontWeight: Typography.heading.h2.fontWeight as any,
        color: Colors.text.primary,
    },
    closeButton: {
        padding: Spacing.xs,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: Spacing['2xl'],
        gap: Spacing.md,
    },
    loadingText: {
        fontSize: FontSize.base,
        color: Colors.text.secondary,
    },
    guardiansContent: {
        paddingVertical: Spacing.sm,
    },
    guardianSection: {
        marginBottom: Spacing.lg,
    },
    guardianSectionTitle: {
        fontSize: Typography.heading.h3.fontSize as number,
        fontWeight: Typography.heading.h3.fontWeight as any,
        color: Colors.text.primary,
        marginBottom: Spacing.md,
    },
    guardianItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.neutral[50],
        padding: Spacing.base,
        borderRadius: BorderRadius.md,
        marginBottom: Spacing.sm,
        ...Shadows.xs,
    },
    guardianCircle: {
        width: 48,
        height: 48,
        borderRadius: BorderRadius.full,
        marginRight: Spacing.md,
    },
    guardianInfo: {
        flex: 1,
    },
    guardianName: {
        fontSize: FontSize.base,
        fontWeight: FontWeight.semibold,
        color: Colors.text.primary,
        marginBottom: Spacing.xs / 2,
    },
    guardianRelation: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.regular,
        color: Colors.text.secondary,
        marginBottom: Spacing.xs / 2,
    },
    guardianPhone: {
        fontSize: FontSize.sm,
        fontWeight: FontWeight.regular,
        color: Colors.primary[600],
    },
    sectionDivider: {
        height: 1,
        backgroundColor: Colors.neutral[300],
        marginVertical: Spacing.md,
    },
    emptyText: {
        fontSize: FontSize.sm,
        color: Colors.text.secondary,
        fontStyle: 'italic',
        textAlign: 'center',
        paddingVertical: Spacing.lg,
    },
    parentBadgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.sm,
        marginBottom: Spacing.xs / 2,
    },
    parentBadge: {
        backgroundColor: Colors.secondary[100],
        paddingHorizontal: Spacing.sm,
        paddingVertical: Spacing.xs / 2,
        borderRadius: BorderRadius.sm,
    },
    parentBadgeText: {
        fontSize: FontSize.xs,
        fontWeight: FontWeight.semibold,
        color: Colors.secondary[700],
    },
})

export { PickupCard }
