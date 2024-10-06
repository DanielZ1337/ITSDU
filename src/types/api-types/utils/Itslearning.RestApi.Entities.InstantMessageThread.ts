import { ItslearningRestApiEntitiesInstantMessage } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessage.ts";
import { ItslearningRestApiEntitiesInstantMessageMassMessageType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageMassMessageType.ts";
import { ItslearningRestApiEntitiesLocationRecipient } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LocationRecipient.ts";
import { ItslearningRestApiEntitiesThreadParticipant } from "@/types/api-types/utils/Itslearning.RestApi.Entities.ThreadParticipant.ts";

export type ItslearningRestApiEntitiesInstantMessageThread = {
	InstantMessageThreadId: number;
	Name: string;
	Created: Date;
	CreatedByTeacher: boolean;
	CreatedBy: number;
	Type: "Group" | "Course" | "Project" | "OneToOne" | "GroupPlaceHolder";
	ColorScheme: string;
	Messages: {
		EntityArray: ItslearningRestApiEntitiesInstantMessage[];
		Total: number;
		CurrentPageIndex: number;
		PageSize: number;
	};
	LastMessage: ItslearningRestApiEntitiesInstantMessage;
	MatchingMessageIds: number[];
	Participants: ItslearningRestApiEntitiesThreadParticipant[];
	LocationRecipients: ItslearningRestApiEntitiesLocationRecipient[];
	LastReadInstantMessageId: number;
	SortIndex: number;
	OnlyThreadAdminCanSendToThread: boolean;
	IsThreadAdministrator: boolean;
	IsThreadModerator: boolean;
	InstantMessageLocationId: number;
	IsBlocked: boolean;
	UserAllowToBlockThread: boolean;
	IsAbuse: boolean;
	IsAbuseReportedByCurrentUser: boolean;
	MassMessageType: ItslearningRestApiEntitiesInstantMessageMassMessageType;
	Tooltip: string;
	CanDelete: boolean;
};
