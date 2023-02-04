import React, { useCallback, useMemo, useState } from 'react';
import { Checkbox } from 'antd';

import Flex from '@/components/Flex';
import { CalendarItem } from '@/pages/calendar/list/data';

import styles from '../styles.less';

interface Props {
  calendars: CalendarItem[];
  onValueChange(value: number[]): void;
  onSelect(item: CalendarItem): void;
}

const ListPanel: React.FunctionComponent<Props> = ({ calendars, onValueChange, onSelect }) => {
  const [current, handleCurrent] = useState<CalendarItem>(calendars[0]);

  const defaultValue = useMemo(() => calendars.map(({ id }) => id), [calendars]);

  const onSelectItem = useCallback((item) => {
    handleCurrent(item);
    onSelect(item);
  }, []);

  return (
    !!calendars.length && (
      <Checkbox.Group className={styles.list} defaultValue={defaultValue} onChange={onValueChange as any}>
        {calendars.map((item) => {
          const { id, name } = item;
          return (
            <Flex
              key={id}
              direction="row"
              aligns="center"
              className={current.id === id ? styles.itemSelect : styles.itemNormal}
              onClick={() => onSelectItem(item)}
            >
              <div className={styles.itemColor} style={{ background: item.color }} />
              <Checkbox style={{ marginRight: 5 }} value={id} />
              {name}
            </Flex>
          );
        })}
      </Checkbox.Group>
    )
  );
};

export default ListPanel;
