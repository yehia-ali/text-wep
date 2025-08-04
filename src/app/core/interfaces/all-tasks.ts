export interface AllTasks {
  assigneeDepartementName: string,
  assigneeId: number,
  assigneeName: string,
  assigneeProfilePicture: string,
  assigneeStatus: string,
  creatorId: number,
  creatorName: string,
  creatorProfilePicture: string,
  endDate: string,
  endedTaskRepeatedCounter: number,
  isOverDue: boolean,
  isRepeated: boolean,
  parentTaskGroupId: number,
  percentage: any
  priority: number,
  rate: any
  startDate: string,
  taskGroupId: number,
  taskId: number,
  taskRepeatedPeriod: number,
  taskStateDate: string,
  taskStateId: number,
  title: string,
  isSelected: boolean
}
