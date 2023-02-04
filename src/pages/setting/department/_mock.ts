import { Request, Response } from 'express';
// @ts-ignore
import { delay } from 'roadhog-api-doc';

let DepartmentList = [
  {
    id: 10000,
    name: '上海恒恩科技有限公司',
    tenantId: 2,
    state: 1,
    parent_id: 0,
    type: 2,
    sequence: 1,
  },
  {
    id: 10001,
    name: '人事部',
    tenantId: 2,
    state: 1,
    parent_id: 10000,
    type: 2,
    sequence: 1,
  },
  {
    id: 10002,
    name: '项目部',
    tenantId: 2,
    state: 1,
    parent_id: 10000,
    type: 2,
    sequence: 1,
  },
  {
    id: 10003,
    name: '行政部',
    tenantId: 2,
    state: 1,
    parent_id: 10000,
    type: 2,
    sequence: 1,
  },
  {
    id: 10011,
    name: '招聘组',
    tenantId: 2,
    state: 1,
    parent_id: 10001,
    type: 2,
    sequence: 1,
  },
  {
    id: 10012,
    name: '薪资组',
    tenantId: 2,
    state: 1,
    parent_id: 10001,
    type: 2,
    sequence: 1,
  },
  {
    id: 10021,
    name: '执行组',
    tenantId: 2,
    state: 1,
    parent_id: 10002,
    type: 2,
    sequence: 1,
  },
  {
    id: 10031,
    name: '后勤中心',
    tenantId: 2,
    state: 1,
    parent_id: 10003,
    type: 2,
    sequence: 1,
  },
  {
    id: 10022,
    name: '策划组',
    tenantId: 2,
    state: 1,
    parent_id: 10002,
    type: 2,
    sequence: 1,
  },
  {
    id: 10030,
    name: '企划中心',
    tenantId: 1,
    state: 1,
    parent_id: 10000,
    type: 1,
    sequence: 1,
  },
  {
    id: 10040,
    name: '恒恩子公司',
    tenantId: 1,
    state: 1,
    parent_id: 10000,
    type: 3,
    sequence: 1,
  },
];

function getRule(req: Request, res: Response) {
  const result = {
    status: 'A000',
    data: {
      entries: [...DepartmentList],
      total: DepartmentList.length,
    },
  };
  return res.json(result);
}

function postRule({ body, method }: Request, res: Response) {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const { id, name, parent_id, type } = body;

  let nextData: any = null;

  switch (method.toLowerCase()) {
    case 'post':
      nextData = {
        id: Math.ceil(Math.random() * 100000),
        name,
        parent_id,
        type,
        tenantId: 1,
        state: 1,
        sequence: 1,
      };
      DepartmentList.push(nextData);
      break;
    case 'put':
      DepartmentList = DepartmentList.map((item) => {
        nextData = item;
        if (item.id === id) {
          if (parent_id) {
            nextData = {
              ...nextData,
              parent_id,
            };
          }
          if (name) {
            nextData = {
              ...nextData,
              name,
            };
          }
          if (type) {
            nextData = {
              ...nextData,
              type,
            };
          }
        }
        return nextData;
      });
      break;
    case 'delete':
      nextData = {};
      DepartmentList = DepartmentList.filter((item) => item.id !== id && item.parent_id !== id);
      break;
    default:
      break;
  }

  return res.json({
    status: 'A000',
    method: method.toLowerCase(),
    data: nextData,
  });
}

export const getDepartment = () => DepartmentList;

const mock = {
  'GET /api/plat/departments': getRule, // 获取所有部门机构
  'POST /api/plat/department': postRule,
  'PUT /api/plat/department': postRule,
  'DELETE /api/plat/department': postRule,
};

export default delay(mock, 800);
