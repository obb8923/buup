import { View, TouchableOpacity, StatusBar, SafeAreaView } from "react-native";
import BG from "../../src/components/BG";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import Txt from "../../src/components/Txt";
import Setting from "./Setting";
import ToDo from "./ToDo";
import Colors from "../../src/constants/Colors";
import useThemeStore from "../../src/stores/useThemeStore";

// 메뉴 버튼 컴포넌트
const MenuButton = ({ 
    title, 
    isActive, 
    onPress, 
    activeClass,
    className = "flex-auto",
    menuType
}: { 
    title: string; 
    isActive: boolean; 
    onPress: () => void; 
    activeClass: string;
    className?: string;
    menuType: "ToDo"|"Setting";
}) => {
    const { theme } = useThemeStore();
    return(
        <View className={`${className} justify-center items-center  rounded-t-lg ${isActive ? "" : activeClass}`}
        >
            <TouchableOpacity 
            className={`flex-1 w-full justify-center items-center 
                ${isActive ? activeClass : theme==="dark"?"bg-black":"bg-white"} 
                ${isActive ? "rounded-t-lg" : 
                  title === "Back" && menuType === "ToDo" ? "rounded-br-lg" : 
                  title === "Setting" && menuType === "ToDo" ? "rounded-bl-lg" : 
                  title === "ToDo List" && menuType === "Setting" ? "rounded-br-lg" : 
                  title === "Back" && menuType === "Setting" ? "" : 
                  "rounded-b-lg"}`}
            onPress={onPress}
        >
        <Txt variant="function">{title}</Txt>
    </TouchableOpacity>
    </View>
)};

const MenuLayout = () => {
    const router = useRouter();
    const [menuType, setMenuType] = useState<"ToDo"|"Setting">("ToDo");
    const { theme } = useThemeStore();
    
    const menuColorClass = theme === "dark" ? "bg-gray-700" : "bg-gray-200";
   
    return (
        <SafeAreaView className="flex-1 z-[BackgroundZLevel]">
            <StatusBar
                barStyle={theme==="dark"?"light-content":"dark-content"}
                backgroundColor={theme==="dark"?Colors.black:Colors.white}
                translucent={false}
            />
        <View className={`h-[10px]`}/>

        {/* menu section - ToDo, Setting */}
        <View className={`flex-row h-[56px] gap-[10px] px-px ${theme==="dark"?"bg-black":"bg-white"}`}>
            <MenuButton 
                title="Back" 
                isActive={false} 
                onPress={() => router.back()} 
                className="flex-initial"
                activeClass={menuColorClass}
                menuType={menuType}
            />
            <MenuButton 
                title="ToDo List" 
                isActive={menuType === "ToDo"} 
                onPress={() => setMenuType("ToDo")}
                activeClass={menuColorClass}
                menuType={menuType}
            />
            <MenuButton 
                title="Setting" 
                isActive={menuType === "Setting"} 
                onPress={() => setMenuType("Setting")} 
                className="flex-initial"
                activeClass={menuColorClass}
                menuType={menuType}
                />
        </View>
        <View className={`h-[10px] ${menuColorClass}`}/>
        <View className={`flex-1 ${menuColorClass}`}>
        {/* content section */}
        {menuType==="ToDo"&&<ToDo/>}
        {menuType==="Setting"&&<Setting/>}
        </View>
        </SafeAreaView>
    )
}
export default MenuLayout;
