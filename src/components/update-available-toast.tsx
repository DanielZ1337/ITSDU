import { useVersion } from "@/hooks/atoms/useVersion";
import type { UpdateInfo } from "electron-updater";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useUpdateAvailableToast() {
	const { version } = useVersion();
	const [isCheckingForUpdates, setIsCheckingForUpdates] = useState(false);
	const [updateResult, setUpdateResult] = useState<UpdateInfo | null>(null);
	const isUpdateAvailable =
		updateResult?.version !== version && updateResult?.version !== undefined;
	const [isError, setIsError] = useState(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const [downloadProgress, setDownloadProgress] = useState(0);

	async function checkForUpdate() {
		setIsCheckingForUpdates(true);
		try {
			const result = await window.app.checkForUpdates();
			setUpdateResult(result);
		} catch (error) {
			console.error(error);
			setIsError(true);
		} finally {
			setIsCheckingForUpdates(false);
		}
	}

	useEffect(() => {
		if (isUpdateAvailable) {
			window.ipcRenderer.on("app:updateDownloaded", () => {
				setIsDownloading(false);
			});
			window.ipcRenderer.on("app:downloadProgress", (event, progress) => {
				console.log(progress);
				setDownloadProgress(progress.percent);
			});
		}

		return () => {
			window.ipcRenderer.removeAllListeners("app:updateDownloaded");
			window.ipcRenderer.removeAllListeners("app:downloadProgress");
		};
	}, [isUpdateAvailable]);

	useEffect(() => {
		if (!isDownloading) return;

		toast.message(`Downloading update... ${downloadProgress.toFixed(2)}%`, {
			id: "update-available-toast",
		});
	}, [isDownloading, downloadProgress]);

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
					loading: "Downloading update...",
					success: "Update downloaded!",
					error: "Error downloading update",
				},
			);
		}
	};

	useEffect(() => {
		checkForUpdate();
	}, [isCheckingForUpdates]);

	useEffect(() => {
		if (isUpdateAvailable) {
			toast.info("Update available!", {
				duration: 10000,
				action: {
					label: "Update",
					onClick: handleUpdateClick,
				},
			});
		}
	}, [isUpdateAvailable]);

	useEffect(() => {
		if (isError) {
			toast.error("Error checking for update");
		}
	}, [isError]);
}
