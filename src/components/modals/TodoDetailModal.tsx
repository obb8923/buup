import { Modal, TouchableOpacity, View, TextInput, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
import Txt from "../Txt";
import { ToDoItemType } from "../../stores/useToDoStore";
import { useState, useCallback, useEffect, useRef } from "react";
import EmojiPicker, { EmojiPickerRef } from '../EmojiPicker';

/**
 * 날짜를 포맷팅하는 함수
 */
const formatDate = (date?: Date): string => {
  if (!date) return '설정되지 않음';
  
  try {
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
  } catch (error) {
    console.error('Invalid date format', error);
    return '유효하지 않은 날짜';
  }
};

/**
 * 날짜를 YYYY-MM-DD 형식으로 변환하는 함수
 */
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

/**
 * 남은 일수를 계산하는 함수
 */
const getRemainingDays = (deadline?: Date): string => {
  if (!deadline) return '';
  
  const today = new Date();
  const diffTime = deadline.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    return `(기한 초과: ${Math.abs(diffDays)}일 지남)`;
  } else if (diffDays === 0) {
    return '(오늘 마감)';
  } else if (diffDays === 1) {
    return '(내일 마감)';
  } else {
    return `(${diffDays}일 남음)`;
  }
};

/**
 * 할 일 세부 정보 모달 컴포넌트 - 직접 수정 가능
 */
const TodoDetailModal = ({ 
    visible, 
    onClose, 
    todo, 
    onDelete, 
    isCompleted, 
    onToggleComplete,
    onSave
  }: { 
    visible: boolean; 
    onClose: () => void; 
    todo: ToDoItemType; 
    onDelete: () => void; 
    isCompleted: boolean;
    onToggleComplete: () => void;
    onSave: (content: string, deadline?: Date, emoji?: string) => void;
  }) => {
    // 수정 상태 관리
    const [editContent, setEditContent] = useState(todo.content);
    const [editDeadline, setEditDeadline] = useState('');
    const [editEmoji, setEditEmoji] = useState(todo.emoji || '📝');
    const emojiPickerRef = useRef<EmojiPickerRef>(null);
    
    // 모달이 열릴 때마다 초기값 설정
    useEffect(() => {
      if (visible) {
        setEditContent(todo.content);
        setEditEmoji(todo.emoji || '📝');
        setEditDeadline(formatDateForInput(todo.deadline));
      }
    }, [visible, todo]);
    
    // 저장 처리 함수
    const handleSave = useCallback(() => {
      if (editContent.trim() === '') return; // 내용이 비어있으면 저장하지 않음
      
      let deadlineDate: Date | undefined = undefined;
      
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
      
      onSave(editContent, deadlineDate, editEmoji);
      onClose();
    }, [editContent, editDeadline, editEmoji, onSave, onClose]);
    
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
      handleSave();
    }, [handleSave]);
    
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
            <View className="bg-white w-[90%] rounded-lg p-6 shadow-lg">
              {/* 헤더와 내용을 합친 영역 */}
              <View className="flex-row justify-between items-start mb-4">
                {/* 이모지와 내용 */}
                <View className="flex-row flex-1 mr-2">
                  {/* 이모지 선택 */}
                  <TouchableOpacity
                    className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-3"
                    onPress={handleEmojiButtonPress}
                  >
                    <Txt variant="title" className="text-xl">{editEmoji}</Txt>
                  </TouchableOpacity>
                  
                  {/* 내용 입력 필드 */}
                  <TextInput
                    className="flex-1 border border-gray-300 rounded-lg p-2"
                    value={editContent}
                    onChangeText={setEditContent}
                    placeholder="할 일을 입력하세요"
                    multiline
                    onFocus={() => emojiPickerRef.current?.hide()}
                  />
                </View>
                
                {/* 닫기 버튼 - 닫기 전에 저장 처리 */}
                <TouchableOpacity onPress={handleClose} className="p-1">
                  <Txt variant="paragraph">✕</Txt>
                </TouchableOpacity>
              </View>
              
              <View className="mb-4">
                <Txt variant="subTitle" className="mb-2">상태:</Txt>
                <View className="flex-row items-center">
                  <Txt variant="paragraph">{isCompleted ? '완료됨' : '진행 중'}</Txt>
                  <TouchableOpacity 
                    className="ml-4 bg-gray-200 px-3 py-1 rounded-lg"
                    onPress={onToggleComplete}
                  >
                    <Txt variant="paragraph">{isCompleted ? '미완료로 표시' : '완료로 표시'}</Txt>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View className="mb-4">
                <Txt variant="subTitle" className="mb-2">완료 기한:</Txt>
                <TextInput
                  className="border border-gray-300 rounded-lg p-2"
                  value={editDeadline}
                  onChangeText={setEditDeadline}
                  placeholder="YYYY-MM-DD (예: 2024-03-15)"
                  onFocus={() => emojiPickerRef.current?.hide()}
                />
              </View>
              
              {/* 버튼 영역 제거됨 */}
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
