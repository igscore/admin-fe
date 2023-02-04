import React from 'react';
import { Checkbox, Input, InputNumber, Radio, Select, DatePicker, Form, Typography } from 'antd';
import { FormPropertyItem, FormPropertyType, FormPropertyValueItem } from '@/types/formProperty';
import { digitUppercase } from '@/utils/utils';

interface Props {
  type: FormPropertyType;
  name: string;
  list?: FormPropertyValueItem[];
  [prop: string]: any;
}

const NeedInitialize: string[] = ['checkbox', 'select'];

export const initializeProperty = (property: FormPropertyItem) => {
  const { type, defaultValue, formValues } = property;
  if (defaultValue) {
    if (type === 'radio') {
      const formValue = formValues.find(({ value }) => value === defaultValue);
      return formValue?.id || undefined;
    }
    if (NeedInitialize.includes(type)) {
      const defaults = defaultValue.split(/[,，]/);
      return formValues.reduce((ids, { value, id }) => {
        if (defaults.includes(value)) {
          ids.push(id);
        }
        return ids;
      }, [] as number[]);
    }
  }
  return defaultValue || undefined;
};

const PropertyInput: React.FC<Props> = (props) => {
  const { type, list = [], name, ...rest } = props;

  if (type === 'textarea') {
    return <Input.TextArea style={{ width: '100%' }} autoSize={{ minRows: 3, maxRows: 6 }} {...rest} />;
  }
  if (type === 'number') {
    return <InputNumber style={{ width: '100%' }} step={1} {...rest} />;
  }
  // 金额大写
  if (type === 'cash-zh') {
    const value = Number.isNaN(parseFloat(rest.value))
      ? '请输入数字，提交后自动大写'
      : digitUppercase(parseFloat(rest.value));
    return (
      <>
        <Form.Item name={name} noStyle>
          <Input style={{ width: '30%', marginRight: 10 }} {...rest} />
        </Form.Item>
        <Typography.Text type="secondary">{value}</Typography.Text>
      </>
    );
  }
  if (type === 'date') {
    return <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD HH:mm" showTime showNow {...rest} />;
  }
  if (type === 'radio' && list.length) {
    return (
      <Radio.Group {...rest}>
        {list.map(({ id, value }) => (
          <Radio key={id} value={value}>
            {value}
          </Radio>
        ))}
      </Radio.Group>
    );
  }
  if (type === 'checkbox' && list.length) {
    return (
      <Checkbox.Group {...rest}>
        {list.map(({ id, value }) => (
          <Checkbox key={id} value={value}>
            {value}
          </Checkbox>
        ))}
      </Checkbox.Group>
    );
  }
  if (type === 'select' && list.length) {
    return (
      <Select {...rest}>
        {list.map(({ id, value }) => (
          <Select.Option key={id} value={value}>
            {value}
          </Select.Option>
        ))}
      </Select>
    );
  }
  return <Input {...rest} />;
};

export default PropertyInput;
