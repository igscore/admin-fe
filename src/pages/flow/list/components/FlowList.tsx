import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { history, Link } from 'umi';
import { Button, Divider, Modal, Tag } from 'antd';
import { ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';

import { queryFlowCategory } from '@/pages/flow/category/service';
import type { FlowCategoryItem } from '@/pages/flow/category/data';

import FlowModal from './FlowModal';
import {
  askToDeleteFlow,
  askToDisableFlow,
  askToEnableFlow,
  FlowTemplateStateEnum,
  FlowTemplateStateMaps,
  queryFlowListByAcl,
  queryFlowListByFilter,
} from '../service';
import type { FlowListItem } from '../data';

interface FlowListProps {
  needAcl?: boolean;
}

const FlowList: React.FC<FlowListProps> = ({ needAcl }) => {
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedData, handleSelectedData] = useState<FlowListItem>();
  const [flowCategory, handleFlowCategory] = useState<FlowCategoryItem[]>([]);
  const actionRef = useRef<ActionType>();

  const queryFlow = useMemo(() => (needAcl ? queryFlowListByAcl : queryFlowListByFilter), [needAcl]);

  const onEnable = useCallback((data: FlowListItem) => {
    Modal.confirm({
      title: `确定启用「${data.name}」流程模版？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      content: '启用成功后请在「已启用」中查看',
      onOk: async () => {
        const success = await askToEnableFlow(data.id);
        if (success) {
          actionRef?.current?.reload();
        }
      },
    });
  }, []);

  const onDisable = useCallback((data: FlowListItem) => {
    Modal.confirm({
      title: `确定停用「${data.name}」流程模版？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      content: '停用的模板不会被删除，请在「已停用」中查看',
      onOk: async () => {
        const success = await askToDisableFlow(data.id);
        if (success) {
          actionRef?.current?.reload();
        }
      },
    });
  }, []);

  const onDelete = useCallback((data: FlowListItem) => {
    Modal.confirm({
      title: `确定删除「${data.name}」流程模版？`,
      icon: <ExclamationCircleOutlined />,
      okText: '确定',
      cancelText: '取消',
      onOk: async () => {
        const success = await askToDeleteFlow(data.id);
        if (success) {
          actionRef?.current?.reload();
        }
      },
    });
  }, []);

  const onOption = useCallback(
    (data?: FlowListItem) => {
      // 编辑
      if (data) {
        handleSelectedData(data);
        handleModalVisible(true);
      } else {
        // 创建
        history.push(`/flow/editor${needAcl ? '?needAcl=1' : ''}`);
      }
    },
    [needAcl],
  );

  const columns = useMemo(
    (): ProColumns<FlowListItem>[] => [
      {
        title: '流程名称',
        dataIndex: 'name',
      },
      {
        title: '流程分组',
        dataIndex: 'categoryId',
        filters: [],
        valueEnum: flowCategory.reduce(
          (enums, { id, name }) => ({
            ...enums,
            [id]: name,
          }),
          {},
        ),
      },
      {
        title: '状态',
        dataIndex: 'state',
        initialValue: String(FlowTemplateStateEnum.Enable),
        valueType: 'radioButton',
        valueEnum: {
          '0': '全部',
          [FlowTemplateStateEnum.Enable]: '已启用',
          [FlowTemplateStateEnum.Disable]: '已停用',
        },
        render: (_, record) => {
          const label = FlowTemplateStateMaps[record.state];
          if (label) {
            return <Tag color={label.tag}>{label.text}</Tag>;
          }
          return '--';
        },
      },
      {
        title: '流程描述',
        dataIndex: 'description',
        search: false,
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        search: false,
        render: (_, record) => (
          <>
            <Button style={{ padding: 0 }} type="link" onClick={() => onOption(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Button
              style={{ padding: 0 }}
              type="link"
              danger={record.state === FlowTemplateStateEnum.Enable}
              onClick={() => {
                if (record.state === FlowTemplateStateEnum.Disable) {
                  onEnable(record);
                } else {
                  onDisable(record);
                }
              }}
            >
              {record.state === FlowTemplateStateEnum.Disable ? '启用' : '停用'}
            </Button>
            <Divider type="vertical" />
            <Link to={`/flow/editor?id=${record.id}${needAcl ? '&needAcl=1' : ''}`}>查看</Link>
            {record.state === 1 && (
              <>
                <Divider type="vertical" />
                <Button style={{ padding: 0 }} type="link" danger onClick={() => onDelete(record)}>
                  删除
                </Button>
              </>
            )}
          </>
        ),
      },
    ],
    [flowCategory, needAcl, onDelete, onDisable, onEnable, onOption],
  );

  useEffect(() => {
    queryFlowCategory().then(({ data: categories }) => {
      handleFlowCategory(categories);
    });
  }, []);

  return (
    <>
      <ProTable<FlowListItem>
        style={{ marginBottom: 20 }}
        rowKey="id"
        size="small"
        headerTitle="流程列表"
        tableAlertRender={false}
        actionRef={actionRef}
        columns={columns}
        request={({ pageSize = 20, current = 1, state, ...searchParams }) => {
          return queryFlow({
            limit: pageSize,
            offset: (current - 1) * pageSize,
            state: parseInt(state, 10) === 0 ? null : state,
            ...searchParams,
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
      <FlowModal
        visible={modalVisible}
        data={selectedData}
        needAcl={needAcl}
        onCancel={() => handleModalVisible(false)}
        onSubmit={async (success: boolean) => {
          if (success) {
            handleModalVisible(false);
            actionRef?.current?.reload();
          }
        }}
      />
    </>
  );
};

export default FlowList;
