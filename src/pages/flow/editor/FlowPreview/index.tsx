import React, { useEffect, useRef, useState } from 'react';
import { Button, Card, Col, Empty, Form, Input, Row } from 'antd';
import type { ColProps } from 'antd/lib/col';

import { queryFormProperties } from '@/services/formProperty';
import type { FormPropertyData } from '@/types/formProperty';
import Flex from '@/components/Flex';

import PropertyInput from './components/PropertyInput';
import { TabKeyEnum } from '../index';

interface Props {
  propertyId?: number;
  onTabChange: (key: TabKeyEnum) => void;
}

const { Item: FormItem } = Form;

const TextAreaLayout: ColProps = {
  span: 24,
};

const ColLayout: ColProps = {
  sm: 24,
  md: 12,
  lg: 8,
};

const fieldLabels = {
  name: '申请人',
  department: '所在部门',
  position: '所在岗位',
};

const FormPreview: React.FC<Props> = ({ propertyId, onTabChange }) => {
  const [form] = Form.useForm();
  const refForm = useRef<typeof Form>(null);
  const [formData, handleFormData] = useState<FormPropertyData>();

  useEffect(() => {
    if (propertyId) {
      queryFormProperties(propertyId).then((data) => {
        handleFormData(data);
      });
    }
  }, [propertyId, form]);

  return (
    <Form name="createSynergy" ref={refForm as any} form={form} layout="vertical">
      <Card style={{ margin: 24 }} title={!!formData && '基本信息（仅预览）'} bordered={false}>
        {formData ? (
          <Row gutter={{ xs: 8, sm: 16 }}>
            <Col {...ColLayout}>
              <FormItem name="name" label={fieldLabels.name} rules={[{ required: true }]}>
                <Input />
              </FormItem>
            </Col>
            <Col {...ColLayout}>
              <FormItem name="department" label={fieldLabels.department} rules={[{ required: true }]}>
                <Input />
              </FormItem>
            </Col>
            <Col {...ColLayout}>
              <FormItem name="position" label={fieldLabels.position} rules={[{ required: true }]}>
                <Input />
              </FormItem>
            </Col>
            {formData?.formProperties.map((property) => {
              const { key, name, type, isRequired } = property;
              return (
                <Col key={key} {...(type === 'textarea' ? TextAreaLayout : ColLayout)}>
                  <FormItem name={key} label={name} rules={[{ required: isRequired }]}>
                    <PropertyInput name={key} type={type} list={property.formValues} />
                  </FormItem>
                </Col>
              );
            })}
          </Row>
        ) : (
          <Flex direction="column" justify="center" aligns="center">
            <Empty
              style={{ marginBottom: 15 }}
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="请先在基础设置中选择表单"
            />
            <Button type="primary" onClick={() => onTabChange(TabKeyEnum.Basic)}>
              去设置
            </Button>
          </Flex>
        )}
      </Card>
    </Form>
  );
};

export default FormPreview;
