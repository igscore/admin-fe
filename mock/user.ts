import { Request, Response } from 'express';

// eslint-disable-next-line max-len
const TOKEN =
  // eslint-disable-next-line max-len
  'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJleUpoZFhSb1MyVjVJam9pTWpFaUxDSjFjMlZ5SWpwN0ltRmpZMjkxYm5RaU9pSmhaRzFwYmlJc0ltTnZiVzFsYm5RaU9pSWlMQ0pwWkNJNk1Td2lhbTlpVG5WdFltVnlJam9pTVNJc0lteGxkbVZzSWpvaVZFVk9RVTVVWDBGRVRVbE9JaXdpYldGcGJrUmxjR0Z5ZEcxbGJuUkpaQ0k2TVN3aWJXRnBibEJ2YzJsMGFXOXVTV1FpT2pFc0ltNWhiV1VpT2lKaFpHMXBiaUlzSW5CaGMzTjNiM0prSWpvaUpESmhKREV3Skd0SmFHOHhMak4zV0c0eFpVaDVWamg1U1ZWNlMyVm1Sbk5rUTNaUmJEWnVZbTFJZFRCa1dFZEdXV2xQZVhsVFRWUm1OVXBQSWl3aWNtOXNaWE1pT2x0ZExDSnpkR0YwWlNJNk1Td2lkR1Z1WVc1MFNXUWlPaklzSW5SNWNHVWlPakY5TENKMFpXNWhiblFpT25zaVlYUjBZV05vVlhKc0lqb2lJaXdpWVhaaGRHRnlWWEpzSWpvaUlpd2laR0lpT2lKMFpYTjBJaXdpWkdWMmFXTmxWWEpzSWpvaUlpd2laRzlqVlhKc0lqb2lJaXdpYUc5dFpYQmhaMlZWY213aU9pSWlMQ0pwWkNJNk1pd2liRzluYjFWeWJDSTZJaUlzSW0xdlpIVnNaVXhsWVhObGN5STZXM3NpYVdRaU9qSXNJbTF2WkhWc1pVbGtJam8wTnpRd01qUXlNRE15TWpNek1ETXhOamdzSW5SbGJtRnVkRWxrSWpveUxDSjJZV3hwWkNJNmRISjFaWDBzZXlKcFpDSTZNeXdpYlc5a2RXeGxTV1FpT2pNc0luUmxibUZ1ZEVsa0lqb3lMQ0oyWVd4cFpDSTZkSEoxWlgwc2V5SnBaQ0k2TkN3aWJXOWtkV3hsU1dRaU9qUXNJblJsYm1GdWRFbGtJam95TENKMllXeHBaQ0k2ZEhKMVpYMWRMQ0p1WVcxbElqb2lkR1Z6ZENJc0luQmhjbVZ1ZEVsa0lqb3dMQ0p5YjNWMFpTSTZJblJsYzNRaUxDSnphR0Z5WlVWdVlXSnNaU0k2Wm1Gc2MyVXNJblJsYm1GdWRFbGtJam93TENKMGVYQmxJam93ZlgwPSIsInJvbGVzIjpbIlRFTkFOVF9BRE1JTiJdLCJwZXJtaXNzaW9ucyI6W10sImlhdCI6MTU5Mzk1MjU1MiwiZXhwIjoxNTk0MDM4OTUyfQ.7tUDUQw6a0i1QhRFE_Q_nUQeJR5PGRlEqNn270ZYYv0';

// const FakeLoginData = {
//   status: 'A000',
//   data: {
//     entries: [
//       {
//         id: 1,
//         tenantId: 1,
//         account: '1',
//         password: '1',
//         jobNumber: '1',
//         name: 'user_update',
//         type: 2,
//         state: 2,
//         comment: '',
//         mainDepartmentId: 1,
//         mainDepartment: null,
//         mainPositionId: 1,
//         mainPosition: null,
//         partTimePositions: null,
//       },
//     ],
//     total: 1,
//   },
// };

// 代码中会兼容本地 service mock 以及部署站点的静态数据
export default {
  // 支持值为 Object 和 Array
  'GET /api/plat/user/mine': {
    status: 'A000',
    message: '',
    data: {
      plat: 'tenant',
      user: {
        account: 'testuser',
        name: '麻花腾',
        level: 'TENANT_ADMIN',
        type: 1,
        state: 1,
        comment: '1',
        phone: '',
        roles: [
          {
            name: null,
            description: null,
            id: 120734831828160,
            api_permissions: [
              {
                name: null,
                apis: [
                  {
                    name: null,
                    description: null,
                    pattern: null,
                    protocol: null,
                    method: null,
                    url: null,
                    id: 2,
                    app_id: 0,
                    state: 0,
                  },
                ],
                id: 2,
              },
            ],
            app_menu_permissions: [
              {
                name: null,
                id: 120517138231488,
                app_menus: [
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 5,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 51,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 53,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 54,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 55,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 56,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 57,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 571,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 572,
                    app_id: 0,
                    parent_id: 0,
                  },
                ],
              },
              { name: null, id: 120733305685184, app_menus: [] },
              {
                name: null,
                id: 120746294254784,
                app_menus: [
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 11,
                    app_id: 0,
                    parent_id: 0,
                  },
                  {
                    name: null,
                    type: 0,
                    icon: null,
                    url: null,
                    option: null,
                    depth: 0,
                    id: 555555,
                    app_id: 0,
                    parent_id: 0,
                  },
                ],
              },
            ],
          },
        ],
        id: 3,
        job_number: '10004',
        main_department_id: 1,
        main_department: { name: '易企', sequence: 0, type: 2, state: 1, id: 1, parent_id: 0 },
        main_position_id: 5,
        main_position: {
          name: '行政主管',
          type: 2,
          sequence: 0,
          duty: '行政主管职责',
          description: '行政主管描述',
          department: null,
          id: 5,
          department_id: 0,
        },
      },
    },
  },
  'GET /api/sys/tenant/test': {
    status: 'A000',
    data: {
      name: '上海恒恩科技有限公司',
      type: 0,
      route: null,
      id: 1,
      document_url: null,
      attachment_url: null,
      logo_url: null,
      avatar_url: null,
      homepage_url: null,
      device_url: null,
      module_leases: null,
    },
  },
  // 登录
  'POST /api/auth/login': (req: Request, res: Response) => {
    res.send({
      status: 'A000',
      data: {
        token: TOKEN,
      },
    });
  },
  'GET /api/500': (req: Request, res: Response) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req: Request, res: Response) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req: Request, res: Response) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req: Request, res: Response) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
