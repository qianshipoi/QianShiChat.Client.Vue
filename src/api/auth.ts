import { GlobalResult, UserInfo } from "../types/Types";
import instance from "./index";
import md5 from 'js-md5'

export const login = (account: string, password: string): Promise<GlobalResult<UserInfo>> => {
  return instance.post('/auth', {
    account,
    password: md5(password)
  })
}
