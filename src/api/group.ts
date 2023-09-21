import { CancelToken } from "axios";
import { GlobalResult, Group, GroupApply, PagedList, UserInfo } from "../types/Types";
import instance from "./index";

export function create(friendIds: number[], name?: string): Promise<GlobalResult<Group>> {
  return instance.post("/group", {
    friendIds,
    name
  })
}

export function getAll(): Promise<GlobalResult<Group[]>> {
  return instance.get("/group")
}

export function join(id: number, remark: string): Promise<any> {
  return instance.post(`/group/${id}/join`, {
    remark
  })
}

export function del(id: number): Promise<any> {
  return instance.delete(`/group/${id}`)
}

export function leave(id: number): Promise<any> {
  return instance.delete(`/group/${id}/leave`)
}

interface PendingQuery {
  size: number;
  beforeLastTime?: number;
}

export function pending(query: PendingQuery): Promise<GlobalResult<PagedList<GroupApply>>> {
  return instance.get('/group/apply/pending', { params: query })
}

export function approval(id: number, status: 'pass' | 'reject' | 'ignore'): Promise<any> {
  return instance.put(`/group/approval/${id}/${status}`)
}

interface SearchRequest extends BasePagedRequest {
  search: string;
}

export function search(search: SearchRequest, cancelToken?: CancelToken): Promise<GlobalResult<PagedList<Group>>> {
  return instance.get('/group/search', { params: search, cancelToken })
}
interface BasePagedRequest {
  page: number;
  size: number;
}

export function getMembers(groupId: number, query: BasePagedRequest): Promise<GlobalResult<PagedList<UserInfo>>> {
  return instance.get(`/group/${groupId}`, { params: query })
}
