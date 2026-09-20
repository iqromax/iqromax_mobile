import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, KeyboardAvoidingView, Platform, ActivityIndicator, Image } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { io } from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../src/config/api';
import { LinearGradient } from 'expo-linear-gradient';

const getAvatarByName = (name) => {
  if (!name) return require('../assets/avatar_maks.png');
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

export default function ChatScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { friend } = route.params;
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
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
          socket = io(SOCKET_URL, { 
            path: '/api/socket.io',
            transports: ['websocket'] 
          });
          socketRef.current = socket;

          socket.on('connect', () => {
            socket.emit('register', u.customId);
          });

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
    <SafeAreaView style={[styles.container, { paddingTop: Platform.OS === 'android' ? insets.top : 0 }]} edges={['right', 'bottom', 'left']}>
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
            placeholder="Xabar yozing..."
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
});
