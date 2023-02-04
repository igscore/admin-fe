import { Settings as ProSettings } from '@ant-design/pro-layout';

type DefaultSettings = ProSettings & {
  pwa: boolean;
};

const proSettings: DefaultSettings = {
  navTheme: 'light',
  // 拂晓蓝
  primaryColor: '#2F54EB',
  layout: 'mix',
  contentWidth: 'Fluid',
  fixedHeader: false,
  fixSiderbar: true,
  colorWeak: false,
  headerHeight: 48,
  menu: {
    locale: false,
  },
  title: '易企管理后台',
  pwa: false,
  iconfontUrl: '',
};

export type { DefaultSettings };
export default proSettings;
