import { atom } from "jotai";
import { ItslearningRestApiEntitiesInstantMessageRecipient } from "@/types/api-types/utils/Itslearning.RestApi.Entities.InstantMessageRecipient.ts";

export const messageSelectedRecipientsAtom = atom<
	ItslearningRestApiEntitiesInstantMessageRecipient[]
>([]);
