import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, TeacherNewsCard, ConfirmationModal } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { mockNewsData } from '../../data/MockNews'
import Icon from 'react-native-vector-icons/FontAwesome'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'

type MyPostsListNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TeacherMyPostsList'>

const MyPostsList = () => {
  const navigation = useNavigation<MyPostsListNavigationProp>()
  const [deleteModalVisible, setDeleteModalVisible] = useState(false)
  const [postToDelete, setPostToDelete] = useState<number | null>(null)

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleNewsPress = (newsId: number) => {
    navigation.navigate('TeacherNewsfeedBlog', { newsId })
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

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Icon name="user-circle" size={28} color={Colors.primary[600]} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageTitle}>My Posts</Text>
            <Text style={styles.pageSubtitle}>
              {myPosts.length} {myPosts.length === 1 ? 'post' : 'posts'} published
            </Text>
          </View>
        </View>

        {myPosts.length > 0 ? (
          myPosts.map((news) => (
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
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="newspaper-o" size={64} color={Colors.text.disabled} />
            <Text style={styles.emptyTitle}>No Posts Yet</Text>
            <Text style={styles.emptySubtitle}>
              You haven't created any posts yet. Create your first post to share information with parents.
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
    paddingBottom: Spacing.xl,
  },
  headerSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.sm,
  },
  headerTextContainer: {
    flex: 1,
  },
  pageTitle: {
    fontSize: Typography.heading.h1.fontSize as number,
    fontWeight: Typography.heading.h1.fontWeight as any,
    color: Colors.black,
  },
  pageSubtitle: {
    fontSize: Typography.body.medium.fontSize as number,
    color: Colors.text.secondary,
    marginTop: 4,
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

export { MyPostsList }
