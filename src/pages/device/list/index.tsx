import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { history } from 'umi';
import { Button, Divider, Modal } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { queryDeviceGroup } from '@/pages/device/category/service';
import type { DeviceGroupItem } from '@/pages/device/category/data';

import DeviceModal from './components/DeviceModal';
import { askToDeleteDevice, queryDeviceList } from './service';
import type { DeviceListItem } from './data';

const DeviceList: React.FC = () => {
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedData, handleSelectedData] = useState<DeviceListItem | undefined>();
  const [groupList, handleGroupList] = useState<DeviceGroupItem[]>([]);
  const actionRef = useRef<ActionType>();

  const onDelete = useCallback((data: DeviceListItem) => {
    Modal.confirm({
      title: `确定删除「${data.name}」设备？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const success = await askToDeleteDevice(data.id);
        if (success) {
          actionRef?.current?.reload();
        }
      },
    });
  }, []);

  const onOption = useCallback((data?: DeviceListItem) => {
    handleSelectedData(data || undefined);
    handleModalVisible(true);
  }, []);

  const columns = useMemo(
    (): ProColumns<DeviceListItem>[] => [
      {
        title: '序号',
        dataIndex: 'index',
        valueType: 'index',
      },
      {
        title: 'MAC地址',
        dataIndex: 'mac',
      },
      {
        title: 'UUID',
        dataIndex: 'uuid',
      },
      {
        title: '设备名称',
        dataIndex: 'name',
      },
      {
        title: '设备分组',
        dataIndex: 'groupId',
        filters: [],
        valueEnum: groupList.reduce((enums, { id, name }) => ({ ...enums, [id]: name }), {}),
      },
      {
        title: '设备信息',
        dataIndex: 'description',
        search: false,
      },
      {
        title: '感应距离（m）',
        dataIndex: 'distanceLimit',
        search: false,
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        search: false,
        render: (_, record) => (
          <>
            <Button style={{ padding: 0 }} type="link" onClick={() => history.push(`/device/detail?id=${record.id}`)}>
              详情
            </Button>
            <Divider type="vertical" />
            <Button style={{ padding: 0 }} type="link" onClick={() => onOption(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Button style={{ padding: 0 }} type="link" danger onClick={() => onDelete(record)}>
              删除
            </Button>
          </>
        ),
      },
    ],
    [groupList, onDelete, onOption],
  );

  useEffect(() => {
    queryDeviceGroup().then(({ data: list }) => {
      handleGroupList(list);
    });
  }, []);

  return (
    <PageHeaderWrapper>
      <ProTable<DeviceListItem>
        style={{ marginBottom: 20 }}
        rowKey="id"
        size="small"
        headerTitle="设备列表"
        tableAlertRender={false}
        actionRef={actionRef}
        columns={columns}
        request={({ pageSize = 20, current = 1, ...rest }) => {
          return queryDeviceList({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            devTypes: 1,
            ...rest,
          });
        }}
        rowSelection={false}
        search={{
          defaultCollapsed: false,
        }}
        options={{
          reload: true,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        toolBarRender={() => [
          <Button key="create" icon={<PlusOutlined />} type="primary" onClick={() => onOption()}>
            新建
          </Button>,
        ]}
      />
      <DeviceModal
        visible={modalVisible}
        data={selectedData}
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (success: boolean) => {
          if (success) {
            handleModalVisible(false);
            handleSelectedData(undefined);
            actionRef?.current?.reload();
          }
        }}
      />
    </PageHeaderWrapper>
  );
};

export default DeviceList;
