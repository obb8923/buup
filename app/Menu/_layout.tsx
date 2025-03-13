import { View, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import Txt from "../../src/components/Txt";
import Setting from "./Setting";
import ToDo from "./ToDo";
import Colors from "../../src/constants/Colors";
import useThemeStore from "../../src/stores/useThemeStore";
import { MenuType } from "../../src/types/MenuType";
import { t, useLanguage } from "../../src/i18n";
// 메뉴 버튼 컴포넌트 - 메모이제이션 적용
const MenuButton = ({ 
    titleKey, 
    isActive, 
    onPress, 
    activeClass,
    className = "flex-auto",
    menuType
}: { 
    titleKey: string; 
    isActive: boolean; 
    onPress: () => void; 
    activeClass: string;
    className?: string;
    menuType: "ToDo"|"Setting";
}) => {
    const { theme } = useThemeStore();
    const { language } = useLanguage();
    
    // 스타일 계산 메모이제이션
    const buttonStyle = useMemo(() => {
        const baseStyle = `flex-1 w-full justify-center items-center`;
        const activeStyle = isActive ? activeClass : theme === "dark" ? "bg-blockBlack" : "bg-white";
        
        let roundedStyle = "";
        if (isActive) {
            roundedStyle = "rounded-t-lg";
        } else if (titleKey === 'menu.back' && menuType === "ToDo") {
            roundedStyle = "rounded-br-lg";
        } else if (titleKey === 'menu.setting' && menuType === "ToDo") {
            roundedStyle = "rounded-bl-lg";
        } else if (titleKey === 'menu.todoList' && menuType === "Setting") {
            roundedStyle = "rounded-br-lg";
        } else if (titleKey === 'menu.back' && menuType === "Setting") {
            roundedStyle = "";
        } else {
            roundedStyle = "rounded-b-lg";
        }
        
        return `${baseStyle} ${activeStyle} ${roundedStyle}`;
    }, [isActive, activeClass, theme, titleKey, menuType, language]);
    
    return(
        <View className={`${className} justify-center items-center rounded-t-lg ${isActive ? "" : activeClass}`}>
            <TouchableOpacity 
                className={buttonStyle}
                onPress={onPress}
                activeOpacity={0.7}
            >
                <Txt variant="function">{t(titleKey)}</Txt>

            </TouchableOpacity>
        </View>
    );
};

const MenuLayout = () => {
    const router = useRouter();
    const {MenuType} = useLocalSearchParams<{ MenuType?: MenuType }>();
    const [menuType, setMenuType] = useState<MenuType>(MenuType as MenuType);
    const { theme } = useThemeStore();
    const { language } = useLanguage();
        
    const menuColorClass = theme === "dark" ? "bg-gray-600" : "bg-gray-200";
    
    // 메뉴 전환 핸들러 메모이제이션
    const handleSetMenuType = useCallback((type: MenuType) => {
        setMenuType(type);
    }, []);
    
    // 뒤로가기 핸들러 메모이제이션
    const handleBack = useCallback(() => {
        router.back();
    }, [router]);
    
    // 현재 메뉴에 따라 컴포넌트 조건부 렌더링
    const currentMenuComponent = useMemo(() => {
        if (menuType === "ToDo") return <ToDo />;
        return <Setting />;
    }, [menuType, language]);
   
    return (
        <SafeAreaView className="flex-1 z-[BackgroundZLevel]">
            <StatusBar
                barStyle={theme==="dark"?"light-content":"dark-content"}
                backgroundColor={theme==="dark"?Colors.blockBlack:Colors.white}
                translucent={false}
            />
            <View className={`h-[10px] ${theme==="dark"?"bg-blockBlack":"bg-white"}`}/>
           

            {/* menu section - ToDo, Setting */}
            <View className={`flex-row h-[56px] ${theme==="dark"?"bg-blockBlack":"bg-white"}`}>
                <MenuButton 
                    titleKey="menu.back"
                    isActive={false} 
                    onPress={handleBack} 
                    className="flex-initial"
                    activeClass={menuColorClass}
                    menuType={menuType}
                />
                <MenuButton 
                    titleKey="menu.todoList" 
                    isActive={menuType === "ToDo"} 
                    onPress={() => handleSetMenuType("ToDo")}
                    activeClass={menuColorClass}
                    menuType={menuType}
                />
                <MenuButton 
                    titleKey="menu.setting" 
                    isActive={menuType === "Setting"} 
                    onPress={() => handleSetMenuType("Setting")} 
                    className="flex-initial"
                    activeClass={menuColorClass}
                    menuType={menuType}
                />
            </View>
            <View className={`h-[10px] ${menuColorClass}`}/>
            <View className={`flex-1 ${menuColorClass}`}>
                {/* content section - 메모이제이션된 컴포넌트 사용 */}
                {currentMenuComponent}
            </View>
        </SafeAreaView>
    )
}
export default MenuLayout;
