import { Request, Response } from 'express';
// @ts-ignore
import { delay } from 'roadhog-api-doc';

let PositionList = [
  {
    id: 20011,
    name: '人事主管',
    duty: '人事主管职责',
    description: '人事主管描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10001,
  },
  {
    id: 20012,
    name: '人事专员',
    duty: '人事专员职责',
    description: '人事专员描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10001,
  },
  {
    id: 20013,
    name: '行政专员',
    duty: '行政专员职责',
    description: '行政专员描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10001,
  },
  {
    id: 20014,
    name: '招聘主管',
    duty: '招聘主管职责',
    description: '招聘主管描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10011,
  },
  {
    id: 20015,
    name: '招聘专员',
    duty: '招聘专员职责',
    description: '招聘专员描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10011,
  },
  {
    id: 20021,
    name: '项目主管',
    duty: '项目主管职责',
    description: '项目主管描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10002,
  },
  {
    id: 20022,
    name: '项目经理',
    duty: '项目经理职责',
    description: '项目经理描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10002,
  },
  {
    id: 20211,
    name: '执行主管',
    duty: '执行主管职责',
    description: '执行主管描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10021,
  },
  {
    id: 20212,
    name: '执行专员',
    duty: '执行专员职责',
    description: '执行专员描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10021,
  },
  {
    id: 20221,
    name: '策划经理',
    duty: '策划经理职责',
    description: '策划经理描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10022,
  },
  {
    id: 20031,
    name: '行政主管',
    duty: '行政主管职责',
    description: '行政主管描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10003,
  },
  {
    id: 20032,
    name: '行政专员',
    duty: '行政专员职责',
    description: '行政专员描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10003,
  },
  {
    id: 20311,
    name: '后勤经理',
    duty: '后勤经理职责',
    description: '后勤经理描述',
    tenantId: 2,
    type: 2,
    sequence: 1,
    departmentId: 10031,
  },
];

function getRule(req: Request, res: Response) {
  const result = {
    status: 'A000',
    data: {
      entries: [...PositionList],
    },
  };
  return res.json(result);
}

function postRule({ body }: Request, res: Response) {
  const { method, id, departmentId, name, duty, description } = body;

  switch (method) {
    /* eslint no-case-declarations:0 */
    case 'delete':
      PositionList = PositionList.filter((item) => !id.includes(item.id));
      break;
    case 'post':
      PositionList.push({
        id: Math.ceil(Math.random() * 10000 + 200000),
        name,
        departmentId,
        duty: duty || '',
        description: description || '',
        type: 2,
        tenantId: 2,
        sequence: 1,
      });
      break;
    case 'update':
      PositionList = PositionList.map((item) => {
        let newItem = item;
        if (item.id === id) {
          newItem = {
            ...newItem,
            name: name || '',
            duty: duty || '',
            description: description || '',
          };
          if (departmentId) {
            newItem = {
              ...newItem,
              departmentId,
            };
          }
        }
        return newItem;
      });
      break;
    default:
      break;
  }

  const result = {
    status: 'A000',
  };

  return res.json(result);
}

const mock = {
  'GET  /api/platform/getallposition': getRule,
  'POST  /api/platform/addposition': postRule,
  'POST  /api/platform/saveposition': postRule,
  'POST  /api/platform/deleteposition': postRule,
};

export const getPosition = () => PositionList;

export default delay(mock, 1000);
