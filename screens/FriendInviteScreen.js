import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Platform,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import io from 'socket.io-client';
import { API_URL, SOCKET_URL } from '../src/config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TRANSLATIONS = {
  uz: {
    headerTitle: "Do'st bilan battle",
    step1: "ID orqali taklif",
    step2: "Do'st qabul qildi",
    step3: "Battle boshlash",
    mainTitle: "Do'stingizni ID orqali taklif qiling",
    subTitle: "Do'stingizning IQROMAX ID sini kiriting\nva battle taklifini yuboring!",
    inputLabel: "Do'stingizning ID sini kiriting",
    inputPlaceholder: "ID ni kiriting",
    searching: "Qidirilmoqda...",
    inviteSent: "Taklif yuborildi (Kutilmoqda...)",
    sendInvite: "Battle taklifini yuborish",
    searchFriend: "Do'stingizni qidiring",
    searchSub: "ID kiriting, topilgan do'stingiz\nshu yerda paydo bo'ladi",
    infoTitle: "ID ni qayerdan topish mumkin?",
    infoDesc: "ID ni profilingiz sahifasidan topishingiz mumkin."
  },
  en: {
    headerTitle: "Battle with a Friend",
    step1: "Invite via ID",
    step2: "Friend accepted",
    step3: "Start Battle",
    mainTitle: "Invite your friend via ID",
    subTitle: "Enter your friend's IQROMAX ID\nand send a battle invite!",
    inputLabel: "Enter your friend's ID",
    inputPlaceholder: "Enter ID",
    searching: "Searching...",
    inviteSent: "Invite sent (Waiting...)",
    sendInvite: "Send battle invite",
    searchFriend: "Search for a friend",
    searchSub: "Enter ID, the found friend\nwill appear here",
    infoTitle: "Where to find the ID?",
    infoDesc: "You can find your ID on your profile page."
  },
  ru: {
    headerTitle: "Баттл с другом",
    step1: "Пригласить по ID",
    step2: "Друг принял",
    step3: "Начать баттл",
    mainTitle: "Пригласите друга по ID",
    subTitle: "Введите IQROMAX ID друга\nи отправьте приглашение на баттл!",
    inputLabel: "Введите ID вашего друга",
    inputPlaceholder: "Введите ID",
    searching: "Поиск...",
    inviteSent: "Приглашение отправлено (Ожидание...)",
    sendInvite: "Отправить приглашение",
    searchFriend: "Поиск друга",
    searchSub: "Введите ID, найденный друг\nпоявится здесь",
    infoTitle: "Где найти ID?",
    infoDesc: "Вы можете найти ID на странице вашего профиля."
  },
  ar: {
    headerTitle: "معركة مع صديق",
    step1: "دعوة عبر ID",
    step2: "صديق قبل",
    step3: "بدء المعركة",
    mainTitle: "ادعُ صديقك عبر الـ ID",
    subTitle: "أدخل IQROMAX ID لصديقك\nوأرسل دعوة للمعركة!",
    inputLabel: "أدخل ID الخاص بصديقك",
    inputPlaceholder: "أدخل ID",
    searching: "جاري البحث...",
    inviteSent: "تم إرسال الدعوة (قيد الانتظار...)",
    sendInvite: "إرسال دعوة المعركة",
    searchFriend: "ابحث عن صديق",
    searchSub: "أدخل ID، الصديق الذي تم العثور عليه\nسيظهر هنا",
    infoTitle: "أين تجد الـ ID؟",
    infoDesc: "يمكنك العثور على الـ ID الخاص بك في صفحة ملفك الشخصي."
  },
  tr: {
    headerTitle: "Arkadaşla Savaş",
    step1: "ID ile Davet Et",
    step2: "Arkadaş kabul etti",
    step3: "Savaşı Başlat",
    mainTitle: "Arkadaşınızı ID ile davet edin",
    subTitle: "Arkadaşınızın IQROMAX ID'sini girin\nve savaş daveti gönderin!",
    inputLabel: "Arkadaşınızın ID'sini girin",
    inputPlaceholder: "ID Girin",
    searching: "Aranıyor...",
    inviteSent: "Davet gönderildi (Bekleniyor...)",
    sendInvite: "Savaş daveti gönder",
    searchFriend: "Bir arkadaş ara",
    searchSub: "ID girin, bulunan arkadaş\nburada görünecek",
    infoTitle: "ID nereden bulunur?",
    infoDesc: "ID'nizi profil sayfanızda bulabilirsiniz."
  },
  zh: {
    headerTitle: "与朋友对战",
    step1: "通过ID邀请",
    step2: "朋友已接受",
    step3: "开始对战",
    mainTitle: "通过ID邀请您的朋友",
    subTitle: "输入您朋友的IQROMAX ID\n并发送对战邀请！",
    inputLabel: "输入朋友的ID",
    inputPlaceholder: "输入ID",
    searching: "搜索中...",
    inviteSent: "邀请已发送（等待中...）",
    sendInvite: "发送对战邀请",
    searchFriend: "搜索朋友",
    searchSub: "输入ID，找到的朋友\n将显示在这里",
    infoTitle: "在哪里可以找到ID？",
    infoDesc: "您可以在您的个人资料页面上找到您的ID。"
  },
  ky: {
    headerTitle: "Дос менен баттл",
    step1: "ID аркылуу чакыруу",
    step2: "Дос кабыл алды",
    step3: "Баттлды баштоо",
    mainTitle: "Досуңузду ID аркылуу чакырыңыз",
    subTitle: "Досуңуздун IQROMAX IDсин киргизиңиз\nжана баттлга чакыруу жөнөтүңүз!",
    inputLabel: "Досуңуздун IDсин киргизиңиз",
    inputPlaceholder: "ID киргизиңиз",
    searching: "Издөө...",
    inviteSent: "Чакыруу жөнөтүлдү (Күтүлүүдө...)",
    sendInvite: "Баттлга чакыруу жөнөтүү",
    searchFriend: "Досуңузду издеңиз",
    searchSub: "ID киргизиңиз, табылган дос\nушул жерде пайда болот",
    infoTitle: "IDни кайдан тапса болот?",
    infoDesc: "IDни профилиңиздин барагынан таба аласыз."
  },
  kk: {
    headerTitle: "Доспен баттл",
    step1: "ID арқылы шақыру",
    step2: "Дос қабылдады",
    step3: "Баттлды бастау",
    mainTitle: "Досыңызды ID арқылы шақырыңыз",
    subTitle: "Досыңыздың IQROMAX ID-ін енгізіңіз\nжәне баттлға шақыру жіберіңіз!",
    inputLabel: "Досыңыздың ID-ін енгізіңіз",
    inputPlaceholder: "ID енгізіңіз",
    searching: "Ізделуде...",
    inviteSent: "Шақыру жіберілді (Күтілуде...)",
    sendInvite: "Баттлға шақыру жіберу",
    searchFriend: "Досыңызды іздеңіз",
    searchSub: "ID енгізіңіз, табылған дос\nосында пайда болады",
    infoTitle: "ID-ді қайдан табуға болады?",
    infoDesc: "ID-ді профиліңіздің парақшасынан таба аласыз."
  },
  tg: {
    headerTitle: "Баттл бо дӯст",
    step1: "Даъват тавассути ID",
    step2: "Дӯст қабул кард",
    step3: "Оғози баттл",
    mainTitle: "Дӯсти худро бо ID даъват кунед",
    subTitle: "ID IQROMAX-и дӯсти худро ворид кунед\nва даъвати баттл фиристед!",
    inputLabel: "ID-и дӯстатонро ворид кунед",
    inputPlaceholder: "ID-ро ворид кунед",
    searching: "Ҷустуҷӯ...",
    inviteSent: "Даъватнома фиристода шуд (Интизорӣ...)",
    sendInvite: "Даъватномаи баттл фиристед",
    searchFriend: "Дӯстро ҷустуҷӯ кунед",
    searchSub: "ID-ро ворид кунед, дӯсти ёфтшуда\nдар ин ҷо пайдо мешавад",
    infoTitle: "ID-ро аз куҷо ёфтан мумкин аст?",
    infoDesc: "Шумо метавонед ID-и худро дар саҳифаи профили худ пайдо кунед."
  },
  ja: {
    headerTitle: "友達とのバトル",
    step1: "IDで招待",
    step2: "友達が承認",
    step3: "バトル開始",
    mainTitle: "IDで友達を招待",
    subTitle: "友達のIQROMAX IDを入力して\nバトルの招待を送ろう！",
    inputLabel: "友達のIDを入力",
    inputPlaceholder: "IDを入力",
    searching: "検索中...",
    inviteSent: "招待送信済み (待機中...)",
    sendInvite: "バトル招待を送る",
    searchFriend: "友達を探す",
    searchSub: "IDを入力すると、見つかった友達が\nここに表示されます",
    infoTitle: "IDはどこにありますか？",
    infoDesc: "プロフィールページにIDが表示されています。"
  },
  ko: {
    headerTitle: "친구와 배틀",
    step1: "ID로 초대",
    step2: "친구 수락함",
    step3: "배틀 시작",
    mainTitle: "ID로 친구 초대",
    subTitle: "친구의 IQROMAX ID를 입력하고\n배틀 초대를 보내세요!",
    inputLabel: "친구 ID 입력",
    inputPlaceholder: "ID 입력",
    searching: "검색 중...",
    inviteSent: "초대 발송됨 (대기 중...)",
    sendInvite: "배틀 초대 보내기",
    searchFriend: "친구 찾기",
    searchSub: "ID를 입력하면, 찾은 친구가\n여기에 표시됩니다",
    infoTitle: "ID는 어디에서 찾을 수 있나요?",
    infoDesc: "프로필 페이지에서 ID를 확인할 수 있습니다."
  }
};

