import { ScrollView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, Slider, ProgressCard, NavigationCard } from '../components'
import { Typography, Colors, Spacing } from '../constants'
import { useNavigation } from '@react-navigation/native'
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs'
import { TabNavigatorParamList } from '../navigation/TabNavigator'

type DashboardNavigationProp = BottomTabNavigationProp<TabNavigatorParamList, 'Home'>

const Dashboard = () => {
  const navigation = useNavigation<DashboardNavigationProp>()
  // State for pickup status and last update time
  const [pickupStatus, setPickupStatus] = React.useState<'Waiting' | 'Done'>('Waiting')
  const [lastUpdateTime, setLastUpdateTime] = React.useState('2:30 PM')

  const getStatusColor = (status: 'Waiting' | 'Done') => {
    return status === 'Waiting' ? Colors.warning.main : Colors.success.main
  }

  return (
    <SafeAreaView style={styles.container}>
        <Header/>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
        <Text style={styles.welcomeText}>Welcome back, Erin!</Text>
        <Text style={styles.dashboardTitle}>Dashboard</Text>

        <ProgressCard
          title="Weekly Attendance Progress"
          percentage={75}
          backgroundColor="#E3F2FD"
          onMoreInfoPress={() => console.log('More info pressed')}
        />

        <Text style={styles.sectionTitle}>Today's Pickup</Text>

        <View style={styles.pickupBox}>
          <View style={styles.statusBadge}>
            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(pickupStatus) }]} />
            <View style={styles.statusTextContainer}>
              <Text style={styles.statusLabel}>Status</Text>
              <Text style={[styles.pickupStatus, { color: getStatusColor(pickupStatus) }]}>
                {pickupStatus}
              </Text>
            </View>
          </View>

          <View style={styles.updateTimeContainer}>
            <Text style={styles.updateLabel}>Last Updated</Text>
            <Text style={styles.lastUpdate}>{lastUpdateTime}</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.notifyTeachersTitle}>Notify Teachers</Text>

          <View style={styles.sliderContainer}>
            <Slider
              variant="primary"
              label="I've Arrived"
              popupTitle="Arrival Confirmed!"
              popupDescription="Teacher has been notified that you've arrived for pickup."
              onComplete={() => console.log('First slider completed!')}
            />

            <Slider
              variant="secondary"
              label="Child Picked Up"
              popupTitle="Pickup Complete!"
              popupDescription="Thank you for confirming. Your child has been safely picked up."
              onComplete={() => console.log('Second slider completed!')}
            />
          </View>
        </View>

        <NavigationCard
          label='Manage Pickup'
          subheading='Manage People That Allow for Pickup'
          iconName='users'
          iconColor='#5B5D9E'
          backgroundColor='#EDE6FC'
          onPress={() => navigation.navigate('People')}
        />

        <NavigationCard
          label='Newsfeed'
          subheading='Checkout all the published news'
          iconName='newspaper-o'
          iconColor='#42A5F5'
          backgroundColor='#E3F2FD'
          onPress={() => navigation.navigate('News')}
        />
        </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    padding: 16,
    gap: Spacing.md,
  },
  welcomeText: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: '400',
    color: Colors.black,
    marginBottom: 4,
  },
  dashboardTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  pickupBox: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.lg,
    gap: Spacing.md,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#BDBDBD',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    padding: Spacing.md,
    borderRadius: 12,
    gap: Spacing.sm,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  statusTextContainer: {
    flex: 1,
  },
  statusLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '500',
    color: Colors.text.secondary,
    marginBottom: 2,
  },
  pickupStatus: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  updateTimeContainer: {
    backgroundColor: '#F8F9FA',
    padding: Spacing.sm,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  updateLabel: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '500',
    color: Colors.text.secondary,
  },
  lastUpdate: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: '600',
    color: Colors.neutral[700],
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border.light,
    marginVertical: Spacing.xs,
  },
  notifyTeachersTitle: {
    fontSize: Typography.body.large.fontSize as number,
    fontWeight: '700',
    color: Colors.black,
    marginBottom: Spacing.xs,
  },
  sliderContainer: {
    gap: Spacing.md,
  },
})

export {Dashboard}