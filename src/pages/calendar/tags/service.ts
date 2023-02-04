import { message } from 'antd';
import request from '@/utils/request';
import { CalendarTagsData } from './data';

export async function queryCalendarTagList() {
  let resData: CalendarTagsData = {
    success: false,
    total: 0,
    data: [],
  };
  const data = await request.get<any>('/calendar/tags');
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

export async function askToAddCalendarTag(name: string) {
  try {
    await request.post('/calendar/tag', { name });
    message.success('添加成功');
    return true;
  } catch (e) {
    message.error('添加日历标签失败，请稍后再试');
    return false;
  }
}

export async function askToDeleteCalendarTag(tagId: number) {
  try {
    await request.delete('/calendar/tag', { tagId }, { putRequestHumpToLine: true });
    message.success('删除成功');
    return true;
  } catch (e) {
    message.error('删除日历标签失败，请稍后再试');
    return false;
  }
}
