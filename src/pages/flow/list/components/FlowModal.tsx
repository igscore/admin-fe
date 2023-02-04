import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Modal, Select } from 'antd';
import type { FormItemProps } from 'antd/lib/form';

import { queryFlowCategory } from '@/pages/flow/category/service';
import type { FlowCategoryItem } from '@/pages/flow/category/data';

import { askToUpdateFlowList } from '../service';
import type { FlowListItem } from '../data';

const FormItem = Form.Item;
const { Option } = Select;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

interface Props {
  visible: boolean;
  data?: FlowListItem;
  needAcl?: boolean;
  onSubmit: (success: boolean) => void;
  onCancel: () => void;
}

const FlowModal: React.FC<Props> = (props) => {
  const { visible, data, needAcl, onSubmit, onCancel } = props;
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [flowCategory, handleFlowCategory] = useState<FlowCategoryItem[]>([]);
  const [form] = Form.useForm();

  const onOk = useCallback(async () => {
    if (confirmLoading) {
      return;
    }
    handleLoading(true);
    const fieldsValue = await form.validateFields();
    // 修改操作会有初始化数据
    if (data) {
      const success = await askToUpdateFlowList({
        icon: '',
        privileges: {
          add: [],
          delete: [],
        },
        id: data.id,
        name: fieldsValue.name,
        categoryId: fieldsValue.categoryId,
        description: fieldsValue.description,
        needAcl,
      });
      onSubmit(success);
    }
    handleLoading(false);
  }, [confirmLoading, data, form, needAcl, onSubmit]);

  useEffect(() => {
    if (visible) {
      queryFlowCategory().then(({ data: categories }) => {
        handleFlowCategory(categories);
      });
      if (data) {
        form.setFieldsValue({
          name: data.name,
          categoryId: data.categoryId,
          description: data.description,
        });
      }
    } else {
      form.resetFields();
    }
  }, [data, form, visible]);

  return (
    <Modal
      title="修改流程"
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
      forceRender
    >
      <Form form={form} name="editFlow">
        <FormItem
          label="流程名称"
          name="name"
          rules={[{ required: true, message: '请输入流程名称' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请输入流程名称" />
        </FormItem>
        <FormItem
          label="流程分组"
          name="categoryId"
          rules={[{ required: true, message: '请选择流程分组' }]}
          {...FormItemLayout}
        >
          <Select placeholder="请选择流程分组">
            {flowCategory.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="流程描述" name="description" {...FormItemLayout}>
          <Input placeholder="请输入流程描述" />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default FlowModal;
