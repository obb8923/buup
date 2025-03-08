import { Dimensions } from 'react-native';
const { width } = Dimensions.get('window');
export const BubbleConstant = {
    size: 32.5,
    minSize: 26,
    maxSize: 39,
    startScale: 0.6,
    density: 0.001,
    restitution: 0.7,
    friction: 0.2,
    airFriction: 0.2,
    buoyancy: 0.0000015,
}
