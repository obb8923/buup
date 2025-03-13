import React, { useState, useRef, useEffect } from 'react';
import { View, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import Txt from './Txt';
import EmojiPicker, { EmojiPickerRef } from './EmojiPicker';
import { t } from '../i18n';
import useThemeStore from '../stores/useThemeStore';
import useToDoStore, { RepetitionType } from '../stores/useToDoStore';
import COLORS from '../constants/Colors';

// 옵션 버튼 컴포넌트
interface OptionButtonProps {
  label: string;
  onPress: () => void;
  isSelected?: boolean;
  isCancel?: boolean;
  isDelete?: boolean;
}

function OptionButton({ label, onPress, isSelected = false, isCancel = false, isDelete = false }: OptionButtonProps) {
  const { theme } = useThemeStore();
  
  // 버튼 배경색 결정
  let bgColorClass = '';
  if (isDelete) {
    bgColorClass = theme === 'dark' ? 'bg-red-700' : 'bg-red';
  } else if (isCancel) {
    bgColorClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  } else if (isSelected) {
    bgColorClass = theme === 'dark' ? 'bg-blue-700' : 'bg-blue-500';
  } else {
    bgColorClass = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200';
  }
  
  // 텍스트 색상 결정
  let textColorClass = '';
  if (isDelete) {
    textColorClass = 'text-white';
  } else if (isSelected || (!isCancel && !isDelete)) {
    textColorClass = isSelected ? 'text-white' : '';
  }
  
  return (
    <TouchableOpacity 
      className={`px-3 py-1 rounded-full ${bgColorClass}`}
      onPress={onPress}
    >
      <Txt variant="paragraph" className={`${textColorClass} text-sm`}>
        {label}
      </Txt>
    </TouchableOpacity>
  );
}

function TodoAddInput() {
  const { theme } = useThemeStore();
  const addTodo = useToDoStore(state => state.addTodo);
  // 할 일 내용, 선택된 이모지 및 TextInput 포커스 상태 관리
  const [newTodoContent, setNewTodoContent] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('📝');
  const [isInputFocused, setIsInputFocused] = useState(false);
  // 포커스 상태 관리를 위한 추가 변수
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  
  // 반복 타입 상태 추가
  const [repetition, setRepetition] = useState<RepetitionType>('none');
  // 마감일 상태 추가
  const [deadline, setDeadline] = useState<string | null>(null);
  
  // 세부 설정 모드 상태 관리
  const [detailMode, setDetailMode] = useState<'main' | 'deadline' | 'repetition'>('main');

  // ref 관리
  const textInputRef = useRef<TextInput>(null);
  const emojiPickerRef = useRef<EmojiPickerRef>(null);

  // 제출 버튼 핸들러
  const handleSubmit = () => {
    if (newTodoContent.trim() === '') return;

    // 키보드를 먼저 내림
    Keyboard.dismiss();
    
    setNewTodoContent('');
    setSelectedEmoji('📝');
    setRepetition('none');
    // 약간의 딜레이 후 할일 추가 및 입력값 초기화
    setTimeout(() => {
      console.log('추가',newTodoContent, selectedEmoji, deadline, repetition);
      addTodo(newTodoContent, selectedEmoji, deadline, repetition);
      setDeadline(null);
    }, 100); // 100ms 딜레이 (상황에 따라 조정 가능)
  };

  // 이모지 선택 핸들러
  const handleEmojiSelected = (emoji: string) => {
    setSelectedEmoji(emoji);
    if (emojiPickerRef.current) {
      emojiPickerRef.current.hide();
    }
  };

  // 마감일 선택 핸들러
  const handleDeadlineSelect = (selectedDeadline: string | null) => {
    setDeadline(selectedDeadline);
    setDetailMode('main');
  };

  // 반복 타입 선택 핸들러
  const handleRepetitionSelect = (type: RepetitionType) => {
    setRepetition(type);
    setDetailMode('main');
  };

  // 키보드 이벤트 관리 개선
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      setKeyboardVisible(true);
    });
    
    const keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      setKeyboardVisible(false);
      setDetailMode('main');
      setIsInputFocused(false);
      // 키보드가 사라질 때는 isInputFocused 상태를 직접 변경하지 않음
    });

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  // 텍스트 입력 필드 참조 확인 및 포커스 관리
  const handleInputPress = () => {
    if (textInputRef.current) {
      textInputRef.current.focus();
    }
  };

  return (
    <View
      className={`absolute bottom-0 w-full items-center pt-2 ${theme === "dark" ? "bg-blockBlack/80" : "bg-white/80"} backdrop-blur-sm`}
    >
      {/* 첫 번째 줄: 이모지 버튼, 입력창, 제출 버튼 */}
      <View
        className={`w-11/12 flex-row items-center ${theme === "dark" ? "bg-gray-800" : "bg-gray-50"} border ${theme === "dark" ? "border-gray-700" : "border-gray-300"} rounded-full px-2`}
      >
        {/* 이모지 버튼 */}
        <TouchableOpacity
          onPress={() => {
            Keyboard.dismiss();
            if (emojiPickerRef.current) {
              emojiPickerRef.current.show();
            }
          }}
          className="p-2"
        >
          <Txt variant="subTitle" >
            {selectedEmoji}
          </Txt>
        </TouchableOpacity>

        {/* 할일 입력 필드 */}
        <TextInput
          ref={textInputRef}
          className={`flex-1 py-2 px-2 ${theme === "dark" ? "text-white" : "text-blockBlack"}`}
          placeholder={t('todo.addTodoPlaceholder')}
          placeholderTextColor={theme === "dark" ? COLORS.gray200 : COLORS.gray600}
          value={newTodoContent}
          onChangeText={setNewTodoContent}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
          onPressIn={handleInputPress}
        />

        {/* 제출 버튼 */}
        <TouchableOpacity
          onPress={handleSubmit}
          disabled={newTodoContent.trim() === ''}
          className={`p-2`}
        >
          <Txt variant="paragraph" className={`${newTodoContent.trim() === '' ? 
            theme === "dark" ? 'text-gray-800' : 'text-gray-50' : 
            theme === "dark" ? 'text-white' : 'text-background1'}`}>
            →
          </Txt>
        </TouchableOpacity>
      </View>

      {/* 두 번째 줄: 세부사항 선택 영역 (키보드 포커스 시에만 표시) */}
      <View className="w-full h-[40px]">
        {(isInputFocused || keyboardVisible) && (
          <View className="w-full h-full flex-row justify-around items-center">
            {/* 메인 모드 - 마감일/반복 설정 버튼 */}
            {detailMode === 'main' && (
              <>
                {/* 마감일 설정 버튼 */}
                <OptionButton 
                  label={deadline 
                    ? t('todo.input.deadlinePrefix') + deadline
                    : t('todo.input.setDeadline')}
                  onPress={() => setDetailMode('deadline')}
                  isSelected={deadline !== null}
                />
                
                {/* 반복 주기 설정 버튼 */}
                <OptionButton 
                  label={repetition !== 'none' 
                    ? t('todo.input.repetitionPrefix') + repetition
                    : t('todo.input.setRepetition')}
                  onPress={() => setDetailMode('repetition')}
                  isSelected={repetition !== 'none'}
                />
              </>
            )}

            {/* 마감일 선택 모드 */}
            {detailMode === 'deadline' && (
              <>
                {/* 취소 버튼 */}
                <OptionButton 
                  label="✕"
                  onPress={() => setDetailMode('main')}
                  isCancel={true}
                />
                
                {/* 오늘 버튼 */}
                <OptionButton 
                  label={t('todo.input.today')}
                  onPress={() => handleDeadlineSelect(t('todo.input.today'))}
                  isSelected={deadline === t('todo.input.today')}
                />
                
                {/* 내일 버튼 */}
                <OptionButton 
                  label={t('todo.input.tomorrow')}
                  onPress={() => handleDeadlineSelect(t('todo.input.tomorrow'))}
                  isSelected={deadline === t('todo.input.tomorrow')}
                />
                
                {/* 일주일 뒤 버튼 */}
                <OptionButton 
                  label={t('todo.input.inAWeek')}
                  onPress={() => handleDeadlineSelect(t('todo.input.inAWeek'))}
                  isSelected={deadline === t('todo.input.inAWeek')}
                />
                
                {/* 마감일 있을 경우 삭제 버튼 */}
                {deadline && (
                  <OptionButton 
                    label={t('todo.detail.delete')}
                    onPress={() => handleDeadlineSelect(null)}
                    isDelete={true}
                  />
                )}
              </>
            )}

            {/* 반복 주기 선택 모드 */}
            {detailMode === 'repetition' && (
              <>
                {/* 취소 버튼 */}
                <OptionButton 
                  label="✕"
                  onPress={() => setDetailMode('main')}
                  isCancel={true}
                />
                
                {/* 하루 반복 버튼 */}
                <OptionButton 
                  label={t('todo.input.daily')}
                  onPress={() => handleRepetitionSelect('daily')}
                  isSelected={repetition === 'daily'}
                />
                
                {/* 한주 반복 버튼 */}
                <OptionButton 
                  label={t('todo.input.weekly')}
                  onPress={() => handleRepetitionSelect('weekly')}
                  isSelected={repetition === 'weekly'}
                />
                
                {/* 한달 반복 버튼 */}
                <OptionButton 
                  label={t('todo.input.monthly')}
                  onPress={() => handleRepetitionSelect('monthly')}
                  isSelected={repetition === 'monthly'}
                />
                
                {/* 반복 있을 경우 삭제 버튼 */}
                {repetition !== 'none' && (
                  <OptionButton 
                    label={t('todo.detail.delete')}
                    onPress={() => handleRepetitionSelect('none')}
                    isDelete={true}
                  />
                )}
              </>
            )}
          </View>
        )}
      </View>

      {/* 이모지 피커 */}
      <EmojiPicker ref={emojiPickerRef} onEmojiSelected={handleEmojiSelected} />
    </View>
  );
}

export default TodoAddInput; 