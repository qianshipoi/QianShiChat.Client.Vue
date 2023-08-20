import { GlobalResult, UserInfo } from "../types/Types.ts";
import instance from "./index.ts";
import md5 from 'js-md5'

export const login = (account: string, password: string): Promise<GlobalResult<UserInfo>> => {
  return instance.post('/auth', {
    account,
    password: md5(password)
  })
}
