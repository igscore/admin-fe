// @ts-nocheck
import axios from 'axios';

const igsRequest = axios.create({
  baseURL: location.origin.indexOf('igscore') > -1 ? '//api.igscore.com:8080/' : 'http://118.195.202.243:8080/',
  timeout: 100000,
});

// 请求拦截,所有的网络请求都会先走这个方法
igsRequest.interceptors.request.use(
  function (config) {
    const nextConfig = Object.assign(config, {
      // withCredentials: true,
      data: Object.assign(config.data || {}, {
        agentType: null,
        appVersion: null,
        sign: null,
      }),
    });
    return nextConfig;
  },
  function (err) {
    return Promise.reject(err);
  },
);

// 请求拦截,所有的网络请求都会先走这个方法
igsRequest.interceptors.response.use(
  function (response) {
    // add config
    try {
      return response.data.result;
    } catch (e) {
      console.log(response.data.message)
      return {};
    }
  },
  function (err) {
    console.log(err, '====')
    return Promise.reject(err);
  },
);

export default igsRequest;
