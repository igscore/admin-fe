import React, { useState, useRef, useMemo } from 'react';
import { Button, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable from '@ant-design/pro-table';
import type { ProColumns, ActionType } from '@ant-design/pro-table';

import CategoryModal from './components/CategoryModal';
import { askToDeleteFlow, queryFlowCategory } from './service';
import type { FlowCategoryItem } from './data';

const FlowCategory: React.FunctionComponent = () => {
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedData, handleSelectedData] = useState<FlowCategoryItem | undefined>();
  const actionRef = useRef<ActionType>();

  const onOption = (data?: FlowCategoryItem) => {
    handleSelectedData(data);
    handleModalVisible(true);
  };

  const onDelete = async (id: number) => {
    const success = await askToDeleteFlow(id);
    if (success) {
      handleSelectedData(undefined);
      actionRef?.current?.reload();
    }
  };

  const columns: ProColumns<FlowCategoryItem>[] = useMemo(
    () => [
      {
        title: '序号',
        dataIndex: 'sequence',
      },
      {
        title: '流程分组',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <>
            <Button type="link" style={{ padding: 0 }} onClick={() => onOption(record)}>
              编辑
            </Button>
            <Divider type="vertical" />
            <Popconfirm title={`确定要删除「${record.name}」?`} onConfirm={() => onDelete(record.id)}>
              <Button type="link" danger style={{ padding: 0 }}>
                删除
              </Button>
            </Popconfirm>
          </>
        ),
      },
    ],
    [],
  );

  return (
    <PageHeaderWrapper>
      <ProTable<FlowCategoryItem>
        rowKey="id"
        headerTitle="分组列表"
        tableAlertRender={false}
        search={false}
        rowSelection={false}
        actionRef={actionRef}
        columns={columns}
        request={() => queryFlowCategory()}
        options={{
          density: false,
          fullScreen: false,
          reload: true,
          setting: true,
        }}
        toolBarRender={() => [
          <Button key="create" type="primary" onClick={() => onOption()}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <CategoryModal
        visible={modalVisible}
        data={selectedData}
        onOk={() => {
          if (selectedData) {
            handleSelectedData(undefined);
          }
          handleModalVisible(false);
          actionRef?.current?.reload();
        }}
        onCancel={() => handleModalVisible(false)}
      />
    </PageHeaderWrapper>
  );
};

export default FlowCategory;
