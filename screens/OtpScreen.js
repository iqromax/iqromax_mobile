import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, TextInput, StatusBar, KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { 
    title: 'Verify your email', subtitle1: 'We have sent a 4-digit code to ', subtitle2: '. Please enter it below:',
    resendAsk: "Didn't receive the code?", resend: "Resend", resendIn: "Resend in ", s: "s",
    errCode: "Please enter the 4-digit code", errInvalid: "Invalid or expired code",
    errNetwork: "Failed to connect to the network.", msgSent: "A new code has been sent to your email",
    errSent: "Failed to resend the code", tryAgain: "Try Again", oops: "Oops!"
  },
  ru: { 
    title: 'Подтвердите ваш email', subtitle1: 'Мы отправили 4-значный код на ', subtitle2: '. Введите его ниже:',
    resendAsk: "Не получили код?", resend: "Отправить снова", resendIn: "Отправить через ", s: "с",
    errCode: "Пожалуйста, введите 4-значный код", errInvalid: "Неверный или просроченный код",
    errNetwork: "Не удалось подключиться к сети.", msgSent: "Новый код отправлен на ваш email",
    errSent: "Не удалось отправить код", tryAgain: "Попробовать снова", oops: "Ой!"
  },
  uz: { 
    title: 'Emailni tasdiqlang', subtitle1: 'Biz 4 xonali kodni quyidagi manzilga yubordik: ', subtitle2: '. Iltimos, uni pastga kiriting:',
    resendAsk: "Kodni olmadingizmi?", resend: "Qayta yuborish", resendIn: "Qayta yuborish: ", s: "s",
    errCode: "Iltimos, 4 xonali kodni kiriting", errInvalid: "Kod noto'g'ri yoki muddati o'tgan",
    errNetwork: "Tarmoqqa ulanib bo'lmadi.", msgSent: "Yangi kod emailingizga yuborildi",
    errSent: "Kodni qayta yuborib bo'lmadi", tryAgain: "Qaytadan urinish", oops: "Xatolik!"
  },
  ar: { 
    title: 'تأكيد بريدك الإلكتروني', subtitle1: 'لقد أرسلنا رمزًا مكونًا من 4 أرقام إلى ', subtitle2: '. يرجى إدخاله أدناه:',
    resendAsk: "لم تستلم الرمز؟", resend: "إعادة إرسال", resendIn: "إعادة الإرسال خلال ", s: "ث",
    errCode: "يرجى إدخال الرمز المكون من 4 أرقام", errInvalid: "الرمز غير صالح أو منتهي الصلاحية",
    errNetwork: "فشل الاتصال بالشبكة.", msgSent: "تم إرسال رمز جديد إلى بريدك الإلكتروني",
    errSent: "فشل إعادة إرسال الرمز", tryAgain: "حاول مرة أخرى", oops: "عفوًا!"
  },
  tr: { 
    title: 'E-postanızı doğrulayın', subtitle1: '4 haneli bir kodu şuraya gönderdik: ', subtitle2: '. Lütfen aşağıya girin:',
    resendAsk: "Kodu almadınız mı?", resend: "Tekrar gönder", resendIn: "Tekrar gönderilecek süre: ", s: "sn",
    errCode: "Lütfen 4 haneli kodu girin", errInvalid: "Geçersiz veya süresi dolmuş kod",
    errNetwork: "Ağa bağlanılamadı.", msgSent: "E-postanıza yeni bir kod gönderildi",
    errSent: "Kod tekrar gönderilemedi", tryAgain: "Tekrar Dene", oops: "Hata!"
  },
  zh: { 
    title: '验证您的电子邮件', subtitle1: '我们已向 ', subtitle2: ' 发送了4位数的代码。请在下面输入：',
    resendAsk: "没有收到验证码？", resend: "重新发送", resendIn: "重新发送还有 ", s: "秒",
    errCode: "请输入4位数代码", errInvalid: "无效或已过期的代码",
    errNetwork: "无法连接到网络。", msgSent: "新代码已发送到您的邮箱",
    errSent: "重新发送代码失败", tryAgain: "重试", oops: "哎呀！"
  },
  ky: { 
    title: 'Электрондук почтаңызды ырастаңыз', subtitle1: 'Биз 4 орундуу кодду ', subtitle2: ' дарегине жөнөттүк. Аны төмөнгө киргизиңиз:',
    resendAsk: "Код алган жоксузбу?", resend: "Кайра жөнөтүү", resendIn: "Кайра жөнөтүү убактысы: ", s: "с",
    errCode: "Сураныч, 4 орундуу кодду киргизиңиз", errInvalid: "Код туура эмес же мөөнөтү бүткөн",
    errNetwork: "Тармакка туташуу мүмкүн эмес.", msgSent: "Жаңы код электрондук почтаңызга жөнөтүлдү",
    errSent: "Кодду кайра жөнөтүү мүмкүн эмес", tryAgain: "Кайра аракет кылуу", oops: "Ката!"
  },
  kk: { 
    title: 'Электрондық поштаңызды растаңыз', subtitle1: 'Біз 4 таңбалы кодты ', subtitle2: ' мекенжайына жібердік. Оны төменде енгізіңіз:',
    resendAsk: "Кодты алмадыңыз ба?", resend: "Қайта жіберу", resendIn: "Қайта жіберу уақыты: ", s: "с",
    errCode: "Өтінеміз, 4 таңбалы кодты енгізіңіз", errInvalid: "Код қате немесе мерзімі біткен",
    errNetwork: "Желіге қосылу мүмкін емес.", msgSent: "Жаңа код электрондық поштаңызға жіберілді",
    errSent: "Кодты қайта жіберу мүмкін емес", tryAgain: "Қайта байқап көру", oops: "Қате!"
  },
  tg: { 
    title: 'Почтаи электронии худро тасдиқ кунед', subtitle1: 'Мо рамзи 4-рақамаро ба ', subtitle2: ' фиристодем. Лутфан онро дар зер ворид кунед:',
    resendAsk: "Рамзро нагирифтед?", resend: "Дубора фиристодан", resendIn: "Дубора фиристодан дар ", s: "с",
    errCode: "Лутфан рамзи 4-рақамаро ворид кунед", errInvalid: "Рамз нодуруст ё мӯҳлаташ гузаштааст",
    errNetwork: "Пайвастшавӣ ба шабака ноком шуд.", msgSent: "Рамзи нав ба почтаи электронии шумо фиристода шуд",
    errSent: "Дубора фиристодани рамз ноком шуд", tryAgain: "Дубора кӯшиш кунед", oops: "Хатогӣ!"
  },
  ja: { 
    title: 'メールを確認する', subtitle1: '4桁のコードを ', subtitle2: ' に送信しました。以下に入力してください：',
    resendAsk: "コードを受け取っていませんか？", resend: "再送信", resendIn: "再送信まで ", s: "秒",
    errCode: "4桁のコードを入力してください", errInvalid: "無効または期限切れのコード",
    errNetwork: "ネットワークへの接続に失敗しました。", msgSent: "新しいコードがメールに送信されました",
    errSent: "コードの再送信に失敗しました", tryAgain: "再試行", oops: "おっと！"
  },
  ko: { 
    title: '이메일 확인', subtitle1: '4자리 코드를 ', subtitle2: ' 로 보냈습니다. 아래에 입력해주세요:',
    resendAsk: "코드를 받지 못하셨나요?", resend: "재전송", resendIn: "재전송 가능 시간: ", s: "초",
    errCode: "4자리 코드를 입력해주세요", errInvalid: "잘못되었거나 만료된 코드",
    errNetwork: "네트워크 연결에 실패했습니다.", msgSent: "새 코드가 이메일로 전송되었습니다",
    errSent: "코드 재전송에 실패했습니다", tryAgain: "다시 시도", oops: "앗!"
  }
};

