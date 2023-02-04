import * as IWebpackChainConfig from 'webpack-chain';
import CaseSensitivePathsWebpackPlugin from 'case-sensitive-paths-webpack-plugin';

const webpackPlugin = (config: IWebpackChainConfig) => {
  // optimize chunks
  config.optimization
    // share the same chunks across different modules
    .runtimeChunk(false)
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 0,
      cacheGroups: {
        vendors: {
          name(module: { context: string }) {
            return 'misc';
          },
        },
      },
    });
  // Enforces case sensitive paths in Webpack requires.
  // https://github.com/Urthen/case-sensitive-paths-webpack-plugin
  config.plugin('case-sensitive-paths').use(CaseSensitivePathsWebpackPlugin);
};

export default webpackPlugin;
