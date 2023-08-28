import { GlobalResult, UserInfo } from "../types/Types";
import instance from "./index";

export function getUserById(id: number): Promise<GlobalResult<UserInfo>> {
  return instance.get(`/user/${id}`);
}
