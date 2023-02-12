import React, { useState } from 'react';
import { Button, Form, Input } from 'antd';
import styles from './index.less';
import { goLogin } from '@/model/api';

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [username, setName] = useState("admin")
  const [password, setPassworrd] = useState("igscoreAdmin")

  const goToLogin = () => {
    goLogin({username, password})
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input value={username} onChange={(e) => {setName(e.target.value)}} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password value={password} onChange={(e) => {setPassworrd(e.target.value)}}  />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" onClick={goToLogin}>
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
