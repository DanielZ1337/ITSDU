/*eslint-disable no-unused-vars*/

export enum CourseParticipantRole {
    TeacherAndInstructor = 4,
    Student = 5,
    StudySecretary = 212,
}

export const CourseParticipantRoleLabels: Record<CourseParticipantRole, string> = {
    [CourseParticipantRole.TeacherAndInstructor]: 'Teacher and Instructor',
    [CourseParticipantRole.Student]: 'Student',
    [CourseParticipantRole.StudySecretary]: 'Study Secretary',
};
