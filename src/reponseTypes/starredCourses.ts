export type StarredCourses = {
    EntityArray: Array<{
        CourseId: number
        FriendlyName: any
        Title: string
        TeacherName: any
        TeacherPictureUrl: any
        NumberOfTeachers: number
        Teachers: Array<any>
        CourseColorClass: string
        NumberOfAnnouncements: number
        NumberOfTasks: number
        NumberOfFollowUpTasks: number
        LastUpdatedDisplayTime: string
        LastUpdated: string
        LastOnlineDisplayTime: string
        LastOnline: string
        IsFavouriteCourse: boolean
        CanAdminCourse: boolean
    }>
    Total: number
    CurrentPageIndex: number
    PageSize: number
}
