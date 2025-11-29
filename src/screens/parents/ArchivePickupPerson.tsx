import { View, Text, StyleSheet, ScrollView } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, GuardianCard } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { getArchivedPickupPersons } from '../../data/MockGuardian'
import Icon from 'react-native-vector-icons/FontAwesome'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'

type ArchivePickupPersonNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'AddPickupPerson'>

const ArchivePickupPerson = () => {
  const archivedPersons = getArchivedPickupPersons()
  const navigation = useNavigation<ArchivePickupPersonNavigationProp>()
  
  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const handleSave = (id: number, data: { firstName: string; lastName: string; phoneNumber: string; relationship: string }) => {
    console.log('Save guardian:', id, data)
    // TODO: Implement save logic
  }

  const handleUnarchive = (id: number) => {
    console.log('Unarchive guardian:', id)
    // TODO: Implement unarchive logic (move back to active)
  }

  const handleDelete = (id: number) => {
    console.log('Delete guardian:', id)
    // TODO: Implement delete logic
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton={true} onAvatarPress={handleAvatarPress}/>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dashboardTitle}>Archived Pick Up</Text>

        {archivedPersons.length > 0 ? (
          archivedPersons.map((person) => (
            <GuardianCard
              key={person.id}
              name={person.fullName}
              relationship={person.relationship}
              phoneNumber={person.phoneNumber}
              variant={person.variant}
              isArchived={person.isArchived}
              onSave={(data) => handleSave(person.id, data)}
              onArchive={() => handleUnarchive(person.id)}
              onDelete={() => handleDelete(person.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="archive" size={64} color={Colors.text.disabled} />
            <Text style={styles.emptyTitle}>No Archived Pickup Persons</Text>
            <Text style={styles.emptySubtitle}>
              Archived pickup persons will appear here
            </Text>
          </View>
        )}
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
  dashboardTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.md,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    paddingHorizontal: Spacing.xl,
    gap: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.text.primary,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    textAlign: 'center',
    lineHeight: 22,
  },
})

export { ArchivePickupPerson }