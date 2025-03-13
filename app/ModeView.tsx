// import React, { useRef, useState } from 'react';
// import { View, StyleSheet, PanResponder, Animated } from 'react-native';

// const ModeView = () => {
//   // Animated.ValueXY를 사용하여 상자의 위치를 관리
//   const pan = useRef(new Animated.ValueXY()).current;
  
//   // 상자가 드래그 중인지 여부를 추적
//   const [isDragging, setIsDragging] = useState(false);

//   // PanResponder 설정
//   const panResponder = useRef(
//     PanResponder.create({
//       onStartShouldSetPanResponder: () => true,
      
//       onPanResponderGrant: () => {
//         // 드래그 시작 시 현재 오프셋을 유지
//         setIsDragging(true);
//         pan.extractOffset();
//       },
      
//       onPanResponderMove: Animated.event(
//         [null, { dx: pan.x, dy: pan.y }],
//         { useNativeDriver: false }
//       ),
      
//       onPanResponderRelease: () => {
//         setIsDragging(false);
//         // 현재 오프셋을 유지
//         pan.flattenOffset();
//       }
//     })
//   ).current;

//   return (
//     <View style={styles.container}>
//       <Animated.View
//         style={[
//           styles.box,
//           {
//             transform: [{ translateX: pan.x }, { translateY: pan.y }],
//             backgroundColor: isDragging ? 'rgba(0, 0, 255, 0.7)' : 'rgba(0, 0, 255, 0.5)'
//           }
//         ]}
//         {...panResponder.panHandlers}
//       />
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#d1d1d1',
//   },
//   box: {
//     position: 'absolute',
//     width: 100,
//     height: 100,
//     borderWidth: 1,
//     borderColor: 'white',
//     top: 100,  // 초기 위치
//     left: 100, // 초기 위치
//   }
// });

// export default ModeView;


