import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, ScrollView, StatusBar, Platform } from 'react-native';
import { Image, ImageBackground } from 'expo-image';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ROLES = [
  {
    id: 'student',
    title: 'Student',
    subtitle: 'Practice and develop yourself',
    image: require('../assets/role_student.png'),
    bgUnselected: require('../assets/student_card_unselected.png'),
    bgSelected: require('../assets/student_card_selected.png'),
    aspectRatio: 1024 / 479,
    color: '#32CD32', // Green
  },
  {
    id: 'parent',
    title: 'Parent',
    subtitle: "Track and support your child's achievements",
    image: require('../assets/role_parent.png'),
    bgUnselected: require('../assets/parent_card_unselected.png'),
    bgSelected: require('../assets/parent_card_selected.png'),
    aspectRatio: 1024 / 448,
    color: '#A855F7', // Purple
  },
  {
    id: 'teacher',
    title: 'Teacher',
    subtitle: 'Manage and develop your students',
    image: require('../assets/role_teacher.png'),
    bgUnselected: require('../assets/teacher_card_unselected.png'),
    bgSelected: require('../assets/teacher_card_selected.png'),
    aspectRatio: 1024 / 448,
    color: '#3B82F6', // Blue
  },
];

const TRANSLATIONS = {
  en: { 
    step: 'STEP 3', title: 'CHOOSE YOUR ROLE', next: 'NEXT',
    studentTitle: 'Student', studentSubtitle: 'Practice and develop yourself',
    parentTitle: 'Parent', parentSubtitle: "Track and support your child's achievements",
    teacherTitle: 'Teacher', teacherSubtitle: 'Manage and develop your students'
  },
  ru: { 
    step: 'ШАГ 3', title: 'ВЫБЕРИТЕ РОЛЬ', next: 'ДАЛЕЕ',
    studentTitle: 'Ученик', studentSubtitle: 'Практикуйтесь и развивайтесь',
    parentTitle: 'Родитель', parentSubtitle: 'Следите за достижениями ребенка',
    teacherTitle: 'Учитель', teacherSubtitle: 'Управляйте своими учениками'
  },
  uz: { 
    step: '3-QADAM', title: 'ROLNI TANLANG', next: 'KEYINGISI',
    studentTitle: 'O\'quvchi', studentSubtitle: 'O\'rganing va rivojlaning',
    parentTitle: 'Ota-ona', parentSubtitle: 'Farzandingiz yutuqlarini kuzating',
    teacherTitle: 'O\'qituvchi', teacherSubtitle: 'O\'quvchilaringizni boshqaring'
  },
  ar: { 
    step: 'الخطوة 3', title: 'اختر دورك', next: 'التالي',
    studentTitle: 'طالب', studentSubtitle: 'تدرب وطور نفسك',
    parentTitle: 'والد', parentSubtitle: 'تتبع إنجازات طفلك',
    teacherTitle: 'معلم', teacherSubtitle: 'أدر طلابك'
  },
  tr: { 
    step: 'ADIM 3', title: 'ROLÜNÜZÜ SEÇİN', next: 'İLERİ',
    studentTitle: 'Öğrenci', studentSubtitle: 'Pratik yapın ve kendinizi geliştirin',
    parentTitle: 'Ebeveyn', parentSubtitle: 'Çocuğunuzun başarılarını takip edin',
    teacherTitle: 'Öğretmen', teacherSubtitle: 'Öğrencilerinizi yönetin'
  },
  zh: { 
    step: '第3步', title: '选择角色', next: '下一步',
    studentTitle: '学生', studentSubtitle: '练习并提升自己',
    parentTitle: '家长', parentSubtitle: '跟踪和支持孩子的成就',
    teacherTitle: '教师', teacherSubtitle: '管理和培养您的学生'
  },
  ky: { 
    step: '3-КАДАМ', title: 'РОЛДУ ТАНДАҢЫЗ', next: 'КИЙИНКИСИ',
    studentTitle: 'Окуучу', studentSubtitle: 'Практика жасаңыз жана өнүгүңүз',
    parentTitle: 'Ата-эне', parentSubtitle: 'Балаңыздын жетишкендиктерин көзөмөлдөңүз',
    teacherTitle: 'Мугалим', teacherSubtitle: 'Окуучуларыңызды башкарыңыз'
  },
  kk: { 
    step: '3-ҚАДАМ', title: 'РӨЛДІ ТАҢДАҢЫЗ', next: 'КЕЛЕСІ',
    studentTitle: 'Оқушы', studentSubtitle: 'Тәжірибе жасап, өзіңізді дамытыңыз',
    parentTitle: 'Ата-ана', parentSubtitle: 'Балаңыздың жетістіктерін қадағалаңыз',
    teacherTitle: 'Мұғалім', teacherSubtitle: 'Оқушыларыңызды басқарыңыз'
  },
  tg: { 
    step: 'ҚАДАМИ 3', title: 'НАҚШИ ХУДРО ИНТИХОБ КУНЕД', next: 'БАЪДӢ',
    studentTitle: 'Хонанда', studentSubtitle: 'Таҷриба кунед ва худро рушд диҳед',
    parentTitle: 'Волидайн', parentSubtitle: 'Дастовардҳои фарзанди худро пайгирӣ кунед',
    teacherTitle: 'Муаллим', teacherSubtitle: 'Хонандагони худро идора кунед'
  },
  ja: { 
    step: 'ステップ 3', title: '役割を選択', next: '次へ',
    studentTitle: '学生', studentSubtitle: '練習して自分を成長させる',
    parentTitle: '親', parentSubtitle: '子供の達成を追跡し支援する',
    teacherTitle: '教師', teacherSubtitle: '生徒を管理し育成する'
  },
  ko: { 
    step: '3단계', title: '역할 선택', next: '다음',
    studentTitle: '학생', studentSubtitle: '연습하고 자신을 발전시키세요',
    parentTitle: '부모', parentSubtitle: '자녀의 성취를 추적하고 지원하세요',
    teacherTitle: '교사', teacherSubtitle: '학생들을 관리하고 육성하세요'
  }
};

