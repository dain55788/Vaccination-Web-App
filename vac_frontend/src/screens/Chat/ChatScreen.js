// import React, { useState, useEffect, useLayoutEffect, useContext, useRef, useCallback } from 'react';
// import {
//     View,
//     Text,
//     TextInput,
//     TouchableOpacity,
//     ScrollView,
//     StyleSheet,
//     KeyboardAvoidingView,
//     Platform,
//     Alert
// } from 'react-native';
// import {
//     collection,
//     addDoc,
//     orderBy,
//     query,
//     onSnapshot,
//     serverTimestamp
// } from 'firebase/firestore';
// import { auth, database } from '../../../config/Firebase';
// import { useNavigation } from '@react-navigation/native';
// import { AntDesign } from '@expo/vector-icons';
// import commonStyles, { COLORS, SPACING, FONT_SIZE, BORDER_RADIUS, SHADOW } from '../../styles/MyStyles';
// import { MyUserContext } from '../../utils/MyContexts';
// import { onAuthStateChanged } from 'firebase/auth';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export default function Chat() {
//     const currentUser = useContext(MyUserContext);
//     const [messages, setMessages] = useState([]);
//     const [inputText, setInputText] = useState('');
//     const nav = useNavigation();
//     const flatListRef = useRef();
//     const scrollViewRef = useRef(null);

//     useLayoutEffect(() => {
//         const collectionRef = collection(database, 'chats');
//         const q = query(collectionRef, orderBy('createdAt', 'asc'));

//         const unsubscribe = onSnapshot(q, querySnapshot => {
//             const messagesData = querySnapshot.docs.map(doc => ({
//                 _id: doc.data()._id,
//                 createdAt: doc.data().createdAt?.toDate() || new Date(),
//                 text: doc.data().text,
//                 user: doc.data().user
//             }));
//             setMessages(messagesData);
//             setTimeout(() => {
//                 scrollViewRef.current?.scrollToEnd({ animated: true });
//             }, 100);
//         });

//         return unsubscribe;
//     }, []);

//     const onSend = useCallback(() => {
//         if (inputText.trim().length === 0) return;
//         try {
//             addDoc(collection(database, 'chats'), {
//                 _id,
//                 createdAt: serverTimestamp(),
//                 text: inputText.trim(),
//                 user,
//             });
//             setInputText('');
//         } catch (error) {
//             console.error('Error sending message: ', error);
//             Alert.alert('Error', 'Failed to send message');
//         }
//     }, [inputText]);

//     const formatTime = (date) => {
//         if (!date) return '';
//         return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
//     };

//     const isMyMessage = (message) => {
//         return message.user._id === auth?.currentUser?.email;
//     };

//     const renderMessages = () => {
//         return messages.map((message) => {
//             const isMine = isMyMessage(message);

//             return (
//                 <View
//                     key={message._id}
//                     style={[
//                         styles.messageContainer,
//                         isMine ? styles.myMessageContainer : styles.otherMessageContainer
//                     ]}
//                 >
//                     {!isMine && (
//                         <View style={styles.avatarContainer}>
//                             <Text style={styles.avatarText}>
//                                 {currentUser.username?.charAt(0).toUpperCase() || '?'}
//                             </Text>
//                         </View>
//                     )}

//                     <View style={[
//                         styles.messageBubble,
//                         isMine ? styles.myMessageBubble : styles.otherMessageBubble
//                     ]}>
//                         {!isMine && (
//                             <Text style={styles.senderName}>{currentUser.name}</Text>
//                         )}
//                         <Text style={[
//                             styles.messageText,
//                             isMine ? styles.myMessageText : styles.otherMessageText
//                         ]}>
//                             {message.text}
//                         </Text>
//                         <Text style={[
//                             styles.timeText,
//                             isMine ? styles.myTimeText : styles.otherTimeText
//                         ]}>
//                             {formatTime(message.createdAt)}
//                         </Text>
//                     </View>
//                 </View>
//             );
//         });
//     };

//     return (
//         <SafeAreaView style={commonStyles.safeArea}>
//             <View style={commonStyles.header}>
//                 <TouchableOpacity
//                     style={commonStyles.backButton}
//                     onPress={() => nav.goBack()}
//                 >
//                     <Text style={commonStyles.backButtonText}>←</Text>
//                 </TouchableOpacity>
//                 <Text style={commonStyles.headerTitle}>Landing Page</Text>
//                 <View style={styles.emptySpace} />
//             </View>
//             <KeyboardAvoidingView
//                 style={styles.container}
//                 behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//                 keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
//             >

