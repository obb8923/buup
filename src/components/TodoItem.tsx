import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text as RNText } from 'react-native';
import { ToDoItemType } from '../stores/useToDoStore';
import Text from './Txt';
import Colors from '../constants/Colors';
import TodoDetailModal from './modals/TodoDetailModal';
import useTodoModal from '../libs/hooks/useTodoModal';

interface TodoItemProps {
  todo: ToDoItemType;
}

/**
 * 할 일 항목을 표시하는 컴포넌트
 */
const TodoItem: React.FC<TodoItemProps> = ({ todo }) => {
  // useTodoModal 훅 사용
  const {
    modalVisible,
    handleOpenModal,
    handleCloseModal,
    handleToggleTodo,
    handleSaveTodo,
    handleDeleteTodo
  } = useTodoModal(todo);

  // 날짜 포맷팅 함수
  const formatDate = (date?: Date): string => {
    if (!date) return '';
    
    try {
      return date.toLocaleDateString('ko-KR', {
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Invalid date format', error);
      return '';
    }
  };

  return (
    <>
      <TouchableOpacity
        style={[
          styles.container,
          todo.completed ? styles.completedContainer : {}
        ]}
        onPress={handleOpenModal}
      >
        <View style={styles.leftSection}>
          <Text style={styles.emoji} variant="title">{todo.emoji || '📝'}</Text>
          <View style={styles.textContainer}>
            <Text
              style={todo.completed ? styles.completedText : styles.content}
              variant="paragraph"
            >
              {todo.content}
            </Text>
            {todo.deadline && (
              <Text style={styles.deadline} variant="caption">
                {formatDate(todo.deadline)}
              </Text>
            )}
          </View>
        </View>
        
        <TouchableOpacity
          style={[
            styles.checkbox,
            todo.completed ? styles.checkedBox : {}
          ]}
          onPress={handleToggleTodo}
        >
          {todo.completed && <Text style={styles.checkmark} variant="caption">✓</Text>}
        </TouchableOpacity>
      </TouchableOpacity>

      {/* 할 일 세부 정보 모달 */}
      <TodoDetailModal
        visible={modalVisible}
        onClose={handleCloseModal}
        todo={todo}
        onDelete={handleDeleteTodo}
        isCompleted={todo.completed}
        onToggleComplete={handleToggleTodo}
        onSave={handleSaveTodo}
      />
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: Colors.white,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  completedContainer: {
    backgroundColor: Colors.white,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  content: {
    fontSize: 16,
    color: Colors.black,
  },
  completedText: {
    fontSize: 16,
    color: Colors.gray,
    textDecorationLine: 'line-through',
  },
  deadline: {
    fontSize: 12,
    color: Colors.gray,
    marginTop: 4,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedBox: {
    backgroundColor: Colors.gray200,
  },
  checkmark: {
    color: Colors.white,
    fontSize: 14,
  },
});

export default TodoItem; 