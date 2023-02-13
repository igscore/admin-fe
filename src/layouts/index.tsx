import { goLogout } from '@/model/api';
import { PageContainer, ProLayout, DefaultFooter } from '@ant-design/pro-components';
import { Button, ConfigProvider } from 'antd';
import { history } from 'umi';
import enUS from 'antd/locale/en_US';
import Menu from './menu';

export default (props: any) => {
  const isLoginPage = history.location.pathname.indexOf('login') > -1;
  const params = {
    avatarProps: {
      src: 'https://www.igscore.com/img/favicon.ico',
      size: 'small',
      title: 'admin',
    },
    route: Menu,
  }
  if(isLoginPage) {
    return (
      <PageContainer style={{ background: '#fff' }}>
        {props.children}
      </PageContainer>
    )
  }

  const logout = () => {
    goLogout()
    .finally(() => {
      history.replace('/login')
    })
  }
  return (
    <ConfigProvider locale={enUS}>
      <div
        style={{
          height: '100vh',
        }}
      >
        <ProLayout
          loading={false}
          locale="en-US"
          logo="https://www.igscore.com/img/favicon.ico"
          title="IgScore AD Platform"
          menu={{
            defaultOpenAll: true,
            hideMenuWhenCollapsed: true,
            ignoreFlatMenu: true
          }}
          {...params}
          menuItemRender={(item: any, dom) => (
            <a
              onClick={() => {
                history.push(item.path);
              }}
            >
              {dom}
            </a>
          )}
          menuFooterRender={() => {
            return (
              <Button onClick={logout}>Log out</Button>
            );
          }}
          footerRender={() => (
            <DefaultFooter
              copyright="igscore"
            />
          )}
        >
          <PageContainer style={{ background: '#fff' }}>
            {props.children}
          </PageContainer>
        </ProLayout>
      </div>
    </ConfigProvider>
  );
};
