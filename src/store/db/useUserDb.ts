import { UserInfo } from "../../types/Types";
import globalDb from "./globalDb";

export const useUserDb = () => {
  return {
    addOrUpdate: (user: UserInfo) => {
      return globalDb.users.put({
        id: user.id,
        account: user.account,
        nickName: user.nickName,
        avatar: user.avatar,
        createTime: user.createTime,
      }, user.id);
    },
    del: (userId: number) => {
      return globalDb.users.delete(userId);
    },
    getAll: async () => {
      return await globalDb.users.toArray();
    },
    getById: async (userId: number) => {
      return await globalDb.users.get(userId);
    }
  };
}
