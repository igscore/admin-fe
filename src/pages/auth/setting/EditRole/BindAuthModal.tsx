import React, { useEffect } from 'react';
import { Modal, Select, message, Form } from 'antd';

import { askToHandleAuthOfRole } from '../service';
import { MenuAuthInfo, MenuRoleInfo } from '../data';

interface Props {
  visible: boolean;
  data: MenuRoleInfo | undefined;
  list: MenuAuthInfo[];
  defaultValue: number[];

  onOk(): void;

  onClose(): void;
}

const BindAuthModal: React.FC<Props> = (props) => {
  const { visible, data, list, defaultValue } = props;
  const [form] = Form.useForm();

  const onOk = async () => {
    if (data) {
      const values = await form.validateFields();
      const auths = values?.auth || [];
      const addIds = auths.filter((id: number) => !defaultValue.includes(id));
      const delIds = defaultValue.filter((id) => !auths.includes(id));
      const success = await askToHandleAuthOfRole({
        roleId: data.id,
        add: addIds,
        del: delIds,
      });
      if (success) {
        props.onOk();
      } else {
        message.error('权限绑定失败，请稍后再试');
      }
    }
  };

  useEffect(() => {
    form.setFieldsValue({
      auth: defaultValue || [],
    });
  }, [data, defaultValue]);

  return (
    <Modal
      visible={visible}
      title={data ? `为角色「${data.name}」绑定权限` : ''}
      okText="绑定"
      cancelText="取消"
      onOk={onOk}
      onCancel={props.onClose}
      maskClosable={false}
      destroyOnClose
    >
      <Form form={form}>
        <Form.Item label="操作权限" name="auth">
          <Select<number[]>
            mode="multiple"
            style={{ width: '100%' }}
            placeholder="请选择要绑定的权限"
          >
            {list.map(({ id, name }) => (
              <Select.Option key={String(id)} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BindAuthModal;
