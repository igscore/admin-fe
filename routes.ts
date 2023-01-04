export default [
  {
    exact: false,
    path: '/',
    component: '@/layouts/index',
    routes: [
      { exact: true, name: 'home', path: '/', component: '@/pages/home' },
      {
        exact: true,
        name: 'detail',
        path: '/detail',
        component: '@/pages/detail',
      },
      {
        exact: true,
        name: 'login',
        path: '/login',
        component: '@/pages/login',
      },
    ],
  },
];
