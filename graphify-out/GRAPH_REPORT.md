# Graph Report - itsdu-modernization  (2026-09-19)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 2763 nodes · 7757 edges · 141 communities (125 shown, 16 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 20 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `448b28be`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Community 0
- Community 1
- Community 2
- Community 3
- Community 4
- Community 5
- Community 6
- Community 7
- Community 8
- Community 9
- Community 10
- Community 11
- Community 12
- Community 13
- Community 14
- Community 15
- Community 16
- Community 17
- Community 18
- Community 19
- Community 20
- Community 21
- Community 22
- Community 23
- Community 24
- Community 25
- Community 26
- Community 27
- Community 28
- Community 29
- Community 30
- Community 31
- Community 32
- Community 33
- Community 34
- Community 35
- Community 36
- Community 37
- Community 38
- Community 39
- Community 40
- Community 41
- Community 42
- Community 43
- Community 44
- Community 45
- Community 46
- Community 47
- Community 48
- Community 49
- Community 50
- Community 51
- Community 52
- Community 53
- Community 54
- Community 55
- Community 56
- Community 57
- Community 58
- Community 59
- Community 60
- Community 61
- Community 62
- Community 63
- Community 64
- Community 65
- Community 66
- Community 67
- Community 68
- Community 69
- Community 70
- Community 71
- Community 72
- Community 73
- Community 74
- Community 75
- Community 76
- Community 77
- Community 78
- Community 79
- Community 80
- Community 81
- Community 82
- Community 83
- Community 84
- Community 85
- Community 86
- Community 87
- Community 88
- Community 89
- Community 90
- Community 91
- Community 92
- Community 93
- Community 94
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 114
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 126
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133

## God Nodes (most connected - your core abstractions)
1. `cn()` - 310 edges
2. `TanstackKeys` - 153 edges
3. `react` - 150 edges
4. `apiUrl()` - 148 edges
5. `getAccessToken()` - 144 edges
6. `getQueryKeysFromParamsObject()` - 123 edges
7. `useQueryCompat()` - 101 edges
8. `axios` - 86 edges
9. `lucide-react` - 74 edges
10. `react-router-dom` - 60 edges

## Surprising Connections (you probably didn't know these)
- `Window` --references--> `AuthSessionStatus`  [EXTRACTED]
  electron/preload.ts → src/types/auth.ts
- `Window` --references--> `SettingsOptions`  [EXTRACTED]
  electron/preload.ts → src/types/settings.ts
- `Window` --references--> `SettingsPath`  [EXTRACTED]
  electron/preload.ts → src/types/settings.ts
- `Window` --references--> `SettingValue`  [EXTRACTED]
  electron/preload.ts → src/types/settings.ts
- `getSSOLink()` --calls--> `apiUrl()`  [EXTRACTED]
  electron/services/itslearning/resources/resources.ts → src/lib/api-url.ts

## Import Cycles
- None detected.

