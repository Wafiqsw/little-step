import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { SafeAreaView } from 'react-native-safe-area-context'
import Icon from 'react-native-vector-icons/FontAwesome'
import { TeacherDashboard, TeacherNewsfeed, TeacherPickupList } from '../screens'
import { TeacherTabNavigatorParamList } from './type'
import { Colors } from '../constants'


const Tab = createBottomTabNavigator<TeacherTabNavigatorParamList>()

export const TeacherTabNavigator = () => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.white }} edges={['top', 'bottom']}>
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
            backgroundColor: Colors.white,
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
    </SafeAreaView>
  )
}
