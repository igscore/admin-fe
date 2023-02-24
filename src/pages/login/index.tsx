import React, { useEffect, useState } from 'react';
import { notification, Button, Form, Input } from 'antd';
import styles from './index.less';
import { goLogin } from '@/model/api';
import { history } from 'umi';

const ue = 'ue-n'
const ud = 'ue-d'

const App: React.FC = () => {
  const onFinish = (values: any) => {
    console.log('Success:', values);
    goToLogin()
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [username, setName] = useState('')
  const [password, setPassworrd] = useState('')

  useEffect(() => {
    // const name = localStorage.getItem(ue)
    // const pwd = localStorage.getItem(ud)
    // if(name) {
    //   setName(name)
    // }
    // if(pwd) {
    //   setPassworrd(pwd)
    // }

  }, [])

  const showError = (message: string) => {
    notification.error({
      key: 'error login',
      message: 'Error',
      description: message,
    })
  }

  const goToLogin = () => {
    goLogin({username, password})
    .then((res: any) => {
      if(res.code === 'A00000' && res.message === 'Success.') {
        localStorage.setItem(ue, username)
        localStorage.setItem(ud, password)
        notification.success({
          key: 'success login',
          message: 'Success',
          description: 'Success Login',
        })
        history.replace('/')
      } else {
        showError(res.message || 'Login fail')
      }
    })
    .catch((e) => {
      console.log(e.response.data.message)
      showError(e.response.data.message)
    })
  }

  return (
    <div className={styles.container}>
      <div className={styles.form}>
        <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input defaultValue={username} onChange={(e) => {setName(e.target.value)}} />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
          >
            <Input.Password defaultValue={password} onChange={(e) => {setPassworrd(e.target.value)}}  />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default App;
