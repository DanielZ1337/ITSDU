import { useSettings } from "@/hooks/atoms/useSettings";
import { fileExtension } from "@/lib/resources/resource-format";
import { useEffect, useMemo } from "react";

export type Locale = "en" | "da";
export type LanguagePreference = "system" | Locale;

const fallbackLocale: Locale = "en";

const translations = {
	en: {
		"common.open": "Open",
		"common.close": "Close",
		"common.choose": "Choose",
		"common.cancel": "Cancel",
		"common.save": "Save",
		"common.reset": "Reset",
		"common.retry": "Retry",
		"common.clear": "Clear",
		"common.download": "Download",
		"common.remove": "Remove",
		"common.search": "Search",
		"common.settings": "Settings",
		"common.navigation": "Navigation",
		"common.actions": "Actions",
		"common.logOut": "Log out",
		"common.confirmLogOut": "Log out of ITSDU?",
		"common.allow": "Allow",
		"common.check": "Check",
		"common.install": "Install",
		"common.calculating": "Calculating...",
		"common.areYouSure": "Are you sure?",
		"common.upToDate": "Up to date",
		"common.readyToInstall": "Ready to install",
		"common.notChecked": "Not checked",
		"common.checking": "Checking...",
		"common.downloading": "Downloading",
		"common.installing": "Installing",
		"common.today": "Today",
		"common.tomorrow": "Tomorrow",
		"common.later": "Later",
		"common.upcoming": "Upcoming",
		"common.allCourses": "All courses",
		"common.loading": "Loading",
		"common.error": "Error",
		"common.empty": "Nothing here yet.",
		"common.openExternally": "Open externally",
		"common.copyDetails": "Copy details",
		"common.openCourse": "Open course",
		"common.start": "Start",
		"common.end": "End",
		"common.availableOffline": "Available offline",
		"common.needsConnection": "Needs connection",
		"common.cached": "Cached",
		"common.stale": "Stale",
		"common.missing": "Missing",
		"common.filesize.bytes": "{value} B",
		"common.filesize.kb": "{value} KB",
		"common.filesize.mb": "{value} MB",
		"common.filesize.gb": "{value} GB",
		"nav.overview": "Overview",
		"nav.courses": "Courses",
		"nav.updates": "Updates",
		"nav.tasks": "All Tasks",
		"nav.calendar": "Calendar",
		"nav.messages": "Messages",
		"nav.aiChats": "AI Chats",
		"nav.mergeZip": "Merge & ZIP",
		"course.overview": "Overview",
		"course.schedule": "Schedule",
		"course.updates": "Updates",
		"course.resources": "Resources",
		"course.tasks": "Tasks",
		"course.plans": "Plans",
		"course.participants": "Participants",
		"course.info": "Course information",
		"settings.group.appearance": "Appearance",
		"settings.group.language": "Language",
		"settings.group.navigation": "Navigation",
		"settings.group.calendar": "Calendar",
		"settings.group.notifications": "Notifications",
		"settings.group.downloads": "Downloads",
		"settings.group.cache": "Cache",
		"settings.group.pdf": "PDF",
		"settings.group.appUpdates": "App & Updates",
		"settings.group.privacy": "Privacy",
		"settings.group.advanced": "Advanced",
		"settings.appearance.theme.title": "Theme",
		"settings.appearance.theme.description":
			"Use the OS theme or choose a fixed light/dark mode.",
		"settings.appearance.customTitlebar.title": "Custom window buttons",
		"settings.appearance.customTitlebar.description":
			"Use ITSDU-styled window controls in the titlebar.",
		"settings.language.title": "App language",
		"settings.language.description":
			"Stored now and used by supported labels as localization expands.",
		"settings.navigation.defaultLanding.title": "Default landing page",
		"settings.navigation.defaultLanding.description":
			"Where the app sends you when opening Home.",
		"settings.navigation.courseSort.title": "Course sort",
		"settings.navigation.courseSort.description":
			"Default sort order for the Courses screen.",
		"settings.navigation.courseSort.lastOnline": "Last online",
		"settings.navigation.courseSort.lastUpdated": "Last updated",
		"settings.navigation.courseSort.titleOption": "Title",
		"settings.navigation.courseSort.rank": "Rank",
		"settings.navigation.sidebarDensity.title": "Sidebar density",
		"settings.navigation.sidebarDensity.description": "Adjust sidebar spacing.",
		"settings.calendar.defaultView.title": "Default calendar view",
		"settings.calendar.defaultView.description":
			"The Calendar page opens in this view.",
		"settings.calendar.weekStartsOn.title": "Week starts on",
		"settings.calendar.weekStartsOn.description":
			"Controls the week and month grid layout.",
		"settings.calendar.showWeekends.title": "Show weekends",
		"settings.calendar.showWeekends.description":
			"Include Saturday and Sunday in month and week views.",
		"settings.notifications.permission.title": "System permission",
		"settings.notifications.permission.description":
			"Desktop notifications require browser notification permission.",
		"settings.notifications.messages.title": "Message notifications",
		"settings.notifications.messages.description":
			"Poll gently for unread messages and show desktop notifications.",
		"settings.notifications.tasks.title": "Task notifications",
		"settings.notifications.tasks.description":
			"Stored for task notification surfaces as they are enabled.",
		"settings.notifications.updates.title": "App update notifications",
		"settings.notifications.updates.description":
			"Show a toast when a new app update is available.",
		"settings.notifications.quietHours.title": "Quiet hours",
		"settings.notifications.quietHours.description":
			"Suppress desktop notifications during a daily window.",
		"settings.downloads.folder.title": "Download folder",
		"settings.downloads.folder.description":
			"Files use the selected folder, or your OS Downloads folder.",
		"settings.downloads.after.title": "After download",
		"settings.downloads.after.description":
			"Choose whether completed downloads open automatically.",
		"settings.cache.usage.title": "Resource cache usage",
		"settings.cache.usage.description":
			"Cached resources make recently opened files available faster.",
		"settings.cache.behavior.title": "Cache behavior",
		"settings.cache.behavior.description":
			"Controls which opened resources are kept for offline use.",
		"settings.cache.maxSize.title": "Maximum cache size",
		"settings.cache.maxSize.description":
			"Least recently opened resources are evicted first when the cache grows past this limit.",
		"settings.cache.browse.title": "Browse cached resources",
		"settings.cache.browse.description":
			"Open, search, and remove individual cached files.",
		"settings.cache.clearProblem.title": "Clear stale cache records",
		"settings.cache.clearProblem.description":
			"Removes broken cache entries without deleting healthy offline resources.",
		"settings.cache.clearProblem.action": "Clear stale",
		"settings.cache.clearProblem.empty": "No stale cache records found",
		"settings.cache.clearProblem.removed":
			"Removed {count} stale cache record{suffix}",
		"settings.cache.healthy": "{count} healthy",
		"settings.cache.needsCleanup": "{count} need cleanup",
		"settings.cache.applyLimit": "Apply limit",
		"settings.cache.limitWithin": "Cache is within the limit",
		"settings.cache.clearAll.success": "Resource cache cleared",
		"settings.cache.clearAll.title": "Clear resource cache",
		"settings.cache.clearAll.description":
			"Removes all locally cached resource files from IndexedDB. It does not delete downloads from your computer.",
		"settings.cache.clearAll.confirm.title": "Clear resource cache?",
		"settings.cache.clearAll.confirm.description":
			"This removes all locally cached resource files from IndexedDB. It does not delete downloads from your computer.",
		"settings.cache.clearAll.confirm.action": "Clear cache",
		"settings.pdf.useViewer.title": "Use ITSDU PDF viewer",
		"settings.pdf.useViewer.description":
			"Use the built-in PDF viewer with thumbnails and the AI side panel.",
		"settings.pdf.aiPanel.title": "Open AI side panel by default",
		"settings.pdf.aiPanel.description":
			"New PDF sessions open with the AI panel visible when enabled.",
		"settings.pdf.sidebar.title": "Show PDF thumbnails by default",
		"settings.pdf.sidebar.description":
			"Controls the thumbnail sidebar in the custom PDF viewer.",
		"settings.appUpdates.version.title": "Current version",
		"settings.appUpdates.version.description":
			"The version currently running on this computer.",
		"settings.appUpdates.check.title": "Check for updates",
		"settings.appUpdates.check.description":
			"Uses the app's existing update service.",
		"settings.appUpdates.download.title": "Download update",
		"settings.appUpdates.download.description":
			"Download the latest available version.",
		"settings.appUpdates.status.title": "Update status",
		"settings.appUpdates.status.description":
			"Check, download, and install updates from here.",
		"settings.appUpdates.devModeNotice":
			"Development builds usually cannot contact the packaged update feed.",
		"settings.appUpdates.latestChecked": "Latest checked: v{version}",
		"settings.appUpdates.checking": "Checking...",
		"settings.appUpdates.downloading": "Downloading...",
		"settings.appUpdates.installing": "Installing...",
		"settings.appUpdates.autoCheck.description":
			"Runs a quiet update check after settings are loaded.",
		"settings.privacy.uploadAi.title": "Allow AI document uploads",
		"settings.privacy.uploadAi.description":
			"Controls whether files can be sent to the AI upload flow.",
		"settings.privacy.copyDiagnostics.title": "Copy diagnostics",
		"settings.privacy.copyDiagnostics.description":
			"App version, settings, and cache usage - no tokens or account data.",
		"settings.privacy.copyDiagnostics.action": "Copy diagnostics",
		"settings.privacy.copyDiagnostics.success":
			"Diagnostics copied to clipboard",
		"settings.advanced.resetAll.title": "Reset all settings",
		"settings.advanced.resetAll.description":
			"Restore every setting to its default value.",
		"settings.advanced.resetAll.confirm.title": "Reset all settings?",
		"settings.advanced.resetAll.confirm.description":
			"This restores every setting in this screen to its default value.",
		"settings.advanced.deferred.title": "Deferred foundation settings",
		"settings.advanced.deferred.description":
			"Cache size limits and broader task notification scheduling need background enforcement before they become real controls, so they are not exposed as toggles yet.",
		"settings.options.system": "System",
		"settings.options.english": "English",
		"settings.options.danish": "Danish",
		"settings.options.light": "Light",
		"settings.options.dark": "Dark",
		"settings.options.overview": "Overview",
		"settings.options.courses": "Courses",
		"settings.options.calendar": "Calendar",
		"settings.options.tasks": "Tasks",
		"settings.options.messages": "Messages",
		"settings.options.comfortable": "Comfortable",
		"settings.options.compact": "Compact",
		"settings.options.never": "Do not open",
		"settings.options.file": "Open file",
		"settings.options.folder": "Show in folder",
		"settings.options.opened": "Cache opened resources",
		"settings.options.pdfOnly": "Cache opened PDFs only",
		"settings.options.manual": "Manual only",
		"overview.greeting.morning": "Good morning",
		"overview.greeting.afternoon": "Good afternoon",
		"overview.greeting.evening": "Good evening",
		"overview.stat.overdue": "{count} overdue",
		"overview.stat.dueToday": "{count} due today",
		"overview.stat.eventsToday": "{count} event{suffix} today",
		"overview.stat.unread": "{count} unread",
		"overview.stat.new": "{count} new",
		"overview.empty.noRecentActivity": "No recent activity",
		"overview.empty.thread": "Thread",
		"overview.widget.tasks": "Tasks",
		"overview.widget.calendar": "Calendar",
		"overview.widget.messages": "Messages",
		"overview.widget.courses": "Pinned courses",
		"overview.widget.resources": "Recent resources",
		"overview.widget.continue": "Continue where you left off",
		"overview.empty.tasks": "No tasks due right now.",
		"overview.empty.calendar": "No upcoming events.",
		"overview.empty.messages": "No unread messages.",
		"overview.empty.courses": "No pinned courses yet.",
		"overview.empty.resources": "No cached resources yet.",
		"overview.empty.continue": "Open a few files and they will appear here.",
		"calendar.month": "Month",
		"calendar.week": "Week",
		"calendar.day": "Day",
		"calendar.agenda": "Agenda",
		"calendar.planner": "planner",
		"calendar.empty": "No events found.",
		"calendar.emptyDay": "No events on this day.",
		"calendar.group.today": "Today",
		"calendar.group.tomorrow": "Tomorrow",
		"calendar.group.thisWeek": "This week",
		"calendar.group.later": "Later",
		"calendar.group.noDate": "No date",
		"calendar.detail.time": "Time",
		"calendar.detail.duration": "Duration",
		"calendar.detail.location": "Location",
		"calendar.detail.course": "Course",
		"calendar.detail.description": "Description",
		"calendar.detail.importedDescription": "Imported description",
		"calendar.detail.importedNotes": "Imported notes",
		"calendar.detail.openExternally": "Open externally",
		"calendar.detail.openCourse": "Open course",
		"calendar.detail.copyDetails": "Copy details",
		"calendar.detail.close": "Close",
		"calendar.timeUnknown": "Time unknown",
		"calendar.allDay": "All day",
		"calendar.now": "Now",
		"calendar.free": "Free",
		"calendar.day.eventCountOne": "1 event",
		"calendar.day.eventCountMany": "{count} events",
		"calendar.detail.dateUnknown": "Date unknown",
		"calendar.detail.notSpecified": "Not specified",
		"calendar.detail.noLocation": "No location",
		"calendar.detail.noCourseLinked": "No course linked",
		"calendar.detail.noDescription":
			"No description was provided for this event.",
		"calendar.detail.fullDetailsFailed":
			"Full details couldn't load, but the summary above is up to date.",
		"calendar.control.today": "Today",
		"calendar.control.prev": "Previous",
		"calendar.control.next": "Next",
		"calendar.control.month": "Month",
		"calendar.control.week": "Week",
		"calendar.control.day": "Day",
		"calendar.control.agenda": "Agenda",
		"calendar.control.selected": "Selected",
		"calendar.filterByCourse": "Filter by course",
		"resources.title": "Resource library",
		"resources.description":
			"Local study files, offline cache, and recently opened resources.",
		"resources.empty": "No cached resources yet.",
		"resources.emptyFiltered": "No resources match the current filters.",
		"resources.needsCleanup": "needs cleanup",
		"resources.availableOffline": "Available offline",
		"resources.needsConnection": "Needs connection",
		"downloads.title": "Downloads",
		"downloads.clearFinished": "Clear finished",
		"downloads.downloading": "Downloading...",
		"downloads.done": "Done",
		"downloads.failed": "Download failed",
		"notifications.title": "Notifications",
		"notifications.markAllRead": "Mark all read",
		"notifications.allCaughtUp": "You're all caught up",
		"notifications.unread": "{count} unread",
		"notifications.nothingNew": "Nothing new right now.",
		"errors.generic": "Something went wrong.",
		"errors.offlineResource":
			"This resource is not available offline. Connect to the internet and try again.",
		"errors.cacheRead": "The resource cache couldn't be read.",
		"errors.cacheClear": "The resource cache couldn't be cleared.",
		"errors.updateCheck": "Error checking for updates.",
	},
	da: {
		"common.open": "Åbn",
		"common.close": "Luk",
		"common.choose": "Vælg",
		"common.cancel": "Annuller",
		"common.save": "Gem",
		"common.reset": "Nulstil",
		"common.retry": "Prøv igen",
		"common.clear": "Ryd",
		"common.download": "Download",
		"common.remove": "Fjern",
		"common.search": "Søg",
		"common.settings": "Indstillinger",
		"common.navigation": "Navigation",
		"common.actions": "Handlinger",
		"common.logOut": "Log af",
		"common.confirmLogOut": "Log af fra ITSDU?",
		"common.allow": "Tillad",
		"common.check": "Tjek",
		"common.install": "Installér",
		"common.calculating": "Beregner...",
		"common.areYouSure": "Er du sikker?",
		"common.upToDate": "Opdateret",
		"common.readyToInstall": "Klar til installation",
		"common.notChecked": "Ikke tjekket",
		"common.checking": "Tjekker...",
		"common.downloading": "Downloader",
		"common.installing": "Installerer",
		"common.today": "I dag",
		"common.tomorrow": "I morgen",
		"common.later": "Senere",
		"common.upcoming": "Kommende",
		"common.allCourses": "Alle fag",
		"common.loading": "Indlæser",
		"common.error": "Fejl",
		"common.empty": "Her er tomt endnu.",
		"common.openExternally": "Åbn eksternt",
		"common.copyDetails": "Kopiér detaljer",
		"common.openCourse": "Åbn fag",
		"common.start": "Start",
		"common.end": "Slut",
		"common.availableOffline": "Tilgængelig offline",
		"common.needsConnection": "Kræver forbindelse",
		"common.cached": "Mellem-lagret",
		"common.stale": "Forældet",
		"common.missing": "Mangler",
		"common.filesize.bytes": "{value} B",
		"common.filesize.kb": "{value} KB",
		"common.filesize.mb": "{value} MB",
		"common.filesize.gb": "{value} GB",
		"nav.overview": "Oversigt",
		"nav.courses": "Kurser",
		"nav.updates": "Opdateringer",
		"nav.tasks": "Opgaver",
		"nav.calendar": "Kalender",
		"nav.messages": "Beskeder",
		"nav.aiChats": "AI-samtaler",
		"nav.mergeZip": "Flet og ZIP",
		"course.overview": "Oversigt",
		"course.schedule": "Skema",
		"course.updates": "Opdateringer",
		"course.resources": "Ressourcer",
		"course.tasks": "Opgaver",
		"course.plans": "Planer",
		"course.participants": "Deltagere",
		"course.info": "Kursusinformation",
		"settings.group.appearance": "Udseende",
		"settings.group.language": "Sprog",
		"settings.group.navigation": "Navigation",
		"settings.group.calendar": "Kalender",
		"settings.group.notifications": "Notifikationer",
		"settings.group.downloads": "Downloads",
		"settings.group.cache": "Cache",
		"settings.group.pdf": "PDF",
		"settings.group.appUpdates": "App og opdateringer",
		"settings.group.privacy": "Privatliv",
		"settings.group.advanced": "Avanceret",
		"settings.appearance.theme.title": "Tema",
		"settings.appearance.theme.description":
			"Brug systemets tema eller vælg lys/mørk tilstand.",
		"settings.appearance.customTitlebar.title": "Tilpassede vinduesknapper",
		"settings.appearance.customTitlebar.description":
			"Brug ITSDU-stil til vindueskontrollerne i titelbjælken.",
		"settings.language.title": "Appsprog",
		"settings.language.description":
			"Gemme nu og bruges af understøttede labels i takt med at lokalisering udbygges.",
		"settings.navigation.defaultLanding.title": "Standard startside",
		"settings.navigation.defaultLanding.description":
			"Hvor appen sender dig hen, når du åbner hjem.",
		"settings.navigation.courseSort.title": "Sortering af kurser",
		"settings.navigation.courseSort.description":
			"Standardrækkefølge på kursussiden.",
		"settings.navigation.courseSort.lastOnline": "Sidst online",
		"settings.navigation.courseSort.lastUpdated": "Sidst opdateret",
		"settings.navigation.courseSort.titleOption": "Titel",
		"settings.navigation.courseSort.rank": "Rang",
		"settings.navigation.sidebarDensity.title": "Sidebjælkens tæthed",
		"settings.navigation.sidebarDensity.description":
			"Juster afstanden i sidebjælken.",
		"settings.calendar.defaultView.title": "Standardvisning i kalender",
		"settings.calendar.defaultView.description":
			"Kalendersiden åbner i denne visning.",
		"settings.calendar.weekStartsOn.title": "Ugen starter på",
		"settings.calendar.weekStartsOn.description":
			"Styrer layoutet i uge- og månedsvisningen.",
		"settings.calendar.showWeekends.title": "Vis weekender",
		"settings.calendar.showWeekends.description":
			"Inkluder lørdag og søndag i måned- og ugevisning.",
		"settings.notifications.permission.title": "Systemtilladelse",
		"settings.notifications.permission.description":
			"Skrivebordsnotifikationer kræver browserens notifikationstilladelse.",
		"settings.notifications.messages.title": "Beskednotifikationer",
		"settings.notifications.messages.description":
			"Slå stille opdatering af ulæste beskeder til og vis notifikationer.",
		"settings.notifications.tasks.title": "Opgavenotifikationer",
		"settings.notifications.tasks.description":
			"Gemmes til de opgavens notifikationsflader, når de aktiveres.",
		"settings.notifications.updates.title":
			"Notifikationer om app-opdateringer",
		"settings.notifications.updates.description":
			"Vis en toast, når der er en ny version af appen.",
		"settings.notifications.quietHours.title": "Stilletid",
		"settings.notifications.quietHours.description":
			"Undertryk notifikationer i et dagligt tidsvindue.",
		"settings.downloads.folder.title": "Downloadmappe",
		"settings.downloads.folder.description":
			"Filer gemmes i den valgte mappe eller i systemets Downloads-mappe.",
		"settings.downloads.after.title": "Efter download",
		"settings.downloads.after.description":
			"Vælg om færdige downloads skal åbnes automatisk.",
		"settings.cache.usage.title": "Cacheforbrug for ressourcer",
		"settings.cache.usage.description":
			"Cachede ressourcer gør nyligt åbnede filer hurtigere tilgængelige.",
		"settings.cache.behavior.title": "Cacheadfærd",
		"settings.cache.behavior.description":
			"Styrer hvilke åbnede ressourcer der gemmes til offline brug.",
		"settings.cache.maxSize.title": "Maksimal cachestørrelse",
		"settings.cache.maxSize.description":
			"De mindst nyligt åbnede ressourcer ryger først ud, når cachen vokser over grænsen.",
		"settings.cache.browse.title": "Gennemse cachede ressourcer",
		"settings.cache.browse.description":
			"Åbn, søg i og fjern enkelte cachede filer.",
		"settings.cache.clearProblem.title": "Ryd forældede cacheposter",
		"settings.cache.clearProblem.description":
			"Fjerner ødelagte cacheposter uden at slette raske offlinefiler.",
		"settings.cache.clearProblem.empty": "Ingen forældede cacheposter fundet",
		"settings.cache.clearProblem.removed":
			"Fjernede {count} forældede cachepost{suffix}",
		"settings.cache.healthy": "{count} sunde",
		"settings.cache.needsCleanup": "{count} kræver oprydning",
		"settings.cache.applyLimit": "Anvend grænse",
		"settings.cache.limitWithin": "Cachen er inden for grænsen",
		"settings.cache.clearAll.success": "Resource-cache ryddet",
		"settings.cache.clearAll.title": "Ryd resource-cache",
		"settings.cache.clearAll.description":
			"Fjerner alle lokalt cachede ressourcefiler fra IndexedDB. Det sletter ikke downloads på din computer.",
		"settings.cache.clearAll.confirm.title": "Ryd resource-cache?",
		"settings.cache.clearAll.confirm.description":
			"Dette fjerner alle lokalt cachede ressourcefiler fra IndexedDB. Det sletter ikke downloads på din computer.",
		"settings.cache.clearAll.confirm.action": "Ryd cache",
		"settings.pdf.useViewer.title": "Brug ITSDU PDF-viseren",
		"settings.pdf.useViewer.description":
			"Brug den indbyggede PDF-visning med thumbnails og AI-sidepanel.",
		"settings.pdf.aiPanel.title": "Åbn AI-sidepanel som standard",
		"settings.pdf.aiPanel.description":
			"Nye PDF-sessioner åbner med AI-panelet synligt, når det er slået til.",
		"settings.pdf.sidebar.title": "Vis PDF-miniaturer som standard",
		"settings.pdf.sidebar.description":
			"Styrer miniature-sidestolpen i den tilpassede PDF-viser.",
		"settings.appUpdates.version.title": "Aktuel version",
		"settings.appUpdates.version.description":
			"Den version, der kører på denne computer lige nu.",
		"settings.appUpdates.check.title": "Søg efter opdateringer",
		"settings.appUpdates.check.description":
			"Bruger appens eksisterende opdateringstjeneste.",
		"settings.appUpdates.download.title": "Download opdatering",
		"settings.appUpdates.download.description":
			"Download den senest tilgængelige version.",
		"settings.appUpdates.status.title": "Opdateringsstatus",
		"settings.appUpdates.status.description":
			"Her kan du søge efter, hente og installere opdateringer.",
		"settings.appUpdates.autoCheck.description":
			"Kører et stille opdateringstjek, efter indstillingerne er indlæst.",
		"settings.privacy.uploadAi.title": "Tillad upload af dokumenter til AI",
		"settings.privacy.uploadAi.description":
			"Styrer om filer må sendes til AI-upload-flowet.",
		"settings.advanced.resetAll.title": "Nulstil alle indstillinger",
		"settings.advanced.resetAll.description":
			"Gendanner alle indstillinger til standardværdier.",
		"settings.advanced.resetAll.confirm.title": "Nulstil alle indstillinger?",
		"settings.advanced.resetAll.confirm.description":
			"Dette gendanner alle indstillinger på denne skærm til deres standardværdier.",
		"settings.options.system": "System",
		"settings.options.english": "Engelsk",
		"settings.options.danish": "Dansk",
		"settings.options.light": "Lys",
		"settings.options.dark": "Mørk",
		"settings.options.overview": "Oversigt",
		"settings.options.courses": "Kurser",
		"settings.options.calendar": "Kalender",
		"settings.options.tasks": "Opgaver",
		"settings.options.messages": "Beskeder",
		"settings.options.comfortable": "Komfortabel",
		"settings.options.compact": "Tæt",
		"settings.options.never": "Åbn ikke",
		"settings.options.file": "Åbn fil",
		"settings.options.folder": "Vis i mappe",
		"settings.options.opened": "Cache åbnede ressourcer",
		"settings.options.pdfOnly": "Cache kun åbnede PDF-filer",
		"settings.options.manual": "Kun manuelt",
		"overview.greeting.morning": "Godmorgen",
		"overview.greeting.afternoon": "God eftermiddag",
		"overview.greeting.evening": "God aften",
		"overview.stat.overdue": "{count} forfalden",
		"overview.stat.dueToday": "{count} i dag",
		"overview.stat.eventsToday": "{count} begivenhed{suffix} i dag",
		"overview.stat.unread": "{count} ulæst",
		"overview.stat.new": "{count} ny",
		"overview.empty.noRecentActivity": "Ingen nylig aktivitet",
		"overview.empty.thread": "Tråd",
		"overview.widget.tasks": "Opgaver",
		"overview.widget.calendar": "Kalender",
		"overview.widget.messages": "Beskeder",
		"overview.widget.courses": "Fastgjorte kurser",
		"overview.widget.resources": "Seneste ressourcer",
		"overview.widget.continue": "Fortsæt, hvor du slap",
		"overview.empty.tasks": "Ingen opgaver med deadline lige nu.",
		"overview.empty.calendar": "Ingen kommende begivenheder.",
		"overview.empty.messages": "Ingen ulæste beskeder.",
		"overview.empty.courses": "Ingen fastgjorte kurser endnu.",
		"overview.empty.resources": "Ingen cachede ressourcer endnu.",
		"overview.empty.continue": "Åbn et par filer, så dukker de op her.",
		"calendar.month": "Måned",
		"calendar.week": "Uge",
		"calendar.day": "Dag",
		"calendar.agenda": "Dagsorden",
		"calendar.planner": "planlægger",
		"calendar.empty": "Ingen begivenheder fundet.",
		"calendar.emptyDay": "Ingen begivenheder denne dag.",
		"calendar.group.today": "I dag",
		"calendar.group.tomorrow": "I morgen",
		"calendar.group.thisWeek": "Denne uge",
		"calendar.group.later": "Senere",
		"calendar.group.noDate": "Ingen dato",
		"calendar.detail.time": "Tid",
		"calendar.detail.duration": "Varighed",
		"calendar.detail.location": "Sted",
		"calendar.detail.course": "Fag",
		"calendar.detail.description": "Beskrivelse",
		"calendar.detail.importedDescription": "Importeret beskrivelse",
		"calendar.detail.openExternally": "Åbn eksternt",
		"calendar.detail.openCourse": "Åbn fag",
		"calendar.detail.copyDetails": "Kopiér detaljer",
		"calendar.detail.close": "Luk",
		"calendar.timeUnknown": "Tid ukendt",
		"calendar.allDay": "Hele dagen",
		"calendar.now": "Nu",
		"calendar.free": "Fri",
		"calendar.day.eventCountOne": "1 begivenhed",
		"calendar.day.eventCountMany": "{count} begivenheder",
		"calendar.control.today": "I dag",
		"calendar.control.prev": "Forrige",
		"calendar.control.next": "Næste",
		"calendar.control.month": "Måned",
		"calendar.control.week": "Uge",
		"calendar.control.day": "Dag",
		"calendar.control.agenda": "Dagsorden",
		"calendar.control.selected": "Markeret",
		"calendar.filterByCourse": "Filtrer efter fag",
		"resources.title": "Ressourcer",
		"resources.description":
			"Lokale studiefiler, offline-cache og nyligt åbnede ressourcer.",
		"resources.empty": "Ingen cachede ressourcer endnu.",
		"resources.emptyFiltered": "Ingen ressourcer matcher de aktuelle filtre.",
		"resources.needsCleanup": "kræver oprydning",
		"resources.availableOffline": "Tilgængelig offline",
		"resources.needsConnection": "Kræver forbindelse",
		"downloads.title": "Downloads",
		"downloads.clearFinished": "Ryd færdige",
		"downloads.downloading": "Downloader...",
		"downloads.done": "Færdig",
		"downloads.failed": "Download mislykkedes",
		"notifications.title": "Notifikationer",
		"notifications.markAllRead": "Markér alle som læst",
		"notifications.allCaughtUp": "Du er helt opdateret",
		"notifications.unread": "{count} ulæst",
		"notifications.nothingNew": "Der er intet nyt lige nu.",
		"errors.generic": "Noget gik galt.",
		"errors.offlineResource":
			"Denne ressource er ikke tilgængelig offline. Forbind til internettet og prøv igen.",
		"errors.cacheRead": "Ressourcecachen kunne ikke læses.",
		"errors.cacheClear": "Ressourcecachen kunne ikke ryddes.",
		"errors.updateCheck": "Fejl under søgning efter opdateringer.",
	},
} as const;

