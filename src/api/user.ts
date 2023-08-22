import { GlobalResult, UserInfo } from "../types/Types.ts";
import instance from "./index.ts";

export function getUserById(id: number): Promise<GlobalResult<UserInfo>> {
  return instance.get(`/user/${id}`);
}
