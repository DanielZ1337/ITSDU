import { atom } from "jotai";

export type DownloadActivityStatus = "downloading" | "completed" | "failed";

export type DownloadActivityEntry = {
	id: string;
	filename: string;
	status: DownloadActivityStatus;
	startedAt: Date;
	path?: string;
	size?: number;
	progress?: number;
	error?: string;
	retry?: () => void;
};

export const downloadActivityAtom = atom<DownloadActivityEntry[]>([]);
