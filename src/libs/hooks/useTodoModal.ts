import { useState, useCallback } from 'react';
import { ToDoItemType } from '../../stores/useToDoStore';
import useToDoStore from '../../stores/useToDoStore';

/**
 * 할 일 모달 관련 로직을 처리하는 커스텀 훅
 * @param todoData 할 일 데이터
 * @param onModalClose 모달 닫기 콜백 (선택적)
 * @returns 모달 관련 상태와 핸들러 함수들
 */
export const useTodoModal = (todoData: ToDoItemType | undefined, onModalClose?: () => void) => {
  // TodoStore에서 필요한 함수들 가져오기
  const { toggleTodo, editTodoContent, removeTodo } = useToDoStore();
  
  // 모달 상태 관리
  const [modalVisible, setModalVisible] = useState(false);
  
  // 모달 열기 핸들러
  const handleOpenModal = useCallback(() => {
    if (todoData) {
      console.log(`Todo modal opened: ${todoData.id} - ${todoData.content}`);
      setModalVisible(true);
    }
  }, [todoData]);
  
  // 모달 닫기 핸들러
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    if (onModalClose) {
      onModalClose();
    }
  }, [onModalClose]);
  
  // 할 일 토글 핸들러
  const handleToggleTodo = useCallback(() => {
    if (todoData) {
      toggleTodo(todoData.id);
    }
  }, [todoData, toggleTodo]);
  
  // 할 일 저장 핸들러
  const handleSaveTodo = useCallback((content: string, deadline?: Date, emoji?: string) => {
    if (todoData) {
      editTodoContent(todoData.id, content, deadline, emoji);
    }
  }, [todoData, editTodoContent]);
  
  // 할 일 삭제 핸들러
  const handleDeleteTodo = useCallback(() => {
    if (todoData) {
      removeTodo(todoData.id);
      setModalVisible(false);
      if (onModalClose) {
        onModalClose();
      }
    }
  }, [todoData, removeTodo, onModalClose]);
  
  return {
    modalVisible,
    setModalVisible,
    handleOpenModal,
    handleCloseModal,
    handleToggleTodo,
    handleSaveTodo,
    handleDeleteTodo,
    todoData
  };
};

export default useTodoModal; 