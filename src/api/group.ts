import { GlobalResult, Group } from "../types/Types";
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
