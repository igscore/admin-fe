/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @descriptio 创建/编辑流程图
 */

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, history } from 'umi';
import { Helmet } from 'react-helmet';
import { Button, Form, message, Tabs, Typography } from 'antd';
import { LeftOutlined } from '@ant-design/icons';

import Flex from '@/components/Flex';
import { getPageQuery } from '@/utils/utils';

import FlowConfig from './FlowConfig';
import FlowPreview from './FlowPreview';
import FlowEditor from './FlowEditor';

import { addFlowTemplate, FlowChartNodeAssigneeEnum, queryFlowTemplate, askToHandleFlow } from './service';
import type { FlowChartData, APIFlowChartConfig, FlowFormConfigProperties } from './data';
import StarterSelect from './components/StarterSelect';

import styles from './index.less';

export enum TabKeyEnum {
  Basic = 'basic',
  Preview = 'preview',
  Editor = 'editor',
}

const { Text } = Typography;
const { TabPane } = Tabs;

const DefaultFlowData: FlowChartData = {
  type: 'start',
  name: '发起人',
  nodeId: 'flow-start',
  prevId: null,
  childNode: {
    type: 'end',
    name: '结束',
    nodeId: 'flow-end',
    prevId: 'flow-start',
    properties: {},
  },
  properties: {
    assignee: {
      key: FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID,
      value: [],
    },
  },
};

interface ContextConfig {
  writeable: boolean;
  starter?: number[];
}

const DefaultPublicConfig: ContextConfig = {
  writeable: true,
};

export const FlowEditorContext = React.createContext<ContextConfig>(DefaultPublicConfig);

const TabTitle: React.FC<{ index: number; text: string }> = ({ index, text }) => (
  <Text style={{ color: '#fff' }}>
    <span className={styles.tabTitleKey}>{index}</span>
    {text}
  </Text>
);

const FlowSection: React.FC = () => {
  const [form] = Form.useForm();
  const chartData = useRef<FlowChartData | null>(null);
  const [configs, handleConfigs] = useState<FlowFormConfigProperties>();
  const [flowData, handleFlowData] = useState<FlowChartData>();
  const [formId, handleFormId] = useState<number>();
  const [activeKey, handleActiveKey] = useState<TabKeyEnum>(TabKeyEnum.Basic);
  const [publicConfig, handlePublicConfig] = useState<ContextConfig>(DefaultPublicConfig);

  const query = useMemo(getPageQuery, []);
  const needAcl = useMemo(() => Number(query.needAcl) === 1 || undefined, [query]);
  const flowListRoute = useMemo(() => (needAcl ? '/device/flow' : '/flow/list'), [needAcl]);
  const name = configs?.name || '创建流程图';

  const onConfigChange = useCallback((changedValues: any) => {
    if (changedValues?.formIdGroup?.length) {
      handleFormId(changedValues.formIdGroup[changedValues.formIdGroup.length - 1]);
    }
  }, []);

  const onPublish = useCallback(async () => {
    const formConfigs: FlowFormConfigProperties = await form.validateFields();
    // 目前只允许修改发起人
    if (query.id) {
      const next = StarterSelect.getUserIds(formConfigs.starter)
        .map(({ id }) => id)
        .filter(Boolean) as number[];
      const { success } = await askToHandleFlow({
        id: Number(query.id as string),
        next,
        current: configs?.starter || [],
        needAcl,
      });
      if (success) {
        message.success('发起人修改成功');
        history.push(flowListRoute);
      }
    } else {
      const config: APIFlowChartConfig = {
        name: formConfigs.name,
        description: formConfigs.description,
        categoryId: formConfigs.categoryId,
        formId: formConfigs.formIdGroup.slice(-1)[0],
      };
      const chart = chartData.current;
      if (chart) {
        const { success } = await addFlowTemplate({ config, chart, needAcl });
        if (success) {
          history.push(flowListRoute);
        }
      }
    }
  }, [configs?.starter, flowListRoute, form, needAcl, query.id]);

  useEffect(() => {
    if (query.id) {
      handlePublicConfig({ writeable: false });
      queryFlowTemplate(Number(query.id)).then(({ config, chart }) => {
        if (config && chart) {
          handleConfigs(config);
          handleFormId(config.formIdGroup.slice(-1)[0]);
          handleFlowData(chart);
          handlePublicConfig({
            writeable: false,
            starter: config.starter,
          });
        }
      });
    } else {
      handleFlowData(DefaultFlowData);
    }
  }, [query.id]);

  return (
    <FlowEditorContext.Provider value={publicConfig}>
      <Helmet>
        <title>{name}</title>
      </Helmet>
      <Flex className={styles.navLeft} direction="row" aligns="center">
        <Link className={styles.navBack} to={flowListRoute}>
          <LeftOutlined style={{ lineHeight: 1 }} />
        </Link>
        <Text style={{ paddingLeft: 15, color: '#fff' }} strong>
          {name}
        </Text>
      </Flex>
      <Flex className={styles.navRight} direction="row" justify="flex-end" aligns="center">
        <Button className={styles.preview} onClick={() => handleActiveKey(TabKeyEnum.Preview)}>
          预览
        </Button>
        <Button className={styles.publish} onClick={onPublish}>
          {query.id ? '提交修改' : '发布'}
        </Button>
      </Flex>
      <Tabs
        className={styles.tabs}
        activeKey={activeKey}
        animated
        onTabClick={(key) => handleActiveKey(key as TabKeyEnum)}
      >
        <TabPane key={TabKeyEnum.Basic} tab={<TabTitle index={1} text="基础设置" />}>
          <FlowConfig data={configs} form={form} onFormChange={onConfigChange} />
        </TabPane>
        <TabPane key={TabKeyEnum.Preview} tab={<TabTitle index={2} text="表单预览" />}>
          <FlowPreview propertyId={formId} onTabChange={(key) => handleActiveKey(key as TabKeyEnum)} />
        </TabPane>
        <TabPane key={TabKeyEnum.Editor} tab={<TabTitle index={3} text="流程设计" />}>
          {flowData && (
            <FlowEditor
              data={flowData}
              onChartChange={(data) => {
                chartData.current = data;
              }}
            />
          )}
        </TabPane>
      </Tabs>
    </FlowEditorContext.Provider>
  );
};

export default FlowSection;
