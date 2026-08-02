import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Share,
  Linking,
  Dimensions,
  ActivityIndicator,
  ImageBackground,
} from 'react-native';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { API_URL } from '../src/config/api';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

const TRANSLATIONS = {
  uz: {
    headerTitle: "Do'stlarni taklif qiling",
    infoTitle: "Har bir faol do'st uchun",
    rewardText: "+2 Energiya",
    infoSubtext: "Do'stingiz ushbu havola orqali ilovani yuklab, ro'yxatdan o'tishi kerak.",
    linkLabel: "Sizning shaxsiy havolangiz",
    qrSubtext: "Kamerani yo'naltiring (Scan)",
    quickShare: "Tezkor ulashish",
    historyTitle: "Taklif qilingan do'stlar",
    activeStatus: "✅ Faol (Tasdiqlangan)",
    waitingStatus: "⏳ Kutilmoqda",
    emptyText: "Hali hech kimni taklif qilmadingiz",
    emptySubtext: "Havolani ulashing va energiya oling!",
    shareMessage: "Men sizni IQROMAX ga taklif qilaman! Ushbu havola orqali ro'yxatdan o'ting va Bonus Energiya oling!\n\nKiring: ",
  },
  en: {
    headerTitle: "Invite Friends",
    infoTitle: "For every active friend",
    rewardText: "+2 Energy",
    infoSubtext: "Your friend must install and register using this link.",
    linkLabel: "Your personal link",
    qrSubtext: "Point the camera (Scan)",
    quickShare: "Quick Share",
    historyTitle: "Invited Friends",
    activeStatus: "✅ Active (Verified)",
    waitingStatus: "⏳ Waiting",
    emptyText: "You haven't invited anyone yet",
    emptySubtext: "Share the link and get energy!",
    shareMessage: "I invite you to IQROMAX! Register via this link and get Bonus Energy!\n\nJoin here: ",
  },
  ru: {
    headerTitle: "Пригласить друзей",
    infoTitle: "За каждого активного друга",
    rewardText: "+2 Энергия",
    infoSubtext: "Ваш друг должен установить приложение и зарегистрироваться по этой ссылке.",
    linkLabel: "Ваша личная ссылка",
    qrSubtext: "Наведите камеру (Скан)",
    quickShare: "Быстро поделиться",
    historyTitle: "Приглашенные друзья",
    activeStatus: "✅ Активен",
    waitingStatus: "⏳ Ожидание",
    emptyText: "Вы еще никого не пригласили",
    emptySubtext: "Поделитесь ссылкой и получите энергию!",
    shareMessage: "Приглашаю вас в IQROMAX! Зарегистрируйтесь по ссылке и получите Бонусную Энергию!\n\nПрисоединяйтесь: ",
  },
  ar: {
    headerTitle: "دعوة الأصدقاء",
    infoTitle: "لكل صديق نشط",
    rewardText: "+2 طاقة",
    infoSubtext: "يجب على صديقك التثبيت والتسجيل باستخدام هذا الرابط.",
    linkLabel: "رابطك الشخصي",
    qrSubtext: "وجّه الكاميرا (مسح)",
    quickShare: "مشاركة سريعة",
    historyTitle: "الأصدقاء المدعوون",
    activeStatus: "✅ نشط (مؤكد)",
    waitingStatus: "⏳ قيد الانتظار",
    emptyText: "لم تقم بدعوة أي شخص بعد",
    emptySubtext: "شارك الرابط واحصل على الطاقة!",
    shareMessage: "أدعوك إلى IQROMAX! سجل عبر هذا الرابط واحصل على طاقة إضافية!\n\nانضم هنا: "
  },
  tr: {
    headerTitle: "Arkadaşlarını Davet Et",
    infoTitle: "Her aktif arkadaş için",
    rewardText: "+2 Enerji",
    infoSubtext: "Arkadaşınız bu bağlantıyı kullanarak yükleyip kayıt olmalıdır.",
    linkLabel: "Kişisel bağlantınız",
    qrSubtext: "Kamerayı yöneltin (Tara)",
    quickShare: "Hızlı Paylaş",
    historyTitle: "Davet Edilen Arkadaşlar",
    activeStatus: "✅ Aktif (Doğrulandı)",
    waitingStatus: "⏳ Bekliyor",
    emptyText: "Henüz kimseyi davet etmediniz",
    emptySubtext: "Bağlantıyı paylaş ve enerji kazan!",
    shareMessage: "Seni IQROMAX'a davet ediyorum! Bu bağlantı ile kayıt ol ve Bonus Enerji kazan!\n\nBuradan katıl: "
  },
  zh: {
    headerTitle: "邀请好友",
    infoTitle: "对于每个活跃的好友",
    rewardText: "+2 能量",
    infoSubtext: "您的好友必须通过此链接安装并注册。",
    linkLabel: "您的个人链接",
    qrSubtext: "对准相机（扫描）",
    quickShare: "快速分享",
    historyTitle: "已邀请的好友",
    activeStatus: "✅ 活跃（已验证）",
    waitingStatus: "⏳ 等待中",
    emptyText: "您还没有邀请任何人",
    emptySubtext: "分享链接并获得能量！",
    shareMessage: "我邀请你加入 IQROMAX！通过此链接注册并获得奖励能量！\n\n在此加入："
  },
  ky: {
    headerTitle: "Досторду чакыруу",
    infoTitle: "Ар бир активдүү дос үчүн",
    rewardText: "+2 Энергия",
    infoSubtext: "Досуңуз ушул шилтеме аркылуу орнотуп, катталышы керек.",
    linkLabel: "Сиздин жеке шилтемеңиз",
    qrSubtext: "Камераны багыттаңыз (Скан)",
    quickShare: "Тез бөлүшүү",
    historyTitle: "Чакырылган достор",
    activeStatus: "✅ Активдүү",
    waitingStatus: "⏳ Күтүүдө",
    emptyText: "Сиз эч кимди чакыра элексиз",
    emptySubtext: "Шилтеме менен бөлүшүп, энергия алыңыз!",
    shareMessage: "Мен сени IQROMAXка чакырам! Бул шилтеме аркылуу катталып, Бонус Энергия ал!\n\nБул жерден кошул: "
  },
  kk: {
    headerTitle: "Достарды шақыру",
    infoTitle: "Әрбір белсенді дос үшін",
    rewardText: "+2 Энергия",
    infoSubtext: "Досыңыз осы сілтеме арқылы орнатып, тіркелуі керек.",
    linkLabel: "Сіздің жеке сілтемеңіз",
    qrSubtext: "Камераны бағыттаңыз (Скан)",
    quickShare: "Жылдам бөлісу",
    historyTitle: "Шақырылған достар",
    activeStatus: "✅ Белсенді",
    waitingStatus: "⏳ Күтуде",
    emptyText: "Сіз әлі ешкімді шақырмадыңыз",
    emptySubtext: "Сілтемемен бөлісіп, энергия алыңыз!",
    shareMessage: "Мен сені IQROMAX-қа шақырамын! Осы сілтеме арқылы тіркеліп, Бонус Энергия ал!\n\nОсында қосыл: "
  },
  tg: {
    headerTitle: "Даъвати дӯстон",
    infoTitle: "Барои ҳар як дӯсти фаъол",
    rewardText: "+2 Энергия",
    infoSubtext: "Дӯсти шумо бояд тавассути ин истинод насб ва сабти ном кунад.",
    linkLabel: "Истиноди шахсии шумо",
    qrSubtext: "Камераро равона кунед (Скан)",
    quickShare: "Мубодилаи зуд",
    historyTitle: "Дӯстони даъватшуда",
    activeStatus: "✅ Фаъол",
    waitingStatus: "⏳ Дар интизорӣ",
    emptyText: "Шумо то ҳол касеро даъват накардаед",
    emptySubtext: "Истинодро мубодила кунед ва энергия гиред!",
    shareMessage: "Ман шуморо ба IQROMAX даъват мекунам! Тавассути ин истинод сабти ном кунед ва Бонус Энергия гиред!\n\nДар ин ҷо ҳамроҳ шавед: "
  },
  ja: {
    headerTitle: "友達を招待",
    infoTitle: "アクティブな友達ごとに",
    rewardText: "+2 エネルギー",
    infoSubtext: "友達はこのリンクを使用してインストールして登録する必要があります。",
    linkLabel: "あなたの個人リンク",
    qrSubtext: "カメラを向ける（スキャン）",
    quickShare: "クイック共有",
    historyTitle: "招待された友達",
    activeStatus: "✅ アクティブ",
    waitingStatus: "⏳ 待機中",
    emptyText: "まだ誰も招待していません",
    emptySubtext: "リンクを共有してエネルギーをゲットしましょう！",
    shareMessage: "IQROMAXに招待します！このリンクから登録してボーナスエネルギーをゲットしましょう！\n\nここから参加: "
  },
  ko: {
    headerTitle: "친구 초대",
    infoTitle: "활동적인 친구마다",
    rewardText: "+2 에너지",
    infoSubtext: "친구가 이 링크를 사용하여 설치하고 가입해야 합니다.",
    linkLabel: "귀하의 개인 링크",
    qrSubtext: "카메라 향하기 (스캔)",
    quickShare: "빠른 공유",
    historyTitle: "초대받은 친구",
    activeStatus: "✅ 활동",
    waitingStatus: "⏳ 대기 중",
    emptyText: "아직 아무도 초대하지 않았습니다",
    emptySubtext: "링크를 공유하고 에너지를 받으세요!",
    shareMessage: "IQROMAX에 초대합니다! 이 링크를 통해 가입하고 보너스 에너지를 받으세요!\n\n여기에서 가입: "
  }
};

