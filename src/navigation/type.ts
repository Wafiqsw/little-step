export type MainNavigatorParamList = {


  Playground: undefined;

  OnBoarding: undefined;
  Login: undefined;
  Register: undefined;

  //Parent Navigation Site
  ParentTabNavigator: undefined;
  AddPickupPerson: undefined;
  ArchivePickupPerson: undefined;
  NewsfeedBlog: { newsId: number } | undefined;
  ParentProfile: undefined;
  AttendanceProgress: undefined;
  ManageProfile: undefined;
  ManageSecurity: undefined;
  ChangePassword: undefined;

  //Teacher Navigation Site
  TeacherTabNavigator: undefined;
  TeacherProfile: undefined;
  TeacherManageSecurity: undefined;
  TeacherChangePassword: undefined;
  TeacherCreateFeed: { newsId?: number } | undefined;
  TeacherNewsfeedBlog: { newsId: number } | undefined;
  TeacherMyPostsList: undefined;
  TeacherAllAnnouncementsList: undefined;
  TeacherManageStudents: undefined;
  TeacherManageStudent: undefined;
  TeacherAllStudents: undefined;
  TeacherEditStudent: { studentId: number };
  TeacherAddStudentStep1Email: undefined;
  TeacherAddStudentStep2Parent: {
    email: string;
    existingParent?: import('../types/Users').Users | null;
  };
  TeacherAddStudentStep3Student: {
    email: string;
    parentName: string;
    parentPhone?: string;
    isExistingParent: boolean;
    existingParent?: import('../types/Users').Users | null;
  };
}


//Parent Navigation Site
export type ParentTabNavigatorParamList = {
  Home: undefined
  People: undefined
  News: undefined
}

export type TeacherTabNavigatorParamList = {
  Home: undefined
  People: undefined
  News: undefined
}