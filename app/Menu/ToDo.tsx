import { Pressable, View, FlatList } from "react-native";
import React, { useCallback, useEffect, useRef, useState, useMemo, memo } from "react";
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import { t } from "../../src/i18n";
import Txt from "../../src/components/Txt";
import TodoDetailModal from "../../src/components/modals/TodoDetailModal";
import TodoAddInput from "../../src/components/TodoAddInput";
import useToDoStore, { ToDoItemType } from "../../src/stores/useToDoStore";
import useThemeStore from "../../src/stores/useThemeStore";

//   ToDo 컴포넌트 - 할 일 목록을 표시하고 드래그로 순서를 변경할 수 있는 기능 제공
const ToDo = memo(() => {
  // 할 일 목록과 순서 변경 함수 가져오기 - 필요한 항목만 선택적으로 가져오기
  const todos = useToDoStore(state => state.todos);
  const reorderTodos = useToDoStore(state => state.reorderTodos);
  const sortByDeadline = useToDoStore(state => state.sortByDeadline);
  const addTodo = useToDoStore(state => state.addTodo);
  // 데이터 로딩 상태
  const [isLoading, setIsLoading] = useState(true);
  const { theme } = useThemeStore();
  // 입력 필드 포커스 상태 추가
  const [isInputFocused, setIsInputFocused] = useState(false);

  // 실제 할일 항목만 필터링 (id가 "0"인 항목 제외) - 렌더링 전에 미리 계산
  const filteredTodos = useMemo(() => {
    // 완료된 항목은 맨 뒤로 정렬
    return todos.filter(todo => todo.id !== "0")
      .sort((a, b) => {
        if (a.completed && !b.completed) return 1;
        if (!a.completed && b.completed) return -1;
        return 0;
      });
  }, [todos]);

  // 컴포넌트 마운트 시 데이터 로딩 및 정렬 - 최적화
  useEffect(() => {
    let isMounted = true;
    
    const loadData = async () => {
      if (!isMounted) return;
      
      try {
        // 데이터 정렬 작업을 비동기적으로 실행
        // requestAnimationFrame을 사용하여 렌더링 블로킹 방지
        requestAnimationFrame(() => {
          if (isMounted) {
            sortByDeadline();
            // 불필요한 setTimeout 제거
            setIsLoading(false);
          }
        });
      } catch (error) {
        console.error(t('todo.loadError'), error);
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };
    
    loadData();
    
    // 클린업 함수 추가
    return () => {
      isMounted = false;
    };
  }, [sortByDeadline]);

  // 각 할 일 항목을 렌더링하는 함수
  const renderItem = useCallback(({ item }: { item: ToDoItemType }) => {
    return (
      <ToDoItem 
        id={item.id} 
        completed={item.completed} 
        createdAt={item.createdAt} 
        content={item.content}
        deadline={item.deadline}
        emoji={item.emoji}
        repetition={item.repetition}
      />
    );
  }, []);

  // FlatList 컴포넌트로 변경
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={filteredTodos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={{ padding: 10, paddingBottom: 70 }}
        // 성능 최적화를 위한 추가 속성
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        windowSize={5}
        removeClippedSubviews={true}
      />

      <TodoAddInput />
    </View>
  );
});

export default ToDo;


// 개별 할 일 항목 컴포넌트
const ToDoItem = memo(({ 
  id, content, completed, createdAt, deadline,
  emoji, repetition
}: ToDoItemType) => {
  // 할 일 관련 함수들 가져오기 - 필요한 항목만 선택적으로 가져오기
  const toggleTodo = useToDoStore(state => state.toggleTodo);
  const removeTodo = useToDoStore(state => state.removeTodo);
  const editTodoContent = useToDoStore(state => state.editTodoContent);
  const sortByDeadline = useToDoStore(state => state.sortByDeadline);
  
  // 모달 표시 상태 관리
  const [modalVisible, setModalVisible] = useState(false);
  // 현재 완료 상태 관리 (모달 내에서 변경 시 즉시 UI 반영을 위함)
  const [isCompleted, setIsCompleted] = useState(completed);
  const { theme } = useThemeStore();
  
  // completed 상태가 변경될 때 isCompleted 상태도 업데이트
  useEffect(() => {
    setIsCompleted(completed);
  }, [completed]);
  
  // 할 일 삭제 처리 함수
  const handleDelete = useCallback(() => {
    removeTodo(id);
    setModalVisible(false);
  }, [id, removeTodo]);
  
  // 수정 저장 함수
  const handleSaveEdit = useCallback((editedContent: string, editedDeadline?: Date | null, editedEmoji?: string, repetition?: string) => {
    editTodoContent(id, editedContent, editedDeadline, editedEmoji, repetition);
    // deadline이 수정되면 자동으로 목록을 deadline 기준으로 정렬
    sortByDeadline();
  }, [id, editTodoContent, sortByDeadline]);
  
  // 현재 할 일 항목 객체
  const todoItem = useMemo(() => ({
    id,
    content,
    completed,
    createdAt,
    deadline,
    emoji,
    repetition
  }), [id, content, completed, createdAt, deadline, emoji, repetition]);

  // 기한 표시 텍스트 생성
  const getDeadlineText = useCallback(() => {
    if (!deadline) return "";
    
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return t('todo.deadline.overdue');
    } else if (diffDays === 0) {
      return t('todo.deadline.today');
    } else if (diffDays === 1) {
      return t('todo.deadline.tomorrow');
    } else {
      // 변수 사용 대신 직접 문자열 조합
      return `${diffDays}${t('todo.deadline.daysLeft')}`;
    }
  }, [deadline]);
  
  // 기한 텍스트 색상 결정
  const deadlineTextColor = useMemo(() => {
    const text = getDeadlineText();
    if (text === t('todo.deadline.overdue')) return "text-red-500";
    if (text === t('todo.deadline.today')) return "text-orange-500";
    return "text-blue-500";
  }, [getDeadlineText]);
  
  // 모달 토글 함수
  const toggleModal = useCallback((visible: boolean) => {
    setModalVisible(visible);
  }, []);
  
  return (
    <>
      <Pressable
        className={`${theme==="dark"?"bg-black":"bg-white"} 
        h-auto rounded-lg p-4 px-px mb-4 flex-row
        ${completed ? 'opacity-60' : 'opacity-100'}`}
        onPress={() => toggleModal(true)}
      >
        {emoji && <Txt variant="subTitle" className={`mr-2 ${completed ? 'text-gray-500' : ''}`}>{emoji}</Txt>}
        <View className="flex-1 ">
          <Txt variant="subTitle" className={`w-full h-[20px] truncate ${completed ? 'text-gray-500' : ''}`}>{content}</Txt>
        </View>
        
        {completed ? (
          <Txt 
            variant="paragraph" 
            className="text-gray-500"
          >
            {t('todo.completed')}
          </Txt>
        ) : deadline && (
          <Txt 
            variant="paragraph" 
            className={`${deadlineTextColor}`}
          >
            {getDeadlineText()}
          </Txt>
        )}
      </Pressable>

      {/* 항상 모달을 렌더링하고 visible 속성으로 표시 여부 제어 */}
      <TodoDetailModal
        visible={modalVisible}
        onClose={() => toggleModal(false)}
        todo={todoItem}
        isCompleted={isCompleted}
        onSave={handleSaveEdit}
        onDelete={handleDelete}
      />
    </>
  );
});

