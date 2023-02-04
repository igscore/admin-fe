import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Modal, message, Form, TreeSelect } from 'antd';

import type { UserListItem, UserTreeItem } from '@/pages/setting/user/data';
import { queryUsersWithDepartment } from '@/pages/setting/user/service';
import type { DepartmentItem } from '@/pages/setting/department/data';

import { askToHandleUserOfRole } from '../service';
import type { MenuRoleInfo } from '../data';

const { TreeNode, SHOW_PARENT } = TreeSelect;

const getValuesById = (
  treeData: UserTreeItem[],
  selectedIds: number[],
  selectAll?: boolean,
): number[] => {
  return treeData.reduce((arr, { id, type, children }) => {
    const isSelected = selectAll || selectedIds.includes(id);
    if (type === 'folder' && children?.length) {
      return arr.concat(getValuesById(children, selectedIds, isSelected));
    }
    if (isSelected) {
      return arr.concat(id);
    }
    return arr;
  }, [] as number[]);
};

interface Props {
  visible: boolean;
  data?: MenuRoleInfo;
  onOk: () => void;
  onClose: () => void;
}

const BindUserModal: React.FC<Props> = (props) => {
  const { visible, data } = props;
  const [form] = Form.useForm();
  const [treeData, handleTreeData] = useState<UserTreeItem[]>([]);
  const userList = useRef<UserListItem[]>([]);
  const allList = useRef<(UserListItem | DepartmentItem)[]>([]);

  const renderNode = useCallback((node: UserTreeItem): React.ReactElement => {
    if (node.type === 'folder') {
      return (
        <TreeNode key={node.id} value={node.id} title={node.name}>
          {(node.children || []).map(renderNode)}
        </TreeNode>
      );
    }
    return <TreeNode key={node.id} value={node.id} title={node.name} />;
  }, []);

  const onOk = async () => {
    const { user }: any = await form.validateFields();
    if (user && data) {
      // 格式化接口提交value
      const userIds = getValuesById(treeData, user);
      const success = await askToHandleUserOfRole({
        roleId: data.id,
        add: userIds,
      });
      if (success) {
        props.onOk();
      }
    }
  };

  useEffect(() => {
    if (!visible) {
      form.resetFields();
    }
  }, [visible, form])

  useEffect(() => {
    queryUsersWithDepartment().then(({ data: tree, departments, users }) => {
      handleTreeData(tree);
      userList.current = users;
      allList.current = [...departments, ...users];
    });
  }, []);

  return (
    <Modal
      visible={visible}
      title={`当前角色：「${data?.name}」`}
      onOk={onOk}
      onCancel={props.onClose}
      maskClosable={false}
      destroyOnClose
    >
      <Form layout="vertical" form={form}>
        <Form.Item
          label="选择授权用户"
          name="user"
          rules={[{ required: true, message: '请选择授权用户' }]}
        >
          <TreeSelect
            style={{ width: '100%' }}
            showCheckedStrategy={SHOW_PARENT}
            placeholder="点击选择授权用户，可多选"
            treeDefaultExpandAll
            treeCheckable
          >
            {treeData.map(renderNode)}
          </TreeSelect>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default BindUserModal;
