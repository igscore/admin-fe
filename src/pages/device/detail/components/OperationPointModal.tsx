import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Modal } from 'antd';
import type { FormItemProps } from 'antd/lib/form';

import { askToAddOperationPoint, askToUpdateOperationPoint } from '../service';
import type { OperationPointItem } from '../data';

const FormItem = Form.Item;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 16 },
};

interface Props {
  visible: boolean;
  data?: Partial<OperationPointItem> & { devId: string };
  onOk: (data?: OperationPointItem) => void;
  onCancel: () => void;
}

const OperationPointModal: React.FC<Props> = (props) => {
  const { visible, data, onOk, onCancel } = props;
  const [loading, handleLoading] = useState<boolean>(false);
  const [form] = Form.useForm();

  const onConfirm = useCallback(async () => {
    const values = await form.validateFields();

    handleLoading(true);

    // 编辑
    if (data) {
      const success = data?.id
        ? await askToUpdateOperationPoint({
            devId: data.devId,
            id: data.id,
            address: values.address,
          })
        : await askToAddOperationPoint({
            devId: data.devId,
            address: values.address,
          });

      if (success) {
        onOk();
      }
    }

    handleLoading(false);
  }, [data, form, onOk]);

  useEffect(() => {
    if (visible) {
      if (data) {
        form.setFieldsValue({
          address: data.address,
        });
      }
    } else {
      form.resetFields();
    }
  }, [data, form, visible]);

  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '创建'}作业点`}
      confirmLoading={loading}
      onOk={onConfirm}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form form={form}>
        <FormItem
          label="作业点位置"
          name="address"
          rules={[{ required: true, message: '请填写作业点位置' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请填写作业点位置" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default OperationPointModal;
