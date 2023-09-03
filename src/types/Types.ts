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
  Sending,
  Succeeded,
  Failed
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

export enum NotificationType {
  /// <summary>
  /// 好友上线
  /// </summary>
  FriendOnline,
  /// <summary>
  /// 好友下线
  /// </summary>
  FriendOffline,
  /// <summary>
  /// 好友申请
  /// </summary>
  FriendApply,
  /// <summary>
  /// 新好友
  /// </summary>
  NewFriend,
  /**
   * 强制注销
   */
  Signed
}

export interface NotificationMessage {
  type: NotificationType;
  message: FriendApply | string | number;
}

export interface UserInfo {
  id: number;
  account: string;
  nickName?: string | undefined;
  avatar: string;
  createTime: number;
  isOnline?: boolean | undefined;
}

export enum ApplyStatus {
  Applied = 1,
  Passed,
  Rejected,
  Ignored
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

export interface Session {
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
  from: Group | UserInfo
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
