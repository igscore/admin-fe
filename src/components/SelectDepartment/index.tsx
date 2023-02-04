import React, { useCallback, useState } from 'react';
import { Select, Typography } from "antd";
import Flex from "@/components/Flex";

import type { DepartmentItem } from "@/pages/setting/department/data";
import { queryDepartmentListByFilter } from "@/pages/setting/department/service";

interface Props {
  style?: React.CSSProperties;
  onSelect: (value: number) => void;
}

const { Option } = Select;
const { Text } = Typography;

const SelectDepartment: React.FC<Props> = props => {
  const { style, onSelect } = props;
  const [value, handleValue] = useState<number>();
  const [list, handleList] = useState<DepartmentItem[]>([]);

  const onSearch = useCallback(async (name: string) => {
    if (name) {
      const data = await queryDepartmentListByFilter({
        limit: 100,
        offset: 0,
        name,
      });
      handleList(data);
    } else {
      handleList([]);
    }
  }, [])

  const onChange = useCallback((v: number) => {
    handleValue(v);
    onSelect(v);
  }, [onSelect]);

  return (
    <Select
      showSearch
      value={value}
      placeholder="输入部门名称查询"
      style={style}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={null}
      onSearch={onSearch}
      onChange={onChange}
    >
      {list.map(item => (
        <Option key={item.id} value={item.id}>
          <Flex direction="column" aligns="flex-start">
            <Text>{item.name}</Text>
            <Text type="secondary">{item.fullName}</Text>
          </Flex>
        </Option>
      ))}
    </Select>
  );
};

export default SelectDepartment;
