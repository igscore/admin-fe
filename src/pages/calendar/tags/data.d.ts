export interface CalendarTagItem {
  id: number;
  name: string;
}

export interface CalendarTagsData {
  success: boolean;
  total: number;
  data: CalendarTagItem[];
}
