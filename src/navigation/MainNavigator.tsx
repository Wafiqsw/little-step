import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { MainNavigatorParamList } from './type';
import { Playground, ParentAddPickupPerson, ParentArchivePickupPerson, ParentNewsfeedBlog, ParentProfile, ParentAttendanceProgress, ParentManageProfile, ParentManageSecurity, ParentChangePassword, TeacherProfile, TeacherManageSecurity, TeacherChangePassword, TeacherCreateFeed, TeacherNewsfeedBlog, TeacherMyPostsList, TeacherAllAnnouncementsList, TeacherManageStudents, TeacherAllStudents, TeacherEditStudent, TeacherAddStudentStep1Phone, TeacherAddStudentStep2Parent, TeacherAddStudentStep3Student } from '../screens';
import { ParentTabNavigator } from './ParentTabNavigator';
import { TeacherTabNavigator } from './TeacherTabNavigator';


const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const MainNavigator = () => {
  return (
    <Stack.Navigator initialRouteName='TeacherTabNavigator' screenOptions={{ headerShown: false }}>
      <Stack.Screen component={Playground} name='Playground' />


      {/*Parent Navigation Site*/}
      <Stack.Screen component={ParentTabNavigator} name='ParentTabNavigator' />

      <Stack.Screen component={ParentAddPickupPerson} name='AddPickupPerson' />
      <Stack.Screen component={ParentArchivePickupPerson} name='ArchivePickupPerson' />
      <Stack.Screen component={ParentNewsfeedBlog} name='NewsfeedBlog' />

      <Stack.Screen component={ParentProfile} name='ParentProfile' />
      <Stack.Screen component={ParentAttendanceProgress} name='AttendanceProgress' />
      <Stack.Screen component={ParentManageProfile} name='ManageProfile' />
      <Stack.Screen component={ParentManageSecurity} name='ManageSecurity' />
      <Stack.Screen component={ParentChangePassword} name='ChangePassword' />

      {/*Teacher Navigation Site*/}
      <Stack.Screen component={TeacherTabNavigator} name='TeacherTabNavigator' />
      <Stack.Screen component={TeacherProfile} name='TeacherProfile' />
      <Stack.Screen component={TeacherManageSecurity} name='TeacherManageSecurity' />
      <Stack.Screen component={TeacherChangePassword} name='TeacherChangePassword' />
      <Stack.Screen component={TeacherCreateFeed} name='TeacherCreateFeed' />
      <Stack.Screen component={TeacherNewsfeedBlog} name='TeacherNewsfeedBlog' />
      <Stack.Screen component={TeacherMyPostsList} name='TeacherMyPostsList' />
      <Stack.Screen component={TeacherAllAnnouncementsList} name='TeacherAllAnnouncementsList' />
      <Stack.Screen component={TeacherManageStudents} name='TeacherManageStudents' />
      <Stack.Screen component={TeacherManageStudents} name='TeacherManageStudent' />
      <Stack.Screen component={TeacherAllStudents} name='TeacherAllStudents' />
      <Stack.Screen component={TeacherEditStudent} name='TeacherEditStudent' />
      <Stack.Screen component={TeacherAddStudentStep1Phone} name='TeacherAddStudentStep1Phone' />
      <Stack.Screen component={TeacherAddStudentStep2Parent} name='TeacherAddStudentStep2Parent' />
      <Stack.Screen component={TeacherAddStudentStep3Student} name='TeacherAddStudentStep3Student' />

    </Stack.Navigator>
  )
}

export default MainNavigator