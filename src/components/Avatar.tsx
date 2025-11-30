import React from 'react'
import { View, Text, StyleSheet, ViewStyle } from 'react-native'
import { Colors, Typography } from '../constants'

interface AvatarProps {
    name: string
    size?: number
    style?: ViewStyle
}

/**
 * Avatar component that displays user initials in a circle
 * Extracts first letter of first name and first letter of last name
 */
const Avatar = ({ name, size = 60, style }: AvatarProps) => {
    // Extract initials from name
    const getInitials = (fullName: string): string => {
        const names = fullName.trim().split(' ')

        if (names.length === 0) return '??'

        // Get first letter of first name
        const firstInitial = names[0]?.[0]?.toUpperCase() || ''

        // Get first letter of last name (if exists)
        const lastInitial = names.length > 1
            ? names[names.length - 1]?.[0]?.toUpperCase() || ''
            : ''

        return firstInitial + lastInitial
    }

    const initials = getInitials(name)
    const fontSize = size * 0.4 // 40% of container size

    return (
        <View
            style={[
                styles.container,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                },
                style,
            ]}
        >
            <Text style={[styles.initials, { fontSize }]}>{initials}</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#371B34', // Primary color
        justifyContent: 'center',
        alignItems: 'center',
    },
    initials: {
        color: Colors.white,
        fontWeight: Typography.label.large.fontWeight as any,
    },
})

export { Avatar }
