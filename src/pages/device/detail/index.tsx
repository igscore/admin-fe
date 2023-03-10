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

  // ??????????????????????????????????????????????????????
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
        title: 'MAC??????',
        key: 'mac',
        dataIndex: 'mac',
        editable: editable ? undefined : false,
      },
      {
        title: '????????????',
        key: 'password',
        dataIndex: 'password',
        valueType: 'password',
        editable: editable ? undefined : false,
      },
      {
        title: '???????????????m???',
        key: 'distanceLimit',
        dataIndex: 'distanceLimit',
        valueType: 'digit',
        editable: false,
      },
      {
        title: '??????',
        key: 'groupId',
        dataIndex: 'groupId',
        editable: editable ? undefined : false,
        valueEnum: groupList.reduce((enums, { id, name }) => ({ ...enums, [id]: name }), {}),
      },
      {
        title: '??????',
        key: 'name',
        dataIndex: 'name',
        editable: editable ? undefined : false,
      },
      {
        title: '????????????',
        key: 'description',
        dataIndex: 'description',
        editable: editable ? undefined : false,
      },
      {
        title: '?????????',
        key: 'createBy',
        dataIndex: 'createBy',
        editable: false,
      },
      {
        title: '????????????',
        key: 'createAt',
        dataIndex: 'createAt',
        valueType: 'dateTime',
        editable: false,
      },
      {
        title: '?????????',
        key: 'updateBy',
        dataIndex: 'updateBy',
        editable: false,
      },
      {
        title: '????????????',
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
        title: '?????????ID',
        dataIndex: 'id',
        key: 'id',
      },
      {
        title: '???????????????',
        dataIndex: 'address',
        key: 'address',
      },
      {
        title: '?????????????????????',
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
              {isExpanded ? '????????????' : '????????????'}
            </Button>
          );
        },
      },
      {
        title: '??????',
        dataIndex: 'option',
        key: 'option',
        render: (_, record) => {
          return (
            <>
              <Button type="link" style={{ padding: 8 }} onClick={() => handleFlow(record.id)}>
                ????????????
              </Button>
              <Divider type="vertical" />
              <Button type="link" style={{ padding: 8 }} onClick={() => handleOperationPoint(record)}>
                ??????
              </Button>
              <Divider type="vertical" />
              <Popconfirm
                placement="top"
                title={`???????????????${record.address}????????????`}
                onConfirm={async () => {
                  const success = await askToDeleteOperationPoint(record.id);
                  if (success) {
                    await queryPointList();
                  }
                }}
              >
                <Button size="small" type="link" danger>
                  ??????
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
    <PageHeaderWrapper title="????????????">
      <Card style={{ marginBottom: 20 }}>
        <ProDescriptions<DeviceDetailInfo>
          actionRef={actionRef}
          title="????????????"
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
                  ??????
                </Button>
                <Button
                  onClick={() => {
                    handleEditable(false);
                    actionRef.current?.reload();
                  }}
                >
                  ??????
                </Button>
              </>
            ) : (
              <Button onClick={() => handleEditable(true)}>??????</Button>
            )
          }
        />
      </Card>
      <Card
        title="?????????????????????"
        extra={
          <Button type="primary" onClick={() => handleOperationPoint()}>
            ???????????????
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
                  title: '??????ID',
                  dataIndex: 'flowDefId',
                  key: 'flowDefId',
                },
                {
                  title: '??????',
                  dataIndex: 'option',
                  key: 'option',
                  render: (_, record) => {
                    return (
                      <>
                        <Link target="_blank" to={`/flow/editor?id=${record.flowDefId}`}>
                          ????????????
                        </Link>
                        <Divider type="vertical" />
                        <Popconfirm
                          placement="top"
                          title={`????????????${record.flowDefId}`}
                          onConfirm={() => handleFlow(point.id, record)}
                        >
                          <Button size="small" type="link" danger>
                            ??????
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

      {/* ??????/??????????????? */}
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

      {/* ????????????????????? */}
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
