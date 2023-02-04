/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @description 流程节点属性配置抽屉
 */

import React, { useCallback, useContext, useEffect, useRef } from 'react';
import { Drawer, Button } from 'antd';
import type { FormInstance } from 'antd/lib/form';

import type { StarterFormValue } from '../Starter';
import Starter from '../Starter';
import type { ApproverFormValue, ApproverTitleFormValue } from '../Approver';
import Approver from '../Approver';
import type { NotifierFormValue, NotifierTitleFormValue } from '../Notifier';
import Notifier from '../Notifier';
import { FlowEditorContext } from '../../index';
import type { FlowChartData } from '../../data';
import styles from './index.less';

export interface MainDrawerFormValue {
  start?: StarterFormValue;
  title?: ApproverTitleFormValue | NotifierTitleFormValue;
  content?: ApproverFormValue | NotifierFormValue;
  form?: FormInstance;
}

interface Props {
  visible: boolean;
  data?: FlowChartData;
  onConfirm: (values: MainDrawerFormValue) => void;
  onClose: () => void;
}

const MainDrawer: React.FC<Props> = ({ visible, data, onConfirm, onClose }) => {
  const { writeable } = useContext(FlowEditorContext);
  const currentData = useRef<MainDrawerFormValue>({});

  const onStartChange = useCallback((values: StarterFormValue | null, form: FormInstance) => {
    if (values) {
      currentData.current.start = values;
    }
    currentData.current.form = form;
  }, []);

  const onTitleChange = useCallback((values: ApproverTitleFormValue | NotifierTitleFormValue | null) => {
    if (values && 'name' in values) {
      currentData.current.title = values;
      currentData.current.form = undefined;
    }
  }, []);

  const onContentChange = useCallback((values: ApproverFormValue | NotifierFormValue | null, form?: FormInstance) => {
    if (values) {
      currentData.current.form = form;
      currentData.current.content = values;
    } else if (form) {
      currentData.current.form = form;
    }
  }, []);

  // 展示标题
  const renderTitle = useCallback(() => {
    if (data?.type === 'start') {
      return <Starter.Title data={data} />;
    }
    if (data?.type === 'approver') {
      return <Approver.Title data={data} onFormChange={onTitleChange} />;
    }
    if (data?.type === 'notify') {
      return <Notifier.Title data={data} onFormChange={onTitleChange} />;
    }
    return null;
  }, [data, onTitleChange]);

  // 展示内容
  const renderContent = useCallback(() => {
    if (data?.type === 'start') {
      return <Starter data={data} onFormChange={onStartChange} />;
    }
    if (data?.type === 'approver') {
      return <Approver data={data} onFormChange={(values, form) => onContentChange(values, form)} />;
    }
    if (data?.type === 'notify') {
      return <Notifier data={data} onFormChange={onContentChange} />;
    }
    return null;
  }, [data, onContentChange, onStartChange]);

  useEffect(() => {
    if (data && data?.type !== 'start') {
      currentData.current.title = {
        name: data.name,
        hasBeenEdited: false,
      };
    }
  }, [data]);

  return (
    <Drawer
      bodyStyle={{ padding: 0 }}
      width={550}
      placement="right"
      closable={false}
      onClose={onClose}
      visible={visible}
      title={renderTitle()}
      destroyOnClose
      maskClosable
    >
      <div className={styles.container}>
        <div className={styles.content}>{renderContent()}</div>
        {!writeable && <div className={styles.disableMask} />}
      </div>
      <div className={styles.editDrawerFooter}>
        <Button style={{ marginRight: 15 }} onClick={onClose}>
          {writeable ? '取消' : '关闭'}
        </Button>
        {writeable && (
          <Button
            type="primary"
            onClick={async () => {
              await currentData.current.form?.validateFields();
              onConfirm(currentData.current);
            }}
          >
            保存
          </Button>
        )}
      </div>
    </Drawer>
  );
};

export default MainDrawer;