//                 <ScrollView
//                     ref={scrollViewRef}
//                     style={styles.messageContainer}
//                     contentContainerStyle={styles.messagesContent}
//                     showsVerticalScrollIndicator={false}
//                     onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
//                     currentUser={{
//                         _id: auth?.user?.email,
//                         avatar: currentUser.avatar
//                       }}
//                 >
//                     {renderMessages()}
//                 </ScrollView>

//                 <View style={styles.inputContainer}>
//                     <TextInput
//                         style={styles.textInput}
//                         value={inputText}
//                         onChangeText={setInputText}
//                         placeholder="Ask Experts About VaxServe..."
//                         placeholderTextColor="#999"
//                         multiline
//                         maxLength={1000}
//                     />
//                     <TouchableOpacity
//                         style={[
//                             styles.sendButton,
//                             inputText.trim().length === 0 && styles.sendButtonDisabled
//                         ]}
//                         onPress={onSend}
//                         disabled={inputText.trim().length === 0}
//                     >
//                         <AntDesign
//                             name="arrowright"
//                             size={20}
//                             color={inputText.trim().length === 0 ? '#666' : '#fff'}
//                         />
//                     </TouchableOpacity>
//                 </View>
//             </KeyboardAvoidingView>
//         </SafeAreaView>
//     );
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//     },
//     logoutButton: {
//         marginRight: 15,
//     },
//     messagesContainer: {
//         flex: 1,
//     },
//     messagesContent: {
//         paddingHorizontal: 10,
//         paddingVertical: 10,
//     },
//     messageContainer: {
//         flexDirection: 'row',
//         marginVertical: 2,
//         paddingHorizontal: 5,
//     },
//     myMessageContainer: {
//         justifyContent: 'flex-end',
//     },
//     otherMessageContainer: {
//         justifyContent: 'flex-start',
//     },
//     avatarContainer: {
//         width: 32,
//         height: 32,
//         borderRadius: 16,
//         backgroundColor: '#007AFF',
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 8,
//         marginTop: 5,
//     },
//     avatarText: {
//         color: 'white',
//         fontSize: 14,
//         fontWeight: 'bold',
//     },
//     messageBubble: {
//         maxWidth: '75%',
//         paddingHorizontal: 12,
//         paddingVertical: 8,
//         borderRadius: 18,
//         marginVertical: 2,
//     },
//     myMessageBubble: {
//         backgroundColor: '#007AFF',
//         borderBottomRightRadius: 4,
//     },
//     otherMessageBubble: {
//         backgroundColor: '#e5e5ea',
//         borderBottomLeftRadius: 4,
//     },
//     senderName: {
//         fontSize: 12,
//         fontWeight: '600',
//         color: '#333',
//         marginBottom: 2,
//     },
//     messageText: {
//         fontSize: 16,
//         lineHeight: 20,
//     },
//     myMessageText: {
//         color: 'white',
//     },
//     otherMessageText: {
//         color: '#000',
//     },
//     timeText: {
//         fontSize: 11,
//         marginTop: 4,
//         alignSelf: 'flex-end',
//     },
//     myTimeText: {
//         color: 'rgba(255, 255, 255, 0.7)',
//     },
//     otherTimeText: {
//         color: '#666',
//     },
//     inputContainer: {
//         flexDirection: 'row',
//         padding: SPACING?.md || 16,
//         backgroundColor: COLORS?.white || '#FFFFFF',
//         alignItems: 'flex-end',
//         borderTopWidth: 1,
//         borderTopColor: COLORS?.border || '#E0E0E0',
//     },
//     textInput: {
//         flex: 1,
//         borderWidth: 1,
//         borderColor: COLORS?.border || '#E0E0E0',
//         borderRadius: BORDER_RADIUS?.lg || 20,
//         paddingHorizontal: SPACING?.md || 16,
//         paddingVertical: SPACING?.sm || 8,
//         fontSize: FONT_SIZE?.md || 16,
//         maxHeight: 100,
//         backgroundColor: COLORS?.background || '#F8F8F8',
//     },
//     sendButton: {
//         backgroundColor: COLORS?.primary || '#007AFF',
//         borderRadius: BORDER_RADIUS?.full || 20,
//         padding: SPACING?.sm || 8,
//         marginLeft: SPACING?.sm || 8,
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: 40,
//         height: 40,
//     },
//     sendButtonDisabled: {
//         backgroundColor: COLORS?.lightGray || '#CCCCCC',
//     },
// });