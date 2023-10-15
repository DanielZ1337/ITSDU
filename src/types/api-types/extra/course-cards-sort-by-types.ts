export const CourseCardsSortByTypesConst = ['LastOnline', 'LastUpdated', 'Title', 'Rank']

export type CourseCardsSortByTypes = typeof CourseCardsSortByTypesConst[number]

export const CourseCardsSortByTypesLabels = {
    [CourseCardsSortByTypesConst[0]]: 'Last online',
    [CourseCardsSortByTypesConst[1]]: 'Last updated',
    [CourseCardsSortByTypesConst[2]]: 'Title',
    [CourseCardsSortByTypesConst[3]]: 'Rank',
} as const

/*
export enum CourseCardsSortByTypesEnum {
    LastOnline = 'LastOnline',
    LastUpdated = 'LastUpdated',
    Title = 'Title',
    Rank = 'Rank',
}

export const CourseCardsSortByTypesLabels = {
    [CourseCardsSortByTypes.LastOnline]: 'Last online',
    [CourseCardsSortByTypes.LastUpdated]: 'Last updated',
    [CourseCardsSortByTypes.Title]: 'Title',
    [CourseCardsSortByTypes.Rank]: 'Rank',
}*/
