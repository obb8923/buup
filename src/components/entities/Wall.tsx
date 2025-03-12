import { View } from "react-native";

// 벽 렌더러 컴포넌트
const WallRenderer = ({ body}: { body: Matter.Body }) => {
    const width = body.bounds.max.x - body.bounds.min.x;
    const height = body.bounds.max.y - body.bounds.min.y;
    const x = body.position.x - width / 2;
    const y = body.position.y - height / 2;
    
    return (
      <View 
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: width,
          height: height,
          backgroundColor: 'transparent'
        }}
      />
    );
  };


export default WallRenderer;