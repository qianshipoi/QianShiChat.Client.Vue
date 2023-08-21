import { GlobalResult, UserInfo } from "../types/Types.ts";
import instance from "./index.ts";

export function getFriends(): Promise<GlobalResult<UserInfo[]>> {
  return instance.get('/friend')
}