export type TranslationKey = keyof typeof translations.en;

const relativeTimeFormatters = new Map<string, Intl.RelativeTimeFormat>();

export function resolveLocale(
	preference: LanguagePreference,
	systemLocale = window.navigator.language,
): Locale {
	if (preference === "da" || preference === "en") return preference;
	return systemLocale.toLowerCase().startsWith("da") ? "da" : fallbackLocale;
}

export function getTranslation(locale: Locale, key: TranslationKey) {
	const value = translations[locale][key] ?? translations[fallbackLocale][key];
	if (value === undefined) {
		if (import.meta.env.DEV) {
			throw new Error(`Missing translation key: ${String(key)}`);
		}
		return String(key);
	}
	return value;
}

export function createTranslator(locale: Locale) {
	return (key: TranslationKey, values?: Record<string, string | number>) => {
		const template = getTranslation(locale, key);
		if (!values) return template;
		return template.replace(/\{(\w+)\}/g, (_match, name) =>
			values[name] !== undefined ? String(values[name]) : `{${name}}`,
		);
	};
}

export function useLocale() {
	const { settings } = useSettings();
	const locale = resolveLocale(settings.language);

	useEffect(() => {
		document.documentElement.lang = locale;
	}, [locale]);

	return {
		locale,
		language: settings.language,
	};
}

