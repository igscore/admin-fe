import React, { useState, useEffect, useCallback } from 'react';
import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import type { FormItemProps } from 'antd/lib/form';

import { queryDepartmentList } from '@/pages/setting/department/service';
import type { DepartmentTreeData } from '@/pages/setting/department/data';
import { queryPositionByFilter } from '@/pages/setting/position/service';
import type { PositionItem } from '@/pages/setting/position/data';

import { askToAddUser, askToUpdateUser, UserTypeEnum } from '../service';
import type { UserListItem } from '../data';

const FormItem = Form.Item;
const { Option } = Select;

interface Props {
  visible: boolean;
  data?: UserListItem;
  initialDepartmentId?: number;
  onSubmit: () => void;
  onCancel: () => void;
}

const FormItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const CreateUser: React.FC<Props> = (props) => {
  const { visible, data, initialDepartmentId, onSubmit, onCancel } = props;
  const [form] = Form.useForm();
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [departmentTree, handleDepartments] = useState<DepartmentTreeData[]>([]);
  const [positions, handlePositions] = useState<PositionItem[]>([]);

  const setPositions = useCallback(async (departmentId: number) => {
    const { data: posit } = await queryPositionByFilter({
      limit: 100,
      offset: 0,
      departmentId,
    });
    handlePositions(posit);
  }, []);

  const onValuesChange = useCallback(
    (changedValues) => {
      if (changedValues?.mainDepartmentId) {
        form.setFieldsValue({ mainPositionId: undefined });
        setPositions(changedValues.mainDepartmentId);
      }
    },
    [form, setPositions],
  );

  const onOk = useCallback(async () => {
    const values: any = await form.validateFields();
    if (confirmLoading) return;
    handleLoading(true);
    const { success } = data?.id
      ? await askToUpdateUser({ id: data.id, ...values })
      : await askToAddUser({ type: UserTypeEnum.WORKING, ...values });
    handleLoading(false);
    if (success) {
      onSubmit();
    }
  }, [confirmLoading, data?.id, form, onSubmit]);

  useEffect(() => {
    if (visible) {
      queryDepartmentList(true, ['value', 'title']).then(({ tree }) => {
        handleDepartments(tree);
      });
      if (data) {
        form.setFieldsValue({
          jobNumber: data.jobNumber,
          name: data.name,
          mainDepartmentId: data.mainDepartmentId,
          mainPositionId: data.mainPositionId,
        });
        setPositions(data.mainDepartmentId);
      } else {
        form.setFieldsValue({
          mainDepartmentId: initialDepartmentId,
          type: UserTypeEnum.WORKING,
        });
        if (initialDepartmentId) {
          setPositions(initialDepartmentId);
        }
      }
    } else {
      form.resetFields();
      handlePositions([]);
    }
  }, [visible, data, form, initialDepartmentId, setPositions]);

  return (
    <Modal
      title={data ? '??????????????????' : '????????????'}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      maskClosable={false}
      destroyOnClose
      forceRender
    >
      <Form name="createUser" form={form} onValuesChange={onValuesChange}>
        <FormItem label="??????" name="jobNumber" rules={[{ required: true, message: '???????????????' }]} {...FormItemLayout}>
          <Input type="number" min={0} step={1} placeholder="????????????????????????????????????" />
        </FormItem>
        <FormItem
          label="????????????"
          name="name"
          rules={[{ required: true, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <Input placeholder="?????????????????????" />
        </FormItem>
        {!data && (
          <FormItem
            label="?????????"
            name="phone"
            rules={[
              { required: true, message: '???????????????????????????' },
              {
                validator: (_, value) =>
                  /^1[3-9]\d{9}$/.test(value)
                    ? Promise.resolve()
                    : // eslint-disable-next-line prefer-promise-reject-errors
                      Promise.reject('???????????????????????????'),
              },
            ]}
            {...FormItemLayout}
          >
            <Input placeholder="????????????????????????" />
          </FormItem>
        )}
        <FormItem
          label="????????????"
          name="mainDepartmentId"
          rules={[{ required: true, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <TreeSelect
            style={{ width: '100%' }}
            treeData={departmentTree}
            placeholder="?????????????????????"
            treeDefaultExpandAll
          />
        </FormItem>
        <FormItem
          label="????????????"
          name="mainPositionId"
          rules={[{ required: true, message: '?????????????????????' }]}
          {...FormItemLayout}
        >
          <Select
            placeholder={positions.length ? '?????????????????????' : '???????????????????????????????????????????????????'}
            disabled={!positions.length}
          >
            {positions.map(({ id, name }) => (
              <Option key={id} value={id}>
                {name}
              </Option>
            ))}
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default CreateUser;
