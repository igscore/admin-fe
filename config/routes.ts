export default [
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      {
        name: '登录',
        path: '/user/login',
        component: './user/login',
      },
    ],
  },
  {
    path: '/',
    component: '../layouts/SecurityLayout',
    routes: [
      {
        name: '创建流程',
        icon: 'apartment',
        path: '/flow/editor',
        component: './flow/editor',
        authority: ['admin'],
      },
      {
        path: '/',
        component: '../layouts/BasicLayout',
        routes: [
          {
            path: '/',
            redirect: '/home',
          },
          {
            name: '工作台',
            icon: 'home',
            path: '/home',
            component: './home',
          },
          {
            path: '/setting',
            name: '系统设置',
            icon: 'setting',
            authority: ['admin'],
            routes: [
              {
                name: '组织机构',
                icon: 'apartment',
                path: '/setting/department',
                component: './setting/department',
              },
              {
                name: '岗位列表',
                icon: 'desktop',
                path: '/setting/position',
                component: './setting/position',
              },
              {
                name: '用户管理',
                icon: 'user',
                path: '/setting/user',
                component: './setting/user',
              },
              {
                name: '用户详情',
                icon: 'user',
                path: '/setting/user/detail',
                component: './setting/userDetail',
              },
            ],
          },
          {
            path: '/auth',
            name: '菜单权限',
            icon: 'schedule',
            authority: ['admin'],
            routes: [
              {
                name: '角色权限',
                icon: 'lock',
                path: '/auth/setting',
                component: './auth/setting',
              },
            ],
          },
          {
            path: '/flow',
            name: '流程管理',
            icon: 'partition',
            authority: ['admin'],
            routes: [
              {
                name: '流程设置',
                icon: 'branches',
                path: '/flow/list',
                component: './flow/list',
              },
              {
                name: '流程分组',
                icon: 'group',
                path: '/flow/category',
                component: './flow/category',
              },
            ],
          },
          {
            path: '/calendar',
            name: '日程管理',
            icon: 'calendar',
            authority: ['admin'],
            routes: [
              {
                name: '日历列表',
                icon: 'profile',
                path: '/calendar/list',
                component: './calendar/list',
              },
              {
                name: '标签管理',
                icon: 'group',
                path: '/calendar/tags',
                component: './calendar/tags',
              },
              {
                name: '日程详情',
                icon: 'group',
                path: '/calendar/detail',
                component: './calendar/detail',
              },
            ],
          },
          {
            path: '/device',
            name: '设备管理',
            icon: 'laptop',
            authority: ['admin'],
            routes: [
              {
                name: '设备列表',
                icon: 'branches',
                path: '/device/list',
                component: './device/list',
              },
              {
                name: '设备分组',
                icon: 'group',
                path: '/device/category',
                component: './device/category',
              },
              {
                name: '设备流程',
                icon: 'branches',
                path: '/device/flow',
                component: './device/flow',
              },
              {
                name: '设备详情',
                icon: 'group',
                path: '/device/detail',
                component: './device/detail',
              },
            ],
          },
          {
            name: '404',
            component: './404',
          },
        ],
      },
      {
        name: '404',
        component: './404',
      },
    ],
  },
  {
    name: '404',
    component: './404',
  },
];
