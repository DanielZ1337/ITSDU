function sendNotifcation(title: string, body: string, onClick?: () => void) {
	const myNotification = new Notification(title, {
		body,
		icon: "itsl-itslearning-file://icon.ico",
	});

	myNotification.onclick = () => {
		console.log("Notification clicked");
		onClick?.();
	};
}

export { sendNotifcation };
