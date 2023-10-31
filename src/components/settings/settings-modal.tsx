import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogOverlay,
    DialogPortal,
    DialogTitle,
    DialogTrigger
} from "../ui/dialog.tsx"
import {useState} from "react";

export default function SettingsModal() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [theme, setTheme] = useState("light");
    const [desktopNotifications, setDesktopNotifications] = useState(false);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleThemeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setTheme(event.target.value);
    };

    const handleDesktopNotificationsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDesktopNotifications(event.target.checked);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        // TODO: Save settings to local storage or send to server
    };

    return (
        <Dialog>
            <DialogTrigger>Open Settings</DialogTrigger>
            <DialogOverlay/>
            <DialogPortal>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Settings</DialogTitle>
                        <DialogDescription>Configure your preferences</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit}>
                        <label htmlFor="name">Name:</label>
                        <input type="text" id="name" name="name" value={name} onChange={handleNameChange}/>
                        <label htmlFor="email">Email:</label>
                        <input type="email" id="email" name="email" value={email} onChange={handleEmailChange}/>
                        <label htmlFor="theme">Theme:</label>
                        <select id="theme" name="theme" value={theme} onChange={handleThemeChange}>
                            <option value="light">Light</option>
                            <option value="dark">Dark</option>
                        </select>
                        <label htmlFor="desktopNotifications">Desktop Notifications:</label>
                        <input type="checkbox" id="desktopNotifications" name="desktopNotifications"
                               checked={desktopNotifications} onChange={handleDesktopNotificationsChange}/>
                    </form>
                    <DialogFooter>
                        <button>Cancel</button>
                        <button type="submit">Save</button>
                    </DialogFooter>
                </DialogContent>
            </DialogPortal>
        </Dialog>
    )
}