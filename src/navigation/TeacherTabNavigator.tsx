import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TeacherDashboard, TeacherNewsfeed, TeacherPickupList } from '../screens'
import { TeacherTabNavigatorParamList } from './type'


const Tab = createBottomTabNavigator<TeacherTabNavigatorParamList>()

export const TeacherTabNavigator = () => {
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
          component={TeacherDashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="home" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="People"
          component={TeacherPickupList}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="users" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="News"
          component={TeacherNewsfeed}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Icon name="newspaper-o" size={size} color={color} />
            ),
          }}
        />
      </Tab.Navigator>
  )
}
