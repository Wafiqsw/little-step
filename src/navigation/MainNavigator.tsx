import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from './type';
import { Playground, ParentAddPickupPerson, ParentArchivePickupPerson, ParentNewsfeedBlog, ParentProfile, ParentAttendanceProgress, ParentManageProfile, ParentManageSecurity, ParentChangePassword } from '../screens';
import { ParentTabNavigator } from './ParentTabNavigator';


const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='TabNavigator' screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Playground} name='Playground'/>


        {/*Parent Navigation Site*/}
        <Stack.Screen component={ParentTabNavigator} name='TabNavigator' />

        <Stack.Screen component={ParentAddPickupPerson} name='AddPickupPerson'/>
        <Stack.Screen component={ParentArchivePickupPerson} name='ArchivePickupPerson'/>
        <Stack.Screen component={ParentNewsfeedBlog} name='NewsfeedBlog'/>

        <Stack.Screen component={ParentProfile} name='ParentProfile'/>
        <Stack.Screen component={ParentAttendanceProgress} name='AttendanceProgress'/>
        <Stack.Screen component={ParentManageProfile} name='ManageProfile'/>
        <Stack.Screen component={ParentManageSecurity} name='ManageSecurity'/>
        <Stack.Screen component={ParentChangePassword} name='ChangePassword'/>

        {/*Teacher Navigation Site*/}
        
    </Stack.Navigator>
  )
}

export default MainNavigator