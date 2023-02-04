import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { Moment } from 'moment';
import { Button, Card } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProDescriptionsActionType, ProDescriptionsItemProps } from '@ant-design/pro-descriptions';
import ProDescriptions from '@ant-design/pro-descriptions';

import { askToUpdateUser, UserTypeMaps } from '@/pages/setting/user/service';
import { getPageQuery } from '@/utils/utils';
import Flex from '@/components/Flex';
import { isOwnEmptyObj } from '@/utils/variable';

import type { UploadAvatarData } from './components/UploadAvatar';
import UploadAvatar from './components/UploadAvatar';
import { queryUserDetail } from './service';
import type { UserDetailInfo } from './data';

const UserDetail: React.FC = () => {
  const [userData, handleUserData] = useState<UserDetailInfo>();
  const [editable, handleEditable] = useState<boolean>(false);
  const editedData = useRef<Record<string, string | number>>({});
  const actionRef = useRef<ProDescriptionsActionType>();

  const query = useMemo(getPageQuery, []);
  const columns = useMemo(
    (): ProDescriptionsItemProps<UserDetailInfo>[] => [
      {
        title: 'ID',
        key: 'id',
        dataIndex: 'id',
        editable: false,
      },
      {
        title: '工号',
        key: 'jobNumber',
        dataIndex: 'jobNumber',
        editable: false,
      },
      {
        title: '帐号',
        key: 'account',
        dataIndex: 'account',
        editable: false,
      },
      {
        title: '姓名',
        key: 'name',
        dataIndex: 'name',
        editable: editable ? undefined : false,
      },
      {
        title: '手机号码',
        key: 'phone',
        dataIndex: 'phone',
        editable: editable ? undefined : false,
      },
      {
        title: '状态',
        key: 'type',
        dataIndex: 'type',
        editable: editable ? undefined : false,
        valueType: 'select',
        valueEnum: {
          ...UserTypeMaps,
        },
      },
      {
        title: '所属部门',
        key: 'department',
        dataIndex: ['mainDepartment', 'fullName'],
        editable: false,
      },
      {
        title: '所在岗位',
        key: 'department',
        dataIndex: ['mainPosition', 'name'],
        editable: false,
      },
      {
        title: '入职时间',
        key: 'entryAt',
        dataIndex: 'entryAt',
        valueType: 'date',
        editable: editable ? undefined : false,
      },
      {
        title: '离职时间',
        key: 'resignAt',
        dataIndex: 'resignAt',
        valueType: 'date',
        editable: editable ? undefined : false,
      },
    ],
    [editable],
  );

  const onSave = useCallback(
    async (params?: any) => {
      try {
        if (userData) {
          const values = params || editedData.current;
          if (!isOwnEmptyObj(values)) {
            const success = await askToUpdateUser({
              id: Number(query.id),
              type: userData.type,
              ...values,
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
    [query.id, userData],
  );

  const onSaveAvatar = useCallback(
    ({ id, url }: UploadAvatarData) => {
      onSave({
        avatarId: id,
        avatarUrl: url,
      });
    },
    [onSave],
  );

  return (
    <PageHeaderWrapper title="用户详情" content="部门和岗位请至列表页修改">
      <Card>
        <Flex>
          <Flex direction="column" style={{ marginRight: 20 }}>
            <UploadAvatar avatarUrl={userData?.avatarUrl} onSave={onSaveAvatar} />
          </Flex>
          <div style={{ flex: 1 }}>
            <ProDescriptions<UserDetailInfo>
              actionRef={actionRef}
              title="基本信息"
              column={2}
              columns={columns}
              loading={false}
              editable={{
                onSave: (key, row) => {
                  if (key === 'entryAt' || key === 'resignAt') {
                    editedData.current[key as string] = (row[key as string] as Moment)?.valueOf() || '';
                  } else if (key === 'state') {
                    editedData.current[key as string] = Number(row[key as string]);
                  } else {
                    editedData.current[key as string] = row[key as string];
                  }
                  return Promise.resolve();
                },
              }}
              request={async () => {
                const info = await queryUserDetail(Number(query.id));
                if (info.data) {
                  handleUserData(info.data);
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
          </div>
        </Flex>
      </Card>
    </PageHeaderWrapper>
  );
};

export default UserDetail;
