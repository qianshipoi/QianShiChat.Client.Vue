import { ChatMessage, GlobalResult, PagedList, PrivateChatMessageRequest, SendFileMessageRequest } from "../types/Types.ts";
import instance from "./index.ts";

export function history(id: number, page: number, size?: number): Promise<GlobalResult<PagedList<ChatMessage>>> {
  return instance.get(`/chat/${id}/history`, { params: { page, size } });
}

export function sendText(request: PrivateChatMessageRequest): Promise<GlobalResult<ChatMessage>> {
  return instance.post(`/chat/text`, request)
}

export function sendFile(request: SendFileMessageRequest): Promise<GlobalResult<ChatMessage>> {
  return instance.post(`/chat/file`, request)
}

