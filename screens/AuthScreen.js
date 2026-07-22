import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Animated, Alert, ActivityIndicator } from 'react-native';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { 
    createAccount: 'Create account', login: 'Login', fullName: 'Your name', phone: 'Your phone number',
    email: 'Your email', password: 'Your password', confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot password?', dataProtected: 'Your data is reliably protected',
    orContinue: 'or continue with', errFillFields: 'Please fill all fields!', errPassMatch: 'Passwords do not match!',
    errPhonePass: 'Please enter phone number and password!', errServer: 'Server error occurred',
    errNetwork: 'Failed to connect. Check internet.', errLogin: 'Login failed', errorTitle: 'Error'
  },
  ru: { 
    createAccount: 'Создать аккаунт', login: 'Войти', fullName: 'Ваше имя', phone: 'Ваш номер телефона',
    email: 'Ваш email', password: 'Ваш пароль', confirmPassword: 'Подтвердите пароль',
    forgotPassword: 'Забыли пароль?', dataProtected: 'Ваши данные надежно защищены',
    orContinue: 'или продолжите через', errFillFields: 'Пожалуйста, заполните все поля!', errPassMatch: 'Пароли не совпадают!',
    errPhonePass: 'Введите номер телефона и пароль!', errServer: 'Произошла ошибка сервера',
    errNetwork: 'Ошибка сети. Проверьте интернет.', errLogin: 'Ошибка входа', errorTitle: 'Ошибка'
  },
  uz: { 
    createAccount: 'Akkaunt yaratish', login: 'Kirish', fullName: 'Ismingiz', phone: 'Telefon raqamingiz',
    email: 'Elektron pochtangiz', password: 'Parolingiz', confirmPassword: 'Parolni tasdiqlang',
    forgotPassword: 'Parolni unutdingizmi?', dataProtected: 'Ma\'lumotlaringiz ishonchli himoyalangan',
    orContinue: 'yoki quyidagilar orqali davom eting', errFillFields: 'Iltimos, barcha maydonlarni to\'ldiring!', errPassMatch: 'Parollar mos kelmadi!',
    errPhonePass: 'Iltimos, telefon raqami va parolni kiriting!', errServer: 'Server xatosi yuz berdi',
    errNetwork: 'Tarmoqqa ulanib bo\'lmadi. Internetni tekshiring.', errLogin: 'Tizimga kirishda xatolik yuz berdi', errorTitle: 'Xatolik'
  },
  ar: { 
    createAccount: 'إنشاء حساب', login: 'تسجيل الدخول', fullName: 'اسمك', phone: 'رقم هاتفك',
    email: 'بريدك الإلكتروني', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'هل نسيت كلمة المرور؟', dataProtected: 'بياناتك محمية بشكل موثوق',
    orContinue: 'أو الاستمرار عبر', errFillFields: 'يرجى تعبئة جميع الحقول!', errPassMatch: 'كلمات المرور غير متطابقة!',
    errPhonePass: 'يرجى إدخال رقم الهاتف وكلمة المرور!', errServer: 'حدث خطأ في الخادم',
    errNetwork: 'فشل الاتصال. تحقق من الإنترنت.', errLogin: 'فشل تسجيل الدخول', errorTitle: 'خطأ'
  },
  tr: { 
    createAccount: 'Hesap oluştur', login: 'Giriş', fullName: 'Adınız', phone: 'Telefon numaranız',
    email: 'E-posta adresiniz', password: 'Şifreniz', confirmPassword: 'Şifreyi onayla',
    forgotPassword: 'Şifrenizi mi unuttunuz?', dataProtected: 'Verileriniz güvenle korunmaktadır',
    orContinue: 'veya şununla devam et', errFillFields: 'Lütfen tüm alanları doldurun!', errPassMatch: 'Şifreler eşleşmiyor!',
    errPhonePass: 'Lütfen telefon numarasını ve şifreyi girin!', errServer: 'Sunucu hatası oluştu',
    errNetwork: 'Bağlantı başarısız. İnterneti kontrol edin.', errLogin: 'Giriş başarısız', errorTitle: 'Hata'
  },
  zh: { 
    createAccount: '创建帐户', login: '登录', fullName: '你的名字', phone: '你的电话号码',
    email: '你的电子邮箱', password: '你的密码', confirmPassword: '确认密码',
    forgotPassword: '忘记密码？', dataProtected: '您的数据受到可靠保护',
    orContinue: '或继续使用', errFillFields: '请填写所有字段！', errPassMatch: '密码不匹配！',
    errPhonePass: '请输入电话号码和密码！', errServer: '发生服务器错误',
    errNetwork: '连接失败。检查网络。', errLogin: '登录失败', errorTitle: '错误'
  },
  ky: { 
    createAccount: 'Аккаунт түзүү', login: 'Кирүү', fullName: 'Атыңыз', phone: 'Телефон номериңиз',
    email: 'Электрондук почтаңыз', password: 'Сырсөзүңүз', confirmPassword: 'Сырсөздү ырастоо',
    forgotPassword: 'Сырсөздү унуттуңузбу?', dataProtected: 'Сиздин маалыматтар ишенимдүү корголгон',
    orContinue: 'же муну менен улантуу', errFillFields: 'Бардык талааларды толтуруңуз!', errPassMatch: 'Сырсөздөр дал келбейт!',
    errPhonePass: 'Телефон номерин жана сырсөздү киргизиңиз!', errServer: 'Сервер катасы пайда болду',
    errNetwork: 'Тармакка туташуу мүмкүн эмес. Интернетти текшериңиз.', errLogin: 'Кирүү катасы', errorTitle: 'Ката'
  },
  kk: { 
    createAccount: 'Аккаунт жасау', login: 'Кіру', fullName: 'Атыңыз', phone: 'Телефон нөміріңіз',
    email: 'Электрондық поштаңыз', password: 'Құпия сөзіңіз', confirmPassword: 'Құпия сөзді растау',
    forgotPassword: 'Құпия сөзді ұмыттыңыз ба?', dataProtected: 'Сіздің деректеріңіз сенімді қорғалған',
    orContinue: 'немесе арқылы жалғастыру', errFillFields: 'Барлық өрістерді толтырыңыз!', errPassMatch: 'Құпия сөздер сәйкес келмейді!',
    errPhonePass: 'Телефон нөмірі мен құпия сөзді енгізіңіз!', errServer: 'Сервер қатесі орын алды',
    errNetwork: 'Желіге қосылу мүмкін емес. Интернетті тексеріңіз.', errLogin: 'Кіру қатесі', errorTitle: 'Қате'
  },
  tg: { 
    createAccount: 'Эҷоди ҳисоб', login: 'Вуруд', fullName: 'Номи шумо', phone: 'Рақами телефони шумо',
    email: 'Почтаи электронии шумо', password: 'Рамзи шумо', confirmPassword: 'Тасдиқи рамз',
    forgotPassword: 'Рамзро фаромӯш кардед?', dataProtected: 'Маълумоти шумо эътимоднок ҳифз карда мешавад',
    orContinue: 'ё идома додан бо', errFillFields: 'Лутфан ҳамаи майдонҳоро пур кунед!', errPassMatch: 'Рамзҳо мувофиқат намекунанд!',
    errPhonePass: 'Лутфан рақами телефон ва рамзро ворид кунед!', errServer: 'Хатои сервер рух дод',
    errNetwork: 'Пайвастшавӣ ба шабака ноком шуд. Интернетро тафтиш кунед.', errLogin: 'Хатои вуруд', errorTitle: 'Хатогӣ'
  },
  ja: { 
    createAccount: 'アカウントを作成', login: 'ログイン', fullName: 'あなたの名前', phone: '電話番号',
    email: 'メールアドレス', password: 'パスワード', confirmPassword: 'パスワードの確認',
    forgotPassword: 'パスワードを忘れた場合', dataProtected: 'データは確実に保護されています',
    orContinue: 'または次で続ける', errFillFields: 'すべてのフィールドに入力してください！', errPassMatch: 'パスワードが一致しません！',
    errPhonePass: '電話番号とパスワードを入力してください！', errServer: 'サーバーエラーが発生しました',
    errNetwork: '接続に失敗しました。インターネットを確認してください。', errLogin: 'ログイン失敗', errorTitle: 'エラー'
  },
  ko: { 
    createAccount: '계정 만들기', login: '로그인', fullName: '이름', phone: '전화번호',
    email: '이메일 주소', password: '비밀번호', confirmPassword: '비밀번호 확인',
    forgotPassword: '비밀번호를 잊으셨나요?', dataProtected: '데이터는 안전하게 보호됩니다',
    orContinue: '또는 다음으로 계속', errFillFields: '모든 필드를 입력해주세요!', errPassMatch: '비밀번호가 일치하지 않습니다!',
    errPhonePass: '전화번호와 비밀번호를 입력해주세요!', errServer: '서버 오류가 발생했습니다',
    errNetwork: '네트워크 연결 실패. 인터넷을 확인하세요.', errLogin: '로그인 실패', errorTitle: '오류'
  }
};