## Communities (141 total, 16 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.02
Nodes (92): devDependencies, @biomejs/biome, class-variance-authority, clsx, cmdk, copy-to-clipboard, cors, debounce (+84 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (39): he, react-intersection-observer, react-pdf, react-resize-detector, sonner, @tanstack/react-query, AISidePanel(), AISidepanelButton() (+31 more)

### Community 2 - "Community 2"
Cohesion: 0.03
Nodes (69): TanstackKeys, AICheckElementID, AInewMessage, AIpreviousMessages, Bulletin, CalendarEvent, CalendarEvents, CourseAllResources (+61 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (47): InfiniteQueryConfig, useInfiniteQueryCompat(), createMutationFunction(), createQueryFunction(), getQueryKeysFromParamsObject(), ITSLEARNING_API_MAX_PAGESIZE, useGETpreviousMessages(), useGETcourseTasks() (+39 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (52): papaparse, @radix-ui/react-navigation-menu, @radix-ui/react-tabs, @tanstack/react-table, CourseNavigationMenu(), ListItem(), DateFilter, LightbulletinsForCourse() (+44 more)

### Community 5 - "Community 5"
Cohesion: 0.09
Nodes (53): getCookies(), applyDownloadOpenPreference(), authService, downloadExternalHandler(), downloadPDF(), downloadStartHandler(), getBlobFromUrl(), getConfiguredDownloadDirectory() (+45 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (36): jotai, @radix-ui/react-dialog, react-error-boundary, aboutModalAtom, browseNavigationAtom, currentChatAtom, CurrentChatAtomType, currentChatEnum (+28 more)

### Community 7 - "Community 7"
Cohesion: 0.08
Nodes (37): OgImagePreview(), QueryConfig, useQueryCompat(), WithSuspense, useGETcheckElementID(), useGETcoursePlansCount(), useGETcourseResourceInfo(), ResourceActivityObject (+29 more)

### Community 8 - "Community 8"
Cohesion: 0.05
Nodes (27): CachedResourceSummary, UseCachedResourcesOptions, checkRemainingSpaceOptions, IDBUtilsResult, IndexedDB, SortOrder, byteLength(), CachedResourceOpenMode (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (47): CourseCardContextMenu(), NavigationSettings(), PdfSettings(), PrivacySettings(), CoursesCommandList(), CalendarAgendaGroup, formatDuration(), formatEventTimeRange() (+39 more)

### Community 10 - "Community 10"
Cohesion: 0.09
Nodes (26): linkify-react, linkifyjs, react-router-dom, courseAtom, CourseHeaderFallback(), CourseLayout(), renderLink(), HoverDate() (+18 more)

### Community 11 - "Community 11"
Cohesion: 0.10
Nodes (19): date-fns, lucide-react, @radix-ui/react-progress, react, react-day-picker, BrowserNav(), SideBarNavLink(), SideBarNavLinks (+11 more)

### Community 12 - "Community 12"
Cohesion: 0.06
Nodes (33): MessagesChatInputsField(), sendFilesSubmit(), sendMessageSubmit(), usePOSTinstantMessagev2(), POSTinstantMessagev2, POSTinstantMessagev2ApiUrl(), POSTinstantMessagev2Body, EntityListOfItslearningRestApiEntitiesInstantMessage (+25 more)

### Community 13 - "Community 13"
Cohesion: 0.07
Nodes (28): isAppUrl(), isTrustedSender(), registerTrustedWindow(), trustedContents, checkForUpdatesFromTray(), createMainWindow(), gotTheLock, TODO: have some preferences and follow those (+20 more)

### Community 14 - "Community 14"
Cohesion: 0.05
Nodes (42): description, homepage, keywords, license, main, name, private, publisher (+34 more)

### Community 15 - "Community 15"
Cohesion: 0.11
Nodes (26): axios, userAtom, getAccessToken(), usePOSTcourseCardsRank(), useDELETEinstantMessage(), usePATCHrestoreDeletedMessage(), useGETnotifications(), usePUTnotificationsMarkAllAsRead() (+18 more)

### Community 16 - "Community 16"
Cohesion: 0.05
Nodes (42): ItsolutionsItslUtilsConstantsElementType, AchievementGoal, Activities, All, AllForMultipleNotification, AllowedForParents, AllowedInLearningPath, CanContainSubElements (+34 more)

### Community 17 - "Community 17"
Cohesion: 0.10
Nodes (26): getCourseAllResources(), useGETcourseAllResources(), useGETcourseFolderResources(), useGETcourseLastThreeUpdatedResources(), useGETcourseResourceBySearch(), usePOSTcourseAllResources(), GETcourseFolderResources, GETcourseFolderResourcesApiUrl() (+18 more)

### Community 18 - "Community 18"
Cohesion: 0.08
Nodes (32): @radix-ui/react-switch, SidebarItem(), AdvancedSettings(), AppearanceSettings(), AppUpdatesSettings(), CalendarSettings(), DownloadProgress, DownloadSettings() (+24 more)

### Community 19 - "Community 19"
Cohesion: 0.10
Nodes (23): useGETcoursesv3(), useGETlightbulletinsForCourse(), useGETbulletin(), useGETmessages(), useGETperson(), GETcoursesv3, GETcoursesv3ApiUrl(), GETcoursesv3Params (+15 more)

### Community 20 - "Community 20"
Cohesion: 0.12
Nodes (18): @radix-ui/react-avatar, MessageAvatar(), Header(), SidebarUser(), MessageDropdownItem(), NotificationsDropdown(), ProfileAvatar(), SettingsDropdownUserFullname() (+10 more)

### Community 21 - "Community 21"
Cohesion: 0.10
Nodes (21): baseUrl, NumericRange, usePOSTnewAIMessage(), useGETlightbulletinResources(), useDELETEinstantMessageThread(), usePOSTmessageAttachment(), usePUTinstantMessageThread(), POSTnewAIMessageApiUrl() (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.12
Nodes (17): @radix-ui/react-separator, LightbulletinCommentsLoader(), LightbulletinImage(), MessagesDropdownFallback(), MessagesDropdownInfiniteFallback(), MessagesDropdownHeader(), MessagesDropdownInfiniteEnd(), MessagesDropdownNoMessages() (+9 more)

### Community 24 - "Community 24"
Cohesion: 0.09
Nodes (30): SettingSwitch(), calendarViewOptions, calendarWeekStartOptions, clampedInt(), courseSortOptions, CourseSortSetting, define(), Definition (+22 more)

### Community 25 - "Community 25"
Cohesion: 0.09
Nodes (19): getItslearningOAuthUrl(), initializeLoginHandler(), ITSLEARNING_CLIENT_ID, ITSLEARNING_OAUTH_TOKEN_URL(), ITSLEARNING_OAUTH_URL(), ITSLEARNING_REDIRECT_URI, ITSLEARNING_SCOPES, REFRESH_ACCESS_TOKEN_INTERVAL (+11 more)

### Community 26 - "Community 26"
Cohesion: 0.14
Nodes (23): cmdk, @uidotdev/usehooks, CachedResourceResult, quickNavShortcuts, CourseCommandList(), LanguageCombobox(), languages, sectionIds (+15 more)

### Community 27 - "Community 27"
Cohesion: 0.09
Nodes (23): groupAgendaEvents(), formatRelativeTime(), AgendaView(), addDays(), agendaGroupLabel(), classifyUrgency(), courseAccent(), courseAccentPalette (+15 more)

### Community 28 - "Community 28"
Cohesion: 0.12
Nodes (23): @radix-ui/react-select, CourseCardStarredSelect(), CourseSortSelect(), TitlebarButton, SelectContent, SelectItem, SelectLabel, SelectScrollDownButton (+15 more)

### Community 29 - "Community 29"
Cohesion: 0.13
Nodes (20): CoursesBulkStarEditAtom, CoursesBulkStarEditAtomType, isCoursesBulkStarEditingAtom, colorMap, CourseCard(), courseColors, getColorForCourse(), CourseCardInfo() (+12 more)

### Community 30 - "Community 30"
Cohesion: 0.12
Nodes (20): apiUrl(), useGETinstantMessagesRecipientsSearch(), useGETinstantMessagesv3(), useGETinstantMessageThread(), GETLinkOGPreview, GETLinkOGPreviewApiUrl(), GETLinkOGPreviewParams, GETinstantMessagesRecipientsSearch (+12 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (22): @tanstack/react-virtual, TreeItemProps, ResourcesTreeRoot(), TreeItemProps, Child, ChildComponentProps, ChildProps, CollapseButton (+14 more)

### Community 32 - "Community 32"
Cohesion: 0.10
Nodes (22): GETcourseTasks, GETcourseTasksParams, GETpersonalTasks, GETpersonalTasksParams, ItslearningRestApiEntitiesTask, ItslearningRestApiEntitiesTaskDeadlineFilter, All, Deadline (+14 more)

### Community 33 - "Community 33"
Cohesion: 0.10
Nodes (20): @radix-ui/react-icons, @radix-ui/react-scroll-area, react-resizable-panels, LightbulletinsForCourseLoader(), InputProps, GroupProps, PanelProps, PanelSize (+12 more)

### Community 34 - "Community 34"
Cohesion: 0.20
Nodes (21): appHandlerInitializer(), checkForUpdatesHandler(), downloadUpdateHandler(), exitHandler(), focusHandler(), getVersionHandler(), MaximizerHandler(), MinimizerHandler() (+13 more)

### Community 35 - "Community 35"
Cohesion: 0.11
Nodes (16): sendNotifcation(), createEventsApi(), LOGIN_PUSH_CHANNELS, PUSH_CHANNELS, PushChannel, apiBaseUrl, Window, apiBaseUrl (+8 more)

### Community 36 - "Community 36"
Cohesion: 0.08
Nodes (21): Calendar, CourseAnnouncementError, CourseAnnouncements, CourseError, CourseParticipants, CoursePlans, CourseResources, CourseSchedule (+13 more)

### Community 37 - "Community 37"
Cohesion: 0.13
Nodes (18): WeekHeaderDay(), Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, CalendarContext (+10 more)

### Community 38 - "Community 38"
Cohesion: 0.14
Nodes (17): FetchMoreInview(), NotificationsCardsFallback(), NotificationTitle(), NotificationCard(), NotificationsCardSkeleton(), NotificationCards(), getFilteredUpdates(), UpdatesType (+9 more)

### Community 39 - "Community 39"
Cohesion: 0.18
Nodes (18): LightbulletinResource(), NotificationElement(), NotificationLocation(), NotificationPublishedBy(), ResourceContextMenu(), getExtensionIdFromUrl(), getFileExtension(), getIconTypeIdFromUrl() (+10 more)

### Community 40 - "Community 40"
Cohesion: 0.08
Nodes (25): noConstantCondition, noConstAssign, noEmptyCharacterClassInRegex, noEmptyPattern, noGlobalObjectCalls, noInnerDeclarations, noInvalidBuiltinInstantiation, noInvalidConstructorSuper (+17 more)

### Community 41 - "Community 41"
Cohesion: 0.08
Nodes (25): suspicious, noAssignInExpressions, noAsyncPromiseExecutor, noCatchAssign, noClassAssign, noCompareNegZero, noControlCharactersInRegex, noDebugger (+17 more)

### Community 42 - "Community 42"
Cohesion: 0.08
Nodes (25): scripts, build, check, dev, dev:mock, format, lint, lint:fix (+17 more)

### Community 43 - "Community 43"
Cohesion: 0.15
Nodes (19): updateAvailableVersionAtom, updateCheckErrorAtom, updateReadyAtom, NotificationCenterLazy, NotificationCenter(), sourceIcon, readSeenIds(), useNotificationCenter() (+11 more)

### Community 44 - "Community 44"
Cohesion: 0.13
Nodes (18): ResourceTypeBadge(), useCachedResources(), getFileKindLabel(), fileExtension(), formatDateShort(), getResourceKind(), getResourceOpenRoute(), imageExtensions (+10 more)

### Community 45 - "Community 45"
Cohesion: 0.17
Nodes (5): AuthRefreshError, AuthService, classifyRefreshError(), AuthSessionReason, AuthSessionStatus

### Community 46 - "Community 46"
Cohesion: 0.09
Nodes (21): ITSLEARNING_SCOPES_ENUM, Calendar, Children, CkEditor, Courses, Hierarchies, LearningObjectiveRepository, LearningObjectivesReports (+13 more)

### Community 47 - "Community 47"
Cohesion: 0.12
Nodes (16): AboutModalLazy, BrowserNavLazy, CommandPaletteLazy, MessagesDropdown, NotificationsDropdown, quickNavRoutes, ScrollToTopButtonLazy, SettingsModalLazy (+8 more)

### Community 48 - "Community 48"
Cohesion: 0.12
Nodes (15): copy-to-clipboard, react-markdown, react-syntax-highlighter, remark-gfm, CodeBlock(), CodeBlockFallback(), LazyCopyButton, CopyButton() (+7 more)

### Community 49 - "Community 49"
Cohesion: 0.16
Nodes (20): html-to-text, buildMonthGrid(), cleanText(), compareCalendarEvents(), eventCompleteness(), getNumber(), getString(), getWeekDays() (+12 more)

### Community 50 - "Community 50"
Cohesion: 0.16
Nodes (10): CourseTaskEmpty(), CourseTaskError(), CourseTaskTabButton(), CourseTasksActive(), CourseTasksCompleted(), CourseTasksFetchInView(), CourseTasksCardSkeleton(), CourseTasksSkeletonsAnimated() (+2 more)

### Community 51 - "Community 51"
Cohesion: 0.17
Nodes (14): usePUTcourseFavorite(), useDELETElightbulletinComment(), usePUTlightbulletinNotifications(), PUTcourseFavorite, PUTcourseFavoriteApiUrl(), PUTcourseFavoriteParams, DELETElightbulletinComment, DELETElightbulletinCommentApiUrl() (+6 more)

### Community 52 - "Community 52"
Cohesion: 0.18
Nodes (13): react-loading, NestedItem, RecursiveFileExplorer(), NestedItem, Resources(), Highlight(), HighlightProps, useSearch() (+5 more)

### Community 53 - "Community 53"
Cohesion: 0.10
Nodes (19): compilerOptions, allowImportingTsExtensions, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+11 more)

### Community 54 - "Community 54"
Cohesion: 0.29
Nodes (4): SettingsService, normalizeSettings(), SettingsOptions, validateSetting()

### Community 55 - "Community 55"
Cohesion: 0.13
Nodes (13): @dnd-kit/core, @dnd-kit/sortable, @radix-ui/react-accordion, AccordionContent, AccordionItem, AccordionTrigger, MergeZIPDocumentsLazy, CourseDocuments() (+5 more)

### Community 56 - "Community 56"
Cohesion: 0.14
Nodes (15): @radix-ui/react-context-menu, FolderResources(), RootFolderResources(), ContextMenuCheckboxItem, ContextMenuContent, ContextMenuItem, ContextMenuLabel, ContextMenuRadioItem (+7 more)

### Community 57 - "Community 57"
Cohesion: 0.16
Nodes (12): sidebarActiveAtom, SidebarGroupTitle(), LazySidebarItem, LazySidebarUser, Sidebar(), SidebarUserFallback(), SidebarLazy, useSidebar() (+4 more)

### Community 58 - "Community 58"
Cohesion: 0.14
Nodes (15): TitlebarSearchTabButton(), Tab, TabButtonHoverContext, TabButtonHoverProvider(), TabContext, useTabButtonHover(), CoursePlansTabButton(), ItsolutionsItslUtilsConstantsLocationType (+7 more)

### Community 59 - "Community 59"
Cohesion: 0.13
Nodes (13): assertPath(), SettingsStore, themeStore, electron-store, vitest, isSettingsPath(), SettingsPath, SettingValue (+5 more)

### Community 60 - "Community 60"
Cohesion: 0.16
Nodes (14): useGETcoursePlansCurrent(), useGETcoursePlansWithoutDate(), GETcoursePlansCurrent, GETcoursePlansCurrentApiUrl(), GETcoursePlansCurrentParams, Plan, ToolElement, Topic (+6 more)

### Community 61 - "Community 61"
Cohesion: 0.14
Nodes (13): GETcourseGrades, GETcourseGradesApiUrl(), GETcourseGradesParams, ItslearningPlatformRestApiSdkCommonEntitiesWhenToShowResult, AfterAllAttempts, AfterDeadline, AfterEachAttempt, Never (+5 more)

### Community 62 - "Community 62"
Cohesion: 0.12
Nodes (16): aliases, components, hooks, lib, ui, utils, rsc, $schema (+8 more)

### Community 63 - "Community 63"
Cohesion: 0.21
Nodes (11): useGETcourseCardSettings(), usePOSTcourseCardSettings(), GETcourseCardSettings, GETcourseCardSettingsApiUrl(), GETcourseCardSettingsParams, POSTcourseCardSettings, POSTcourseCardSettingsApiUrl(), POSTcourseCardSettingsBody (+3 more)

### Community 64 - "Community 64"
Cohesion: 0.12
Nodes (16): ItslearningRestApiEntitiesElementType, Assignment, CustomActivity, Discussion, Folder, FolderFile, LearningPath, LearningToolElement (+8 more)

### Community 65 - "Community 65"
Cohesion: 0.12
Nodes (15): source, assist, actions, formatter, enabled, indentStyle, quoteStyle, javascript (+7 more)

### Community 66 - "Community 66"
Cohesion: 0.17
Nodes (15): Toaster(), Action, ActionType, actionTypes, addToRemoveQueue(), dispatch(), genId(), listeners (+7 more)

### Community 67 - "Community 67"
Cohesion: 0.23
Nodes (10): useGETcourseBasic(), useGETcourseCalendarEvents(), CourseSchedule(), GETcourseBasic, GETcourseBasicApiUrl(), GETcourseBasicParams, GETcourseCalenderEvents, GETcourseCalenderEventsApiUrl() (+2 more)

### Community 68 - "Community 68"
Cohesion: 0.23
Nodes (11): usePOSTlightbulletinAddComment(), usePUTlightbulletinUpdateComment(), POSTlightbulletinAddComment, POSTlightbulletinAddCommentApiUrl(), POSTlightbulletinAddCommentBody, POSTlightbulletinAddCommentParams, PUTlightbulletinUpdateComment, PUTlightbulletinUpdateCommentApiUrl() (+3 more)

### Community 69 - "Community 69"
Cohesion: 0.18
Nodes (8): next-themes, commandPaletteAtom, GlobalShortcuts(), Layout(), Providers(), SettingsEffects(), useCommandPalette(), Providers

### Community 70 - "Community 70"
Cohesion: 0.16
Nodes (13): CacheSettings(), createTranslator(), formatDuration(), formatFileSize(), formatNumber(), getTimeFormat(), getTranslation(), LanguagePreference (+5 more)

### Community 71 - "Community 71"
Cohesion: 0.13
Nodes (15): FileExtensionTypes, CSV, GIF, JAVA, JPEG, JPG, JSON, MKV (+7 more)

### Community 72 - "Community 72"
Cohesion: 0.19
Nodes (12): @radix-ui/react-label, @radix-ui/react-slot, FormControl, FormDescription, FormFieldContext, FormFieldContextValue, FormItem, FormItemContext (+4 more)

### Community 73 - "Community 73"
Cohesion: 0.21
Nodes (10): IsOnline(), IsOnlineIndicator(), IsOnlineIndicatorLazy, GlobalErrorBoundaryContext, GlobalErrorBoundaryContextType, GlobalErrorBoundaryProvider(), useGlobalErrorBoundary(), initialStatus (+2 more)

### Community 74 - "Community 74"
Cohesion: 0.23
Nodes (11): @radix-ui/react-toast, ToasterLazy, Toast, ToastAction, ToastActionElement, ToastClose, ToastDescription, ToastProps (+3 more)

### Community 75 - "Community 75"
Cohesion: 0.26
Nodes (10): downloadActivityAtom, DownloadActivityEntry, DownloadActivityStatus, DownloadActivity(), parentDirectory(), statusIcon, DownloadActivityLazy, useDownloadActivity() (+2 more)

### Community 76 - "Community 76"
Cohesion: 0.19
Nodes (6): CoursePlansCardSkeleton(), CoursePlansSkeletonsAnimated(), CoursePlansCardSkeletons(), CoursePlanCard(), CoursePlans(), CoursePlansByTopic()

### Community 77 - "Community 77"
Cohesion: 0.21
Nodes (8): ItslearningRestApiEntitiesPersonalCalendarAttendanceAttendanceDetails, ItslearningRestApiEntitiesPersonalCalendarAttendanceAttendanceStatistics, ItslearningRestApiEntitiesPersonalCalendarCalendarEventType, Course, Personal, Project, ItslearningRestApiEntitiesPersonalCalendarCalendarEventV2, ItslearningRestApiEntitiesPersonalCalendarEvent

### Community 78 - "Community 78"
Cohesion: 0.27
Nodes (10): openExternalHandler(), openLinkInBrowser(), ALLOWED_PATH_NAMES, assertAllowedPathName(), assertOpenableLocalPath(), assertPublicHttpUrl(), assertSafeExternalUrl(), BLOCKED_EXTENSIONS (+2 more)

### Community 79 - "Community 79"
Cohesion: 0.24
Nodes (9): CourseParticipantsList(), CourseParticipantsRolesSelect(), DropdownMenuContent, CourseParticipants(), CourseParticipantRole, Student, StudySecretary, TeacherAndInstructor (+1 more)

### Community 80 - "Community 80"
Cohesion: 0.26
Nodes (8): useGETcoursePlans(), GETcoursePlans, GETcoursePlansApiUrl(), GETcoursePlansParams, ItslearningRestApiEntitiesLocationType, Course, Project, ItslearningRestApiEntitiesPlannerPlanPreview

### Community 81 - "Community 81"
Cohesion: 0.25
Nodes (8): aiSidepanelAtom, settingsAtom, settingsHydratedAtom, persistCompatibilityCopy(), readLegacySettings(), hydrateSettings(), defaultSettings, SettingsChanges

### Community 82 - "Community 82"
Cohesion: 0.25
Nodes (7): Badge(), BadgeProps, badgeVariants, AIChats, useGETpreviousChats(), AIChats(), AIChatsGrid()

### Community 83 - "Community 83"
Cohesion: 0.38
Nodes (9): authService, authStatusHandler(), clearTokensHandler(), getTokenHandler(), initAuthIpcHandlers(), logoutHandler(), refreshTokensHandler(), scrapePageHandler() (+1 more)

### Community 84 - "Community 84"
Cohesion: 0.20
Nodes (10): dependencies, axios, cheerio, date-fns, electron-dl, electron-store, electron-updater, jszip (+2 more)

### Community 85 - "Community 85"
Cohesion: 0.36
Nodes (6): PersonRelationships(), useGETpersonsRelations(), GETpersonsRelations, GETpersonsRelationsApiUrl(), GETpersonsRelationsParams, ItslearningRestApiEntitiesRelation

### Community 86 - "Community 86"
Cohesion: 0.20
Nodes (9): ItslearningRestApiEntitiesPersonContextRole, Administrator, ContentDeveloper, Instructor, Learner, Manager, Member, Mentor (+1 more)

### Community 87 - "Community 87"
Cohesion: 0.22
Nodes (9): noAdjacentSpacesInRegex, noExtraBooleanCast, noUselessCatch, linter, enabled, includes, rules, complexity (+1 more)

### Community 88 - "Community 88"
Cohesion: 0.25
Nodes (8): SheetContent, SheetContentProps, SheetDescription, SheetFooter(), SheetHeader(), SheetOverlay, SheetTitle, sheetVariants

### Community 89 - "Community 89"
Cohesion: 0.33
Nodes (7): useGETcoursePlansPast(), EntityArray, GETcoursePlansPast, GETcoursePlansPastApiUrl(), GETcoursePlansPastParams, ToolElement, Topic

### Community 90 - "Community 90"
Cohesion: 0.22
Nodes (9): IconTypesForResources, DOCX, JPEG, MP4, ODP, ODT, PDF, PPTX (+1 more)

### Community 91 - "Community 91"
Cohesion: 0.25
Nodes (5): @tailwindcss/vite, vite, vite-plugin-electron, @vitejs/plugin-react, contentSecurityPolicy

### Community 92 - "Community 92"
Cohesion: 0.43
Nodes (3): CourseTaskCard(), EntityListOfItslearningRestApiEntitiesTaskDailyWorkflow, ItslearningRestApiEntitiesTaskDailyWorkflow

### Community 93 - "Community 93"
Cohesion: 0.29
Nodes (5): SuspenseWrapperLazy, sizes, Spinner(), SpinnerProps, SuspenseWrapper

### Community 94 - "Community 94"
Cohesion: 0.36
Nodes (8): useDownloadToast(), SearchResourcesDialog(), createColumns(), ResourcesDataTable(), ResourcesCommandList(), getFormattedSize(), MergeZIPDocuments(), isResourceFile()

### Community 95 - "Community 95"
Cohesion: 0.43
Nodes (5): useGETcalendarEvent(), GETcalenderEvent, GETcalenderEventApiUrl(), GETcalenderEventParams, ItslearningRestApiEntitiesPersonalCalendarPlanLink

### Community 96 - "Community 96"
Cohesion: 0.43
Nodes (5): useGETcourseParticipants(), GETcourseParticipants, GETcourseParticipantsApiUrl(), GETcourseParticipantsParams, ItslearningRestApiEntitiesPersonalCourseCourseParticipant

### Community 97 - "Community 97"
Cohesion: 0.25
Nodes (7): compilerOptions, allowSyntheticDefaultImports, composite, module, moduleResolution, skipLibCheck, include

### Community 98 - "Community 98"
Cohesion: 0.38
Nodes (4): Client, errors, interceptors, unsupported()

### Community 99 - "Community 99"
Cohesion: 0.29
Nodes (3): app, mockDir, root

### Community 100 - "Community 100"
Cohesion: 0.38
Nodes (5): settingsModalAtom, settingsModalSectionAtom, SettingsModal(), useShowSettingsModal(), Hero()

### Community 101 - "Community 101"
Cohesion: 0.38
Nodes (3): PersonRelationshipsListFallback(), PersonRelationshipsPersonInfoFallback(), PersonIndex

### Community 102 - "Community 102"
Cohesion: 0.48
Nodes (5): useGETcoursePlansTopics(), GETcoursePlansTopics, GETcoursePlansTopicsApiUrl(), GETcoursePlansTopicsParams, Topic

### Community 103 - "Community 103"
Cohesion: 0.29
Nodes (6): ItslearningPlatformRestApiSdkLearningToolAppEntitiesElementPermission, All, Evaluator, Modifier, Participant, Read

### Community 104 - "Community 104"
Cohesion: 0.29
Nodes (6): ItslearningRestApiEntitiesInstantMessageRecipientRole, Administrator, Guest, Parent, Student, Teacher

### Community 105 - "Community 105"
Cohesion: 0.33
Nodes (5): ItslearningRestApiEntitiesNotification, ItslearningRestApiEntitiesNotificationType, Assessment, Behaviour, Unknown

### Community 106 - "Community 106"
Cohesion: 0.33
Nodes (5): react-hook-form, zod, CustomPDFContext, CustomPDFContextProps, CustomPDFProvider()

### Community 107 - "Community 107"
Cohesion: 0.53
Nodes (6): CommandPalette(), CourseSearchDialog(), CourseHeader(), TitlebarSearch(), useGETstarredCourses(), useGETunstarredCourses()

### Community 108 - "Community 108"
Cohesion: 0.33
Nodes (3): TitlebarButtonsLazy, TitlebarButton(), TitlebarButtons()

### Community 109 - "Community 109"
Cohesion: 0.53
Nodes (4): calculateShadowPosition(), Shadow(), ShadowPosition, useMeasureScrollPosition()

### Community 110 - "Community 110"
Cohesion: 0.47
Nodes (4): OfficeDocuments, OfficeDocument, useOfficeDocumentByElementId(), OfficeDocuments()

### Community 111 - "Community 111"
Cohesion: 0.60
Nodes (4): useGETcalendarEvents(), GETcalendarEvents, GETcalendarEventsParams, GETcalenderEventsApiUrl()

### Community 112 - "Community 112"
Cohesion: 0.60
Nodes (4): useGETcourseFeatures(), GETcourseFeatures, GETcourseFeaturesApiUrl(), GETcourseFeaturesParams

### Community 113 - "Community 113"
Cohesion: 0.60
Nodes (4): useGETlightbulletinAllComments(), GETlightbulletinAllComments, GETlightbulletinAllCommentsApiUrl(), GETlightbulletinAllCommentsParams

### Community 114 - "Community 114"
Cohesion: 0.53
Nodes (4): usePOSTpersonUpdateProfileImage(), POSTpersonUpdateProfileImageApiBody, POSTpersonUpdateProfileImageApiResponse, POSTpersonUpdateProfileImageApiUrl()

### Community 115 - "Community 115"
Cohesion: 0.60
Nodes (4): useGETpersonalFollowUpTasks(), GETpersonalFollowUpTasks, GETpersonalFollowUpTasksApiUrl(), GETpersonalFollowUpTasksParams

### Community 116 - "Community 116"
Cohesion: 0.33
Nodes (5): ItslearningRestApiEntitiesLightBulletinsLightBulletinTimePeriod, All, Current, Expired, Scheduled

### Community 118 - "Community 118"
Cohesion: 0.50
Nodes (4): class-variance-authority, @radix-ui/react-toggle, Toggle, toggleVariants

### Community 119 - "Community 119"
Cohesion: 0.60
Nodes (4): isAuthRefreshRequest(), refreshSessionOnce(), RetriableAxiosConfig, setupAuthRefreshInterceptor()

### Community 120 - "Community 120"
Cohesion: 0.50
Nodes (4): MediaDocuments, useDirectFileUrlByElementID(), MediaDocuments(), MediaDocumentType

### Community 121 - "Community 121"
Cohesion: 0.40
Nodes (5): LearningToolIdTypes, BOOK, FILE, LINK, REGISTRATION

### Community 122 - "Community 122"
Cohesion: 0.40
Nodes (4): ItsolutionsItslUtilsConstantsContentAreaFilterType, All, Favorites, NoFavorites

### Community 124 - "Community 124"
Cohesion: 0.50
Nodes (4): startProxyDevServer(), cors, express, http-proxy-middleware

### Community 126 - "Community 126"
Cohesion: 0.67
Nodes (3): files, ignoreUnknown, includes

### Community 128 - "Community 128"
Cohesion: 0.67
Nodes (3): author, email, name

### Community 129 - "Community 129"
Cohesion: 0.67
Nodes (3): repository, type, url

## Knowledge Gaps
- **725 isolated node(s):** `$schema`, `enabled`, `clientKind`, `useIgnoreFile`, `ignoreUnknown` (+720 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 890 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **16 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `axios` connect `Community 15` to `Community 1`, `Community 3`, `Community 5`, `Community 7`, `Community 8`, `Community 12`, `Community 13`, `Community 14`, `Community 17`, `Community 19`, `Community 21`, `Community 29`, `Community 30`, `Community 45`, `Community 51`, `Community 60`, `Community 63`, `Community 67`, `Community 68`, `Community 80`, `Community 83`, `Community 85`, `Community 89`, `Community 95`, `Community 96`, `Community 102`, `Community 111`, `Community 112`, `Community 113`, `Community 114`, `Community 115`, `Community 119`?**
  _High betweenness centrality (0.130) - this node is a cross-community bridge._
- **Why does `react` connect `Community 11` to `Community 1`, `Community 131`, `Community 4`, `Community 6`, `Community 8`, `Community 9`, `Community 10`, `Community 14`, `Community 18`, `Community 20`, `Community 23`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 31`, `Community 33`, `Community 36`, `Community 37`, `Community 38`, `Community 43`, `Community 44`, `Community 47`, `Community 48`, `Community 50`, `Community 52`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 66`, `Community 69`, `Community 70`, `Community 72`, `Community 73`, `Community 74`, `Community 75`, `Community 76`, `Community 79`, `Community 81`, `Community 82`, `Community 88`, `Community 93`, `Community 101`, `Community 106`, `Community 109`, `Community 110`, `Community 118`, `Community 120`, `Community 125`?**
  _High betweenness centrality (0.101) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 4` to `Community 1`, `Community 6`, `Community 9`, `Community 10`, `Community 11`, `Community 18`, `Community 20`, `Community 21`, `Community 23`, `Community 26`, `Community 27`, `Community 28`, `Community 29`, `Community 31`, `Community 33`, `Community 37`, `Community 38`, `Community 44`, `Community 47`, `Community 48`, `Community 50`, `Community 55`, `Community 56`, `Community 57`, `Community 58`, `Community 69`, `Community 72`, `Community 73`, `Community 74`, `Community 76`, `Community 79`, `Community 82`, `Community 88`, `Community 93`, `Community 94`, `Community 100`, `Community 107`, `Community 108`, `Community 109`, `Community 118`?**
  _High betweenness centrality (0.093) - this node is a cross-community bridge._
- **What connects `$schema`, `enabled`, `clientKind` to the rest of the system?**
  _725 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.021739130434782608 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.055900621118012424 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.028985507246376812 - nodes in this community are weakly interconnected._