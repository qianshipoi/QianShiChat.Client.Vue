import { Avatar, GlobalResult, PagedList } from "../types/Types";
import instance from "./index";

export function defaults(count: number, beforeId?: number): Promise<GlobalResult<PagedList<Avatar>>> {
  return instance.get('/avatar/defaults', { params: { count, beforeId } });
}
