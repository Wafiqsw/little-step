import React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ActivityIndicator, View, StyleSheet } from 'react-native'
import { MainNavigatorParamList } from './type';
import { Playground, OnBoarding, Login, Register, ParentAddPickupPerson, ParentArchivePickupPerson, ParentNewsfeedBlog, ParentProfile, ParentAttendanceProgress, ParentManageProfile, ParentManageSecurity, ParentChangePassword, TeacherProfile, TeacherManageSecurity, TeacherChangePassword, TeacherCreateFeed, TeacherNewsfeedBlog, TeacherMyPostsList, TeacherAllAnnouncementsList, TeacherManageStudents, TeacherAllStudents, TeacherEditStudent, TeacherAddStudentStep1Email, TeacherAddStudentStep2Parent, TeacherAddStudentStep3Student } from '../screens';
import { ParentTabNavigator } from './ParentTabNavigator';
import { TeacherTabNavigator } from './TeacherTabNavigator';
import { useAuth } from '../context/AuthProvider';
import { Colors } from '../constants';

const Stack = createNativeStackNavigator<MainNavigatorParamList>();

const MainNavigator = () => {
  const { user, userProfile, isInitialized } = useAuth();

  // Show loading screen while auth is initializing
  if (!isInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary[500]} />
      </View>
    );
  }

  console.log('🏠 Rendering MainNavigator - User:', userProfile?.name, 'Role:', userProfile?.role);

  return (
    <Stack.Navigator
      initialRouteName={
        user && userProfile
          ? (userProfile.role === 'teacher' ? 'TeacherTabNavigator' : 'ParentTabNavigator')
          : 'OnBoarding'
      }
      screenOptions={{ headerShown: false }}
    >
      {user && userProfile ? (
        // Authenticated screens - conditionally render based on role
        <>
          {userProfile.role === 'guardian' ? (
            // Parent Navigation
            <>
              <Stack.Screen component={ParentTabNavigator} name='ParentTabNavigator' />
              <Stack.Screen component={ParentAddPickupPerson} name='AddPickupPerson' />
              <Stack.Screen component={ParentArchivePickupPerson} name='ArchivePickupPerson' />
              <Stack.Screen component={ParentNewsfeedBlog} name='NewsfeedBlog' />
              <Stack.Screen component={ParentProfile} name='ParentProfile' />
              <Stack.Screen component={ParentAttendanceProgress} name='AttendanceProgress' />
              <Stack.Screen component={ParentManageProfile} name='ManageProfile' />
              <Stack.Screen component={ParentManageSecurity} name='ManageSecurity' />
              <Stack.Screen component={ParentChangePassword} name='ChangePassword' />
            </>
          ) : (
            // Teacher Navigation
            <>
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
              <Stack.Screen component={TeacherAddStudentStep1Email} name='TeacherAddStudentStep1Email' />
              <Stack.Screen component={TeacherAddStudentStep2Parent} name='TeacherAddStudentStep2Parent' />
              <Stack.Screen component={TeacherAddStudentStep3Student} name='TeacherAddStudentStep3Student' />
            </>
          )}

          {/* Common Screens - Available to both roles */}
          <Stack.Screen component={Playground} name='Playground' />
        </>
      ) : (
        // Unauthenticated screens
        <>
          <Stack.Screen component={OnBoarding} name='OnBoarding' />
          <Stack.Screen component={Login} name='Login' />
          <Stack.Screen component={Register} name='Register' />
        </>
      )}
    </Stack.Navigator>
  )
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.white,
  },
});

export default MainNavigator
