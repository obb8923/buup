import { TouchableOpacity, Text } from "react-native"
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import useToDoStore from '../../stores/useToDoStore';
import React from 'react';
// Expo Router 사용
const MenuButton = ({ menuType = "Setting" }: { menuType?: "ToDo" | "Setting" } = {}) => {
    const router = useRouter();
    const { todos, sortByDeadline } = useToDoStore();
    const [isLoading, setIsLoading] = useState(false);
    
    // 메뉴로 이동하기 전에 데이터를 미리 준비하는 함수
    const handleMenuPress = useCallback(async () => {
        if (isLoading) return; // 이미 로딩 중이면 중복 실행 방지
        
        setIsLoading(true);
        
        try {
            // 데이터 정렬 (이 작업이 무거운 경우 성능에 영향을 줄 수 있음)
            sortByDeadline();
            
            // 약간의 지연 후 화면 전환 (필요한 경우)
            setTimeout(() => {
                // 메뉴 타입과 함께 라우팅
                router.push({
                    pathname: '/Menu',
                    params: { initialMenuType: menuType }
                });
                setIsLoading(false);
            }, 50);
        } catch (error) {
            console.error('메뉴 이동 준비 중 오류:', error);
            setIsLoading(false);
            // 오류가 발생해도 메뉴로 이동
            router.push({
                pathname: '/Menu',
                params: { initialMenuType: menuType }
            });
        }
    }, [router, sortByDeadline, isLoading, menuType]);
    
    return (
        <TouchableOpacity 
        className="absolute left-5 top-5 bg-white rounded-full w-[60px] h-[60px] justify-center items-center shadow-md z-[3]"
        onPress={handleMenuPress}
        disabled={isLoading} // 로딩 중에는 버튼 비활성화
      >
        <Text className="text-2xl">{menuType === "Setting" ? "⚙️" : "📋"}</Text>
      </TouchableOpacity>
    )
}

export default MenuButton;
