import React, { useEffect, useState } from 'react';
import { Space, Table, Modal, Button, notification } from 'antd';
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
  image: string
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
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)

  const getList = () => {
    setLoading(true)
    getAdList()
    .then((d) => {
      setList(d.result)
      setLoading(false)
    })
    .catch(() => {
      setLoading(false)
    })
  }

  const update = (data, status) => {
    updateAd(Object.assign(data, {status}))
    .then((d) => {
      notification.success({
        key: 'success',
        message: 'Success',
        description: 'Update Successed',
      })
      getList()
    })
    .catch(() => {
      notification.error({
        key: 'update valid',
        message: 'Error',
        description: 'Please try again',
      })
    })
  }

  const offline = (data) => {
    confirm({
      icon: '',
      content: 'Are you sure to OffLine this AD?',
      onOk() {
        console.log('OK');
        update(data, 0)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const onLine = (data) => {
    confirm({
      icon: '',
      content: 'Are you sure to OnLine this AD?',
      onOk() {
        console.log('OK');
        update(data, 1)
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const columns: ColumnsType<DataType> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Image Url',
      dataIndex: 'image',
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
      dataIndex: 'size',
      key: 'width',
      render: (text, record, index) => (
        <span>{PositionSizeMap[record.pos]?.width} * {PositionSizeMap[record.pos]?.height}</span>
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
    },
    {
      title: 'Options',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Link to={`./adslotcreate?id=${record.id}`}>Edit</Link>
          {
            record.status !== 0 ? <Button onClick={() => {offline(record)}}>OffLine</Button> : <Button onClick={() => {onLine(record)}} type='primary'>OnLine</Button>
          }
        </Space>
      ),
    },
  ];

  useEffect(() => {
    getList()
  }, [])
  return (
    <div>
      <Space wrap style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => {history.push("/adslotcreate")}}>
          <PlusOutlined />
          Create
        </Button>
        <Button onClick={getList}>
          <RedoOutlined />
          Refresh
        </Button>
      </Space>
      <Table loading={loading} columns={columns} dataSource={list} rowKey="id"/>
    </div>
  );
};

export default App;
