import { TouchableOpacity, Text } from "react-native"
import { useRouter } from 'expo-router';

// Expo Router 사용
const MenuButton = () => {
    const router = useRouter();
    return (
        <TouchableOpacity 
        className="absolute left-5 top-5 bg-white rounded-full w-[60px] h-[60px] justify-center items-center shadow-md z-[3]"
        onPress={() => {
          // Expo Router를 사용하여 메뉴 화면으로 이동
          router.push('/Menu');
          // 메뉴 기능 구현
        }}
      >
        <Text className="text-2xl">📋</Text>
      </TouchableOpacity>
    )
}

export default MenuButton;
