import React, { useState, useCallback } from 'react'
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NavigationCard, Avatar, ConfirmationModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { logoutUser } from '../../firebase/auth'
import { auth } from '../../firebase'
import { getDataById } from '../../firebase/firestore'
import { Users } from '../../types/Users'

import { useAuth } from '../../context/AuthProvider';

type TeacherProfileNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'TeacherTabNavigator'
>

const TeacherProfile = () => {
  const navigation = useNavigation<TeacherProfileNavigationProp>()
  const { userProfile, setUserProfile } = useAuth();

  // State
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Fetch user profile data
  const fetchUserProfile = useCallback(async () => {
    try {
      setIsLoadingProfile(true)
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error('No authenticated user found')
        return
      }

      const userData = await getDataById<Users>('users', currentUser.uid)
      if (userData && setUserProfile) {
        setUserProfile(userData)
        console.log('✅ Teacher profile refreshed')
      }
    } catch (error) {
      console.error('Error fetching teacher profile:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [setUserProfile])

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 TeacherProfile screen focused - refreshing data')
      fetchUserProfile()
    }, [fetchUserProfile])
  )

  // Navigation handler
  const handleAvatarPress = () => {
    // Already on profile page, do nothing or refresh
    console.log('Already on profile page')
  }

  // Handle logout
  const handleLogout = async () => {
    try {
      console.log('🔄 Logging out...')

      // Firebase logout
      await logoutUser()
      console.log('✅ Logout successful!')
      setShowLogoutModal(false)

      // Navigate to login screen and clear stack
      navigation.replace('Login')

    } catch (error: any) {
      console.log('❌ Logout failed!')
      console.log('Error Code:', error.code)
      console.log('Error Message:', error.message)
      setShowLogoutModal(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Profile Section */}
        {isLoadingProfile ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#371B34" />
            <Text style={styles.loadingText}>Refreshing profile...</Text>
          </View>
        ) : userProfile ? (
          <>
            <View style={styles.profileSection}>
              <Avatar name={userProfile.name || 'User'} size={100} />
              <Text style={styles.userName}>{userProfile.name || 'User'}</Text>
              <Text style={styles.userEmail}>{userProfile.email || ''}</Text>
            </View>

            {/* Account Information Section */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Account Information</Text>

              <View style={styles.infoCard}>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Full Name</Text>
                  <Text style={styles.infoValue}>{userProfile.name || '-'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userProfile.email || '-'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{userProfile.numphone || '-'}</Text>
                </View>

              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Unable to load profile</Text>
          </View>
        )}

        {/* Settings & Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Actions</Text>

          <View style={styles.menuList}>
            <NavigationCard
              label="Manage Students"
              subheading="View and manage student accounts and parents"
              iconName="graduation-cap"
              iconColor="#4CAF50"
              backgroundColor="#E8F5E9"
              onPress={() => navigation.navigate('TeacherManageStudents')}
            />

            <NavigationCard
              label="Account Security"
              subheading="Change password and security settings"
              iconName="lock"
              iconColor="#FF9800"
              backgroundColor="#FFF3E0"
              onPress={() => navigation.navigate('TeacherManageSecurity')}
            />

            <NavigationCard
              label="Logout"
              subheading="Sign out of your account"
              iconName="sign-out"
              iconColor="#F44336"
              backgroundColor="#FFEBEE"
              onPress={() => setShowLogoutModal(true)}
            />
          </View>
        </View>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <ConfirmationModal
        visible={showLogoutModal}
        title="Logout"
        message="Are you sure you want to sign out of your account?"
        confirmText="Logout"
        cancelText="Cancel"
        confirmColor="#F44336"
        iconName="sign-out"
        iconColor="#F44336"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollContent: {
    padding: Spacing.md,
    gap: Spacing.lg,
  },
  pageTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  userName: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.black,
  },
  userEmail: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '400',
    color: Colors.text.secondary,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  infoRow: {
    paddingVertical: Spacing.sm,
    gap: 4,
  },
  infoLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  infoValue: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
  },
  menuList: {
    gap: Spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
  },
  emptyState: {
    padding: Spacing.lg,
    backgroundColor: Colors.neutral[50],
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyStateText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    textAlign: 'center',
  },
})

export { TeacherProfile }
