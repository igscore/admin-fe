import React, { useEffect } from 'react';
import { Space, Table, Tag, Button } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { RedoOutlined, PlusOutlined } from '@ant-design/icons';
import { getAdList } from '@/model/api';
import { history } from 'umi';

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
    key: 'image',
  },
  {
    title: 'Options',
    key: 'action',
    render: (_, record) => (
      <Space size="middle">
        <a>Edit</a>
        <a>Delete</a>
      </Space>
    ),
  },
];

const data: DataType[] = [
  {
    key: '1',
    name: 'John Brown',
    id: 32,
    size: 'New York No. 1 Lake Park',
    image: '12'
  },
  {
    key: '2',
    name: 'Jim Green',
    id: 42,
    size: 'London No. 1 Lake Park',
    image: '12'
  },
  {
    key: '3',
    name: 'Joe Black',
    id: 32,
    size: 'Sidney No. 1 Lake Park',
    image: '12'
  },
];

const App: React.FC = () => {

  useEffect(() => {
    getAdList()
  }, [])
  return (
    <div>
      <Space wrap style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={() => {history.push("/adcreate")}}>
          <PlusOutlined />
          Create
        </Button>
        <Button>
          <RedoOutlined />
          Refresh
        </Button>
      </Space>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default App;
