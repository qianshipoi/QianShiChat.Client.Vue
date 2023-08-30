
import * as dayjs from 'dayjs'
import * as isToday from 'dayjs/plugin/isToday'
dayjs.extend(isToday);

export const timeFormat = (time?: number) => {
  if (!time) {
    return '';
  }
  const date = dayjs(time);
  const isToday = date.isToday()

  if (isToday) {
    return `${date.hour()}:${date.minute()}`
  } else if (isLessThenOneWeek(date)) {
    return date.format("dddd")
  } else {
    return date.format("YYYY/MM/DD")
  }
}


export const isLessThenOneWeek = (date: dayjs.Dayjs): boolean => {
  const aWeekAge = dayjs(new Date()).subtract(1, "week")
  return aWeekAge.get("second") < date.get("second")
}
