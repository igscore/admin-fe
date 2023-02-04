import { CalendarTagItem } from '@/pages/calendar/tags/data';

export interface CalendarItem {
  id: number;
  name: string;
  color: string;
  description: string;
  tags: CalendarTagItem[];
}

export interface CalendarListData {
  success: boolean;
  total: number;
  data: CalendarItem[];
}

export interface AddCalendarParams {
  name: string;
  description: string;
  color?: string;
}

export interface UpdateCalendarParams {
  id: number;
  name?: string;
  description?: string;
  color?: string;
}

export interface HandleCalendarTagsParams {
  calendarId: number;
  add?: Array<{ tagId: number }>;
  del?: Array<{ tagId: number }>;
}
