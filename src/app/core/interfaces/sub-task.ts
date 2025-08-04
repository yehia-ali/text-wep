export interface SubTask {
  assigneeImageUrls: string[];
  depthLevel: number,
  endDate: string,
  haveSubTasks: boolean,
  id: number,
  isRepeated: boolean,
  isSubTasks: boolean,
  parentTaskGroupId: number,
  priority: number,
  projectTitle: string,
  startDate: string,
  taskGroupStateType: number,
  taskRepeatedPeriod: number,
  title: string,
  margin: string,
  expand: boolean,
  disabled: boolean
}
