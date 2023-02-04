/**
 * @date 2020-04-06
 * @description 发起人属性配置
 */

import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Tabs, Form, Typography } from 'antd';
import type { FormInstance } from 'antd/lib/form';

import type { UserTreeItem } from '@/pages/setting/user/data';

import type { UserAndDepartmentItem } from '../StarterSelect';
import StarterSelect from '../StarterSelect';
import type { FlowAssigneeValueItem, FlowChartData } from '../../data';
import { FlowEditorContext } from '../../index';
import styles from './index.less';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Item: FormItem } = Form;

interface StarterFormProperties {
  starter: number[];
}

export interface StarterFormValue {
  starter: {
    content: string[];
    value: FlowAssigneeValueItem[];
  };
}

interface Props {
  data: FlowChartData;
}

interface SProps extends Props {
  onFormChange: (params: StarterFormValue | null, form: FormInstance) => void;
}

interface StarterProps extends React.FC<SProps> {
  Title: React.FunctionComponent<Props>;
}

const Starter: StarterProps = (props) => {
  const { onFormChange } = props;
  const [form] = Form.useForm();
  const { starter: contextStarter } = useContext(FlowEditorContext);
  const treeData = useRef<UserTreeItem[]>([]);
  const allList = useRef<UserAndDepartmentItem[]>([]);

  const onValuesChange = useCallback(
    ({ starter }: Partial<StarterFormProperties>) => {
      const formValues: StarterFormValue = {
        starter: {
          value: [],
          content: [],
        },
      };
      if (starter) {
        // 格式化接口提交value
        if (StarterSelect.getUserIds) {
          formValues.starter.value = StarterSelect.getUserIds(starter);
        }
        // 格式化内容，用户node内容区展示
        if (starter[0] === treeData.current[0]?.id) {
          formValues.starter.content = ['所有人'];
        } else {
          formValues.starter.content = starter
            .map((id: number) => allList.current.find((d) => d.id === id)?.name || '')
            .filter((name: string) => !!name);
        }
      }
      onFormChange(formValues, form);
    },
    [form, onFormChange],
  );

  useEffect(() => {
    if (contextStarter) {
      form.setFieldsValue({ starter: contextStarter });
    }
  }, [contextStarter, form]);

  useEffect(() => {
    onFormChange(null, form);
  }, [form, onFormChange]);

  return (
    <>
      <Tabs defaultActiveKey="configure" className={styles.tabBar}>
        <TabPane tab="设置发起人" key="configure" className={styles.tabPane}>
          <Form layout="vertical" form={form} onValuesChange={onValuesChange as any}>
            <FormItem name="starter" label="谁可以提交" rules={[{ required: true, message: '请选择发起人' }]}>
              <StarterSelect
                afterLoad={(tree, list) => {
                  treeData.current = tree;
                  allList.current = list;
                }}
              />
            </FormItem>
          </Form>
        </TabPane>
      </Tabs>
    </>
  );
};

const StarterTitle: React.FC<Props> = ({ data }) => <Text>{data?.name || ''}</Text>;

Starter.Title = StarterTitle;

export default Starter;
