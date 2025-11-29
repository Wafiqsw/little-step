import React, { useState } from 'react'
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NavigationCard } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { useNavigation } from '@react-navigation/native'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import Icon from 'react-native-vector-icons/FontAwesome'

type ManageSecurityNavigationProp = NativeStackNavigationProp<
  MainNavigatorParamList,
  'ParentTabNavigator'
>

const ManageSecurity = () => {
  const navigation = useNavigation<ManageSecurityNavigationProp>()

  const [biometricEnabled, setBiometricEnabled] = useState(false)

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.pageTitle}>Account Security</Text>
        <Text style={styles.pageSubtitle}>
          Manage your password and security settings
        </Text>

        {/* Password Management */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Password</Text>

          <NavigationCard
            label="Change Password"
            subheading="Update your account password"
            iconName="lock"
            iconColor="#FF9800"
            backgroundColor="#FFF3E0"
            onPress={() => navigation.navigate('ChangePassword')}
          />
        </View>

        {/* Security Settings Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security Settings</Text>

          <View style={styles.settingsCard}>
            {/* Biometric Authentication */}
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <View style={styles.settingIconContainer}>
                  <Icon name="user-circle" size={24} color={Colors.primary[500]} />
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>Biometric Authentication</Text>
                  <Text style={styles.settingDescription}>
                    Use fingerprint or face recognition
                  </Text>
                </View>
              </View>
              <Switch
                value={biometricEnabled}
                onValueChange={setBiometricEnabled}
                trackColor={{
                  false: Colors.neutral[300],
                  true: Colors.primary[200],
                }}
                thumbColor={
                  biometricEnabled ? Colors.primary[500] : Colors.neutral[100]
                }
              />
            </View>
          </View>
        </View>

        {/* Security Tips */}
        <View style={styles.infoNote}>
          <Icon name="shield" size={16} color={Colors.warning.main} />
          <View style={styles.infoTextContainer}>
            <Text style={styles.infoTitle}>Security Tips</Text>
            <Text style={styles.infoText}>
              • Enable biometric login for faster access{'\n'}
              • Change your password regularly{'\n'}
              • Review your security settings regularly{'\n'}
              • Never share your login credentials
            </Text>
          </View>
        </View>
      </ScrollView>
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
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
  },
  pageSubtitle: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    marginTop: Spacing.xs,
  },
  section: {
    gap: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border.light,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    flex: 1,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.neutral[50],
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
    gap: 4,
  },
  settingTitle: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.black,
  },
  settingDescription: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.text.secondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xs,
  },
  infoNote: {
    flexDirection: 'row',
    gap: Spacing.sm,
    padding: Spacing.md,
    backgroundColor: '#FFF3E0',
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    borderColor: Colors.warning.light,
  },
  infoTextContainer: {
    flex: 1,
    gap: Spacing.xs,
  },
  infoTitle: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.warning.dark,
  },
  infoText: {
    fontSize: Typography.body.small.fontSize as number,
    color: Colors.warning.dark,
    lineHeight: 18,
  },
})

export { ManageSecurity }
