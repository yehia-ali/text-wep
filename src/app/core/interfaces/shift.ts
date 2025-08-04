export interface Shift {
  id: number,
  shiftName: string,
  checkIn: string,
  checkOut: string,
  allowanceInMinutes: number,
  requiredWorkingHoursMonthly: number,
  requiredWorkingHoursDaily: number,
  weekEnds: string,
  isDefault: boolean
}