const FriendInviteScreen = ({ navigation, route }) => {
  const [friendId, setFriendId] = useState('');
  const [isInfoExpanded, setIsInfoExpanded] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isInviteSent, setIsInviteSent] = useState(false);
  const inviteLink = 'iqromax.app/battle/invite/IQX567890';
  
  const { language = 'uz' } = route?.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      <KeyboardAvoidingView 
        style={{ flex: 1 }} 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t.headerTitle}</Text>
          <View style={{ width: 44 }} />
        </View>

        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Stepper */}
          <View style={styles.stepperContainer}>
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepActive]}>
                <Text style={styles.stepTextActive}>1</Text>
              </View>
              <Text style={styles.stepLabelActive}>{t.step1}</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepInactive]}>
                <Text style={styles.stepTextInactive}>2</Text>
              </View>
              <Text style={styles.stepLabelInactive}>{t.step2}</Text>
            </View>
            <View style={styles.stepLine} />
            <View style={styles.stepItem}>
              <View style={[styles.stepCircle, styles.stepInactive]}>
                <Text style={styles.stepTextInactive}>3</Text>
              </View>
              <Text style={styles.stepLabelInactive}>{t.step3}</Text>
            </View>
          </View>

          {/* Central Image/Icon Area */}
          <View style={styles.heroContainer}>
            {/* Decorative background glows can be simulated with nested views */}
            <View style={styles.glowCircle} />
            <MaterialCommunityIcons name="account-search" size={90} color="#A855F7" style={styles.heroIcon} />
            <MaterialCommunityIcons name="lightning-bolt" size={40} color="rgba(168, 85, 247, 0.3)" style={styles.lightningLeft} />
            <MaterialCommunityIcons name="lightning-bolt" size={40} color="rgba(168, 85, 247, 0.3)" style={styles.lightningRight} />
          </View>

          <View style={styles.titlesContainer}>
            <Text style={styles.mainTitle}>{t.mainTitle}</Text>
            <Text style={styles.subTitle}>{t.subTitle}</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{t.inputLabel}</Text>
            <View style={styles.inputRow}>
              <View style={styles.inputContainer}>
                <View style={styles.inputIconWrapper}>
                  <MaterialCommunityIcons name="account" size={20} color="#FFF" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder={t.inputPlaceholder}
                  placeholderTextColor="#6B7280"
                  keyboardType="number-pad"
                  value={friendId}
                  onFocus={() => {
                    if (friendId.length === 0 || friendId === '') {
                      setFriendId('#');
                    }
                  }}
                  onChangeText={async (text) => {
                    setIsInviteSent(false);
                    const cleaned = text.replace(/[^0-9]/g, '');
                    const formatted = cleaned.length > 0 ? `#${cleaned}` : '#';
                    setFriendId(formatted);
                    if (formatted.length >= 5 && cleaned.length >= 4) {
                      setIsSearching(true);
                      try {
                        const encodedText = encodeURIComponent(formatted);
                        const res = await fetch(`${API_URL}/users/search/${encodedText}`);
                        if (res.ok) {
                          const text = await res.text();
                          if (!text || !text.trim().startsWith('{')) {
                            setFoundUser(null);
                            return;
                          }
                          const data = JSON.parse(text);
                          const userDataStr = await AsyncStorage.getItem('user_data');
                          const currentUser = userDataStr ? JSON.parse(userDataStr) : null;
                          const myId = String(currentUser?.id || '').trim();
                          const myCustomId = String(currentUser?.customId || '').replace(/^#+/, '').trim().toUpperCase();
                          const foundId = String(data?.id || '').trim();
                          const foundCustomId = String(data?.customId || '').replace(/^#+/, '').trim().toUpperCase();

                          if ((myId && foundId && myId === foundId) || (myCustomId && foundCustomId && myCustomId === foundCustomId)) {
                            setFoundUser(null);
                          } else {
                            setFoundUser({
                              id: data.id,
                              name: data.name,
                              level: data.level || 1,
                              rating: data.rating || 1000,
                              avatar: data.avatar && data.avatar.startsWith('http') ? { uri: data.avatar } : require('../assets/avatar_alex.jpg'),
                            });
                          }
                        } else {
                          setFoundUser(null);
                        }
                      } catch (error) {
                        console.error('Search error:', error);
                        setFoundUser(null);
                      } finally {
                        setIsSearching(false);
                      }
                    } else {
                      setFoundUser(null);
                      setIsSearching(false);
                    }
                  }}
                />
                {friendId.length > 0 && friendId !== '#' && (
                  <TouchableOpacity onPress={() => { setFriendId(''); setFoundUser(null); setIsInviteSent(false); }}>
                    <MaterialCommunityIcons name="close-circle" size={20} color="#6B7280" />
                  </TouchableOpacity>
                )}
              </View>
              <TouchableOpacity style={styles.sendLinkBtn}>
                <MaterialCommunityIcons name="send" size={24} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Search State / User Card */}
          {isSearching ? (
            <View style={styles.searchStateCard}>
              <ActivityIndicator size="large" color="#A855F7" style={{ marginBottom: 15 }} />
              <Text style={styles.searchStateTitle}>{t.searching}</Text>
            </View>
          ) : foundUser ? (
            <View style={styles.userCard}>
              <View style={styles.userInfoRow}>
                <Image source={foundUser.avatar} style={styles.userAvatar} contentFit="cover" />
                <View style={styles.userDetails}>
                  <Text style={styles.userName}>{foundUser.name}</Text>
                  <Text style={styles.userIdText}>ID: #{String(foundUser?.id || '0000').replace(/^#+/, '')}</Text>
                  <View style={styles.userStatsRow}>
                    <View style={styles.statBadge}>
                      <MaterialCommunityIcons name="star" size={14} color="#FBBF24" />
                      <Text style={styles.statText}>{foundUser.level} lvl</Text>
                    </View>
                    <View style={[styles.statBadge, { backgroundColor: 'rgba(59, 130, 246, 0.2)' }]}>
                      <MaterialCommunityIcons name="trophy" size={14} color="#3B82F6" />
                      <Text style={[styles.statText, { color: '#3B82F6' }]}>{foundUser.rating}</Text>
                    </View>
                  </View>
                </View>
              </View>
              <TouchableOpacity 
                style={[styles.inviteButton, isInviteSent && { backgroundColor: '#4B5563', shadowOpacity: 0 }]} 
                disabled={isInviteSent}
                onPress={async () => {
                const userDataStr = await AsyncStorage.getItem('user_data');
                const userData = userDataStr ? JSON.parse(userDataStr) : null;
                const socket = io(SOCKET_URL, { 
                  path: '/api/socket.io',
                  transports: ['websocket'] 
                });
                socket.emit('send_battle_invite', {
                  senderId: userData?.customId || 'NOMA\'LUM',
                  targetId: foundUser.id,
                  senderName: userData?.name || 'Foydalanuvchi',
                  senderAvatar: userData?.character ? `https://api.dicebear.com/7.x/avataaars/png?seed=${userData.name}` : null,
                  level: 1,
                  rating: 1000
                });
                setIsInviteSent(true);
              }}>
                <Text style={styles.inviteButtonText}>{isInviteSent ? t.inviteSent : t.sendInvite}</Text>
                {!isInviteSent ? (
                  <MaterialCommunityIcons name="sword-cross" size={18} color="#FFF" style={{ marginLeft: 8 }} />
                ) : (
                  <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" style={{ marginLeft: 8 }} />
                )}
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.searchStateCard}>
              <MaterialCommunityIcons name="magnify" size={60} color="rgba(255, 255, 255, 0.2)" />
              <Text style={styles.searchStateTitle}>{t.searchFriend}</Text>
              <Text style={styles.searchStateSub}>{t.searchSub}</Text>
            </View>
          )}

          {/* Bottom Info Card */}
          <TouchableOpacity 
            style={styles.infoCard}
            onPress={() => setIsInfoExpanded(!isInfoExpanded)}
            activeOpacity={0.8}
          >
            <View style={styles.infoIconBox}>
              <MaterialCommunityIcons name="lightbulb-on" size={24} color="#A855F7" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoTitle}>{t.infoTitle}</Text>
              {isInfoExpanded && (
                <Text style={styles.infoDesc}>{t.infoDesc}</Text>
              )}
            </View>
            <MaterialCommunityIcons 
              name={isInfoExpanded ? "chevron-up" : "chevron-down"} 
              size={24} 
              color="#A855F7" 
            />
          </TouchableOpacity>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
  },
  helpButton: {
    width: 44,
    height: 44,
    borderRadius: 16,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 30,
  },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  stepActive: {
    backgroundColor: '#A855F7',
  },
  stepInactive: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#4B5563',
  },
  stepTextActive: {
    color: '#FFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepTextInactive: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: 'bold',
  },
  stepLabelActive: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '600',
  },
  stepLabelInactive: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '600',
  },
  stepLine: {
    height: 1,
    flex: 1,
    backgroundColor: '#374151',
    marginHorizontal: 8,
  },
  heroContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 180,
    marginBottom: 20,
    position: 'relative',
  },
  glowCircle: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
    borderWidth: 2,
    borderColor: 'rgba(168, 85, 247, 0.5)',
  },
  heroIcon: {
    zIndex: 2,
  },
  lightningLeft: {
    position: 'absolute',
    left: '20%',
    top: '30%',
    transform: [{ rotate: '-15deg' }],
  },
  lightningRight: {
    position: 'absolute',
    right: '20%',
    top: '30%',
    transform: [{ rotate: '15deg' }],
  },
  titlesContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  mainTitle: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  subTitle: {
    color: '#9CA3AF',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.5)',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 56,
    marginRight: 12,
  },
  inputIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  textInput: {
    flex: 1,
    color: '#FFF',
    fontSize: 14,
  },
  sendLinkBtn: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#7C3AED',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 30,
  },
  linkIconBox: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  linkContent: {
    flex: 1,
  },
  linkTitle: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  linkText: {
    color: '#A855F7',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  linkDesc: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  copyBtn: {
    padding: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(168, 85, 247, 0.3)',
    borderStyle: 'dashed',
  },
  dividerText: {
    color: '#A855F7',
    paddingHorizontal: 16,
    fontWeight: 'bold',
  },
  dividerSubtext: {
    color: '#9CA3AF',
    textAlign: 'center',
    fontSize: 12,
    marginBottom: 20,
  },
  searchStateCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 20,
  },
  searchStateTitle: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 8,
  },
  searchStateSub: {
    color: '#6B7280',
    fontSize: 13,
    textAlign: 'center',
    lineHeight: 18,
  },
  userCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  userAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#1F2937',
    marginRight: 16,
    borderWidth: 2,
    borderColor: '#A855F7',
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userIdText: {
    color: '#9CA3AF',
    fontSize: 13,
    marginBottom: 8,
  },
  userStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(251, 191, 36, 0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  statText: {
    color: '#FBBF24',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  inviteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#A855F7',
    borderRadius: 16,
    paddingVertical: 16,
  },
  inviteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
  },
  infoIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  infoDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    lineHeight: 16,
  },
});

export default FriendInviteScreen;
