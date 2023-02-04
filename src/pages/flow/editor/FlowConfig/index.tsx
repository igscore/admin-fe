/**
 * @author liuzhimeng
 * @date 2020-04-06
 * @descriptio 流程图基础配置
 */

import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Card, Cascader, Form, Input, Select } from 'antd';
import type { FormInstance } from 'antd/es/form';

import { queryFormCategory, querySynergyForm } from '@/services/formList';
import { queryFlowCategory } from '@/pages/flow/category/service';
import type { FormCategoryItem, SynergyFormItem } from '@/types/formList';
import type { FlowCategoryItem } from '@/pages/flow/category/data';

import StarterSelect from '../components/StarterSelect';
import { FlowEditorContext } from '../index';
import type { FlowFormConfigProperties } from '../data';

import styles from './index.less';

const { Item: FormItem } = Form;

interface Props {
  data?: FlowFormConfigProperties;
  form: FormInstance;
  onFormChange: (value: any) => void;
}

const getCascaderData = (categories: FormCategoryItem[], formList: SynergyFormItem[]) => {
  let nextFroms = formList;
  return categories.map(({ id, name }) => {
    const children = [];
    const leftForms = [];
    // eslint-disable-next-line no-plusplus
    for (let i = 0; i < nextFroms.length; i++) {
      const item = nextFroms[i];
      if (item.formCategoryId === id) {
        children.push({ value: item.id, label: item.name });
      } else {
        leftForms.push(item);
      }
    }
    nextFroms = leftForms;
    return { value: id, label: name, children };
  });
};

const FlowConfig: React.FC<Props> = ({ form, data, onFormChange }) => {
  const { writeable } = useContext(FlowEditorContext);
  const [flowCategories, handleFlowCategory] = useState<FlowCategoryItem[]>([]);
  const [formGroups, handleFormGroups] = useState<any[]>([]);

  const onValuesChange = useCallback(
    (changedValues: any) => {
      onFormChange(changedValues);
    },
    [onFormChange],
  );

  useEffect(() => {
    queryFlowCategory().then(({ data: categories }) => {
      handleFlowCategory(categories);
    });
  }, []);

  useEffect(() => {
    Promise.all([queryFormCategory(), querySynergyForm()]).then(([{ data: categories }, { data: formList }]) => {
      const groups = getCascaderData(categories, formList);
      handleFormGroups(groups);
      if (data) {
        const curFormId = data.formIdGroup.slice(-1)[0];
        if (curFormId) {
          const { formCategoryId } = formList.find(({ id }) => id === curFormId) || {};
          if (formCategoryId) {
            form.setFieldsValue({
              formIdGroup: [formCategoryId, ...data.formIdGroup],
            });
          }
        }
      }
    });
    if (data) {
      form.setFieldsValue({
        name: data.name,
        starter: data.starter || [],
        categoryId: data.categoryId,
        description: data.description,
      });
    }
  }, [data, form]);

  const InputProps = {
    disabled: !writeable,
  };

  return (
    <Card className={styles.container} bordered={false}>
      <Form form={form} layout="vertical" onValuesChange={onValuesChange}>
        <FormItem label="指定发起人" name="starter" rules={[{ required: true, message: '请输入流程名称' }]}>
          <StarterSelect />
        </FormItem>
        <FormItem label="选择表单" name="formIdGroup" rules={[{ required: true, message: '请为流程指定表单' }]}>
          <Cascader
            placeholder="可输入表单名搜索"
            expandTrigger="hover"
            options={formGroups}
            showSearch
            {...InputProps}
          />
        </FormItem>
        <FormItem label="流程名称" name="name" rules={[{ required: true, message: '请输入流程名称' }]}>
          <Input placeholder="请输入流程名称" {...InputProps} />
        </FormItem>
        <FormItem label="流程分组" name="categoryId" rules={[{ required: true, message: '请选择流程分组' }]}>
          <Select placeholder="请选择流程分组" {...InputProps}>
            {flowCategories.map(({ id, name }) => (
              <Select.Option key={id} value={id}>
                {name}
              </Select.Option>
            ))}
          </Select>
        </FormItem>
        <FormItem label="流程描述" name="description">
          <Input.TextArea placeholder="请输入流程描述" {...InputProps} />
        </FormItem>
      </Form>
    </Card>
  );
};

export default FlowConfig;
