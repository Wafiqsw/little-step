import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React, { useMemo } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, PickupCard } from '../../components'
import { Colors, Typography, Spacing, BorderRadius } from '../../constants'
import { getWaitingPickups, getDismissedPickups } from '../../data'

const PickupList = () => {
  // Get pickup data
  const waitingPickups = useMemo(() => getWaitingPickups(), [])
  const dismissedPickups = useMemo(() => getDismissedPickups(), [])

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Title */}
        <Text style={styles.pageTitle}>Today's Pickup</Text>

        {/* Waiting Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Waiting</Text>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{waitingPickups.length}</Text>
            </View>
          </View>

          <View style={styles.cardList}>
            {waitingPickups.length > 0 ? (
              waitingPickups.map((pickup) => (
                <PickupCard
                  key={pickup.studentId}
                  name={pickup.guardianName}
                  studentName={pickup.studentName}
                  variant="parent"
                  hasArrived={pickup.hasArrived}
                  onPress={() => console.log('Pickup pressed:', pickup.studentName)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No students waiting for pickup</Text>
              </View>
            )}
          </View>
        </View>

        {/* Dismissed Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Dismissed</Text>
            <View style={[styles.badge, styles.badgeDismissed]}>
              <Text style={styles.badgeText}>{dismissedPickups.length}</Text>
            </View>
          </View>

          <View style={styles.cardList}>
            {dismissedPickups.length > 0 ? (
              dismissedPickups.map((pickup) => (
                <PickupCard
                  key={pickup.studentId}
                  name={pickup.guardianName}
                  studentName={pickup.studentName}
                  variant="pickup"
                  pickupTime={pickup.pickupTime}
                  onPress={() => console.log('Dismissed pickup pressed:', pickup.studentName)}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Text style={styles.emptyText}>No students dismissed yet</Text>
              </View>
            )}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  pageTitle: {
    fontSize: Typography.heading.h2.fontSize as number,
    fontWeight: Typography.heading.h2.fontWeight as any,
    color: Colors.text.primary,
    marginTop: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.text.primary,
    marginRight: Spacing.sm,
  },
  badge: {
    backgroundColor: Colors.primary[100],
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs / 2,
    borderRadius: BorderRadius.full,
    minWidth: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeDismissed: {
    backgroundColor: Colors.secondary[100],
  },
  badgeText: {
    fontSize: Typography.body.small.fontSize as number,
    fontWeight: Typography.label.medium.fontWeight as any,
    color: Colors.text.primary,
  },
  cardList: {
    gap: Spacing.sm,
  },
  emptyState: {
    paddingVertical: Spacing.xl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    fontStyle: 'italic',
  },
})

export { PickupList }
