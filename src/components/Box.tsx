import React from 'react';
import { View } from 'react-native';

type BoxProps = {
  size: [number, number];
  color: string;
  body: Matter.Body;
};

const Box = (props: BoxProps) => {
  const width = props.size[0];
  const height = props.size[1];
  const x = props.body.position.x - width / 2;
  const y = props.body.position.y - height / 2;
  const angle = props.body.angle;

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: width,
        height: height,
        backgroundColor: props.color,
        transform: [{ rotate: angle + 'rad' }]
      }}
    />
  );
};

export default Box;