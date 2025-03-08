import React from 'react';
import Svg, { Circle, Path, Defs, RadialGradient, LinearGradient, Stop } from 'react-native-svg';

interface BubbleSvgProps {
  width?: number;
  height?: number;
  color?: string;
}

export default function BubbleSvg({ width = 68, height = 68, color }: BubbleSvgProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 68 68" fill="none">
      <Circle cx="34" cy="34" r="30" fill="#010101" fillOpacity="0.1"/>
      <Circle cx="34" cy="34" r="33.5" fill="#010101" fillOpacity="0.05" stroke="url(#paint0_radial_80_373)"/>
      <Path d="M36.5 61.9603C25.7304 61.9603 17 55.2446 17 46.9603C17 38.676 25.7304 45.9603 36.5 45.9603C47.2696 45.9603 56 38.676 56 46.9603C56 55.2446 47.2696 61.9603 36.5 61.9603Z" fill="#5750C5" fillOpacity="0.2"/>
      <Path d="M36.5 61.9603C25.7304 61.9603 17 55.2446 17 46.9603C17 38.676 25.7304 45.9603 36.5 45.9603C47.2696 45.9603 56 38.676 56 46.9603C56 55.2446 47.2696 61.9603 36.5 61.9603Z" fill="#5750C5" fillOpacity="0.2"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M4.26566 47.0409C4.67722 48.0906 6.15135 47.597 6.07911 46.4719C6.02664 45.6547 6 44.8304 6 44C6 23.0132 23.0132 6 44 6C44.8304 6 45.6547 6.02664 46.4719 6.07911C47.597 6.15135 48.0906 4.67722 47.0409 4.26566C43.3105 2.80305 39.249 2 35 2C16.7746 2 2 16.7746 2 35C2 39.249 2.80305 43.3105 4.26566 47.0409Z" fill="url(#paint1_linear_80_373)" fillOpacity="0.5"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M60.9743 32.3927C60.7558 31.7249 59.8203 31.9692 59.8203 32.6719V32.6719C59.8203 46.479 48.6274 57.6719 34.8203 57.6719C34.5948 57.6719 34.3701 57.6689 34.146 57.663C33.0233 57.6332 32.5236 59.0726 33.5865 59.4354C35.7664 60.1795 38.1039 60.5833 40.5357 60.5833C52.4098 60.5833 62.0356 50.9574 62.0356 39.0833C62.0356 36.7474 61.6631 34.4985 60.9743 32.3927Z" fill="url(#paint2_linear_80_373)" fillOpacity="0.5"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M25.4561 10.8241C26.8166 10.062 26.9481 8.13822 25.4693 7.64337C24.2222 7.22606 22.8875 7 21.5 7C14.5964 7 9 12.5964 9 19.5C9 20.5175 9.12156 21.5065 9.35096 22.4535C9.71798 23.9686 11.6447 24.001 12.5191 22.7105C15.8389 17.8111 20.2724 13.7277 25.4561 10.8241Z" fill="url(#paint3_linear_80_373)" fillOpacity="0.2"/>
      <Path fillRule="evenodd" clipRule="evenodd" d="M47.1892 54.8321C46.0722 55.4571 45.6982 56.9673 46.854 57.5173C47.5043 57.8268 48.2319 57.9999 48.9999 57.9999C51.7613 57.9999 53.9999 55.7614 53.9999 52.9999C53.9999 52.8369 53.9921 52.6756 53.9768 52.5165C53.8548 51.2445 52.3109 51.0818 51.3444 51.9176C50.066 53.0231 48.6743 54.0012 47.1892 54.8321Z" fill="url(#paint4_linear_80_373)" fillOpacity="0.2"/>
      <Circle cx="11.5" cy="21.5" r="1.5" fill="url(#paint5_radial_80_373)" fillOpacity="0.2"/>
      <Circle cx="53" cy="53" r="1" fill="url(#paint6_radial_80_373)" fillOpacity="0.2"/>
      <Defs>
        <RadialGradient id="paint0_radial_80_373" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(34 34) rotate(90) scale(37.5)">
          <Stop offset="0.880036" stopColor="#3A7BFE" stopOpacity="0"/>
          <Stop offset="0.889271" stopColor="#3A7BFE"/>
          <Stop offset="0.897917" stopColor="#85DBDE"/>
          <Stop offset="0.906771" stopColor="#85DBDE" stopOpacity="0"/>
        </RadialGradient>
        <LinearGradient id="paint1_linear_80_373" x1="24.8096" y1="2" x2="24.8096" y2="47.6191" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#85DBDE"/>
          <Stop offset="0.1" stopColor="#FFFF84" stopOpacity="0.760784"/>
          <Stop offset="1" stopColor="#85DBDE"/>
        </LinearGradient>
        <LinearGradient id="paint2_linear_80_373" x1="47.5179" y1="32" x2="47.5179" y2="60.5833" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#85DBDE"/>
          <Stop offset="0.345" stopColor="#FFFF84"/>
          <Stop offset="1" stopColor="#85DBDE"/>
        </LinearGradient>
        <LinearGradient id="paint3_linear_80_373" x1="17.7641" y1="7" x2="17.7641" y2="23.6369" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FFFF84"/>
          <Stop offset="1" stopColor="#FAFAFA"/>
        </LinearGradient>
        <LinearGradient id="paint4_linear_80_373" x1="50.0744" y1="51.4008" x2="50.0744" y2="57.9999" gradientUnits="userSpaceOnUse">
          <Stop stopColor="#FAFAFA"/>
          <Stop offset="1" stopColor="#FFFF84"/>
        </LinearGradient>
        <RadialGradient id="paint5_radial_80_373" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(11.5 21.5) rotate(90) scale(1.5)">
          <Stop stopColor="#FAFAFA"/>
          <Stop offset="1" stopColor="#FAFAFA" stopOpacity="0"/>
        </RadialGradient>
        <RadialGradient id="paint6_radial_80_373" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(53 53) rotate(90)">
          <Stop stopColor="#FAFAFA"/>
          <Stop offset="1" stopColor="#FAFAFA" stopOpacity="0"/>
        </RadialGradient>
      </Defs>
    </Svg>
  );
}
