export function convertToUTC(date: any) {
  let utc = new Date().getTimezoneOffset() / 60;
  let selectedDate = new Date(date)
  return new Date(selectedDate.setHours(selectedDate.getHours() - utc));
}
