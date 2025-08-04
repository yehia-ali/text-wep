export interface Chat {
  createdAt: {
    seconds: number,
    nanoseconds: number
  },
  creatorId: string,
  id: string,
  lastMessage: {
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
    timeStamp: {
      nanoseconds: number,
      seconds: number,
    }
  },
  date: any
  dateType: string
  membersIds: [string],
  name: string,
  subType: string,
  type: string,
  picture: string,
  members: [ChatUser]
}

export interface ChatUser {
  avatar: string,
  company: string,
  companyId: string,
  department: string,
  departmentId: string,
  id: string,
  name: string,
}