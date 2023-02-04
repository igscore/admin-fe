import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, Card, Col, message, Modal, Row, Spin, Tag, Tree, Typography } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import PositionList from '@/pages/setting/position/component/PositionList';
import UserList from '@/pages/setting/user/components/UserList';
import { queryUserList } from '@/pages/setting/user/service';
import type { UserListItem } from '@/pages/setting/user/data';

import Flex from '@/components/Flex';

import DepartmentModal from './components/DepartmentModal';
import {
  askToDeleteDepartment,
  DepartmentDirectorTypeEnum,
  DepartmentTypeEnum,
  queryDepartmentDirectors,
  queryDepartmentList,
} from './service';
import type { DepartmentDirectorItem, DepartmentItem, DepartmentTreeData } from './data';
import { ExclamationCircleOutlined } from '@ant-design/icons';

const { DirectoryTree } = Tree;

const DepartmentTypeMaps = {
  [DepartmentTypeEnum.BRANCH]: '子公司',
  [DepartmentTypeEnum.DIVISION]: '部门',
  [DepartmentTypeEnum.PROJECT]: '项目',
};

const getRootId = (list: DepartmentItem[]) => {
  const rootNode = list.find(({ parentId }) => !parentId);
  return rootNode?.id || null;
};

const Department: React.FC = () => {
  const [list, handleList] = useState<DepartmentItem[]>([]);
  const [treeData, handleTreeData] = useState<DepartmentTreeData[]>([]);
  const [treeLoading, handleTreeLoading] = useState<boolean>(true);

  const [selectedId, handleSelectedId] = useState<number | null>(null);

  const [userList, handleUserList] = useState<UserListItem[]>([]);
  const [directors, handleDirectors] = useState<DepartmentDirectorItem[][]>([]);

  const [departmentVisible, handleDepartmentVisible] = useState<boolean>(false);
  const [isCreation, handleIsCreation] = useState<boolean>(false);

  const filter = useMemo((): any => ({ departmentId: selectedId }), [selectedId]);
  const selectedDepartment = useMemo(() => list.find(({ id }) => id === selectedId) || undefined, [list, selectedId]);

  const onDepartmentClick = useCallback((isNew: boolean) => {
    handleIsCreation(isNew);
    handleDepartmentVisible(true);
  }, []);

  const onDeleteDepartment = useCallback(() => {
    if (selectedDepartment) {
      Modal.confirm({
        icon: <ExclamationCircleOutlined />,
        title: `确定要删除 ${selectedDepartment.name}？`,
        content: selectedDepartment.fullName || selectedDepartment.name,
        onOk: async () => {
          const success = await askToDeleteDepartment(selectedDepartment.id);
          if (success) {
            message.success('删除成功');
          }
        },
      });
    }
  }, [selectedDepartment]);

  const fetchDirectors = useCallback(async (curSelectedId: number | null) => {
    if (curSelectedId) {
      queryDepartmentDirectors(curSelectedId).then((data) => {
        const dirs: DepartmentDirectorItem[][] = [[], []];
        // eslint-disable-next-line no-restricted-syntax
        for (const item of data) {
          const key = Number(item.type === DepartmentDirectorTypeEnum.LEADER_IN_CHARGE);
          dirs[key].push(item);
        }
        handleDirectors(dirs);
      });
    }
  }, []);

  const fetchList = useCallback(async () => {
    handleTreeLoading(true);
    const { list: data, tree } = await queryDepartmentList(true);
    handleList(data);
    handleTreeData(tree);
    handleTreeLoading(false);
    return data;
  }, []);

  useEffect(() => {
    fetchDirectors(selectedId);
  }, [fetchDirectors, selectedId]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await queryUserList();
      handleUserList(data);
    };
    fetchUsers();
    fetchList().then((data) => {
      const id = getRootId(data);
      handleSelectedId(id);
    });
  }, [fetchList]);

  return (
    <PageHeaderWrapper>
      <Card bordered={false}>
        <Row gutter={24}>
          <Col sm={24} md={10} xl={6} style={{ marginBottom: '20px', borderRight: '1px solid #eee' }}>
            {!treeLoading && !!treeData.length ? (
              <DirectoryTree
                treeData={treeData}
                expandAction={false}
                selectedKeys={selectedId ? [selectedId] : []}
                onSelect={([key]) => handleSelectedId(Number(key))}
                defaultExpandAll
              />
            ) : (
              <Row justify="center" align="middle" style={{ height: '100%' }}>
                <Spin tip="加载中..." />
              </Row>
            )}
          </Col>
          <Col sm={24} md={14} xl={18}>
            {!!selectedDepartment && (
              <>
                <Flex aligns="center" style={{ marginBottom: 10, padding: '0 24px' }}>
                  <Typography.Title level={4} style={{ margin: '0 15px 0 0' }}>
                    {selectedDepartment.name}
                  </Typography.Title>
                  <Button style={{ marginRight: 15 }} type="primary" onClick={() => onDepartmentClick(true)}>
                    添加子部门
                  </Button>
                  <Button style={{ marginRight: 15 }} onClick={() => onDepartmentClick(false)}>
                    编辑
                  </Button>
                  {!!selectedDepartment.parentId && (
                    <Button type="default" danger onClick={onDeleteDepartment}>
                      删除
                    </Button>
                  )}
                </Flex>
                <Flex
                  style={{
                    lineHeight: '40px',
                    fontSize: 16,
                    fontWeight: 'bold',
                    margin: '0 24px 5px',
                    borderBottom: '1px solid #eee',
                  }}
                >
                  基本信息
                </Flex>
                {!!selectedDepartment.parentId && (
                  <Flex style={{ padding: '5px 24px' }} aligns="center">
                    <Typography.Text style={{ display: 'inline-block', width: 72, textAlign: 'right' }}>
                      编号：
                    </Typography.Text>
                    {selectedDepartment.id}
                  </Flex>
                )}
                <Flex style={{ padding: '5px 24px' }} aligns="center">
                  <Typography.Text style={{ display: 'inline-block', width: 72, textAlign: 'right' }}>
                    类型：
                  </Typography.Text>
                  {DepartmentTypeMaps[selectedDepartment.type]}
                </Flex>
              </>
            )}
            {directors.map((dirs, index) => (
              <Flex key={dirs[0]?.leaderId || index} aligns="center" style={{ padding: '5px 24px' }}>
                <Typography.Text style={{ display: 'inline-block', width: 72, textAlign: 'right' }}>
                  {index === 0 ? '主管' : '上级主管'}：
                </Typography.Text>
                {dirs.length ? (
                  dirs.map((item) => {
                    const user = userList.find(({ id }) => id === item.leaderId);
                    return (
                      !!user?.name && (
                        <Tag key={item.leaderId} color={index === 0 ? 'blue' : 'gold'}>
                          {user.name} / {user.account}
                        </Tag>
                      )
                    );
                  })
                ) : (
                  <Typography.Text type="secondary">无</Typography.Text>
                )}
                <Button type="link" onClick={() => onDepartmentClick(false)}>
                  设置
                </Button>
              </Flex>
            ))}
            {!!selectedId && (
              <UserList filter={filter} enableSearch={false} headerTitle="部门成员" initialDepartments={list} />
            )}
            <div style={{ height: 20 }} />
            {!!selectedId && (
              <PositionList filter={filter} enableSearch={false} headerTitle="部门岗位" initialDepartments={list} />
            )}
          </Col>
        </Row>
      </Card>
      <DepartmentModal
        visible={departmentVisible}
        isCreation={isCreation}
        data={selectedDepartment}
        treeData={treeData}
        onCancel={() => handleDepartmentVisible(false)}
        onConfirm={async (execute, createdId) => {
          handleDepartmentVisible(false);
          const data = await fetchList();
          let nextId = selectedId;
          if (!selectedId || !data.find(({ id }) => id === selectedId)) {
            nextId = getRootId(data);
            handleSelectedId(nextId);
          } else if (isCreation && createdId) {
            nextId = createdId;
            handleSelectedId(nextId);
          }
          if (execute) {
            await fetchDirectors(nextId);
          }
        }}
      />
    </PageHeaderWrapper>
  );
};

export default Department;
