import { CountryList } from '@/constant/country';
import React, { useEffect, useState } from 'react';
import { Space, Table, Modal, Button, notification, Tag, Image } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { getAdList, updateAd } from '@/model/api';
import { history, Link } from 'umi';
import { AdImageInfoMaps } from '@/constant/config';

const { confirm } = Modal;

interface DataType {
  key: string;
  name: string;
  id: number;
  size: string;
  image: string;
  status: 0 | 1;
  imageUrl: string;
  country: string;
  position: string;
  platform: string;
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
            (item: DataType) => item.id === 368 || item.id >= 380,
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
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (text, record) => <Image width={300} src={record.imageUrl} />,
    },
    {
      title: 'Country',
      dataIndex: 'country',
      key: 'country',
      render: (text, record) => {
        const country = CountryList.find(
          (item) => item.value === record.country,
        );
        return country?.label || '';
      },
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
      title: 'Size',
      key: 'width',
      render: (text, record) => {
        const size = AdImageInfoMaps?.[record.platform]?.[record.position];
        return size ? `${size.width}px * ${size.height}px` : '';
      },
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
        return <Tag color="default">disabled</Tag>;
      },
    },
    {
      title: 'Options',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`./adslotcreate?id=${record.id}`}>Edit</Link>
          {record.status !== 0 ? (
            <Button
              type="default"
              size="small"
              danger
              onClick={() => offline(record)}
            >
              offline
            </Button>
          ) : (
            <Button type="primary" size="small" onClick={() => onLine(record)}>
              online
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
