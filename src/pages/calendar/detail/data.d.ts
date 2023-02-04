import { CalendarEventTypeEnum } from './service';

export interface CalendarEventItem {
  name: string;
  type: CalendarEventTypeEnum;
  id: number;
  isAllDay: false;
  startDate: number;
  endDate: number;
  calendarId: number;
  description?: string;
}

export interface CalendarEventListData {
  success: boolean;
  total: number;
  data: CalendarEventItem[];
}

export interface QueryCalendarEventParams {
  calendarIds: number[];
  startDate: number;
  endDate: number;
  view: CalendarEventTypeEnum;
}

export interface AddCalendarEventParams {
  name: string;
  description: string;
  isAllDay: boolean;
  startDate: number;
  endDate: number;
  calendarId: number;
}

export interface UpdateCalendarEventParams extends Partial<AddCalendarEventParams> {
  id: number;
}
