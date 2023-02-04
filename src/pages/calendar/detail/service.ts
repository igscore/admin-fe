import { message } from 'antd';
import request from '@/utils/request';
import {
  AddCalendarEventParams,
  UpdateCalendarEventParams,
  QueryCalendarEventParams,
  CalendarEventListData,
} from './data';

export enum CalendarEventTypeEnum {
  DAY_VIEW = 1,
  WEEK_VIEW = 2,
  MONTH_VIEW = 3,
}

export async function queryCalendarEventList({ calendarIds, ...params }: QueryCalendarEventParams) {
  let resData: CalendarEventListData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<any>(
    '/calendar/events/filter',
    {
      calendarIds: calendarIds.join(','),
      ...params,
    },
    {
      putRequestHumpToLine: true,
      putResponseLineToHump: true,
    },
  );
  if (Array.isArray(data.entries)) {
    const { entries, total } = data;
    resData = {
      total,
      success: true,
      data: entries,
    };
  }
  return resData;
}

export async function askToAddCalendarEvent(params: AddCalendarEventParams) {
  try {
    await request.post('/calendar/event', params, { putRequestHumpToLine: true });
    return true;
  } catch (e) {
    message.error(e?.message || '添加日程失败，请稍后再试');
    return false;
  }
}

export async function askToUpdateCalendarEvent(params: UpdateCalendarEventParams) {
  try {
    await request.put('/calendar/event', params);
    return true;
  } catch (e) {
    message.error(e?.message || '更新日程失败，请稍后再试');
    return false;
  }
}

export async function askToDeleteCalendarEvent(id: number) {
  try {
    await request.delete('/calendar/event', { event_id: id });
    message.success('删除成功');
    return true;
  } catch (e) {
    message.error(e?.message || '删除日程失败，请稍后再试');
    return false;
  }
}
