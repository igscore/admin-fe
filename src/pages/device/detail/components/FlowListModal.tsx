import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'umi';
import { Modal, Tag, message } from 'antd';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import { FlowTemplateStateEnum, FlowTemplateStateMaps, queryFlowListByAcl } from '@/pages/flow/list/service';
import { queryFlowCategory } from '@/pages/flow/category/service';
import type { FlowCategoryItem } from '@/pages/flow/category/data';
import type { FlowListItem } from '@/pages/flow/list/data';
import { askToBindFlow, queryOperationPointDetail } from '@/pages/device/detail/service';

interface Props {
  visible: boolean;
  pointId?: number;
  onSubmit: () => void;
  onCancel: () => void;
}

const FlowListModal: React.FC<Props> = (props) => {
  const { visible, pointId, onSubmit, onCancel } = props;
  const [confirmLoading, handleConfirmLoading] = useState<boolean>(false);
  const [flowCategory, handleFlowCategory] = useState<FlowCategoryItem[]>([]);
  const [selectedRowKeys, handleSelectedRowKeys] = useState<number[]>([]);
  const actionRef = useRef<ActionType>();

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
          <Link target="_blank" to={`/flow/editor?id=${record.id}`}>
            查看
          </Link>
        ),
      },
    ],
    [flowCategory],
  );

  const querySelectedRows = useCallback(
    async (current: number) => {
      if (pointId && current === 1) {
        const { data } = await queryOperationPointDetail(pointId);
        handleSelectedRowKeys(data?.flowDefBinds?.map(({ flowDefId }) => flowDefId) || []);
      }
    },
    [pointId],
  );

  const onOk = useCallback(async () => {
    if (!selectedRowKeys?.length) {
      message.warn('请先选择一个流程');
      return;
    }
    if (confirmLoading) {
      return;
    }
    handleConfirmLoading(true);
    if (pointId) {
      const { success } = await askToBindFlow(pointId, selectedRowKeys);
      if (success) {
        onSubmit();
      }
    }
    handleConfirmLoading(false);
  }, [confirmLoading, pointId, onSubmit, selectedRowKeys]);

  useEffect(() => {
    if (visible) {
      queryFlowCategory().then(({ data: categories }) => {
        handleFlowCategory(categories);
      });
    } else {
      handleSelectedRowKeys([]);
      if (actionRef.current?.clearSelected) {
        actionRef.current?.clearSelected();
      }
    }
  }, [visible]);

  return (
    <Modal
      bodyStyle={{ padding: 0 }}
      width={1000}
      closable={false}
      visible={visible}
      onOk={onOk}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      destroyOnClose
    >
      <ProTable<FlowListItem>
        rowKey="id"
        size="small"
        actionRef={actionRef}
        headerTitle="选择流程"
        tableAlertRender={false}
        columns={columns}
        rowSelection={{
          type: 'checkbox',
          selectedRowKeys,
          onChange: (keys) => handleSelectedRowKeys(keys as number[]),
        }}
        pagination={{
          pageSize: 10,
          showSizeChanger: false,
        }}
        search={{
          defaultCollapsed: true,
          span: 8,
        }}
        options={{
          reload: true,
          density: false,
          fullScreen: false,
          setting: false,
        }}
        request={async ({ pageSize = 10, current = 1, state, ...searchParams }) => {
          const [data] = await Promise.all([
            queryFlowListByAcl({
              limit: pageSize,
              offset: (current - 1) * pageSize,
              state: parseInt(state, 10) === 0 ? null : state,
              ...searchParams,
            }),
            querySelectedRows(current),
          ]);
          return data;
        }}
      />
    </Modal>
  );
};

export default FlowListModal;
