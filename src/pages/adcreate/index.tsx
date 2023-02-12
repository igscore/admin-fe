import React, { useState } from 'react';
import { Button, Form, Input, Select, Space } from 'antd';
import {  RedoOutlined, PlusOutlined } from '@ant-design/icons';
import styles from './index.less';
import { goLogin } from '@/model/api';
import { AdPositionList, LanguageList } from '@/constant/config';

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
            label="Language of delivery"
            name="language"
            rules={[{ required: true, message: 'Please select your delivery language!' }]}
          >
            <Select
              defaultValue="en"
              // style={{ width: 120 }}
              onChange={handleChange}
              options={LanguageList}
            />
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
