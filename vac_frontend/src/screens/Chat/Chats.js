import PropTypes from 'prop-types';
import { Ionicons } from '@expo/vector-icons';
import React, { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import {
  doc,
  where,
  query,
  setDoc,
  orderBy,
  deleteDoc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import {
  Text,
  View,
  Alert,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView
} from 'react-native';

import commonStyles, { COLORS } from '../../styles/MyStyles';
import ContactRow from './ContactRow';
import { auth, database } from '../../../config/Firebase';

const Chats = ({ setUnreadCount }) => {
  const navigation = useNavigation();
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItems, setSelectedItems] = useState([]);
  const [newMessages, setNewMessages] = useState({});

  useFocusEffect(
    useCallback(() => {
      const loadNewMessages = async () => {
        try {
          const storedMessages = await AsyncStorage.getItem('newMessages');
          const parsedMessages = storedMessages ? JSON.parse(storedMessages) : {};
          setNewMessages(parsedMessages);
          setUnreadCount(Object.values(parsedMessages).reduce((total, num) => total + num, 0));
        } catch (error) {
          console.log('Error loading new messages from storage', error);
        }
      };

      const collectionRef = collection(database, 'chats');
      const q = query(
        collectionRef,
        where('users', 'array-contains', {
          email: auth.currentUser.email,
          name: auth.currentUser?.displayName || '',
          deletedFromChat: false,
        }),
        orderBy('lastUpdated', 'desc')
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        setChats(snapshot.docs);
        setLoading(false);

        snapshot.docChanges().forEach((change) => {
          if (change.type === 'modified') {
            const chatId = change.doc.id;
            const { messages } = change.doc.data();
            const firstMessage = messages[0];

            if (firstMessage?.user?._id !== auth.currentUser?.email) {
              setNewMessages((prev) => {
                const updatedMessages = { ...prev, [chatId]: (prev[chatId] || 0) + 1 };
                AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
                setUnreadCount(
                  Object.values(updatedMessages).reduce((total, num) => total + num, 0)
                );
                return updatedMessages;
              });
            }
          }
        });
      }, (error) => {
        console.error('Error fetching chats:', error);
        setLoading(false);
      });

      loadNewMessages();

      return () => unsubscribe();
    }, [setUnreadCount])
  );

  const handleChatName = (chat) => {
    const { users } = chat.data();
    const currentUser = auth?.currentUser;

    if (chat.data().groupName) {
      return chat.data().groupName;
    }

    if (currentUser?.displayName) {
      return users[0].name === currentUser.displayName ? users[1].name : users[0].name;
    }

    if (currentUser?.email) {
      return users[0].email === currentUser.email ? users[1].email : users[0].email;
    }

    return '~ No Name or Email ~';
  };

  const handleOnPress = async (chat) => {
    const chatId = chat.id;
    if (selectedItems.length) {
      return selectItems(chat);
    }
    setNewMessages((prev) => {
      const updatedMessages = { ...prev, [chatId]: 0 };
      AsyncStorage.setItem('newMessages', JSON.stringify(updatedMessages));
      setUnreadCount(Object.values(updatedMessages).reduce((total, num) => total + num, 0));
      return updatedMessages;
    });
    navigation.navigate('Chat', { id: chat.id, chatName: handleChatName(chat) });
    return null;
  };

  const handleLongPress = (chat) => {
    selectItems(chat);
  };

  const selectItems = (chat) => {
    if (selectedItems.includes(chat.id)) {
      setSelectedItems(selectedItems.filter((item) => item !== chat.id));
    } else {
      setSelectedItems([...selectedItems, chat.id]);
    }
  };

  const getSelected = (chat) => selectedItems.includes(chat.id);

  const deSelectItems = useCallback(() => {
    setSelectedItems([]);
  }, []);

  const handleFabPress = () => {
    navigation.navigate('Users');
  };

  const handleDeleteChat = useCallback(() => {
    Alert.alert(
      selectedItems.length > 1 ? 'Delete selected chats?' : 'Delete this chat?',
      'Messages will be removed from this device.',
      [
        {
          text: 'Delete chat',
          onPress: () => {
            selectedItems.forEach((chatId) => {
              const chat = chats.find((c) => c.id === chatId);
              const updatedUsers = chat
                .data()
                .users.map((user) =>
                  user.email === auth?.currentUser?.email
                    ? { ...user, deletedFromChat: true }
                    : user
                );

              setDoc(doc(database, 'chats', chatId), { users: updatedUsers }, { merge: true });

              const deletedUsers = updatedUsers.filter((user) => user.deletedFromChat).length;
              if (deletedUsers === updatedUsers.length) {
                deleteDoc(doc(database, 'chats', chatId));
              }
            });
            deSelectItems();
          },
        },
        { text: 'Cancel' },
      ],
      { cancelable: true }
    );
  }, [selectedItems, chats, deSelectItems]);


  const updateNavigationOptions = useCallback(() => {
    if (selectedItems.length > 0) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity style={styles.trashBin} onPress={handleDeleteChat}>
            <Ionicons name="trash" size={24} color={COLORS.teal} />
          </TouchableOpacity>
        ),
        headerLeft: () => <Text style={styles.itemCount}>{selectedItems.length}</Text>,
      });
    } else {
      navigation.setOptions({
        headerRight: null,
        headerLeft: null,
      });
    }
  }, [selectedItems, navigation, handleDeleteChat]);

  useEffect(() => {
    updateNavigationOptions();
  }, [selectedItems, updateNavigationOptions]);

  const handleSubtitle = (chat) => {
    const message = chat.data().messages[0];
    if (!message) return 'No messages yet';

    const isCurrentUser = auth?.currentUser?.email === message.user._id;
    const userName = isCurrentUser ? 'You' : message.user.name.split(' ')[0];
    let messageText;
    if (message.image) {
      messageText = 'sent an image';
    } else if (message.text.length > 20) {
      messageText = `${message.text.substring(0, 20)}...`;
    } else {
      messageText = message.text;
    }

    return `${userName}: ${messageText}`;
  };

  const handleSubtitle2 = (chat) => {
    const options = { year: '2-digit', month: 'numeric', day: 'numeric' };
    return new Date(chat.data().lastUpdated).toLocaleDateString(undefined, options);
  };

  return (
    <SafeAreaView style={[commonStyles.safeArea, styles.container]}>
      <Pressable style={styles.container} onPress={deSelectItems}>
        {loading ? (
          <ActivityIndicator size="large" style={styles.loadingContainer} />
        ) : (
          <ScrollView>
            {chats.length === 0 ? (
              <View style={styles.blankContainer}>
                <Text style={styles.textContainer}>No conversations yet</Text>
              </View>
            ) : (
              chats.map((chat) => (
                <React.Fragment key={chat.id}>
                  <ContactRow
                    style={getSelected(chat) ? styles.selectedContactRow : {}}
                    name={handleChatName(chat)}
                    subtitle={handleSubtitle(chat)}
                    subtitle2={handleSubtitle2(chat)}
                    onPress={() => handleOnPress(chat)}
                    onLongPress={() => handleLongPress(chat)}
                    selected={getSelected(chat)}
                    showForwardIcon={false}
                    newMessageCount={newMessages[chat.id] || 0}
                  />
                </React.Fragment>
              ))
            )}
            <View style={styles.blankContainer}>
              <Text style={{ fontSize: 12, margin: 15 }}>
                <Ionicons name="lock-open" size={12} style={{ color: '#565656' }} /> Your personal
                messages are not <Text style={{ color: COLORS.teal }}>end-to-end-encrypted</Text>
              </Text>
            </View>
          </ScrollView>
        )}
        <TouchableOpacity style={styles.fab} onPress={handleFabPress}>
          <View style={styles.fabContainer}>
            <Ionicons name="chatbox-ellipses" size={24} color="white" />
          </View>
        </TouchableOpacity>
      </Pressable>
    </SafeAreaView>

  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background.secondary,
  },
  blankContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
  },
  fab: {
    bottom: 12,
    position: 'absolute',
    right: 12,
  },
  fabContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.teal,
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  itemCount: {
    color: COLORS.teal,
    fontSize: 18,
    fontWeight: '400',
    left: 100,
  },
  loadingContainer: {
    alignItems: 'center',
    color: COLORS.teal,
    flex: 1,
    justifyContent: 'center',
  },
  selectedContactRow: {
    backgroundColor: COLORS.grey,
  },
  textContainer: {
    fontSize: 16,
  },
  trashBin: {
    color: COLORS.teal,
    right: 12,
  },
});

Chats.propTypes = {
  setUnreadCount: PropTypes.func,
};

export default Chats;