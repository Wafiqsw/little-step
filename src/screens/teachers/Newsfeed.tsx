import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NewsCard, Button, TeacherNewsCard, ConfirmationModal } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { mockNewsData } from '../../data/MockNews'
import Icon from 'react-native-vector-icons/FontAwesome'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'

type NewsfeedNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TeacherTabNavigator'>

const Newsfeed = () => {
  const navigation = useNavigation<NewsfeedNavigationProp>()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)

  const handleCreatePost = () => {
    navigation.navigate('TeacherCreateFeed')
  }

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleNewsPress = (newsId: number) => {
    navigation.navigate('TeacherNewsfeedBlog', { newsId })
  }

  const handleSeeAllMyPosts = () => {
    navigation.navigate('TeacherMyPostsList')
  }

  const handleSeeAllAnnouncements = () => {
    navigation.navigate('TeacherAllAnnouncementsList')
  }

  const handleEditPost = (newsId: number) => {
    navigation.navigate('TeacherCreateFeed', { newsId })
  }

  const handleDeletePost = (newsId: number) => {
    setPostToDelete(newsId)
    setDeleteModalVisible(true)
  }

  const handleConfirmDelete = () => {
    if (postToDelete !== null) {
      console.log('Deleting post:', postToDelete)
      // TODO: Call API to delete the post
      setDeleteModalVisible(false)
      setPostToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setDeleteModalVisible(false)
    setPostToDelete(null)
  }

  // Mock teacher ID - in real app, this would come from auth context
  const currentTeacherId = 1

  // Filter teacher's own posts
  const myPosts = mockNewsData.filter(news => news.authorId === currentTeacherId)
  const displayedMyPosts = myPosts.slice(0, 2) // Show only first 2

  // All other posts
  const allPosts = [...mockNewsData].sort((a, b) => {
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
                count={news.count}
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
                count={news.count}
                heading={news.heading}
                subheading={news.subheading}
                onPress={() => handleNewsPress(news.id)}
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
            <Text style={styles.emptyTitle}>No News Available</Text>
            <Text style={styles.emptySubtitle}>
              There are currently no news articles to display. Check back later for updates.
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        visible={deleteModalVisible}
        title="Delete Post"
        message="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
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
