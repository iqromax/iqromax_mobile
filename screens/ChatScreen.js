import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Image, Modal } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../src/config/api';
import { LinearGradient } from 'expo-linear-gradient';

const getAvatarByName = (name) => {
  if (!name || typeof name !== 'string') return require('../assets/avatar_maks.png');
  const lower = name.toLowerCase();
  if (lower.includes('alex')) return require('../assets/avatar_alex.jpg');
  if (lower.includes('maks')) return require('../assets/avatar_maks.png');
  if (lower.includes('david')) return require('../assets/avatar_david.jpg');
  if (lower.includes('kevin')) return require('../assets/avatar_kevin.png');
  if (lower.includes('lily')) return require('../assets/avatar_lily.jpg');
  if (lower.includes('maya')) return require('../assets/avatar_maya.jpg');
  if (lower.includes('sophia')) return require('../assets/avatar_sophia.png');
  if (lower.includes('emma')) return require('../assets/avatar_emma.jpg');
  return require('../assets/avatar_maks.png');
};

const CHAT_TRANSLATIONS = {
  uz: { typeMessage: "Xabar yozing..." },
  en: { typeMessage: "Type a message..." },
  ru: { typeMessage: "Напишите сообщение..." },
  ar: { typeMessage: "اكتب رسالة..." },
  tr: { typeMessage: "Mesaj yazın..." },
  zh: { typeMessage: "输入消息..." },
  ky: { typeMessage: "Билдирүү жазыңыз..." },
  kk: { typeMessage: "Хабарлама жазыңыз..." },
  tg: { typeMessage: "Паём нависед..." },
  hi: { typeMessage: "एक संदेश टाइप करें..." },
  ur: { typeMessage: "ایک پیغام ٹائپ کریں..." }
};

