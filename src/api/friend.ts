import { ApplyStatus, FriendApply, GlobalResult, PagedList, UserInfo } from "../types/Types";
import instance from "./index";

export function getFriends(): Promise<GlobalResult<UserInfo[]>> {
  return instance.get('/friend')
}

export function getFriendApplies(size: number, beforeLastTime?: number): Promise<GlobalResult<PagedList<FriendApply>>> {
  return instance.get('/FriendApply/Pending', {
    params: {
      size,
      beforeLastTime
    }
  })
}

export function clearAllAppies(): Promise<any> {
  return instance.delete('/FriendApply/clear')
}

export function deleteApply(id: number): Promise<any> {
  return instance.delete(`/FriendApply/${id}`)
}

export function approval(id: number, status: ApplyStatus): Promise<any> {
  return instance.put(`/FriendApply/${id}/Approval/${status}`)
}