export default function ReferralScreen({ navigation }) {
  const [lang, setLang] = useState('uz');
  const [referralLink, setReferralLink] = useState('https://iqromax.net/r/IQX000000');
  const [copied, setCopied] = useState(false);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const dataStr = await AsyncStorage.getItem('user_data');
      if (dataStr) {
        const data = JSON.parse(dataStr);
        if (data.language) setLang(data.language);
        
        const idNumber = String(data.customId || data.id || '000000').replace(/[^0-9]/g, '');
        const refId = `IQX${idNumber}`;
        setReferralLink(`https://iqromax.net/r/${refId}`);
        
        fetchHistory(data.customId);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const fetchHistory = async (customId) => {
    try {
      const res = await fetch(`${API_URL}/referrals/${encodeURIComponent(customId)}`);
      if (res.ok) {
        const data = await res.json();
        setHistory(data);
      }
    } catch (error) {
      console.log('Failed to fetch referrals', error);
    } finally {
      setIsLoading(false);
    }
  };

  const t = TRANSLATIONS[lang] || TRANSLATIONS['en'];

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLink = async () => {
    try {
      await Share.share({
        message: `${t.shareMessage}${referralLink}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const openApp = (appUrl, fallbackUrl) => {
    Linking.canOpenURL(appUrl).then((supported) => {
      if (supported) {
        Linking.openURL(appUrl);
      } else {
        Linking.openURL(fallbackUrl);
      }
    });
  };

  const shareTelegram = () => {
    const text = `${t.shareMessage}${referralLink}`;
    openApp(`tg://msg?text=${encodeURIComponent(text)}`, `https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(text)}`);
  };

  const shareWhatsApp = () => {
    const text = `${t.shareMessage}${referralLink}`;
    openApp(`whatsapp://send?text=${encodeURIComponent(text)}`, `https://wa.me/?text=${encodeURIComponent(text)}`);
  };

  const renderHistoryItem = (item) => {
    const isActive = item.status === 'ACTIVE';
    return (
      <View key={item.id} style={styles.historyCard}>
        <View style={styles.historyLeft}>
          <View style={[styles.historyAvatar, { backgroundColor: isActive ? '#10B98120' : '#4B556320' }]}>
            <Ionicons name="person" size={20} color={isActive ? "#10B981" : "#9CA3AF"} />
          </View>
          <View>
            <Text style={styles.historyName}>{item.name}</Text>
            <Text style={styles.historyStatusText}>
              {isActive ? t.activeStatus : t.waitingStatus}
            </Text>
          </View>
        </View>
        {item.reward !== '-' ? (
          <Text style={styles.historyReward}>{item.reward}</Text>
        ) : (
          <MaterialCommunityIcons name="clock-outline" size={20} color="#9CA3AF" />
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />

      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
          <Ionicons name="chevron-back" size={24} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t.headerTitle}</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Modern Solid Card (No Glows) */}
        <View style={styles.solidCard}>
          <View style={styles.cardTopRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons name="gift" size={24} color="#FFF" />
            </View>
            <View style={styles.rewardContainer}>
              <Text style={styles.rewardTitle}>{t.rewardText}</Text>
              <Text style={styles.rewardSubtitle}>{t.infoTitle}</Text>
            </View>
          </View>
          
          <Text style={styles.instructionsText}>
            {t.infoSubtext}
          </Text>

          {/* Link Section */}
          <Text style={styles.linkLabel}>{t.linkLabel}</Text>
          <View style={styles.linkContainer}>
            <TouchableOpacity 
              style={styles.linkBox} 
              onPress={() => Linking.openURL(referralLink)}
              activeOpacity={0.7}
            >
              <Text style={styles.linkText} numberOfLines={1} ellipsizeMode="middle">
                {referralLink}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.copyBtn} onPress={copyToClipboard} activeOpacity={0.8}>
              {copied ? (
                <Ionicons name="checkmark" size={20} color="#000" />
              ) : (
                <Ionicons name="copy-outline" size={20} color="#000" />
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* Action Blocks */}
        <View style={styles.actionSection}>
          {/* QR Block */}
          <View style={styles.qrBlock}>
            <View style={styles.qrWrapper}>
              <QRCode
                value={referralLink}
                size={85}
                color="#000"
                backgroundColor="#FFF"
              />
            </View>
            <Text style={styles.qrLabel}>{t.qrSubtext}</Text>
          </View>

          {/* Socials Block */}
          <View style={styles.socialBlock}>
            <Text style={styles.socialLabel}>{t.quickShare}</Text>
            <View style={styles.socialRow}>
              <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#2CA5E0' }]} onPress={shareTelegram} activeOpacity={0.9}>
                <FontAwesome5 name="telegram-plane" size={22} color="#FFF" />
              </TouchableOpacity>
              
              <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#25D366' }]} onPress={shareWhatsApp} activeOpacity={0.9}>
                <FontAwesome5 name="whatsapp" size={24} color="#FFF" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.socialBtn, { backgroundColor: '#374151' }]} onPress={shareLink} activeOpacity={0.9}>
                <Ionicons name="share-social" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>{t.historyTitle}</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{history.length}</Text>
            </View>
          </View>

          <View style={styles.historyList}>
            {isLoading ? (
              <ActivityIndicator color="#A855F7" style={{ marginVertical: 30 }} />
            ) : history.length > 0 ? (
              history.map(renderHistoryItem)
            ) : (
              <View style={styles.emptyState}>
                <View style={styles.emptyIconBg}>
                  <Ionicons name="people-outline" size={32} color="#9CA3AF" />
                </View>
                <Text style={styles.emptyText}>{t.emptyText}</Text>
                <Text style={styles.emptySubtext}>{t.emptySubtext}</Text>
              </View>
            )}
          </View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 17,
    fontFamily: 'Inter_600SemiBold',
    fontWeight: '600',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 10,
  },
  solidCard: {
    backgroundColor: '#111827',
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#374151',
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    backgroundColor: '#8B5CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  rewardContainer: {
    flex: 1,
  },
  rewardTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Inter_700Bold',
  },
  rewardSubtitle: {
    color: '#9CA3AF',
    fontSize: 13,
    marginTop: 2,
  },
  instructionsText: {
    color: '#D1D5DB',
    fontSize: 14,
    lineHeight: 22,
    marginBottom: 24,
  },
  linkLabel: {
    color: '#9CA3AF',
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 8,
    marginLeft: 4,
  },
  linkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkBox: {
    flex: 1,
    backgroundColor: '#1F2937',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#374151',
    borderRightWidth: 0,
  },
  linkText: {
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  copyBtn: {
    backgroundColor: '#E5E7EB',
    borderTopRightRadius: 14,
    borderBottomRightRadius: 14,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionSection: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 30,
  },
  qrBlock: {
    flex: 0.8,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  qrWrapper: {
    backgroundColor: '#FFF',
    padding: 6,
    borderRadius: 12,
    marginBottom: 10,
  },
  qrLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
  },
  socialBlock: {
    flex: 1.2,
    backgroundColor: '#111827',
    borderRadius: 20,
    padding: 20,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#374151',
  },
  socialLabel: {
    color: '#E5E7EB',
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 16,
    textAlign: 'center',
  },
  socialRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  socialBtn: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  divider: {
    height: 1,
    backgroundColor: '#1F2937',
    marginBottom: 30,
  },
  historySection: {
    marginBottom: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  historyTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    fontWeight: 'bold',
  },
  countBadge: {
    backgroundColor: '#1F2937',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  countText: {
    color: '#D1D5DB',
    fontWeight: '600',
    fontSize: 13,
  },
  historyList: {
    gap: 12,
  },
  historyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#111827',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#1F2937',
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  historyAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  historyName: {
    color: '#F9FAFB',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyStatusText: {
    color: '#9CA3AF',
    fontSize: 12,
  },
  historyReward: {
    color: '#FBBF24',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    fontWeight: '700',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
    backgroundColor: '#111827',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1F2937',
    borderStyle: 'dashed',
  },
  emptyIconBg: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#1F2937',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyText: {
    color: '#D1D5DB',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  emptySubtext: {
    color: '#6B7280',
    fontSize: 13,
  },
});
