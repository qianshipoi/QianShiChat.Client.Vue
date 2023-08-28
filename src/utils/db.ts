import Dexie, { Table } from "dexie";
import { UserInfo } from "../types/Types";

export class ChatDatabase extends Dexie {
  friends!: Table<UserInfo>

  constructor(account: number) {
    super("chat_database_" + account)
    this.version(1).stores({
      friends: "id, account, nickName, avatar, createTime"
    })
  }
}

