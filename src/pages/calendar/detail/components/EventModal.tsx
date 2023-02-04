import React, { useCallback, useEffect, useState } from 'react';
import { DatePicker, Form, Input, Modal, Radio, Select } from 'antd';
import moment, { Moment } from 'moment';
import { FormItemProps } from 'antd/lib/form';

import { CalendarItem } from '@/pages/calendar/list/data';

import { askToAddCalendarEvent, askToUpdateCalendarEvent } from '../service';
import { CalendarEventItem } from '../data';

const FormItem = Form.Item;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

interface Props {
  visible: boolean;
  data?: CalendarEventItem;
  calendars: CalendarItem[];
  currentTime: Moment;
  currentMode: string | null;
  currentCalendar: CalendarItem;
  onOk: (isNew: boolean) => void;
  onCancel: () => void;
}

const RadioOptions = [
  { label: '是', value: true },
  { label: '否', value: false },
];

const EventModal: React.FC<Props> = (props) => {
  const { visible, data, calendars, currentTime, currentMode, currentCalendar, onOk, onCancel } = props;
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [showTime, handleShowTime] = useState<boolean>(true);
  const [form] = Form.useForm();

  const onValuesChange = useCallback((changedValue: any) => {
    if ({}.hasOwnProperty.call(changedValue, 'isAllDay')) {
      handleShowTime(!changedValue.isAllDay);
      const { startDate, endDate } = form.getFieldsValue();
      if (changedValue.isAllDay) {
        if (startDate) {
          form.setFieldsValue({ startDate: (startDate as Moment).startOf('day') });
        }
        if (endDate) {
          form.setFieldsValue({ endDate: (endDate as Moment).endOf('day') });
        }
      }
    }
  }, []);

  const onConfirm = useCallback(async () => {
    handleLoading(true);
    try {
      const values = await form.validateFields();
      const params = {
        calendarId: values.calendar,
        name: values.name,
        isAllDay: !!values.isAllDay,
        startDate: values.isAllDay
          ? (values.startDate as Moment).startOf('day').valueOf()
          : (values.startDate as Moment).valueOf(),
        endDate: values.isAllDay
          ? (values.endDate as Moment).endOf('day').valueOf()
          : (values.endDate as Moment).valueOf(),
        description: values.description,
      };
      let success: boolean;
      // 编辑
      if (data) {
        success = await askToUpdateCalendarEvent({
          id: data.id,
          ...params,
        });
      } else {
        // 创建
        success = await askToAddCalendarEvent(params);
      }
      handleLoading(false);
      if (success) {
        onOk(!data);
      }
    } catch (e) {
      handleLoading(false);
    }
  }, [data]);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({
          calendar: data.calendarId,
          name: data.name,
          isAllDay: data.isAllDay,
          startDate: moment(data.startDate),
          endDate: moment(data.endDate),
          description: data.description,
        });
        handleShowTime(!data.isAllDay);
      } else {
        const isAllDay = currentMode === 'year';
        const startDate = isAllDay
          ? currentTime.startOf('month').clone()
          : currentTime.startOf('day').add(8, 'hours').clone();
        const endDate = isAllDay
          ? currentTime.startOf('month').add(1, 'days')
          : currentTime.startOf('day').add(10, 'hours');
        form.setFieldsValue({
          calendar: currentCalendar.id,
          isAllDay,
          startDate,
          endDate,
        });
        handleShowTime(!isAllDay);
      }
    } else {
      form.resetFields();
    }
  }, [visible]);

  return (
    <Modal
      title={data ? '修改日历' : '新建日历'}
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={onConfirm}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form form={form} onValuesChange={onValuesChange}>
        <FormItem label="所属日历" name="calendar" {...FormItemLayout}>
          <Select disabled={!!data}>
            {calendars.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label="日程名称"
          name="name"
          rules={[{ required: true, message: '请输入日程名称' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请输入日程名称" />
        </FormItem>
        <FormItem label="全天" name="isAllDay" {...FormItemLayout}>
          <Radio.Group optionType="button" options={RadioOptions} buttonStyle="solid" />
        </FormItem>
        <FormItem
          label="开始时间"
          name="startDate"
          rules={[{ required: true, message: '请输入开始时间' }]}
          {...FormItemLayout}
        >
          <DatePicker showTime={showTime} style={{ width: '100%' }} />
        </FormItem>
        <FormItem
          label="结束时间"
          name="endDate"
          rules={[{ required: true, message: '请输入结束时间' }]}
          {...FormItemLayout}
        >
          <DatePicker showTime={showTime} style={{ width: '100%' }} />
        </FormItem>
        <FormItem label="详细信息" name="description" {...FormItemLayout}>
          <Input.TextArea placeholder="请输入描述信息" rows={3} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default EventModal;
