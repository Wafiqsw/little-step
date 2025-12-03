import React, { useState, useCallback } from 'react'
import { ScrollView, StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NavigationCard, Avatar, ConfirmationModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { logoutUser } from '../../firebase/auth'
import { collection, query, where, getDocs, doc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { Student } from '../../types/Student'
import { Users } from '../../types/Users'
import { getDataById } from '../../firebase/firestore'

import { useAuth } from '../../context/AuthProvider';

type ParentProfileNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'ParentTabNavigator'
>

const ParentProfile = () => {
  const navigation = useNavigation<ParentProfileNavigationProp>()
  const { userProfile, setUserProfile } = useAuth();

  // State for children/students
  const [children, setChildren] = useState<(Student & { id: string })[]>([])
  const [isLoadingChildren, setIsLoadingChildren] = useState(true)
  const [isLoadingProfile, setIsLoadingProfile] = useState(false)

  // Logout confirmation modal state
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
        console.log('✅ User profile refreshed')
      }
    } catch (error) {
      console.error('Error fetching user profile:', error)
    } finally {
      setIsLoadingProfile(false)
    }
  }, [setUserProfile])

  // Fetch children
  const fetchChildren = useCallback(async () => {
    try {
      setIsLoadingChildren(true)
      const currentUser = auth.currentUser
      if (!currentUser) {
        console.error('No authenticated user found')
        return
      }

      // Create reference to current user document
      const guardianRef = doc(db, 'users', currentUser.uid)

      // Query students where guardian equals current user reference
      const studentsRef = collection(db, 'students')
      const studentsQuery = query(studentsRef, where('guardian', '==', guardianRef))
      const studentsSnapshot = await getDocs(studentsQuery)

      const childrenData = studentsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (Student & { id: string })[]

      setChildren(childrenData)
      console.log(`✅ Found ${childrenData.length} children`)
    } catch (error) {
      console.error('Error fetching children:', error)
    } finally {
      setIsLoadingChildren(false)
    }
  }, [])

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 ParentProfile screen focused - refreshing data')
      fetchUserProfile()
      fetchChildren()
    }, [fetchUserProfile, fetchChildren])
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
                  <Text style={styles.infoValue}>{userProfile.name || 'Not set'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Email</Text>
                  <Text style={styles.infoValue}>{userProfile.email || 'Not set'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Phone Number</Text>
                  <Text style={styles.infoValue}>{userProfile.numphone || 'Not set'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>IC Number</Text>
                  <Text style={styles.infoValue}>{userProfile.ic || 'Not set'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Occupation</Text>
                  <Text style={styles.infoValue}>{userProfile.occupation || 'Not set'}</Text>
                </View>

                <View style={styles.divider} />

                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Address</Text>
                  <Text style={styles.infoValue}>{userProfile.address || 'Not set'}</Text>
                </View>

              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Unable to load profile</Text>
          </View>
        )}

        {/* Children Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Children</Text>

          {isLoadingChildren ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#371B34" />
              <Text style={styles.loadingText}>Loading children...</Text>
            </View>
          ) : children.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>No children registered yet</Text>
            </View>
          ) : (
            <View style={styles.childrenList}>
              {children.map((child, index) => (
                <View key={child.id}>
                  <View style={styles.childCard}>
                    <Avatar name={child.name} size={50} />
                    <View style={styles.childInfo}>
                      <Text style={styles.childName}>{child.name}</Text>
                      <Text style={styles.childDetails}>
                        {child.age} years old • {child.gender === 'male' ? 'Male' : 'Female'}
                      </Text>
                    </View>
                  </View>
                  {index < children.length - 1 && (
                    <View style={styles.divider} />
                  )}
                </View>
              ))}
            </View>
          )}

        </View>

        {/* Settings & Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Settings & Actions</Text>

          <View style={styles.menuList}>
            <NavigationCard
              label="Edit Profile"
              subheading="Update your account information"
              iconName="edit"
              iconColor="#2196F3"
              backgroundColor="#E3F2FD"
              onPress={() => navigation.navigate('ManageProfile')}
            />

            <NavigationCard
              label="Account Security"
              subheading="Change password and security settings"
              iconName="lock"
              iconColor="#FF9800"
              backgroundColor="#FFF3E0"
              onPress={() => navigation.navigate('ManageSecurity')}
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
  childrenList: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    gap: Spacing.md,
  },

  childInfo: {
    flex: 1,
    gap: 4,
  },
  childName: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
  },
  childDetails: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '400',
    color: Colors.text.secondary,
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

export { ParentProfile }
