export interface TeamReport {
  id: number,
  imageUrl: string
  jobTitle: string,
  name: string,
  performanceRate: number,
  averageRate: number,
  shiftWorkingHoursMonthly: number,
  workingHours: {
    actual: number
    required: number
  }
  actual: number,
  required: number,
  taskTotalCount: number
}
