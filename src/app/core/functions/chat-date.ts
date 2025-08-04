import {Chat} from "../../secure/user/chat/interfaces/chat";

export function ChatDate(chat: Chat) {
  let newDate = new Date();
  let date = new Date(chat.lastMessage.timeStamp.seconds * 1000)
  let day = date.getDate();
  let year = date.getFullYear();
  let month = date.getMonth();
  let isYesterday = year == newDate.getFullYear() && month == newDate.getMonth() && newDate.getDate() == day + 1;
  if (isYesterday) {
    chat.dateType = 'yesterday';
  } else if (year == newDate.getFullYear() && month == newDate.getMonth() && newDate.getDate() == day) {
    chat.dateType = 'today';
  } else {
    chat.dateType = 'unknown';
  }
  chat.date = date;
}