export function useT() {
	const { locale } = useLocale();
	return useMemo(() => createTranslator(locale), [locale]);
}

function getTimeFormat(locale: Locale) {
	return new Intl.DateTimeFormat(locale, {
		hour: "2-digit",
		minute: "2-digit",
	});
}

export function formatDate(date: Date | string | number, locale: Locale) {
	return new Intl.DateTimeFormat(locale, {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
	}).format(new Date(date));
}

export function formatTime(date: Date | string | number, locale: Locale) {
	return getTimeFormat(locale).format(new Date(date));
}

export function formatDateTime(date: Date | string | number, locale: Locale) {
	return new Intl.DateTimeFormat(locale, {
		weekday: "short",
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	}).format(new Date(date));
}

export function formatRelativeTime(
	date: Date | string | number,
	locale: Locale,
	baseDate = new Date(),
) {
	const input = new Date(date);
	const diffMinutes = Math.round(
		(input.getTime() - baseDate.getTime()) / 60000,
	);
	const absMinutes = Math.abs(diffMinutes);
	const unit =
		absMinutes < 60 ? "minute" : absMinutes < 60 * 24 ? "hour" : "day";
	const value =
		unit === "minute"
			? diffMinutes
			: unit === "hour"
				? Math.round(diffMinutes / 60)
				: Math.round(diffMinutes / (60 * 24));
	const key = `${locale}:${unit}`;
	const formatter =
		relativeTimeFormatters.get(key) ??
		new Intl.RelativeTimeFormat(locale, { numeric: "auto" });
	relativeTimeFormatters.set(key, formatter);
	return formatter.format(value, unit as Intl.RelativeTimeFormatUnit);
}

export function formatNumber(value: number, locale: Locale) {
	return new Intl.NumberFormat(locale).format(value);
}

export function formatFileSize(size: number, locale: Locale) {
	if (!Number.isFinite(size) || size <= 0) return "0 B";
	if (size < 1024) return `${formatNumber(size, locale)} B`;
	if (size < 1024 * 1024) {
		return `${formatNumber(Math.round(size / 1024), locale)} KB`;
	}
	if (size < 1024 * 1024 * 1024) {
		return `${formatNumber(Math.round(size / (1024 * 1024)), locale)} MB`;
	}
	return `${formatNumber(Math.round(size / (1024 * 1024 * 1024)), locale)} GB`;
}

export function formatDuration(minutes: number, locale: Locale) {
	if (!Number.isFinite(minutes) || minutes <= 0) return "0 min";
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	const parts = [];
	if (hours > 0) {
		parts.push(`${formatNumber(hours, locale)} h`);
	}
	if (remainingMinutes > 0 || parts.length === 0) {
		parts.push(`${formatNumber(remainingMinutes, locale)} min`);
	}
	return parts.join(" ");
}

export function getFileKindLabel(name: string) {
	const ext = fileExtension(name);
	return ext ? ext.toUpperCase() : "FILE";
}
