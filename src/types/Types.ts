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

export enum SessionType {
  Personal,
  Group
}

interface Session {
  id: number,
  type: SessionType,
  unreadCount: number,
  avatar: string,
  name: string,
  lastMessageTime: number,
  lastContent?: string
}

export type { GlobalResult, UserInfo, Session }
