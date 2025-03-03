import { View, TouchableOpacity, Switch, ScrollView } from "react-native";
import Txt from "../../src/components/Txt";

import useThemeStore from "../../src/stores/useThemeStore";
import { useState } from "react";

const Setting = () => {
    const { theme, setTheme } = useThemeStore();
    const [reminderEnabled, setReminderEnabled] = useState(true);
    const [autoDelete, setAutoDelete] = useState(false);
    const [biometricLogin, setBiometricLogin] = useState(false);
    const [language, setLanguage] = useState("한국어");
    
    return (
        <ScrollView className={`flex-1 px-px pt-pt ${theme === "dark" ? "bg-gray-700" : "bg-white"}`}>
            {/* 테마 설정 */}
            <Section title="테마 설정">
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg mb-2`} onPress={()=>setTheme("light")}>
                    <View className="flex-row items-center">
                        <View className="w-[20px] h-[20px] border border-black rounded-full bg-white mr-2"></View>
                        <Txt variant="paragraph">라이트</Txt>
                    </View>
                    {theme === "light" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg mb-2`} onPress={()=>setTheme("dark")}>
                    <View className="flex-row items-center">
                        <View className="w-[20px] h-[20px] border border-black rounded-full bg-black mr-2"></View>
                        <Txt variant="paragraph">다크</Txt>
                    </View>
                    {theme === "dark" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg`} onPress={()=>setTheme("buup")}>
                    <View className="flex-row items-center">
                        <View className="w-[20px] h-[20px] border border-black rounded-full bg-bubble mr-2"></View>
                        <Txt variant="paragraph">Buup</Txt>
                    </View>
                    {theme === "buup" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
            </Section>
         
            {/* 표시 설정 */}
            <Section title="표시 설정">
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg mb-2`}>
                    <Txt variant="paragraph">기본 정렬 방식</Txt>
                    <Txt variant="paragraph" className="text-gray-600">날짜순</Txt>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg`}>
                    <Txt variant="paragraph">목록 표시 형식</Txt>
                    <Txt variant="paragraph" className="text-gray-600">리스트형</Txt>
                </TouchableOpacity>
            </Section>
          
            {/* 개인정보 및 보안 */}
            {/* <Section title="개인정보 및 보안">
                <SettingItem 
                    title="생체인식 로그인" 
                    value={biometricLogin}
                    onValueChange={setBiometricLogin}
                />
                <TouchableOpacity className="flex-row justify-between items-center p-3 bg-gray-100 rounded-lg mt-2">
                    <Txt variant="paragraph">비밀번호 변경</Txt>
                    <Txt variant="paragraph" className="text-gray-600">{'>'}</Txt>
                </TouchableOpacity>
            </Section> */}
            {/* 할 일 관리 */}
            <Section title="할 일 관리">
                <SettingItem 
                    title="완료된 항목 30일 후 자동 삭제" 
                    value={autoDelete}
                    onValueChange={setAutoDelete}
                />
            </Section>
            {/* 언어 설정 */}
            <Section title="언어 설정">
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg`}>
                    <Txt variant="paragraph">언어</Txt>
                    <Txt variant="paragraph" className="text-gray-600">{language}</Txt>
                </TouchableOpacity>
            </Section>
            {/* 앱 정보 */}
            <Section title="앱 정보">
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg mb-2`}>
                    <Txt variant="paragraph">버전</Txt>
                    <Txt variant="paragraph" className="text-gray-600">1.0.0</Txt>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg mb-2`}>
                    <Txt variant="paragraph">이용약관</Txt>
                    <Txt variant="paragraph" className="text-gray-600">{'>'}</Txt>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg`}>
                    <Txt variant="paragraph">개인정보처리방침</Txt>
                    <Txt variant="paragraph" className="text-gray-600">{'>'}</Txt>
                </TouchableOpacity>
            </Section>

            {/* 하단 여백 */}
            <View className="h-[50px]" />
        </ScrollView>
    )
}   
export default Setting;

const Section = ({title,children}:{title:string,children:React.ReactNode})=>{
    return (
        <View className="h-auto mb-6">
            <Txt variant="subTitle" className="ml-[12px]">{title}</Txt>
            <View className="h-[10px] "/>
            {children}
        </View>
    )
}

const SettingItem = ({ 
    title, 
    value, 
    onValueChange 
}: { 
    title: string; 
    value: boolean; 
    onValueChange: (value: boolean) => void;
}) => {
    const { theme } = useThemeStore();
    return (
        <View className={`flex-row justify-between items-center p-3 ${theme==="dark"?"bg-black":"bg-gray-100"} rounded-lg`}>
            <Txt variant="paragraph">{title}</Txt>
            <Switch value={value} onValueChange={onValueChange} />
        </View>
    );
}
