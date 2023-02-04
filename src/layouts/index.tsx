import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { history } from 'umi';
import Menu from './menu';

export default (props: any) => {
  const isUnLogin = history.location.pathname.indexOf('login') > -1;
  const loginPrams = isUnLogin
    ? {}
    : {
        avatarProps: {
          src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
          size: 'small',
          title: 'admin',
        },
        route: Menu,
      };
  return (
    <div
      style={{
        height: '100vh',
      }}
    >
      <ProLayout
        loading
        locale="en-US"
        collapsed={false}
        collapsedButtonRender={false}
        logo="https://www.igscore.com/img/favicon.ico"
        title="IgScore AD Platform"
        menu={{
          defaultOpenAll: true,
          hideMenuWhenCollapsed: true,
          ignoreFlatMenu: true,
        }}
        {...loginPrams}
        menuItemRender={(item: any, dom) => (
          <a
            onClick={() => {
              history.push(item.path);
            }}
          >
            {dom}
          </a>
        )}
      >
        <PageContainer style={{ background: '#fff' }}>
          {props.children}
        </PageContainer>
      </ProLayout>
    </div>
  );
};
