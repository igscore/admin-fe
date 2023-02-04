import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import PositionList from './component/PositionList';

const PositionPage: React.FC = () => {
  return (
    <PageHeaderWrapper>
      <PositionList />
    </PageHeaderWrapper>
  );
};

export default PositionPage;
