import Text from './Txt';
import {Pressable, TextStyle, ViewStyle} from 'react-native';

type ButtonProps = {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  containerStyle?: ViewStyle | ViewStyle[];
  textStyle?: TextStyle | TextStyle[];
};

const Button = ({
  text,
  onPress,
  disabled,
  isLoading,
  containerStyle,
  textStyle,
}: Readonly<ButtonProps>) => {
  return (
    <Pressable
      className={`h-[32] justify-center items-center flex-row ${
        disabled ? 'bg-gray300' : 'bg-yellowPrimary'
      }`}
      style={[{borderRadius: 10}, containerStyle]}
      onPress={onPress}
      disabled={disabled}>
      {isLoading ? (
        <Text
          variant="title"
          children="Loading..."
        />
      ) : (
        <Text
          variant="title"
          children={text}
          
        />
      )}
    </Pressable>
  );
};

export default Button;
