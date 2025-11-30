export type MainNavigatorParamList = {


  Playground: undefined;

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
  TeacherAddStudentStep1Phone: undefined;
  TeacherAddStudentStep2Parent: {
    phoneNumber: string;
    existingParent?: import('../data/MockStudentParent').Parent | null;
  };
  TeacherAddStudentStep3Student: {
    phoneNumber: string;
    parentName: string;
    parentEmail?: string;
    isExistingParent: boolean;
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