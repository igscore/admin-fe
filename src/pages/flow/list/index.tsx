import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import FlowList from './components/FlowList';

const FlowPage: React.FC = () => {
  return (
    <PageHeaderWrapper>
      <FlowList />
    </PageHeaderWrapper>
  );
};

export default FlowPage;
