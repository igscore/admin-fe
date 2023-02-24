import React from 'react';
import { Space, Spin } from 'antd';
import './index.less'



const UmiLoading: React.FC = () => (
  <Space direction="vertical" style={{ width: '100%' }}>
    <Space className='content'>
      <Spin tip="Loading" size="large">
      </Spin>
    </Space>
  </Space>
);

export default UmiLoading;