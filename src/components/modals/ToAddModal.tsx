// import { TouchableOpacity } from "react-native";
// import { Modal, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
// import { View } from "react-native";
// import Txt from "../Txt";
// import { useState, useCallback, useRef } from "react";
// import { TextInput } from "react-native";
// import EmojiPicker, { EmojiPickerRef } from '../EmojiPicker';
// import { t } from "../../i18n";

// /**
//  * 새 할 일 추가 모달 컴포넌트 - 간소화 버전
//  */
// const TodoAddModal = ({ 
//     visible, 
//     onClose, 
//     onAdd 
//   }: { 
//     visible: boolean; 
//     onClose: () => void; 
//     onAdd: (content: string, deadline?: Date, emoji?: string) => void;
//   }) => {
//     const [todoContent, setTodoContent] = useState('');
//     const [newDeadline, setNewDeadline] = useState('');
//     const [newEmoji, setNewEmoji] = useState('❗');
//     const emojiPickerRef = useRef<EmojiPickerRef>(null);
  
//     // 추가 취소 함수
//     const handleCancel = useCallback(() => {
//       setTodoContent('');
//       setNewDeadline('');
//       setNewEmoji('❗');
//       onClose();
//     }, [onClose]);
  
//     // 추가 함수
//     const handleAdd = useCallback(() => {
//       if (todoContent.trim() === '') return; // 내용이 비어있으면 추가하지 않음
      
//       let deadlineDate: Date | undefined = undefined;
      
//       if (newDeadline && newDeadline.trim() !== '') {
//         try {
//           deadlineDate = new Date(newDeadline);
          
//           // Invalid Date 체크
//           if (isNaN(deadlineDate.getTime())) {
//             deadlineDate = undefined;
//           }
//         } catch (error) {
//           console.error('Invalid date format', error);
//           deadlineDate = undefined;
//         }
//       }
      
//       onAdd(todoContent, deadlineDate, newEmoji);
//       setTodoContent('');
//       setNewDeadline('');
//       setNewEmoji('📝');
//     }, [todoContent, newDeadline, newEmoji, onAdd]);
  
//     // 이모지 선택 처리 함수
//     const handleEmojiSelected = (emoji: string) => {
//       setNewEmoji(emoji);
//       emojiPickerRef.current?.hide();
//     };
    
//     // 이모지 버튼 클릭 처리
//     const handleEmojiButtonPress = () => {
//       // 키보드가 열려있으면 닫기
//       Keyboard.dismiss();
//       // 이모지 피커 표시
//       emojiPickerRef.current?.show();
//     };
  
//     return (
//       <Modal
//         animationType="fade"
//         transparent={true}
//         visible={visible}
//         onRequestClose={onClose}
//       >
//         <KeyboardAvoidingView 
//           behavior={Platform.OS === "ios" ? "padding" : "height"}
//           style={{ flex: 1 }}
//         >
//           <View className="flex-1 justify-center items-center bg-black/50">
//             <View className="bg-white w-[90%] rounded-lg p-6 shadow-lg">
//               {/* 모달 헤더 */}
//               <View className="flex-row justify-between items-center mb-4">
//                 <Txt variant="title" className="font-bold">{t('todo.addTodo')}</Txt>
//                 <TouchableOpacity onPress={handleCancel}>
//                   <Txt variant="paragraph">✕</Txt>
//                 </TouchableOpacity>
//               </View>
              
//               {/* 이모지 선택 */}
//               <View className="flex-row items-center mb-4">
//                 <TouchableOpacity
//                   className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center mr-2"
//                   onPress={handleEmojiButtonPress}
//                 >
//                   <Txt variant="title" className="text-xl">{newEmoji}</Txt>
//                 </TouchableOpacity>
                
//                 {/* 할 일 입력 필드 */}
//                 <TextInput
//                   className="flex-1 border border-gray-300 rounded-lg p-2 h-[100px]"
//                   value={todoContent}
//                   onChangeText={setTodoContent}
//                   placeholder={t('todo.detail.enterTodo')}
//                   multiline
//                   textAlignVertical="top"
//                   onFocus={() => emojiPickerRef.current?.hide()}
//                 />
//               </View>
              
//               <View className="mb-4">
//                 <Txt variant="subTitle" className="mb-2">{t('todo.detail.deadline')}:</Txt>
//                 <TextInput
//                   className="border border-gray-300 rounded-lg p-2"
//                   value={newDeadline}
//                   onChangeText={setNewDeadline}
//                   placeholder={t('todo.detail.deadlinePlaceholder')}
//                   onFocus={() => emojiPickerRef.current?.hide()}
//                 />
//               </View>
              
//               {/* 버튼 영역 */}
//               <View className="flex-row justify-end mt-4">
//                 {/* 취소 버튼 */}
//                 <TouchableOpacity 
//                   className="bg-gray-200 py-2 px-4 rounded-lg items-center mr-2"
//                   onPress={handleCancel}
//                 >
//                   <Txt variant="paragraph">{t('common.cancel')}</Txt>
//                 </TouchableOpacity>
                
//                 {/* 추가 버튼 */}
//                 <TouchableOpacity 
//                   className="bg-blue-500 py-2 px-4 rounded-lg items-center"
//                   onPress={handleAdd}
//                 >
//                   <Txt variant="paragraph" className="text-white">{t('todo.detail.add')}</Txt>
//                 </TouchableOpacity>
//               </View>
//             </View>
//           </View>
          
//           {/* 이모지 피커 (키보드처럼 작동) */}
//           <EmojiPicker 
//             ref={emojiPickerRef}
//             onEmojiSelected={handleEmojiSelected}
//           />
//         </KeyboardAvoidingView>
//       </Modal>
//     );
//   };
// export default TodoAddModal;  