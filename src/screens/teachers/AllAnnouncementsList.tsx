import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NewsCard } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { mockNewsData } from '../../data/MockNews'
import Icon from 'react-native-vector-icons/FontAwesome'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation } from '@react-navigation/native'

type AllAnnouncementsListNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TeacherAllAnnouncementsList'>

const AllAnnouncementsList = () => {
  const navigation = useNavigation<AllAnnouncementsListNavigationProp>()

  const handleAvatarPress = () => {
    navigation.navigate('TeacherProfile')
  }

  const handleNewsPress = (newsId: number) => {
    navigation.navigate('TeacherNewsfeedBlog', { newsId })
  }

  // Sort news by priority: urgent -> important -> general
  const allPosts = [...mockNewsData].sort((a, b) => {
    const priority = { urgent: 0, important: 1, general: 2 } as { [key: string]: number }
    return priority[a.tag] - priority[b.tag]
  })

  return (
    <SafeAreaView style={styles.container}>
      <Header showBackButton onAvatarPress={handleAvatarPress} />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerSection}>
          <Icon name="newspaper-o" size={28} color={Colors.primary[600]} />
          <View style={styles.headerTextContainer}>
            <Text style={styles.pageTitle}>All Announcements</Text>
            <Text style={styles.pageSubtitle}>
              {allPosts.length} {allPosts.length === 1 ? 'announcement' : 'announcements'} available
            </Text>
          </View>
        </View>

        {allPosts.length > 0 ? (
          allPosts.map((news) => (
            <NewsCard
              key={news.id}
              tag={news.tag}
              count={news.count}
              heading={news.heading}
              subheading={news.subheading}
              onPress={() => handleNewsPress(news.id)}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Icon name="newspaper-o" size={64} color={Colors.text.disabled} />
            <Text style={styles.emptyTitle}>No Announcements</Text>
            <Text style={styles.emptySubtitle}>
              There are currently no announcements to display. Check back later for updates.
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

export { AllAnnouncementsList }
