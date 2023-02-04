import { message } from 'antd';
import request from '@/utils/request';
import { CalendarListData, UpdateCalendarParams, AddCalendarParams, HandleCalendarTagsParams } from './data';

export async function queryCalendarList() {
  let resData: CalendarListData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<any>('/calendar/calendars/tenant', {}, { putResponseLineToHump: true });
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

export async function askToAddCalendar(params: AddCalendarParams): Promise<{ id: number } | false> {
  try {
    return await request.post('/calendar/calendar', { color: 'color', ...params });
  } catch (e) {
    message.error(e?.message || '添加日历失败，请稍后再试');
    return false;
  }
}

export async function askToUpdateCalendar(params: UpdateCalendarParams) {
  try {
    await request.put('/calendar/calendar', params);
    return true;
  } catch (e) {
    message.error(e?.message || '修改日历失败，请稍后再试');
    return false;
  }
}

export async function askToDeleteCalendar(id: number) {
  try {
    await request.delete('/calendar/calendar', { calendar_id: id });
    message.success('删除成功');
    return true;
  } catch (e) {
    message.error(e?.message || '删除日历失败，请稍后再试');
    return false;
  }
}

export async function askToHandleCalendarTags({ calendarId, add = [], del = [] }: HandleCalendarTagsParams) {
  try {
    await request.post(
      '/calendar/calendar/tags',
      {
        calendarId,
        add,
        delete: del,
      },
      { putRequestHumpToLine: true },
    );
    return true;
  } catch (e) {
    message.error(e?.message || '修改日历标签失败，请稍后再试');
    return false;
  }
}
