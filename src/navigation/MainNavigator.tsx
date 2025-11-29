import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from './type';
import { Playground, ParentAddPickupPerson, ParentArchivePickupPerson, ParentNewsfeedBlog, ParentProfile, ParentAttendanceProgress, ParentManageProfile, ParentManageSecurity, ParentChangePassword } from '../screens';
import { ParentTabNavigator } from './ParentTabNavigator'; 
import { TeacherTabNavigator } from './TeacherTabNavigator';


const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='TeacherTabNavigator' screenOptions={{ headerShown: false }}>
        <Stack.Screen component={Playground} name='Playground'/>


        {/*Parent Navigation Site*/}
        <Stack.Screen component={ParentTabNavigator} name='ParentTabNavigator' />

        <Stack.Screen component={ParentAddPickupPerson} name='AddPickupPerson'/>
        <Stack.Screen component={ParentArchivePickupPerson} name='ArchivePickupPerson'/>
        <Stack.Screen component={ParentNewsfeedBlog} name='NewsfeedBlog'/>

        <Stack.Screen component={ParentProfile} name='ParentProfile'/>
        <Stack.Screen component={ParentAttendanceProgress} name='AttendanceProgress'/>
        <Stack.Screen component={ParentManageProfile} name='ManageProfile'/>
        <Stack.Screen component={ParentManageSecurity} name='ManageSecurity'/>
        <Stack.Screen component={ParentChangePassword} name='ChangePassword'/>

        {/*Teacher Navigation Site*/}
        <Stack.Screen component={TeacherTabNavigator} name='TeacherTabNavigator' />
        
    </Stack.Navigator>
  )
}

export default MainNavigator