const CustomAnimatedInput = ({ icon, rightIcon, ...props }) => {
  const [isFocused, setIsFocused] = useState(false);
  const borderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(borderAnim, {
      toValue: isFocused ? 1 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
  }, [isFocused]);

  const borderColor = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#1A1A2E', '#A855F7'] // From dark to purple
  });
  
  const borderWidth = borderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.5] // Subtle thickness increase
  });

  return (
    <Animated.View style={[styles.inputContainer, { borderColor, borderWidth }]}>
      {icon}
      <TextInput
        style={styles.input}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
      {rightIcon}
    </Animated.View>
  );
};

export default function AuthScreen({ navigation, route }) {
  const { role = 'student', language = 'en' } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const [activeTab, setActiveTab] = useState('login'); // 'register' or 'login'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleAuthAction = async () => {
    if (activeTab === 'register') {
      if (!name.trim() || !phone.trim() || !email.trim() || !password || !confirmPassword) {
        Alert.alert(t.errorTitle, t.errFillFields);
        return;
      }
      if (password !== confirmPassword) {
        Alert.alert(t.errorTitle, t.errPassMatch);
        return;
      }

      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: email.trim(), name: name.trim(), language }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Move to OTP screen
          navigation.navigate('OtpScreen', {
            ...route.params,
            role,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            password: password,
          });
        } else {
          Alert.alert(t.errorTitle, data.error || t.errServer);
        }
      } catch (error) {
        Alert.alert(t.errorTitle, t.errNetwork);
        console.error(error);
      } finally {
        setIsLoading(false);
      }

    } else {
      // Login logic
      if (!phone.trim() || !password) {
        Alert.alert(t.errorTitle, t.errPhonePass);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ phone: phone.trim(), password, language })
        });
        
        const data = await response.json();
        
        if (response.ok) {
          // Detect character index if possible
          let charIndex = 0;
          let gender = 'boys';
          const boysChars = ["Max", "Sam", "Leo", "Ray"];
          const girlsChars = ["Mia", "Zoe", "Eva", "Lily"];
          
          if (data.user && data.user.character) {
             if (boysChars.includes(data.user.character)) {
               charIndex = boysChars.indexOf(data.user.character);
               gender = 'boys';
             } else if (girlsChars.includes(data.user.character)) {
               charIndex = girlsChars.indexOf(data.user.character);
               gender = 'girls';
             }
          }

          // Save session
          try {
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
          } catch (e) {
            console.error('AsyncStorage error', e);
          }

          // Reset navigation and go to StudentDashboard with full user data
          navigation.reset({
            index: 0,
            routes: [{ 
              name: 'StudentDashboard', 
              params: { 
                user: data.user,
                language: data.user.language || 'uz',
                selectedChar: charIndex,
                gender: gender
              } 
            }]
          });
        } else {
          Alert.alert(t.errorTitle, data.error || t.errLogin);
        }
      } catch (error) {
        Alert.alert(t.errorTitle, t.errNetwork);
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
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
          {/* Hero Image with Text */}
          <View style={styles.heroContainer}>
            <Image 
              source={
                activeTab === 'login' 
                  ? require('../assets/auth_hero_with_text.jpg') 
                  : (role === 'parent' ? require('../assets/auth_hero_parent.jpg') : (role === 'teacher' ? require('../assets/auth_hero_teacher.jpg') : require('../assets/register_hero_with_text.jpg')))
              } 
              style={styles.heroImage} 
              resizeMode="contain" 
            />
          </View>

          {/* Custom Tabs */}
          <View style={styles.tabContainer}>
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'register' && styles.tabActive]}
              onPress={() => setActiveTab('register')}
              activeOpacity={0.8}
            >
              <Feather name="user-plus" size={16} color={activeTab === 'register' ? '#FFF' : '#888899'} style={styles.tabIcon} />
              <Text style={[styles.tabText, activeTab === 'register' && styles.tabTextActive]}>
                {t.createAccount}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.tabButton, activeTab === 'login' && styles.tabActive]}
              onPress={() => setActiveTab('login')}
              activeOpacity={0.8}
            >
              <Feather name="log-in" size={16} color={activeTab === 'login' ? '#FFF' : '#888899'} style={styles.tabIcon} />
              <Text style={[styles.tabText, activeTab === 'login' && styles.tabTextActive]}>
                {t.login}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          {activeTab === 'register' && (
            <CustomAnimatedInput
              icon={<Feather name="user" size={18} color="#888899" style={styles.inputIcon} />}
              placeholder={t.fullName}
              placeholderTextColor="#555566"
              value={name}
              onChangeText={setName}
            />
          )}

          <CustomAnimatedInput
            icon={<Feather name="phone" size={18} color="#888899" style={styles.inputIcon} />}
            placeholder={t.phone}
            placeholderTextColor="#555566"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          {activeTab === 'register' && (
            <CustomAnimatedInput
              icon={<Feather name="mail" size={18} color="#888899" style={styles.inputIcon} />}
              placeholder={t.email}
              placeholderTextColor="#555566"
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          )}

          <CustomAnimatedInput
            icon={<Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />}
            placeholder={t.password}
            placeholderTextColor="#555566"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            rightIcon={
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#888899" />
              </TouchableOpacity>
            }
          />

          {activeTab === 'register' && (
            <CustomAnimatedInput
              icon={<Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />}
              placeholder={t.confirmPassword}
              placeholderTextColor="#555566"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              rightIcon={
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
                  <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#888899" />
                </TouchableOpacity>
              }
            />
          )}

          {activeTab === 'login' && (
            <TouchableOpacity 
              style={styles.forgotPasswordContainer} 
              onPress={() => navigation.navigate('ForgotPasswordScreen')}
              activeOpacity={0.7}
            >
              <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
            </TouchableOpacity>
          )}

          {/* Main Button */}
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              activeTab === 'register' && { marginTop: 8 },
              ((activeTab === 'register' ? (!name || !phone || !email || !password || !confirmPassword) : (!phone || !password)) || isLoading) && { opacity: 0.5 }
            ]} 
            activeOpacity={0.8}
            onPress={handleAuthAction}
            disabled={activeTab === 'register' ? (!name || !phone || !email || !password || !confirmPassword) : (!phone || !password) || isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.loginButtonText}>{activeTab === 'login' ? t.login : t.createAccount}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
              </>
            )}
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>{t.orContinue}</Text>
            <View style={styles.dividerLine} />
          </View>

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
    backgroundColor: '#05050C',
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
    marginTop: Platform.OS === 'android' ? -30 : -10,
    marginBottom: 20,
  },
  heroImage: {
    width: '100%',
    height: 320,
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: '#0A0A16',
    borderRadius: 14,
    padding: 4,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  tabButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 10,
  },
  tabActive: {
    backgroundColor: '#3B0764',
  },
  tabIcon: {
    marginRight: 8,
  },
  tabText: {
    color: '#888899',
    fontSize: 13,
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#FFFFFF',
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
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15,
  },
  eyeIcon: {
    padding: 4,
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#A855F7',
    fontSize: 13,
    fontWeight: '500',
  },
  loginButton: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    marginTop: 8,
  },
  loginButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#1A1A2E',
  },
  dividerText: {
    color: '#555566',
    paddingHorizontal: 12,
    fontSize: 13,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 'auto',
  },
  footerText: {
    color: '#555566',
    fontSize: 12,
    marginLeft: 6,
  },
});
