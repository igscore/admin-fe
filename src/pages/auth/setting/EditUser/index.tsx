import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Row, Col, Typography, Tag, Tooltip, Button, message, Popconfirm } from 'antd';
import ProTable, { ActionType, ProColumns } from '@ant-design/pro-table';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { ColProps } from 'antd/es/col';

import { UserListItem } from '@/pages/setting/user/data';

import Flex from '@/components/Flex';
import HandleList, { ListItemInfo } from '@/components/HandleList';

import BindUserModal from './BindUserModal';

import { queryRoleList, queryAuthList, queryAuthOfRole, askToHandleUserOfRole, queryUsersOfRole } from '../service';
import { MenuRoleInfo, MenuAuthInfo } from '../data';

import styles from './index.less';

const { Text } = Typography;

const ColLayout: ColProps = {
  style: {
    paddingRight: 20,
    borderRight: '1px solid #ccc',
    overflowX: 'auto',
  },
};

const EditUser: React.FC = () => {
  const actionRef = useRef<ActionType>();
  const roleList = useRef<MenuRoleInfo[]>([]);
  const [listData, handleListData] = useState<ListItemInfo[]>([]);
  const [authList, handleAuthList] = useState<MenuAuthInfo[]>([]);
  const [curAuthIds, handleAuthIds] = useState<number[]>([]);
  const [selectedRole, handleSelectedRole] = useState<MenuRoleInfo>();
  const [bindUserVisible, handleBindUserModalVisible] = useState<boolean>(false);

  const fetchList = useCallback(async () => {
    const [roles, auths] = await Promise.all([queryRoleList(), queryAuthList()]);
    const list = roles.map((item) => ({
      listId: item.id,
      listName: item.name,
      raw: item,
    }));
    roleList.current = roles;
    handleListData(list);
    handleAuthList(auths);
  }, []);

  const getAuthByRole = useCallback(async (role: MenuRoleInfo) => {
    const auths = await queryAuthOfRole(role.id);
    handleSelectedRole(role);
    handleAuthIds(auths);
    actionRef.current?.reload();
  }, []);

  const onBindAuthModalOk = () => {
    if (selectedRole) {
      handleBindUserModalVisible(false);
      getAuthByRole(selectedRole);
    }
  };

  const handleUserRole = async (type: 'add' | 'del', id?: number) => {
    if (selectedRole) {
      if (type === 'add') {
        handleBindUserModalVisible(true);
      } else if (id) {
        const success = await askToHandleUserOfRole({
          roleId: selectedRole.id,
          del: [id],
        });
        if (success) {
          actionRef.current?.reload();
        }
      }
    } else {
      message.warn('请先选中一个角色');
    }
  };

  const columns = useMemo(
    (): ProColumns<UserListItem>[] => [
      {
        title: '帐号',
        dataIndex: 'account',
      },
      {
        title: '姓名',
        dataIndex: 'name',
      },
      {
        title: '所在部门',
        dataIndex: 'department',
        render: (_, record) => {
          return record.mainDepartment?.fullName || record.mainDepartment?.name || '-';
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => [
          <Popconfirm
            title={`确认删除「${record.name}」用户的授权？`}
            onConfirm={() => handleUserRole('del', record.id)}
          >
            <Button type="link" style={{ padding: 0 }}>
              删除
            </Button>
          </Popconfirm>,
        ],
      },
    ],
    [selectedRole],
  );

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Row className={styles.editUser}>
      <Col span={6} {...ColLayout}>
        <HandleList list={listData} label="角色" showHeader={false} onSelect={(item) => getAuthByRole(item.raw)} />
      </Col>
      <Col span={18} style={{ padding: 20 }}>
        <Flex aligns="center" className={styles.titleDecoration}>
          <Text strong style={{ marginRight: 8 }}>
            角色权限
          </Text>
          <Tooltip title="权限配置请“角色管理”菜单下操作">
            <QuestionCircleOutlined />
          </Tooltip>
        </Flex>
        <Flex aligns="center" style={{ marginBottom: 20 }}>
          {curAuthIds.length ? (
            curAuthIds.map((id) => {
              const authInfo = authList.find((i) => i.id === id);
              if (authInfo) {
                return (
                  <Tag key={authInfo.id} className={styles.roleAuth}>
                    {authInfo.name}
                  </Tag>
                );
              }
              return null;
            })
          ) : (
            <Text type="secondary" style={{ paddingLeft: 8 }}>
              {selectedRole ? '无' : '请先在左侧选择角色'}
            </Text>
          )}
        </Flex>
        <Flex aligns="center" className={styles.titleDecoration}>
          <Text strong>用户授权</Text>
          {!!selectedRole && (
            <Button size="small" type="primary" style={{ marginLeft: 15 }} onClick={() => handleUserRole('add')}>
              添加用户
            </Button>
          )}
        </Flex>
        <div style={{ marginBottom: 20 }}>
          {selectedRole ? (
            <ProTable<UserListItem>
              rowKey="account"
              size="small"
              headerTitle={false}
              columns={columns}
              actionRef={actionRef}
              request={() => queryUsersOfRole(selectedRole.id)}
              rowSelection={false}
              search={false}
              options={false}
              pagination={false}
              toolBarRender={false}
            />
          ) : (
            <Text type="secondary" style={{ paddingLeft: 8 }}>
              请先在左侧选择角色
            </Text>
          )}
        </div>
      </Col>
      <BindUserModal
        visible={bindUserVisible}
        data={selectedRole}
        onOk={onBindAuthModalOk}
        onClose={() => handleBindUserModalVisible(false)}
      />
    </Row>
  );
};

export default EditUser;
