import React from 'react';
import ProTable from '@ant-design/pro-table';
import type { ProTableProps } from '@ant-design/pro-table';

export default function ProTablePlus<
  T extends Record<string, any>,
  U extends Record<string, any> = Record<string, any>,
  ValueType = 'text'
>(props: ProTableProps<T, U, ValueType>) {
  return <ProTable {...props} />;
}
