import React, { useState } from 'react';
import { Button, Form, Input, Select, Space, Image, Upload } from 'antd';
import {  RedoOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons';
import styles from './index.less';
import { AdPositionList } from '@/constant/config';

const { TextArea } = Input;

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [username, setName] = useState("")
  const [password, setPassworrd] = useState("")

  const handleChange = () => {

  }
  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Form
          name="Create Ad"
          labelCol={{ span: 10 }}
          wrapperCol={{ span: 16 }}
          autoComplete="off"
        >
          <Form.Item
            label="Ad Title"
            name="title"
            rules={[{ required: true, message: 'Please input your Ad Title!' }]}
          >
            <Input placeholder="Input Ad Title"  onChange={(e) => {setName(e.target.value)}} />
          </Form.Item>

          <Form.Item
            label="Ad position"
            name="position"
            rules={[{ required: true, message: 'Please input your Ad position!' }]}
          >
            <Select
              defaultValue={AdPositionList[0].id}
              // style={{ width: 120 }}
              onChange={handleChange}
              options={AdPositionList}
            />

            <Image
              style={{margin: '10px 0'}}
              width={300}
              src={require('../../../public/img/home.png')}
            />
          </Form.Item>

          <Form.Item label="Ad Size" style={{ marginBottom: 0 }}>
            <Form.Item
              name="width"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input placeholder="Input Ad Width" />
            </Form.Item>
            <Form.Item
              name="height"
              rules={[{ required: true }]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)', margin: '0 8px' }}
            >
              <Input placeholder="Input Ad Height" />
            </Form.Item>
          </Form.Item>

          <Form.Item
            label="Ad Link"
            name="link"
            rules={[{ required: true, message: 'Please input your Ad Link!' }]}
          >
            <Input placeholder="Input Ad Link" onChange={(e) => {setName(e.target.value)}} />
          </Form.Item>

          <Form.Item
            label="Ad Image"
            name="image"
            rules={[{ required: true, message: 'Please input your Ad Link!' }]}
          >
            <Upload
              action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
              listType="picture"
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Upload (Max: 1)</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            label="Ad Customer"
            name="customer"
            rules={[{ required: true, message: 'Please input your Ad Customer!' }]}
          >
            <Input placeholder="Input Ad Customer" onChange={(e) => {setName(e.target.value)}} />
          </Form.Item>

          <Form.Item
            label="Ad Description"
            name="description"
            rules={[{ required: false, message: 'Please input your Ad Description!' }]}
          >
            <TextArea placeholder="Input Ad Description" rows={4} />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Space wrap style={{ marginBottom: 16 }}>
              <Button type="primary">
                <PlusOutlined />
                Create
              </Button>
              <Button>
                <RedoOutlined />
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
