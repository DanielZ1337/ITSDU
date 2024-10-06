import { atom } from "jotai";

type CoursesBulkStarEditAtomType = [
  {
    id: number;
    starred: boolean;
  },
];

export const CoursesBulkStarEditAtom = atom<CoursesBulkStarEditAtomType | undefined>(
  undefined,
);

export const isCoursesBulkStarEditingAtom = atom<boolean>(false);
