import React from 'react';
import Svg, { Circle, Defs, RadialGradient, Stop } from 'react-native-svg';

interface BubbleGradientProps {
  width?: number;
  height?: number;
}

const BubbleGradient = ({ width = 66, height = 66 }: BubbleGradientProps) => {
  return (
    <Svg width={width} height={height} viewBox="0 0 66 66" fill="none">
      <Circle cx="33" cy="33" r="33" fill="url(#paint0_radial_117_5)"/>
      <Defs>
        <RadialGradient 
          id="paint0_radial_117_5" 
          cx="0" 
          cy="0" 
          r="1" 
          gradientUnits="userSpaceOnUse" 
          gradientTransform="translate(33 33) rotate(90) scale(33)"
        >
          <Stop stopColor="#D1D1D1"/>
          <Stop offset="1" stopColor="#D1D1D1" stopOpacity="0"/>
        </RadialGradient>
      </Defs>
    </Svg>
  );
};
export default BubbleGradient;