export default function ChatScreen({ route, navigation }) {
  const insets = (typeof useSafeAreaInsets === 'function') ? useSafeAreaInsets() : { top: 40, bottom: 20, left: 0, right: 0 };
  const { friend } = route?.params || {};
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isClearModalVisible, setIsClearModalVisible] = useState(false);
  const socketRef = useRef(null);
  const flatListRef = useRef(null);

  useEffect(() => {
    let socket;
    const initChat = async () => {
      try {
        const userDataStr = await AsyncStorage.getItem('user_data');
        if (userDataStr) {
          const u = JSON.parse(userDataStr);
          setCurrentUser(u);

          // Fetch chat history
          const res = await fetch(`${API_URL}/chat/messages/${encodeURIComponent(u.customId)}/${encodeURIComponent(friend.customId)}`);
          if (res.ok) {
            const data = await res.json();
            setMessages(data);
          }

          // Connect Socket
          if (typeof io === 'function') {
            socket = io(SOCKET_URL, { 
              path: '/api/socket.io',
              transports: ['websocket'] 
            });
            socketRef.current = socket;

            socket.on('connect', () => {
              socket.emit('register', u.customId);
            });
          }

          socket.on('chat_message_received', (msg) => {
            if (
              (msg.senderId === u.customId && msg.receiverId === friend.customId) ||
              (msg.senderId === friend.customId && msg.receiverId === u.customId)
            ) {
              setMessages((prev) => [...prev, msg]);
              setTimeout(() => {
                flatListRef.current?.scrollToEnd({ animated: true });
              }, 100);
            }
          });
          socket.on('chat_cleared', (data) => {
            if (
              data.forEveryone &&
              ((data.requesterId === u.customId && data.targetId === friend.customId) ||
               (data.requesterId === friend.customId && data.targetId === u.customId))
            ) {
              setMessages([]);
            }
          });
        }
      } catch (e) {
        console.error('Chat init error:', e);
      } finally {
        setLoading(false);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 300);
      }
    };

    initChat();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [friend.customId]);

  const executeClearChat = async (forEveryone) => {
    try {
      if (!currentUser) return;
      const res = await fetch(`${API_URL}/chat/clear`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          requesterId: currentUser.customId,
          targetId: friend.customId,
          forEveryone
        })
      });
      if (res.ok) {
        setMessages([]);
      }
    } catch (e) {
      console.error('Error clearing chat:', e);
    }
  };

  const promptClearChat = () => {
    setIsClearModalVisible(true);
  };

  const handleSend = () => {
    if (!inputText.trim() || !currentUser || !socketRef.current) return;
    
    socketRef.current.emit('send_chat_message', {
      senderId: currentUser.customId,
      receiverId: friend.customId,
      content: inputText.trim()
    });

    setInputText('');
  };

  const renderMessage = ({ item }) => {
    const isMe = item.senderId === currentUser?.customId;
    return (
      <View style={[styles.messageRow, isMe ? styles.messageRowMe : styles.messageRowThem]}>
        {!isMe && (
          <Image source={getAvatarByName(friend.avatar)} style={styles.messageAvatar} />
        )}
        <View style={[styles.messageBubble, isMe ? styles.messageBubbleMe : styles.messageBubbleThem]}>
          <Text style={[styles.messageText, isMe ? styles.messageTextMe : styles.messageTextThem]}>{item.content}</Text>
          <Text style={[styles.messageTime, isMe ? styles.messageTimeMe : styles.messageTimeThem]}>
            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top }]} edges={['right', 'bottom', 'left']}>
      <KeyboardAvoidingView 
        style={styles.keyboardAvoid} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <LinearGradient colors={['#1A1A2E', '#05050C']} style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <MaterialCommunityIcons name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          <Image source={getAvatarByName(friend.avatar)} style={styles.headerAvatar} />
          <View style={styles.headerInfo}>
            <Text style={styles.headerName}>{friend.name}</Text>
            <Text style={styles.headerStatus}>{friend.customId}</Text>
          </View>
          <TouchableOpacity onPress={promptClearChat} style={styles.clearBtn}>
            <MaterialCommunityIcons name="trash-can-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </LinearGradient>

        {/* Chat Area */}
        <View style={styles.chatArea}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#A855F7" />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item, index) => item.id ? item.id.toString() : index.toString()}
              renderItem={renderMessage}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
              onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
              onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
            />
          )}
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder={CHAT_TRANSLATIONS[currentUser?.language]?.typeMessage || CHAT_TRANSLATIONS['uz'].typeMessage}
            placeholderTextColor="#6B7280"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendBtn, !inputText.trim() && styles.sendBtnDisabled]} 
            onPress={handleSend}
            disabled={!inputText.trim()}
          >
            <LinearGradient 
              colors={inputText.trim() ? ['#A855F7', '#7C3AED'] : ['#374151', '#1F2937']} 
              style={styles.sendBtnGradient}
            >
              <MaterialCommunityIcons name="send" size={20} color={inputText.trim() ? "#FFF" : "#9CA3AF"} style={{ marginLeft: 4 }} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Custom Clear Chat Modal */}
      <Modal visible={isClearModalVisible} transparent={true} animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconContainer}>
              <MaterialCommunityIcons name="trash-can-outline" size={32} color="#EF4444" />
            </View>
            <Text style={styles.modalTitle}>Xabarlarni o'chirish</Text>
            <Text style={styles.modalMessage}>
              <Text style={{ color: '#FFF', fontFamily: 'Inter_600SemiBold' }}>{friend.name}</Text> bilan barcha xabarlarni o'chirib tashlamoqchimisiz?
            </Text>
            
            <TouchableOpacity 
              style={[styles.modalBtn, { backgroundColor: 'rgba(239, 68, 68, 0.15)', borderWidth: 1, borderColor: 'rgba(239, 68, 68, 0.3)' }]}
              onPress={() => { setIsClearModalVisible(false); executeClearChat(true); }}
            >
              <Text style={[styles.modalBtnText, { color: '#EF4444' }]}>Men va {friend.name} uchun o'chirish</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.modalBtn}
              onPress={() => { setIsClearModalVisible(false); executeClearChat(false); }}
            >
              <Text style={styles.modalBtnText}>Mendan o'chirish</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.modalBtn, { backgroundColor: 'transparent', marginTop: 8 }]}
              onPress={() => setIsClearModalVisible(false)}
            >
              <Text style={[styles.modalBtnText, { color: '#9CA3AF' }]}>Bekor qilish</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  keyboardAvoid: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  backBtn: {
    marginRight: 12,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  headerInfo: {
    marginLeft: 12,
    flex: 1,
  },
  headerName: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  headerStatus: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
  },
  clearBtn: {
    padding: 8,
    marginLeft: 8,
  },
  chatArea: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-end',
  },
  messageRowMe: {
    justifyContent: 'flex-end',
  },
  messageRowThem: {
    justifyContent: 'flex-start',
  },
  messageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 8,
    marginBottom: 4,
  },
  messageBubble: {
    maxWidth: '75%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
  },
  messageBubbleMe: {
    backgroundColor: '#A855F7',
    borderBottomRightRadius: 4,
  },
  messageBubbleThem: {
    backgroundColor: '#1E1E2D',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  messageText: {
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    lineHeight: 22,
  },
  messageTextMe: {
    color: '#FFF',
  },
  messageTextThem: {
    color: '#E5E7EB',
  },
  messageTime: {
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  messageTimeMe: {
    color: 'rgba(255,255,255,0.7)',
  },
  messageTimeThem: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#0F0F1A',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)',
  },
  input: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 24,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 14,
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_500Medium',
    maxHeight: 120,
    minHeight: 48,
  },
  sendBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginLeft: 12,
    overflow: 'hidden',
  },
  sendBtnDisabled: {
    opacity: 0.8,
  },
  sendBtnGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#12121D',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  modalMessage: {
    color: '#9CA3AF',
    fontSize: 15,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  modalBtn: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBtnText: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
});
