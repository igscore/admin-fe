/**
 * @date 2020-04-06
 * @description 审批人属性配置
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Radio, Select, Tabs, TreeSelect, Typography } from 'antd';
import type { FormInstance, FormItemProps } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { DepartmentDirectorTypeEnum, queryDepartmentList } from '@/pages/setting/department/service';
import type { DepartmentTreeData } from '@/pages/setting/department/data';
import { queryPosition } from '@/pages/setting/position/service';
import { queryUserList } from '@/pages/setting/user/service';

import Flex from '@/components/Flex';
import {
  FlowChartNodeAssigneeEnum,
  FlowChartNodeAssigneeList,
  FlowChartNodeEndModeEnum,
  FlowChartNodeEndModeMaps,
} from '@/pages/flow/editor/service';

import { FlowEditorContext } from '../../index';
import type { FlowAssigneeValueItem, FlowChartData } from '../../data';
import styles from './index.less';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Item: FormItem } = Form;

const formItemLayout: Partial<FormItemProps> = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};

const AssigneeMaps = {
  [FlowChartNodeAssigneeEnum.OWNER_USER_ID]: {
    content: ['发起人自己'],
    tip: '发起人自己将作为审批人处理审批单',
  },
  [FlowChartNodeAssigneeEnum.OWNER_GROUP_ID]: {
    content: ['发起人所在部门'],
    tip: '发起人所在部门所有成员将作为审批人处理审批单，常用于群发部门通知等等',
  },
  [FlowChartNodeAssigneeEnum.OWNER_SPECIFIED_USER_ID]: {
    content: ['发起人自选'],
    tip: '由发起人提交审批单时指定审批人',
  },
  [FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER]: {
    content: [],
    tip: '请指定部门的主管或上级主管',
  },
  [FlowChartNodeAssigneeEnum.OWNER_GROUP_LEADER]: {
    content: [],
    tip: '请指定主管或上级主管',
  },
};

const AssigneeLabelMaps: Record<string, string> = {
  [FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_ID]: '部门',
  [FlowChartNodeAssigneeEnum.SPECIFIED_POSITION_ID]: '岗位',
  [FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID]: '成员',
};

const AssigneeLeaderTypeMaps: Record<string, string> = {
  [DepartmentDirectorTypeEnum.LEADER_IN_DIRECT]: '主管',
  [DepartmentDirectorTypeEnum.LEADER_IN_CHARGE]: '上级主管',
};

const getAssigneeValueField = (key: FlowChartNodeAssigneeEnum, value?: FlowAssigneeValueItem[]) => {
  if (key === FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER) {
    if (value && value[0]) {
      return Number(value[0]?.id) || undefined;
    }
    return undefined;
  }
  if (key === FlowChartNodeAssigneeEnum.OWNER_GROUP_LEADER) {
    if (value && value[0]) {
      return Number(value[0]?.type) || undefined;
    }
    return undefined;
  }
  return (value || []).map(({ id }) => String(id)) as string[];
};

interface ApproverFormProperties {
  assigneeKey: FlowChartNodeAssigneeEnum;
  assigneeValue: number[] | number;
  assigneeValue2?: number;
  taskEndMode: FlowChartNodeEndModeEnum;
  skipEnable: boolean;
}

export interface ApproverFormValue {
  assignee: {
    key: FlowChartNodeAssigneeEnum;
    value: FlowAssigneeValueItem[];
    content: string[];
  };
  taskEndMode: FlowChartNodeEndModeEnum;
  skipEnable: boolean;
}

export interface ApproverTitleFormValue {
  name: string;
  hasBeenEdited: boolean;
}

interface Props {
  data: FlowChartData;
  onFormChange: (values: ApproverFormValue | null, form: FormInstance) => void;
}

interface TitleProps {
  data: FlowChartData;
  onFormChange: (values: ApproverTitleFormValue) => void;
}

interface ApproverProps extends React.FC<Props> {
  Title: React.FunctionComponent<TitleProps>;
}

const Approver: ApproverProps = ({ data, onFormChange }) => {
  const {
    properties: { assignee },
  } = data;
  const [form] = Form.useForm();
  // 选择的审批人类型对应的数据列表
  const [list, handleList] = useState<{ id: number; name: string }[]>([]);
  // 部门树
  const [departmentTree, handleTree] = useState<DepartmentTreeData[]>([]);
  // 当前审批人类型
  const [assigneeKey, handleAssigneeKey] = useState<FlowChartNodeAssigneeEnum>(
    assignee?.key || FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID,
  );

  const queryList = useCallback(async (key: FlowChartNodeAssigneeEnum) => {
    if (
      key === FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_ID ||
      key === FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER
    ) {
      const { list: fetchList, tree } = await queryDepartmentList(true, ['value', 'title']);
      handleList(fetchList.map(({ id, name }) => ({ id, name })));
      handleTree(tree);
    } else if (key === FlowChartNodeAssigneeEnum.SPECIFIED_POSITION_ID) {
      const { list: fetchList } = await queryPosition();
      handleList(fetchList.map(({ id, name }) => ({ id, name })));
    } else if (key === FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID) {
      const { data: fetchList } = await queryUserList();
      handleList(fetchList.map(({ id, name }) => ({ id, name })));
    }
  }, []);

  const onValuesChange = useCallback(
    (changedValues: Partial<ApproverFormProperties>, allValues: ApproverFormProperties) => {
      const values = { ...allValues };

      const formValues: ApproverFormValue = {
        assignee: {
          key: values.assigneeKey,
          value: [],
          content: [],
        },
        taskEndMode: values.taskEndMode || FlowChartNodeEndModeEnum.REJECT,
        skipEnable: values.skipEnable ?? true,
      };

      // 切换 assigneeKey 时清空 assigneeValue
      if (changedValues?.assigneeKey) {
        handleAssigneeKey(changedValues.assigneeKey);
        handleList([]);
        form.setFieldsValue({
          assigneeValue: getAssigneeValueField(changedValues.assigneeKey, []),
        });
        values.assigneeValue = [];

        queryList(changedValues.assigneeKey);
      }

      // 处理 assignee.value 和 content
      if (values.assigneeValue) {
        // 指定部门主管
        if (values.assigneeKey === FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER) {
          formValues.assignee.value = [{ id: Number(values.assigneeValue), type: values.assigneeValue2 }];
          const departmentName = list.find(({ id }) => id === Number(values.assigneeValue))?.name || '';
          const leader = AssigneeLeaderTypeMaps[values?.assigneeValue2 || ''] || '';
          formValues.assignee.content = [`${departmentName}的${leader}`];
        } else if (values.assigneeKey === FlowChartNodeAssigneeEnum.OWNER_GROUP_LEADER) {
          // 发起人主管
          formValues.assignee.value = [{ type: values.assigneeValue as number }];
          const leader = AssigneeLeaderTypeMaps[(values?.assigneeValue as number) || ''] || '';
          formValues.assignee.content = [`发起人的${leader}`];
        } else {
          formValues.assignee.value = ((values.assigneeValue as number[]) || []).map((id) => ({ id: Number(id) }));
          formValues.assignee.content = (values.assigneeValue as number[])
            .map((v) => list.find(({ id }) => id === Number(v))?.name)
            .filter<string>(Boolean as any);
          if (!formValues.assignee.content.length) {
            formValues.assignee.content = AssigneeMaps[values.assigneeKey]?.content || [];
          }
        }
      }

      onFormChange(formValues, form);
    },
    [form, list, onFormChange, queryList],
  );

  useEffect(() => {
    onFormChange(null, form);

    const { assignee: assign, taskEndMode, skipEnable } = data.properties;
    const formAssigneeKey = assign?.key || FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID;
    form.setFieldsValue({
      skipEnable,
      taskEndMode,
      assigneeKey: formAssigneeKey,
    });

    (async () => {
      const { key } = data?.properties?.assignee || {};
      if (key) {
        await queryList(key);
      }
      const value = getAssigneeValueField(formAssigneeKey, assign?.value);
      form.setFieldsValue({
        assigneeValue: value,
        assigneeValue2:
          formAssigneeKey === FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER ? assign?.value[0]?.type : undefined,
      });
    })();
  }, [data, form, onFormChange, queryList]);

  return (
    <>
      <Tabs defaultActiveKey="configure" className={styles.tabBar}>
        <TabPane tab="设置审批人" key="configure">
          <Form form={form} layout="vertical" style={{ paddingBottom: 54 }} onValuesChange={onValuesChange as any}>
            <FormItem className={styles.formItem} name="assigneeKey" style={{ paddingBottom: 0 }} {...formItemLayout}>
              <Radio.Group className={styles.radios}>
                {FlowChartNodeAssigneeList.map(({ key, text }) => (
                  <Radio key={key} value={Number(key)}>
                    {text}
                  </Radio>
                ))}
              </Radio.Group>
            </FormItem>

            {/* 指定部门、岗位、人员 */}
            {assigneeKey && Object.keys(AssigneeLabelMaps).includes(String(assigneeKey)) && (
              <FormItem
                {...formItemLayout}
                name="assigneeValue"
                className={styles.formItem}
                style={{ marginBottom: 0, paddingTop: 0 }}
                label={`选择${AssigneeLabelMaps[assigneeKey]}`}
                rules={[{ required: true, message: `至少选择一个${AssigneeLabelMaps[assigneeKey]}` }]}
              >
                <Select mode="tags">
                  {list.map(({ id, name }) => (
                    <Select.Option key={id} value={String(id)}>
                      {name}
                    </Select.Option>
                  ))}
                </Select>
              </FormItem>
            )}

            {/* 指定部门主管 */}
            {assigneeKey === FlowChartNodeAssigneeEnum.SPECIFIED_GROUP_LEADER && (
              <FormItem
                {...formItemLayout}
                label="选择部门主管"
                className={styles.formItem}
                style={{ marginBottom: 0, paddingTop: 0 }}
                required
              >
                <FormItem
                  name="assigneeValue"
                  style={{ display: 'inline-block', width: '50%', marginBottom: 0, paddingTop: 0 }}
                  rules={[{ required: true, message: `必须指定一个部门` }]}
                >
                  <TreeSelect
                    style={{ width: '100%' }}
                    treeData={departmentTree}
                    placeholder="点击选择部门"
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeDefaultExpandAll
                  />
                </FormItem>
                <FormItem
                  name="assigneeValue2"
                  style={{ display: 'inline-block', width: '40%', margin: '0 0 0 10px', paddingTop: 0 }}
                  rules={[{ required: true, message: `必须指定主管类型` }]}
                >
                  <Select style={{ width: '100%' }} placeholder="请选择主管类型">
                    <Select.Option key="zhuguan" value={DepartmentDirectorTypeEnum.LEADER_IN_DIRECT}>
                      主管
                    </Select.Option>
                    <Select.Option key="sjzhuguan" value={DepartmentDirectorTypeEnum.LEADER_IN_CHARGE}>
                      上级主管
                    </Select.Option>
                  </Select>
                </FormItem>
              </FormItem>
            )}

            {/* 发起人主管 */}
            {assigneeKey === FlowChartNodeAssigneeEnum.OWNER_GROUP_LEADER && (
              <FormItem
                {...formItemLayout}
                name="assigneeValue"
                className={styles.formItem}
                style={{ marginBottom: 0, paddingTop: 0 }}
                label="选择主管类型"
                rules={[{ required: true, message: `必须指定主管类型` }]}
              >
                <Select style={{ width: '100%' }} placeholder="请选择主管类型">
                  <Select.Option key="zhuguan" value={DepartmentDirectorTypeEnum.LEADER_IN_DIRECT}>
                    主管
                  </Select.Option>
                  <Select.Option key="sjzhuguan" value={DepartmentDirectorTypeEnum.LEADER_IN_CHARGE}>
                    上级主管
                  </Select.Option>
                </Select>
              </FormItem>
            )}

            {assigneeKey && Object.keys(AssigneeMaps).includes(String(assigneeKey)) && (
              <Text className={styles.tips} type="secondary">
                {AssigneeMaps[assigneeKey].tip}
              </Text>
            )}
            <FormItem
              {...formItemLayout}
              name="taskEndMode"
              className={styles.formItem}
              style={{ borderTop: '1px solid #ebebeb' }}
              label={
                <Text strong style={{ marginBottom: 5 }}>
                  多人审批时采用的审批方式
                </Text>
              }
            >
              <Radio.Group>
                {Object.keys(FlowChartNodeEndModeMaps).map((key) => {
                  const label = FlowChartNodeEndModeMaps[key];
                  return (
                    <Radio key={key} style={{ display: 'block', marginBottom: 12 }} value={Number(key)}>
                      {`${label.text}（${label.tip}）`}
                    </Radio>
                  );
                })}
              </Radio.Group>
            </FormItem>
            <FormItem
              {...formItemLayout}
              name="skipEnable"
              className={styles.formItem}
              style={{ borderTop: '1px solid #ebebeb' }}
              label={
                <Text strong style={{ marginBottom: 5 }}>
                  审批人为空时
                </Text>
              }
            >
              <Radio.Group>
                <Radio style={{ display: 'block', marginBottom: 12 }} key={1} value>
                  继续审批
                </Radio>
                <Radio style={{ display: 'block', marginBottom: 12 }} key={0} value={false}>
                  异常结束
                </Radio>
              </Radio.Group>
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </>
  );
};

