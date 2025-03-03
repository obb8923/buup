import { TouchableOpacity, Text } from "react-native";

const RefreshButton = ({setEntities, setKey, Bubble, Box, resetAnimation}: {setEntities: any, setKey: any, Bubble: any, Box: any, resetAnimation: any}) => {
    return (
        <TouchableOpacity 
        className="absolute right-5 top-5 bg-white rounded-full w-[60px] h-[60px] justify-center items-center shadow-md z-[3]"
        onPress={() => {
          resetAnimation(setEntities, setKey, Bubble, Box);
        }}
      >
        <Text className="text-2xl">🔄</Text>
      </TouchableOpacity>
    )
}

export default RefreshButton;
