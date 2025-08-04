export function convertTimeTo24HourFormat(time: string): string {
  let hour = parseInt(time.split(':')[0]);
  const minute = time.split(':')[1].split(' ')[0];
  const isPM = time.split(' ')[1] === 'PM';

  if (isPM && hour !== 12) {
    hour += 12;
  } else if (!isPM && hour === 12) {
    hour = 0;
  }

  // Add leading zero if hour is less than 10
  if (hour < 10) {
    return `0${hour}:${minute}`;
  }

  return `${hour}:${minute}`;
}