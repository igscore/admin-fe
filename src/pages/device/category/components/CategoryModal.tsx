import React, { useCallback, useEffect } from 'react';
import { Form, Input, Modal } from 'antd';
import type { FormItemProps } from 'antd/lib/form';

import { askToAddDeviceGroup, askToUpdateDeviceGroup } from '../service';
import type { DeviceGroupItem } from '../data';

const FormItem = Form.Item;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

interface Props {
  visible: boolean;
  data?: DeviceGroupItem;
  onOk: (data?: DeviceGroupItem) => void;
  onCancel: () => void;
}

const CategoryModal: React.FC<Props> = (props) => {
  const { visible, data, onOk, onCancel } = props;
  const [form] = Form.useForm();

  const onConfirm = useCallback(async () => {
    const values = await form.validateFields();
    let success: boolean;
    // 编辑
    if (data) {
      success = await askToUpdateDeviceGroup({
        id: data.id,
        name: values.name,
      });
    } else {
      // 创建
      success = await askToAddDeviceGroup({
        name: values.name,
      });
    }
    if (success) {
      onOk();
    }
  }, [data, form, onOk]);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({
          name: data.name,
        });
      }
    } else {
      form.resetFields();
    }
  }, [data, form, visible]);

  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '创建'}分组`}
      onOk={() => onConfirm()}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form form={form}>
        <FormItem
          label="分组名称"
          name="name"
          rules={[{ required: true, message: '请填写流程分组名称' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请填写流程分组名称" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
