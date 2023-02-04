function formatTimeWithZero(time: number, split = '') {
  const t = time < 10 ? `0${time}` : time;
  return `${t}${split}`;
}

export function transferTimeTo(
  type: 'datetime',
  value: number,
  split?: string,
  dateToTime?: string,
  timeSplit?: string,
): string;
export function transferTimeTo(
  type: 'timestamp',
  value: string,
  split?: string,
  dateToTime?: string,
  timeSplit?: string,
): number;
export function transferTimeTo(
  type: 'timestamp' | 'datetime',
  value: string | number,
  split = '-',
  dateToTime = ' ',
  timeSplit = ':',
) {
  if (type === 'timestamp') {
    return new Date(value).getTime();
  }
  const date = new Date(value);
  const yy = date.getFullYear() + split;
  const mm = formatTimeWithZero(date.getMonth() + 1, split);
  const dd = formatTimeWithZero(date.getDate(), dateToTime);
  const hh = formatTimeWithZero(date.getHours(), timeSplit);
  const mmi = formatTimeWithZero(date.getMinutes(), timeSplit);
  const ss = formatTimeWithZero(date.getSeconds());
  return yy + mm + dd + hh + mmi + ss;
}
