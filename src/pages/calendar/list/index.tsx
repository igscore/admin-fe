import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Button, Divider, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import CalendarModal from './components/CalendarModal';
import { askToDeleteCalendar, queryCalendarList } from './service';
import { CalendarItem } from './data';

const CalendarList: React.FunctionComponent = () => {
  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedData, handleSelectedData] = useState<CalendarItem | undefined>();
  const actionRef = useRef<ActionType>();

  const onOption = useCallback((data?: CalendarItem) => {
    handleSelectedData(data);
    handleModalVisible(true);
  }, []);

  const onDelete = useCallback(async (id: number) => {
    const success = await askToDeleteCalendar(id);
    if (success) {
      handleSelectedData(undefined);
      actionRef?.current?.reload();
    }
  }, []);

  const columns = useMemo(
    (): ProColumns<CalendarItem>[] => [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '颜色',
        dataIndex: 'color',
        render: (_, record) => (
          <div
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              background: record.color,
            }}
          />
        ),
      },
      // {
      //   title: '颜色',
      //   dataIndex: 'tags',
      //   render: (_, record) => <>{record.tags.map(({ id, name }) => !!name && <Tag key={id}>{name}</Tag>)}</>,
      // },
      {
        title: '描述',
        dataIndex: 'description',
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
    <PageHeaderWrapper title={false}>
      <ProTable<CalendarItem>
        rowKey="id"
        headerTitle="日历列表"
        search={false}
        pagination={false}
        rowSelection={false}
        tableAlertRender={false}
        actionRef={actionRef}
        columns={columns}
        request={() => queryCalendarList()}
        options={{
          density: false,
          fullScreen: false,
          reload: true,
          setting: true,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => onOption()}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <CalendarModal
        visible={modalVisible}
        data={selectedData}
        onOk={() => {
          if (selectedData) {
            handleSelectedData(undefined);
          }
          handleModalVisible(false);
          actionRef?.current?.reload();
        }}
        onCancel={() => {
          if (selectedData) {
            handleSelectedData(undefined);
          }
          handleModalVisible(false);
        }}
      />
    </PageHeaderWrapper>
  );
};

export default CalendarList;
