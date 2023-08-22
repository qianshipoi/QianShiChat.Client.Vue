import { ChatMessage, GlobalResult, PagedList } from "../types/Types.ts";
import instance from "./index.ts";

export function history(id: number, page: number, size?: number): Promise<GlobalResult<PagedList<ChatMessage>>> {
  return instance.get(`/chat/${id}/history`, { params: { page, size } });
}
