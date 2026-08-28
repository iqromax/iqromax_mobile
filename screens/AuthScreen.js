import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Animated, Alert, ActivityIndicator, Modal } from 'react-native';
import { Image } from 'expo-image';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { 
    createAccount: 'Create account', login: 'Login', fullName: 'Your name', phone: 'Your phone number',
    username: 'Username', email: 'Your email', password: 'Your password', confirmPassword: 'Confirm password',
    forgotPassword: 'Forgot password?', dataProtected: 'Your data is reliably protected',
    orContinue: 'or continue with', errFillFields: 'Please fill all fields!', errPassMatch: 'Passwords do not match!',
    errPhonePass: 'Please enter phone number and password!', errServer: 'Server error occurred',
    errNetwork: 'Failed to connect. Check internet.', errLogin: 'Login failed', errorTitle: 'Error',
    reqSentTitle: 'Request Sent to Admin!', reqSentMsg: 'Your application has been sent to admin. Once approved, login details (username and password) will be sent to your email.'
  },
  ru: { 
    createAccount: 'Создать аккаунт', login: 'Войти', fullName: 'Ваше имя', phone: 'Ваш номер телефона',
    username: 'Имя пользователя (Username)', email: 'Ваш email', password: 'Ваш пароль', confirmPassword: 'Подтвердите пароль',
    forgotPassword: 'Забыли пароль?', dataProtected: 'Ваши данные надежно защищены',
    orContinue: 'или продолжите через', errFillFields: 'Пожалуйста, заполните все поля!', errPassMatch: 'Пароли не совпадают!',
    errPhonePass: 'Введите номер телефона и пароль!', errServer: 'Произошла ошибка сервера',
    errNetwork: 'Ошибка сети. Проверьте интернет.', errLogin: 'Ошибка входа', errorTitle: 'Ошибка',
    reqSentTitle: 'Заявка отправлена админу!', reqSentMsg: 'Ваша заявка отправлена администратору. После одобрения логин и пароль будут отправлены на ваш email.'
  },
  uz: { 
    createAccount: 'Akkaunt yaratish', login: 'Kirish', fullName: 'Ismingiz', phone: 'Telefon raqamingiz',
    username: 'Foydalanuvchi nomi (Username)', email: 'Elektron pochtangiz', password: 'Parolingiz', confirmPassword: 'Parolni tasdiqlang',
    forgotPassword: 'Parolni unutdingizmi?', dataProtected: 'Ma\'lumotlaringiz ishonchli himoyalangan',
    orContinue: 'yoki quyidagilar orqali davom eting', errFillFields: 'Iltimos, barcha maydonlarni to\'ldiring!', errPassMatch: 'Parollar mos kelmadi!',
    errPhonePass: 'Iltimos, telefon raqami va parolni kiriting!', errServer: 'Server xatosi yuz berdi',
    errNetwork: 'Tarmoqqa ulanib bo\'lmadi. Internetni tekshiring.', errLogin: 'Tizimga kirishda xatolik yuz berdi', errorTitle: 'Xatolik',
    reqSentTitle: 'So\'rov Adminga Yuborildi!', reqSentMsg: 'Sizning so\'rovingiz adminga yuborildi. Hisobingiz tasdiqlansa tez orada emailingizga kirish uchun username va password jo\'natiladi.'
  },
  ar: { 
    createAccount: 'إنشاء حساب', login: 'تسجيل الدخول', fullName: 'اسمك', phone: 'رقم هاتفك',
    username: 'اسم المستخدم', email: 'بريدك الإلكتروني', password: 'كلمة المرور', confirmPassword: 'تأكيد كلمة المرور',
    forgotPassword: 'هل نسيت كلمة المرور؟', dataProtected: 'بياناتك محمية بشكل موثوق',
    orContinue: 'أو الاستمرار عبر', errFillFields: 'يرجى تعبئة جميع الحقول!', errPassMatch: 'كلمات المرور غير متطابقة!',
    errPhonePass: 'يرجى إدخال رقم الهاتف وكلمة المرور!', errServer: 'حدث خطأ في الخادم',
    errNetwork: 'فشل الاتصال. تحقق من الإنترنت.', errLogin: 'فشل تسجيل الدخول', errorTitle: 'خطأ',
    reqSentTitle: 'تم إرسال الطلب إلى المسؤول!', reqSentMsg: 'تم إرسال طلبك إلى المسؤول. عند الموافقة، سيتم إرسال اسم المستخدم وكلمة المرور إلى بريدك الإلكتروني.'
  },
  tr: { 
    createAccount: 'Hesap oluştur', login: 'Giriş', fullName: 'Adınız', phone: 'Telefon numaranız',
    username: 'Kullanıcı adı', email: 'E-posta adresiniz', password: 'Şifreniz', confirmPassword: 'Şifreyi onayla',
    forgotPassword: 'Şifrenizi mi unuttunuz?', dataProtected: 'Verileriniz güvenle korunmaktadır',
    orContinue: 'veya şununla devam et', errFillFields: 'Lütfen tüm alanları doldurun!', errPassMatch: 'Şifreler eşleşmiyor!',
    errPhonePass: 'Lütfen telefon numarasını ve şifreyi girin!', errServer: 'Sunucu hatası oluştu',
    errNetwork: 'Bağlantı başarısız. İnterneti kontrol edin.', errLogin: 'Giriş başarısız', errorTitle: 'Hata',
    reqSentTitle: 'İstek Yöneticiye Gönderildi!', reqSentMsg: 'Başvurunuz yöneticiye gönderildi. Onaylandıktan sonra kullanıcı adı ve şifreniz e-postanıza gönderilecektir.'
  },
  zh: { 
    createAccount: '创建帐户', login: '登录', fullName: '你的名字', phone: '你的电话号码',
    username: '用户名', email: '你的电子邮箱', password: '你的密码', confirmPassword: '确认密码',
    forgotPassword: '忘记密码？', dataProtected: '您的数据受到可靠保护',
    orContinue: '或继续使用', errFillFields: '请填写所有字段！', errPassMatch: '密码不匹配！',
    errPhonePass: '请输入电话号码和密码！', errServer: '发生服务器错误',
    errNetwork: '连接失败。检查网络。', errLogin: '登录失败', errorTitle: '错误',
    reqSentTitle: '请求已发送给管理员！', reqSentMsg: '您的申请已发送给管理员。一旦批准，用户名和密码将发送到您的电子邮件。'
  },
  ky: { 
    createAccount: 'Аккаунт түзүү', login: 'Кирүү', fullName: 'Атыңыз', phone: 'Телефон номериңиз',
    username: 'Колдонуучунун аты (Username)', email: 'Электрондук почтаңыз', password: 'Сырсөзүңүз', confirmPassword: 'Сырсөздү ырастоо',
    forgotPassword: 'Сырсөздү унуттуңузбу?', dataProtected: 'Сиздин маалыматтар ишенимдүү корголгон',
    orContinue: 'же муну менен улантуу', errFillFields: 'Бардык талааларды толтуруңуз!', errPassMatch: 'Сырсөздөр дал келбейт!',
    errPhonePass: 'Телефон номерин жана сырсөздү киргизиңиз!', errServer: 'Сервер катасы пайда болду',
    errNetwork: 'Тармакка туташуу мүмкүн эмес. Интернетти текшериңиз.', errLogin: 'Кирүү катасы', errorTitle: 'Ката',
    reqSentTitle: 'Сүйлөшүү админге жөнөтүлдү!', reqSentMsg: 'Сиздин өтүнүчүңүз админге жөнөтүлдү. Тастыкталгандан кийин колдонуучу аты жана сырсөз электрондук почтаңызга жөнөтүлөт.'
  },
  kk: { 
    createAccount: 'Аккаунт жасау', login: 'Кіру', fullName: 'Атыңыз', phone: 'Телефон нөміріңіз',
    username: 'Пайдаланушы аты (Username)', email: 'Электрондық поштаңыз', password: 'Құпия сөзіңіз', confirmPassword: 'Құпия сөзді растау',
    forgotPassword: 'Құпия сөзді ұмыттыңыз ба?', dataProtected: 'Сіздің деректеріңіз сенімді қорғалған',
    orContinue: 'немесе арқылы жалғастыру', errFillFields: 'Барлық өрістерді толтырыңыз!', errPassMatch: 'Құпия сөздер сәйкес келмейді!',
    errPhonePass: 'Телефон нөмірі мен құпия сөзді енгізіңіз!', errServer: 'Сервер қатесі орын алды',
    errNetwork: 'Желіге қосылу мүмкін емес. Интернетті тексеріңіз.', errLogin: 'Кіру қатесі', errorTitle: 'Қате',
    reqSentTitle: 'Өтініш админге жіберілді!', reqSentMsg: 'Сіздің өтінішіңіз админге жіберілді. Расталғаннан кейін кіру деректері электрондық поштаңызға жіберіледі.'
  },
  tg: { 
    createAccount: 'Эҷоди ҳисоб', login: 'Вуруд', fullName: 'Номи шумо', phone: 'Рақами телефони шумо',
    username: 'Номи корбарӣ (Username)', email: 'Почтаи электронии шумо', password: 'Рамзи шумо', confirmPassword: 'Тасдиқи рамз',
    forgotPassword: 'Рамзро фаромӯш кардед?', dataProtected: 'Маълумоти шумо эътимоднок ҳифз карда мешавад',
    orContinue: 'ё идома додан бо', errFillFields: 'Лутфан ҳамаи майдонҳоро пур кунед!', errPassMatch: 'Рамзҳо мувофиқат намекунанд!',
    errPhonePass: 'Лутфан рақами телефон ва рамзро ворид кунед!', errServer: 'Хатои сервер рух дод',
    errNetwork: 'Пайвастшавӣ ба шабака ноком шуд. Интернетро тафтиш кунед.', errLogin: 'Хатои вуруд', errorTitle: 'Хатогӣ',
    reqSentTitle: 'Дархост ба администратор фиристода шуд!', reqSentMsg: 'Дархости шумо ба администратор фиристода шуд. Пас аз тасдиқ, логин ва парол ба почтаи электронии шумо фиристода мешавад.'
  },
  ja: { 
    createAccount: 'アカウントを作成', login: 'ログイン', fullName: 'あなたの名前', phone: '電話番号',
    username: 'ユーザー名 (Username)', email: 'メールアドレス', password: 'パスワード', confirmPassword: 'パスワードの確認',
    forgotPassword: 'パスワードを忘れた場合', dataProtected: 'データは確実に保護されています',
    orContinue: 'または次で続ける', errFillFields: 'すべてのフィールドに入力してください！', errPassMatch: 'パスワードが一致しません！',
    errPhonePass: '電話番号とパスワードを入力してください！', errServer: 'サーバーエラーが発生しました',
    errNetwork: '接続に失敗しました。インターネットを確認してください。', errLogin: 'ログイン失敗', errorTitle: 'エラー',
    reqSentTitle: 'リクエストが管理者に送信されました！', reqSentMsg: 'あなたの申請が管理者に送信されました。承認後、ログイン情報がメールに送信されます。'
  },
  ko: { 
    createAccount: '계정 만들기', login: '로그인', fullName: '이름', phone: '전화번호',
    username: '사용자 이름 (Username)', email: '이메일 주소', password: '비밀번호', confirmPassword: '비밀번호 확인',
    forgotPassword: '비밀번호를 잊으셨나요?', dataProtected: '데이터는 안전하게 보호됩니다',
    orContinue: '또는 다음으로 계속', errFillFields: '모든 필드를 입력해주세요!', errPassMatch: '비밀번호가 일치하지 않습니다!',
    errPhonePass: '전화번호와 비밀번호를 입력해주세요!', errServer: '서버 오류가 발생했습니다',
    errNetwork: '네트워크 연결 실패. 인터넷을 확인하세요.', errLogin: '로그인 실패', errorTitle: '오류',
    reqSentTitle: '관리자에게 요청이 전송되었습니다!', reqSentMsg: '신청서가 관리자에게 전송되었습니다. 승인되면 로그인 자격 증명이 이메일로 전송됩니다.'
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
  const { role = 'student', language = 'uz', initialTab = 'login' } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['uz'];
  const [activeTab, setActiveTab] = useState(initialTab); // 'register' or 'login'
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [usernameInput, setUsernameInput] = useState('');
  const [requestModal, setRequestModal] = useState({ visible: false, title: '', message: '' });
  const [customAlert, setCustomAlert] = useState({ visible: false, title: '', message: '', type: 'error' });

  useEffect(() => {
    async function loadSavedPromo() {
      try {
        if (route.params?.referralCode) {
          setReferralCode(route.params.referralCode);
          return;
        }
        const savedPromo = await AsyncStorage.getItem('pending_referral_promo');
        if (savedPromo) {
          setReferralCode(savedPromo);
        }
      } catch (e) {}
    }
    loadSavedPromo();
  }, [route.params?.referralCode]);

  const showAlert = (title, message, type = 'error') => {
    setCustomAlert({ visible: true, title, message, type });
  };

  const handleAuthAction = async () => {
    if (activeTab === 'register') {
      if (role === 'teacher') {
        if (!name.trim() || !phone.trim() || !email.trim()) {
          showAlert(t.errorTitle, t.errFillFields);
          return;
        }

        setIsLoading(true);
        try {
          const res = await fetch(`${API_URL}/teacher/request`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              name: name.trim(),
              phone: phone.trim(),
              email: email.trim(),
              password: 'teacher_pending_pass'
            })
          });

          const data = await res.json();
          if (res.ok) {
            setRequestModal({
              visible: true,
              title: t.reqSentTitle || "So'rov Adminga Yuborildi!",
              message: t.reqSentMsg || "Sizning so'rovingiz adminga yuborildi. Hisobingiz tasdiqlansa tez orada emailingizga kirish uchun username va password jo'natiladi."
            });
          } else {
            showAlert(t.errorTitle, data.error || t.errServer);
          }
        } catch (e) {
          showAlert(t.errorTitle, t.errNetwork);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      if (!name.trim()) {
        showAlert(t.errorTitle, t.errFillFields);
        return;
      }

      // Step 3 -> Name entered -> Go to Step 4 (Country Selection)
      navigation.navigate('StepFour', {
        ...route.params,
        role,
        name: name.trim(),
        referralCode: referralCode.trim(),
        language
      });
      return;
    } else {
      // Login logic (allows username, email, or phone)
      const rawIdentifier = role === 'teacher' ? (usernameInput || phone) : (phone || usernameInput);
      const loginIdentifier = String(rawIdentifier || '').trim();
      if (!loginIdentifier || !password) {
        showAlert(t.errorTitle, role === 'teacher' ? 'Iltimos, username va parolni kiriting!' : t.errPhonePass);
        return;
      }
      setIsLoading(true);
      try {
        const response = await fetch(`${API_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            phone: loginIdentifier,
            username: loginIdentifier,
            password: password.trim(),
            language
          })
        });
        
        const data = await response.json();
        
        if (response.ok) {
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

          try {
            await AsyncStorage.setItem('user_data', JSON.stringify(data.user));
          } catch (e) {
            console.error('AsyncStorage error', e);
          }

          if (role === 'teacher' || data.user?.role?.toLowerCase() === 'teacher') {
            navigation.reset({
              index: 0,
              routes: [{ name: 'TeacherDashboard', params: { user: data.user, language } }]
            });
          } else {
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
          }
        } else {
          showAlert(t.errorTitle, data.error || t.errLogin);
        }
      } catch (error) {
        showAlert(t.errorTitle, t.errNetwork);
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
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          {/* Hero Image with Text */}
          <View style={styles.heroContainer}>
            <Image 
              source={
                role === 'teacher'
                  ? require('../assets/auth_hero_teacher.png')
                  : (activeTab === 'login' 
                      ? require('../assets/auth_hero_with_text.jpg') 
                      : (role === 'parent' ? require('../assets/auth_hero_parent.jpg') : require('../assets/register_hero_with_text.jpg')))
              } 
              style={styles.heroImage} 
              contentFit="contain" 
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
          {activeTab === 'register' ? (
            <View style={{ marginBottom: 20 }}>
              <CustomAnimatedInput
                icon={<Feather name="user" size={18} color="#888899" style={styles.inputIcon} />}
                placeholder={t.fullName}
                placeholderTextColor="#555566"
                value={name}
                onChangeText={setName}
              />

              {role === 'teacher' ? (
                <>
                  <CustomAnimatedInput
                    icon={<Feather name="phone" size={18} color="#888899" style={styles.inputIcon} />}
                    placeholder={t.phone}
                    placeholderTextColor="#555566"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                  />

                  <CustomAnimatedInput
                    icon={<Feather name="mail" size={18} color="#888899" style={styles.inputIcon} />}
                    placeholder={t.email}
                    placeholderTextColor="#555566"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                  />
                </>
              ) : (
                <CustomAnimatedInput
                  icon={<MaterialCommunityIcons name="ticket-percent-outline" size={18} color="#888899" style={styles.inputIcon} />}
                  placeholder="Promokod (ixtiyoriy)"
                  placeholderTextColor="#555566"
                  value={referralCode}
                  onChangeText={setReferralCode}
                  autoCapitalize="characters"
                />
              )}
            </View>
          ) : (
            <>
              {role === 'teacher' ? (
                <CustomAnimatedInput
                  icon={<Feather name="user" size={18} color="#888899" style={styles.inputIcon} />}
                  placeholder={t.username || "Username"}
                  placeholderTextColor="#555566"
                  value={usernameInput}
                  onChangeText={setUsernameInput}
                />
              ) : (
                <CustomAnimatedInput
                  icon={<Feather name="phone" size={18} color="#888899" style={styles.inputIcon} />}
                  placeholder={t.phone}
                  placeholderTextColor="#555566"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
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

              {role !== 'teacher' && (
                <TouchableOpacity 
                  style={styles.forgotPasswordContainer} 
                  onPress={() => navigation.navigate('ForgotPasswordScreen', { language })}
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotPasswordText}>{t.forgotPassword}</Text>
                </TouchableOpacity>
              )}
            </>
          )}

          {/* Main Button */}
          <TouchableOpacity 
            style={[
              styles.loginButton, 
              activeTab === 'register' && { marginTop: 20 },
              (isLoading) && { opacity: 0.5 }
            ]} 
            activeOpacity={0.8}
            onPress={handleAuthAction}
            disabled={isLoading}
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

      {/* TEACHER REQUEST SUBMITTED MODAL */}
      <Modal visible={requestModal.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalIconBox}>
              <MaterialCommunityIcons name="send-check-outline" size={36} color="#A855F7" />
            </View>

            <Text style={styles.modalTitleText}>
              {requestModal.title}
            </Text>

            <Text style={styles.modalDescText}>
              {requestModal.message}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.modalCloseBtn}
              onPress={() => {
                setRequestModal({ visible: false, title: '', message: '' });
                setActiveTab('login');
              }}
            >
              <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 15 }}>Tushundim</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* CUSTOM ERROR GLASSMORPHISM MODAL */}
      <Modal visible={customAlert.visible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { borderColor: '#EF4444', shadowColor: '#EF4444' }]}>
            <View style={[styles.modalIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.12)', borderColor: '#EF4444' }]}>
              <MaterialCommunityIcons name="alert-circle-outline" size={38} color="#EF4444" />
            </View>

            <Text style={styles.modalTitleText}>
              {customAlert.title || t.errorTitle}
            </Text>

            <Text style={styles.modalDescText}>
              {customAlert.message}
            </Text>

            <TouchableOpacity
              activeOpacity={0.8}
              style={[styles.modalCloseBtn, { backgroundColor: '#EF4444' }]}
              onPress={() => setCustomAlert({ visible: false, title: '', message: '', type: 'error' })}
            >
              <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 15 }}>Tushundim</Text>
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#0D0D1A',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  modalIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(168, 85, 247, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: '#A855F7',
  },
  modalTitleText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 10,
  },
  modalDescText: {
    color: '#9CA3AF',
    fontSize: 13,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalCloseBtn: {
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: '#A855F7',
    alignItems: 'center',
  },
});
