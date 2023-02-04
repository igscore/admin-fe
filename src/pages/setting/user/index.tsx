import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import UserList from './components/UserList';

const UserPage: React.FC = () => {
  return (
    <PageHeaderWrapper content="本页面用于管理公司所有员工帐号">
      <UserList />
    </PageHeaderWrapper>
  );
};

export default UserPage;
