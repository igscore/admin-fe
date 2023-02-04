import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import { FormItemProps } from 'antd/lib/form';
import { green, presetPalettes } from '@ant-design/colors';

// import { queryCalendarTagList } from '@/pages/calendar/tags/service';
// import { CalendarTagItem } from '@/pages/calendar/tags/data';

import { askToAddCalendar, askToUpdateCalendar } from '../service';
import { CalendarItem } from '../data';

const FormItem = Form.Item;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

// const findHandleTags = (current: number[], calendar: CalendarItem) => {
//   const prevList = calendar.tags.map(({ id }) => Number(id));
//   const add = current.filter((id) => !prevList.includes(id)).map((id) => ({ tagId: id }));
//   const del = prevList.filter((id) => !current.includes(id)).map((id) => ({ tagId: id }));
//   return { add, del };
// };

interface Props {
  visible: boolean;
  data?: CalendarItem;
  onOk: (data?: CalendarItem) => void;
  onCancel: () => void;
}

const CalendarModal: React.FC<Props> = (props) => {
  const { visible, data, onOk, onCancel } = props;
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  // const [tagList, handleTags] = useState<CalendarTagItem[]>([]);
  const [form] = Form.useForm();

  const onConfirm = useCallback(async () => {
    handleLoading(true);
    try {
      const values = await form.validateFields();
      let success: any;
      // 编辑
      if (data) {
        success = await askToUpdateCalendar({
          id: data.id,
          name: values.name,
          color: values.color,
          description: values.description,
        });
        // const { add, del } = findHandleTags(values.tags || [], data);
        // if (add.length || del.length) {
        //   success = await askToHandleCalendarTags({
        //     calendarId: data.id,
        //     add,
        //     del,
        //   });
        // }
      } else {
        // 创建
        success = await askToAddCalendar({
          name: values.name,
          color: values.color,
          description: values.description,
        });
        // if (success) {
        //   askToHandleCalendarTags({
        //     calendarId: success.id,
        //     add: (values.tags || []).map((id: any) => ({ tagId: Number(id) })),
        //   }).then();
        // }
      }
      handleLoading(false);
      if (success) {
        onOk();
      }
    } catch (e) {
      handleLoading(false);
    }
  }, [data]);

  useEffect(() => {
    // const queryTags = async () => {
    //   const { data: tags } = await queryCalendarTagList();
    //   handleTags(tags);
    //   if (data) {
    //     form.setFieldsValue({
    //       tags: data.tags.map(({ id }) => Number(id)),
    //     });
    //   }
    // };

    if (visible) {
      // queryTags();
      if (data) {
        form.setFieldsValue({
          name: data.name,
          color: data.color,
          description: data.description,
        });
      } else {
        form.setFieldsValue({
          color: green.primary,
        });
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
      <Form form={form}>
        <FormItem label="名称" name="name" rules={[{ required: true, message: '请输入日历名称' }]} {...FormItemLayout}>
          <Input placeholder="请输入日历名称" />
        </FormItem>
        {/* <FormItem label="标签" name="tags" {...FormItemLayout}> */}
        {/*  <Select placeholder="请选择日历标签" mode="multiple" allowClear> */}
        {/*    {tagList.map(({ id, name }) => ( */}
        {/*      <Select.Option key={id} value={id}> */}
        {/*        {name} */}
        {/*      </Select.Option> */}
        {/*    ))} */}
        {/*  </Select> */}
        {/* </FormItem> */}
        <FormItem label="颜色" name="color" {...FormItemLayout}>
          <Select placeholder="请选择日历颜色">
            {Object.entries(presetPalettes).map(([color, list]) =>
              list.primary ? (
                <Select.Option key={color} value={list.primary}>
                  <div style={{ background: list.primary, color: 'transparent' }}>{color}</div>
                </Select.Option>
              ) : null,
            )}
          </Select>
        </FormItem>
        <FormItem
          label="描述"
          name="description"
          rules={[{ required: true, message: '请输入描述信息' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请输入描述信息" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CalendarModal;
