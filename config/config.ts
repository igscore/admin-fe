import { defineConfig } from 'umi';
import slash from 'slash2';
import proxy from './proxy';
import defaultSettings from './defaultSettings'; // https://umijs.org/config/
import routes from './routes';
import { transferTimeTo } from './utils';
import webpackPlugin from './plugin.config';

const { REACT_APP_ENV } = process.env; // 页面全局变量

export default defineConfig({
  routes,
  title: false,
  hash: true,
  history: {
    type: 'browser',
  },
  targets: {
    ie: 8,
  },
  devServer: {
    port: 8003,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  define: {
    REACT_APP_ENV: REACT_APP_ENV || false,
    REACT_APP_TIME: transferTimeTo('datetime', Date.now()),
  },
  ignoreMomentLocale: true,
  // 设置 node_modules 目录下依赖文件的编译方式
  nodeModulesTransform: {
    type: 'all',
    exclude: [],
  },
  proxy: proxy[REACT_APP_ENV || 'dev'],
  chainWebpack: webpackPlugin,
  lessLoader: {
    javascriptEnabled: true,
  },
  cssLoader: {
    // 将 ClassName 类名变成驼峰命名形式：.bar-foo => styles.barFoo
    localsConvention: 'camelCase',
    modules: {
      getLocalIdent: (
        context: {
          resourcePath: string;
        },
        _localIdentName: string,
        localName: string,
      ) => {
        if (
          context.resourcePath.includes('node_modules') ||
          context.resourcePath.includes('ant.design.pro.less') ||
          context.resourcePath.includes('global.less')
        ) {
          return localName;
        }

        const match = context.resourcePath.match(/src(.*)/);

        if (match && match[1]) {
          const pathStr = match[1].replace('.less', '');
          const arr = slash(pathStr)
            .split('/')
            .map((a: string) => {
              const s = a.replace(/([A-Z])/g, '-$1').toLowerCase();
              return s !== 'index' && s !== 'pages' && s;
            })
            .filter(Boolean);
          return `${arr.join('-')}-${localName}`.replace(/--/g, '-');
        }

        return localName;
      },
    },
  },
});
