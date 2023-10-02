import Dexie, { Table } from "dexie";
import { Group, Room, UserInfo } from "../types/Types";


export class ChatDatabase extends Dexie {
  friends!: Table<UserInfo>
  rooms!: Table<Room>
  groups!: Table<Group>

  constructor(account: number) {
    super("chat_database_" + account)
    this.version(4).stores({
      friends: "id, account, nickName, avatar, createTime",
      rooms: "id, toId, type, unreadCount, avatar, name, lastMessageTime, lastMessageContent",
      groups: "id, userId, name, avatar, totalUser, createTime",
    })
  }
}

export class GlobalDatabase extends Dexie {
  users!: Table<UserInfo>

  constructor() {
    super("global_database")
    this.version(1).stores({
      users: "id, account, nickName, avatar, createTime",
    })
  }
}

