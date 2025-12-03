import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ViewStyle } from 'react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Colors, Typography, Spacing } from '../constants'
import { Logo } from './Logo'
import { useNavigation } from '@react-navigation/native'

import { useAuth } from '../context/AuthProvider';

export type HeaderVariant = 'default' | 'drawer'

export interface HeaderProps {
  variant?: HeaderVariant
  onAvatarPress?: () => void
  onMenuPress?: () => void
  containerStyle?: ViewStyle
  avatarInitial?: string
  showBackButton?: boolean
  onBackPress?: () => void
}

export const Header: React.FC<HeaderProps> = ({
  variant = 'default',
  onAvatarPress,
  onMenuPress,
  containerStyle,
  avatarInitial = 'U',
  showBackButton = false,
  onBackPress,
}) => {
  const navigation = useNavigation()
  const { user, userProfile, isLoading: authLoading } = useAuth();

  // Function to get initials from name
  const getInitials = (name: string): string => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  };

  // Get initials from userProfile name or use the prop
  const displayInitial = userProfile?.name ? getInitials(userProfile.name) : avatarInitial;

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    } else {
      navigation.goBack()
    }
  }

  return (
    <View style={[styles.container, containerStyle]}>
      {/* Left Side: Back Button, Menu Icon, or Logo + Title */}
      {showBackButton ? (
        <>
          <TouchableOpacity
            onPress={handleBackPress}
            style={styles.backButton}
            activeOpacity={0.7}
          >
            <Icon name="chevron-left" size={24} color={Colors.black} />
          </TouchableOpacity>

          {/* Center: Logo + Title (when back button is active) */}
          <View style={styles.centerContainer}>
            <Logo width={40} height={33} />
            <Text style={styles.title}>
              LittleStep
            </Text>
          </View>
        </>
      ) : (
        <View style={styles.leftContainer}>
          {variant === 'drawer' && (
            <TouchableOpacity
              onPress={onMenuPress}
              style={styles.menuButton}
              activeOpacity={0.7}
            >
              <Icon name="bars" size={24} color={Colors.black} />
            </TouchableOpacity>
          )}
          <Logo width={40} height={33} />
          <Text style={styles.title}>LittleStep</Text>
        </View>
      )}

      {/* Right Side: Avatar */}
      <TouchableOpacity
        onPress={onAvatarPress}
        style={styles.avatar}
        activeOpacity={0.7}
      >
        <Text style={styles.avatarText}>{displayInitial}</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    marginRight: 40,
  },
  backButton: {
    padding: Spacing.xs,
    width: 40,
  },
  menuButton: {
    padding: Spacing.xs,
  },
  title: {
    fontSize: Typography.heading.h4.fontSize as number,
    fontWeight: '700',
    color: Colors.black,
    marginLeft: 0,
    letterSpacing: 1.5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#371B34',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight,
    color: Colors.white,
  },
})
