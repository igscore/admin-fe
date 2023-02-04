import React from 'react';
import { connect } from 'umi';
import { Avatar, Skeleton } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { ConnectState } from '@/models/connect';
import logo from '@/assets/logo-1.svg';

import CalendarPage from '@/pages/calendar/detail/CalendarPage';

import styles from './style.less';

interface Props {
  userInfo: ConnectState['user']['currentUser'];
}

const PageHeaderContent: React.FC<{ user: Props['userInfo'] }> = ({ user }) => {
  const loading = user && Object.keys(user).length;
  if (!loading) {
    return <Skeleton paragraph={{ rows: 1 }} avatar active />;
  }
  return (
    <div className={styles.pageHeaderContent}>
      <div className={styles.avatar}>
        <Avatar src={logo} />
      </div>
      <div className={styles.content}>
        <div className={styles.contentTitle}>易企管理后台</div>
        <div>
          {user?.name} - {user?.mainDepartment?.name}
        </div>
      </div>
    </div>
  );
};

// const ExtraContent: React.FC = () => (
//   <div className={styles.extraContent}>
//     <div className={styles.statItem}>
//       <Statistic title="项目数" value={56} />
//     </div>
//     <div className={styles.statItem}>
//       <Statistic title="团队内排名" value={8} suffix="/ 24" />
//     </div>
//     <div className={styles.statItem}>
//       <Statistic title="项目访问" value={2223} />
//     </div>
//   </div>
// );

const TenantHome: React.FC<Props> = (props) => {
  const { userInfo } = props;
  return (
    <PageHeaderWrapper
      title={false}
      content={<PageHeaderContent user={userInfo} />}
      // extraContent={<ExtraContent />}
    >
      <CalendarPage />
    </PageHeaderWrapper>
  );
};

export default connect(({ user }: ConnectState) => ({
  userInfo: user.currentUser,
}))(TenantHome);
