import React from 'react';
import * as AntIcon from '@ant-design/icons';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  name: string;
  size?: number;
}

const getStyle = ({ size, style }: Props) => {
  let mixStyle: React.CSSProperties = {};
  if (size) {
    mixStyle.width = size;
    mixStyle.height = size;
  }
  if (style) {
    mixStyle = { ...mixStyle, ...style };
  }
  return mixStyle;
};

const CustomIcon: React.FC<Props> = props => {
  const style = getStyle(props);
  return React.createElement(AntIcon && AntIcon[props.name], {
    style,
  });
};

export default CustomIcon;
