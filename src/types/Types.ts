import { ApplyStatus, ChatMessageSendType, ChatMessageStatus, ChatMessageType, NotificationType, TransmissionStatus } from "./Enums"

export * from "./Enums"

export type GlobalResult<T> = {
  statusCode: number
  data?: T
  succeeded: boolean,
  errors: object | null | string,
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

export type Avatar = {
  id: number
  path: string
  size: number
  createTime: number
}


export interface ChatMessage {
  id: number;
  fromId: number;
  toId: number;
  roomId: string;
  sendType: ChatMessageSendType;
  messageType: ChatMessageType;
  content: string | Attachment;
  createTime: number;
  fromUser?: UserInfo;
  status: ChatMessageStatus;
  attachments: Attachment[];
}


export interface NotificationMessage {
  type: NotificationType;
  message: FriendApply | GroupApply | FileOnlineTransmission | string | number;
}

export interface FileOnlineTransmission {
  id: string;
  fromId: number;
  toId: number;
  fileInfo: FileBaseInfo;
  status: TransmissionStatus;
  ClientType?: string
}


export interface FileBaseInfo {
  name: string;
  contentType: string;
  size: number;
}

export interface UserInfo {
  id: number;
  account: string;
  nickName?: string | undefined;
  avatar: string;
  createTime: number;
  description?: string;
  isOnline?: boolean | undefined;
  alias?: string | undefined;
}

export interface FriendApply {
  id: number;
  userId: number;
  friendId: number;
  createTime: number;
  remark?: string;
  status: ApplyStatus;
  user?: UserInfo;
  friend: UserInfo;
}

export interface GroupApply {
  id: number;
  userId: number;
  groupId: number;
  createTime: number;
  remark?: string;
  status: ApplyStatus;
  user?: UserInfo;
  group: Group;
}

export interface Room {
  id: string,
  toId: number,
  type: ChatMessageSendType,
  unreadCount: number,
  avatar: string,
  name: string,
  lastMessageTime: number,
  lastMessageContent?: string | Attachment,
  fromUser?: UserInfo,
  toObject?: Group | UserInfo,
}

export interface Group {
  id: number;
  userId: number;
  name: string;
  avatar: string;
  totalUser: number;
  createTime: number;
  users?: UserInfo[]
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
