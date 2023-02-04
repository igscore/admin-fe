import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { history } from 'umi';
import { Button, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import type { DepartmentItem } from '@/pages/setting/department/data';
import { queryDepartmentList } from '@/pages/setting/department/service';
import { queryPosition } from '@/pages/setting/position/service';

import type { ListDataMap } from '@/utils/utils';
import { formatListToMap } from '@/utils/utils';
import { isOwnEmptyObj } from '@/utils/variable';

import CreateUser from './CreateUser';
import { askToDeleteUser, queryUserListByFilter, UserTypeEnum, UserTypeMaps } from '../service';
import type { FilterUserParams, UserListItem } from '../data';

interface Props {
  initialDepartments?: DepartmentItem[];
  headerTitle?: string;
  filter?: FilterUserParams;
  enableSearch?: boolean;
}

const UserList: React.FC<Props> = ({
  filter = {},
  enableSearch = true,
  headerTitle = '用户列表',
  initialDepartments,
}) => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedData, handleSelectedData] = useState<UserListItem>();

  const [departmentMaps, handleDepartments] = useState<ListDataMap>({});
  const [positionMaps, handlePositions] = useState<ListDataMap>({});

  const actionRef = useRef<ActionType>();

  const createData = useCallback(() => {
    handleSelectedData(undefined);
    handleModalVisible(true);
  }, []);

  const onSubmit = useCallback(async () => {
    handleModalVisible(false);
    handleSelectedData(undefined);
    actionRef?.current?.reload();
  }, []);

  const columns = useMemo(
    (): ProColumns<UserListItem>[] => [
      {
        title: '工号',
        dataIndex: 'jobNumber',
      },
      {
        title: '帐号',
        dataIndex: 'account',
        hideInTable: true,
      },
      {
        title: '姓名',
        dataIndex: 'name',
        render: (_, record) => `${record.name} / ${record.account}`,
      },
      {
        title: '部门',
        dataIndex: 'departmentId',
        hideInTable: !isOwnEmptyObj(filter),
        render: (_, { mainDepartmentId }) => departmentMaps[mainDepartmentId]?.display || '--',
        valueType: 'select',
        valueEnum: isOwnEmptyObj(departmentMaps)
          ? undefined
          : {
              ...departmentMaps,
            },
      },
      {
        title: '岗位',
        dataIndex: 'positionId',
        render: (_, { mainPositionId }) => positionMaps[mainPositionId]?.text || '--',
        valueType: 'select',
        valueEnum: isOwnEmptyObj(positionMaps)
          ? undefined
          : {
              ...positionMaps,
            },
      },
      {
        title: '状态',
        dataIndex: 'type',
        hideInTable: true,
        initialValue: String(UserTypeEnum.WORKING),
        valueType: 'radioButton',
        valueEnum: {
          ...UserTypeMaps,
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <>
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                history.push(`/setting/user/detail?id=${record.id}`);
              }}
            >
              详情
            </Button>
            <Divider type="vertical" />
            <Button
              style={{ padding: 0 }}
              type="link"
              onClick={() => {
                handleSelectedData(record);
                handleModalVisible(true);
              }}
            >
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm
              key="pop"
              title={`确定删除 ${record.name}/${record.account}？`}
              okType="danger"
              onConfirm={async () => {
                const { success } = await askToDeleteUser(record.id);
                if (success) {
                  actionRef?.current?.reload();
                }
              }}
            >
              <Button style={{ padding: 0 }} type="link" danger>
                删除
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ],
    [filter, departmentMaps, positionMaps],
  );

  const search = useMemo((): any => (enableSearch ? { defaultCollapsed: false } : false), [enableSearch]);

  useEffect(() => {
    const formatter = (data: DepartmentItem[]) =>
      formatListToMap(data, (department) => ({
        text: department.name,
        display: department.parentId
          ? department.fullName.split('/').slice(1).join('/') || department.name
          : department.name,
      }));
    if (initialDepartments) {
      handleDepartments(formatter(initialDepartments));
    } else {
      queryDepartmentList().then(({ list: data }) => {
        handleDepartments(formatter(data));
      });
    }
  }, [initialDepartments]);

  useEffect(() => {
    if (!isOwnEmptyObj(filter)) {
      actionRef.current?.reload();
    }
  }, [filter]);

  useEffect(() => {
    queryPosition().then(({ list: data }) => {
      handlePositions(
        formatListToMap(data, (position) => ({
          text: position.name,
        })),
      );
    });
  }, []);

  return (
    <>
      <ProTable<UserListItem>
        rowKey="id"
        size="small"
        headerTitle={headerTitle}
        actionRef={actionRef}
        columns={columns}
        request={({ pageSize = 20, current = 1, account, name, ...searchParams }) => {
          return queryUserListByFilter({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            ...filter,
            name: account || name,
            ...searchParams,
          });
        }}
        rowSelection={false}
        search={search}
        options={{
          reload: true,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        toolBarRender={() => [
          <Button key="create" icon={<PlusOutlined />} type="primary" onClick={createData}>
            新建
          </Button>,
        ]}
      />
      <CreateUser
        visible={createModalVisible}
        data={selectedData}
        initialDepartmentId={filter?.departmentId}
        onCancel={() => handleModalVisible(false)}
        onSubmit={onSubmit}
      />
    </>
  );
};

export default UserList;
