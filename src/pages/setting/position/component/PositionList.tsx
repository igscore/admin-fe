import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Button, Divider, Popconfirm, Tag } from 'antd';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { PlusOutlined } from '@ant-design/icons';
// from self project
import { queryDepartmentList } from '@/pages/setting/department/service';
import type { DepartmentItem } from '@/pages/setting/department/data';
// from self page
import type { ListDataMap } from '@/utils/utils';
import { formatListToMap } from '@/utils/utils';

import CreatePosition from './CreatePosition';
import { askToDeletePosition, PositionTypeEnum, PositionTypeMaps, queryPositionByFilter } from '../service';
import type { FilterPositionParams, PositionItem } from '../data';
import { isOwnEmptyObj } from '@/utils/variable';

interface Props {
  departmentId?: number;
  initialDepartments?: DepartmentItem[];
  headerTitle?: string;
  filter?: FilterPositionParams;
  enableSearch?: boolean;
}

const formatter = (data: DepartmentItem[]) =>
  formatListToMap(data, (department) => ({
    text: department.name,
    display: department.parentId
      ? department.fullName.split('/').slice(1).join('/') || department.name
      : department.name,
  }));

const PositionList: React.FC<Props> = ({
  filter = {},
  enableSearch = true,
  headerTitle = '用户列表',
  initialDepartments,
}) => {
  const actionRef = useRef<ActionType>();
  const [departmentMaps, handleDepartmentMaps] = useState<ListDataMap>({});
  const [selectedData, handleSelectedData] = useState<PositionItem>();
  const [visible, handleVisible] = useState<boolean>(false);

  const search = useMemo(
    (): any =>
      enableSearch
        ? {
            labelWidth: 'auto',
            span: {
              xs: 24,
              sm: 24,
              md: 8,
              lg: 6,
              xl: 4,
              xxl: 4,
            },
          }
        : false,
    [enableSearch],
  );

  const columns = useMemo(
    (): ProColumns<PositionItem>[] => [
      {
        title: '岗位名称',
        dataIndex: 'name',
      },
      {
        title: '所属部门',
        dataIndex: 'departmentId',
        hideInTable: !isOwnEmptyObj(filter),
        render: (_, { departmentId }) => departmentMaps[departmentId]?.display || '--',
        valueType: 'select',
        valueEnum: isOwnEmptyObj(departmentMaps) ? undefined : departmentMaps,
      },
      {
        title: '岗位描述',
        dataIndex: 'description',
        search: false,
      },
      {
        title: '岗位类型',
        dataIndex: 'type',
        valueType: 'select',
        valueEnum: {
          [PositionTypeEnum.HIGH]: '高层',
          [PositionTypeEnum.MIDDLE]: '中层',
          [PositionTypeEnum.LOW]: '基层',
        },
        render: (_, record) => {
          const label = record.type ? PositionTypeMaps[record.type] : null;
          if (label) {
            return <Tag color={label.tag}>{label.text}</Tag>;
          }
          return '';
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        search: false,
        render: (_, record) => [
          <Button
            key="edit"
            type="link"
            style={{ padding: 0 }}
            onClick={() => {
              handleSelectedData(record);
              handleVisible(true);
            }}
          >
            编辑
          </Button>,
          <Divider key="line" type="vertical" />,
          <Popconfirm
            key="pop"
            title={`确认删除「${record.name}」岗位？`}
            okType="danger"
            onConfirm={async () => {
              const success = await askToDeletePosition(record.id);
              if (success) {
                actionRef.current?.reload();
              }
            }}
          >
            <Button style={{ padding: 0 }} type="link" danger>
              删除
            </Button>
          </Popconfirm>,
        ],
      },
    ],
    [departmentMaps, filter],
  );

  useEffect(() => {
    if (!isOwnEmptyObj(filter)) {
      actionRef.current?.reload();
    }
  }, [filter]);

  useEffect(() => {
    if (initialDepartments) {
      handleDepartmentMaps(formatter(initialDepartments));
    } else {
      queryDepartmentList().then(({ list: data }) => {
        handleDepartmentMaps(formatter(data));
      });
    }
  }, [initialDepartments]);

  return (
    <>
      <ProTable<PositionItem>
        rowKey="id"
        size="small"
        headerTitle={headerTitle}
        actionRef={actionRef}
        columns={columns}
        request={({ pageSize = 20, current = 1, ...searchParams }) => {
          return queryPositionByFilter({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            ...filter,
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
          <Button
            key="create"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              handleVisible(true);
              handleSelectedData(undefined);
            }}
          >
            新建
          </Button>,
        ]}
      />
      <CreatePosition
        visible={visible}
        data={selectedData}
        initialDepartmentId={filter?.departmentId}
        onCancel={() => handleVisible(false)}
        onSubmit={() => {
          handleVisible(false);
          actionRef.current?.reload();
        }}
      />
    </>
  );
};

export default PositionList;
