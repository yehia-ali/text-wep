export interface TaskRequest {
  assigneeId: number,
  assigneeName: string,
  assigneeProfilePicture: string,
  creationDate: string,
  creatorId: number,
  creatorName: string,
  creatorProfilePicture: string,
  isOverDue: boolean,
  priority: number,
  taskGroupId: number,
  taskId: number,
  title: string
}
