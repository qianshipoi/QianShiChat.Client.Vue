import { CancelToken } from "axios";
import { ApplyStatus, FriendApply, GlobalResult, PagedList, UserInfo } from "../types/Types";
import instance from "./index";

export function getUserById(id: number): Promise<GlobalResult<UserInfo>> {
  return instance.get(`/user/${id}`);
}

export function search(searchText: string, page: number, size: number = 5, cancelToken: CancelToken | undefined = undefined): Promise<GlobalResult<PagedList<UserInfo>>> {
  return instance.get(`/user/${page}/${size}`,
    {
      params: { nickName: searchText },
      cancelToken
    })
}

export function friendApply(id: number, remark: string): Promise<GlobalResult<FriendApply>> {
  return instance.post('/friendApply', { userId: id, remark })
}

export function friendApplyPending(size: number, beforeLastTime: number): Promise<GlobalResult<PagedList<FriendApply>>> {
  return instance.get('/friendApply/pending', { params: { size, beforeLastTime } })
}

export function friendApplyApproval(id: number, status: ApplyStatus): Promise<GlobalResult<string>> {
  return instance.put(`/FriendApply/${id}/Approval/${status}`)
}
