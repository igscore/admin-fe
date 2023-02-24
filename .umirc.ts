import { defineConfig } from 'umi';
import routes from './routes';

export default defineConfig({
  nodeModulesTransform: {
    type: 'none',
  },
  routes,
  fastRefresh: {},
  hash: true,
  dynamicImport: {
    loading: '@/components/Common/UmiLoading',
  }
});
