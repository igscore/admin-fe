import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { FormItemProps } from 'antd/es/form';

import { queryDeviceGroup } from '@/pages/device/category/service';
import type { DeviceGroupItem } from '@/pages/device/category/data';

import { askToAddDevice, askToUpdateDevice } from '../service';
import type { DeviceListItem } from '../data';

const FormItem = Form.Item;
const { Option } = Select;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

interface Props {
  visible: boolean;
  data?: DeviceListItem;
  onSubmit: (success: boolean) => void;
  onCancel: () => void;
}

const DeviceModal: React.FC<Props> = (props) => {
  const { visible, data, onSubmit, onCancel } = props;
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [groupList, handleGroupList] = useState<DeviceGroupItem[]>([]);
  const [form] = Form.useForm();

  const onOk = useCallback(async () => {
    if (confirmLoading) {
      return;
    }
    handleLoading(true);
    try {
      const values = await form.validateFields();
      let result: { success: boolean };
      if (data) {
        result = await askToUpdateDevice({
          id: data.id,
          ...values,
        });
      } else {
        result = await askToAddDevice({
          type: 1,
          ...values,
        });
      }
      handleLoading(false);
      onSubmit(result.success);
    } catch (e) {
      handleLoading(false);
    }
  }, [confirmLoading, data, form, onSubmit]);

  useEffect(() => {
    if (visible) {
      queryDeviceGroup().then(({ data: list }) => {
        handleGroupList(list);
      });
      if (data) {
        form.setFieldsValue({
          groupId: data.groupId,
          mac: data.mac,
          password: data.password,
          name: data.name,
          description: data.description,
        });
      }
    } else {
      form.resetFields();
    }
  }, [data, form, visible]);

  return (
    <Modal
      title={data ? '????????????' : '????????????'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
      forceRender
    >
      <Form form={form} name="editDevice">
        <FormItem
          label="????????????"
          name="groupId"
          rules={[{ required: true, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <Select placeholder="?????????????????????">
            {groupList.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem
          label="MAC??????"
          name="mac"
          rules={[{ required: !data, message: '?????????MAC??????' }]}
          {...FormItemLayout}
        >
          <Input placeholder="?????????MAC??????" />
        </FormItem>
        <FormItem
          label="????????????"
          name="password"
          rules={[{ required: !data, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <Input.Password placeholder="?????????????????????" />
        </FormItem>
        <FormItem
          label="????????????"
          name="name"
          rules={[{ required: !data, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <Input placeholder="?????????????????????" />
        </FormItem>
        <FormItem
          label="????????????"
          name="description"
          rules={[{ required: !data, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <Input placeholder="?????????????????????" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default DeviceModal;
