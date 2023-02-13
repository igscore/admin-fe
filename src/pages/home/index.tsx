import React, { useEffect, useState } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { getAdList } from '@/model/api';
import { history, Link } from 'umi';

interface DataType {
  key: string;
  name: string;
  id: number;
  size: string;
  image: string
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
    title: 'Size',
    dataIndex: 'size',
    key: 'width',
    render: (text, record, index) => (
      <span>{record.width}</span>
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
        <a>Delete</a>
      </Space>
    ),
  },
];

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
  const getList = () => {
    getAdList()
    .then((d) => {
      setList(d.result)
    })
  }
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
      <Table columns={columns} dataSource={list} rowKey="id"/>
    </div>
  );
};

export default App;
