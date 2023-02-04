import React from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';

import CalendarPage from './CalendarPage';

const CalendarDetail: React.FunctionComponent = () => {
  return (
    <PageHeaderWrapper title={false}>
      <CalendarPage />
    </PageHeaderWrapper>
  );
};

export default CalendarDetail;
