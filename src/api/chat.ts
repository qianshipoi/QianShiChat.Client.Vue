import { ChatMessage, GlobalResult, PagedList, PrivateChatMessageRequest, SendFileMessageRequest } from "../types/Types";
import instance from "./index";

export function history(roomId: string, page: number, size?: number): Promise<GlobalResult<PagedList<ChatMessage>>> {
  return instance.get(`/chat/${roomId}/history`, { params: { page, size } });
}

export function sendText(request: PrivateChatMessageRequest): Promise<GlobalResult<ChatMessage>> {
  return instance.post(`/chat/text`, request)
}

export function sendFile(request: SendFileMessageRequest): Promise<GlobalResult<ChatMessage>> {
  return instance.post(`/chat/file`, request)
}

