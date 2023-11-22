import { MessageDatabaseType } from "./api-types/AI/GETpreviousMessages";

export type MessageType = Pick<MessageDatabaseType, "content" | "role">