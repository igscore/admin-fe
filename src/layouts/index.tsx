import { PageContainer, ProLayout } from '@ant-design/pro-components';
import { history } from 'umi';
import Menu from './menu';

export default (props: any) => (
  <div
    style={{
      height: '100vh',
    }}
  >
    <ProLayout
      locale="en-US"
      collapsed={false}
      collapsedButtonRender={false}
      route={Menu}
      logo="https://www.igscore.com/img/favicon.ico"
      title="IgScore AD Platform"
      menu={{
        defaultOpenAll: true,
        hideMenuWhenCollapsed: true,
        ignoreFlatMenu: true,
      }}
      avatarProps={{
        src: 'https://gw.alipayobjects.com/zos/antfincdn/efFD%24IOql2/weixintupian_20170331104822.jpg',
        size: 'small',
        title: 'admin',
      }}
      menuItemRender={(item: any, dom) => (
        <a
          onClick={() => {
            history.push(item.path);
          }}
        >
          {dom}
        </a>
      )}
      contentStyle={{ background: '#fff' }}
    >
      <PageContainer>{props.children}</PageContainer>
    </ProLayout>
  </div>
);