const DefaultName = '审批人';

const ApproverTitle: React.FC<TitleProps> = ({ data, onFormChange }) => {
  const [form] = Form.useForm();
  const { writeable } = useContext(FlowEditorContext);
  const [editting, handleEditting] = useState<boolean>(false);
  const [name, handleName] = useState<string>(data?.name || DefaultName);

  const onClick = useCallback(
    (editable: boolean) => {
      handleEditting(editable);
      onFormChange({
        name,
        hasBeenEdited: name !== DefaultName,
      });
    },
    [name, onFormChange],
  );

  const onValuesChange = useCallback((changedValues: any) => {
    if (changedValues.name) {
      handleName(changedValues.name);
    }
  }, []);

  useEffect(() => {
    form.setFieldsValue({ name: data?.name || DefaultName });
    handleName(data?.name || DefaultName);
  }, [data, form]);

  return (
    <>
      <Flex aligns="center" style={editting ? { display: 'none' } : {}}>
        <Text>{name}</Text>
        {writeable && (
          <Button type="link" style={{ padding: '5px 10px' }} onClick={() => onClick(true)}>
            <EditOutlined />
          </Button>
        )}
      </Flex>
      <Form form={form} onValuesChange={onValuesChange} style={editting ? {} : { display: 'none' }}>
        <FormItem name="name" rules={[{ required: true, message: '名称不能为空' }]} {...formItemLayout}>
          <Input onBlur={() => onClick(false)} onPressEnter={() => onClick(false)} />
        </FormItem>
      </Form>
    </>
  );
};

Approver.Title = ApproverTitle;

export default Approver;
