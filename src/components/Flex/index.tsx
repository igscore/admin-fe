import React from 'react';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: React.CSSProperties['flexDirection'];
  justify?: React.CSSProperties['justifyContent'];
  aligns?: React.CSSProperties['alignItems'];
}

const Flex: React.FC<FlexProps> = props => {
  const { direction, justify, aligns, className, style = {}, children, ...rest } = props;
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: direction,
    justifyContent: justify,
    alignItems: aligns,
  };
  return (
    <div className={className} style={{ ...styles, ...style }} {...rest}>
      {children}
    </div>
  );
};

export default Flex;
