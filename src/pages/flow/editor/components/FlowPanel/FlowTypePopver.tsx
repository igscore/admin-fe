/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @description 流程节点创建类型选择弹窗
 */

import React, { useContext, useState } from 'react';
import { Button, Popover, Typography } from 'antd';
import { PlusOutlined, AuditOutlined } from '@ant-design/icons';

import { FlowEditorContext } from '../../index';
import { FlowChartCreationType } from '../../data';
import styles from './FlowTypePopver.less';

const { Text } = Typography;

const FlowEditorOptions: Array<{
  id: FlowChartCreationType;
  icon: React.ReactElement;
  text: string;
}> = [
  { id: 'approver', icon: <AuditOutlined style={{ color: '#ff943e' }} />, text: '审批人' },
  // { id: 'notifier', icon: <SendOutlined style={{ color: '#3296fa' }} />, text: '抄送人' },
];

interface Props {
  onClick(type: FlowChartCreationType): void;
}

const FlowTypePopver: React.FC<Props> = (props) => {
  const { onClick } = props;
  const { writeable } = useContext(FlowEditorContext);
  const [visible, handleVisible] = useState<boolean>(false);

  return !writeable ? null : (
    <Popover
      visible={visible}
      placement="rightTop"
      trigger="click"
      onVisibleChange={(show) => handleVisible(show)}
      content={
        <div>
          {FlowEditorOptions.map((item) => (
            <div
              key={item.id}
              className={styles.item}
              onClick={() => {
                handleVisible(false);
                onClick(item.id);
              }}
            >
              <div className={styles.wrapper}>{item.icon}</div>
              <Text>{item.text}</Text>
            </div>
          ))}
        </div>
      }
    >
      <Button className={styles.btn} type="primary" shape="circle" icon={<PlusOutlined />} />
    </Popover>
  );
};

export default FlowTypePopver;
