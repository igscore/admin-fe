import React from 'react';
import { AppleOutlined, LockOutlined, MailOutlined, MobileOutlined, UserOutlined } from '@ant-design/icons';
import styles from './index.less';

export default {
  UserName: {
    props: {
      size: 'large',
      id: 'account',
      prefix: <UserOutlined className={styles.prefixIcon} style={{ color: '#2F54EB' }} />,
      placeholder: '请输入用户帐号或手机号',
    },
    rules: [{ required: true, message: '请输入用户帐号或手机号，如有疑问请联系管理员' }],
  },
  Password: {
    props: {
      size: 'large',
      prefix: <LockOutlined className={styles.prefixIcon} style={{ color: '#2F54EB' }} />,
      type: 'password',
      id: 'password',
      placeholder: '请输入密码',
    },
    rules: [{ required: true, message: '请输入密码，如有疑问请联系管理员' }],
  },
  Mobile: {
    props: {
      size: 'large',
      prefix: <MobileOutlined className={styles.prefixIcon} style={{ color: '#2F54EB' }} />,
      placeholder: '请输入手机号',
    },
    rules: [
      { required: true, message: '请输入用户名' },
      { pattern: /^1\d{10}$/, message: '请输入正确的手机号' },
    ],
  },
  Captcha: {
    props: {
      size: 'large',
      prefix: <MailOutlined className={styles.prefixIcon} style={{ color: '#2F54EB' }} />,
      placeholder: '请输入验证码',
    },
    rules: [{ required: true, message: '请输入验证码' }],
  },
  Company: {
    props: {
      size: 'large',
      id: 'tenantAccount',
      prefix: <AppleOutlined className={styles.prefixIcon} style={{ color: '#2F54EB' }} />,
      placeholder: '请输入公司帐号',
      rules: [{ required: true, message: '请输入公司帐号，如有疑问请联系管理员' }],
    },
  },
};
