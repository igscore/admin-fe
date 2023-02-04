/**
 * n代表天数,加号表示未来n天的此刻时间,减号表示过去n天的此刻时间
 */
function formatTimeWithZero(time: number, split = ''): string {
  const t = time < 10 ? `0${time}` : time
  return `${split}${t}`
}

/**
 * 获取传入的时间戳所在日期的零点时间戳
 * @param {number} timestamp
 * @return {number}
 */
export const getDateBeginTime = (timestamp: number): number => {
  return new Date(timestamp).setHours(0, 0, 0, 0);
}

/**
 * 时间&时间戳相互转换工具
 * @param type {String} 要转换的类型 timestamp：转换成时间戳；datetime：转换成时间日期
 * @param value {String or Number} 时间日期 or 时间戳
 * @param split {String} 日期分隔符
 * @returns {*}
 */
/* eslint-disable import/export */
type TransferType = 'timestamp' | 'datetime'
export interface TransferTimeOptions {
  split?: string
  format?: ('YY' | 'MM' | 'DD' | 'H' | 'M' | 'S')[]
}
export function transferTimeTo(type: 'timestamp', value: string): number;
export function transferTimeTo(type: 'datetime', value: number, options?: TransferTimeOptions): string;
export function transferTimeTo(
  type: TransferType,
  value: string | number,
  {split = '-', format}: TransferTimeOptions = {}
): number | string {
  if (type === 'timestamp') {
    return new Date(value).getTime()
  }
  const date = new Date(value);
  const time = {
    YY: date.getFullYear(),
    MM: formatTimeWithZero(date.getMonth() + 1, split),
    DD: formatTimeWithZero(date.getDate(), split),
    H: formatTimeWithZero(date.getHours(), ' '),
    M: formatTimeWithZero(date.getMinutes(), ':'),
    S: formatTimeWithZero(date.getSeconds(), ':'),
  }

  const result = Array.isArray(format) ? format : Object.keys(time)
  return result.reduce((t, k) => `${t}${time[k]}`, '')
}

export function splitTime(time: number): string[];
export function splitTime(time: string, split?: string): string[];
export function splitTime(time: string | number, split: string = '-'): string[] {
  const fatTime = typeof time === 'string' ? time : transferTimeTo('datetime', time)
  const dt = fatTime.split(' ')
  if (dt.length === 2) {
    const [year, month, day] = dt[0].split(split)
    const [hour, minute, second] = dt[1].split(':')
    return [year, month, day, hour, minute, second]
  }
  return []
}

/**
 * 格式化为相对时间
 * @param targetTime {number} 目标时间
 * @param split {string} 分隔符
 * @returns {string} 相对时间
 */
export function formatRelativeTime(targetTime: number, split: string = '-'): string | null {
  const nowTime = Date.now()
  const formatTime = transferTimeTo('datetime', targetTime, { split })
  const [, , , hour, minute] = splitTime(formatTime, split)
  // 开始时间所在当天的00:00:00时间
  const dayStart = new Date(targetTime).setHours(0, 0, 0, 0)
  const oneDay = 24 * 3600 * 1000

  // 当前时间早于目标零点时间一天 或 当前时间超过目标时间
  if (nowTime < dayStart - oneDay || nowTime >= targetTime) {
    return formatTime.slice(5, -3)
  }
  // 当前时间早于目标零点时间，表示明天
  if (nowTime >= dayStart - oneDay && nowTime < dayStart) {
    return `明天 ${hour}:${minute}`
  }
  // 当前时间晚于目标零点时间，表示已经处于【今天】
  if (nowTime >= dayStart) {
    return `今天 ${hour}:${minute}`
  }
  return null
}
