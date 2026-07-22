import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { 
    titlePart1: 'Enter new ', titlePart2: 'password', 
    subtitle: 'For your account security, create a new, strong password.', 
    newPass: 'New password', confPass: 'Confirm password', 
    strength: 'Password strength:', weak: 'Weak', medium: 'Medium', strong: 'Strong',
    reqTitle: 'Password must meet the following requirements:',
    req1: 'At least 8 characters long',
    req2: 'Contains uppercase and lowercase letters',
    req3: 'Contains at least 1 number',
    req4: 'Contains at least 1 special character (!@#$%^&...)',
    updateBtn: 'Update password',
    errFill: 'Please fill all fields', errMatch: 'Passwords do not match', errNetwork: 'Network error', success: 'Password updated successfully!', errorTitle: 'Error' 
  },
  ru: { 
    titlePart1: 'Введите новый ', titlePart2: 'пароль', 
    subtitle: 'Для безопасности вашего аккаунта создайте новый надежный пароль.', 
    newPass: 'Новый пароль', confPass: 'Подтвердите пароль', 
    strength: 'Надежность пароля:', weak: 'Слабый', medium: 'Средний', strong: 'Надежный',
    reqTitle: 'Пароль должен соответствовать следующим требованиям:',
    req1: 'Не менее 8 символов',
    req2: 'Содержит заглавные и строчные буквы',
    req3: 'Содержит минимум 1 цифру',
    req4: 'Содержит минимум 1 спец. символ (!@#$%^&...)',
    updateBtn: 'Обновить пароль',
    errFill: 'Заполните все поля', errMatch: 'Пароли не совпадают', errNetwork: 'Ошибка сети', success: 'Пароль успешно обновлен!', errorTitle: 'Ошибка' 
  },
  uz: { 
    titlePart1: 'Yangi parol ', titlePart2: 'kiriting', 
    subtitle: 'Hisobingiz xavfsizligi uchun yangi, kuchli parol yarating.', 
    newPass: 'Yangi parol', confPass: 'Parolni takrorlang', 
    strength: 'Parol kuchi:', weak: 'Sust', medium: 'O\'rta', strong: 'Kuchli',
    reqTitle: 'Parol quyidagi talablarga javob berishi kerak:',
    req1: 'Kamida 8 ta belgidan iborat bo\'lsin',
    req2: 'Katta va kichik harflar ishtirok etsin',
    req3: 'Kamida 1 ta raqam bo\'lsin',
    req4: 'Kamida 1 ta maxsus belgi (!@#$%^&...) bo\'lsin',
    updateBtn: 'Parolni yangilash',
    errFill: 'Barcha maydonlarni to\'ldiring', errMatch: 'Parollar mos kelmadi', errNetwork: 'Tarmoq xatosi', success: 'Parol muvaffaqiyatli yangilandi!', errorTitle: 'Xatolik' 
  },
  ar: { 
    titlePart1: 'أدخل كلمة مرور ', titlePart2: 'جديدة', 
    subtitle: 'لأمان حسابك، قم بإنشاء كلمة مرور جديدة وقوية.', 
    newPass: 'كلمة مرور جديدة', confPass: 'تأكيد كلمة المرور', 
    strength: 'قوة كلمة المرور:', weak: 'ضعيف', medium: 'متوسط', strong: 'قوي',
    reqTitle: 'يجب أن تفي كلمة المرور بالمتطلبات التالية:',
    req1: '8 أحرف على الأقل',
    req2: 'يحتوي على أحرف كبيرة وصغيرة',
    req3: 'يحتوي على رقم واحد على الأقل',
    req4: 'يحتوي على حرف خاص واحد على الأقل (!@#$%^&...)',
    updateBtn: 'تحديث كلمة المرور',
    errFill: 'يرجى تعبئة جميع الحقول', errMatch: 'كلمات المرور غير متطابقة', errNetwork: 'خطأ في الشبكة', success: 'تم تحديث كلمة المرور بنجاح!', errorTitle: 'خطأ' 
  },
  tr: { 
    titlePart1: 'Yeni şifre ', titlePart2: 'girin', 
    subtitle: 'Hesap güvenliğiniz için yeni, güçlü bir şifre oluşturun.', 
    newPass: 'Yeni Şifre', confPass: 'Şifreyi onayla', 
    strength: 'Şifre gücü:', weak: 'Zayıf', medium: 'Orta', strong: 'Güçlü',
    reqTitle: 'Şifre aşağıdaki gereksinimleri karşılamalıdır:',
    req1: 'En az 8 karakter uzunluğunda',
    req2: 'Büyük ve küçük harfler içerir',
    req3: 'En az 1 sayı içerir',
    req4: 'En az 1 özel karakter içerir (!@#$%^&...)',
    updateBtn: 'Şifreyi güncelle',
    errFill: 'Tüm alanları doldurun', errMatch: 'Şifreler eşleşmiyor', errNetwork: 'Ağ hatası', success: 'Şifre başarıyla güncellendi!', errorTitle: 'Hata' 
  },
  zh: { 
    titlePart1: '输入新', titlePart2: '密码', 
    subtitle: '为了您的帐户安全，请创建一个新的强密码。', 
    newPass: '新密码', confPass: '确认密码', 
    strength: '密码强度:', weak: '弱', medium: '中', strong: '强',
    reqTitle: '密码必须满足以下要求:',
    req1: '至少8个字符长',
    req2: '包含大写和小写字母',
    req3: '至少包含1个数字',
    req4: '至少包含1个特殊字符 (!@#$%^&...)',
    updateBtn: '更新密码',
    errFill: '请填写所有字段', errMatch: '密码不匹配', errNetwork: '网络错误', success: '密码更新成功！', errorTitle: '错误' 
  },
  ky: { 
    titlePart1: 'Жаңы сырсөз ', titlePart2: 'киргизиңиз', 
    subtitle: 'Каттоо эсебиңиздин коопсуздугу үчүн жаңы, күчтүү сырсөз түзүңүз.', 
    newPass: 'Жаңы сырсөз', confPass: 'Сырсөздү ырастоо', 
    strength: 'Сырсөз күчү:', weak: 'Алсыз', medium: 'Орто', strong: 'Күчтүү',
    reqTitle: 'Сырсөз төмөнкү талаптарга жооп бериши керек:',
    req1: 'Кеминде 8 белгиден турушу керек',
    req2: 'Баш жана кичине тамгаларды камтыйт',
    req3: 'Кеминде 1 сан болушу керек',
    req4: 'Кеминде 1 атайын белги камтышы керек (!@#$%^&...)',
    updateBtn: 'Сырсөздү жаңыртуу',
    errFill: 'Бардык талааларды толтуруңуз', errMatch: 'Сырсөздөр дал келбейт', errNetwork: 'Тармак катасы', success: 'Сырсөз ийгиликтүү жаңыртылды!', errorTitle: 'Ката' 
  },
  kk: { 
    titlePart1: 'Жаңа құпия сөз ', titlePart2: 'енгізіңіз', 
    subtitle: 'Тіркелгіңіздің қауіпсіздігі үшін жаңа, күшті құпия сөз жасаңыз.', 
    newPass: 'Жаңа құпия сөз', confPass: 'Құпия сөзді растау', 
    strength: 'Құпия сөз күші:', weak: 'Әлсіз', medium: 'Орташа', strong: 'Күшті',
    reqTitle: 'Құпия сөз келесі талаптарға сай болуы керек:',
    req1: 'Кемінде 8 таңбадан тұруы керек',
    req2: 'Бас және кіші әріптер бар',
    req3: 'Кемінде 1 сан болуы керек',
    req4: 'Кемінде 1 арнайы таңба болуы керек (!@#$%^&...)',
    updateBtn: 'Құпия сөзді жаңарту',
    errFill: 'Барлық өрістерді толтырыңыз', errMatch: 'Құпия сөздер сәйкес келмейді', errNetwork: 'Желі қатесі', success: 'Құпия сөз сәтті жаңартылды!', errorTitle: 'Қате' 
  },
  tg: { 
    titlePart1: 'Пароли навро ', titlePart2: 'ворид кунед', 
    subtitle: 'Барои амнияти ҳисоби шумо, пароли нав ва қавӣ эҷод кунед.', 
    newPass: 'Пароли нав', confPass: 'Тасдиқи парол', 
    strength: 'Қувваи парол:', weak: 'Заиф', medium: 'Миёна', strong: 'Қавӣ',
    reqTitle: 'Парол бояд ба талаботҳои зерин ҷавобгӯ бошад:',
    req1: 'На камтар аз 8 аломат',
    req2: 'Ҳарфҳои калон ва хурд дорад',
    req3: 'На камтар аз 1 рақам дорад',
    req4: 'На камтар аз 1 аломати махсус дорад (!@#$%^&...)',
    updateBtn: 'Паролро навсозӣ кунед',
    errFill: 'Ҳамаи майдонҳоро пур кунед', errMatch: 'Рамзҳо мувофиқат намекунанд', errNetwork: 'Хатои шабака', success: 'Парол бо муваффақият нав карда шуд!', errorTitle: 'Хатогӣ' 
  },
  ja: { 
    titlePart1: '新しいパスワードを', titlePart2: '入力してください', 
    subtitle: 'アカウントのセキュリティのために、新しい強力なパスワードを作成してください。', 
    newPass: '新しいパスワード', confPass: 'パスワードの確認', 
    strength: 'パスワードの強度:', weak: '弱い', medium: '中', strong: '強い',
    reqTitle: 'パスワードは次の要件を満たす必要があります:',
    req1: '8文字以上',
    req2: '大文字と小文字を含める',
    req3: '1つ以上の数字を含める',
    req4: '1つ以上の特殊文字を含める (!@#$%^&...)',
    updateBtn: 'パスワードを更新する',
    errFill: 'すべてのフィールドに入力してください', errMatch: 'パスワードが一致しません', errNetwork: 'ネットワークエラー', success: 'パスワードが正常に更新されました！', errorTitle: 'エラー' 
  },
  ko: { 
    titlePart1: '새 비밀번호를 ', titlePart2: '입력하세요', 
    subtitle: '계정 보안을 위해 새롭고 강력한 비밀번호를 만드세요.', 
    newPass: '새 비밀번호', confPass: '비밀번호 확인', 
    strength: '비밀번호 강도:', weak: '약함', medium: '보통', strong: '강함',
    reqTitle: '비밀번호는 다음 요구 사항을 충족해야 합니다:',
    req1: '최소 8자 이상',
    req2: '대문자와 소문자 포함',
    req3: '최소 1개의 숫자 포함',
    req4: '최소 1개의 특수 문자 포함 (!@#$%^&...)',
    updateBtn: '비밀번호 업데이트',
    errFill: '모든 필드를 입력해주세요', errMatch: '비밀번호가 일치하지 않습니다', errNetwork: '네트워크 오류', success: '비밀번호가 성공적으로 업데이트되었습니다!', errorTitle: '오류' 
  }
};

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, language = 'en' } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  // Password Requirements
  const req1Met = password.length >= 8;
  const req2Met = /[a-z]/.test(password) && /[A-Z]/.test(password);
  const req3Met = /\d/.test(password);
  const req4Met = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const metCount = [req1Met, req2Met, req3Met, req4Met].filter(Boolean).length;
  
  let strengthText = t.weak;
  let strengthColor = '#EF4444'; // Red
  let filledBars = 1;

  if (metCount === 0) {
    strengthText = '';
    filledBars = 0;
  } else if (metCount === 1 || metCount === 2) {
    strengthText = t.weak;
    strengthColor = '#EF4444';
    filledBars = metCount;
  } else if (metCount === 3) {
    strengthText = t.medium;
    strengthColor = '#EAB308'; // Yellow
    filledBars = 3;
  } else if (metCount === 4) {
    strengthText = t.strong;
    strengthColor = '#22C55E'; // Green
    filledBars = 4;
  }

  const handleSave = async () => {
    if (!password || !confirmPassword) {
      Alert.alert(t.errorTitle, t.errFill);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t.errorTitle, t.errMatch);
      return;
    }
    if (metCount < 4) {
      Alert.alert(t.errorTitle, t.reqTitle);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, newPassword: password, language })
      });
      
      let data = {};
      const responseText = await response.text();
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Non-JSON response:', responseText);
        Alert.alert(t.errorTitle, 'Server is not updated or returned an invalid response. Please update the backend server.');
        return;
      }
      
      if (response.ok) {
        Alert.alert('', t.success, [
          { text: 'OK', onPress: () => navigation.navigate('AuthScreen') }
        ]);
      } else {
        Alert.alert(t.errorTitle, data.error || 'Server error');
      }
    } catch (error) {
      console.error('Reset password error:', error);
      Alert.alert(t.errorTitle, t.errNetwork);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRequirement = (isMet, text) => (
    <View style={styles.reqRow}>
      {isMet ? (
        <MaterialCommunityIcons name="check-circle-outline" size={20} color="#22C55E" />
      ) : (
        <MaterialCommunityIcons name="circle-outline" size={20} color="#555566" />
      )}
      <Text style={[styles.reqText, isMet && styles.reqTextMet]}>{text}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AuthScreen')} activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          <View style={styles.heroContainer}>
            <Image 
              source={require('../assets/reset_password_hero.jpg')} 
              style={styles.heroImage} 
              resizeMode="contain"
            />
          </View>

          <View style={styles.titleContainer}>
            <Text style={styles.titleText}>
              {t.titlePart1}
              <Text style={styles.titleHighlight}>{t.titlePart2}</Text>
            </Text>
            <Text style={styles.subtitleText}>{t.subtitle}</Text>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t.newPass}</Text>
              <TextInput
                style={styles.input}
                placeholder="........"
                placeholderTextColor="#555566"
                secureTextEntry={!showPassword}
                autoCapitalize="none"
                value={password}
                onChangeText={setPassword}
              />
            </View>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#888899" />
            </TouchableOpacity>
          </View>

          {/* Strength Indicator */}
          {password.length > 0 && (
            <View style={styles.strengthContainer}>
              <Text style={styles.strengthLabel}>{t.strength}</Text>
              <View style={styles.barsContainer}>
                {[1, 2, 3, 4].map((bar) => (
                  <View 
                    key={bar} 
                    style={[
                      styles.strengthBar, 
                      bar <= filledBars && { backgroundColor: strengthColor }
                    ]} 
                  />
                ))}
              </View>
              <Text style={[styles.strengthValue, { color: strengthColor }]}>{strengthText}</Text>
            </View>
          )}

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />
            <View style={styles.inputWrapper}>
              <Text style={styles.inputLabel}>{t.confPass}</Text>
              <TextInput
                style={styles.input}
                placeholder="........"
                placeholderTextColor="#555566"
                secureTextEntry={!showConfirmPassword}
                autoCapitalize="none"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#888899" />
            </TouchableOpacity>
          </View>

          {/* Requirements List */}
          <View style={styles.requirementsContainer}>
            <Text style={styles.reqTitle}>{t.reqTitle}</Text>
            {renderRequirement(req1Met, t.req1)}
            {renderRequirement(req2Met, t.req2)}
            {renderRequirement(req3Met, t.req3)}
            {renderRequirement(req4Met, t.req4)}
          </View>

          <View style={styles.spacer} />

          {/* Main Button */}
          <TouchableOpacity 
            style={[styles.updateButton, isLoading && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <>
                <Text style={styles.updateButtonText}>{t.updateBtn}</Text>
                <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
              </>
            )}
          </TouchableOpacity>
          
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
    marginTop: 10,
    marginBottom: 20,
  },
  heroImage: {
    width: 250,
    height: 180,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 26,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  titleHighlight: {
    color: '#A855F7',
  },
  subtitleText: {
    color: '#888899',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    height: 64,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  inputWrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  inputLabel: {
    color: '#888899',
    fontSize: 11,
    marginBottom: 2,
  },
  input: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    padding: 0,
    margin: 0,
    height: 20,
  },
  eyeIcon: {
    padding: 10,
  },
  strengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 5,
  },
  strengthLabel: {
    color: '#555566',
    fontSize: 12,
    marginRight: 10,
  },
  barsContainer: {
    flex: 1,
    flexDirection: 'row',
    gap: 4,
    marginRight: 10,
  },
  strengthBar: {
    flex: 1,
    height: 4,
    backgroundColor: '#1A1A2E',
    borderRadius: 2,
  },
  strengthValue: {
    fontSize: 12,
    fontWeight: 'bold',
    width: 45,
    textAlign: 'right',
  },
  requirementsContainer: {
    marginTop: 10,
    paddingHorizontal: 5,
  },
  reqTitle: {
    color: '#888899',
    fontSize: 13,
    marginBottom: 12,
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  reqText: {
    color: '#555566',
    fontSize: 13,
    marginLeft: 10,
  },
  reqTextMet: {
    color: '#E0E0E0',
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  updateButton: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 10,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  updateButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
  },
});
