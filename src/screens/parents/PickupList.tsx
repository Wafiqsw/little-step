import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, GuardianCard, Button, SuccessModal, ConfirmationModal } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { AuthorisedPerson } from '../../types/AuthorisedPerson'
import { useAuth } from '../../context/AuthProvider'

type PickupListNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'ParentTabNavigator'>

const PickupList = () => {

  const navigation = useNavigation<PickupListNavigationProp>();
  const { userProfile } = useAuth();

  const [authorisedPersons, setAuthorisedPersons] = useState<(AuthorisedPerson & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showArchiveModal, setShowArchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null)
  const [selectedGuardianName, setSelectedGuardianName] = useState('')

  // Fetch authorized persons from Firestore
  const fetchAuthorisedPersons = useCallback(async () => {
    try {
      setIsLoading(true)
      const currentUser = auth.currentUser

      if (!currentUser) {
        console.error('No authenticated user found')
        setIsLoading(false)
        return
      }

      // Create reference to current user
      const userRef = doc(db, 'users', currentUser.uid)

      // Query authorized persons where assigned_by equals current user and not archived
      const authorisedRef = collection(db, 'authorised_person')
      const authorisedQuery = query(
        authorisedRef,
        where('assigned_by', '==', userRef),
        where('archived', '==', false)
      )
      const authorisedSnapshot = await getDocs(authorisedQuery)

      const authorisedData = authorisedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (AuthorisedPerson & { id: string })[]

      setAuthorisedPersons(authorisedData)
      console.log(`✅ Fetched ${authorisedData.length} authorized persons`)
    } catch (error) {
      console.error('Error fetching authorized persons:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 PickupList screen focused - fetching data')
      fetchAuthorisedPersons()
    }, [fetchAuthorisedPersons])
  )

  const handleSave = async (id: string, data: { name: string; phoneNumber: string; relationship: string }) => {
    try {
      setIsSaving(true)

      // Update document in Firestore
      await updateDoc(doc(db, 'authorised_person', id), {
        name: data.name.trim(),
        relationship: data.relationship.trim(),
        numphone: data.phoneNumber.trim(),
      })

      console.log('✅ Guardian updated successfully:', id)

      // Refresh the list to show updated data
      await fetchAuthorisedPersons()

      setSuccessMessage(`${data.name}'s information has been updated successfully!`)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('❌ Error updating guardian:', error)
      setSuccessMessage('Failed to update guardian. Please try again.')
      setShowSuccessModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleArchiveClick = (id: string, name: string) => {
    setSelectedGuardianId(id)
    setSelectedGuardianName(name)
    setShowArchiveModal(true)
  }

  const handleArchiveConfirm = async () => {
    if (selectedGuardianId) {
      try {
        setIsSaving(true)

        // Update archived field to true
        await updateDoc(doc(db, 'authorised_person', selectedGuardianId), {
          archived: true
        })

        console.log('✅ Guardian archived successfully:', selectedGuardianId)

        // Refresh the list to show updated data
        await fetchAuthorisedPersons()

        setShowArchiveModal(false)
        setSuccessMessage(`${selectedGuardianName} has been archived successfully!`)
        setShowSuccessModal(true)
      } catch (error) {
        console.error('❌ Error archiving guardian:', error)
        setShowArchiveModal(false)
        setSuccessMessage('Failed to archive guardian. Please try again.')
        setShowSuccessModal(true)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedGuardianId(id)
    setSelectedGuardianName(name)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    if (selectedGuardianId) {
      try {
        setIsSaving(true)

        // Delete document from Firestore
        await deleteDoc(doc(db, 'authorised_person', selectedGuardianId))

        console.log('✅ Guardian deleted successfully:', selectedGuardianId)

        // Refresh the list to show updated data
        await fetchAuthorisedPersons()

        setShowDeleteModal(false)
        setSuccessMessage(`${selectedGuardianName} has been deleted successfully!`)
        setShowSuccessModal(true)
      } catch (error) {
        console.error('❌ Error deleting guardian:', error)
        setShowDeleteModal(false)
        setSuccessMessage('Failed to delete guardian. Please try again.')
        setShowSuccessModal(true)
      } finally {
        setIsSaving(false)
      }
    }
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

        {/* Parent Section - Show fathers and mothers only */}
        <Text style={styles.sectionTitle}>Parent</Text>

        {isLoading || isSaving ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#371B34" />
            <Text style={styles.loadingText}>
              {isLoading ? 'Loading parents...' : 'Saving changes...'}
            </Text>
          </View>
        ) : authorisedPersons.filter((person) =>
            person.relationship.toLowerCase() === 'mother' ||
            person.relationship.toLowerCase() === 'father'
          ).length > 0 ? (
          authorisedPersons
            .filter((person) =>
              person.relationship.toLowerCase() === 'mother' ||
              person.relationship.toLowerCase() === 'father'
            )
            .map((person) => (
              <GuardianCard
                key={person.id}
                name={person.name}
                relationship={person.relationship}
                phoneNumber={typeof person.numphone === 'string' ? person.numphone : '-'}
                variant="parent"
                onSave={(data) => handleSave(person.id, data)}
                onArchive={() => handleArchiveClick(person.id, person.name)}
                onDelete={() => handleDeleteClick(person.id, person.name)}
              />
            ))
        ) : (
          <Text style={styles.emptyText}>No parents added yet</Text>
        )}

        <View style={styles.divider} />

        {/* Pick Up Person Section - Fetch from Firestore (excluding mothers and fathers) */}
        <Text style={styles.sectionTitle}>Pick Up Person</Text>

        {isLoading || isSaving ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#371B34" />
            <Text style={styles.loadingText}>
              {isLoading ? 'Loading pickup persons...' : 'Saving changes...'}
            </Text>
          </View>
        ) : authorisedPersons.filter((person) =>
            person.relationship.toLowerCase() !== 'mother' &&
            person.relationship.toLowerCase() !== 'father'
          ).length > 0 ? (
          authorisedPersons
            .filter((person) =>
              person.relationship.toLowerCase() !== 'mother' &&
              person.relationship.toLowerCase() !== 'father'
            )
            .map((person) => (
              <GuardianCard
                key={person.id}
                name={person.name}
                relationship={person.relationship}
                phoneNumber={typeof person.numphone === 'string' ? person.numphone : '-'}
                variant="pickup"
                onSave={(data) => handleSave(person.id, data)}
                onArchive={() => handleArchiveClick(person.id, person.name)}
                onDelete={() => handleDeleteClick(person.id, person.name)}
              />
            ))
        ) : (
          <Text style={styles.emptyText}>No pickup persons available yet</Text>
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

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Success!"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Archive Confirmation Modal */}
      <ConfirmationModal
        visible={showArchiveModal}
        title="Archive Guardian"
        message={`Are you sure you want to archive ${selectedGuardianName}? You can restore them from the archived list later.`}
        onConfirm={handleArchiveConfirm}
        onCancel={() => setShowArchiveModal(false)}
        confirmText="Archive"
        cancelText="Cancel"
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={showDeleteModal}
        title="Delete Guardian"
        message={`Are you sure you want to permanently delete ${selectedGuardianName}? This action cannot be undone.`}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setShowDeleteModal(false)}
        confirmText="Delete"
        cancelText="Cancel"
        confirmColor={Colors.error.main}
        iconName="trash"
        iconColor={Colors.error.main}
      />
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
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
    gap: Spacing.sm,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
  },
})

export { PickupList }