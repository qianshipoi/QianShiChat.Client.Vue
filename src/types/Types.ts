type GlobalResult<T> = {
  statusCode: number
  data?: T
  succeeded: boolean,
  errors?: object,
  timestamp: number
}

interface UserInfo {
  id: number
  account: string
  nickName?: string
  avatar: string
  createTime: number
}


export type { GlobalResult, UserInfo }
