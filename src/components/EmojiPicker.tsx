import React, { useState, forwardRef, useImperativeHandle, useEffect } from 'react';
import { View, TouchableOpacity, ScrollView, Text, Dimensions, Animated, Keyboard } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { EMOJIS, EMOJI_CATEGORIES } from '../constants/Emojis';
import Txt from './Txt';
import { t } from '../i18n';

export interface EmojiPickerRef {
  show: () => void;
  hide: () => void;
}

interface EmojiPickerProps {
  onEmojiSelected: (emoji: string) => void;
}

// 최근 사용한 이모지를 저장할 키
const RECENT_EMOJIS_KEY = 'recent_emojis';
// 최근 사용 이모지 최대 개수
const MAX_RECENT_EMOJIS = 20;

const EmojiPicker = forwardRef<EmojiPickerRef, EmojiPickerProps>(({ onEmojiSelected }, ref) => {
  const [selectedCategory, setSelectedCategory] = useState('common');
  const [visible, setVisible] = useState(false);
  const slideAnim = useState(new Animated.Value(250))[0]; // 초기값은 화면 밖
  const [recentEmojis, setRecentEmojis] = useState<string[]>([]);

  
  // 컴포넌트 마운트 시 최근 사용 이모지 로드
  useEffect(() => {
    loadRecentEmojis();
  }, []);
  
  // 최근 사용 이모지 로드 함수
  const loadRecentEmojis = async () => {
    try {
      const savedEmojis = await AsyncStorage.getItem(RECENT_EMOJIS_KEY);
      if (savedEmojis) {
        setRecentEmojis(JSON.parse(savedEmojis));
      }
    } catch (error) {
      console.error('Failed to load recent emojis', error);
    }
  };
  
  // 최근 사용 이모지 저장 함수
  const saveRecentEmoji = async (emoji: string) => {
    try {
      // 이미 있는 이모지라면 제거 (중복 방지)
      const filteredEmojis = recentEmojis.filter(e => e !== emoji);
      
      // 새 이모지를 맨 앞에 추가
      const newRecentEmojis = [emoji, ...filteredEmojis].slice(0, MAX_RECENT_EMOJIS);
      
      // 상태 업데이트
      setRecentEmojis(newRecentEmojis);
      
      // AsyncStorage에 저장
      await AsyncStorage.setItem(RECENT_EMOJIS_KEY, JSON.stringify(newRecentEmojis));
    } catch (error) {
      console.error('Failed to save recent emoji', error);
    }
  };
  
  // 외부에서 호출할 수 있는 메서드 노출
  useImperativeHandle(ref, () => ({
    show: () => {
      setVisible(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    },
    hide: () => {
      Animated.timing(slideAnim, {
        toValue: 500,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        setVisible(false);
      });
    }
  }));
  
  // 이모지 선택 핸들러
  const handleEmojiSelect = (emoji: string) => {
    saveRecentEmoji(emoji);
    onEmojiSelected(emoji);
  };
  


  
  if (!visible) return null;
  
  const { width } = Dimensions.get('window');
  const emojiSize = Math.floor(width / 8); // 한 줄에 8개 이모지
  
  // 현재 선택된 카테고리에 따라 표시할 이모지 배열 결정
  const currentEmojis = selectedCategory === 'common' 
    ? recentEmojis.length > 0 ? recentEmojis : EMOJIS.common 
    : EMOJIS[selectedCategory as keyof typeof EMOJIS];
  
  return (
    <Animated.View 
      className="absolute bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 z-50 h-[300]"
      style={{ transform: [{ translateY: slideAnim }] }}
    >
      {/* 카테고리 탭 */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-2.5 py-2 bg-white border-b border-gray-300 flex-none"
        bounces={true}
      >
        {EMOJI_CATEGORIES.map((category) => (
          <TouchableOpacity
            key={category.key}
            className={`px-3 py-1.5 mr-2 rounded-2xl justify-center items-center  ${
              selectedCategory === category.key ? 'bg-blue-50' : 'bg-gray-100'
            }`}
            onPress={() => setSelectedCategory(category.key)}
          >
            <Txt 
              variant="paragraph" 
              className={`${selectedCategory === category.key ? 'text-blue-500' : 'text-gray-500'}`}
            >
              {t(`emojiPicker.categories.${category.key}`)}
            </Txt>
          </TouchableOpacity>
        ))}
      </ScrollView>
      
      {/* 이모지 그리드 */}
      <ScrollView 
        className="p-1.5 flex-1"
      >
        <View className="flex-row flex-wrap">
          {currentEmojis.map((emoji, index) => (
            <TouchableOpacity
              key={index}
              style={{ width: `${100/8}%`, height: emojiSize }}
              className="justify-center items-center"
              onPress={() => handleEmojiSelect(emoji)}
            >
              <Text className="text-2xl">{emoji}</Text>
            </TouchableOpacity>
          ))}
          {/* 최근 사용 이모지가 없을 경우 안내 메시지 표시 */}
          {selectedCategory === 'common' && recentEmojis.length === 0 && (
            <View className="w-full items-center justify-center py-4">
              <Txt variant="paragraph" className="text-gray-500">
                {t('emojiPicker.noRecentEmojis')}
              </Txt>
            </View>
          )}
        </View>
      </ScrollView>
    </Animated.View>
  );
});

export default EmojiPicker; 