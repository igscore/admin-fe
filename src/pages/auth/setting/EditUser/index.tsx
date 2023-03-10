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
      message.warn('????????????????????????');
    }
  };

  const columns = useMemo(
    (): ProColumns<UserListItem>[] => [
      {
        title: '??????',
        dataIndex: 'account',
      },
      {
        title: '??????',
        dataIndex: 'name',
      },
      {
        title: '????????????',
        dataIndex: 'department',
        render: (_, record) => {
          return record.mainDepartment?.fullName || record.mainDepartment?.name || '-';
        },
      },
      {
        title: '??????',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => [
          <Popconfirm
            title={`???????????????${record.name}?????????????????????`}
            onConfirm={() => handleUserRole('del', record.id)}
          >
            <Button type="link" style={{ padding: 0 }}>
              ??????
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
        <HandleList list={listData} label="??????" showHeader={false} onSelect={(item) => getAuthByRole(item.raw)} />
      </Col>
      <Col span={18} style={{ padding: 20 }}>
        <Flex aligns="center" className={styles.titleDecoration}>
          <Text strong style={{ marginRight: 8 }}>
            ????????????
          </Text>
          <Tooltip title="????????????????????????????????????????????????">
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
              {selectedRole ? '???' : '???????????????????????????'}
            </Text>
          )}
        </Flex>
        <Flex aligns="center" className={styles.titleDecoration}>
          <Text strong>????????????</Text>
          {!!selectedRole && (
            <Button size="small" type="primary" style={{ marginLeft: 15 }} onClick={() => handleUserRole('add')}>
              ????????????
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
              ???????????????????????????
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
