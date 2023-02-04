/* eslint-disable no-case-declarations */
import { Request, Response } from 'express';
// @ts-ignore
import { delay } from 'roadhog-api-doc';
import mockjs from 'mockjs';

import { getPosition } from '../position/_mock';
import { getDepartment } from '../department/_mock';

// 筛除object中的无效属性 null/undefined/空字符串/NaN
const getValidObject = (raw: { [key: string]: any }) => {
  return Object.keys(raw).reduce((obj, key) => {
    const value = raw[key];
    if (value !== null && value !== undefined && value !== '' && !Number.isNaN(value)) {
      // eslint-disable-next-line no-param-reassign
      obj[key] = value;
    }
    return obj;
  }, {} as typeof raw);
};

let { list: tableListDataSource }: { list: any[] } = mockjs.mock({
  'list|22': [
    {
      'id|+1': 10001,
      'account|1': [
        'liuzhimeng',
        'zhangzhetao',
        'renxing',
        'mayun',
        'liuqiangdong',
        'wangxing',
        'mahuateng',
      ],
      'name|': '@cname(2-3)',
      'main_department_id|1': getDepartment().map(({ id }) => id),
      'main_position_id|1': getPosition().map(({ id }) => id),
      'job_number|+1': 18817308001,
      'roles|1-5': [
        {
          'id|+1': 30001,
          'name|1': ['技术', '管理', '财务', '销售', '市场', '运营', '行政', '后勤'],
        },
      ],
    },
  ],
});

function getRule(req: Request, res: Response) {
  const result = {
    status: 'A000',
    data: {
      entries: [...tableListDataSource],
      total: tableListDataSource.length,
      success: true,
    },
  };

  return res.json(result);
}

function postRule(req: Request, res: Response, u: string, b: Request) {
  const body = (b && b.body) || req.body;
  const { method, ...data } = body;

  const department = getDepartment();
  const position = getPosition();
  const org = department.find((i) => i.id === data.departmentId);
  const pos = position.find((i) => i.id === data.positionId);
  const mixData = {
    mainDepartmentId: org?.id,
    mainDepartment: org?.name,
    mainPositionId: pos?.id,
    mainPosition: pos?.name,
  };
  switch (method) {
    case 'post':
      const id = Math.ceil(Math.random() * 10000);
      tableListDataSource.unshift({
        ...data,
        ...mixData,
        id,
      });
      break;
    case 'update':
      // @ts-ignore
      tableListDataSource = tableListDataSource.map((item) => {
        if (item.id === data?.id) {
          return getValidObject({
            ...item,
            ...data,
            ...mixData,
          });
        }
        return item;
      });
      break;
    default:
      break;
  }

  const result = {
    status: 'A000',
    data: {
      entries: null,
      total: 0,
    },
  };

  return res.json(result);
}

const mock = {
  'GET  /api/plat/users': getRule,
  'POST  /api/plat/tenant/user': postRule,
  'POST  /api/plat/saveuser': postRule,
};

export default delay(mock, 1000);
