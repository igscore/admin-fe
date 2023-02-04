/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @description 流程节点
 */

import React, { useContext } from 'react';
import { Card, Typography } from 'antd';
import { AuditOutlined, CloseOutlined, RightOutlined, SendOutlined, UserOutlined } from '@ant-design/icons';

import Flex from '@/components/Flex';

import FlowTypePopver from './FlowTypePopver';
import { FlowEditorContext } from '../../index';
import type { FlowChartNodeEndModeEnum } from '../../service';
import { FlowChartNodeAssigneeEnum, FlowChartNodeEndModeMaps } from '../../service';
import type { FlowChartCreationType, FlowChartData, FlowChartType, FlowConfigEnumType } from '../../data';

import styles from './FlowItem.less';

const { Text } = Typography;

const HeadStyle: React.CSSProperties = {
  width: '100%',
  height: 24,
  fontSize: 12,
  color: '#fff',
};

const BodyStyle: React.CSSProperties = {
  width: '100%',
  height: 54,
};

const FlowConfigEnum: FlowConfigEnumType = {
  start: {
    head: {
      bgColor: 'rgb(87, 106, 149)',
      icon: <UserOutlined style={{ marginRight: 3 }} />,
    },
    content: {
      defaultText: '选择发起人',
      format: (content) => content.join(','),
    },
  },
  approver: {
    head: {
      bgColor: 'rgb(255, 148, 62)',
      icon: <AuditOutlined style={{ marginRight: 3 }} />,
    },
    content: {
      defaultText: '选择审批人',
      format: (content, assigneeKey, taskEndMode) => {
        if (assigneeKey === FlowChartNodeAssigneeEnum.SPECIFIED_USER_ID && content.length > 1 && taskEndMode) {
          return `${content.length}人${FlowChartNodeEndModeMaps[taskEndMode].text}`;
        }
        return content.join(',');
      },
    },
  },
  notify: {
    head: {
      bgColor: 'rgb(50, 150, 250)',
      icon: <SendOutlined style={{ marginRight: 3 }} />,
    },
    content: {
      defaultText: '选择抄送人',
      format: (content) => content.join(','),
    },
  },
};

interface Props {
  data: FlowChartData;
  onClick: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onDelete: (e: React.MouseEvent<HTMLElement, MouseEvent>) => void;
  onTypeClick: (type: FlowChartCreationType) => void;
}

interface ContentProps {
  type: Exclude<FlowChartType, 'end'>;
  assigneeKey?: FlowChartNodeAssigneeEnum;
  taskEndMode?: FlowChartNodeEndModeEnum;
  content: string[];
}

const FlowItemTitle: React.FC<{ data: Props['data'] }> = ({ data }) => {
  const { type, name } = data;
  return (
    <>
      {FlowConfigEnum[type].head.icon}
      <span>{name}</span>
    </>
  );
};

const FlowItemContent: React.FC<ContentProps> = ({ type, content, assigneeKey, taskEndMode }) => {
  if (content?.length) {
    const contentText = FlowConfigEnum[type].content.format(content, assigneeKey, taskEndMode);
    return <Text className={styles.content}>{contentText}</Text>;
  }
  return (
    <Text className={styles.content} type="secondary">
      {FlowConfigEnum[type].content.defaultText}
    </Text>
  );
};

const FlowItem: React.FC<Props> = ({ data, onClick, onDelete, onTypeClick }) => {
  const { writeable } = useContext(FlowEditorContext);
  const className = data.type === 'start' ? styles.cardwithoutdown : styles.card;
  const ExtraComponent = writeable && data.type !== 'start' && (
    <CloseOutlined onClick={onDelete} style={{ color: '#fff' }} />
  );
  const { extra } = data;
  const { content } = extra || {};

  return (
    <div className={styles.container}>
      <div onClick={onClick}>
        <Card
          size="small"
          className={className}
          key={data.nodeId}
          title={<FlowItemTitle data={data} />}
          headStyle={{
            ...HeadStyle,
            background: FlowConfigEnum[data.type].head.bgColor,
          }}
          bodyStyle={BodyStyle}
          extra={ExtraComponent}
          hoverable
        >
          <Flex justify="space-between" aligns="center" style={{ height: '100%' }}>
            {data.type !== 'end' && (
              <FlowItemContent
                type={data.type}
                assigneeKey={data.properties.assignee?.key}
                taskEndMode={data.properties.taskEndMode}
                content={content}
              />
            )}
            <RightOutlined />
          </Flex>
        </Card>
      </div>
      <div className={styles.btnBox}>
        <div className={styles.btn}>
          <FlowTypePopver onClick={onTypeClick} />
        </div>
      </div>
    </div>
  );
};

export default FlowItem;
