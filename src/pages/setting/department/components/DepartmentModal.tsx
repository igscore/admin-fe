import React, { useCallback, useEffect, useState } from 'react';
import { Form, Input, message, Modal, Select, TreeSelect } from 'antd';
import type { FormItemProps } from 'antd/lib/form';

import type { UserTreeItem } from '@/pages/setting/user/data';
import { queryUsersWithDepartment } from '@/pages/setting/user/service';

import {
  askToAddDepartment,
  askToHandleDepartmentDirector,
  askToUpdateDepartment,
  DepartmentDirectorTypeEnum,
  DepartmentStateEnum,
  DepartmentTypeEnum,
  queryDepartmentDirectors,
} from '../service';
import type { DepartmentItem, DepartmentTreeData } from '../data';

const FormItem = Form.Item;
const { SHOW_CHILD } = TreeSelect;
const { Option } = Select;

const formItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 5 },
  wrapperCol: { span: 15 },
};

const DepartmentTypeMaps = {
  [DepartmentTypeEnum.BRANCH]: '子公司',
  [DepartmentTypeEnum.DIVISION]: '部门',
  [DepartmentTypeEnum.PROJECT]: '项目',
};

const formatDirectors = (dirs: number[], changedDirs: number[], [curDirs, curChangedCirs]: number[][]) => {
  const addDirs = dirs
    .filter((i) => !curDirs.includes(i))
    .map((i) => ({
      leaderId: i,
      type: DepartmentDirectorTypeEnum.LEADER_IN_DIRECT,
    }));
  const addChangedDirs = changedDirs
    .filter((i) => !curChangedCirs.includes(i))
    .map((i) => ({
      leaderId: i,
      type: DepartmentDirectorTypeEnum.LEADER_IN_CHARGE,
    }));

  const delDirs = curDirs.filter((i) => !dirs.includes(i));
  const delChangedDirs = curChangedCirs.filter((i) => !changedDirs.includes(i));

  const add = [...addDirs, ...addChangedDirs];
  const del = [...delDirs, ...delChangedDirs];
  return {
    execute: Boolean(add.length + del.length),
    add,
    del,
  };
};

interface Props {
  visible: boolean;
  isCreation: boolean;
  data?: DepartmentItem;
  treeData: DepartmentTreeData[];
  onConfirm: (execute?: boolean, createdId?: number) => void;
  onCancel: () => void;
}

const DepartmentModal: React.FC<Props> = ({ visible, isCreation, data, treeData, onConfirm, onCancel }) => {
  const [form] = Form.useForm();
  const [confirmLoading, handleLoading] = useState<boolean>(false);
  const [userTree, handleUserTree] = useState<UserTreeItem[]>([]);
  const [directors, handleDirectors] = useState<number[][]>([[], []]);

  const onOk = useCallback(async () => {
    if (data) {
      const { parentId, name, type, director = [], changedDirector = [] } = await form.validateFields();
      if (confirmLoading) return;
      handleLoading(true);

      setTimeout(async () => {
        if (confirmLoading) {
          return;
        }

        const { success, id } = isCreation
          ? await askToAddDepartment({
              parentId,
              name,
              type,
              sequence: 0,
            })
          : await askToUpdateDepartment({
              id: data.id,
              parentId,
              name,
              type,
              sequence: 0,
              state: DepartmentStateEnum.WORK,
            });

        let result = true;
        let execute = false;

        if (!isCreation) {
          const { execute: exec, add, del } = formatDirectors(director, changedDirector, directors);
          execute = exec;
          if (execute) {
            result = await askToHandleDepartmentDirector({ departmentId: data.id, add, del });
          }
        }

        if (success && result) {
          message.success(`「${name}」${isCreation ? '添加' : '修改'}成功`, 2);
          onConfirm(execute, id);
        }
        handleLoading(false);
      }, 0);
    }
  }, [data, form, confirmLoading, isCreation, directors, onConfirm]);

  useEffect(() => {
    if (visible && data) {
      // 获取用户列表
      queryUsersWithDepartment().then(({ data: list }) => {
        handleUserTree(list);
      });
      if (isCreation) {
        form.setFieldsValue({
          parentId: data.id,
          type: DepartmentTypeEnum.DIVISION,
        });
      } else {
        form.setFieldsValue({
          parentId: data.parentId,
          id: data.id,
          name: data.name,
          type: data.type,
        });

        // 获取主管信息
        queryDepartmentDirectors(data.id).then((list) => {
          const dirs: number[][] = [[], []];
          // eslint-disable-next-line no-restricted-syntax
          for (const item of list) {
            const key = Number(item.type === DepartmentDirectorTypeEnum.LEADER_IN_CHARGE);
            dirs[key].push(item.leaderId);
          }
          form.setFieldsValue({
            director: dirs[0],
            changedDirector: dirs[1],
          });
          handleDirectors(dirs);
        });
      }
    } else {
      form.resetFields();
    }
  }, [visible, data, isCreation, form]);

  return (
    <Modal
      title={isCreation ? '添加子组织' : '编辑组织信息'}
      visible={visible}
      confirmLoading={confirmLoading}
      okText={isCreation ? '添加' : '保存'}
      onOk={onOk}
      onCancel={onCancel}
      destroyOnClose
      maskClosable
      forceRender
    >
      <Form name="department" form={form}>
        <FormItem
          {...formItemLayout}
          name="name"
          label="组织名称"
          rules={[{ required: true, message: '必须填写组织名称' }]}
        >
          <Input disabled={!isCreation && !data?.parentId} />
        </FormItem>

        {!isCreation && (
          <>
            <FormItem {...formItemLayout} label="主管" name="director">
              <TreeSelect
                style={{ width: '100%' }}
                showCheckedStrategy={SHOW_CHILD}
                treeData={userTree}
                placeholder="点击添加主管，可多选"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                treeCheckable
              />
            </FormItem>

            <FormItem {...formItemLayout} label="上级主管" name="changedDirector">
              <TreeSelect
                style={{ width: '100%' }}
                showCheckedStrategy={SHOW_CHILD}
                treeData={userTree}
                placeholder="点击添加上级主管，可多选"
                dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                treeDefaultExpandAll
                treeCheckable
              />
            </FormItem>
          </>
        )}

        {(isCreation || !!data?.parentId) && (
          <FormItem name="parentId" label="上级组织" {...formItemLayout}>
            <TreeSelect
              placeholder="请选择上级组织"
              treeData={treeData}
              dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
              treeDefaultExpandAll
            />
          </FormItem>
        )}

        <FormItem name="type" label="组织类型" {...formItemLayout}>
          <Select placeholder="请选择组织类型" disabled={!isCreation && !data?.parentId}>
            <Option key="DIVISION" value={DepartmentTypeEnum.DIVISION}>
              {DepartmentTypeMaps[DepartmentTypeEnum.DIVISION]}
            </Option>
            <Option key="PROJECT" value={DepartmentTypeEnum.PROJECT}>
              {DepartmentTypeMaps[DepartmentTypeEnum.PROJECT]}
            </Option>
            <Option key="BRANCH" value={DepartmentTypeEnum.BRANCH}>
              {DepartmentTypeMaps[DepartmentTypeEnum.BRANCH]}
            </Option>
          </Select>
        </FormItem>
      </Form>
    </Modal>
  );
};

export default DepartmentModal;
