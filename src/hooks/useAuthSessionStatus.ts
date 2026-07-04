import type { AuthSessionStatus } from "@/types/auth";
import { useEffect, useState } from "react";

const initialStatus: AuthSessionStatus = {
	state: "unknown",
	hasPersistedSession: false,
	isOnline: navigator.onLine,
	reason: "none",
};

export function useAuthSessionStatus() {
	const [status, setStatus] = useState<AuthSessionStatus>(initialStatus);

	useEffect(() => {
		let mounted = true;

		void window.auth.getStatus().then((nextStatus) => {
			if (mounted) setStatus(nextStatus);
		});

		const unsubscribe = window.auth.subscribe((nextStatus) => {
			setStatus(nextStatus);
		});

		return () => {
			mounted = false;
			unsubscribe();
		};
	}, []);

	return status;
}
