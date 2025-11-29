import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, GuardianCard, Button } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { getActiveParents, getActivePickupPersons } from '../../data/MockGuardian'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'

type PickupListNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TabNavigator'>

const PickupList = () => {

  const navigation = useNavigation<PickupListNavigationProp>();

  const parents = getActiveParents()
  const pickupPersons = getActivePickupPersons()

  const handleSave = (id: number, data: { firstName: string; lastName: string; phoneNumber: string; relationship: string }) => {
    console.log('Save guardian:', id, data)
    // TODO: Implement save logic
  }

  const handleArchive = (id: number) => {
    console.log('Archive guardian:', id)
    // TODO: Implement archive logic
  }

  const handleDelete = (id: number) => {
    console.log('Delete guardian:', id)
    // TODO: Implement delete logic
  }

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dashboardTitle}>Guardian List</Text>

        <Text style={styles.sectionTitle}>Parent</Text>

        {parents.length > 0 ? (
          parents.map((parent) => (
            <GuardianCard
              key={parent.id}
              name={parent.fullName}
              relationship={parent.relationship}
              phoneNumber={parent.phoneNumber}
              variant={parent.variant}
              onSave={(data) => handleSave(parent.id, data)}
              onArchive={() => handleArchive(parent.id)}
              onDelete={() => handleDelete(parent.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No parents added yet</Text>
        )}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>Pick Up Person</Text>

        {pickupPersons.length > 0 ? (
          pickupPersons.map((person) => (
            <GuardianCard
              key={person.id}
              name={person.fullName}
              relationship={person.relationship}
              phoneNumber={person.phoneNumber}
              variant={person.variant}
              onSave={(data) => handleSave(person.id, data)}
              onArchive={() => handleArchive(person.id)}
              onDelete={() => handleDelete(person.id)}
            />
          ))
        ) : (
          <Text style={styles.emptyText}>No pickup persons added yet</Text>
        )}

      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button
          label="Add Pickup Person"
          onPress={() => navigation.navigate("AddPickupPerson")}
          variant="primary"
        />
        <Button
          label="Archived Pickup Person"
          onPress={() => navigation.navigate("ArchivePickupPerson")}
          variant="secondary"
        />
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
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
  divider: {
    height: 1,
    backgroundColor: Colors.black,
    marginVertical: Spacing.md,
  },
  emptyText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    fontStyle: 'italic',
    paddingVertical: Spacing.md,
  },
  buttonContainer: {
    padding: 16,
    gap: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    backgroundColor: Colors.white,
  }
})

export { PickupList }