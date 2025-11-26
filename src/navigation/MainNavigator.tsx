import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from './type';
import { Playground, AddPickupPerson, ArchivePickupPerson, NewsfeedBlog } from '../screens';
import { TabNavigator } from './TabNavigator';


const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='TabNavigator' screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Playground} name='Playground'/>
        <Stack.Screen component={TabNavigator} name='TabNavigator' />

        <Stack.Screen component={AddPickupPerson} name='AddPickupPerson'/>
        <Stack.Screen component={ArchivePickupPerson} name='ArchivePickupPerson'/>
        <Stack.Screen component={NewsfeedBlog} name='NewsfeedBlog'/>
    </Stack.Navigator>
  )
}

export default MainNavigator