import { Pressable, View, Modal, TouchableOpacity, TextInput } from "react-native";
import Txt from "../../src/components/Txt";
import useToDoStore, { ToDoItemType } from "../../src/stores/useToDoStore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import DraggableFlatList, { 
  RenderItemParams, 
  ScaleDecorator 
} from 'react-native-draggable-flatlist';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import TodoDetailModal from "../../src/components/modals/TodoDetailModal";
import TodoAddModal from "../../src/components/modals/ToAddModal";
import useThemeStore from "../../src/stores/useThemeStore";
/**
 * ToDo 컴포넌트 - 할 일 목록을 표시하고 드래그로 순서를 변경할 수 있는 기능 제공
 */
const ToDo = () => {
  // 할 일 목록과 순서 변경 함수 가져오기
  const { todos, reorderTodos, sortByDeadline, addTodo } = useToDoStore();
  // 현재 드래그 중인지 상태 추적
  const isDraggingRef = useRef(false);
  // 새 할일 추가 모달 상태
  const [addModalVisible, setAddModalVisible] = useState(false);

  // 컴포넌트 마운트 시 기한 순으로 정렬
  useEffect(() => {
    sortByDeadline();
  }, [sortByDeadline]);

  /**
   * 드래그 시작 시 호출되는 함수
   */
  const onDragStart = useCallback(() => {
    console.log("드래그 시작됨");
    isDraggingRef.current = true;
  }, []);

  /**
   * 드래그 종료 시 호출되는 함수
   */
  const onDragEnd = useCallback(() => {
    console.log("드래그 종료됨");
    isDraggingRef.current = false;
  }, []);

  /**
   * 각 할 일 항목을 렌더링하는 함수
   * @param {RenderItemParams<ToDoItemType>} 항목 정보와 드래그 관련 속성
   */
  const renderItem = useCallback(({ item, drag, isActive }: RenderItemParams<ToDoItemType>) => {
    return (
      <ScaleDecorator>
        <ToDoItem 
          id={item.id} 
          completed={item.completed} 
          createdAt={item.createdAt} 
          content={item.content}
          deadline={item.deadline}
          emoji={item.emoji}
          onLongPress={drag}
          isActive={isActive}
        />
      </ScaleDecorator>
    );
  }, []);

  // 드래그 종료 후 새 순서로 할 일 목록 업데이트
  const handleDragEnd = useCallback(({ data }: { data: ToDoItemType[] }) => {
    reorderTodos([...data]);
    onDragEnd();
  }, [reorderTodos, onDragEnd]);

  // 새 할일 추가 처리 함수
  const handleAddTodo = useCallback((content: string, newDeadline?: Date, newEmoji?: string) => {
    addTodo(content, newDeadline, newEmoji);
    setAddModalVisible(false);
  }, [addTodo]);

  // 실제 할일 항목만 필터링 (id가 "0"인 항목 제외)
  const filteredTodos = todos.filter(todo => todo.id !== "0");

  // 제스처 핸들러를 적용한 드래그 가능한 리스트 컴포넌트
  const DraggableList = gestureHandlerRootHOC(() => (
    <View style={{ flex: 1 }}>
      <DraggableFlatList
        data={filteredTodos}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        onDragBegin={onDragStart}
        onDragEnd={handleDragEnd}
        contentContainerStyle={{ padding: 10 }}
      />
      
      {/* 플로팅 버튼 */}
      <TouchableOpacity
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center shadow-lg"
        onPress={() => setAddModalVisible(true)}
      >
        <Txt variant="title" className="text-white text-2xl">+</Txt>
      </TouchableOpacity>
      
      {/* 새 할일 추가 모달 */}
      <TodoAddModal
        visible={addModalVisible}
        onClose={() => setAddModalVisible(false)}
        onAdd={handleAddTodo}
      />
    </View>
  ));

  return <DraggableList />;
};

export default ToDo;

/**
 * 개별 할 일 항목 컴포넌트
 */
const ToDoItem = gestureHandlerRootHOC(({
  id, 
  content, 
  completed, 
  createdAt, 
  deadline,
  emoji,
  onLongPress, 
  isActive
}: ToDoItemType & { 
  onLongPress?: () => void, 
  isActive?: boolean 
}) => {
  // 할 일 관련 함수들 가져오기
  const { toggleTodo, removeTodo, editTodoContent, sortByDeadline } = useToDoStore();
  // 모달 표시 상태 관리
  const [modalVisible, setModalVisible] = useState(false);
  // 현재 완료 상태 관리 (모달 내에서 변경 시 즉시 UI 반영을 위함)
  const [isCompleted, setIsCompleted] = useState(completed);
  const { theme } = useThemeStore();
  
  // 완료 상태 토글 처리 함수
  const handleToggleComplete = useCallback(() => {
    toggleTodo(id);
    setIsCompleted(!isCompleted);
  }, [id, isCompleted, toggleTodo]);
  
  // 할 일 삭제 처리 함수
  const handleDelete = useCallback(() => {
    removeTodo(id);
    setModalVisible(false);
  }, [id, removeTodo]);
  
  // 수정 저장 함수
  const handleSaveEdit = useCallback((editedContent: string, editedDeadline?: Date, editedEmoji?: string) => {
    editTodoContent(id, editedContent, editedDeadline, editedEmoji);
    // deadline이 수정되면 자동으로 목록을 deadline 기준으로 정렬
    sortByDeadline();
  }, [id, editTodoContent, sortByDeadline]);
  
  // 현재 할 일 항목 객체
  const todoItem: ToDoItemType = {
    id,
    content,
    completed,
    createdAt,
    deadline,
    emoji
  };

  // 기한 표시 텍스트 생성
  const getDeadlineText = () => {
    if (!deadline) return "";
    
    const today = new Date();
    const diffTime = deadline.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return "기한 초과";
    } else if (diffDays === 0) {
      return "오늘까지";
    } else if (diffDays === 1) {
      return "내일까지";
    } else {
      return `${diffDays}일 남음`;
    }
  };
  
  return (
    <>
      <Pressable
        className={`${theme==="dark"?"bg-black":"bg-white"} h-auto rounded-lg p-4 px-px mb-4 ${isActive ? 'opacity-70' : ''}`}
        onPress={() => setModalVisible(true)}
        onLongPress={onLongPress}
        disabled={isActive}
      >
        {/* 할 일 제목 영역 */}
        <View className="flex-row items-center">
          {emoji && <Txt variant="subTitle" className="mr-2">{emoji}</Txt>}
          <Txt variant="subTitle" className="w-full h-[20px] truncate">{content}</Txt>
        </View>
        {/* 기한 표시 영역 */}
        {deadline && (
          <Txt 
            variant="paragraph" 
            className={`mt-2 font-bold ${
              getDeadlineText() === "기한 초과" 
                ? "text-red-500" 
                : getDeadlineText() === "오늘까지" 
                  ? "text-orange-500" 
                  : "text-blue-500"
            }`}
          >
            {getDeadlineText()}
          </Txt>
        )}
      </Pressable>

      {/* 할 일 세부 정보 모달 (직접 수정 가능) */}
      <TodoDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        todo={todoItem}
        onDelete={handleDelete}
        isCompleted={isCompleted}
        onToggleComplete={handleToggleComplete}
        onSave={handleSaveEdit}
      />
    </>
  );
});
