import React from 'react'
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import { Colors, Typography, Spacing, BorderRadius } from '../constants'
import { Avatar } from './Avatar'
import Icon from 'react-native-vector-icons/FontAwesome'

export interface StudentCardData {
    id: number
    studentName: string
    studentId: string
    class: string
    age: number
    gender: 'male' | 'female'
    parentName: string
    parentPhone: string
    parentHasAccount: boolean
}

interface StudentCardProps {
    student: StudentCardData
    onPress?: (studentId: number) => void
}

const StudentCard = ({ student, onPress }: StudentCardProps) => {
    return (
        <TouchableOpacity
            style={styles.studentCard}
            onPress={() => onPress?.(student.id)}
            activeOpacity={0.7}
        >
            {/* Student Info Section */}
            <View style={styles.studentInfoSection}>
                <Avatar name={student.studentName} size={60} />
                <View style={styles.studentDetails}>
                    <Text style={styles.studentName}>{student.studentName}</Text>
                    <View style={styles.studentMeta}>
                        <View style={styles.metaItem}>
                            <Icon name="id-card" size={12} color={Colors.text.secondary} />
                            <Text style={styles.metaText}>{student.studentId}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="users" size={12} color={Colors.text.secondary} />
                            <Text style={styles.metaText}>{student.class}</Text>
                        </View>
                        <View style={styles.metaItem}>
                            <Icon name="birthday-cake" size={12} color={Colors.text.secondary} />
                            <Text style={styles.metaText}>{student.age} years</Text>
                        </View>
                    </View>
                </View>
            </View>

            {/* Divider */}
            <View style={styles.cardDivider} />

            {/* Parent Info Section */}
            <View style={styles.parentInfoSection}>
                <View style={styles.parentInfoRow}>
                    <Icon name="user-circle" size={16} color={Colors.primary[600]} />
                    <Text style={styles.parentLabel}>Parent:</Text>
                    <Text style={styles.parentValue}>{student.parentName}</Text>
                </View>
                <View style={styles.parentInfoRow}>
                    <Icon name="phone" size={16} color={Colors.primary[600]} />
                    <Text style={styles.parentLabel}>Phone:</Text>
                    <Text style={styles.parentValue}>{student.parentPhone}</Text>
                </View>
                <View style={styles.parentInfoRow}>
                    <Icon
                        name={student.parentHasAccount ? 'check-circle' : 'circle-o'}
                        size={16}
                        color={student.parentHasAccount ? '#4CAF50' : Colors.text.disabled}
                    />
                    <Text style={styles.parentLabel}>Account:</Text>
                    <Text
                        style={[
                            styles.accountStatus,
                            student.parentHasAccount
                                ? styles.accountActive
                                : styles.accountPending,
                        ]}
                    >
                        {student.parentHasAccount ? 'Registered' : 'Pending'}
                    </Text>
                </View>
            </View>

            {/* Edit Button */}
            <TouchableOpacity
                style={styles.editButton}
                onPress={() => onPress?.(student.id)}
            >
                <Icon name="edit" size={14} color={Colors.white} />
            </TouchableOpacity>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    studentCard: {
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.border.light,
        borderRadius: BorderRadius.lg,
        padding: Spacing.md,
        gap: Spacing.md,
        position: 'relative',
    },
    studentInfoSection: {
        flexDirection: 'row',
        gap: Spacing.md,
    },
    studentDetails: {
        flex: 1,
        gap: Spacing.xs,
    },
    studentName: {
        fontSize: Typography.heading.h3.fontSize as number,
        fontWeight: Typography.heading.h3.fontWeight as any,
        color: Colors.black,
    },
    studentMeta: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: Spacing.sm,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    metaText: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.text.secondary,
    },
    cardDivider: {
        height: 1,
        backgroundColor: Colors.border.light,
    },
    parentInfoSection: {
        gap: Spacing.xs,
    },
    parentInfoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: Spacing.xs,
    },
    parentLabel: {
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.text.secondary,
        fontWeight: '600',
        width: 60,
    },
    parentValue: {
        flex: 1,
        fontSize: Typography.body.small.fontSize as number,
        color: Colors.text.primary,
    },
    accountStatus: {
        flex: 1,
        fontSize: Typography.body.small.fontSize as number,
        fontWeight: '600',
    },
    accountActive: {
        color: '#4CAF50',
    },
    accountPending: {
        color: '#FF9800',
    },
    editButton: {
        position: 'absolute',
        top: Spacing.md,
        right: Spacing.md,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#371B34', // Primary color
        justifyContent: 'center',
        alignItems: 'center',
    },
})

export { StudentCard }
