import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NavigationCard, ConfirmationModal } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { mockParentData } from '../../data/MockParent'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'

type ParentProfileNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'ParentTabNavigator'
>

const ParentProfile = () => {
  const navigation = useNavigation<ParentProfileNavigationProp>()

  // Sample user data - replace with actual user data from context/state
  const userData = mockParentData

  // Logout confirmation modal state
  const [showLogoutModal, setShowLogoutModal] = useState(false)

  // Navigation handler
  const handleAvatarPress = () => {
    // Already on profile page, do nothing or refresh
    console.log('Already on profile page')
  }

  // Get initials from name
  const getInitials = (name: string) => {
    const names = name.split(' ')
    if (names.length >= 2) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase()
    }
    return name[0]?.toUpperCase() || 'U'
  }

  // Handle logout
  const handleLogout = () => {
    // Here you would typically:
    // 1. Clear user session/tokens
    // 2. Reset app state
    // 3. Navigate to login screen
    console.log('User logged out')
    setShowLogoutModal(false)
    // navigation.navigate('Login') // Uncomment when you have login screen
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
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{getInitials(userData.name)}</Text>
            </View>
          </View>

          <Text style={styles.userName}>{userData.name}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
        </View>

        {/* Account Information Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Information</Text>

          <View style={styles.infoCard}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Full Name</Text>
              <Text style={styles.infoValue}>{userData.name}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{userData.email}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Phone Number</Text>
              <Text style={styles.infoValue}>{userData.phone}</Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Emergency Contact</Text>
              <Text style={styles.infoValue}>{userData.emergencyContact}</Text>
            </View>
          </View>
        </View>

        {/* Children Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>My Children</Text>

          <View style={styles.childrenList}>
            {userData.children.map((child, index) => (
              <View key={child.id}>
                <View style={styles.childCard}>
                  <View style={styles.childAvatar}>
                    <Text style={styles.childAvatarText}>
                      {child.name.charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.childInfo}>
                    <Text style={styles.childName}>{child.name}</Text>
                    <Text style={styles.childDetails}>
                      {child.age} years old • {child.class}
                    </Text>
                  </View>
                </View>
                {index < userData.children.length - 1 && (
                  <View style={styles.divider} />
                )}
              </View>
            ))}
          </View>
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
  avatarContainer: {
    marginBottom: Spacing.sm,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#371B34',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: Colors.neutral[200],
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: Colors.white,
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
  childAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#62B76F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  childAvatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.white,
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
})

export { ParentProfile }
