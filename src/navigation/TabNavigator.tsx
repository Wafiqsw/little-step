import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { Dashboard, Newsfeed, PickupList } from '../screens'

export type TabNavigatorParamList = {
  Home: undefined
  People: undefined
  News: undefined
}

const Tab = createBottomTabNavigator<TabNavigatorParamList>()

export const TabNavigator = () => {
  return (
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#371B34',
          tabBarInactiveTintColor: '#999',
          tabBarStyle: {
            paddingBottom: 5,
            paddingTop: 5,
            height: 60,
          },
          tabBarShowLabel: false,
        }}
      >
        <Tab.Screen
          name="Home"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="People"
          component={PickupList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="users" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={Newsfeed}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="newspaper-o" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  )
}
