
export function monthFormat(date: Date | string | null) {
  if (!date) {
    return null;
  }
    const dateObj = date instanceof Date ? date : new Date(date);
  if (isNaN(dateObj.getTime())) {
    return null;
  }
  
  return dateObj.getMonth() + 1;
}
