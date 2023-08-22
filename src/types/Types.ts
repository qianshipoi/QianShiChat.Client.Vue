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
  Personal = 1,
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
  sessionId: string
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

interface Session {
  id: string,
  toId: number,
  type: ChatMessageSendType,
  unreadCount: number,
  avatar: string,
  name: string,
  lastMessageTime: number,
  lastContent?: string
}


interface PrivateChatMessageRequest {
  toId: number
  message: string
  sendType: ChatMessageSendType
}

interface SendFileMessageRequest {
  toId: number
  attachmentId: number
  sendType: ChatMessageSendType
}


export type {
  GlobalResult,
  UserInfo,
  Session,
  ChatMessage,
  PagedList,
  PrivateChatMessageRequest,
  SendFileMessageRequest
}
