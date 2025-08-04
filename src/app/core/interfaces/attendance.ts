export interface Attendance {
  date: string,
  userAttendanceDetails: [
    { date: string, status: number }
  ]
}
