import React, { useCallback, useEffect, useRef, useState } from 'react';
import { PlusOutlined } from '@ant-design/icons';
import { Row, Col, message, Typography, Button, Tag } from 'antd';
import { ColProps } from 'antd/es/col';

import HandleList, { ListItemInfo, HandleOptionType } from '@/components/HandleList';

import RoleModal from './RoleModal';
import BindAuthModal from './BindAuthModal';

import {
  queryRoleList,
  queryAuthList,
  askToDeleteRole,
  queryAuthOfRole,
  askToHandleAuthOfRole,
} from '../service';
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

const EditRole: React.FC = () => {
  const roleList = useRef<MenuRoleInfo[]>([]);
  const [listData, handleListData] = useState<ListItemInfo[]>([]);
  const [authList, handleAuthList] = useState<MenuAuthInfo[]>([]);
  const [curAuthIds, handleAuthIds] = useState<number[]>([]);
  const [selectedRole, handleSelectedRole] = useState<MenuRoleInfo>();
  const [addModalVisible, handleAddModalVisible] = useState<boolean>(false);
  const [bindAuthVisible, handleBindAuthModalVisible] = useState<boolean>(false);

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

  const onHandle = async (type: HandleOptionType, selectedId?: number) => {
    if (type === 'add') {
      handleAddModalVisible(true);
      handleSelectedRole(undefined);
    } else if (type === 'update' && selectedId) {
      const current = roleList.current.find((i) => i.id === selectedId);
      if (current) {
        handleSelectedRole(current);
        handleAddModalVisible(true);
      }
    } else if (type === 'delete' && selectedId) {
      const result = await askToDeleteRole(selectedId);
      if (result) {
        message.success('角色删除成功');
        handleAuthIds([]);
        await fetchList();
      }
    }
  };

  const getAuthByRole = useCallback(async (role: MenuRoleInfo) => {
    const auths = await queryAuthOfRole(role.id);
    handleSelectedRole(role);
    handleAuthIds(auths);
  }, []);

  const addAuthToRole = useCallback(() => {
    if (selectedRole) {
      handleBindAuthModalVisible(true);
    } else {
      message.warn('请先选中一个角色');
    }
  }, [selectedRole]);

  const removeAuthFromRole = useCallback(
    async (authInfo: MenuAuthInfo) => {
      if (selectedRole) {
        await askToHandleAuthOfRole({
          roleId: selectedRole.id,
          del: [authInfo.id],
        });
        await getAuthByRole(selectedRole);
      }
    },
    [selectedRole],
  );

  const onAddAuthModalOk = () => {
    handleAddModalVisible(false);
    fetchList();
  };

  const onBindAuthModalOk = () => {
    if (selectedRole) {
      handleBindAuthModalVisible(false);
      getAuthByRole(selectedRole);
    }
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <Row className={styles.editRole}>
      <Col span={6} {...ColLayout}>
        <HandleList
          list={listData}
          label="角色"
          onHandle={onHandle}
          onSelect={(item) => getAuthByRole(item.raw)}
        />
      </Col>
      <Col span={18} style={{ padding: 20 }}>
        <Row className={styles.titleDecoration}>
          <Text strong>描述信息</Text>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Text type="secondary" style={{ minHeight: 22, paddingLeft: 8 }}>
            {selectedRole ? selectedRole.description || '无' : '请先在左侧选择角色'}
          </Text>
        </Row>
        <Row className={styles.titleDecoration}>
          <Text strong>绑定权限</Text>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          <Button size="small" onClick={addAuthToRole} style={{ padding: '0px 30px' }}>
            <PlusOutlined />
          </Button>
        </Row>
        <Row className={styles.titleDecoration}>
          <Text strong>已绑定的权限</Text>
        </Row>
        <Row style={{ marginBottom: 20 }}>
          {curAuthIds.length ? (
            curAuthIds.map((id) => {
              const authInfo = authList.find((i) => i.id === id);
              if (authInfo) {
                return (
                  <Tag
                    style={{ height: 25, lineHeight: '23px', padding: '0px 10px' }}
                    key={authInfo.id}
                    onClose={() => removeAuthFromRole(authInfo)}
                    closable
                  >
                    {authInfo.name}
                  </Tag>
                );
              }
              return null;
            })
          ) : (
            <Text type="secondary" style={{ paddingLeft: 8 }}>
              {selectedRole ? '暂无数据' : '请先在左侧选择角色'}
            </Text>
          )}
        </Row>
      </Col>
      <RoleModal
        data={selectedRole}
        visible={addModalVisible}
        onOk={onAddAuthModalOk}
        onClose={() => handleAddModalVisible(false)}
      />
      <BindAuthModal
        visible={bindAuthVisible}
        data={selectedRole}
        list={authList}
        defaultValue={curAuthIds}
        onOk={onBindAuthModalOk}
        onClose={() => handleBindAuthModalVisible(false)}
      />
    </Row>
  );
};

export default EditRole;
