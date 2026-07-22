import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, ScrollView, StatusBar, KeyboardAvoidingView, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../src/config/api';

const TRANSLATIONS = {
  en: { title: 'Reset Password', newPass: 'New password', confPass: 'Confirm password', save: 'Save Password', errFill: 'Please fill all fields', errMatch: 'Passwords do not match', errNetwork: 'Network error', success: 'Password updated successfully!', errorTitle: 'Error' },
  ru: { title: 'Сброс пароля', newPass: 'Новый пароль', confPass: 'Подтвердите пароль', save: 'Сохранить', errFill: 'Заполните все поля', errMatch: 'Пароли не совпадают', errNetwork: 'Ошибка сети', success: 'Пароль успешно обновлен!', errorTitle: 'Ошибка' },
  uz: { title: 'Parolni tiklash', newPass: 'Yangi parol', confPass: 'Parolni tasdiqlang', save: 'Saqlash', errFill: 'Barcha maydonlarni to\'ldiring', errMatch: 'Parollar mos kelmadi', errNetwork: 'Tarmoq xatosi', success: 'Parol muvaffaqiyatli yangilandi!', errorTitle: 'Xatolik' },
  ar: { title: 'إعادة تعيين كلمة المرور', newPass: 'كلمة مرور جديدة', confPass: 'تأكيد كلمة المرور', save: 'حفظ', errFill: 'يرجى تعبئة جميع الحقول', errMatch: 'كلمات المرور غير متطابقة', errNetwork: 'خطأ في الشبكة', success: 'تم تحديث كلمة المرور بنجاح!', errorTitle: 'خطأ' },
  tr: { title: 'Şifreyi Sıfırla', newPass: 'Yeni Şifre', confPass: 'Şifreyi onayla', save: 'Kaydet', errFill: 'Tüm alanları doldurun', errMatch: 'Şifreler eşleşmiyor', errNetwork: 'Ağ hatası', success: 'Şifre başarıyla güncellendi!', errorTitle: 'Hata' },
  zh: { title: '重置密码', newPass: '新密码', confPass: '确认密码', save: '保存', errFill: '请填写所有字段', errMatch: '密码不匹配', errNetwork: '网络错误', success: '密码更新成功！', errorTitle: '错误' },
  ky: { title: 'Сырсөздү калыбына келтирүү', newPass: 'Жаңы сырсөз', confPass: 'Сырсөздү ырастоо', save: 'Сактоо', errFill: 'Бардык талааларды толтуруңуз', errMatch: 'Сырсөздөр дал келбейт', errNetwork: 'Тармак катасы', success: 'Сырсөз ийгиликтүү жаңыртылды!', errorTitle: 'Ката' },
  kk: { title: 'Құпия сөзді қалпына келтіру', newPass: 'Жаңа құпия сөз', confPass: 'Құпия сөзді растау', save: 'Сақтау', errFill: 'Барлық өрістерді толтырыңыз', errMatch: 'Құпия сөздер сәйкес келмейді', errNetwork: 'Желі қатесі', success: 'Құпия сөз сәтті жаңартылды!', errorTitle: 'Қате' },
  tg: { title: 'Барқароркунии парол', newPass: 'Пароли нав', confPass: 'Тасдиқи парол', save: 'Захира кардан', errFill: 'Ҳамаи майдонҳоро пур кунед', errMatch: 'Рамзҳо мувофиқат намекунанд', errNetwork: 'Хатои шабака', success: 'Парол бо муваффақият нав карда шуд!', errorTitle: 'Хатогӣ' },
  ja: { title: 'パスワードのリセット', newPass: '新しいパスワード', confPass: 'パスワードの確認', save: '保存する', errFill: 'すべてのフィールドに入力してください', errMatch: 'パスワードが一致しません', errNetwork: 'ネットワークエラー', success: 'パスワードが正常に更新されました！', errorTitle: 'エラー' },
  ko: { title: '비밀번호 재설정', newPass: '새 비밀번호', confPass: '비밀번호 확인', save: '저장', errFill: '모든 필드를 입력해주세요', errMatch: '비밀번호가 일치하지 않습니다', errNetwork: '네트워크 오류', success: '비밀번호가 성공적으로 업데이트되었습니다!', errorTitle: '오류' }
};

export default function ResetPasswordScreen({ route, navigation }) {
  const { email, language = 'en' } = route.params || {};
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [isLoading, setIsLoading] = useState(false);

  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];

  const handleSave = async () => {
    if (!password || !confirmPassword) {
      Alert.alert(t.errorTitle, t.errFill);
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert(t.errorTitle, t.errMatch);
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000214" />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('AuthScreen')} activeOpacity={0.7}>
            <Ionicons name="close" size={28} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.heroContainer}>
            <View style={styles.iconCircle}>
              <MaterialCommunityIcons name="lock-reset" size={60} color="#A855F7" />
            </View>
            <Text style={styles.title}>{t.title}</Text>
          </View>

          {/* New Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.newPass}
              placeholderTextColor="#555566"
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
              <Feather name={showPassword ? "eye" : "eye-off"} size={18} color="#888899" />
            </TouchableOpacity>
          </View>

          {/* Confirm Password Input */}
          <View style={styles.inputContainer}>
            <Feather name="lock" size={18} color="#888899" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder={t.confPass}
              placeholderTextColor="#555566"
              secureTextEntry={!showConfirmPassword}
              autoCapitalize="none"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)} style={styles.eyeIcon}>
              <Feather name={showConfirmPassword ? "eye" : "eye-off"} size={18} color="#888899" />
            </TouchableOpacity>
          </View>

          <View style={styles.spacer} />

          {/* Main Button */}
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && { opacity: 0.7 }]} 
            activeOpacity={0.8}
            onPress={handleSave}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.sendButtonText}>{t.save}</Text>
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
    backgroundColor: '#000214',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  header: {
    paddingVertical: Platform.OS === 'android' ? 0 : 10,
    paddingHorizontal: 15,
    alignItems: 'flex-end',
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
    marginTop: 40,
    marginBottom: 50,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.3)',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
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
    marginBottom: 20,
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
    padding: 10,
  },
  spacer: {
    flex: 1,
    minHeight: 40,
  },
  sendButton: {
    backgroundColor: '#6D28D9',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: '#6D28D9',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  sendButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
