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