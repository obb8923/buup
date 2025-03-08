import { Modal, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, Keyboard, ScrollView } from "react-native";
import Txt from "../Txt";
import { ToDoItemType } from "../../stores/useToDoStore";
import { useState, useCallback, useEffect, useRef } from "react";
import EmojiPicker, { EmojiPickerRef } from '../EmojiPicker';
import { ModalZLevel } from "../../constants/ZLevels";
import { t, getCurrentLanguage } from "../../i18n";
import TextToggle from "../TextToggle";
import useThemeStore from "../../stores/useThemeStore";
import useToDoStore from "../../stores/useToDoStore";




// 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
const formatDateForInput = (date?: Date): string => {
  if (!date) return '';
  
  try {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Invalid date format', error);
    return '';
  }
};
 // 할 일 세부 정보 모달 컴포넌트 - 직접 수정 가능
const TodoDetailModal = ({ 
    visible, 
    onClose, 
    todo, 
    isCompleted, 
    onSave
  }: { 
    visible: boolean; 
    onClose: () => void; 
    todo: ToDoItemType; 
    isCompleted: boolean;
    onSave: (content: string, deadline?: Date | null, emoji?: string, repetition?:string) => void;
  }) => {
    // 수정 상태 관리
    const [editContent, setEditContent] = useState(todo.content);
    const [editDeadline, setEditDeadline] = useState('');
    const [editEmoji, setEditEmoji] = useState(todo.emoji || '📝');
    const [editRepetition, setEditRepetition] = useState<string>(todo.repetition || 'none');
    const [hasDeadline, setHasDeadline] = useState(!!todo.deadline);
    const [hasRepetition, setHasRepetition] = useState(todo.repetition !== 'none' && todo.repetition !== undefined);
    const [isModified, setIsModified] = useState(false);
    const [editIsCompleted, setEditIsCompleted] = useState(isCompleted);
    const emojiPickerRef = useRef<EmojiPickerRef>(null);
    
    // 모달이 열릴 때마다 초기값 설정
    useEffect(() => {
      if (visible) {
        setEditContent(todo.content);
        setEditEmoji(todo.emoji || '📝');
        setEditDeadline(formatDateForInput(todo.deadline || undefined));
        setEditRepetition(todo.repetition || 'none');
        setHasDeadline(!!todo.deadline);
        setHasRepetition(todo.repetition !== 'none' && todo.repetition !== undefined);
        setEditIsCompleted(isCompleted);
        setIsModified(false);
      }
    }, [visible, todo, isCompleted]);
    
    // 내용 변경 감지
    useEffect(() => {
      const contentChanged = editContent !== todo.content;
      const emojiChanged = editEmoji !== (todo.emoji || '📝');
      const deadlineChanged = formatDateForInput(todo.deadline || undefined) !== editDeadline;
      const repetitionChanged = (todo.repetition || 'none') !== editRepetition;
      const hasDeadlineChanged = !!todo.deadline !== hasDeadline;
      const hasRepetitionChanged = (todo.repetition !== 'none' && !!todo.repetition) !== hasRepetition;
      const completedChanged = editIsCompleted !== isCompleted;
      
      setIsModified(contentChanged || emojiChanged || deadlineChanged || repetitionChanged || 
                    hasDeadlineChanged || hasRepetitionChanged || completedChanged);
    }, [editContent, editEmoji, editDeadline, editRepetition, hasDeadline, hasRepetition, editIsCompleted, todo, isCompleted]);
    
    // 저장 처리 함수
    const handleSave = useCallback(() => {
      if (editContent.trim() === '') return; // 내용이 비어있으면 저장하지 않음
      
      let deadlineDate: Date | null | undefined = undefined;
      
      if (hasDeadline) {
        if (editDeadline && editDeadline.trim() !== '') {
          try {
            deadlineDate = new Date(editDeadline);
            
            // Invalid Date 체크
            if (isNaN(deadlineDate.getTime())) {
              deadlineDate = undefined;
            }
          } catch (error) {
            console.error('Invalid date format', error);
            deadlineDate = undefined;
          }
        }
      } else {
        // 마감일 없음을 명시적으로 표시
        deadlineDate = null;
      }
      
      const finalRepetition = hasRepetition ? editRepetition : 'none';
      
      // 완료 상태도 함께 저장하도록 수정
      onSave(editContent, deadlineDate, editEmoji, finalRepetition);
      
      // 완료 상태 변경 처리
      if (editIsCompleted !== isCompleted) {
        // toggleTodo 함수를 호출하여 완료 상태 변경
        useToDoStore.getState().toggleTodo(todo.id);
      }
      
      onClose();
    }, [editContent, editDeadline, editEmoji, editRepetition, hasDeadline, hasRepetition, editIsCompleted, isCompleted, todo.id, onSave, onClose]);
    
    // 완료 상태 토글 핸들러
    const toggleCompleted = () => {
      setEditIsCompleted(!editIsCompleted);
    };
    
    // 마감일 토글 핸들러
    const toggleDeadline = () => {
      setHasDeadline(!hasDeadline);
      if (!hasDeadline) {
        // 마감일 활성화 시 기본값으로 오늘 날짜 설정
        const today = new Date();
        setEditDeadline(formatDateForInput(today));
      }
    };
    
    // 반복 설정 토글 핸들러
    const toggleRepetition = () => {
      setHasRepetition(!hasRepetition);
      if (!hasRepetition) {
        // 반복 설정 활성화 시 기본값으로 매일 설정
        setEditRepetition('daily');
      } else {
        // 반복 설정 비활성화 시 none으로 설정
        setEditRepetition('none');
      }
    };
    
    // 반복 설정 변경 핸들러
    const handleRepetitionChange = (repetition: string) => {
      setEditRepetition(repetition);
    };
    
    // 이모지 선택 처리 함수
    const handleEmojiSelected = (emoji: string) => {
      setEditEmoji(emoji);
      emojiPickerRef.current?.hide();
    };
    
    // 이모지 버튼 클릭 처리
    const handleEmojiButtonPress = () => {
      // 키보드가 열려있으면 닫기
      Keyboard.dismiss();
      // 이모지 피커 표시
      emojiPickerRef.current?.show();
    };
    
    // 모달 닫기 처리 함수 - 닫기 전에 저장 처리
    const handleClose = useCallback(() => {
      if (isModified) {
        handleSave();
      } else {
        onClose();
      }
    }, [isModified, onClose, handleSave]);
    const { theme } = useThemeStore();

    const currentLanguage = getCurrentLanguage();
    const isEnglish = currentLanguage === 'en';

    return (
      <Modal
        animationType="fade"
        transparent={true}
        visible={visible}
        onRequestClose={handleClose}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className={`${theme === 'dark' ? 'bg-black' : 'bg-white'} w-[90%] rounded-lg p-6 shadow-lg max-h-[80%]`} style={{ zIndex: ModalZLevel }}>
              <ScrollView className="w-full">
                {/* 헤더와 내용을 합친 영역 */}
                <View className="flex-row justify-between items-start mb-4">
                  {/* 이모지와 내용 */}
                  <View className="flex-row flex-1 mr-2">
                    {/* 이모지 선택 */}
                    <TouchableOpacity
                      className={`w-10 h-10 rounded-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'} items-center justify-center mr-3`}
                      onPress={handleEmojiButtonPress}
                    >
                      <Txt variant="title" className="text-xl">{editEmoji}</Txt>
                    </TouchableOpacity>
                    
                    {/* 내용 입력 필드 */}
                    <TextInput
                      className={`flex-1 border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg p-2`}
                      value={editContent}
                      onChangeText={setEditContent}
                      placeholder={t('todo.detail.enterTodo')}
                      placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                      multiline
                      onFocus={() => emojiPickerRef.current?.hide()}
                      style={{ color: theme === 'dark' ? 'white' : 'black' }}
                    />
                  </View>
                  
                  {/* 닫기/저장 버튼 */}
                  <TouchableOpacity onPress={handleClose} className={`p-2 rounded-lg`}>
                    <Txt variant="paragraph" className={theme === 'dark' ? 'text-white' : 'text-black'}>
                      {isModified ? t('todo.detail.save') : '✕'}
                    </Txt>
                  </TouchableOpacity>
                </View>
                
                    {/* 완료 상태 토글 */}
                    <View className="flex-row justify-between items-center h-12"> 
                    <TextToggle
                      isActive={editIsCompleted}
                      activeText={t('todo.detail.completed')}
                      inactiveText={t('todo.detail.inProgress')}
                      onToggle={toggleCompleted}
                    />
                    </View>
                    <View className="w-full flex-row justify-between items-center h-12">
                    {/* 마감일 토글 */}
                    <TextToggle
                      isActive={hasDeadline}
                      activeText={t('todo.detail.useDeadline')}
                      inactiveText={t('todo.detail.noDeadlineToggle')}
                      onToggle={toggleDeadline}
                    />
                    {/* 마감일 입력 필드 */}
                      {hasDeadline && (
                      <TextInput
                        className={`border ${theme === 'dark' ? 'border-gray-700 bg-gray-800 text-white' : 'border-gray-300 bg-white text-black'} rounded-lg p-2 w-[120px]`}
                        value={editDeadline}
                        onChangeText={setEditDeadline}
                        placeholder={t('todo.detail.deadlinePlaceholder')}
                        placeholderTextColor={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                        onFocus={() => emojiPickerRef.current?.hide()}
                        style={{ color: theme === 'dark' ? 'white' : 'black' }}
                      />
                    )}
                    </View>
            
                {/* 반복 설정 영역 추가 */}
                <View className="w-full flex-row justify-between items-center h-12">
                    <TextToggle
                      isActive={hasRepetition}
                      activeText={t('todo.detail.useRepetition')}
                      inactiveText={t('todo.detail.noRepetition')}
                      onToggle={toggleRepetition}
                    />
                  
                  <View className="w-auto">
                    {hasRepetition && (
                      <View className="flex-row flex-wrap w-auto space-x-2">
                        <TouchableOpacity 
                          className={`px-3 py-1 rounded-full ${editRepetition === 'daily' ? 'bg-blue-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                          onPress={() => handleRepetitionChange('daily')}
                        >
                          <Txt variant="paragraph" className={`${isEnglish ? 'text-[10px]' : ''} ${editRepetition === 'daily' ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('todo.repetition.daily')}</Txt>
                        </TouchableOpacity>
                        <TouchableOpacity 
                          className={`px-3 py-1 rounded-full ${editRepetition === 'weekly' ? 'bg-blue-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                          onPress={() => handleRepetitionChange('weekly')}
                        >
                          <Txt variant="paragraph" className={`${isEnglish ? 'text-[10px]' : ''} ${editRepetition === 'weekly' ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('todo.repetition.weekly')}</Txt>
                        </TouchableOpacity>
                        
                        <TouchableOpacity 
                          className={`px-3 py-1 rounded-full ${editRepetition === 'monthly' ? 'bg-blue-500' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}
                          onPress={() => handleRepetitionChange('monthly')}
                        >
                          <Txt variant="paragraph" className={`${isEnglish ? 'text-[10px]' : ''} ${editRepetition === 'monthly' ? 'text-white' : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{t('todo.repetition.monthly')}</Txt>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
                
               
              </ScrollView>
            </View>
          </View>
          
          {/* 이모지 피커 (키보드처럼 작동) */}
          <EmojiPicker 
            ref={emojiPickerRef}
            onEmojiSelected={handleEmojiSelected}
          />
        </KeyboardAvoidingView>
      </Modal>
    );
  };
  
  export default TodoDetailModal;
