import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, Modal, message, Select, TreeSelect } from 'antd';
import type { FormItemProps } from 'antd/lib/form';

import type { PositionItem } from '../data';
import { askToUpdatePosition, askToAddPosition, PositionTypeEnum, PositionTypeMaps } from '../service';
import type { DepartmentTreeData } from '@/pages/setting/department/data';
import { queryDepartmentList } from '@/pages/setting/department/service';

const FormItem = Form.Item;

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

interface Props {
  visible: boolean;
  data?: PositionItem;
  initialDepartmentId?: number;
  onSubmit: () => void;
  onCancel: () => void;
}

const CreatePosition: React.FC<Props> = (props) => {
  const { visible, data = null, initialDepartmentId, onSubmit, onCancel } = props;
  const [form] = Form.useForm();
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [departmentTree, handleDepartments] = useState<DepartmentTreeData[]>([]);

  const onOk = useCallback(async () => {
    const { departmentId, type, name, description, sequence = 0 } = await form.validateFields();
    if (confirmLoading) return;
    handleLoading(true);
    try {
      if (data) {
        const { id } = data;
        await askToUpdatePosition({ id, departmentId, type, name, duty: '', description, sequence });
      } else {
        await askToAddPosition({ departmentId, type, name, duty: '', description, sequence });
      }
      message.success(`${data ? '更新' : '添加'}岗位成功`);
      onSubmit();
    } catch (e) {
      message.error(`${data ? '更新' : '添加'}岗位失败，请稍后再试`);
    }
    handleLoading(false);
  }, [confirmLoading, data, form, onSubmit]);

  useEffect(() => {
    if (visible) {
      queryDepartmentList(true, ['value', 'title']).then(({ tree }) => {
        handleDepartments(tree);
      });
      if (data) {
        form.setFieldsValue({
          departmentId: data.departmentId,
          id: data.id,
          name: data.name,
          type: data.type,
          description: data.description,
        });
      } else {
        form.setFieldsValue({
          departmentId: initialDepartmentId,
        });
      }
    } else {
      form.resetFields();
    }
  }, [visible, data, initialDepartmentId, form]);

  return (
    <Modal
      title="新增岗位"
      visible={visible}
      confirmLoading={confirmLoading}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      forceRender
    >
      <Form name="createPosition" form={form}>
        <FormItem
          label="所属部门"
          name="departmentId"
          rules={[{ required: true, message: '请选择所在部门' }]}
          {...FormItemLayout}
        >
          <TreeSelect
            style={{ width: '100%' }}
            placeholder="请选择所属部门"
            treeData={departmentTree}
            treeDefaultExpandAll
          />
        </FormItem>
        <FormItem
          label="岗位名称"
          name="name"
          rules={[{ required: true, message: '请输入岗位名称' }]}
          {...FormItemLayout}
        >
          <Input placeholder="请输入岗位名称" />
        </FormItem>
        <FormItem label="岗位类型" name="type" initialValue={PositionTypeEnum.LOW} {...FormItemLayout}>
          <Select placeholder="请选择岗位类型">
            <Select.Option value={PositionTypeEnum.HIGH}>{PositionTypeMaps[PositionTypeEnum.HIGH].text}</Select.Option>
            <Select.Option value={PositionTypeEnum.MIDDLE}>
              {PositionTypeMaps[PositionTypeEnum.MIDDLE].text}
            </Select.Option>
            <Select.Option value={PositionTypeEnum.LOW}>{PositionTypeMaps[PositionTypeEnum.LOW].text}</Select.Option>
          </Select>
        </FormItem>
        <FormItem label="岗位描述" name="description" {...FormItemLayout}>
          <Input.TextArea placeholder="请填写岗位描述" rows={3} />
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreatePosition;
