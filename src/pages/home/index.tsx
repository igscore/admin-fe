import React, { useEffect, useState } from 'react';
import { Space, Table, Modal, Button, notification, Tag } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { getAdList, updateAd } from '@/model/api';
import { history, Link } from 'umi';
import { PositionSizeMap } from '@/constant/config';

const { confirm } = Modal;

interface DataType {
  key: string;
  name: string;
  id: number;
  size: string;
  image: string;
  status: 0 | 1;
  position: string;
  createdBy: string;
}

// const data: any[] = [
//   {
//     "id": 470973,
//     "name": "test",
//     "country": "CN",
//     "client": "123",
//     "platform": "ios",
//     "position": "homepage",
//     "length": 300,
//     "width": 100,
//     "status": 1,
//     "imageUrl": "http://fasdfasf",
//     "description": "web home page",
//     "modifiedBy": "igscore",
//     "createdBy": "igscore",
//     "startTime": 1672924629,
//     "endTime": 1794431829
//   }
// ];

const App: React.FC = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getList = () => {
    setLoading(true);
    getAdList()
      .then((d: any) => {
        setList(
          d.result.filter(
            (item: DataType) => item.id == 368 || item.createdBy === 'igAdmin',
          ),
        );
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  const update = (data: DataType, status: number) => {
    updateAd(Object.assign(data, { status }))
      .then(() => {
        notification.success({
          key: 'success',
          message: 'Success',
          description: 'Modify successfully',
        });
        getList();
      })
      .catch(() => {
        notification.error({
          key: 'update valid',
          message: 'Error',
          description: 'Please try again.',
        });
      });
  };

  const offline = (data: DataType) => {
    confirm({
      icon: '',
      content: 'Are you sure to OffLine this AD?',
      onOk() {
        console.log('OK');
        update(data, 0);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const onLine = (data: DataType) => {
    confirm({
      icon: '',
      content: 'Are you sure to OnLine this AD?',
      onOk() {
        console.log('OK');
        update(data, 1);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  const columns: ColumnsType<DataType> = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Image Url',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
    },
    {
      title: 'Platform',
      dataIndex: 'platform',
      key: 'platform',
    },
    {
      title: 'Position',
      dataIndex: 'position',
      key: 'position',
    },
    {
      title: 'Width * Height',
      key: 'width',
      render: (text, record) => (
        <span>
          {PositionSizeMap[record.position]?.width} *{' '}
          {PositionSizeMap[record.position]?.height}
        </span>
      ),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'CreatedBy',
      dataIndex: 'createdBy',
      key: 'createdBy',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (text) => {
        if (text === 1) {
          return <Tag color="success">active</Tag>;
        }
        return <Tag color="default">offline</Tag>;
      },
    },
    {
      title: 'Options',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`./adslotcreate?id=${record.id}`}>Edit</Link>
          {record.status !== 0 ? (
            <Button onClick={() => offline(record)}>OffLine</Button>
          ) : (
            <Button
              onClick={() => {
                onLine(record);
              }}
              type="primary"
            >
              OnLine
            </Button>
          )}
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getList();
  }, []);

  return (
    <div>
      <Space wrap style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          onClick={() => {
            history.push('/adslotcreate');
          }}
        >
          <PlusOutlined />
          Create
        </Button>
        <Button onClick={getList}>
          <RedoOutlined />
          Refresh
        </Button>
      </Space>
      <Table
        loading={loading}
        columns={columns}
        dataSource={list}
        rowKey="id"
      />
    </div>
  );
};

export default App;
