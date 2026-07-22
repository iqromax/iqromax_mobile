import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { email: 'Your email', sendCode: 'Send code', errorTitle: 'Error', errEmail: 'Please enter your email', errNetwork: 'Failed to connect. Check internet.', dataProtected: 'Your data is reliably protected' },
  ru: { email: 'Ваш email', sendCode: 'Отправить код', errorTitle: 'Ошибка', errEmail: 'Пожалуйста, введите ваш email', errNetwork: 'Ошибка сети. Проверьте интернет.', dataProtected: 'Ваши данные надежно защищены' },
  uz: { email: 'Elektron pochtangiz', sendCode: 'Kodni yuborish', errorTitle: 'Xatolik', errEmail: 'Iltimos, emailingizni kiriting', errNetwork: 'Tarmoqqa ulanib bo\'lmadi. Internetni tekshiring.', dataProtected: 'Ma\'lumotlaringiz ishonchli himoyalangan' },
  ar: { email: 'بريدك الإلكتروني', sendCode: 'أرسل الرمز', errorTitle: 'خطأ', errEmail: 'يرجى إدخال بريدك الإلكتروني', errNetwork: 'فشل الاتصال. تحقق من الإنترنت.', dataProtected: 'بياناتك محمية بشكل موثوق' },
  tr: { email: 'E-posta adresiniz', sendCode: 'Kodu gönder', errorTitle: 'Hata', errEmail: 'Lütfen e-postanızı girin', errNetwork: 'Bağlantı başarısız. İnterneti kontrol edin.', dataProtected: 'Verileriniz güvenle korunmaktadır' },
  zh: { email: '你的电子邮箱', sendCode: '发送验证码', errorTitle: '错误', errEmail: '请输入您的电子邮箱', errNetwork: '连接失败。检查网络。', dataProtected: '您的数据受到可靠保护' },
  ky: { email: 'Электрондук почтаңыз', sendCode: 'Кодду жөнөтүү', errorTitle: 'Ката', errEmail: 'Электрондук почтаңызды киргизиңиз', errNetwork: 'Тармакка туташуу мүмкүн эмес. Интернетти текшериңиз.', dataProtected: 'Сиздин маалыматтар ишенимдүү корголгон' },
  kk: { email: 'Электрондық поштаңыз', sendCode: 'Кодты жіберу', errorTitle: 'Қате', errEmail: 'Электрондық поштаңызды енгізіңіз', errNetwork: 'Желіге қосылу мүмкін емес. Интернетті тексеріңіз.', dataProtected: 'Сіздің деректеріңіз сенімді қорғалған' },
  tg: { email: 'Почтаи электронии шумо', sendCode: 'Ирсоли рамз', errorTitle: 'Хатогӣ', errEmail: 'Лутфан почтаи электронии худро ворид кунед', errNetwork: 'Пайвастшавӣ ба шабака ноком шуд. Интернетро тафтиш кунед.', dataProtected: 'Маълумоти шумо эътимоднок ҳифз карда мешавад' },
  ja: { email: 'メールアドレス', sendCode: 'コードを送信', errorTitle: 'エラー', errEmail: 'メールアドレスを入力してください', errNetwork: '接続に失敗しました。インターネットを確認してください。', dataProtected: 'データは確実に保護されています' },
  ko: { email: '이메일 주소', sendCode: '코드 전송', errorTitle: '오류', errEmail: '이메일 주소를 입력해주세요', errNetwork: '네트워크 연결 실패. 인터넷을 확인하세요.', dataProtected: '데이터는 안전하게 보호됩니다' }
};

export default function ForgotPasswordScreen({ route, navigation }) {
  const { language = 'en' } = route.params || {};
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const handleSendCode = async () => {
    if (!email.trim()) {
      Alert.alert(t.errorTitle, t.errEmail);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/forgot-password-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), language })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        navigation.navigate('OtpScreen', { 
          email: email.trim(),
          isResetPassword: true,
          language
        });
      } else {
        Alert.alert(t.errorTitle, data.error || 'Server error');
      }
    } catch (error) {
      console.error('Forgot password error:', error);
      Alert.alert(t.errorTitle, t.errNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000214" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Hero Image */}
          <View style={styles.heroContainer}>
            <Image 
              source={require('../assets/forgot_password_hero.jpg')} 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Email Input */}
          <View style={styles.inputContainer}>
            <Feather name="mail" size={18} color="#888899" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.email}
              placeholderTextColor="#555566"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.spacer} />

          {/* Main Button */}
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleSendCode}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.sendButtonText}>{t.sendCode}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <MaterialCommunityIcons name="shield-check-outline" size={16} color="#22C55E" />
            <Text style={styles.footerText}>{t.dataProtected}</Text>
          </View>
          
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000214',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: Platform.OS === 'android' ? 0 : 10,
    paddingHorizontal: 15,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#0A0A16',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  heroContainer: {
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 30,
  },
  heroImage: {
    width: '100%',
    height: 380,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
  titleHighlight: {
    color: '#6D28D9', // Purple
  },
  subtitle: {
    color: '#888899',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 40,
    lineHeight: 22,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    height: 56,
    paddingHorizontal: 16,
    marginBottom: 30,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  spacer: {
    flex: 1,
    minHeight: 20,
  },
  sendButton: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  footerText: {
    color: '#555566',
    fontSize: 12,
    marginLeft: 6,
  },
});
