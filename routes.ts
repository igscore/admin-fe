export default [
  {
    exact: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      { exact: true, name: 'home', path: '/', component: '@/pages/home' },
      { exact: true, name: 'adCreate', path: '/adCreate', component: '@/pages/adCreate' },
      { exact: true, name: 'login', path: '/login', component: '@/pages/login' },
    ],
  },
];
