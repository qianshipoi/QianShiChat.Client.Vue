
export enum ChatMessageSendType {
  Personal = 1,
  Group
}


export enum ChatMessageType {
  Text = 1,
  Image = 2,
  Video = 3,
  Audio = 4,
  OtherFile = 127
}

export enum ChatMessageStatus {
  Sending,
  Succeeded,
  Failed
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
  /// <summary>
  /// 进群申请
  /// </summary>
  GroupApply,
  /// <summary>
  /// 新群
  /// </summary>
  NewGroup,
  /**
   * 强制注销
   */
  Signed,
  /// <summary>
  /// 询问在线文件传输
  /// </summary>
  OnlineTransmissionConfirm,
  /// <summary>
  /// 确认在线传呼文件
  /// </summary>
  OnlineTransmissionPassed,
  /// <summary>
  /// 取消在线传呼文件
  /// </summary>
  OnlineTransmissionCancel,
}


export enum TransmissionStatus {
  Confirm,
  Passed,
  Reject,
  Cancel,
  Transmitting,
}

export enum ApplyStatus {
  Applied = 1,
  Passed,
  Rejected,
  Ignored
}

