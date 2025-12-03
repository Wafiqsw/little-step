import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native'
import React, { useState, useCallback } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, GuardianCard, SuccessModal, ConfirmationModal } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import Icon from 'react-native-vector-icons/FontAwesome'
import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { collection, query, where, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { db, auth } from '../../firebase'
import { AuthorisedPerson } from '../../types/AuthorisedPerson'

type ArchivePickupPersonNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'AddPickupPerson'>

const ArchivePickupPerson = () => {
  const navigation = useNavigation<ArchivePickupPersonNavigationProp>()

  const [archivedPersons, setArchivedPersons] = useState<(AuthorisedPerson & { id: string })[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [showUnarchiveModal, setShowUnarchiveModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedGuardianId, setSelectedGuardianId] = useState<string | null>(null)
  const [selectedGuardianName, setSelectedGuardianName] = useState('')

  // Fetch archived authorized persons from Firestore
  const fetchArchivedPersons = useCallback(async () => {
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

      // Query authorized persons where assigned_by equals current user and archived is true
      const authorisedRef = collection(db, 'authorised_person')
      const authorisedQuery = query(
        authorisedRef,
        where('assigned_by', '==', userRef),
        where('archived', '==', true)
      )
      const authorisedSnapshot = await getDocs(authorisedQuery)

      const authorisedData = authorisedSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as (AuthorisedPerson & { id: string })[]

      setArchivedPersons(authorisedData)
      console.log(`✅ Fetched ${authorisedData.length} archived persons`)
    } catch (error) {
      console.error('Error fetching archived persons:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Refresh data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      console.log('🔄 ArchivePickupPerson screen focused - fetching data')
      fetchArchivedPersons()
    }, [fetchArchivedPersons])
  )

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  const handleSave = async (id: string, data: { name: string; phoneNumber: string; relationship: string }) => {
    try {
      setIsSaving(true)

      // Update document in Firestore
      await updateDoc(doc(db, 'authorised_person', id), {
        name: data.name.trim(),
        relationship: data.relationship.trim(),
        numphone: data.phoneNumber.trim(),
      })

      console.log('✅ Archived guardian updated successfully:', id)

      // Refresh the list to show updated data
      await fetchArchivedPersons()

      setSuccessMessage(`${data.name}'s information has been updated successfully!`)
      setShowSuccessModal(true)
    } catch (error) {
      console.error('❌ Error updating archived guardian:', error)
      setSuccessMessage('Failed to update guardian. Please try again.')
      setShowSuccessModal(true)
    } finally {
      setIsSaving(false)
    }
  }

  const handleUnarchiveClick = (id: string, name: string) => {
    setSelectedGuardianId(id)
    setSelectedGuardianName(name)
    setShowUnarchiveModal(true)
  }

  const handleUnarchiveConfirm = async () => {
    if (selectedGuardianId) {
      try {
        setIsSaving(true)

        // Update archived field to false
        await updateDoc(doc(db, 'authorised_person', selectedGuardianId), {
          archived: false
        })

        console.log('✅ Guardian unarchived successfully:', selectedGuardianId)

        // Refresh the list to show updated data
        await fetchArchivedPersons()

        setShowUnarchiveModal(false)
        setSuccessMessage(`${selectedGuardianName} has been unarchived successfully!`)
        setShowSuccessModal(true)
      } catch (error) {
        console.error('❌ Error unarchiving guardian:', error)
        setShowUnarchiveModal(false)
        setSuccessMessage('Failed to unarchive guardian. Please try again.')
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
        await fetchArchivedPersons()

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

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton={true} onAvatarPress={handleAvatarPress}/>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dashboardTitle}>Archived Pick Up</Text>

        {isLoading || isSaving ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#371B34" />
            <Text style={styles.loadingText}>
              {isLoading ? 'Loading archived persons...' : 'Processing...'}
            </Text>
          </View>
        ) : archivedPersons.length > 0 ? (
          archivedPersons.map((person) => (
            <GuardianCard
              key={person.id}
              name={person.name}
              relationship={person.relationship}
              phoneNumber={typeof person.numphone === 'string' ? person.numphone : '-'}
              variant="pickup"
              isArchived={true}
              onSave={(data) => handleSave(person.id, data)}
              onArchive={() => handleUnarchiveClick(person.id, person.name)}
              onDelete={() => handleDeleteClick(person.id, person.name)}
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

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Success!"
        message={successMessage}
        onClose={() => setShowSuccessModal(false)}
      />

      {/* Unarchive Confirmation Modal */}
      <ConfirmationModal
        visible={showUnarchiveModal}
        title="Unarchive Guardian"
        message={`Are you sure you want to unarchive ${selectedGuardianName}? They will be moved back to the active pickup list.`}
        onConfirm={handleUnarchiveConfirm}
        onCancel={() => setShowUnarchiveModal(false)}
        confirmText="Unarchive"
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

export { ArchivePickupPerson }