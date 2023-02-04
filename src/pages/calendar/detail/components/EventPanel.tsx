import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import moment, { Moment } from 'moment';
import { Alert, Button, Collapse, Descriptions, Empty, Modal, Space, Spin, Typography } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

import { CalendarItem } from '@/pages/calendar/list/data';

import Flex from '@/components/Flex';
import EventModal from './EventModal';
import { askToDeleteCalendarEvent, CalendarEventTypeEnum, queryCalendarEventList } from '../service';
import { CalendarEventItem, QueryCalendarEventParams } from '../data';

import styles from '../styles.less';

const { Text } = Typography;

interface Props {
  calendars: CalendarItem[];
  currentTime: Moment;
  currentMode: string | null;
  currentCalendar: CalendarItem;
  reload: () => void;
}

const EventDescMaps = [
  { key: 'description', label: '描述' },
  { key: 'startDate', label: '开始时间' },
  { key: 'endDate', label: '结束时间' },
];

const getContent = (event: CalendarEventItem, key: string) => {
  if (key === 'startDate' || key === 'endDate') {
    const format = event.isAllDay ? 'MM[月]DD[日] [星期]dd' : 'MM[月]DD[日] [星期]dd ahh:mm';
    return moment(event[key]).format(format);
  }
  return event[key];
};

const EventPanel: React.FC<Props> = ({ calendars, currentTime, currentMode, currentCalendar, reload }) => {
  const [currentEvent, handleCurrentEvent] = useState<CalendarEventItem>();
  const [eventList, handleEventList] = useState<CalendarEventItem[][]>([]);
  const [loading, handleLoading] = useState<boolean>(true);
  const [visible, handleVisible] = useState<boolean>(false);

  const lastMode = useRef<string | null>(currentMode);

  const formatValue = useMemo(() => (currentMode === 'year' ? 'YYYY[年]MM[月]' : 'YYYY[年]MM[月]DD[日] [星期]dd'), [
    currentMode,
  ]);
  const currentDay = useMemo(() => (moment.isMoment(currentTime) ? currentTime.format(formatValue) : ''), [
    currentTime,
    formatValue,
  ]);

  const initFetch = useCallback(() => {
    // 切换 月/年不会出发 日期点击，切换月份会触发日期点击，在此判断去重，保证切换时只调用1次
    if (
      calendars.length &&
      (!currentMode || currentMode === 'year' || (lastMode.current === 'year' && currentMode === 'month'))
    ) {
      handleLoading(true);
      const queryEvents = async (params: QueryCalendarEventParams) => {
        const { data } = await queryCalendarEventList(params);
        handleEventList([data.filter(({ isAllDay }) => isAllDay), data.filter(({ isAllDay }) => !isAllDay)]);
        handleLoading(false);
      };
      const unitOfTime = currentMode === 'year' ? 'month' : 'day';
      queryEvents({
        calendarIds: calendars.map(({ id }) => id),
        view: CalendarEventTypeEnum.DAY_VIEW,
        startDate: currentTime.startOf(unitOfTime).valueOf(),
        endDate: currentTime.endOf(unitOfTime).valueOf(),
      });
    }
    lastMode.current = currentMode;
  }, [calendars, currentTime, currentMode]);

  const onOptions = useCallback(
    (type: 'edit' | 'delete', item: CalendarEventItem, event: any) => {
      event.stopPropagation();
      if (type === 'edit') {
        handleCurrentEvent(item);
        handleVisible(true);
      } else {
        Modal.confirm({
          title: `确定删除「${item.name}」日程`,
          okText: '确定',
          cancelText: '取消',
          onOk: async () => {
            const success = await askToDeleteCalendarEvent(item.id);
            if (success) {
              initFetch();
              reload();
            }
          },
        });
      }
    },
    [initFetch],
  );

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  return (
    <>
      <Flex style={{ margin: '10px 0' }} direction="row" justify="flex-end">
        <Button
          type="primary"
          onClick={() => {
            handleCurrentEvent(undefined);
            handleVisible(true);
          }}
        >
          新增日程
        </Button>
      </Flex>
      {!!currentDay && <Alert message={`当前日期: ${currentDay}`} />}
      <div className={styles.eventPanel}>
        {loading ? (
          <Flex justify="center" aligns="center" style={{ width: '100%', height: 200 }}>
            <Spin />
          </Flex>
        ) : (
          eventList.map((list, index) => (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index}>
              <Text style={{ display: 'inline-block', lineHeight: '50px', fontSize: 16 }}>
                {index === 0 ? '全天日程' : '分时日程'}
              </Text>
              {list?.length ? (
                <Collapse bordered={false} defaultActiveKey={[list[0].id]}>
                  {list.map((event) => (
                    <Collapse.Panel
                      key={event.id}
                      header={<Text strong>{event.name}</Text>}
                      extra={
                        <Space size={3}>
                          <Button type="link" style={{ padding: '5px' }} onClick={(e) => onOptions('edit', event, e)}>
                            <EditOutlined />
                          </Button>
                          <Button
                            type="link"
                            style={{ padding: '5px' }}
                            danger
                            onClick={(e) => onOptions('delete', event, e)}
                          >
                            <DeleteOutlined />
                          </Button>
                        </Space>
                      }
                    >
                      <Descriptions style={{ paddingLeft: 24 }} column={1}>
                        {EventDescMaps.map(({ key, label }) => (
                          <Descriptions.Item key={key} label={label}>
                            {getContent(event, key)}
                          </Descriptions.Item>
                        ))}
                      </Descriptions>
                    </Collapse.Panel>
                  ))}
                </Collapse>
              ) : (
                <Empty
                  style={{ margin: 0, padding: '10px 0', background: '#fafafa' }}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
              )}
            </div>
          ))
        )}
      </div>
      <EventModal
        visible={visible}
        data={currentEvent}
        calendars={calendars}
        currentTime={currentTime}
        currentMode={currentMode}
        currentCalendar={currentCalendar}
        onOk={() => {
          handleVisible(false);
          initFetch();
          reload();
        }}
        onCancel={() => handleVisible(false)}
      />
    </>
  );
};

export default EventPanel;
