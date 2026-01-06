import { View, Text, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NewsCard, Button, TeacherNewsCard, ConfirmationModal } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import Icon from 'react-native-vector-icons/FontAwesome'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { getAllDataWithCache, deleteDataWithCache } from '../../firebase/firestoreWithCache'
import { auth } from '../../firebase/index'
import { Announcement } from '../../types/Announcement'
import { DocumentReference, getDoc, Timestamp } from 'firebase/firestore'
import { Users } from '../../types/Users'
import { isWithinTwoWeeks } from '../../utils'

type NewsfeedNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TeacherTabNavigator'>

type AnnouncementWithId = Announcement & { id: string; authorName?: string }

const Newsfeed = () => {
  const navigation = useNavigation<NewsfeedNavigationProp>()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [postToDelete, setPostToDelete] = useState<string | null>(null)
  const [announcements, setAnnouncements] = useState<AnnouncementWithId[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(false)

  // Fetch announcements from Firestore
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const data = await getAllDataWithCache<Announcement>('announcements', { useCache: true })

      // Filter announcements to only show those within the last 2 weeks
      const recentAnnouncements = data.filter((announcement) => {
        // Get the announcement_date field (snake_case in Firestore)
        const dateField = (announcement as any).announcement_date

        if (!dateField) {
          return false // Skip if no date
        }

        // Convert Firestore Timestamp to Date
        let announcementDate: Date
        if (dateField instanceof Timestamp) {
          announcementDate = dateField.toDate()
        } else if (dateField instanceof Date) {
          announcementDate = dateField
        } else if (typeof dateField === 'object' && dateField.seconds) {
          announcementDate = new Date(dateField.seconds * 1000)
        } else {
          return false // Skip if date format is unrecognized
        }

        // Check if within last 2 weeks
        return isWithinTwoWeeks(announcementDate)
      })

      // Fetch author names for filtered announcements
      const announcementsWithAuthors = await Promise.all(
        recentAnnouncements.map(async (announcement) => {
          let authorName = 'Unknown'
          try {
            if (announcement.posted_by) {
              const authorDoc = await getDoc(announcement.posted_by as DocumentReference<Users>)
              if (authorDoc.exists()) {
                authorName = authorDoc.data().name
              }
            }
          } catch (error) {
            console.error('Error fetching author:', error)
          }
          return { ...announcement, authorName }
        })
      )

      setAnnouncements(announcementsWithAuthors)
      console.log('✅ Fetched', announcementsWithAuthors.length, 'recent announcements (within 2 weeks)')
    } catch (error) {
      console.error('❌ Error fetching announcements:', error)
      // Fallback to mock data on error
      setAnnouncements([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch announcements on mount and when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      fetchAnnouncements()
    }, [])
  )

  const handleCreatePost = () => {
    navigation.navigate('TeacherCreateFeed')
  }

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleNewsPress = (newsId: string) => {
    // Pass newsId as string directly - will be used as Firestore document ID
    navigation.navigate('TeacherNewsfeedBlog', { newsId: newsId as any })
  }

  const handleSeeAllMyPosts = () => {
    navigation.navigate('TeacherMyPostsList')
  }

  const handleSeeAllAnnouncements = () => {
    navigation.navigate('TeacherAllAnnouncementsList')
  }

  const handleEditPost = (newsId: string) => {
    // Pass newsId as string directly - will be used as Firestore document ID
    navigation.navigate('TeacherCreateFeed', { newsId: newsId as any })
  }

  const handleDeletePost = (newsId: string) => {
    setPostToDelete(newsId)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = async () => {
    if (postToDelete !== null) {
      try {
        setDeleting(true)
        console.log('🗑️ Deleting announcement:', postToDelete)
        await deleteDataWithCache('announcements', postToDelete)
        console.log('✅ Announcement deleted successfully')

        // Refresh announcements list
        await fetchAnnouncements()

        setDeleteModalVisible(false)
        setPostToDelete(null)
      } catch (error) {
        console.error('❌ Error deleting announcement:', error)
        Alert.alert('Error', 'Failed to delete announcement. Please try again.')
      } finally {
        setDeleting(false)
      }
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalVisible(false)
    setPostToDelete(null)
  }

  // Get current user ID
  const currentUserId = auth.currentUser?.uid

  // Filter teacher's own posts
  const myPosts = announcements.filter(announcement => {
    const postedById = (announcement.posted_by as DocumentReference)?.id
    return postedById === currentUserId
  })
  const displayedMyPosts = myPosts.slice(0, 2) // Show only first 2

  // All posts sorted by priority
  const allPosts = [...announcements].sort((a, b) => {
    const priority = { urgent: 0, important: 1, general: 2 } as { [key: string]: number }
    return priority[a.tag] - priority[b.tag]
  })
  const displayedAllPosts = allPosts.slice(0, 2) // Show only first 2

  return (
    <SafeAreaView style={styles.container}>
      <Header onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dashboardTitle}>Newsfeed</Text>

        {/* Create New Post Button */}
        <Button
          label="Create New Post"
          onPress={handleCreatePost}
          icon={<Icon name="plus" size={18} color={Colors.white} />}
          style={styles.createButton}
        />

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            <Text style={styles.loadingText}>Loading announcements...</Text>
          </View>
        ) : (
          <>
            {/* My Posts Section */}
            {myPosts.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Icon name="user-circle" size={20} color={Colors.primary[600]} />
                  <Text style={styles.sectionTitle}>My Posts</Text>
                </View>
                {displayedMyPosts.map((news) => (
                  <TeacherNewsCard
                    key={news.id}
                    tag={news.tag}
                    heading={news.heading}
                    subheading={news.subheading}
                    onPress={() => handleNewsPress(news.id)}
                    onEdit={() => handleEditPost(news.id)}
                    onDelete={() => handleDeletePost(news.id)}
                  />
                ))}
                {myPosts.length > 2 && (
                  <TouchableOpacity
                    style={styles.seeMoreContainer}
                    onPress={handleSeeAllMyPosts}
                  >
                    <Text style={styles.seeMoreText}>See More</Text>
                    <Icon name="chevron-right" size={14} color={Colors.primary[600]} />
                  </TouchableOpacity>
                )}
                <View style={styles.divider} />
              </>
            )}

            {/* All News Section */}
            <View style={styles.sectionHeader}>
              <Icon name="newspaper-o" size={20} color={Colors.primary[600]} />
              <Text style={styles.sectionTitle}>All Announcements</Text>
            </View>

            {/* Display all news articles sorted by priority */}
            {allPosts.length > 0 ? (
              <>
                {displayedAllPosts.map((news) => (
                  <NewsCard
                    key={news.id}
                    tag={news.tag}
                    heading={news.heading}
                    subheading={news.subheading}
                    onPress={() => handleNewsPress(news.id)}
                    showAskQuestion={false}
                  />
                ))}
                {allPosts.length > 2 && (
                  <TouchableOpacity
                    style={styles.seeMoreContainer}
                    onPress={handleSeeAllAnnouncements}
                  >
                    <Text style={styles.seeMoreText}>See More</Text>
                    <Icon name="chevron-right" size={14} color={Colors.primary[600]} />
                  </TouchableOpacity>
                )}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Icon name="newspaper-o" size={64} color={Colors.text.disabled} />
                <Text style={styles.emptyTitle}>No Announcements Available</Text>
                <Text style={styles.emptySubtitle}>
                  There are currently no announcements to display. Create your first post to get started!
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText={deleting ? "Deleting..." : "Delete"}
        cancelText="Cancel"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
        confirmColor="#F44336"
        iconName="trash"
        iconColor="#F44336"
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
    padding: 16,
    gap: Spacing.md,
  },
  dashboardTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
    marginBottom: Spacing.sm,
  },
  createButton: {
    marginBottom: Spacing.md,
  },
  loadingContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xl * 2,
    gap: Spacing.md,
  },
  loadingText: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: Typography.heading.h3.fontSize as number,
    fontWeight: Typography.heading.h3.fontWeight as any,
    color: Colors.black,
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: Spacing.md,
  },
  seeMoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.xs,
  },
  seeMoreText: {
    fontSize: Typography.body.medium.fontSize as number,
    fontWeight: '600',
    color: Colors.primary[600],
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

export { Newsfeed }
