import React, { useCallback, useEffect } from 'react';
import { Input, Modal, Form } from 'antd';
import { FormProps } from 'antd/es/form';

import { askToAddRole, askToUpdateRole } from '../service';
import { MenuRoleInfo } from '../data';

interface Props extends FormProps {
  visible: boolean;
  data?: MenuRoleInfo;

  onOk(): void;

  onClose(): void;
}

const FormItemLayout = {
  labelCol: { span: 5 },
  wrapperCol: { span: 14 },
};

const RoleModal: React.FC<Props> = (props) => {
  const { data, visible, onClose } = props;
  const [form] = Form.useForm();

  const onOk = useCallback(async () => {
    const values = await form.validateFields();
    const success = data
      ? await askToUpdateRole(data.id, values.name, values.description) // 编辑权限
      : await askToAddRole(values.name, values.description); // 新增权限
    if (success) {
      props.onOk();
    }
  }, [data]);

  useEffect(() => {
    form.setFieldsValue({
      name: data?.name || '',
      description: data?.description || '',
    });
  }, [data]);

  return (
    <Modal
      visible={visible}
      title={`${data ? '修改' : '新增'}角色`}
      okText={`${data ? '保存' : '添加'}`}
      cancelText="取消"
      onOk={onOk}
      onCancel={onClose}
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form} {...FormItemLayout}>
        <Form.Item
          label="角色名称"
          name="name"
          rules={[{ required: true, message: '请输入名称，最长40个字', max: 40 }]}
        >
          <Input placeholder="请输入角色名称" />
        </Form.Item>
        <Form.Item
          label="描述信息"
          name="description"
          rules={[{ required: true, message: '请输入描述信息' }]}
        >
          <Input placeholder="请输入描述信息" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default RoleModal;
