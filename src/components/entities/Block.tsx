// src/components/entities/Block.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Polygon, Rect } from 'react-native-svg';

const BlockRenderer = (props: any) => {
  const { body, shape, dimensions, text, chamfer } = props;
  
  if (!body || !body.position) {
    return null;
  }
  
  const { position, angle } = body;
  
  // 다각형 점 계산 함수
  const getPolygonPoints = (sides: number, radius: number) => {
    let points = '';
    for (let i = 0; i < sides; i++) {
      const x = radius + radius * Math.cos(2 * Math.PI * i / sides);
      const y = radius + radius * Math.sin(2 * Math.PI * i / sides);
      points += `${x},${y} `;
    }
    return points.trim();
  };
  
  // 기본 크기 및 색상
  const defaultSize = 50;
  const bgColor = '#FF0000';
  
  return (
    <View
      style={[
        styles.container,
        {
          left: position.x - defaultSize / 2,
          top: position.y - defaultSize / 2,
          transform: [{ rotate: `${angle}rad` }],
        },
      ]}
    >
      {shape === 'polygon' && dimensions?.radius && dimensions?.sides ? (
        <Svg width={dimensions.radius * 2} height={dimensions.radius * 2}>
          <Polygon
            points={getPolygonPoints(dimensions.sides, dimensions.radius)}
            fill={bgColor}
          />
        </Svg>
      ) : (
        <View
          style={{
            width: dimensions?.width || defaultSize,
            height: dimensions?.height || defaultSize,
            backgroundColor: bgColor,
            borderRadius: chamfer ? chamfer.radius : 0,
          }}
        />
      )}
      <Text style={styles.text} numberOfLines={2} ellipsizeMode="tail">
        {text}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 50,
    height: 50,
  },
  text: {
    position: 'absolute',
    color: 'white',
    fontSize: 10,
    textAlign: 'center',
    width: '80%',
  },
});

export default BlockRenderer;