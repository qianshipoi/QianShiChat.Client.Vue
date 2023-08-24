export type GlobalResult<T> = {
  statusCode: number
  data?: T
  succeeded: boolean,
  errors?: object,
  timestamp: number
}

export type PagedList<T> = {
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

export enum ChatMessageStatus {
  sending,
  succeeded,
  failed
}

export interface ChatMessage {
  id: number
  fromId: number
  toId: number
  sessionId: string
  sendType: ChatMessageSendType
  messageType: ChatMessageType
  content: string | Attachment
  createTime: number
  fromUser?: UserInfo
  status: ChatMessageStatus
}

export interface UserInfo {
  id: number
  account: string
  nickName?: string
  avatar: string
  createTime: number
}

export interface Session {
  id: string,
  toId: number,
  type: ChatMessageSendType,
  unreadCount: number,
  avatar: string,
  name: string,
  lastMessageTime: number,
  lastContent?: string,
  from: Group | UserInfo
}

export interface Group {

}

export interface Attachment {
  id: number,
  name: string,
  rawPath: string,
  previewPath?: string,
  hash: string,
  contentType: string,
  size: number,
  progress?: number
}

export interface PrivateChatMessageRequest {
  toId: number
  message: string
  sendType: ChatMessageSendType
}

export interface SendFileMessageRequest {
  toId: number
  attachmentId: number
  sendType: ChatMessageSendType
}
