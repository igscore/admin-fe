import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'umi';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ProDescriptions from '@ant-design/pro-descriptions';
import type { ProDescriptionsActionType, ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import type { ColumnsType } from 'antd/lib/table';

import { askToUpdateDevice } from '@/pages/device/list/service';
import { getPageQuery } from '@/utils/utils';
import { isOwnEmptyObj } from '@/utils/variable';

import { queryDeviceGroup } from '@/pages/device/category/service';
import type { DeviceGroupItem } from '@/pages/device/category/data';

import FlowListModal from './components/FlowListModal';
import OperationPointModal from './components/OperationPointModal';
import {
  askToDeleteOperationPoint,
  askToUnbindFlow,
  queryDeviceDetail,
  queryOperationPointDetail,
  queryOperationPoints,
} from './service';
import type { DeviceDetailInfo, FlowDefBindItem, OperationPointDetail, OperationPointItem } from './data';

const DeviceDetail: React.FC = () => {
  const [detail, handleDetail] = useState<DeviceDetailInfo>();
  const [editable, handleEditable] = useState<boolean>(false);
  const [groupList, handleGroupList] = useState<DeviceGroupItem[]>([]);

  const [expandedRowKeys, handleExpandedRowKeys] = useState<number[]>([]);
  const [operationPoints, handleOperationPoints] = useState<OperationPointItem[] | null>(null);
  const [operationPointDetailMaps, handleOperationPointDetailMaps] = useState<
    Record<string, OperationPointDetail | undefined>
  >({});

  const [modalVisible, handleModalVisible] = useState<boolean>(false);
  const [selectedPoint, handleSelectedPoint] = useState<Partial<OperationPointItem> & { devId: string }>();

  const [bindVisible, handleVisible] = useState<boolean>(false);
  const [selectedPointId, handleSelectedPointId] = useState<number>();

  const editedData = useRef<Record<string, string | number>>({});
  const actionRef = useRef<ProDescriptionsActionType>();
  const query = useMemo(getPageQuery, []);

  // 通过重新展示展开行来重新加载流程列表
  const queryCurrentOperationPoint = useCallback(
    (id: number, isExpanded?: boolean) => {
      if (!isExpanded) {
        handleExpandedRowKeys([...expandedRowKeys, id]);
      }
      queryOperationPointDetail(id).then(({ data }) => {
        handleOperationPointDetailMaps({
          ...operationPointDetailMaps,
          [id]: data,
        });
      });
    },
    [expandedRowKeys, operationPointDetailMaps],
  );

  const onSave = useCallback(
    async (params?: any) => {
      try {
        if (detail) {
          const values = params || editedData.current;
          if (!isOwnEmptyObj(values)) {
            const success = await askToUpdateDevice({
              ...values,
              id: query.id,
              ...(values.groupId ? { groupId: Number(values.groupId) } : {}),
            });
            if (success && !params) {
              editedData.current = {};
            }
          }
        }
        actionRef.current?.reload();
        handleEditable(false);
        // eslint-disable-next-line no-empty
      } catch (e) {}
    },
    [query.id, detail],
  );

  const handleOperationPoint = useCallback(
    async (point?: OperationPointItem) => {
      if (detail) {
        handleSelectedPoint({
          ...(point || {}),
          devId: detail.id,
        });
        handleModalVisible(true);
      }
    },
    [detail],
  );

  const handleFlow = useCallback(
    async (id: number, flow?: FlowDefBindItem) => {
      if (flow) {
        const { success } = await askToUnbindFlow(id, [flow.flowDefId]);
        if (success) {
          queryCurrentOperationPoint(id, true);
        }
      } else {
        handleSelectedPointId(id);
        handleVisible(true);
      }
    },
    [queryCurrentOperationPoint],
  );

  const queryPointList = useCallback(async () => {
    if (detail?.id) {
      const { data } = await queryOperationPoints({ devId: detail.id, offset: 0, limit: 100 });
      handleOperationPoints(data);
    }
  }, [detail?.id]);

  const columns = useMemo(
    (): ProDescriptionsItemProps<DeviceDetailInfo>[] => [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        editable: false,
      },
      {
        title: 'UUID',
        key: 'uuid',
        dataIndex: 'uuid',
        editable: false,
      },
      {
        title: 'MAC地址',
        key: 'mac',
        dataIndex: 'mac',
        editable: editable ? undefined : false,
      },
      {
        title: '设备密码',
        key: 'password',
        dataIndex: 'password',
        valueType: 'password',
        editable: editable ? undefined : false,
      },
      {
        title: '感应距离（m）',
        key: 'distanceLimit',
        dataIndex: 'distanceLimit',
        valueType: 'digit',
        editable: false,
      },
      {
        title: '分组',
        key: 'groupId',
        dataIndex: 'groupId',
        editable: editable ? undefined : false,
        valueEnum: groupList.reduce((enums, { id, name }) => ({ ...enums, [id]: name }), {}),
      },
      {
        title: '名称',
        key: 'name',
        dataIndex: 'name',
        editable: editable ? undefined : false,
      },
      {
        title: '描述信息',
        key: 'description',
        dataIndex: 'description',
        editable: editable ? undefined : false,
      },
      {
        title: '创建人',
        key: 'createBy',
        dataIndex: 'createBy',
        editable: false,
      },
      {
        title: '创建时间',
        key: 'createAt',
        dataIndex: 'createAt',
        valueType: 'dateTime',
        editable: false,
      },
      {
        title: '更新人',
        key: 'updateBy',
        dataIndex: 'updateBy',
        editable: false,
      },
      {
        title: '更新时间',
        key: 'updateAt',
        dataIndex: 'updateAt',
        valueType: 'dateTime',
        editable: false,
      },
    ],
    [editable, groupList],
  );

  const operationColumns = useMemo(
    (): ColumnsType<OperationPointItem> => [
      {
        title: '作业点ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '作业点位置',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '绑定的流程列表',
        key: 'address',
        render: (_, record) => {
          const isExpanded = !!expandedRowKeys.find((k) => k === record.id);
          return (
            <Button
              onClick={() => {
                if (isExpanded) {
                  handleOperationPointDetailMaps({
                    ...operationPointDetailMaps,
                    [record.id]: null,
                  });
                } else {
                  queryCurrentOperationPoint(record.id, isExpanded);
                }
                handleExpandedRowKeys(
                  isExpanded ? expandedRowKeys.filter((key) => key !== record.id) : [...expandedRowKeys, record.id],
                );
              }}
            >
              {isExpanded ? '点击收起' : '展开查看'}
            </Button>
          );
        },
      },
      {
        title: '操作',
        dataIndex: 'option',
        key: 'option',
        render: (_, record) => {
          return (
            <>
              <Button type="link" style={{ padding: 8 }} onClick={() => handleFlow(record.id)}>
                绑定流程
              </Button>
              <Divider type="vertical" />
              <Button type="link" style={{ padding: 8 }} onClick={() => handleOperationPoint(record)}>
                编辑
              </Button>
              <Divider type="vertical" />
              <Popconfirm
                placement="top"
                title={`确定删除「${record.address}」作业点`}
                onConfirm={async () => {
                  const success = await askToDeleteOperationPoint(record.id);
                  if (success) {
                    await queryPointList();
                  }
                }}
              >
                <Button size="small" type="link" danger>
                  删除
                </Button>
              </Popconfirm>
            </>
          );
        },
      },
    ],
    [
      expandedRowKeys,
      operationPointDetailMaps,
      queryCurrentOperationPoint,
      handleFlow,
      handleOperationPoint,
      queryPointList,
    ],
  );

  useEffect(() => {
    queryPointList();
  }, [detail, queryPointList]);

  useEffect(() => {
    queryDeviceGroup().then(({ data }) => {
      handleGroupList(data);
    });
  }, []);

  return (
    <PageHeaderWrapper title="设备详情">
      <Card style={{ marginBottom: 20 }}>
        <ProDescriptions<DeviceDetailInfo>
          actionRef={actionRef}
          title="基本信息"
          column={2}
          columns={columns}
          loading={false}
          editable={{
            onSave: (key, row) => {
              editedData.current[key as string] = row[key as string];
              return Promise.resolve();
            },
          }}
          request={async () => {
            const info = await queryDeviceDetail(query.id as string);
            if (info.data) {
              handleDetail(info.data);
            }
            return info;
          }}
          extra={
            editable ? (
              <>
                <Button type="primary" style={{ marginRight: 10 }} onClick={() => onSave()}>
                  保存
                </Button>
                <Button
                  onClick={() => {
                    handleEditable(false);
                    actionRef.current?.reload();
                  }}
                >
                  取消
                </Button>
              </>
            ) : (
              <Button onClick={() => handleEditable(true)}>编辑</Button>
            )
          }
        />
      </Card>
      <Card
        title="设备上的作业点"
        extra={
          <Button type="primary" onClick={() => handleOperationPoint()}>
            添加作业点
          </Button>
        }
      >
        <Table
          rowKey="id"
          loading={!operationPoints}
          columns={operationColumns}
          dataSource={operationPoints || []}
          pagination={false}
          expandable={{
            expandedRowKeys,
            columnWidth: 0,
            expandIcon: () => null,
            expandedRowRender: (point) => {
              const flowColumns: ColumnsType<FlowDefBindItem> = [
                {
                  title: '流程ID',
                  dataIndex: 'flowDefId',
                  key: 'flowDefId',
                },
                {
                  title: '操作',
                  dataIndex: 'option',
                  key: 'option',
                  render: (_, record) => {
                    return (
                      <>
                        <Link target="_blank" to={`/flow/editor?id=${record.flowDefId}`}>
                          查看流程
                        </Link>
                        <Divider type="vertical" />
                        <Popconfirm
                          placement="top"
                          title={`确定解绑${record.flowDefId}`}
                          onConfirm={() => handleFlow(point.id, record)}
                        >
                          <Button size="small" type="link" danger>
                            解绑
                          </Button>
                        </Popconfirm>
                      </>
                    );
                  },
                },
              ];
              return (
                <Table
                  size="small"
                  loading={!operationPointDetailMaps[point.id]?.flowDefBinds}
                  columns={flowColumns}
                  dataSource={operationPointDetailMaps[point.id]?.flowDefBinds || []}
                  pagination={false}
                  bordered
                />
              );
            },
          }}
        />
      </Card>

      {/* 创建/编辑作业点 */}
      <OperationPointModal
        visible={modalVisible}
        data={selectedPoint}
        onOk={() => {
          if (selectedPoint) {
            handleSelectedPoint(undefined);
          }
          handleModalVisible(false);
          queryPointList();
        }}
        onCancel={() => handleModalVisible(false)}
      />

      {/* 绑定作业点流程 */}
      <FlowListModal
        visible={bindVisible}
        pointId={selectedPointId}
        onSubmit={() => {
          if (selectedPointId) {
            queryCurrentOperationPoint(selectedPointId, !!expandedRowKeys.find((k) => k === selectedPointId));
          }
          handleSelectedPointId(undefined);
          handleVisible(false);
        }}
        onCancel={() => handleVisible(false)}
      />
    </PageHeaderWrapper>
  );
};

export default DeviceDetail;
