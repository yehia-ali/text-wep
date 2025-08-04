export interface UserAttendance {
  day: string,
  dayString: string,
  totalHours: {
    isEqual: boolean,
    time: string,
  },
  checkIn: {
    isLate: boolean,
    time: string,
  },
  checkOut: {
    isLate: boolean,
    time: string,
  },
  stauts: number,
  reason: string
}
