import { GlobalResult, UserInfo } from "../types/Types";
import instance from "./index";

export function getFriends(): Promise<GlobalResult<UserInfo[]>> {
  return instance.get('/friend')
}
