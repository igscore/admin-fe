import React, { useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { connect, Link } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import type { ConnectProps, ConnectState } from '@/models/connect';
import type { CurrentCompany } from '@/models/user';
import logo from '@/assets/logo.svg';
import styles from './UserLayout.less';

// @ts-ignore
window.REACT_APP_TIME = REACT_APP_TIME;

interface Props extends ConnectProps {
  loading?: boolean;
  company?: Partial<CurrentCompany>;
}

const UserLayout: React.FC<Props> = ({ dispatch, loading, company, children }) => {
  useEffect(() => {
    if (dispatch) {
      dispatch({ type: 'user/queryCurrentCompany' });
    }
  }, [dispatch]);

  if (loading) {
    return <PageLoading />;
  }

  const companyName = company?.name || '易企';

  return (
    <>
      <Helmet>
        <title>登录 - {companyName}管理后台</title>
        <meta name="description" content={`登录 - ${companyName}管理后台`} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.top}>
            <Link to="/" className={styles.header}>
              <img alt="logo" className={styles.logo} src={company?.logoUrl || logo} />
              <span className={styles.title}>{companyName}管理后台</span>
            </Link>
            <div className={styles.desc}>协同创造效率 效率决定未来</div>
          </div>
          {children}
        </div>
        {/* <DefaultFooter copyright="2021 上海三头牛科技有限责任公司出品" links={[]} /> */}
      </div>
    </>
  );
};

export default connect(({ loading, user }: ConnectState) => ({
  company: user.currentCompany,
  loading: loading.models.user,
}))(UserLayout);