export default function StepThreeScreen({ navigation, route }) {
  const { language = 'en' } = route?.params || {};
  const t = TRANSLATIONS[language] || TRANSLATIONS['en'];
  const [selectedRole, setSelectedRole] = useState(null);

  const handleNext = () => {
    if (selectedRole) {
      // Proceed to AuthScreen
      navigation.navigate('AuthScreen', { ...route.params, role: selectedRole });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Header */}
      <View style={styles.headerCenter}>
        <Text style={styles.stepText}>{t.step}</Text>
        <View style={styles.pagination}>
          <View style={styles.dot} />
          <View style={styles.dot} />
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>{t.title}</Text>

        <View style={styles.rolesContainer}>
          {ROLES.map((role) => {
            const isSelected = selectedRole === role.id;

            if (role.bgUnselected) {
              const bgSource = isSelected ? role.bgSelected : role.bgUnselected;
              return (
                <TouchableOpacity
                  key={role.id}
                  activeOpacity={0.8}
                  onPress={() => setSelectedRole(role.id)}
                >
                  <ImageBackground
                    source={bgSource}
                    style={[styles.fullCardBackground, { aspectRatio: role.aspectRatio }]}
                    imageStyle={{ borderRadius: 16 }}
                    contentFit="fill"
                    transition={200}
                  >
                    <View style={[styles.fullCardTextContainer, role.id === 'parent' && { paddingLeft: 195 }]}>
                      <Text style={styles.roleTitle}>{t[`${role.id}Title`]}</Text>
                      <Text style={styles.roleSubtitle}>{t[`${role.id}Subtitle`]}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              );
            }

            return (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleCard,
                  isSelected ? { borderColor: role.color } : null,
                ]}
                activeOpacity={0.8}
                onPress={() => setSelectedRole(role.id)}
              >
                <Image source={role.image} style={styles.roleImage} contentFit="contain" transition={200} />
                
                <View style={styles.roleTextContainer}>
                  <Text style={styles.roleTitle}>{t[`${role.id}Title`]}</Text>
                  <Text style={styles.roleSubtitle}>{t[`${role.id}Subtitle`]}</Text>
                </View>

                {isSelected && (
                  <View style={[styles.checkIcon, { backgroundColor: role.color }]}>
                    <MaterialCommunityIcons name="check" size={16} color="#FFF" />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Footer / Next Button */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.nextButton, !selectedRole && styles.nextButtonDisabled]}
          activeOpacity={0.8}
          onPress={() => {
            requestAnimationFrame(() => {
              handleNext();
            });
          }}
          disabled={!selectedRole}
        >
          <Text style={styles.nextButtonText}>{t.next}</Text>
          <MaterialCommunityIcons name="chevron-right" size={28} color="#000" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#05050C',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerCenter: {
    alignItems: 'center',
    marginVertical: Platform.OS === 'android' ? 5 : 20,
  },
  stepText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
    letterSpacing: 1,
  },
  pagination: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#333344',
  },
  activeDot: {
    width: 24,
    backgroundColor: '#A855F7',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 30,
  },
  rolesContainer: {
    gap: 16,
  },
  fullCardBackground: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  fullCardTextContainer: {
    flex: 1,
    paddingLeft: 180, // Move text further right
    justifyContent: 'center',
    paddingRight: 24, // Keep it from touching the right edge/checkmark
  },
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0A0A16',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#1A1A2E',
    padding: 12,
    overflow: 'hidden',
    position: 'relative',
    height: 120, // Ensure fixed height for uniformity
  },
  roleImage: {
    width: 90,
    height: 90,
    marginRight: 16,
    borderRadius: 10,
  },
  roleTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  roleTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  roleSubtitle: {
    color: '#888899',
    fontSize: 15,
    lineHeight: 20,
    paddingRight: 24, // Leave space for checkmark
  },
  checkIcon: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    backgroundColor: '#05050C',
  },
  nextButton: {
    backgroundColor: '#FACC15', // Matches StepOneScreen
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  nextButtonDisabled: {
    opacity: 0.5,
  },
  nextButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 4,
  },
});
