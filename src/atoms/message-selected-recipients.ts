import { ItslearningRestApiEntitiesInstantMessageRecipient } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipient.ts";
import { atom } from "jotai";

export const messageSelectedRecipientsAtom = atom<
	ItslearningRestApiEntitiesInstantMessageRecipient[]
>([]);
