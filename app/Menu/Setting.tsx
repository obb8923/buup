import { View, TouchableOpacity, Switch, ScrollView } from "react-native";
import Txt from "../../src/components/Txt";

import useThemeStore from "../../src/stores/useThemeStore";
import { useState, memo } from "react";
import { t, useLanguage } from "../../src/i18n";
import useModeStore from "../../src/stores/useModeStore";
const Setting = memo(() => {
    const { theme, setTheme } = useThemeStore();
    const { mode, setMode } = useModeStore();
    // const [reminderEnabled, setReminderEnabled] = useState(true);
    // const [autoDelete, setAutoDelete] = useState(false);
    // const [biometricLogin, setBiometricLogin] = useState(false);
    const { language, changeLanguage } = useLanguage();
    const languages = ["ko", "en"];
    
    return (
        <ScrollView className={`flex-1 px-px pt-pt ${theme === "dark" ? "bg-gray-600" : "bg-gray-200"}`}>
            {/* 모드 설정 */}
            <Section title={t('settings.modeSettings')}>
            <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`} onPress={()=>setMode("block")}>
                    <Txt variant="paragraph" >{t('settings.block')}</Txt>
                    {mode === "block" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`} onPress={()=>setMode("bubble")}>
                    <Txt variant="paragraph">{t('settings.bubble')}</Txt>
                    {mode === "bubble" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
            </Section>
            {/* 테마 설정 */}
            <Section title={t('settings.themeSettings')}>
                {/* 라이트 테마 */}
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`} onPress={()=>setTheme("light")}>
                    <View className="flex-row items-center">
                        <View className="w-[20px] h-[20px] border border-blockBlack rounded-full bg-white mr-2"></View>
                        <Txt variant="paragraph">{t('settings.light')}</Txt>
                    </View>
                    {theme === "light" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
                {/* 다크 테마 */}
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`} onPress={()=>setTheme("dark")}>
                    <View className="flex-row items-center">
                        <View className="w-[20px] h-[20px] border border-gray-600 rounded-full bg-blockBlack mr-2"></View>
                        <Txt variant="paragraph">{t('settings.dark')}</Txt>
                    </View>
                    {theme === "dark" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity>
                {/* <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg`} onPress={()=>setTheme("ToyDo")}>
                    <View className="flex-row items-center">
                        <View className="w-[20px] h-[20px] border border-black rounded-full bg-bubble mr-2"></View>
                        <Txt variant="paragraph">{t('common.appName')}</Txt>
                    </View>
                    {theme === "ToyDo" && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                </TouchableOpacity> */}
            </Section>
         
            {/* 표시 설정 */}
            {/* <Section title="표시 설정">
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg mb-2`}>
                    <Txt variant="paragraph">기본 정렬 방식</Txt>
                    <Txt variant="paragraph" className="text-gray-600">날짜순</Txt>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-black" : "bg-gray-100"} rounded-lg`}>
                    <Txt variant="paragraph">목록 표시 형식</Txt>
                    <Txt variant="paragraph" className="text-gray-600">리스트형</Txt>
                </TouchableOpacity>
            </Section> */}
          
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
            {/* <Section title="할 일 관리">
                <SettingItem 
                    title="완료된 항목 30일 후 자동 삭제" 
                    value={autoDelete}
                    onValueChange={setAutoDelete}
                />
            </Section> */}
            {/* 언어 설정 */}
            <Section title={t('settings.languageSettings')}>
                {languages.map((lang) => (
                    <TouchableOpacity 
                        key={lang}
                        className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`} 
                        onPress={() => changeLanguage(lang)}
                    >
                        <Txt variant="paragraph">{lang === 'ko' ? t('language.korean') : t('language.english')}</Txt>
                        {language === lang && <Txt variant="paragraph" className="text-gray-600">✓</Txt>}
                    </TouchableOpacity>
                ))}
            </Section>
            {/* 앱 정보 */}
            <Section title={t('settings.appInfo')}>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`}>
                    <Txt variant="paragraph">{t('settings.version')}</Txt>
                    <Txt variant="paragraph" className="text-gray-600">1.0.0</Txt>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg mb-2`}>
                    <Txt variant="paragraph">{t('settings.termsOfService')}</Txt>
                    <Txt variant="paragraph" className="text-gray-600">{'>'}</Txt>
                </TouchableOpacity>
                <TouchableOpacity className={`flex-row justify-between items-center p-3 ${theme === "dark" ? "bg-blockBlack" : "bg-gray-100"} rounded-lg`}>
                    <Txt variant="paragraph">{t('settings.privacyPolicy')}</Txt>
                    <Txt variant="paragraph" className="text-gray-600">{'>'}</Txt>
                </TouchableOpacity>
            </Section>

            {/* 하단 여백 */}
            <View className="h-[50px]" />
        </ScrollView>
    )
})   
export default Setting;

const Section = ({title,children}:{title:string,children:React.ReactNode})=>{
    return (
        <View className="w-full h-auto mb-6">
            <Txt variant="subTitle" className="ml-[12px]">{title}</Txt>
            <View className="h-[10px] "/>
            {children}
        </View>
    )
}
