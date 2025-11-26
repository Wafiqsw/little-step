import { View, Text, ScrollView, StyleSheet } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Header, NewsCard } from '../components'
import { Spacing, Typography, Colors } from '../constants'
import { mockNewsData } from '../data/MockNews'
import Icon from 'react-native-vector-icons/FontAwesome'

import { NativeStackNavigationProp } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from '../navigation/type'
import { useNavigation } from '@react-navigation/native'

type DashboardNavigationProp = NativeStackNavigationProp<MainNavigatorParamList, 'TabNavigator'>


const Newsfeed = () => {

  const navigation = useNavigation<DashboardNavigationProp>();

  // Sort news by priority: urgent -> important -> general
  const sortedNews = [...mockNewsData].sort((a, b) => {
    const priority = { urgent: 0, important: 1, general: 2 } as { [key: string]: number };
    return priority[a.tag] - priority[b.tag]
  })

  return (
    <SafeAreaView>
      <Header />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.dashboardTitle}>Newsfeed</Text>

        {/* Display all news articles sorted by priority */}
        {sortedNews.length > 0 ? (
          sortedNews.map((news) => (
            <NewsCard
              key={news.id}
              tag={news.tag}
              count={news.count}
              heading={news.heading}
              subheading={news.subheading}
              onPress={() => navigation.navigate("NewsfeedBlog", { newsId: news.id })}
            />
          ))
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