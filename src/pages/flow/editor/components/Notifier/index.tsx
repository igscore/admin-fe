/**
 * @date 2020-04-06
 * @description 审批人属性配置
 */

import React, { useContext, useEffect, useState } from 'react';
import { Button, Form, Input, Tabs, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import Flex from '@/components/Flex';

import { FlowEditorContext } from '../../index';
import type { FlowChartData } from '../../data';
import styles from './index.less';

const { TabPane } = Tabs;
const { Text } = Typography;
const { Item: FormItem } = Form;

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NotifierFormValue {}

export interface NotifierTitleFormValue {
  name: string;
  hasBeenEdited: boolean;
}

interface Props {
  data: FlowChartData;
  onFormChange: (values: NotifierFormValue) => void;
}

interface TitleProps {
  data: FlowChartData;
  onFormChange: (values: NotifierTitleFormValue) => void;
}

interface NotifierProps extends React.FC<Props> {
  Title: React.FunctionComponent<TitleProps>;
}

const Notifier: NotifierProps = () => {
  return (
    <>
      <Tabs defaultActiveKey="configure" className={styles.tabBar}>
        <TabPane tab="设置抄送人" key="configure">
          <p>抄送人配置</p>
        </TabPane>
      </Tabs>
    </>
  );
};

const DefaultName = '抄送人';

const NotifierTitle: React.FC<TitleProps> = ({ data, onFormChange }) => {
  const [form] = Form.useForm();
  const { writeable } = useContext(FlowEditorContext);
  const [editting, handleEditting] = useState<boolean>(false);
  const [name, handleName] = useState<string>(data?.name || DefaultName);

  const onClick = (edit: boolean) => {
    handleEditting(edit);
    onFormChange({
      name,
      hasBeenEdited: name !== DefaultName,
    });
  };

  const onValuesChange = (changedValues: any) => {
    if (changedValues.name) {
      handleName(changedValues.name);
    }
  };

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
        <FormItem name="name" rules={[{ required: true, message: '名称不能为空' }]}>
          <Input onBlur={() => onClick(false)} onPressEnter={() => onClick(false)} />
        </FormItem>
      </Form>
    </>
  );
};

Notifier.Title = NotifierTitle;

export default Notifier;
