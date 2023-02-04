import React, { useCallback, useEffect, useState } from 'react';
import moment, { Moment } from 'moment';
import { Link } from 'umi';
import { Col, Empty, Row, Spin } from 'antd';

import { queryCalendarList } from '@/pages/calendar/list/service';
import { CalendarItem } from '@/pages/calendar/list/data';

import Flex from '@/components/Flex';
import ListPanel from './components/ListPanel';
import CalendarPanel from './components/CalendarPanel';
import EventPanel from './components/EventPanel';

const CalendarPage: React.FunctionComponent = () => {
  const [selectedCalendars, handleSelectedCalendars] = useState<CalendarItem[]>([]);
  const [currentCalendar, handleCurrentCalendar] = useState<CalendarItem>();
  const [currentTime, handleCurrentTime] = useState<Moment>(moment(Date.now()));
  const [currentMode, handleCurrentMode] = useState<string | null>(null);
  const [calendars, handleCalendars] = useState<CalendarItem[]>([]);
  const [reloadTag, handleReloadTag] = useState<false | 0 | 1>(false);

  const [loading, handleLoading] = useState<boolean>(true);

  const onCalendarChange = useCallback((value, mode) => {
    handleCurrentTime(value);
    handleCurrentMode(mode);
  }, []);

  useEffect(() => {
    const query = async () => {
      const { data } = await queryCalendarList();
      handleCalendars(data);
      handleSelectedCalendars(data);
      if (data.length) {
        handleCurrentCalendar(data[0]);
      }
      handleLoading(false);
    };
    query();
  }, []);

  return (
    <Row style={{ background: '#fff', padding: '0 10px' }} gutter={[16, 16]}>
      <Col span={4} style={{ borderRight: '1px solid #ccc' }}>
        {/* eslint-disable-next-line no-nested-ternary */}
        {loading ? (
          <Flex justify="center" aligns="center" style={{ width: '100%', height: 100 }}>
            <Spin />
          </Flex>
        ) : calendars.length ? (
          <ListPanel
            calendars={calendars}
            onSelect={handleCurrentCalendar}
            onValueChange={(ids) => {
              handleSelectedCalendars(calendars.filter(({ id }) => ids.includes(id)));
            }}
          />
        ) : (
              <Empty
                style={{ margin: 0, padding: '30px 0' }}
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <>
                    请先创建日历，<Link to="/calendar/list">去创建</Link>
                  </>
                }
              />
            )}
      </Col>
      <Col span={12}>
        <CalendarPanel reloadTag={reloadTag} calendars={selectedCalendars} onValueChange={onCalendarChange} />
      </Col>
      <Col span={8}>
        {!!currentCalendar && (
          <EventPanel
            calendars={selectedCalendars}
            currentTime={currentTime}
            currentMode={currentMode}
            currentCalendar={currentCalendar}
            reload={() => handleReloadTag((tag) => (tag ? 0 : 1))}
          />
        )}
      </Col>
    </Row>
  );
};

export default CalendarPage;
