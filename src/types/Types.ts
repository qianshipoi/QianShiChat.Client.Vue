type GlobalResult<T> = {
  statusCode: number
  data?: T
  succeeded: boolean,
  errors?: object,
  timestamp: number
}

interface PagedList<T> {
  items: T[]
  total: number
  currentPage: number
  currentSize: number
  hasPrev: boolean
  hasNext: boolean
}

export enum ChatMessageSendType {
  Personal,
  Group
}

export enum ChatMessageType {
  Text = 1,
  Image,
  Video,
  OtherFile
}

type ChatMessage = {
  id: number
  fromId: number
  toId: number
  sendType: ChatMessageSendType
  messageType: ChatMessageType
  content: string
  createTime: number
  fromUser?: UserInfo
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

export type { GlobalResult, UserInfo, Session, ChatMessage, PagedList }
