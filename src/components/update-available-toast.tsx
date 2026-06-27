import {
	updateAvailableVersionAtom,
	updateCheckErrorAtom,
	updateReadyAtom,
} from "@/atoms/update-status";
import { useSettings } from "@/hooks/atoms/useSettings";
import { useVersion } from "@/hooks/atoms/useVersion";
import { useT } from "@/lib/i18n";
import { getUpdateErrorMessage } from "@/lib/updates/format-update-error";
import type { UpdateInfo } from "electron-updater";
import { useSetAtom } from "jotai";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useUpdateAvailableToast() {
	const { version } = useVersion();
	const { settings, isHydrated } = useSettings();
	const t = useT();
	const setUpdateReady = useSetAtom(updateReadyAtom);
	const setUpdateAvailableVersion = useSetAtom(updateAvailableVersionAtom);
	const setUpdateCheckError = useSetAtom(updateCheckErrorAtom);
	const [updateResult, setUpdateResult] = useState<UpdateInfo | null>(null);
	const isUpdateAvailable =
		updateResult?.version !== version && updateResult?.version !== undefined;
	const [isError, setIsError] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);

	async function checkForUpdate() {
		try {
			const result = await window.app.checkForUpdates();
			setUpdateResult(result);
			setUpdateCheckError(null);
			setUpdateAvailableVersion(
				result?.version && result.version !== version ? result.version : null,
			);
		} catch (error) {
			console.error(error);
			setIsError(true);
			setUpdateCheckError(getUpdateErrorMessage(error));
		}
	}

	useEffect(() => {
		if (isUpdateAvailable) {
			window.ipcRenderer.on("app:updateDownloaded", () => {
				setIsDownloading(false);
				setUpdateReady(true);
			});
			window.ipcRenderer.on("app:downloadProgress", (_event, progress) => {
				setDownloadProgress(progress.percent);
			});
		}

		return () => {
			window.ipcRenderer.removeAllListeners("app:updateDownloaded");
			window.ipcRenderer.removeAllListeners("app:downloadProgress");
		};
	}, [isUpdateAvailable, setUpdateReady]);

	useEffect(() => {
		if (!isDownloading) return;

		toast.message(
			`${t("common.downloading")}... ${downloadProgress.toFixed(2)}%`,
			{
				id: "update-available-toast",
			},
		);
	}, [downloadProgress, isDownloading, t]);

	const handleUpdateClick = async () => {
		if (isUpdateAvailable) {
			setIsDownloading(true);
			toast.promise(
				window.app
					.downloadUpdate()
					.then(() => window.app.update())
					.then(() => window.app.exit()),
				{
					id: "update-available-toast",
					loading: t("common.downloading"),
					success: t("settings.appUpdates.download.title"),
					error: t("errors.updateCheck"),
				},
			);
		}
	};

	useEffect(() => {
		if (
			!isHydrated ||
			import.meta.env.DEV ||
			!settings.updatesAutoCheckOnStartup ||
			!settings.notificationsAppUpdates
		) {
			return;
		}
		checkForUpdate();
	}, [
		isHydrated,
		settings.notificationsAppUpdates,
		settings.updatesAutoCheckOnStartup,
	]);

	useEffect(() => {
		if (settings.notificationsAppUpdates && isUpdateAvailable) {
			toast.info(t("settings.appUpdates.download.title"), {
				duration: 10000,
				action: {
					label: t("common.install"),
					onClick: handleUpdateClick,
				},
			});
		}
	}, [
		handleUpdateClick,
		isUpdateAvailable,
		settings.notificationsAppUpdates,
		t,
	]);

	useEffect(() => {
		if (settings.notificationsAppUpdates && isError) {
			toast.error(t("errors.updateCheck"));
		}
	}, [isError, settings.notificationsAppUpdates, t]);
}
