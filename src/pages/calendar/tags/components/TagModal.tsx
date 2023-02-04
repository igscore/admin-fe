import React, { useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import { FormItemProps } from 'antd/lib/form';

import { askToAddCalendarTag } from '../service';

const FormItem = Form.Item;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
};

interface Props {
  visible: boolean;
  onOk: () => void;
  onCancel: () => void;
}

const TagModal: React.FC<Props> = (props) => {
  const { visible, onOk, onCancel } = props;
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  useEffect(() => {
    return () => {
      form.resetFields();
    };
  }, [visible]);

  return (
    <Modal
      title="新增日历标签"
      visible={visible}
      confirmLoading={confirmLoading}
      onCancel={onCancel}
      destroyOnClose
      forceRender
      onOk={async () => {
        const values = await form.validateFields();
        handleLoading(false);
        const success = await askToAddCalendarTag(values.name);
        handleLoading(false);
        if (success) {
          onOk();
        }
      }}
    >
      <Form form={form}>
        <FormItem
          label="日历标签"
          name="name"
          rules={[{ required: true, message: '请输入日历标签' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请输入日历标签" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default TagModal;
