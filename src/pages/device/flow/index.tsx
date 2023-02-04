import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import FlowList from '@/pages/flow/list/components/FlowList';

const DeviceFlowPage: React.FC = () => {
  return (
    <PageHeaderWrapper>
      <FlowList needAcl />
    </PageHeaderWrapper>
  );
};

export default DeviceFlowPage;
