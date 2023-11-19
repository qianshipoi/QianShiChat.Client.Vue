import { ApplyStatus, FriendApply, FriendGroup, FriendInfo, GlobalResult, PagedList } from "../types/Types";
import instance from "./index";

export function getFriends(): Promise<GlobalResult<FriendInfo[]>> {
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

export function approval(id: number, status: ApplyStatus): Promise<GlobalResult<any>> {
  return instance.put(`/FriendApply/${id}/Approval/${status}`)
}

export function setAlias(id: number, alias: string): Promise<GlobalResult<any>> {
  return instance.put(`/Friend/${id}/Alias`, { alias })
}

export function getFriendGroups(): Promise<GlobalResult<FriendGroup[]>> {
  return instance.get('/friend/groups')
}

export function addGroup(name: string): Promise<GlobalResult<FriendGroup>> {
  return instance.post('/friend/groups', { name })
}

export function renameGroup(id: number, name: string): Promise<GlobalResult<FriendGroup>> {
  return instance.put(`/friend/groups/${id}/rename`, { name })
}

export function removeGroup(id: number): Promise<GlobalResult<any>> {
  return instance.delete(`/friend/groups/${id}`)
}

export function sortGroup(ids: number[]): Promise<GlobalResult<any>> {
  return instance.put(`/friend/groups/sort`, {
    state: ids
  })
}

export function moveFriendToGroup(friendId: number, groupId: number): Promise<GlobalResult<any>> {
  return instance.put(`/friend/${friendId}/move`, { groupId })
}
