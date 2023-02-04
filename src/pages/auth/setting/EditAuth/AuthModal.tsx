import React, { useCallback, useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
import { FormProps } from 'antd/es/form';

import { askToAddAuth, askToUpdateAuth } from '../service';
import { MenuAuthInfo } from '../data';

interface Props extends FormProps {
  visible: boolean;
  data?: MenuAuthInfo;

  onOk(): void;

  onClose(): void;
}

const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const AuthModal: React.FC<Props> = (props) => {
  const { visible, data, onClose } = props;
  const [form] = Form.useForm();

  const onOk = useCallback(async () => {
    const values = await form.validateFields();
    const success = data
      ? await askToUpdateAuth(data.id, values.name) // 编辑权限
      : await askToAddAuth(values.name); // 新增权限
    if (success) {
      props.onOk();
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({
      name: data?.name || '',
    });
  }, [data]);

  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '新增'}权限`}
      okText={`${data ? '保存' : '添加'}`}
      cancelText="取消"
      onOk={onOk}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
      forceRender
    >
      <Form form={form}>
        <Form.Item
          label="权限名称"
          name="name"
          rules={[{ required: true, message: '请输入名称，最长40个字', max: 40 }]}
          {...FormItemLayout}
        >
          <Input placeholder="请输入权限名称" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AuthModal;
