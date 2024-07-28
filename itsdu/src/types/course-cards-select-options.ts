/* eslint-disable no-unused-vars */

export enum CourseCardsSelectOptionsEnum {
	All = "All",
	Starred = "Starred",
	Unstarred = "Unstarred",
}

export type CourseCardsSelectOptions =
	keyof typeof CourseCardsSelectOptionsEnum;
