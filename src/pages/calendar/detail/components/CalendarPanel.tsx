import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import { Badge, Calendar } from 'antd';

import { CalendarItem } from '@/pages/calendar/list/data';

import { CalendarEventTypeEnum, queryCalendarEventList } from '../service';
import { CalendarEventItem } from '../data';

import styles from '../styles.less';

interface Props {
  reloadTag: false | 0 | 1;
  calendars: CalendarItem[];
  onValueChange: (changedValue: Moment, mode: string | null) => void;
}

const CalendarPanel: React.FC<Props> = ({ reloadTag, calendars, onValueChange }) => {
  const [currentValue, handleValue] = useState<Moment>(moment());
  const [eventList, handleEventList] = useState<CalendarEventItem[]>([]);

  const currentMode = useRef<'year' | 'month'>('month');

  const calendarColorMap = useMemo(() => {
    return calendars.reduce((obj, { id, color }) => {
      // eslint-disable-next-line no-param-reassign
      obj[id] = color;
      return obj;
    }, {});
  }, [calendars]);

  const queryEvents = useCallback(
    async (current: Moment = currentValue) => {
      if (calendars.length) {
        const { data } = await queryCalendarEventList({
          calendarIds: calendars.map(({ id }) => id),
          view: CalendarEventTypeEnum.MONTH_VIEW,
          startDate: current.startOf('month').valueOf(),
          endDate: current.endOf('month').valueOf(),
        });
        handleEventList(data);
      }
    },
    [calendars, currentValue],
  );

  const onSelect = useCallback((v) => {
    handleValue(v);
    onValueChange(v, currentMode.current === 'year' ? 'year' : null);
  }, []);

  const onPanelChange = useCallback(
    (current: Moment, mode) => {
      currentMode.current = mode;
      handleValue(current);
      queryEvents(current);
      onValueChange(current, mode);
    },
    [calendars],
  );

  const dateCellRender = useCallback(
    (value: Moment) => {
      const startDay = moment(value).startOf('day');
      const endDay = moment(value).endOf('day');
      return (
        <ul className={styles.events}>
          {eventList
            .filter((item) => {
              const currentDayIsBeforeEventStart = moment(endDay).isBefore(item.startDate, 'second');
              const eventEndIsBeforeCurrentDay = moment(item.endDate).isBefore(startDay, 'second');
              return !(currentDayIsBeforeEventStart || eventEndIsBeforeCurrentDay);
            })
            .map((item) => (
              <li key={item.id}>
                <Badge color={calendarColorMap[item.calendarId]} text={item.name} />
              </li>
            ))}
        </ul>
      );
    },
    [eventList, calendarColorMap],
  );

  // 通过 reloadTag 状态转变 刷新数据
  useEffect(() => {
    queryEvents();
  }, [reloadTag, calendars]);

  return (
    <Calendar value={currentValue} dateCellRender={dateCellRender} onSelect={onSelect} onPanelChange={onPanelChange} />
  );
};

export default CalendarPanel;
