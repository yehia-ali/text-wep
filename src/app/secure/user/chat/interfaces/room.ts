export interface Room {
  id: string,
  isDeleted: boolean,
  isForward: boolean,
  isReply: boolean,
  messageStatus: string,
  messageType: string,
  senderAvatar: string,
  senderId: string,
  senderName: string,
  text: string,
  displayName?: string,
  url?: string,
  date?: any,
  isToday?: boolean,
  timeStamp: {
    nanoseconds: number,
    seconds: number
  }
  message?: Room
}
