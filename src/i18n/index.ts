import  I18n from 'i18n-js';
import * as Localization from 'expo-localization';
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { DeviceEventEmitter } from 'react-native';

import en from './locales/en';
import ko from './locales/ko';

// 언어 변경 이벤트 상수
const LANGUAGE_CHANGE_EVENT = 'languageChange';

// 번역 타입 정의
type TranslationKeys = 'en' | 'ko';
type Translations = {
  [key in TranslationKeys]: typeof en;
};

// 지원하는 번역 객체
const translations: Translations = {
  en,
  ko,
};

// 지원하는 언어 목록
export const SUPPORTED_LANGUAGES = {
  en: 'English',
  ko: '한국어',
};

// 기본 언어 코드
export const DEFAULT_LANGUAGE: TranslationKeys = 'en';

// AsyncStorage에 저장될 언어 설정 키
const LANGUAGE_STORAGE_KEY = '@ToyDo:language';

// i18n 인스턴스 생성
const i18n = I18n;
i18n.translations = translations;

// 유틸리티 함수: 시스템 언어 감지
export function getDeviceLanguage(): TranslationKeys {
  // 기기 언어 설정 가져오기
  const locales = Localization.getLocales();
  
  if (locales.length > 0) {
    // 첫 번째 선호 언어의 언어 코드 (예: 'en', 'ko' 등) 가져오기
    const languageCode = locales[0].languageCode as TranslationKeys;
    
    // 지원하는 언어인지 확인
    if (Object.keys(translations).includes(languageCode)) {
      return languageCode;
    }
  }
  
  // 지원하지 않는 언어인 경우 기본 언어 반환
  return DEFAULT_LANGUAGE;
}

// 언어 설정 함수
export function setLanguage(languageCode: string): void {
  // 자동 설정인 경우 시스템 언어 사용
  if (languageCode === 'auto') {
    const deviceLanguage = getDeviceLanguage();
    i18n.locale = deviceLanguage;
    // 'auto' 설정을 AsyncStorage에 저장
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, 'auto').catch(console.error);
    // 언어 변경 이벤트 발생
    DeviceEventEmitter.emit(LANGUAGE_CHANGE_EVENT, deviceLanguage);
    return;
  }

  // 유효한 언어 코드인지 확인
  const isValid = Object.keys(translations).includes(languageCode);
  
  // 유효한 언어 코드인 경우에만 설정
  if (isValid) {
    i18n.locale = languageCode;
    // 변경된 언어를 AsyncStorage에 저장
    AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, languageCode).catch(console.error);
    // 언어 변경 이벤트 발생
    DeviceEventEmitter.emit(LANGUAGE_CHANGE_EVENT, languageCode);
  } else {
    console.warn(`${languageCode}는 지원하지 않는 언어입니다.`);
  }
}

// 현재 설정된 언어 코드 반환
export function getCurrentLanguage(): string {
  return i18n.locale;
}

// 자동 언어 설정 함수 (시스템 언어 또는 저장된 설정에 따라)
export async function setupLanguage(): Promise<string> {
  try {
    // AsyncStorage에 저장된 언어 설정 가져오기
    const savedLanguage = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
    
    // 저장된 설정이 'auto'인 경우 시스템 언어 사용
    if (savedLanguage === 'auto') {
      const deviceLanguage = getDeviceLanguage();
      i18n.locale = deviceLanguage;
      return 'auto';
    }
    
    // 저장된 언어 설정이 있으면 해당 언어로 설정
    if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
      setLanguage(savedLanguage);
      return savedLanguage;
    }
    
    // 저장된 설정이 없으면 시스템 언어로 설정
    const deviceLanguage = getDeviceLanguage();
    setLanguage(deviceLanguage);
    return deviceLanguage;
  } catch (error) {
    console.error('언어 설정 초기화 오류:', error);
    
    // 오류 발생 시 기본 언어로 설정
    setLanguage(DEFAULT_LANGUAGE);
    return DEFAULT_LANGUAGE;
  }
}

// 언어 설정 React Hook
export function useLanguage() {
  const [language, setLang] = useState(i18n.locale);
  
  useEffect(() => {
    // 컴포넌트 마운트 시 언어 설정 로드
    AsyncStorage.getItem(LANGUAGE_STORAGE_KEY)
      .then(savedLanguage => {
        if (savedLanguage === 'auto') {
          const deviceLanguage = getDeviceLanguage();
          i18n.locale = deviceLanguage;
          setLang('auto');
        } else if (savedLanguage && Object.keys(translations).includes(savedLanguage)) {
          i18n.locale = savedLanguage;
          setLang(savedLanguage);
        } else {
          const deviceLanguage = getDeviceLanguage();
          i18n.locale = deviceLanguage;
          setLang(deviceLanguage);
        }
      })
      .catch(error => {
        console.error('언어 로드 오류:', error);
      });
      
    // 언어 변경 이벤트 리스너 등록
    const handleLanguageChange = (newLanguage: string) => {
      setLang(newLanguage);
    };
    
    const subscription = DeviceEventEmitter.addListener(LANGUAGE_CHANGE_EVENT, handleLanguageChange);
    
    // 컴포넌트 언마운트 시 이벤트 리스너 제거
    return () => {
      subscription.remove();
    };
  }, []);
  
  // 언어 변경 함수
  const changeLanguage = (languageCode: string) => {
    setLanguage(languageCode);
    setLang(languageCode);
  };
  
  return { language, changeLanguage };
}

// t 함수 외부로 노출
export const t = (key: string, options?: object): string => {
  return i18n.t(key, options);
};

export default i18n; 