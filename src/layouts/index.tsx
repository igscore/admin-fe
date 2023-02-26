import { goLogout } from '@/model/api';
import { PageContainer, ProLayout, DefaultFooter } from '@ant-design/pro-components';
import { Button, ConfigProvider } from 'antd';
import { useCallback } from 'react';
import { history } from 'umi';
import enUS from 'antd/locale/en_US';
import Menu from './menu';

import logo from '../../public/img/logo.png';
import styles from './index.less';

export default (props: any) => {
  const isLoginPage = history.location.pathname.indexOf('login') > -1;
  const params = {
    avatarProps: {
      src: 'https://www.igscore.com/img/favicon.ico',
      size: 'small',
      title: 'admin',
    },
    route: Menu,
  };

  const logout = useCallback(() => {
    goLogout().finally(() => {
      history.replace('/login');
    });
  }, []);

  if (isLoginPage) {
    return <PageContainer style={{ background: '#fff' }}>{props.children}</PageContainer>;
  }

  return (
    <ConfigProvider locale={enUS}>
      <div className={styles.container}>
        {/* @ts-ignore */}
        <ProLayout
          locale="en-US"
          title="AD Platform"
          loading={false}
          logo={
            <div className={styles.header}>
              <img className={styles.logo} src={logo} alt="logo" />
            </div>
          }
          menu={{
            defaultOpenAll: true,
            hideMenuWhenCollapsed: true,
            ignoreFlatMenu: true,
          }}
          {...params}
          menuItemRender={(item: any, dom) => <a onClick={() => history.push(item.path)}>{dom}</a>}
          menuFooterRender={() => <Button onClick={logout}>Logout</Button>}
          footerRender={() => <DefaultFooter copyright="igscore" />}
        >
          <PageContainer style={{ background: '#fff' }}>{props.children}</PageContainer>
        </ProLayout>
      </div>
    </ConfigProvider>
  );
};
