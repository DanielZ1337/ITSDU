import { ItslearningRestApiEntitiesLocationRecipientType } from "@/types/api-types/utils/Itslearning.RestApi.Entities.LocationRecipientType.ts";
import { ItsolutionsItslUtilsConstantsHierarchyRole } from "@/types/api-types/utils/Itsolutions.ItslUtils.Constants.HierarchyRole.ts";

export type ItslearningRestApiEntitiesThreadParticipant = {
	SourceLocationId: number;
	SourceLocationType: ItslearningRestApiEntitiesLocationRecipientType;
	IsDeleted: boolean;
	CanReceive: boolean;
	RoleInHierarchy: ItsolutionsItslUtilsConstantsHierarchyRole;
	PersonId: number;
	FirstName: string;
	LastName: string;
	FullName: string;
	ProfileUrl: string;
	AdditionalInfo: string;
	ProfileImageUrl: string;
	ProfileImageUrlSmall: string;
};