export default function OtpScreen({ navigation, route }) {
  const { role, name, phone, email, password, language = 'en' } = route.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  
  const [otp, setOtp] = useState(['', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [otpStatus, setOtpStatus] = useState('idle'); // 'idle' | 'success' | 'error'
  const [timer, setTimer] = useState(60);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const inputRefs = useRef([]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  useEffect(() => {
    const code = otp.join('');
    if (code.length === 4 && otpStatus !== 'success') {
      handleVerify();
    }
  }, [otp]);

  const handleChange = (text, index) => {
    // Reset status if user starts typing again
    if (otpStatus === 'error') {
      setOtpStatus('idle');
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Auto-focus to next input
    if (text && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (text, index) => {
    if (!text && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const code = otp.join('');
    if (code.length < 4) return;

    setIsLoading(true);
    setOtpStatus('idle');
    try {
      const response = await fetch(`${API_URL}/auth/verify-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: code }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setOtpStatus('success');
        // Give 500ms for the user to see the green success UI
        setTimeout(() => {
          navigation.navigate('StepFour', {
            ...route.params,
            role,
            name,
            phone,
            email,
            password
          });
        }, 500);
      } else {
        setOtpStatus('error');
        setErrorMessage(data.error || t.errInvalid);
        setShowErrorModal(true);
      }
    } catch (error) {
      setOtpStatus('error');
      setErrorMessage(t.errNetwork);
      setShowErrorModal(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowErrorModal(false);
    setOtp(['', '', '', '']);
    setOtpStatus('idle');
    setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 100);
  };

  const handleResend = async () => {
    if (timer > 0) return;
    try {
      await fetch(`${API_URL}/auth/send-otp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, language }),
      });
      setTimer(60);
      Alert.alert('', t.msgSent);
    } catch (error) {
      setErrorMessage(t.errSent);
      setShowErrorModal(true);
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

        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons name="email-fast-outline" size={64} color="#A855F7" />
          </View>
          
          <Text style={styles.title}>{t.title}</Text>
          <Text style={styles.subtitle}>
            {t.subtitle1}<Text style={{ color: '#A855F7', fontWeight: 'bold' }}>{email}</Text>{t.subtitle2}
          </Text>

          {/* OTP Inputs */}
          <View style={styles.otpContainer}>
            {otp.map((digit, index) => {
              let borderColor = '#1A1A2E';
              let textColor = '#FFFFFF';
              let bgColor = '#0A0A16';
              if (otpStatus === 'success') {
                borderColor = '#22C55E';
                textColor = '#22C55E';
                bgColor = 'rgba(34, 197, 94, 0.1)';
              } else if (otpStatus === 'error') {
                borderColor = '#EF4444';
                textColor = '#EF4444';
                bgColor = 'rgba(239, 68, 68, 0.1)';
              } else if (digit) {
                borderColor = '#A855F7';
                bgColor = '#160B24';
              }

              return (
                <TextInput
                  key={index}
                  ref={(ref) => (inputRefs.current[index] = ref)}
                  style={[
                    styles.otpInput,
                    { borderColor, color: textColor, backgroundColor: bgColor }
                  ]}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => handleChange(text, index)}
                  onKeyPress={({ nativeEvent }) => {
                    if (nativeEvent.key === 'Backspace') {
                      handleBackspace(digit, index);
                    }
                  }}
                  editable={otpStatus !== 'loading' && otpStatus !== 'success'}
                />
              );
            })}
          </View>

          {isLoading && <ActivityIndicator color="#A855F7" style={{ marginBottom: 20 }} />}

          <TouchableOpacity style={[styles.resendContainer, timer > 0 && { opacity: 0.5 }]} onPress={handleResend} disabled={timer > 0}>
            {timer > 0 ? (
              <Text style={styles.resendText}>{t.resendIn}<Text style={styles.resendTextHighlight}>{timer}{t.s}</Text></Text>
            ) : (
              <Text style={styles.resendText}>{t.resendAsk} <Text style={styles.resendTextHighlight}>{t.resend}</Text></Text>
            )}
          </TouchableOpacity>
        </ScrollView>

        {/* Custom Error Modal */}
        <Modal visible={showErrorModal} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalIconContainer}>
                <Feather name="alert-triangle" size={40} color="#EF4444" />
              </View>
              <Text style={styles.modalTitle}>{t.oops}</Text>
              <Text style={styles.modalMessage}>{errorMessage}</Text>
              
              <TouchableOpacity style={styles.modalButton} onPress={handleModalClose} activeOpacity={0.8}>
                <Text style={styles.modalButtonText}>{t.tryAgain}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
    paddingVertical: Platform.OS === 'android' ? 10 : 20,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0A0A16',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    alignItems: 'center',
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#888899',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 40,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginBottom: 30,
  },
  otpInput: {
    width: 65,
    height: 75,
    borderRadius: 16,
    borderWidth: 2,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  resendContainer: {
    padding: 10,
  },
  resendText: {
    color: '#888899',
    fontSize: 14,
  },
  resendTextHighlight: {
    color: '#A855F7',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: '100%',
    backgroundColor: '#12121D',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
    shadowColor: '#EF4444',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  modalMessage: {
    fontSize: 16,
    color: '#888899',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  modalButton: {
    width: '100%',
    backgroundColor: '#EF4444',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
  },
  modalButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
