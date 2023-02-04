import React, { useRef, useMemo, useCallback, useState } from 'react';
import { Button, Popconfirm } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';

import TagModal from './components/TagModal';
import { askToDeleteCalendarTag, queryCalendarTagList } from './service';
import { CalendarTagItem } from './data';

const TagList: React.FunctionComponent = () => {
  const actionRef = useRef<ActionType>();
  const [visible, handleVisible] = useState<boolean>(false);

  const onDelete = useCallback(async (id: number) => {
    const success = await askToDeleteCalendarTag(id);
    if (success) {
      actionRef?.current?.reload();
    }
  }, []);

  const columns = useMemo(
    (): ProColumns<CalendarTagItem>[] => [
      {
        title: '编号',
        dataIndex: 'id',
      },
      {
        title: '名称',
        dataIndex: 'name',
      },
      {
        title: '操作',
        dataIndex: 'option',
        valueType: 'option',
        render: (_, record) => (
          <Popconfirm title={`确定删除「${record.name}」`} onConfirm={() => onDelete(record.id)}>
            <Button type="link" danger style={{ padding: 0 }}>
              删除
            </Button>
          </Popconfirm>
        ),
      },
    ],
    [],
  );

  return (
    <PageHeaderWrapper>
      <ProTable<CalendarTagItem>
        rowKey="id"
        headerTitle="表单列表"
        search={false}
        pagination={false}
        rowSelection={false}
        tableAlertRender={false}
        actionRef={actionRef}
        columns={columns}
        request={() => queryCalendarTagList()}
        options={{
          density: false,
          fullScreen: false,
          reload: true,
          setting: true,
        }}
        toolBarRender={() => [
          <Button type="primary" onClick={() => handleVisible(true)}>
            <PlusOutlined /> 新建
          </Button>,
        ]}
      />
      <TagModal
        visible={visible}
        onOk={() => {
          handleVisible(false);
          actionRef.current?.reload();
        }}
        onCancel={() => handleVisible(false)}
      />
    </PageHeaderWrapper>
  );
};

export default TagList;
