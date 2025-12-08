import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NewsCard } from '../../components'
import { Spacing, Typography, Colors } from '../../constants'
import { mockNewsData } from '../../data/MockNews'
import Icon from 'react-native-vector-icons/FontAwesome'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../../navigation/type'
import { useNavigation, useFocusEffect } from '@react-navigation/native'
import { getAllData } from '../../firebase/firestore'
import { Announcement } from '../../types/Announcement'
import { DocumentReference, getDoc, Timestamp } from 'firebase/firestore'
import { Users } from '../../types/Users'
import { isWithinTwoWeeks } from '../../utils'

type NewsfeedNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'ParentTabNavigator'>

type AnnouncementWithId = Announcement & { id: string; authorName?: string }

const Newsfeed = () => {
  const navigation = useNavigation<NewsfeedNavigationProp>()
  const [announcements, setAnnouncements] = useState<AnnouncementWithId[]>([])
  const [loading, setLoading] = useState(true)

  const handleAvatarPress = () => {
    navigation.navigate('ParentProfile')
  }

  // Fetch announcements from Firestore
  const fetchAnnouncements = async () => {
    try {
      setLoading(true)
      const data = await getAllData<Announcement>('announcements')

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
      // Fallback to empty array on error
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

  // Sort news by priority: urgent -> important -> general
  const sortedNews = [...announcements].sort((a, b) => {
    const priority = { urgent: 0, important: 1, general: 2 } as { [key: string]: number }
    return priority[a.tag] - priority[b.tag]
  })

  return (
    <SafeAreaView>
      <Header onAvatarPress={handleAvatarPress}/>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dashboardTitle}>Newsfeed</Text>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.primary[600]} />
            <Text style={styles.loadingText}>Loading announcements...</Text>
          </View>
        ) : (
          <>
            {/* Display all news articles sorted by priority */}
            {sortedNews.length > 0 ? (
              sortedNews.map((news) => (
                <NewsCard
                  key={news.id}
                  tag={news.tag}
                  heading={news.heading}
                  subheading={news.subheading}
                  onPress={() => navigation.navigate("NewsfeedBlog", { newsId: news.id as any })}
                />
              ))
            ) : (
              <View style={styles.emptyState}>
                <Icon name="newspaper-o" size={64} color={Colors.text.disabled} />
                <Text style={styles.emptyTitle}>No Announcements Available</Text>
                <Text style={styles.emptySubtitle}>
                  There are currently no announcements to display. Check back later for updates.
                </Text>
              </View>
            )}
          </>
        )}

      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
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