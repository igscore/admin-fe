import { LockOutlined, UserOutlined } from '@ant-design/icons';
import React, { useCallback, useState } from 'react';
import { notification, Button, Form, Input } from 'antd';
import { goLogin } from '@/model/api';
import { history } from 'umi';

import logo from '../../../public/img/logo.png';
import styles from './index.less';

const ue = 'ue-n';
const ud = 'ue-d';

const Login: React.FC = () => {
  const [username, setName] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const showError = useCallback((message: string) => {
    notification.error({ key: 'login', message: 'Error', description: message });
  }, []);

  const goToLogin = useCallback(() => {
    setLoading(true);
    goLogin({ username, password })
      .then((res: any) => {
        if (res.code === 'A00000' && res.message === 'Success.') {
          localStorage.setItem(ue, username);
          localStorage.setItem(ud, password);
          notification.success({
            key: 'login',
            message: 'Success',
            description: 'login successfully.',
          });
          history.replace('/');
        } else {
          showError(res.message || 'Login failed.');
        }
      })
      .catch((e) => {
        console.error(e?.response?.data?.message);
        showError(e?.response?.data?.message || 'Login failed.');
        // localStorage.setItem(ue, username);
        // localStorage.setItem(ud, password);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [username, password]);

  const onFinish = useCallback(
    (values: any) => {
      console.log('Success:', values);
      goToLogin();
    },
    [goToLogin],
  );

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.header}>
          <img className={styles.logo} src={logo} alt="logo" />
        </div>
        <Form name="basic" initialValues={{ remember: true }} onFinish={onFinish} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: 'Please input your username!' }]}>
            <Input
              prefix={<UserOutlined />}
              size="large"
              defaultValue={username}
              disabled={loading}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: 'Please input your password!' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              size="large"
              defaultValue={password}
              disabled={loading}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Item>

          <Form.Item>
            <Button loading={loading} type="primary" size="large" block htmlType="submit">
              Log in
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;
