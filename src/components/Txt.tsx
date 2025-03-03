//한글 - pretendard
//영어 - mustica

//큰놈은 자간 -2% 행간 120%
// 작은놈은 자간 0% 행간 150%
import React from 'react';
import {Text, TextStyle} from 'react-native';
import useThemeStore from '../stores/useThemeStore';

export interface TxtProps {
  children: React.ReactNode;
  style?: TextStyle;
  // variant 값에 따라 폰트 및 텍스트 크기 등의 기본 스타일을 지정할 수 있습니다.
  variant?: 'title' | 'subTitle' | 'paragraph' | 'caption' | 'function';
  className?: string;
}

const variantStyles: { [key: string]: TextStyle } = {
  title: {
    fontFamily: 'Pretendard-Regular', // _layout.tsx에서 로드한 폰트 이름으로 지정
    fontSize: 36,
    lineHeight: 36 * 1.2, // 120% 행간
    letterSpacing: 36 * -0.02, // -2% 자간
  },
  subTitle: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 18,
    lineHeight: 18 * 1.2,
    letterSpacing: 18 * -0.02,
  },
  paragraph: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 14,
    lineHeight: 14 * 1.5,
    letterSpacing: 0,
  },
  caption: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 12,
    lineHeight: 12 * 1.5,
    letterSpacing: 0,
  },
  function: {
    fontFamily: 'Pretendard-Regular',
    fontSize: 24,
    lineHeight: 24 * 1.2,
    letterSpacing: 24 * -0.02,
  },
};

const Txt = ({
  children,
  variant = 'paragraph',
  ...props
}: TxtProps) => {
  const { theme } = useThemeStore();
  return (
    <Text 
    {...props}
    style={[variantStyles[variant], props.style]}
    className={`${props.className} ${theme==="dark"?"text-white":"text-black"}`}
    >
      {children}
    </Text>
  );
}

export default Txt;
