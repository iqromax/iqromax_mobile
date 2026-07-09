import React, { useState, useEffect, useRef, Suspense } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Animated, ScrollView, Platform, UIManager, LayoutAnimation, TextInput, Alert } from 'react-native';
import { Image, ImageBackground } from 'expo-image';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import { Canvas } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei/native';

const COIN_TRANSLATIONS = {
  en: 'Coin',
  ru: 'Монеты',
  uz: 'Tanga',
  ar: 'عملة',
  tr: 'Jeton',
  zh: '金币',
  ky: 'Монета',
  kk: 'Тиын',
  tg: 'Танга',
  ja: 'コイン',
  ko: '코인',
};

const DASHBOARD_TRANSLATIONS = {
  en: { title: "Math Master", subtitle: "Level 24", desc: "Great for learning math, conquer the world with this!", clothes: "CLOTHES", accessories: "ACCESSORIES", levelText: "LEVEL", toNextLevel: "To next level", startExercise: "START EXERCISE", stats: "STATISTICS", seeAll: "SEE ALL >", logic: "LOGIC", logicDesc: "Great!", speed: "SPEED", speedDesc: "Good", accuracy: "ACCURACY", accuracyDesc: "Excellent!", streak: "STREAK", streakDesc: "Days", navHome: "HOME", navExercise: "EXERCISE", navInventory: "INVENTORY", navRanking: "RANKING", navProfile: "PROFILE", missions: "MISSIONS", exerciseSubtitle: "Choose the exercise type that suits you and continue learning!", infoTitle: "About Simple Math", infoDesc: "The simple math exercise develops the skill of performing arithmetic operations quickly and correctly.", infoOpsLabel: "Operations:", infoOps: ["addition", "subtraction", "multiplication", "division"], infoExampleLabel: "Example:", examplesCountTitle: "NUMBER OF EXAMPLES", examplesCountSubtitle: "Choose from 7 to 25 examples", exampleWord: "examples", opsTitle: "OPERATIONS", opsSubtitle: "Choose the operation type", opsOddiy: "Simple", opsOddiyDesc: "Addition, subtraction, multiplication, division", opsF5: "Formula 5", opsF5Desc: "Formulas up to 5", opsF10: "Formula 10", opsF10Desc: "Formulas up to 10", opsAralash: "Mixed", opsAralashDesc: "All operations mixed", speedSelectTitle: "SPEED", speedSelectSubtitle: "Choose exercise speed", secondWord: "seconds", characters: "CHARACTERS", all: "ALL", abacusInfoTitle: "ABOUT ABACUS", abacusInfoDesc: "1 upper bead means 5, 4 lower beads mean 1 each.", abacusLearnRules: "Learn rules", abacusDifficulty: "DIFFICULTY LEVEL", abacusBeginner: "Beginner", abacusIntermediate: "Intermediate", abacusAdvanced: "Advanced", abacusOpsTitle: "OPERATIONS", abacusAddSub: "Addition & Subtraction", abacusMult: "Multiplication", abacusDiv: "Division", speedInfoTitle: "ABOUT SPEED MATH", speedInfoDesc: "Test your speed and accuracy by calculating against time!", speedListItem1: "Time-limited examples", speedListItem2: "Fast answer = more points", speedListItem3: "Accuracy is important!", speedExamplesTitle: "NUMBER OF EXAMPLES", speedExamplesSubtitle: "Choose 7 to 25 examples", speedTimeTitle: "TIME LIMIT", speedTimeSubtitle: "Choose from 0.5 to 2 seconds", speedOpsTitle: "OPERATIONS", speedOpsSubtitle: "Choose operation type", speedKopaytirish: "Multiplication", speedBolish: "Division", speedAralash: "Mixed", speedAllOps: "All operations", speedSecLabel: "seconds" , battleTabTitle: "BATTLE", battleYou: "YOU", battleOpponent: "Opponent", battleRating: "Rating", battleLevel: "Level" , bmOddiy: "Simple Battle", bmOddiyDesc: "Fast calculation with equals", bmReyting: "Rating Battle", bmReytingDesc: "With strong opponents for rating points", bmTurnir: "Tournament Battle", bmTurnirDesc: "Participate in tournaments and win prizes", bmDost: "Battle with Friend", bmDostDesc: "Invite your friend and compete" , bmDailyMission: "DAILY BATTLE MISSION", bmDailyMissionDesc: "Participate in 3 battles", bmDailyBonus: "DAILY BONUS" , bestResults: "BEST RESULTS", bestVictories: "Victories", bestStreak: "Winning streak", bestTime: "Fastest time" , quickOpponent: "QUICK OPPONENT", refresh: "Refresh" , startBattle: "START BATTLE", startBattleSubtext: "Choose an opponent and achieve victory!" , rankingTitle: "RANKING", rankingSubtitle: "The strongest mathematicians", platinumTarget: "to Platinum V", xpRemaining: "XP remaining", searchPlaceholder: "Search user...", statRating: "Rating", statSpeed: "Speed", statAccuracy: "Accuracy", statStreak: "Streak", statExercises: "Exercises", statAchievements: "Achievements", statXP: "XP", statCoin: "Coin", achievementsTitle: "ACHIEVEMENTS", achv14Days: "14 day streak", achvTop10: "Top 10", achvGold3: "Gold III", achvGeneric: "Achievement", activityTitle: "ACTIVITY HISTORY", activitySeeAll: "See all >", actSimple: "Simple math", actBattle: "Battle", actFast: "Fast math", actAbacus: "Abacus", actToday: "Today", actYesterday: "Yesterday", actWin: "Victory", collectionTitle: "My collection", collAvatars: "Avatars", collFrames: "Frames", collBgs: "Backgrounds", collChars: "Characters", collBtn: "GO TO INVENTORY >" },
  ru: { title: "Мастер математики", subtitle: "Уровень 24", desc: "Отлично для изучения математики, завоюйте мир с этим!", clothes: "ОДЕЖДА", accessories: "АКСЕССУАРЫ", levelText: "УРОВЕНЬ", toNextLevel: "До след. уровня", startExercise: "НАЧАТЬ ТРЕНИРОВКУ", stats: "СТАТИСТИКА", seeAll: "ВСЕ >", logic: "ЛОГИКА", logicDesc: "Отлично!", speed: "СКОРОСТЬ", speedDesc: "Хорошо", accuracy: "ТОЧНОСТЬ", accuracyDesc: "Превосходно!", streak: "СЕРИЯ", streakDesc: "Дней", navHome: "ГЛАВНАЯ", navExercise: "ТРЕНИРОВКА", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИИ", exerciseSubtitle: "Выберите подходящий тип упражнений и продолжайте обучение!", infoTitle: "О простом счете", infoDesc: "Упражнение на простой счет развивает навык быстрого и правильного выполнения арифметических операций.", infoOpsLabel: "Операции:", infoOps: ["сложение", "вычитание", "умножение", "деление"], infoExampleLabel: "Пример:", examplesCountTitle: "КОЛИЧЕСТВО ПРИМЕРОВ", examplesCountSubtitle: "Выберите от 7 до 25 примеров", exampleWord: "примеров", opsTitle: "ОПЕРАЦИИ", opsSubtitle: "Выберите тип операций", opsOddiy: "Простые", opsOddiyDesc: "Сложение, вычитание, умножение, деление", opsF5: "Формула 5", opsF5Desc: "Формулы до 5", opsF10: "Формула 10", opsF10Desc: "Формулы до 10", opsAralash: "Вперемешку", opsAralashDesc: "Все операции вперемешку", speedSelectTitle: "СКОРОСТЬ", speedSelectSubtitle: "Выберите скорость тренировки", secondWord: "секунд", characters: "ПЕРСОНАЖИ", all: "ВCЕ", abacusInfoTitle: "ОБ АБАКУСЕ", abacusInfoDesc: "1 верхняя косточка равна 5, 4 нижние — по 1.", abacusLearnRules: "Изучить правила", abacusDifficulty: "УРОВЕНЬ СЛОЖНОСТИ", abacusBeginner: "Новичок", abacusIntermediate: "Средний", abacusAdvanced: "Сложный", abacusOpsTitle: "ОПЕРАЦИИ", abacusAddSub: "Сложение и вычитание", abacusMult: "Умножение", abacusDiv: "Деление", speedInfoTitle: "О СКОРОСТНОМ СЧЕТЕ", speedInfoDesc: "Проверьте скорость и точность, решая примеры на время!", speedListItem1: "Примеры на время", speedListItem2: "Быстрый ответ = больше баллов", speedListItem3: "Точность важна!", speedExamplesTitle: "КОЛИЧЕСТВО ПРИМЕРОВ", speedExamplesSubtitle: "Выберите от 7 до 25 примеров", speedTimeTitle: "ЛИМИТ ВРЕМЕНИ", speedTimeSubtitle: "Выберите от 0.5 до 2 секунд", speedOpsTitle: "ОПЕРАЦИИ", speedOpsSubtitle: "Выберите тип операций", speedKopaytirish: "Умножение", speedBolish: "Деление", speedAralash: "Смешанно", speedAllOps: "Все операции", speedSecLabel: "секунд" , battleTabTitle: "БИТВА", battleYou: "ВЫ", battleOpponent: "Соперник", battleRating: "Рейтинг", battleLevel: "Уровень" , bmOddiy: "Простая Битва", bmOddiyDesc: "Быстрый счет с равными", bmReyting: "Рейтинговая Битва", bmReytingDesc: "С сильными противниками за очки", bmTurnir: "Турнирная Битва", bmTurnirDesc: "Участвуйте в турнирах и выигрывайте призы", bmDost: "Битва с Другом", bmDostDesc: "Пригласите друга и соревнуйтесь" , bmDailyMission: "ЕЖЕДНЕВНАЯ МИССИЯ", bmDailyMissionDesc: "Участвуйте в 3 битвах", bmDailyBonus: "ЕЖЕДНЕВНЫЙ БОНУС" , bestResults: "ЛУЧШИЕ РЕЗУЛЬТАТЫ", bestVictories: "Победы", bestStreak: "Серия побед", bestTime: "Лучшее время" , quickOpponent: "БЫСТРЫЙ ПРОТИВНИК", refresh: "Обновить" , startBattle: "НАЧАТЬ БИТВУ", startBattleSubtext: "Выберите противника и одержите победу!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Сильнейшие математики", platinumTarget: "до Platinum V", xpRemaining: "XP осталось", searchPlaceholder: "Поиск пользователя...", statRating: "Рейтинг", statSpeed: "Скорость", statAccuracy: "Точность", statStreak: "Серия", statExercises: "Упражнения", statAchievements: "Достижения", statXP: "Опыт", statCoin: "Монеты", achievementsTitle: "ДОСТИЖЕНИЯ", achv14Days: "14 дней подряд", achvTop10: "Топ 10", achvGold3: "Золото III", achvGeneric: "Достижение", activityTitle: "ИСТОРИЯ АКТИВНОСТИ", activitySeeAll: "Смотреть все >", actSimple: "Простой счет", actBattle: "Битва", actFast: "Быстрый счет", actAbacus: "Абакус", actToday: "Сегодня", actYesterday: "Вчера", actWin: "Победа", collectionTitle: "Моя коллекция", collAvatars: "Аватары", collFrames: "Рамки", collBgs: "Фоны", collChars: "Персонажи", collBtn: "ПЕРЕЙТИ В ИНВЕНТАРЬ >" },
  uz: { title: "Matematika Ustasi", subtitle: "24-daraja", desc: "Matematika o'rganishda zo'r, bu bilan dunyoni egallang!", clothes: "KIYIMLAR", accessories: "AKSESSUARLAR", levelText: "LEVEL", toNextLevel: "Keyingi levelgacha yana", startExercise: "MASHQNI BOSHLASH", stats: "STATISTIKALAR", seeAll: "BARCHASI >", logic: "MANTIQ", logicDesc: "Zor!", speed: "TEZLIK", speedDesc: "Yaxshi", accuracy: "ANIQLIK", accuracyDesc: "A'lo!", streak: "SERIYA", streakDesc: "Kun", navHome: "BOSH SAHIFA", navExercise: "MASHQ", navInventory: "INVENTAR", navRanking: "REYTING", navProfile: "PROFIL", missions: "MISSIYALAR", exerciseSubtitle: "O'zingizga mos mashq turini tanlang va o'rganishni davom eting!", infoTitle: "Oddiy hisob haqida", infoDesc: "Oddiy hisob mashqi arifmetik amallarni tez va to'g'ri bajarish ko'nikmasini rivojlantiradi.", infoOpsLabel: "Amallar:", infoOps: ["qo'shish", "ayirish", "ko'paytirish", "bo'lish"], infoExampleLabel: "Misol:", examplesCountTitle: "HADLAR SONI", examplesCountSubtitle: "7 dan 25 hadgacha tanlang", exampleWord: "had", opsTitle: "AMALLAR", opsSubtitle: "Amallar turini tanlang", opsOddiy: "Oddiy", opsOddiyDesc: "Qo'shish, ayirish, ko'paytirish, bo'lish", opsF5: "Formula 5", opsF5Desc: "5 gacha bo'lgan formulalar", opsF10: "Formula 10", opsF10Desc: "10 gacha bo'lgan formulalar", opsAralash: "Aralash", opsAralashDesc: "Barcha amallar aralash holda", speedSelectTitle: "TEZLIK", speedSelectSubtitle: "Mashq bajarish tezligini tanlang", secondWord: "soniya", characters: "PERSONAJLAR", all: "BARCHA", abacusInfoTitle: "ABAKUS (SOROBAN) HAQIDA", abacusInfoDesc: "Yuqori qatordagi 1 ta boncuk – 5 qiymatni, pastki qatordagi 4 ta boncuk – 1 qiymatni bildiradi.", abacusLearnRules: "Qoidalarni o'rganish", abacusDifficulty: "QIYINCHILIK DARAJASI", abacusBeginner: "Boshlang'ich", abacusIntermediate: "O'rta", abacusAdvanced: "Murakkab", abacusOpsTitle: "AMALLAR", abacusAddSub: "Qo'shish va Ayirish", abacusMult: "Ko'paytirish", abacusDiv: "Bo'lish", speedInfoTitle: "TEZKOR HISOBLASH HAQIDA", speedInfoDesc: "Vaqt bilan hisoblash orqali tezlik va aniqligingizni sinab ko'ring!", speedListItem1: "Vaqt cheklovi bilan misollar", speedListItem2: "Tez javob – ko'proq ball", speedListItem3: "Aniqlik muhim!", speedExamplesTitle: "MISOLLAR SONI", speedExamplesSubtitle: "7 dan 25 gacha misol tanlang", speedTimeTitle: "VAQT CHEKLOVI", speedTimeSubtitle: "0.5 soniyadan 2 soniyagacha vaqt tanlang", speedOpsTitle: "AMALLAR", speedOpsSubtitle: "Amallar turini tanlang", speedKopaytirish: "Ko'paytirish", speedBolish: "Bo'lish", speedAralash: "Aralash", speedAllOps: "Barcha amallar", speedSecLabel: "soniya" , battleTabTitle: "BATTLE", battleYou: "SIZ", battleOpponent: "Raqib", battleRating: "Reyting", battleLevel: "Level" , bmOddiy: "Oddiy Battle", bmOddiyDesc: "Teng kuchdagilar bilan tezkor hisoblash", bmReyting: "Reyting Battle", bmReytingDesc: "Reyting ochkolari uchun kuchli raqiblar bilan", bmTurnir: "Turnir Battle", bmTurnirDesc: "Turnirlarda qatnashing va sovrin yuting", bmDost: "Do'st bilan Battle", bmDostDesc: "Do'stingizni taklif qiling va bellashing" , bmDailyMission: "KUNLIK BATTLE MISSIYASI", bmDailyMissionDesc: "3 ta battle'da ishtirok eting", bmDailyBonus: "KUNLIK BONUS" , bestResults: "ENG YAXSHI NATIJALAR", bestVictories: "G'alabalar", bestStreak: "G'alaba seriyasi", bestTime: "Eng tez vaqt" , quickOpponent: "TEZKOR RAQIB", refresh: "Yangilash" , startBattle: "BATTLE BOSHLASH", startBattleSubtext: "Raqib tanlang va g'alabaga erishing!" , rankingTitle: "REYTING", rankingSubtitle: "Eng kuchli matematiklar", platinumTarget: "Platinum V gacha", xpRemaining: "XP qoldi", searchPlaceholder: "Foydalanuvchi qidirish...", statRating: "Reyting", statSpeed: "Tezlik", statAccuracy: "Aniqlik", statStreak: "Streak", statExercises: "Mashq", statAchievements: "Yutuq", statXP: "XP", statCoin: "Coin", achievementsTitle: "YUTUQLAR", achv14Days: "14 kunlik seriya", achvTop10: "Top 10", achvGold3: "Gold III", achvGeneric: "Yutuq", activityTitle: "FAOLIYAT TARIXI", activitySeeAll: "Barchasini ko'rish >", actSimple: "Oddiy hisob", actBattle: "Battle", actFast: "Tezkor hisob", actAbacus: "Abakus", actToday: "Bugun", actYesterday: "Kecha", actWin: "G'alaba", collectionTitle: "Mening kolleksiyam", collAvatars: "Avatarlar", collFrames: "Ramkalar", collBgs: "Fonlar", collChars: "Personajlar", collBtn: "INVENTARGA O'TISH >" },
  ar: { title: "سيد الرياضيات", subtitle: "مستوى 24", desc: "رائع لتعلم الرياضيات، اغز العالم بهذا!", clothes: "ملابس", accessories: "إكسسوارات", levelText: "مستوى", toNextLevel: "للمستوى التالي", startExercise: "ابدأ التمرين", stats: "الإحصائيات", seeAll: "عرض الكل >", logic: "المنطق", logicDesc: "رائع!", speed: "السرعة", speedDesc: "جيد", accuracy: "الدقة", accuracyDesc: "ممتاز!", streak: "سلسلة", streakDesc: "أيام", navHome: "الرئيسية", navExercise: "تمرين", navInventory: "مخزون", navRanking: "تصنيف", navProfile: "ملف شخصي", missions: "المهام", exerciseSubtitle: "اختر نوع التمرين الذي يناسبك واستمر في التعلم!", infoTitle: "حول الحساب البسيط", infoDesc: "تمرين الحساب البسيط يطور مهارة إجراء العمليات الحسابية بسرعة وبشكل صحيح.", infoOpsLabel: "العمليات:", infoOps: ["جمع", "طرح", "ضرب", "قسمة"], infoExampleLabel: "مثال:", examplesCountTitle: "عدد الأمثلة", examplesCountSubtitle: "اختر من 7 إلى 25 مثالًا", exampleWord: "أمثلة", opsTitle: "العمليات", opsSubtitle: "اختر نوع العملية", opsOddiy: "بسيط", opsOddiyDesc: "جمع، طرح، ضرب، قسمة", opsF5: "صيغة 5", opsF5Desc: "صيغ حتى 5", opsF10: "صيغة 10", opsF10Desc: "صيغ حتى 10", opsAralash: "مختلط", opsAralashDesc: "جميع العمليات مختلطة", speedSelectTitle: "السرعة", speedSelectSubtitle: "اختر سرعة التمرين", secondWord: "ثواني", characters: "الشخصيات", all: "الكل", abacusInfoTitle: "حول المعداد", abacusInfoDesc: "حبة علوية واحدة تعني 5، 4 حبات سفلية تعني 1 لكل منها.", abacusLearnRules: "تعلم القواعد", abacusDifficulty: "مستوى الصعوبة", abacusBeginner: "مبتدئ", abacusIntermediate: "متوسط", abacusAdvanced: "متقدم", abacusOpsTitle: "العمليات", abacusAddSub: "الجمع والطرح", abacusMult: "الضرب", abacusDiv: "القسمة", speedInfoTitle: "حول الحساب السريع", speedInfoDesc: "اختبر سرعتك ودقتك عن طريق الحساب ضد الوقت!", speedListItem1: "أمثلة محدودة بوقت", speedListItem2: "إجابة سريعة = نقاط أكثر", speedListItem3: "الدقة مهمة!", speedExamplesTitle: "عدد الأمثلة", speedExamplesSubtitle: "اختر 7 إلى 25 مثالًا", speedTimeTitle: "الحد الزمني", speedTimeSubtitle: "اختر من 0.5 إلى 2 ثانية", speedOpsTitle: "العمليات", speedOpsSubtitle: "اختر نوع العملية", speedKopaytirish: "ضرب", speedBolish: "قسمة", speedAralash: "مختلط", speedAllOps: "جميع العمليات", speedSecLabel: "ثواني" , battleTabTitle: "معركة", battleYou: "أنت", battleOpponent: "الخصم", battleRating: "تقييم", battleLevel: "مستوى" , bmOddiy: "معركة بسيطة", bmOddiyDesc: "حساب سريع مع المتكافئين", bmReyting: "معركة التقييم", bmReytingDesc: "مع خصوم أقوياء للحصول على نقاط", bmTurnir: "معركة البطولة", bmTurnirDesc: "شارك في البطولات واربح جوائز", bmDost: "معركة مع صديق", bmDostDesc: "ادع صديقك وتنافس" , bmDailyMission: "المهمة اليومية", bmDailyMissionDesc: "شارك في 3 معارك", bmDailyBonus: "مكافأة يومية" , bestResults: "أفضل النتائج", bestVictories: "انتصارات", bestStreak: "سلسلة انتصارات", bestTime: "أسرع وقت" , quickOpponent: "الخصم السريع", refresh: "تحديث" , startBattle: "بدء المعركة", startBattleSubtext: "اختر خصمًا وحقق النصر!" , rankingTitle: "التصنيف", rankingSubtitle: "أقوى علماء الرياضيات", platinumTarget: "إلى Platinum V", xpRemaining: "XP متبقي", searchPlaceholder: "البحث عن مستخدم...", statRating: "التقييم", statSpeed: "السرعة", statAccuracy: "الدقة", statStreak: "سلسلة", statExercises: "التمارين", statAchievements: "الإنجازات", statXP: "نقاط الخبرة", statCoin: "عملات", achievementsTitle: "الإنجازات", achv14Days: "سلسلة 14 يومًا", achvTop10: "أفضل 10", achvGold3: "الذهب III", achvGeneric: "إنجاز", activityTitle: "سجل النشاط", activitySeeAll: "عرض الكل >", actSimple: "حساب بسيط", actBattle: "معركة", actFast: "حساب سريع", actAbacus: "معداد", actToday: "اليوم", actYesterday: "أمس", actWin: "انتصار", collectionTitle: "مجموعتي", collAvatars: "الصور الرمزية", collFrames: "الإطارات", collBgs: "الخلفيات", collChars: "الشخصيات", collBtn: "الذهاب إلى المخزون >" },
  tr: { title: "Matematik Ustası", subtitle: "Seviye 24", desc: "Matematik öğrenmek için harika, bununla dünyayı fethet!", clothes: "GİYSİLER", accessories: "AKSESUARLAR", levelText: "SEVİYE", toNextLevel: "Sonraki seviyeye", startExercise: "EGZERSİZE BAŞLA", stats: "İSTATİSTİKLER", seeAll: "TÜMÜ >", logic: "MANTIK", logicDesc: "Harika!", speed: "HIZ", speedDesc: "İyi", accuracy: "DOĞRULUK", accuracyDesc: "Mükemmel!", streak: "SERİ", streakDesc: "Gün", navHome: "ANA SAYFA", navExercise: "EGZERSİZ", navInventory: "ENVANTER", navRanking: "SIRALAMA", navProfile: "PROFİL", missions: "GÖREVLER", exerciseSubtitle: "Size uygun egzersiz türünü seçin ve öğrenmeye devam edin!", infoTitle: "Basit Matematik Hakkında", infoDesc: "Basit matematik egzersizi aritmetik işlemleri hızlı ve doğru bir şekilde yapma becerisini geliştirir.", infoOpsLabel: "İşlemler:", infoOps: ["toplama", "çıkarma", "çarpma", "bölme"], infoExampleLabel: "Örnek:", examplesCountTitle: "ÖRNEK SAYISI", examplesCountSubtitle: "7 ile 25 arası örnek seçin", exampleWord: "örnek", opsTitle: "İŞLEMLER", opsSubtitle: "İşlem türünü seçin", opsOddiy: "Basit", opsOddiyDesc: "Toplama, çıkarma, çarpma, bölme", opsF5: "Formül 5", opsF5Desc: "5'e kadar formüller", opsF10: "Formül 10", opsF10Desc: "10'a kadar formüller", opsAralash: "Karışık", opsAralashDesc: "Tüm işlemler karışık", speedSelectTitle: "HIZ", speedSelectSubtitle: "Egzersiz hızını seçin", secondWord: "saniye", characters: "KARAKTERLER", all: "TÜMÜ", abacusInfoTitle: "ABAKÜS HAKKINDA", abacusInfoDesc: "Üst sıradaki 1 boncuk 5, alt sıradaki 4 boncuk her biri 1 değerindedir.", abacusLearnRules: "Kuralları öğren", abacusDifficulty: "ZORLUK SEVİYESİ", abacusBeginner: "Başlangıç", abacusIntermediate: "Orta", abacusAdvanced: "Zor", abacusOpsTitle: "İŞLEMLER", abacusAddSub: "Toplama ve Çıkarma", abacusMult: "Çarpma", abacusDiv: "Bölme", speedInfoTitle: "HIZLI HESAPLAMA HAKKINDA", speedInfoDesc: "Zamana karşı hesaplayarak hızınızı ve doğruluğunuzu test edin!", speedListItem1: "Zaman sınırlı örnekler", speedListItem2: "Hızlı cevap = daha fazla puan", speedListItem3: "Doğruluk önemlidir!", speedExamplesTitle: "ÖRNEK SAYISI", speedExamplesSubtitle: "7 ile 25 arası örnek seçin", speedTimeTitle: "ZAMAN SINIRI", speedTimeSubtitle: "0.5 ile 2 saniye arası seçin", speedOpsTitle: "İŞLEMLER", speedOpsSubtitle: "İşlem türünü seçin", speedKopaytirish: "Çarpma", speedBolish: "Bölme", speedAralash: "Karışık", speedAllOps: "Tüm işlemler", speedSecLabel: "saniye" , battleTabTitle: "SAVAŞ", battleYou: "SEN", battleOpponent: "Rakip", battleRating: "Derece", battleLevel: "Seviye" , bmOddiy: "Basit Savaş", bmOddiyDesc: "Eşit güçtekilerle hızlı hesaplama", bmReyting: "Derece Savaşı", bmReytingDesc: "Puanlar için güçlü rakiplerle", bmTurnir: "Turnuva Savaşı", bmTurnirDesc: "Turnuvalara katılın ve ödüller kazanın", bmDost: "Arkadaşla Savaş", bmDostDesc: "Arkadaşınızı davet edin ve yarışın" , bmDailyMission: "GÜNLÜK GÖREV", bmDailyMissionDesc: "3 savaşa katılın", bmDailyBonus: "GÜNLÜK BONUS" , bestResults: "EN İYİ SONUÇLAR", bestVictories: "Zaferler", bestStreak: "Galibiyet serisi", bestTime: "En hızlı zaman" , quickOpponent: "HIZLI RAKİP", refresh: "Yenile" , startBattle: "SAVAŞA BAŞLA", startBattleSubtext: "Bir rakip seçin ve zafere ulaşın!" , rankingTitle: "SIRALAMA", rankingSubtitle: "En güçlü matematikçiler", platinumTarget: "Platinum V'e kadar", xpRemaining: "XP kaldı", searchPlaceholder: "Kullanıcı ara...", statRating: "Derece", statSpeed: "Hız", statAccuracy: "Doğruluk", statStreak: "Seri", statExercises: "Egzersizler", statAchievements: "Başarılar", statXP: "XP", statCoin: "Jeton", achievementsTitle: "BAŞARILAR", achv14Days: "14 günlük seri", achvTop10: "İlk 10", achvGold3: "Altın III", achvGeneric: "Başarı", activityTitle: "ETKİNLİK GEÇMİŞİ", activitySeeAll: "Tümünü gör >", actSimple: "Basit hesap", actBattle: "Savaş", actFast: "Hızlı hesap", actAbacus: "Abaküs", actToday: "Bugün", actYesterday: "Dün", actWin: "Zafer", collectionTitle: "Koleksiyonum", collAvatars: "Avatarlar", collFrames: "Çerçeveler", collBgs: "Arka Planlar", collChars: "Karakterler", collBtn: "ENVANTERE GİT >" },
  zh: { title: "数学大师", subtitle: "24级", desc: "非常适合学习数学，用它征服世界！", clothes: "服装", accessories: "配饰", levelText: "等级", toNextLevel: "距离下一级还有", startExercise: "开始练习", stats: "统计数据", seeAll: "全部 >", logic: "逻辑", logicDesc: "太棒了！", speed: "速度", speedDesc: "很好", accuracy: "准确度", accuracyDesc: "极好！", streak: "连胜", streakDesc: "天", navHome: "首页", navExercise: "练习", navInventory: "库存", navRanking: "排名", navProfile: "个人资料", missions: "任务", exerciseSubtitle: "选择适合您的练习类型并继续学习！", infoTitle: "关于简单算术", infoDesc: "简单算术练习培养快速正确执行算术运算的技能。", infoOpsLabel: "运算:", infoOps: ["加法", "减法", "乘法", "除法"], infoExampleLabel: "例子:", examplesCountTitle: "例子数量", examplesCountSubtitle: "选择7到25个例子", exampleWord: "个例子", opsTitle: "运算", opsSubtitle: "选择运算类型", opsOddiy: "简单", opsOddiyDesc: "加、减、乘、除", opsF5: "公式5", opsF5Desc: "最高为5的公式", opsF10: "公式10", opsF10Desc: "最高为10的公式", opsAralash: "混合", opsAralashDesc: "所有运算混合", speedSelectTitle: "速度", speedSelectSubtitle: "选择练习速度", secondWord: "秒", characters: "角色", all: "全部", abacusInfoTitle: "关于算盘", abacusInfoDesc: "上面1颗珠子表示5，下面4颗珠子各表示1。", abacusLearnRules: "学习规则", abacusDifficulty: "难度级别", abacusBeginner: "初学者", abacusIntermediate: "中级", abacusAdvanced: "高级", abacusOpsTitle: "运算", abacusAddSub: "加法和减法", abacusMult: "乘法", abacusDiv: "除法", speedInfoTitle: "关于快速计算", speedInfoDesc: "通过计时计算测试您的速度和准确性！", speedListItem1: "限时例子", speedListItem2: "答得快=得分高", speedListItem3: "准确性很重要！", speedExamplesTitle: "例子数量", speedExamplesSubtitle: "选择7到25个例子", speedTimeTitle: "时间限制", speedTimeSubtitle: "选择0.5到2秒", speedOpsTitle: "运算", speedOpsSubtitle: "选择运算类型", speedKopaytirish: "乘法", speedBolish: "除法", speedAralash: "混合", speedAllOps: "所有运算", speedSecLabel: "秒" , battleTabTitle: "战斗", battleYou: "你", battleOpponent: "对手", battleRating: "评分", battleLevel: "等级" , bmOddiy: "简单战斗", bmOddiyDesc: "与实力相当者进行快速计算", bmReyting: "排名战斗", bmReytingDesc: "与强敌交手赚取积分", bmTurnir: "锦标赛战斗", bmTurnirDesc: "参加锦标赛赢取奖品", bmDost: "好友战斗", bmDostDesc: "邀请好友并竞争" , bmDailyMission: "每日任务", bmDailyMissionDesc: "参与3场战斗", bmDailyBonus: "每日奖励" , bestResults: "最佳结果", bestVictories: "胜利", bestStreak: "连胜", bestTime: "最快时间" , quickOpponent: "快速对手", refresh: "刷新" , startBattle: "开始战斗", startBattleSubtext: "选择对手并取得胜利！" , rankingTitle: "排名", rankingSubtitle: "最强的数学家", platinumTarget: "到 Platinum V", xpRemaining: "XP 剩余" },
  ky: { title: "Математика чебери", subtitle: "24-деңгээл", desc: "Математика үйрөнүү үчүн сонун, муну менен дүйнөнү багындыр!", clothes: "КИЙИМДЕР", accessories: "АКСЕССУАРЛАР", levelText: "ДЕҢГЭЭЛ", toNextLevel: "Кийинки деңгээлге чейин", startExercise: "КӨНҮГҮҮНҮ БАШТОО", stats: "СТАТИСТИКА", seeAll: "БАРДЫГЫ >", logic: "ЛОГИКА", logicDesc: "Жакшы!", speed: "ЫЛДАМДЫК", speedDesc: "Жакшы", accuracy: "ТАКТЫК", accuracyDesc: "Эң жакшы!", streak: "СЕРИЯ", streakDesc: "Күн", navHome: "БАШКЫ БЕТ", navExercise: "КӨНҮГҮҮ", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИЯЛАР", exerciseSubtitle: "Сизге туура келген көнүгүү түрүн тандап, үйрөнүүнү улантыңыз!", infoTitle: "Жөнөкөй эсеп жөнүндө", infoDesc: "Жөнөкөй эсеп көнүгүүсү арифметикалык амалдарды тез жана туура аткаруу көндүмүн өнүктүрөт.", infoOpsLabel: "Амалдар:", infoOps: ["кошуу", "кемитүү", "көбөйтүү", "бөлүү"], infoExampleLabel: "Мисал:", examplesCountTitle: "МИСАЛДАР САНЫ", examplesCountSubtitle: "7ден 25ке чейин мисал тандаңыз", exampleWord: "мисал", opsTitle: "АМАЛДАР", opsSubtitle: "Амалдын түрүн тандаңыз", opsOddiy: "Жөнөкөй", opsOddiyDesc: "Кошуу, кемитүү, көбөйтүү, бөлүү", opsF5: "Формула 5", opsF5Desc: "5ке чейинки формулалар", opsF10: "Формула 10", opsF10Desc: "10го чейинки формулалар", opsAralash: "Аралаш", opsAralashDesc: "Бардык амалдар аралаш", speedSelectTitle: "ЫЛДАМДЫК", speedSelectSubtitle: "Көнүгүү ылдамдыгын тандаңыз", secondWord: "секунд", characters: "ПЕРСОНАЖДАР", all: "БАРДЫГЫ", abacusInfoTitle: "АБАКУС ЖӨНҮНДӨ", abacusInfoDesc: "Жогорку катардагы 1 мончок 5ти, төмөнкү катардагы 4 мончоктун ар бири 1ди билдирет.", abacusLearnRules: "Эрежелерди үйрөнүү", abacusDifficulty: "КЫЙЫНЧЫЛЫК ДЕҢГЭЭЛИ", abacusBeginner: "Башталгыч", abacusIntermediate: "Орто", abacusAdvanced: "Кыйын", abacusOpsTitle: "АМАЛДАР", abacusAddSub: "Кошуу жана Кемитүү", abacusMult: "Көбөйтүү", abacusDiv: "Бөлүү", speedInfoTitle: "ЫКЧАМ ЭСЕП ЖӨНҮНДӨ", speedInfoDesc: "Убакыт менен эсептеп ылдамдыгыңызды жана тактыгыңызды сынап көрүңүз!", speedListItem1: "Убакыт чектелген мисалдар", speedListItem2: "Тез жооп = көбүрөөк упай", speedListItem3: "Тактык маанилүү!", speedExamplesTitle: "МИСАЛДАР САНЫ", speedExamplesSubtitle: "7ден 25ке чейин мисал тандаңыз", speedTimeTitle: "УБАКЫТ ЧЕГИ", speedTimeSubtitle: "0.5тен 2 секундага чейин тандаңыз", speedOpsTitle: "АМАЛДАР", speedOpsSubtitle: "Амалдын түрүн тандаңыз", speedKopaytirish: "Көбөйтүү", speedBolish: "Бөлүү", speedAralash: "Аралаш", speedAllOps: "Бардык амалдар", speedSecLabel: "секунд" , battleTabTitle: "САЛМАШ", battleYou: "СИЗ", battleOpponent: "Атаандаш", battleRating: "Рейтинг", battleLevel: "Деңгээл" , bmOddiy: "Жөнөкөй салмат", bmOddiyDesc: "Тең күчтүүлөр менен тез эсептөө", bmReyting: "Рейтинг салмат", bmReytingDesc: "Упайлар үчүн күчтүү атаандаштар менен", bmTurnir: "Турнир салмат", bmTurnirDesc: "Турнирлерге катышып, байгелерди утуп алыңыз", bmDost: "Дос менен салмат", bmDostDesc: "Досуңузду чакырып, атаандашыңыз" , bmDailyMission: "КҮНДҮК МИССИЯ", bmDailyMissionDesc: "3 салматка катышыңыз", bmDailyBonus: "КҮНДҮК БОНУС" , bestResults: "ЭҢ ЖАКШЫ НАТЫЙЖАЛАР", bestVictories: "Жеңиштер", bestStreak: "Жеңиштер сериясы", bestTime: "Эң тез убакыт" , quickOpponent: "ТЕЗКАР КАРШЫЛАШ", refresh: "Жаңыртуу" , startBattle: "СОГУШТУ БАШТОО", startBattleSubtext: "Каршылашты тандап, жеңишке жет!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Эң күчтүү математиктер", platinumTarget: "Platinum V чейин", xpRemaining: "XP калды", searchPlaceholder: "Колдонуучуну издөө...", statRating: "Рейтинг", statSpeed: "Ылдамдык", statAccuracy: "Тактык", statStreak: "Серия", statExercises: "Көнүгүүлөр", statAchievements: "Жетишкендиктер", statXP: "XP", statCoin: "Монета", achievementsTitle: "ЖЕТИШКЕНДИКТЕР", achv14Days: "14 күндүк серия", achvTop10: "Топ 10", achvGold3: "Алтын III", achvGeneric: "Жетишкендик", activityTitle: "АКТИВДҮҮЛҮК ТАРЫХЫ", activitySeeAll: "Баарын көрүү >", actSimple: "Жөнөкөй эсеп", actBattle: "Салмат", actFast: "Тез эсеп", actAbacus: "Абакус", actToday: "Бүгүн", actYesterday: "Кечээ", actWin: "Жеңиш", collectionTitle: "Менин коллекциям", collAvatars: "Аватарлар", collFrames: "Алкактар", collBgs: "Фондор", collChars: "Персонаждар", collBtn: "ИНВЕНТАРГА ӨТҮҮ >" },
  kk: { title: "Математика шебері", subtitle: "24-деңгей", desc: "Математика үйрену үшін керемет, осымен әлемді бағындыр!", clothes: "КИІМДЕР", accessories: "АКСЕССУАРЛАР", levelText: "ДЕҢГЕЙ", toNextLevel: "Келесі деңгейге дейін", startExercise: "ЖАТТЫҒУДЫ БАСТАУ", stats: "СТАТИСТИКА", seeAll: "БАРЛЫҒЫ >", logic: "ЛОГИКА", logicDesc: "Керемет!", speed: "ЖЫЛДАМДЫҚ", speedDesc: "Жақсы", accuracy: "ДӘЛДІК", accuracyDesc: "Өте жақсы!", streak: "СЕРИЯ", streakDesc: "Күн", navHome: "БАСҚЫ БЕТ", navExercise: "ЖАТТЫҒУ", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИЯЛАР", exerciseSubtitle: "Өзіңізге сәйкес келетін жаттығу түрін тандап, оқуды жалғастырыңыз!", infoTitle: "Қарапайым есеп туралы", infoDesc: "Қарапайым есеп жаттығуы арифметикалық амалдарды жылдам әрі дұрыс орындау дағдысын дамытады.", infoOpsLabel: "Амалдар:", infoOps: ["қосу", "азайту", "көбейту", "бөлу"], infoExampleLabel: "Мысал:", examplesCountTitle: "МЫСАЛДАР САНЫ", examplesCountSubtitle: "7-ден 25-ке дейін мысал таңдаңыз", exampleWord: "мысал", opsTitle: "АМАЛДАР", opsSubtitle: "Амал түрін таңдаңыз", opsOddiy: "Қарапайым", opsOddiyDesc: "Қосу, азайту, көбейту, бөлу", opsF5: "Формула 5", opsF5Desc: "5-ке дейінгі формулалар", opsF10: "Формула 10", opsF10Desc: "10-ға дейінгі формулалар", opsAralash: "Аралас", opsAralashDesc: "Барлық амалдар аралас", speedSelectTitle: "ЖЫЛДАМДЫҚ", speedSelectSubtitle: "Жаттығу жылдамдығын таңдаңыз", secondWord: "секунд", characters: "КЕЙІПКЕРЛЕР", all: "БАРЛЫҒЫ", abacusInfoTitle: "АБАКУС ТУРАЛЫ", abacusInfoDesc: "Жоғарғы қатардағы 1 моншақ 5-ті, төменгі қатардағы 4 моншақ әрқайсысы 1-ді білдіреді.", abacusLearnRules: "Ережелерді үйрену", abacusDifficulty: "ҚИЫНДЫҚ ДЕҢГЕЙІ", abacusBeginner: "Бастауыш", abacusIntermediate: "Орташа", abacusAdvanced: "Қиын", abacusOpsTitle: "АМАЛДАР", abacusAddSub: "Қосу және Азайту", abacusMult: "Көбейту", abacusDiv: "Бөлу", speedInfoTitle: "ЖЫЛДАМ ЕСЕП ТУРАЛЫ", speedInfoDesc: "Уақытпен есептеу арқылы жылдамдық пен дәлдікті тексеріңіз!", speedListItem1: "Уақыты шектеулі мысалдар", speedListItem2: "Жылдам жауап = көбірек ұпай", speedListItem3: "Дәлдік маңызды!", speedExamplesTitle: "МЫСАЛДАР САНЫ", speedExamplesSubtitle: "7-ден 25-ке дейін мысал таңдаңыз", speedTimeTitle: "УАҚЫТ ШЕКТЕУІ", speedTimeSubtitle: "0.5-тен 2 секундқа дейін таңдаңыз", speedOpsTitle: "АМАЛДАР", speedOpsSubtitle: "Амал түрін таңдаңыз", speedKopaytirish: "Көбейту", speedBolish: "Бөлу", speedAralash: "Аралас", speedAllOps: "Барлық амалдар", speedSecLabel: "секунд" , battleTabTitle: "ЖЕКПЕ-ЖЕК", battleYou: "СІЗ", battleOpponent: "Қарсылас", battleRating: "Рейтинг", battleLevel: "Деңгей" , bmOddiy: "Қарапайым жекпе-жек", bmOddiyDesc: "Тең күштілермен жылдам есептеу", bmReyting: "Рейтинг жекпе-жек", bmReytingDesc: "Рейтинг үшін күшті қарсыластармен", bmTurnir: "Турнир жекпе-жек", bmTurnirDesc: "Турнирлерге қатысып, жүлделер ұтып алыңыз", bmDost: "Доспен жекпе-жек", bmDostDesc: "Досыңызды шақырып, жарысыңыз" , bmDailyMission: "КҮНДЕЛІКТІ МИССИЯ", bmDailyMissionDesc: "3 жекпе-жекке қатысыңыз", bmDailyBonus: "КҮНДЕЛІКТІ БОНУС" , bestResults: "ЕҢ ЖАҚСЫ НӘТИЖЕЛЕР", bestVictories: "Жеңістер", bestStreak: "Жеңістер сериясы", bestTime: "Ең жылдам уақыт" , quickOpponent: "ЖЫЛДАМ ҚАРСЫЛАС", refresh: "Жаңарту" , startBattle: "ШАЙҚАСТЫ БАСТАУ", startBattleSubtext: "Қарсыласты таңдап, жеңіске жетіңіз!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Ең мықты математиктер", platinumTarget: "Platinum V дейін", xpRemaining: "XP қалды" },
  tg: { title: "Устоди математика", subtitle: "Сатҳи 24", desc: "Барои омӯзиши математика олӣ аст, бо ин ҷаҳонро фатҳ кунед!", clothes: "ЛИБОСҲО", accessories: "ЛАВОЗИМОТ", levelText: "САТҲ", toNextLevel: "То сатҳи навбатӣ", startExercise: "ОҒОЗИ МАШҚ", stats: "СТАТИСТИКА", seeAll: "ҲАМА >", logic: "МАНТИҚ", logicDesc: "Олӣ!", speed: "СУРЪАТ", speedDesc: "Хуб", accuracy: "ДАҚИҚӢ", accuracyDesc: "Аъло!", streak: "СЕРИЯ", streakDesc: "Рӯз", navHome: "АСОСӢ", navExercise: "МАШҚ", navInventory: "ИНВЕНТАР", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛ", missions: "МИССИЯҲО", exerciseSubtitle: "Навъи машқи ба шумо мувофиқро интихоб кунед ва омӯзишро давом диҳед!", infoTitle: "Дар бораи ҳисоби оддӣ", infoDesc: "Машқи ҳисоби оддӣ маҳорати зуд ва дуруст иҷро кардани амалҳои арифметикиро инкишоф медиҳад.", infoOpsLabel: "Амалҳо:", infoOps: ["ҷамъ", "тарҳ", "зарб", "тақсим"], infoExampleLabel: "Мисол:", examplesCountTitle: "МИҚДОРИ МИСОЛҲО", examplesCountSubtitle: "Аз 7 то 25 мисол интихоб кунед", exampleWord: "мисол", opsTitle: "АМАЛҲО", opsSubtitle: "Намуди амалро интихоб кунед", opsOddiy: "Оддӣ", opsOddiyDesc: "Ҷамъ, тарҳ, зарб, тақсим", opsF5: "Формулаи 5", opsF5Desc: "Формулаҳо то 5", opsF10: "Формулаи 10", opsF10Desc: "Формулаҳо то 10", opsAralash: "Омехта", opsAralashDesc: "Ҳамаи амалҳо омехта", speedSelectTitle: "СУРЪАТ", speedSelectSubtitle: "Суръати машқро интихоб кунед", secondWord: "сония", characters: "ПЕРСОНАЖҲО", all: "ҲАМА", abacusInfoTitle: "ДАР БОРАИ АБАКУС", abacusInfoDesc: "1 маҳтоби болоӣ ба 5, 4 маҳтоби поёнӣ ҳар кадом ба 1 баробар аст.", abacusLearnRules: "Омӯзиши қоидаҳо", abacusDifficulty: "САТҲИ МУШКИЛӢ", abacusBeginner: "Шурӯъкунанда", abacusIntermediate: "Миёна", abacusAdvanced: "Мушкил", abacusOpsTitle: "АМАЛҲО", abacusAddSub: "Ҷамъ ва Тарҳ", abacusMult: "Зарб", abacusDiv: "Тақсим", speedInfoTitle: "ДАР БОРАИ ҲИСОБИ ЗУД", speedInfoDesc: "Бо ҳисобкунӣ бар зидди вақт суръат ва дақиқии худро санҷед!", speedListItem1: "Мисолҳои маҳдуди вақт", speedListItem2: "Ҷавоби зуд = холҳои бештар", speedListItem3: "Дақиқӣ муҳим аст!", speedExamplesTitle: "МИҚДОРИ МИСОЛҲО", speedExamplesSubtitle: "Аз 7 то 25 мисол интихоб кунед", speedTimeTitle: "МАҲДУДИЯТИ ВАҚТ", speedTimeSubtitle: "Аз 0.5 то 2 сония интихоб кунед", speedOpsTitle: "АМАЛҲО", speedOpsSubtitle: "Намуди амалро интихоб кунед", speedKopaytirish: "Зарб", speedBolish: "Тақсим", speedAralash: "Омехта", speedAllOps: "Ҳамаи амалҳо", speedSecLabel: "сония" , battleTabTitle: "ҶАНГ", battleYou: "ШУМО", battleOpponent: "Ҳариф", battleRating: "Рейтинг", battleLevel: "Сатҳ" , bmOddiy: "Ҷанги оддӣ", bmOddiyDesc: "Ҳисоби зуд бо ҳамқувватҳо", bmReyting: "Ҷанги рейтинг", bmReytingDesc: "Барои холҳо бо ҳарифҳои қавӣ", bmTurnir: "Ҷанги мусобиқа", bmTurnirDesc: "Дар мусобиқаҳо иштирок кунед ва ҷоизаҳо гиред", bmDost: "Ҷанг бо дӯст", bmDostDesc: "Дӯсти худро даъват кунед ва рақобат кунед" , bmDailyMission: "ВАЗИФАИ ҲАРРӮЗА", bmDailyMissionDesc: "Дар 3 ҷанг иштирок кунед", bmDailyBonus: "БОНУСИ ҲАРРӮЗА" , bestResults: "НАТИҶАҲОИ БЕҲТАРИН", bestVictories: "Ғалабаҳо", bestStreak: "Силсилаи ғалабаҳо", bestTime: "Вақти тезтарин" , quickOpponent: "РАҚИБИ ТЕЗ", refresh: "Навсозӣ" , startBattle: "ОҒОЗИ НАБАРД", startBattleSubtext: "Рақибро интихоб кунед ва ғалаба ба даст оред!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Пурқувваттарин математикҳо", platinumTarget: "То Platinum V", xpRemaining: "XP боқимонда" },
  ja: { title: "数学マスター", subtitle: "レベル 24", desc: "数学の学習に最適です。これで世界を征服しましょう！", clothes: "服", accessories: "アクセサリー", levelText: "レベル", toNextLevel: "次のレベルまで", startExercise: "練習を始める", stats: "統計", seeAll: "すべて >", logic: "論理", logicDesc: "素晴らしい！", speed: "スピード", speedDesc: "良い", accuracy: "正確さ", accuracyDesc: "優秀！", streak: "連続", streakDesc: "日", navHome: "ホーム", navExercise: "練習", navInventory: "在庫", navRanking: "ランキング", navProfile: "プロフィール", missions: "ミッション", exerciseSubtitle: "自分に合ったエクササイズタイプを選んで、学習を続けましょう！", infoTitle: "簡単な計算について", infoDesc: "簡単な計算の練習は、算術演算を素早く正確に実行するスキルを養います。", infoOpsLabel: "演算:", infoOps: ["加算", "減算", "乗算", "除算"], infoExampleLabel: "例:", examplesCountTitle: "例の数", examplesCountSubtitle: "7から25の例を選択してください", exampleWord: "例", opsTitle: "操作", opsSubtitle: "操作タイプを選択してください", opsOddiy: "シンプル", opsOddiyDesc: "加算、減算、乗算、除算", opsF5: "式5", opsF5Desc: "5までの式", opsF10: "式10", opsF10Desc: "10までの式", opsAralash: "混合", opsAralashDesc: "すべての操作が混在", speedSelectTitle: "スピード", speedSelectSubtitle: "練習の速度を選択してください", secondWord: "秒", characters: "キャラクター", all: "すべて", abacusInfoTitle: "そろばんについて", abacusInfoDesc: "上の珠1つは5を、下の珠4つはそれぞれ1を表します。", abacusLearnRules: "ルールを学ぶ", abacusDifficulty: "難易度", abacusBeginner: "初心者", abacusIntermediate: "中級", abacusAdvanced: "上級", abacusOpsTitle: "操作", abacusAddSub: "加算と減算", abacusMult: "乗算", abacusDiv: "除算", speedInfoTitle: "スピード計算について", speedInfoDesc: "時間と競争してスピードと正確さをテストしましょう！", speedListItem1: "時間制限のある例", speedListItem2: "早い回答 = 高得点", speedListItem3: "正確さが重要！", speedExamplesTitle: "例の数", speedExamplesSubtitle: "7から25の例を選択", speedTimeTitle: "制限時間", speedTimeSubtitle: "0.5〜2秒から選択", speedOpsTitle: "操作", speedOpsSubtitle: "操作タイプを選択", speedKopaytirish: "乗算", speedBolish: "除算", speedAralash: "混合", speedAllOps: "すべての操作", speedSecLabel: "秒" , battleTabTitle: "バトル", battleYou: "あなた", battleOpponent: "対戦相手", battleRating: "評価", battleLevel: "レベル" , bmOddiy: "シンプルなバトル", bmOddiyDesc: "同等の相手と高速計算", bmReyting: "レーティングバトル", bmReytingDesc: "ポイントのための強い相手と", bmTurnir: "トーナメントバトル", bmTurnirDesc: "トーナメントに参加して賞品を獲得", bmDost: "友達とバトル", bmDostDesc: "友達を招待して競う" , bmDailyMission: "デイリーミッション", bmDailyMissionDesc: "3回のバトルに参加する", bmDailyBonus: "デイリーボーナス" , bestResults: "最高の結果", bestVictories: "勝利", bestStreak: "連勝", bestTime: "最速タイム" , quickOpponent: "クイック対戦相手", refresh: "更新" , startBattle: "バトル開始", startBattleSubtext: "対戦相手を選んで勝利を掴もう！" , rankingTitle: "ランキング", rankingSubtitle: "最強の数学者たち", platinumTarget: "Platinum V まで", xpRemaining: "XP 残り", searchPlaceholder: "ユーザーを検索...", statRating: "評価", statSpeed: "スピード", statAccuracy: "正確さ", statStreak: "連続", statExercises: "練習", statAchievements: "実績", statXP: "XP", statCoin: "コイン", achievementsTitle: "実績", achv14Days: "14日連続", achvTop10: "トップ10", achvGold3: "ゴールド III", achvGeneric: "実績", activityTitle: "活動履歴", activitySeeAll: "すべて見る >", actSimple: "簡単な計算", actBattle: "バトル", actFast: "速算", actAbacus: "そろばん", actToday: "今日", actYesterday: "昨日", actWin: "勝利", collectionTitle: "マイコレクション", collAvatars: "アバター", collFrames: "フレーム", collBgs: "背景", collChars: "キャラクター", collBtn: "在庫へ行く >" },
  ko: { title: "수학 마스터", subtitle: "레벨 24", desc: "수학 학습에 좋습니다. 이것으로 세상을 정복하세요!", clothes: "옷", accessories: "액세서리", levelText: "레벨", toNextLevel: "다음 레벨까지", startExercise: "연습 시작", stats: "통계", seeAll: "모두 보기 >", logic: "논리", logicDesc: "훌륭해요!", speed: "속도", speedDesc: "좋음", accuracy: "정확도", accuracyDesc: "매우 우수함!", streak: "연속", streakDesc: "일", navHome: "홈", navExercise: "운동", navInventory: "인벤토리", navRanking: "순위", navProfile: "프로필", missions: "임무", exerciseSubtitle: "자신에게 맞는 운동 유형을 선택하고 계속 학습하세요!", infoTitle: "간단한 계산에 대하여", infoDesc: "간단한 계산 연습은 산술 연산을 빠르고 정확하게 수행하는 능력을 기릅니다.", infoOpsLabel: "연산:", infoOps: ["덧셈", "뺄셈", "곱셈", "나눗셈"], infoExampleLabel: "예:", examplesCountTitle: "예제 수", examplesCountSubtitle: "7에서 25개의 예제를 선택하세요", exampleWord: "예제", opsTitle: "연산", opsSubtitle: "연산 유형을 선택하세요", opsOddiy: "단순", opsOddiyDesc: "덧셈, 뺄셈, 곱셈, 나눗셈", opsF5: "공식 5", opsF5Desc: "5까지의 공식", opsF10: "공식 10", opsF10Desc: "10까지의 공식", opsAralash: "혼합", opsAralashDesc: "모든 연산 혼합", speedSelectTitle: "속도", speedSelectSubtitle: "운동 속도를 선택하세요", secondWord: "초", characters: "캐릭터", all: "모두", abacusInfoTitle: "주판에 대하여", abacusInfoDesc: "위쪽 알 1개는 5를 의미하고 아래쪽 알 4개는 각각 1을 의미합니다.", abacusLearnRules: "규칙 배우기", abacusDifficulty: "난이도", abacusBeginner: "초급", abacusIntermediate: "중급", abacusAdvanced: "고급", abacusOpsTitle: "연산", abacusAddSub: "덧셈과 뺄셈", abacusMult: "곱셈", abacusDiv: "나눗셈", speedInfoTitle: "스피드 계산에 대하여", speedInfoDesc: "시간에 맞서 계산하여 속도와 정확성을 테스트하세요!", speedListItem1: "시간 제한 예제", speedListItem2: "빠른 답변 = 더 많은 점수", speedListItem3: "정확성이 중요합니다!", speedExamplesTitle: "예제 수", speedExamplesSubtitle: "7에서 25개 예제 선택", speedTimeTitle: "시간 제한", speedTimeSubtitle: "0.5초에서 2초 사이 선택", speedOpsTitle: "연산", speedOpsSubtitle: "연산 유형 선택", speedKopaytirish: "곱셈", speedBolish: "나눗셈", speedAralash: "혼합", speedAllOps: "모든 연산", speedSecLabel: "초" , battleTabTitle: "전투", battleYou: "당신", battleOpponent: "상대", battleRating: "평가", battleLevel: "레벨" , bmOddiy: "단순한 전투", bmOddiyDesc: "동등한 상대와 빠른 계산", bmReyting: "등급 전투", bmReytingDesc: "점수를 위한 강력한 상대와 함께", bmTurnir: "토너먼트 전투", bmTurnirDesc: "토너먼트에 참가하고 상품을 받으세요", bmDost: "친구와 전투", bmDostDesc: "친구를 초대하고 경쟁하세요" , bmDailyMission: "일일 미션", bmDailyMissionDesc: "3번의 전투에 참여하세요", bmDailyBonus: "일일 보너스" , bestResults: "최고의 결과", bestVictories: "승리", bestStreak: "연승", bestTime: "가장 빠른 시간" , quickOpponent: "빠른 상대", refresh: "새로고침" , startBattle: "배틀 시작", startBattleSubtext: "상대를 선택하고 승리하세요!" , rankingTitle: "랭킹", rankingSubtitle: "최강의 수학자들", platinumTarget: "Platinum V 까지", xpRemaining: "XP 남음", searchPlaceholder: "사용자 검색...", statRating: "평가", statSpeed: "속도", statAccuracy: "정확도", statStreak: "연속", statExercises: "연습", statAchievements: "업적", statXP: "XP", statCoin: "코인", achievementsTitle: "업적", achv14Days: "14일 연속", achvTop10: "상위 10", achvGold3: "골드 III", achvGeneric: "업적", activityTitle: "활동 기록", activitySeeAll: "모두 보기 >", actSimple: "간단한 계산", actBattle: "전투", actFast: "빠른 계산", actAbacus: "주판", actToday: "오늘", actYesterday: "어제", actWin: "승리", collectionTitle: "내 컬렉션", collAvatars: "아바타", collFrames: "프레임", collBgs: "배경", collChars: "캐릭터", collBtn: "인벤토리로 가기 >" },
};


const EXERCISE_TYPES_TRANSLATIONS = {
  uz: { title: "MASHQ TURLARI", calcTitle: "Oddiy hisob", calcDesc: "Qo'shish, ayirish, ko'paytirish, bo'lish", abacusTitle: "Abakus", abacusDesc: "Serotan yordamida hisoblash", speedTitle: "Tezkor hisob", speedDesc: "Vaqt bilan hisoblash", battleTitle: "Battle", battleDesc: "Boshqa o'yinchilarga qarshi" },
  en: { title: "EXERCISE TYPES", calcTitle: "Basic Math", calcDesc: "Addition, subtraction, multiplication, division", abacusTitle: "Abacus", abacusDesc: "Calculate using Soroban", speedTitle: "Speed Math", speedDesc: "Calculate against time", battleTitle: "Battle", battleDesc: "Against other players" },
  ru: { title: "ВИДЫ ТРЕНИРОВОК", calcTitle: "Простая математика", calcDesc: "Сложение, вычитание, умножение, деление", abacusTitle: "Абакус", abacusDesc: "Счет на соробане", speedTitle: "Счет на скорость", speedDesc: "Счет на время", battleTitle: "Битва", battleDesc: "Против других игроков" },
  ar: { title: "أنواع التمارين", calcTitle: "حساب بسيط", calcDesc: "الجمع والطرح والضرب والقسمة", abacusTitle: "المعداد", abacusDesc: "احسب باستخدام سوروبان", speedTitle: "حساب سريع", speedDesc: "احسب ضد الوقت", battleTitle: "معركة", battleDesc: "ضد لاعبين آخرين" },
  tr: { title: "EGZERSİZ TÜRLERİ", calcTitle: "Basit Matematik", calcDesc: "Toplama, çıkarma, çarpma, bölme", abacusTitle: "Abaküs", abacusDesc: "Soroban kullanarak hesapla", speedTitle: "Hızlı Matematik", speedDesc: "Zamana karşı hesapla", battleTitle: "Savaş", battleDesc: "Diğer oyunculara karşı" },
  zh: { title: "练习类型", calcTitle: "基础数学", calcDesc: "加、减、乘、除", abacusTitle: "算盘", abacusDesc: "使用算盘计算", speedTitle: "快速数学", speedDesc: "计时计算", battleTitle: "对战", battleDesc: "对战其他玩家" },
  ky: { title: "КӨНҮГҮҮ ТҮРЛӨРҮ", calcTitle: "Жөнөкөй эсеп", calcDesc: "Кошуу, кемитүү, көбөйтүү, бөлүү", abacusTitle: "Абакус", abacusDesc: "Соробандын жардамы менен эсептөө", speedTitle: "Ыкчам эсеп", speedDesc: "Убакыт менен эсептөө", battleTitle: "Салгылашуу", battleDesc: "Башка оюнчуларга каршы" },
  kk: { title: "ЖАТТЫҒУ ТҮРЛЕРІ", calcTitle: "Қарапайым есеп", calcDesc: "Қосу, алу, көбейту, бөлу", abacusTitle: "Абакус", abacusDesc: "Соробан көмегімен есептеу", speedTitle: "Жылдам есеп", speedDesc: "Уақытпен есептеу", battleTitle: "Шайқас", battleDesc: "Басқа ойыншыларға қарсы" },
  tg: { title: "НАМУДҲОИ МАШҚ", calcTitle: "Ҳисоби оддӣ", calcDesc: "Ҷамъ, тарҳ, зарб, тақсим", abacusTitle: "Абакус", abacusDesc: "Бо ёрии соробан ҳисоб кунед", speedTitle: "Ҳисоби зуд", speedDesc: "Ҳисоб бо ва вақт", battleTitle: "Ҷанг", battleDesc: "Бар зидди бозингарони дигар" },
  ja: { title: "練習の種類", calcTitle: "基本の数学", calcDesc: "足し算、引き算、掛け算、割り算", abacusTitle: "そろばん", abacusDesc: "そろばんを使って計算する", speedTitle: "スピード数学", speedDesc: "時間と競争して計算する", battleTitle: "バトル", battleDesc: "他のプレイヤーと対戦" },
  ko: { title: "연습 유형", calcTitle: "기본 수학", calcDesc: "덧셈, 뺄셈, 곱셈, 나눗셈", abacusTitle: "주판", abacusDesc: "주판을 사용하여 계산", speedTitle: "스피드 수학", speedDesc: "시간에 맞서 계산", battleTitle: "배틀", battleDesc: "다른 플레이어와 대결" },
};

// Preload models for quick dashboard rendering
useGLTF.preload(require('../assets/models/adult_male_optimized.glb'));
useGLTF.preload(require('../assets/models/athletic_man_optimized.glb'));
useGLTF.preload(require('../assets/models/mannequin_clothing_optimized.glb'));
useGLTF.preload(require('../assets/models/businessman_optimized.glb'));
useGLTF.preload(require('../assets/models/fashion_model_optimized.glb'));
useGLTF.preload(require('../assets/models/casual_outfit_optimized.glb'));
useGLTF.preload(require('../assets/models/stylized_girl_optimized.glb'));
useGLTF.preload(require('../assets/models/beige_trench_coat_optimized.glb'));

function CharacterModel({ characterIndex }) {
  const models = {
    0: require('../assets/models/athletic_man_optimized.glb'),
    1: require('../assets/models/adult_male_optimized.glb'),
    2: require('../assets/models/mannequin_clothing_optimized.glb'),
    3: require('../assets/models/businessman_optimized.glb'),
    4: require('../assets/models/fashion_model_optimized.glb'),
    5: require('../assets/models/casual_outfit_optimized.glb'),
    6: require('../assets/models/stylized_girl_optimized.glb'),
    7: require('../assets/models/beige_trench_coat_optimized.glb')
  };
  
  const modelPath = models[characterIndex] || models[0];
  const { scene } = useGLTF(modelPath);

  let yPos = -0.2; // Standard position for all characters
  if (characterIndex === 1) yPos = 1.2; // Maks is positioned lower by default, so we move him up

  return (
    <>
      <primitive object={scene} scale={5.3} position={[0, yPos, 0]} rotation={[0, -Math.PI / 2, 0]} />
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 2} 
        maxPolarAngle={Math.PI / 2} 
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function StudentDashboardScreen({ navigation, route }) {
  const { language = 'uz', selectedChar = 0 } = route.params || {};
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(selectedChar);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  const toggleDropdown = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsDropdownOpen(!isDropdownOpen);
  };
  
  const baseAvatarsList = [
    { id: 0, img: require('../assets/avatar_alex.jpg') },
    { id: 1, img: require('../assets/avatar_maks.png') },
    { id: 2, img: require('../assets/avatar_david.jpg') },
    { id: 3, img: require('../assets/avatar_kevin.png') },
    { id: 4, img: require('../assets/avatar_lily.jpg') },
    { id: 5, img: require('../assets/avatar_maya.jpg') },
    { id: 6, img: require('../assets/avatar_sophia.png') },
    { id: 7, img: require('../assets/avatar_emma.jpg') }
  ];

  const selectedAvatarObj = baseAvatarsList.find(a => a.id === activeAvatarIndex);
  const avatarsList = selectedAvatarObj 
    ? [selectedAvatarObj, ...baseAvatarsList.filter(a => a.id !== activeAvatarIndex)]
    : baseAvatarsList;

  const [leaderboardSearch, setLeaderboardSearch] = useState('');
  const [highlightedUserId, setHighlightedUserId] = useState(null);
  const leaderboardScrollRef = useRef(null);
  const searchBorderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(searchBorderAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(searchBorderAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [searchBorderAnim]);

  const leaderboardData = [
    { id: 1, name: 'IQROMAX', xp: '1248', avatar: selectedAvatarObj ? selectedAvatarObj.img : require('../assets/opponent_1.png') },
    { id: 2, name: 'MathKing', xp: '1150', avatar: require('../assets/avatar_david.jpg') },
    { id: 3, name: 'FastBrain', xp: '1120', avatar: require('../assets/avatar_lily.jpg') },
    { id: 4, name: 'AbacusPro', xp: '1085', avatar: require('../assets/opponent_4.png') },
    { id: 5, name: 'LogicStar', xp: '1060', avatar: require('../assets/avatar_maks.png') },
    { id: 6, name: 'NumberMaster', xp: '1045', avatar: require('../assets/avatar_kevin.png') },
    { id: 7, name: 'BrainStorm', xp: '980', avatar: require('../assets/avatar_sophia.png') },
    { id: 8, name: 'SpeedMath', xp: '945', avatar: require('../assets/avatar_emma.jpg') },
  ];

  const filteredLeaderboard = leaderboardData.filter(item => {
    const q = leaderboardSearch.trim().toLowerCase();
    if (!q) return true;
    const nameMatch = item.name.toLowerCase().includes(q);
    const xpMatch = item.xp.toString().includes(q);
    return nameMatch || xpMatch;
  });

  const t = DASHBOARD_TRANSLATIONS[language] || DASHBOARD_TRANSLATIONS['en'];
  const ext = EXERCISE_TYPES_TRANSLATIONS[language] || EXERCISE_TYPES_TRANSLATIONS['en'];
  const coinText = COIN_TRANSLATIONS[language] || COIN_TRANSLATIONS['en'];
  const [activeTab, setActiveTab] = useState('home');

  const yutuqScrollRef = useRef(null);
  const [currentYutuqIndex, setCurrentYutuqIndex] = useState(0);

  useEffect(() => {
    let interval;
    if (activeTab === 'profile') {
      interval = setInterval(() => {
        setCurrentYutuqIndex((prev) => {
          const nextIndex = (prev + 1) % 12;
          if (yutuqScrollRef.current) {
            yutuqScrollRef.current.scrollTo({
              x: nextIndex * 110, // card width (100) + marginRight (10)
              animated: true,
            });
          }
          return nextIndex;
        });
      }, 2500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [activeTab]);
  const [activeExerciseType, setActiveExerciseType] = useState('calc');
  const [isExamplesPickerOpen, setIsExamplesPickerOpen] = useState(false);
  const [selectedExamples, setSelectedExamples] = useState(15);
  const [selectedOperation, setSelectedOperation] = useState('oddiy');
  const exampleNumbers = Array.from({ length: 19 }, (_, i) => i + 7);
  
  const [isSpeedPickerOpen, setIsSpeedPickerOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const speedOptions = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3];

  const [abacusDifficulty, setAbacusDifficulty] = useState('orta');
  const [abacusExamplesCount, setAbacusExamplesCount] = useState(30);
  const [abacusOperations, setAbacusOperations] = useState(['add']);

  const [speedSecExamples, setSpeedSecExamples] = useState(15);
  const [isSpeedSecExamplesOpen, setIsSpeedSecExamplesOpen] = useState(false);
  const [speedSecTime, setSpeedSecTime] = useState(1.0);
  const [isSpeedSecTimeOpen, setIsSpeedSecTimeOpen] = useState(false);
  const [speedSecOperation, setSpeedSecOperation] = useState('kopaytirish');
  const [activeBattleMode, setActiveBattleMode] = useState('oddiy');
  const [bonusTimeLeft, setBonusTimeLeft] = useState(13 * 3600 + 45 * 60 + 22);

  useEffect(() => {
    const timer = setInterval(() => {
      setBonusTimeLeft(prev => prev > 0 ? prev - 1 : 0);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatBonusTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const formatSpeed = (s) => {
    return `${s} ${t.secondWord || 'soniya'}`;
  };

  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: false,
        }),
        Animated.timing(pulseAnim, {
          toValue: 0,
          duration: 1500,
          useNativeDriver: false,
        })
      ])
    ).start();
  }, [pulseAnim]);

  const borderColorInterp = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(31, 31, 61, 1)', 'rgba(168, 85, 247, 1)'], // Pulses from dark border to bright purple
  });

  // Count-up animation for Level 24
  const [levelNumber, setLevelNumber] = useState(0);
  useEffect(() => {
    let current = 0;
    const target = 24;
    const duration = 1500; // 1.5 seconds
    const intervalTime = duration / target;

    const timer = setInterval(() => {
      current += 1;
      setLevelNumber(current);
      if (current >= target) {
        clearInterval(timer);
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Home Tab Content */}
      <View style={{ flex: 1, display: activeTab === 'home' ? 'flex' : 'none' }}>
      {/* HEADER PART */}
      <View style={styles.header}>
        {/* Top Row: Menu, Logo, Icons */}
        <View style={styles.topRow}>
          {/* Menu Button */}
          <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
            <Feather name="menu" size={24} color="#FFFFFF" />
          </TouchableOpacity>

          {/* Logo */}
          <View style={styles.logoContainer} pointerEvents="none">
            <Text style={styles.logoIqro}>IQRO</Text>
            <Text style={styles.logoMax}>MAX</Text>
          </View>

          {/* Right Icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7}>
              <Feather name="bell" size={22} color="#FFFFFF" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
            
            <TouchableOpacity style={[styles.iconButton, { marginLeft: 12 }]} activeOpacity={0.7}>
              <Feather name="shopping-cart" size={22} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row: Coin and XP */}
        <View style={styles.statsRow}>
          {/* Coin Card */}
          <View style={[styles.statCard, { marginRight: 10 }]}>
            <View style={styles.statContent}>
              <Image source={require('../assets/coin.jpg')} style={styles.statImage} />
              <View>
                <Text style={styles.statValue}>12 450</Text>
                <Text style={styles.statLabel}>{coinText}</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.plusButton} activeOpacity={0.7}>
              <Feather name="plus" size={18} color="#F59E0B" />
            </TouchableOpacity>
          </View>

          {/* XP Card */}
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Image source={require('../assets/xp.jpg')} style={styles.statImage} />
              <View>
                <Text style={styles.statValue}>128 560</Text>
                <Text style={styles.statLabel}>XP</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content Area */}
      <View style={styles.mainContent}>
        <Image source={require('../assets/dashboard_bg_new.jpg')} style={styles.backgroundImage} />
        
        {/* Fixed Top Section */}
        <View style={styles.fixedTopSection} pointerEvents="box-none">
          {/* Black Mask to hide scrolling content under the fixed top section */}
          <View style={styles.scrollMask} />

          <View style={styles.contentOverlay}>
            
            {/* Left Panel Container */}
            <View style={styles.leftPanelContainer}>
              <Text style={styles.leftPanelTitle}>{t.characters || 'PERSONAJLAR'}</Text>
              
              <View style={styles.leftPanel}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.avatarList}>
                  {avatarsList.map((avatar, index) => {
                    const isSelected = activeAvatarIndex === avatar.id;
                    if (!isDropdownOpen && index !== 0) return null; // Hide non-selected ones if closed
                    
                    return (
                      <TouchableOpacity 
                        key={avatar.id} 
                        style={[
                          styles.avatarItem, 
                          isSelected && styles.avatarItemSelected,
                          index !== 0 && { marginTop: 4 } // Slight spacing for dropdown items
                        ]}
                        onPress={() => {
                          if (index === 0) {
                            toggleDropdown();
                          } else {
                            setActiveAvatarIndex(avatar.id);
                            toggleDropdown();
                          }
                        }}
                        activeOpacity={0.8}
                      >
                        <Image source={avatar.img} style={styles.avatarImage} resizeMode="cover" />
                        {index === 0 && (
                          <View style={styles.dropdownIconContainer}>
                            <Feather name={isDropdownOpen ? "chevron-up" : "chevron-down"} size={14} color="#FFF" />
                          </View>
                        )}
                      </TouchableOpacity>
                    )
                  })}
                </ScrollView>
                <TouchableOpacity style={styles.barchaButton} activeOpacity={0.8}>
                  <Text style={styles.barchaText}>{t.all || 'BARCHA'}</Text>
                  <Feather name="chevron-right" size={12} color="#FFF" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Canvas Container */}
            <View style={{ position: 'absolute', top: -50, bottom: -20, left: 0, right: 0, zIndex: 1, transform: [{ translateX: -20 }] }} pointerEvents="box-none">
              <Canvas style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="auto" gl={{ alpha: true, preserveDrawingBuffer: true, antialias: true }}>
                <ambientLight intensity={2} color="#ffffff" />
                <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#000000" />
                <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-10, 10, -5]} intensity={1} color="#ffffff" />
                <Suspense fallback={null}>
                  <CharacterModel characterIndex={activeAvatarIndex} />
                </Suspense>
              </Canvas>
            </View>
            
            <View style={styles.rightPanel}>
            {/* Announcement Card */}
            <View style={styles.glassCard}>
              <View style={styles.cardHeader}>
                <Image source={require('../assets/math_master_logo.png')} style={styles.mathMasterLogo} resizeMode="contain" />
                <View style={styles.cardTitles}>
                  <Text style={styles.cardTitle}>{t.title}</Text>
                  <Text style={styles.cardSubtitle}>{t.subtitle}</Text>
                </View>
              </View>
              <Text style={styles.cardDesc}>{t.desc}</Text>
            </View>

            {/* Buttons Row */}
            <View style={styles.buttonsRow}>
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                <View style={styles.notificationDotRed} />
                <Ionicons name="shirt" size={16} color="#FFF" />
                <Text style={styles.actionButtonText}>{t.clothes}</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton} activeOpacity={0.8}>
                <Ionicons name="briefcase" size={16} color="#FFF" />
                <Text style={styles.actionButtonText}>{t.accessories}</Text>
              </TouchableOpacity>
            </View>
          </View>
          
        </View>

        {/* Level Progress Bar Section */}
        <View style={styles.levelBarContainer}>
          <View style={styles.levelCardWrapper}>
            <Animated.View style={[styles.levelCard, { borderColor: borderColorInterp, borderWidth: 1.5 }]}>
              
              {/* Middle Progress Section (flex: 1) */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.progressValueBold}>7 850<Text style={styles.progressValueNormal}> / 10 000 </Text><Text style={styles.progressXP}>XP</Text></Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: '78.5%' }]} />
                </View>
                <Text style={styles.progressFooterText}>{t.toNextLevel} 2 150 XP</Text>
              </View>
              
            </Animated.View>
            
            {/* Overlapping Shield (Absolute) */}
            <View style={styles.shieldWrapper}>
              <Image source={require('../assets/level_shield.png')} style={styles.shieldImage} resizeMode="contain" />
              <View style={styles.shieldTextWrapper}>
                <Text style={styles.shieldLevelText}>{t.levelText}</Text>
                <Text style={styles.shieldLevelNumber}>{levelNumber}</Text>
              </View>
            </View>

            {/* Overlapping Chest (Absolute) */}
            <View style={styles.chestWrapper}>
              <Image source={require('../assets/level_chest.png')} style={styles.chestImage} resizeMode="contain" />
            </View>
          </View>

          {/* Start Exercise Button */}
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.startButton}
            onPress={() => setActiveTab('exercise')}
          >
            <Image source={require('../assets/start_btn_new.png')} style={{ position: 'absolute', width: '100%', height: '100%' }} resizeMode="stretch" />
            <View style={styles.startButtonTouchable}>
              <Text style={styles.startButtonText}>{t.startExercise}</Text>
            </View>
          </TouchableOpacity>
        </View>
        </View>

        {/* Scrollable Bottom Section */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 510, paddingBottom: 110 }}>
          {/* Action Cards Section */}
          <View style={styles.actionCardsContainer}>
            <TouchableOpacity style={styles.actionCardWrapper} activeOpacity={0.8}>
              <ImageBackground source={require('../assets/card_mashq.png')} style={styles.actionImage} resizeMode="stretch">
                <Text style={styles.actionText} numberOfLines={1} adjustsFontSizeToFit>{t.navExercise}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCardWrapper} activeOpacity={0.8}>
              <View style={styles.notificationDotCard} />
              <ImageBackground source={require('../assets/card_missiya.png')} style={styles.actionImage} resizeMode="stretch">
                <Text style={styles.actionText} numberOfLines={1} adjustsFontSizeToFit>{t.missions}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCardWrapper} activeOpacity={0.8}>
              <ImageBackground source={require('../assets/card_reyting.png')} style={styles.actionImage} resizeMode="stretch">
                <Text style={styles.actionText} numberOfLines={1} adjustsFontSizeToFit>{t.navRanking}</Text>
              </ImageBackground>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCardWrapper} activeOpacity={0.8}>
              <ImageBackground source={require('../assets/card_inventar.png')} style={styles.actionImage} resizeMode="stretch">
                <Text style={styles.actionText} numberOfLines={1} adjustsFontSizeToFit>{t.navInventory}</Text>
              </ImageBackground>
            </TouchableOpacity>
          </View>

          {/* Statistics Section will follow here */}

        {/* Statistics Section */}
        <View style={styles.statsContainer}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>{t.stats}</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAllText}>{t.seeAll}</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.statsRow}>
            {/* Card 1: Logic */}
            <View style={[styles.statCardBlock, { borderColor: '#1E3A8A' }]}>
               <View style={styles.statCardInner}>
                 <MaterialCommunityIcons name="brain" size={24} color="#3B82F6" style={styles.statIconLeft} />
                 <View style={styles.statTextRight}>
                   <Text style={styles.statTopLabel} numberOfLines={1} adjustsFontSizeToFit>{t.logic}</Text>
                   <Text style={styles.statMainNumber}>92</Text>
                   <Text style={[styles.statBottomLabel, { color: '#3B82F6' }]} numberOfLines={1} adjustsFontSizeToFit>{t.logicDesc}</Text>
                 </View>
               </View>
            </View>

            {/* Card 2: Speed */}
            <View style={[styles.statCardBlock, { borderColor: '#14532D' }]}>
               <View style={styles.statCardInner}>
                 <Ionicons name="flash" size={24} color="#22C55E" style={styles.statIconLeft} />
                 <View style={styles.statTextRight}>
                   <Text style={styles.statTopLabel} numberOfLines={1} adjustsFontSizeToFit>{t.speed}</Text>
                   <Text style={styles.statMainNumber}>88</Text>
                   <Text style={[styles.statBottomLabel, { color: '#22C55E' }]} numberOfLines={1} adjustsFontSizeToFit>{t.speedDesc}</Text>
                 </View>
               </View>
            </View>

            {/* Card 3: Accuracy */}
            <View style={[styles.statCardBlock, { borderColor: '#78350F' }]}>
               <View style={styles.statCardInner}>
                 <MaterialCommunityIcons name="target" size={24} color="#F59E0B" style={styles.statIconLeft} />
                 <View style={styles.statTextRight}>
                   <Text style={styles.statTopLabel} numberOfLines={1} adjustsFontSizeToFit>{t.accuracy}</Text>
                   <Text style={styles.statMainNumber}>95</Text>
                   <Text style={[styles.statBottomLabel, { color: '#F59E0B' }]} numberOfLines={1} adjustsFontSizeToFit>{t.accuracyDesc}</Text>
                 </View>
               </View>
            </View>

            {/* Card 4: Streak */}
            <View style={[styles.statCardBlock, { borderColor: '#4C1D95' }]}>
               <View style={styles.statCardInner}>
                 <MaterialCommunityIcons name="fire" size={24} color="#EF4444" style={styles.statIconLeft} />
                 <View style={styles.statTextRight}>
                   <Text style={styles.statTopLabel} numberOfLines={1} adjustsFontSizeToFit>{t.streak}</Text>
                   <Text style={styles.statMainNumber}>14</Text>
                   <Text style={[styles.statBottomLabel, { color: '#A855F7' }]} numberOfLines={1} adjustsFontSizeToFit>{t.streakDesc}</Text>
                 </View>
               </View>
            </View>
          </View>
        </View>
        </ScrollView>
        </View>
      </View>

      {/* Exercise Tab Content */}
      <View style={[styles.mainContent, { display: activeTab === 'exercise' ? 'flex' : 'none' }]}>
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: '#05050C', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 0 }}>
          <View style={styles.exHeaderRow}>
            <TouchableOpacity style={styles.exBackButton} activeOpacity={0.7} onPress={() => setActiveTab('home')}>
              <Ionicons name="arrow-back" size={20} color="#FFF" />
            </TouchableOpacity>

            <View style={styles.exTitleContainer}>
              <Text style={styles.exTitle}>{t.navExercise.toUpperCase()}</Text>
              <Text style={styles.exSubtitle}>{t.exerciseSubtitle}</Text>
            </View>

            <TouchableOpacity style={styles.exEnergyButton} activeOpacity={0.7}>
              <Image source={require('../assets/energy_icon.png')} style={{ width: 18, height: 18 }} resizeMode="contain" />
              <Text style={styles.exEnergyText}>2</Text>
              <Ionicons name="add" size={14} color="#FBBF24" />
            </TouchableOpacity>
          </View>

          {/* MASHQ TURLARI SECTION */}
          <Text style={styles.exerciseSectionTitle}>{ext.title}</Text>
          <View style={styles.exerciseTypesRow}>
          
          {/* Card 1 */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('calc')}
          >
            <ImageBackground source={require('../assets/card_calc.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={[styles.exerciseCardContent, activeExerciseType === 'calc' && { backgroundColor: 'rgba(168, 85, 247, 0.15)' }]}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.calcTitle}</Text>
                  <Text style={styles.exerciseCardDesc} numberOfLines={2} adjustsFontSizeToFit>{ext.calcDesc}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#310787' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} resizeMode="contain" />
                  <Text style={styles.exerciseCardEnergyText}>1</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'calc' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#A855F7', borderRadius: 10, shadowColor: '#A855F7', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('abacus')}
          >
            <ImageBackground source={require('../assets/card_abacus.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={[styles.exerciseCardContent, activeExerciseType === 'abacus' && { backgroundColor: 'rgba(59, 130, 246, 0.15)' }]}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.abacusTitle}</Text>
                  <Text style={styles.exerciseCardDesc} numberOfLines={2} adjustsFontSizeToFit>{ext.abacusDesc}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#0A2B66' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} resizeMode="contain" />
                  <Text style={styles.exerciseCardEnergyText}>1</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'abacus' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#3B82F6', borderRadius: 10, shadowColor: '#3B82F6', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('speed')}
          >
            <ImageBackground source={require('../assets/card_speed.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={[styles.exerciseCardContent, activeExerciseType === 'speed' && { backgroundColor: 'rgba(34, 197, 94, 0.15)' }]}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.speedTitle}</Text>
                  <Text style={styles.exerciseCardDesc} numberOfLines={2} adjustsFontSizeToFit>{ext.speedDesc}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#104414' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} resizeMode="contain" />
                  <Text style={styles.exerciseCardEnergyText}>2</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'speed' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#22C55E', borderRadius: 10, shadowColor: '#22C55E', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('battle')}
          >
            <ImageBackground source={require('../assets/card_battle.jpg')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={[styles.exerciseCardContent, activeExerciseType === 'battle' && { backgroundColor: 'rgba(217, 119, 6, 0.15)' }]}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.battleTitle}</Text>
                  <Text style={styles.exerciseCardDesc} numberOfLines={2} adjustsFontSizeToFit>{ext.battleDesc}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#6B2A03' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} resizeMode="contain" />
                  <Text style={styles.exerciseCardEnergyText}>2</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'battle' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#D97706', borderRadius: 10, shadowColor: '#D97706', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>
        </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 280, paddingBottom: 120, paddingHorizontal: 20 }}>
        
        {activeExerciseType === 'abacus' && (
          <View style={{ marginTop: 10 }}>
            {/* ABAKUS INFO CARD */}
            <View style={[styles.infoCardContainer, { marginTop: 10, backgroundColor: '#0A0A16', padding: 20, aspectRatio: 'auto', borderWidth: 1.5, borderColor: 'rgba(168, 85, 247, 0.3)', borderRadius: 16 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={[styles.infoTitle, { marginBottom: 0 }]}>{t.abacusInfoTitle || 'ABAKUS (SOROBAN) HAQIDA'}</Text>
                <MaterialCommunityIcons name="information-outline" size={20} color="#9CA3AF" />
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ flex: 1, height: 120 }}>
                   <Image source={require('../assets/abacus_info.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
                <View style={{ flex: 1, paddingLeft: 15 }}>
                  <Text style={[styles.infoDesc, { fontSize: 13, lineHeight: 20, color: '#D1D5DB' }]}>
                    {t.abacusInfoDesc || 'Yuqori qatordagi 1 ta boncuk – 5 qiymatni, pastki qatordagi 4 ta boncuk – 1 qiymatni bildiradi.'}
                  </Text>
                  
                  <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }} activeOpacity={0.7}>
                    <Text style={{ color: '#A855F7', fontFamily: 'Inter_600SemiBold', fontSize: 13, marginRight: 5 }}>
                      {t.abacusLearnRules || "Qoidalarni o'rganish"}
                    </Text>
                    <MaterialCommunityIcons name="chevron-right" size={16} color="#A855F7" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <Text style={styles.abacusSectionTitle}>{t.abacusDifficulty || 'QIYINCHILIK DARAJASI'}</Text>
            <View style={styles.abacusCardRow}>
              {[
                { id: 'boshlangich', emoji: '🟢', title: t.abacusBeginner || "Boshlang'ich", stars: 1, totalStars: 3 },
                { id: 'orta', emoji: '📚', title: t.abacusIntermediate || "O'rta", stars: 2, totalStars: 3 },
                { id: 'murakkab', emoji: '🔥', title: t.abacusAdvanced || "Murakkab", stars: 3, totalStars: 3 },
                { id: 'yuqori', emoji: '👑', title: "Yuqori", stars: 3, totalStars: 3 },
                { id: 'ustoz', emoji: '🏵️', title: "Ustoz", stars: 4, totalStars: 4 }
              ].map(diff => (
                <TouchableOpacity 
                  key={diff.id} 
                  style={[styles.abacusDiffCard, abacusDifficulty === diff.id && styles.abacusDiffCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => setAbacusDifficulty(diff.id)}
                >
                  <View style={[styles.abacusCheckbox, abacusDifficulty === diff.id && { backgroundColor: 'transparent', borderColor: 'transparent' }]} />
                  <Text style={styles.abacusDiffEmoji}>{diff.emoji}</Text>
                  <Text style={[styles.abacusDiffTitle, abacusDifficulty === diff.id && styles.abacusDiffTitleSelected]} numberOfLines={1} adjustsFontSizeToFit>{diff.title}</Text>
                  <View style={styles.abacusStarsRow}>
                    {Array.from({ length: diff.totalStars }).map((_, i) => (
                      <MaterialCommunityIcons key={i} name={i < diff.stars ? "star" : "star-outline"} size={12} color={i < diff.stars ? "#FBBF24" : "#4B5563"} />
                    ))}
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.abacusSectionTitle}>MISOLLAR SONI</Text>
            <View style={styles.abacusCardRow}>
              {[10, 20, 30, 50, 100].map(count => (
                <TouchableOpacity 
                  key={count} 
                  style={[styles.abacusCountCard, abacusExamplesCount === count && styles.abacusCountCardSelected]}
                  activeOpacity={0.8}
                  onPress={() => setAbacusExamplesCount(count)}
                >
                  <Text style={[styles.abacusCountNum, abacusExamplesCount === count && styles.abacusCountNumSelected]}>{count}</Text>
                  <Text style={[styles.abacusCountLabel, abacusExamplesCount === count && styles.abacusCountLabelSelected]}>misol</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Text style={styles.abacusSectionTitle}>AMALLAR</Text>
            <View style={styles.abacusCardRow}>
              {[
                { id: 'add', title: "Qo'shish", symbol: "+", style: styles.abacusOpAdd },
                { id: 'sub', title: "Ayirish", symbol: "-", style: styles.abacusOpSub },
                { id: 'mul', title: "Ko'paytirish", symbol: "×", style: styles.abacusOpMul },
                { id: 'div', title: "Bo'lish", symbol: "÷", style: styles.abacusOpDiv }
              ].map(op => {
                const isSelected = abacusOperations.includes(op.id);
                return (
                  <TouchableOpacity 
                    key={op.id} 
                    style={[styles.abacusOpCard, isSelected && styles.abacusOpCardSelected]}
                    activeOpacity={0.8}
                    onPress={() => {
                      if (isSelected && abacusOperations.length > 1) {
                        setAbacusOperations(abacusOperations.filter(id => id !== op.id));
                      } else if (!isSelected) {
                        setAbacusOperations([...abacusOperations, op.id]);
                      }
                    }}
                  >
                    {!isSelected && <View style={styles.abacusCheckbox} />}
                    {isSelected && (
                      <View style={styles.abacusOpCheckCircle}>
                        <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                      </View>
                    )}
                    <Text style={styles.abacusOpTitle} numberOfLines={1} adjustsFontSizeToFit>{op.title}</Text>
                    <Text style={[styles.abacusOpSymbol, op.style]}>{op.symbol}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* CALC ONLY CONFIGURATION */}
        {activeExerciseType === 'calc' && (
          <>
        {/* INFO CARD SECTION */}
        <View style={[styles.infoCardContainer, { marginTop: 20, marginBottom: 15 }]}>
          <ImageBackground source={require('../assets/info_card_bg.png')} style={styles.infoCardBg} imageStyle={{ borderRadius: 16 }} resizeMode="contain">
            <View style={styles.infoCardContent}>
              <View style={styles.infoTextContainer}>
                <Text style={styles.infoTitle}>{t.infoTitle}</Text>
                <Text style={styles.infoDesc}>{t.infoDesc}</Text>
                
                <View style={styles.infoOpsRow}>
                  <Text style={styles.infoOpsLabel}>{t.infoOpsLabel}</Text>
                  <Text style={styles.infoOpAdd}> {t.infoOps[0]},</Text>
                  <Text style={styles.infoOpSub}> {t.infoOps[1]},</Text>
                  <Text style={styles.infoOpMul}> {t.infoOps[2]},</Text>
                  <Text style={styles.infoOpDiv}> {t.infoOps[3]}</Text>
                </View>

                <Text style={styles.infoExampleLabel}>{t.infoExampleLabel}</Text>
                
                <View style={styles.infoExamplesGrid}>
                  <View style={styles.infoExampleCol}>
                    <Text style={styles.infoExAdd}>24 + 15 = 39</Text>
                    <Text style={styles.infoExMul}>7 × 8 = 56</Text>
                  </View>
                  <View style={styles.infoExampleCol}>
                    <Text style={styles.infoExSub}>36 - 12 = 24</Text>
                    <Text style={styles.infoExDiv}>64 ÷ 8 = 8</Text>
                  </View>
                </View>
              </View>
            </View>
          </ImageBackground>
        </View>

            {/* NUMBER OF EXAMPLES SECTION */}
            <View style={styles.examplesContainer}>
              <View style={styles.examplesHeader}>
                <View style={styles.examplesIconBox}>
                  <MaterialCommunityIcons name="format-list-bulleted" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={styles.examplesTitle}>{t.examplesCountTitle}</Text>
                  <Text style={styles.examplesSubtitle}>{t.examplesCountSubtitle}</Text>
                </View>
              </View>

              {!isExamplesPickerOpen ? (
                <TouchableOpacity 
                  style={styles.examplesSelectorClosed} 
                  activeOpacity={0.8}
                  onPress={() => setIsExamplesPickerOpen(true)}
                >
                  <Text style={styles.examplesSelectorValueText}>{selectedExamples} <Text style={styles.examplesSelectorLabelText}>{t.exampleWord}</Text></Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                </TouchableOpacity>
              ) : (
                <View style={styles.examplesPickerExpanded}>
                  <ScrollView 
                    style={styles.examplesPickerScroll} 
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (exampleNumbers[index]) {
                        setSelectedExamples(exampleNumbers[index]);
                      }
                    }}
                  >
                    <View style={{ height: 40 }} />
                    {exampleNumbers.map((num) => {
                      const isSelected = selectedExamples === num;
                      return (
                        <TouchableOpacity 
                          key={num} 
                          style={[styles.examplesPickerItem, isSelected && styles.examplesPickerItemSelected]}
                          onPress={() => {
                            setSelectedExamples(num);
                            setIsExamplesPickerOpen(false);
                          }}
                        >
                          <Text style={[styles.examplesPickerItemText, isSelected && styles.examplesPickerItemTextSelected]}>
                            {num} {isSelected && <Text style={styles.examplesPickerItemLabel}>{t.exampleWord}</Text>}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={{ height: 40 }} />
                  </ScrollView>
                </View>
              )}
            </View>

            {/* OPERATIONS SECTION */}
            <View style={styles.opsContainer}>
              <View style={styles.opsHeader}>
                <View style={styles.opsIconBox}>
                  <MaterialCommunityIcons name="calculator-variant" size={24} color="#A855F7" />
                </View>
                <View style={styles.opsHeaderTextContainer}>
                  <Text style={styles.opsTitle}>{t.opsTitle}</Text>
                  <Text style={styles.opsSubtitle}>{t.opsSubtitle}</Text>
                </View>
              </View>

              <View style={styles.opsRow}>
                {/* Oddiy */}
                <TouchableOpacity 
                  style={[styles.opsCard, selectedOperation === 'oddiy' && styles.opsCardSelected]}
                  onPress={() => setSelectedOperation('oddiy')}
                  activeOpacity={0.8}
                >
                  {selectedOperation === 'oddiy' && (
                    <View style={styles.opsCheckmarkBadge}>
                      <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                    </View>
                  )}
                  <View style={styles.opsCardIconWrapper}>
                    <MaterialCommunityIcons name="plus" size={32} color={selectedOperation === 'oddiy' ? '#A855F7' : '#9CA3AF'} />
                  </View>
                  <Text style={[styles.opsCardTitle, selectedOperation === 'oddiy' && styles.opsCardTitleSelected]}>{t.opsOddiy}</Text>
                  <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsOddiyDesc}</Text>
                </TouchableOpacity>

                {/* Formula 5 */}
                <TouchableOpacity 
                  style={[styles.opsCard, selectedOperation === 'f5' && styles.opsCardSelected]}
                  onPress={() => setSelectedOperation('f5')}
                  activeOpacity={0.8}
                >
                  {selectedOperation === 'f5' && (
                    <View style={styles.opsCheckmarkBadge}>
                      <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                    </View>
                  )}
                  <View style={styles.opsCardIconWrapper}>
                    <Text style={[styles.opsFormulaIcon, selectedOperation === 'f5' && styles.opsFormulaIconSelected]}>f(x)</Text>
                  </View>
                  <Text style={[styles.opsCardTitle, selectedOperation === 'f5' && styles.opsCardTitleSelected]}>{t.opsF5}</Text>
                  <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsF5Desc}</Text>
                </TouchableOpacity>

                {/* Formula 10 */}
                <TouchableOpacity 
                  style={[styles.opsCard, selectedOperation === 'f10' && styles.opsCardSelected]}
                  onPress={() => setSelectedOperation('f10')}
                  activeOpacity={0.8}
                >
                  {selectedOperation === 'f10' && (
                    <View style={styles.opsCheckmarkBadge}>
                      <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                    </View>
                  )}
                  <View style={styles.opsCardIconWrapper}>
                    <Text style={[styles.opsFormulaIcon, selectedOperation === 'f10' && styles.opsFormulaIconSelected]}>f(x)</Text>
                  </View>
                  <Text style={[styles.opsCardTitle, selectedOperation === 'f10' && styles.opsCardTitleSelected]}>{t.opsF10}</Text>
                  <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsF10Desc}</Text>
                </TouchableOpacity>

                {/* Aralash */}
                <TouchableOpacity 
                  style={[styles.opsCard, selectedOperation === 'aralash' && styles.opsCardSelected]}
                  onPress={() => setSelectedOperation('aralash')}
                  activeOpacity={0.8}
                >
                  {selectedOperation === 'aralash' && (
                    <View style={styles.opsCheckmarkBadge}>
                      <MaterialCommunityIcons name="check-bold" size={12} color="#fff" />
                    </View>
                  )}
                  <View style={styles.opsCardIconWrapper}>
                    <MaterialCommunityIcons name="shuffle-variant" size={28} color={selectedOperation === 'aralash' ? '#A855F7' : '#9CA3AF'} />
                  </View>
                  <Text style={[styles.opsCardTitle, selectedOperation === 'aralash' && styles.opsCardTitleSelected]}>{t.opsAralash}</Text>
                  <Text style={styles.opsCardDesc} numberOfLines={2}>{t.opsAralashDesc}</Text>
                </TouchableOpacity>

              </View>
            </View>

            {/* SPEED SECTION */}
            <View style={styles.examplesContainer}>
              <View style={styles.examplesHeader}>
                <View style={styles.examplesIconBox}>
                  <MaterialCommunityIcons name="lightning-bolt" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={styles.examplesTitle}>{t.speedSelectTitle || 'TEZLIK'}</Text>
                  <Text style={styles.examplesSubtitle}>{t.speedSelectSubtitle || 'Mashq bajarish tezligini tanlang'}</Text>
                </View>
              </View>

              {!isSpeedPickerOpen ? (
                <TouchableOpacity 
                  style={styles.examplesSelectorClosed} 
                  activeOpacity={0.8}
                  onPress={() => setIsSpeedPickerOpen(true)}
                >
                  <Text style={styles.examplesSelectorValueText}>
                    {formatSpeed(selectedSpeed)}
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                </TouchableOpacity>
              ) : (
                <View style={styles.examplesPickerExpanded}>
                  <ScrollView 
                    style={styles.examplesPickerScroll} 
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (speedOptions[index]) {
                        setSelectedSpeed(speedOptions[index]);
                      }
                    }}
                  >
                    <View style={{ height: 40 }} />
                    {speedOptions.map((s) => {
                      const isSelected = selectedSpeed === s;
                      return (
                        <TouchableOpacity 
                          key={s.toString()} 
                          style={[styles.examplesPickerItem, isSelected && styles.examplesPickerItemSelected]}
                          onPress={() => {
                            setSelectedSpeed(s);
                            setIsSpeedPickerOpen(false);
                          }}
                        >
                          <Text style={[styles.examplesPickerItemText, isSelected && styles.examplesPickerItemTextSelected]}>
                            {formatSpeed(s)}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={{ height: 40 }} />
                  </ScrollView>
                </View>
              )}
            </View>
          </>
        )}

        {/* SPEED CONFIGURATION */}
        {activeExerciseType === 'speed' && (
          <View style={{ marginTop: 10 }}>
            {/* SPEED INFO CARD */}
            <View style={[styles.infoCardContainer, { marginTop: 10, backgroundColor: '#06130A', padding: 20, aspectRatio: 'auto', borderWidth: 1.5, borderColor: 'rgba(34, 197, 94, 0.3)', borderRadius: 16 }]}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                <Text style={[styles.infoTitle, { marginBottom: 0, color: '#F8FAFC' }]}>{t.speedInfoTitle || 'TEZKOR HISOBLASH HAQIDA'}</Text>
              </View>
              
              <View style={{ flexDirection: 'row', alignItems: 'center', minHeight: 120 }}>
                <View style={{ flex: 1, paddingRight: 110 }}>
                  <Text style={[styles.infoDesc, { fontSize: 13, lineHeight: 20, color: '#D1D5DB', marginBottom: 15 }]}>
                    {t.speedInfoDesc || "Vaqt bilan hisoblash orqali tezlik va aniqligingizni sinab ko'ring!"}
                  </Text>
                  
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>⏱️</Text>
                    <Text style={{ color: '#E2E8F0', fontSize: 12, flexShrink: 1 }}>{t.speedListItem1 || 'Vaqt cheklovi bilan misollar'}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>⚡</Text>
                    <Text style={{ color: '#E2E8F0', fontSize: 12, flexShrink: 1 }}>{t.speedListItem2 || "Tez javob – ko'proq ball"}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 16, marginRight: 8 }}>🎯</Text>
                    <Text style={{ color: '#E2E8F0', fontSize: 12, flexShrink: 1 }}>{t.speedListItem3 || 'Aniqlik muhim!'}</Text>
                  </View>
                </View>

                {/* ABSOLUTE POSITIONED IMAGE SO CARD HEIGHT IS NOT AFFECTED */}
                <View style={{ position: 'absolute', right: -30, top: -70, width: 220, height: 320 }}>
                   <Image source={require('../assets/speed_info.png')} style={{ width: '100%', height: '100%' }} resizeMode="contain" />
                </View>
              </View>
            </View>

            {/* SPEED MISOL SONI */}
            <View style={[styles.examplesContainer, { backgroundColor: '#0A0A16', marginTop: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
              <View style={styles.examplesHeader}>
                <View style={[styles.examplesIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <MaterialCommunityIcons name="calculator" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={[styles.examplesTitle, { color: '#F8FAFC' }]}>{t.speedExamplesTitle || 'MISOLLAR SONI'}</Text>
                  <Text style={[styles.examplesSubtitle, { color: '#6B7280' }]}>{t.speedExamplesSubtitle || '7 dan 25 gacha misol tanlang'}</Text>
                </View>
              </View>

              {!isSpeedSecExamplesOpen ? (
                <TouchableOpacity 
                  style={[styles.examplesSelectorClosed, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]} 
                  activeOpacity={0.8}
                  onPress={() => setIsSpeedSecExamplesOpen(true)}
                >
                  <Text style={[styles.examplesSelectorValueText, { color: '#F8FAFC' }]}>{speedSecExamples} <Text style={[styles.examplesSelectorLabelText, { color: '#9CA3AF' }]}>{t.exampleWord || 'misol'}</Text></Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View style={[styles.examplesPickerExpanded, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                  <ScrollView 
                    style={styles.examplesPickerScroll} 
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (exampleNumbers[index]) setSpeedSecExamples(exampleNumbers[index]);
                    }}
                  >
                    <View style={{ height: 40 }} />
                    {exampleNumbers.map((num) => {
                      const isSelected = speedSecExamples === num;
                      return (
                        <TouchableOpacity 
                          key={num.toString()} 
                          style={[styles.examplesPickerItem, isSelected && { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}
                          onPress={() => {
                            setSpeedSecExamples(num);
                            setIsSpeedSecExamplesOpen(false);
                          }}
                        >
                          <Text style={[styles.examplesPickerItemText, { color: '#9CA3AF' }, isSelected && { color: '#A855F7', fontWeight: 'bold' }]}>
                            {num} {isSelected && <Text style={{ color: '#9CA3AF', fontSize: 14 }}>( {t.exampleWord || 'misol'} )</Text>}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={{ height: 40 }} />
                  </ScrollView>
                </View>
              )}
            </View>

            {/* SPEED VAQT CHEKLOVI */}
            <View style={[styles.examplesContainer, { backgroundColor: '#0A0A16', marginTop: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
              <View style={styles.examplesHeader}>
                <View style={[styles.examplesIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <MaterialCommunityIcons name="timer-outline" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={[styles.examplesTitle, { color: '#F8FAFC' }]}>{t.speedTimeTitle || 'VAQT CHEKLOVI'}</Text>
                  <Text style={[styles.examplesSubtitle, { color: '#6B7280' }]}>{t.speedTimeSubtitle || '0.5 soniyadan 2 soniyagacha vaqt tanlang'}</Text>
                </View>
              </View>

              {!isSpeedSecTimeOpen ? (
                <TouchableOpacity 
                  style={[styles.examplesSelectorClosed, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]} 
                  activeOpacity={0.8}
                  onPress={() => setIsSpeedSecTimeOpen(true)}
                >
                  <Text style={[styles.examplesSelectorValueText, { color: '#F8FAFC' }]}>{speedSecTime.toFixed(1)} <Text style={[styles.examplesSelectorLabelText, { color: '#9CA3AF' }]}>{t.speedSecLabel || 'soniya'}</Text></Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View style={[styles.examplesPickerExpanded, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                  <ScrollView 
                    style={styles.examplesPickerScroll} 
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      const opts = [0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.5, 2.0];
                      if (opts[index]) setSpeedSecTime(opts[index]);
                    }}
                  >
                    <View style={{ height: 40 }} />
                    {[0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.5, 2.0].map((num) => {
                      const isSelected = speedSecTime === num;
                      return (
                        <TouchableOpacity 
                          key={num.toString()} 
                          style={[styles.examplesPickerItem, isSelected && { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}
                          onPress={() => {
                            setSpeedSecTime(num);
                            setIsSpeedSecTimeOpen(false);
                          }}
                        >
                          <Text style={[styles.examplesPickerItemText, { color: '#9CA3AF' }, isSelected && { color: '#A855F7', fontWeight: 'bold' }]}>
                            {num.toFixed(1)} {isSelected && <Text style={{ color: '#9CA3AF', fontSize: 14 }}>( {t.speedSecLabel || 'soniya'} )</Text>}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={{ height: 40 }} />
                  </ScrollView>
                </View>
              )}
            </View>

            {/* SPEED AMALLAR */}
            <View style={[styles.examplesContainer, { backgroundColor: '#0A0A16', marginTop: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
              <View style={styles.examplesHeader}>
                <View style={[styles.examplesIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <MaterialCommunityIcons name="calculator-variant" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={[styles.examplesTitle, { color: '#F8FAFC' }]}>{t.speedOpsTitle || 'AMALLAR'}</Text>
                  <Text style={[styles.examplesSubtitle, { color: '#6B7280' }]}>{t.speedOpsSubtitle || 'Amallar turini tanlang'}</Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 15 }}>
                <TouchableOpacity 
                  style={[{ flex: 1, backgroundColor: '#05050C', borderRadius: 12, padding: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginRight: 5 }, speedSecOperation === 'kopaytirish' && { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.1)', shadowColor: '#A855F7', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 }]}
                  activeOpacity={0.8}
                  onPress={() => setSpeedSecOperation('kopaytirish')}
                >
                  <MaterialCommunityIcons name="close" size={32} color={speedSecOperation === 'kopaytirish' ? '#A855F7' : '#9CA3AF'} style={{ marginBottom: 5 }} />
                  <Text style={[{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }, speedSecOperation === 'kopaytirish' && { color: '#F8FAFC', fontWeight: 'bold' }]}>{t.speedKopaytirish || "Ko'paytirish"}</Text>
                  {speedSecOperation === 'kopaytirish' && (
                    <View style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#A855F7', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[{ flex: 1, backgroundColor: '#05050C', borderRadius: 12, padding: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginHorizontal: 5 }, speedSecOperation === 'bolish' && { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.1)', shadowColor: '#A855F7', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 }]}
                  activeOpacity={0.8}
                  onPress={() => setSpeedSecOperation('bolish')}
                >
                  <MaterialCommunityIcons name="division" size={32} color={speedSecOperation === 'bolish' ? '#A855F7' : '#9CA3AF'} style={{ marginBottom: 5 }} />
                  <Text style={[{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }, speedSecOperation === 'bolish' && { color: '#F8FAFC', fontWeight: 'bold' }]}>{t.speedBolish || "Bo'lish"}</Text>
                  {speedSecOperation === 'bolish' && (
                    <View style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#A855F7', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>

                <TouchableOpacity 
                  style={[{ flex: 1, backgroundColor: '#05050C', borderRadius: 12, padding: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginLeft: 5 }, speedSecOperation === 'aralash' && { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.1)', shadowColor: '#A855F7', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 }]}
                  activeOpacity={0.8}
                  onPress={() => setSpeedSecOperation('aralash')}
                >
                  <MaterialCommunityIcons name="shuffle-variant" size={32} color={speedSecOperation === 'aralash' ? '#A855F7' : '#9CA3AF'} style={{ marginBottom: 5 }} />
                  <Text style={[{ fontSize: 13, color: '#9CA3AF', fontWeight: '500' }, speedSecOperation === 'aralash' && { color: '#F8FAFC', fontWeight: 'bold' }]}>{t.speedAralash || "Aralash"}</Text>
                  <Text style={{ fontSize: 9, color: '#6B7280', marginTop: 2 }}>{t.speedAllOps || "Barcha amallar"}</Text>
                  {speedSecOperation === 'aralash' && (
                    <View style={{ position: 'absolute', top: 5, right: 5, backgroundColor: '#A855F7', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' }}>
                      <MaterialCommunityIcons name="check" size={14} color="#FFF" />
                    </View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {/* BATTLE ONLY CONFIGURATION */}
        {activeExerciseType === 'battle' && (
          <View style={{ marginTop: 25, marginBottom: 15 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: -22, zIndex: 10 }}>
              <MaterialCommunityIcons name="sword-cross" size={24} color="#FFF" style={{ marginRight: 8 }} />
              <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Inter_700Bold', letterSpacing: 1 }}>{t.battleTabTitle || 'BATTLE'}</Text>
            </View>

            <View style={styles.battleCardContainer}>
              <ImageBackground source={require('../assets/battle_vs_bg.png')} style={styles.battleCardBg} imageStyle={{ borderRadius: 16 }} resizeMode="stretch">
                <View style={styles.battleCardOverlay}>
                  
                  {/* Left Player (You) */}
                  <View style={styles.battleLeftPlayer}>
                    <Text style={styles.battlePlayerLabelYou}>{t.battleYou || 'SIZ'}</Text>
                    <Text style={styles.battlePlayerNameYou}>{t.title ? t.title.replace(' ', '\n') : ''}</Text>
                    <View style={styles.battleLevelBadgeYou}>
                      <Text style={styles.battleLevelTextYou}>{t.battleLevel || 'Level'} 24</Text>
                    </View>
                    <View style={styles.battleTrophyRow}>
                      <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                      <Text style={styles.battleTrophyTextYou}>1 250</Text>
                    </View>
                    <Text style={styles.battleReytingText}>{t.battleRating || 'Reyting'}</Text>
                  </View>

                  {/* Right Player (Opponent) */}
                  <View style={styles.battleRightPlayer}>
                    <Text style={styles.battlePlayerLabelOpp}>{t.battleOpponent || 'Raqib'}</Text>
                    <Text style={styles.battlePlayerNameOpp}>IQ{'\n'}Warrior</Text>
                    <View style={styles.battleLevelBadgeOpp}>
                      <Text style={styles.battleLevelTextOpp}>{t.battleLevel || 'Level'} 22</Text>
                    </View>
                    <View style={styles.battleTrophyRow}>
                      <MaterialCommunityIcons name="trophy" size={14} color="#F59E0B" style={{ marginRight: 4 }} />
                      <Text style={styles.battleTrophyTextOpp}>1 180</Text>
                    </View>
                    <Text style={styles.battleReytingText}>{t.battleRating || 'Reyting'}</Text>
                  </View>

                </View>
              </ImageBackground>
            </View>

            {/* BATTLE MODES */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 5, marginTop: -15, width: '100%' }}>
              {/* Card 1: Oddiy */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setActiveBattleMode('oddiy')}
                style={[
                  styles.battleModeCard, 
                  activeBattleMode === 'oddiy' && styles.battleModeCardActive
                ]}
              >
                <Image source={require('../assets/battle_mode_oddiy.png')} style={styles.battleModeIcon} resizeMode="contain" />
                <Text style={styles.battleModeTitle} numberOfLines={2}>{t.bmOddiy || 'Oddiy Battle'}</Text>
                <Text style={styles.battleModeDesc} numberOfLines={3}>{t.bmOddiyDesc || 'Teng kuchdagilar bilan tezkor hisoblash'}</Text>
                <View style={styles.battleModeEnergyBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#F59E0B" />
                  <Text style={styles.battleModeEnergyText}>1</Text>
                </View>
              </TouchableOpacity>
              
              {/* Card 2: Reyting */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setActiveBattleMode('reyting')}
                style={[
                  styles.battleModeCard, 
                  activeBattleMode === 'reyting' && styles.battleModeCardActive
                ]}
              >
                <Image source={require('../assets/battle_mode_reyting.jpg')} style={styles.battleModeIcon} resizeMode="contain" />
                <Text style={styles.battleModeTitle} numberOfLines={2}>{t.bmReyting || 'Reyting Battle'}</Text>
                <Text style={styles.battleModeDesc} numberOfLines={3}>{t.bmReytingDesc || 'Reyting ochkolari uchun kuchli raqiblar bilan'}</Text>
                <View style={styles.battleModeEnergyBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#F59E0B" />
                  <Text style={styles.battleModeEnergyText}>2</Text>
                </View>
              </TouchableOpacity>
              
              {/* Card 3: Turnir */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setActiveBattleMode('turnir')}
                style={[
                  styles.battleModeCard, 
                  activeBattleMode === 'turnir' && styles.battleModeCardActive
                ]}
              >
                <Image source={require('../assets/battle_mode_turnir.png')} style={styles.battleModeIcon} resizeMode="contain" />
                <Text style={styles.battleModeTitle} numberOfLines={2}>{t.bmTurnir || 'Turnir Battle'}</Text>
                <Text style={styles.battleModeDesc} numberOfLines={3}>{t.bmTurnirDesc || 'Turnirlarda qatnashing va sovrin yuting'}</Text>
                <View style={styles.battleModeEnergyBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#F59E0B" />
                  <Text style={styles.battleModeEnergyText}>2</Text>
                </View>
              </TouchableOpacity>
              
              {/* Card 4: Do'st bilan */}
              <TouchableOpacity 
                activeOpacity={0.8}
                onPress={() => setActiveBattleMode('dost')}
                style={[
                  styles.battleModeCard, 
                  activeBattleMode === 'dost' && styles.battleModeCardActive
                ]}
              >
                <Image source={require('../assets/battle_mode_dost.jpg')} style={styles.battleModeIcon} resizeMode="contain" />
                <Text style={styles.battleModeTitle} numberOfLines={2}>{t.bmDost || "Do'st bilan Battle"}</Text>
                <Text style={styles.battleModeDesc} numberOfLines={3}>{t.bmDostDesc || "Do'stingizni taklif qiling va bellashing"}</Text>
                <View style={styles.battleModeEnergyBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#F59E0B" />
                  <Text style={styles.battleModeEnergyText}>0</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* DAILY MISSION AND BONUS ROW */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, width: '100%' }}>
              
              {/* Box 1: Mission */}
              <View style={[styles.dailyBoxCard, { marginRight: 8 }]}>
                <Text style={styles.dailyBoxTitle}>{t.bmDailyMission || 'KUNLIK BATTLE MISSIYASI'}</Text>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, flex: 1 }}>
                  <Image source={require('../assets/target_icon.png')} style={{ width: 32, height: 32, marginRight: 10 }} resizeMode="contain" />
                  <Text style={{ color: '#FFF', fontSize: 11, fontFamily: 'Inter_600SemiBold', flex: 1, lineHeight: 16 }}>
                    {t.bmDailyMissionDesc || "3 ta battle'da ishtirok eting"}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={{ marginTop: 15, marginBottom: 5 }}>
                  <View style={{ height: 6, backgroundColor: '#1A1B2D', borderRadius: 3, width: '100%' }}>
                    <View style={{ height: 6, backgroundColor: '#A855F7', borderRadius: 3, width: '33%' }} />
                  </View>
                  <Text style={{ color: '#9CA3AF', fontSize: 10, textAlign: 'center', marginTop: 6, fontFamily: 'Inter_500Medium' }}>1 / 3</Text>
                </View>
              </View>

              {/* Box 2: Bonus */}
              <View style={styles.dailyBoxCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={styles.dailyBoxTitle}>{t.bmDailyBonus || 'KUNLIK BONUS'}</Text>
                  <Text style={{ color: '#A855F7', fontSize: 10, fontFamily: 'Inter_700Bold' }}>{formatBonusTime(bonusTimeLeft)}</Text>
                </View>
                
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, justifyContent: 'space-between', flex: 1 }}>
                  {/* Coin */}
                  <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/coin_icon.jpg')} style={{ width: 28, height: 28, borderRadius: 14 }} resizeMode="cover" />
                    <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 4 }}>x100</Text>
                    <MaterialCommunityIcons name="check" size={14} color="#10B981" style={{ marginTop: 2 }} />
                  </View>
                  
                  <MaterialCommunityIcons name="arrow-right" size={12} color="#6B7280" style={{ marginBottom: 20 }} />
                  
                  {/* XP */}
                  <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/xp_icon.jpg')} style={{ width: 28, height: 28, borderRadius: 14 }} resizeMode="cover" />
                    <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 4 }}>x50</Text>
                    <MaterialCommunityIcons name="check" size={14} color="#10B981" style={{ marginTop: 2 }} />
                  </View>

                  <MaterialCommunityIcons name="arrow-right" size={12} color="#6B7280" style={{ marginBottom: 20 }} />

                  {/* Chest */}
                  <View style={{ alignItems: 'center' }}>
                    <Image source={require('../assets/chest_icon.jpg')} style={{ width: 28, height: 28, borderRadius: 6 }} resizeMode="cover" />
                    <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 4 }}>x1</Text>
                    <Text style={{ color: '#9CA3AF', fontSize: 8, fontFamily: 'Inter_400Regular', marginTop: 2 }}>7 kun</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* BEST RESULTS SECTION */}
            <View style={styles.bestResultsCard}>
              <Text style={styles.bestResultsTitle}>{t.bestResults || 'ENG YAXSHI NATIJALAR'}</Text>
              
              <View style={styles.bestResultsRow}>
                {/* Victories */}
                <View style={styles.bestResultItem}>
                  <Image source={require('../assets/best_victories.png')} style={styles.bestResultIcon} resizeMode="contain" />
                  <Text style={styles.bestResultLabel}>{t.bestVictories || "G'alabalar"}</Text>
                  <Text style={styles.bestResultValue}>12</Text>
                </View>

                {/* Vertical Divider */}
                <View style={styles.bestResultDivider} />

                {/* Winning Streak */}
                <View style={styles.bestResultItem}>
                  <Image source={require('../assets/best_streak.png')} style={styles.bestResultIcon} resizeMode="contain" />
                  <Text style={styles.bestResultLabel}>{t.bestStreak || "G'alaba seriyasi"}</Text>
                  <Text style={styles.bestResultValue}>5</Text>
                </View>

                {/* Vertical Divider */}
                <View style={styles.bestResultDivider} />

                {/* Fastest Time */}
                <View style={styles.bestResultItem}>
                  <Image source={require('../assets/best_time.png')} style={styles.bestResultIcon} resizeMode="contain" />
                  <Text style={styles.bestResultLabel}>{t.bestTime || "Eng tez vaqt"}</Text>
                  <Text style={styles.bestResultValue}>18.4s</Text>
                </View>
              </View>
            </View>

            {/* QUICK OPPONENT SECTION */}
            <View style={{ marginTop: 10, marginBottom: 20 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15, paddingHorizontal: 4 }}>
                <Text style={styles.quickOpponentTitle}>{t.quickOpponent || 'TEZKOR RAQIB'}</Text>
              </View>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 10, width: '100%' }}>
                {/* Opponent 1 */}
                <View style={styles.opponentCard}>
                  <View style={styles.opponentHeader}>
                    <Image source={require('../assets/opponent_1.png')} style={styles.opponentAvatar} resizeMode="contain" />
                    <View style={styles.opponentInfo}>
                      <Text style={styles.opponentName} numberOfLines={1}>Brain King</Text>
                      <Text style={styles.opponentLevel}>Level 23</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MaterialCommunityIcons name="trophy" size={8} color="#F59E0B" />
                        <Text style={styles.opponentRating}>1 310</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.opponentBattleBtn}>
                    <Text style={styles.opponentBattleText}>BATTLE</Text>
                    <View style={styles.opponentEnergyBadge}>
                      <MaterialCommunityIcons name="lightning-bolt" size={8} color="#F59E0B" />
                      <Text style={styles.opponentEnergyText}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Opponent 2 */}
                <View style={styles.opponentCard}>
                  <View style={styles.opponentHeader}>
                    <Image source={require('../assets/opponent_2.png')} style={styles.opponentAvatar} resizeMode="contain" />
                    <View style={styles.opponentInfo}>
                      <Text style={styles.opponentName} numberOfLines={1}>Speed Genius</Text>
                      <Text style={styles.opponentLevel}>Level 21</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MaterialCommunityIcons name="trophy" size={8} color="#F59E0B" />
                        <Text style={styles.opponentRating}>1 160</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.opponentBattleBtn}>
                    <Text style={styles.opponentBattleText}>BATTLE</Text>
                    <View style={styles.opponentEnergyBadge}>
                      <MaterialCommunityIcons name="lightning-bolt" size={8} color="#F59E0B" />
                      <Text style={styles.opponentEnergyText}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Opponent 3 */}
                <View style={styles.opponentCard}>
                  <View style={styles.opponentHeader}>
                    <Image source={require('../assets/opponent_3.png')} style={styles.opponentAvatar} resizeMode="contain" />
                    <View style={styles.opponentInfo}>
                      <Text style={styles.opponentName} numberOfLines={1}>IQ Champion</Text>
                      <Text style={styles.opponentLevel}>Level 20</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MaterialCommunityIcons name="trophy" size={8} color="#F59E0B" />
                        <Text style={styles.opponentRating}>1 050</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.opponentBattleBtn}>
                    <Text style={styles.opponentBattleText}>BATTLE</Text>
                    <View style={styles.opponentEnergyBadge}>
                      <MaterialCommunityIcons name="lightning-bolt" size={8} color="#F59E0B" />
                      <Text style={styles.opponentEnergyText}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>

                {/* Opponent 4 */}
                <View style={styles.opponentCard}>
                  <View style={styles.opponentHeader}>
                    <Image source={require('../assets/opponent_4.png')} style={styles.opponentAvatar} resizeMode="contain" />
                    <View style={styles.opponentInfo}>
                      <Text style={styles.opponentName} numberOfLines={1}>Math Hero</Text>
                      <Text style={styles.opponentLevel}>Level 19</Text>
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 2 }}>
                        <MaterialCommunityIcons name="trophy" size={8} color="#F59E0B" />
                        <Text style={styles.opponentRating}>980</Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity style={styles.opponentBattleBtn}>
                    <Text style={styles.opponentBattleText}>BATTLE</Text>
                    <View style={styles.opponentEnergyBadge}>
                      <MaterialCommunityIcons name="lightning-bolt" size={8} color="#F59E0B" />
                      <Text style={styles.opponentEnergyText}>1</Text>
                    </View>
                  </TouchableOpacity>
                </View>

              </View>
            </View>

          </View>
        )}

        {/* START EXERCISE BUTTON */}
        {activeExerciseType === 'battle' ? (
          <TouchableOpacity 
            style={styles.battleModeStartBtn}
            activeOpacity={0.8}
            onPress={() => {
              // handle start exercise logic here later
            }}
          >
            <View style={styles.battleStartIconContainer}>
              <Image source={require('../assets/battle_mode_oddiy.png')} style={{ width: 44, height: 44 }} resizeMode="contain" />
            </View>
            <View style={styles.battleStartTextContainer}>
              <Text style={styles.battleStartTitle}>{t.startBattle || "BATTLE BOSHLASH"}</Text>
              <Text style={styles.battleStartSubtext}>{t.startBattleSubtext || "Raqib tanlang va g'alabaga erishing!"}</Text>
            </View>
            <View style={styles.battleStartArrowContainer}>
              <MaterialCommunityIcons name="chevron-right" size={24} color="#FFF" />
            </View>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity 
            style={[styles.startExerciseBtn, (activeExerciseType === 'abacus' || activeExerciseType === 'speed') && { marginTop: 35 }]}
            activeOpacity={0.8}
            onPress={() => {
              // handle start exercise logic here later
            }}
          >
            <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFF" style={styles.startBtnIcon} />
            <Text style={styles.startExerciseBtnText}>{t.startExercise}</Text>
          </TouchableOpacity>
        )}
        
        <View style={{ height: 40 }} />
        </ScrollView>
        </View>

        {/* INVENTORY TAB CONTENT */}
        <View style={{ flex: 1, display: activeTab === 'inventory' ? 'flex' : 'none', backgroundColor: '#05050C' }}>
          <ScrollView style={{ flexShrink: 1 }} showsVerticalScrollIndicator={false}>
            {/* Inventory Global Header */}
            <View 
              style={{ 
                flexDirection: 'row', 
                paddingHorizontal: 15, 
                paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight + 10 : 20, 
                paddingBottom: 15, 
                justifyContent: 'space-between', 
                alignItems: 'center', 
              }}
            >
              {/* 1. Profile Widget */}
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(10, 15, 30, 0.5)', borderWidth: 1, borderColor: '#1E3A8A', borderRadius: 12, padding: 8, paddingRight: 32, paddingLeft: 10 }}>
                <View style={{ width: 44, height: 44, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                  <Image source={require('../assets/avatar_maks.png')} style={{ width: 30, height: 30, borderRadius: 15, zIndex: 1 }} />
                  <Image source={require('../assets/gold_frame.png')} style={{ position: 'absolute', width: 44, height: 44, resizeMode: 'contain', zIndex: 2 }} />
                </View>
                <View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                    <Text style={{ fontSize: 12, marginRight: 4 }}>🇺🇿</Text>
                    <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>IQROMAX</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="trophy" size={13} color="#FBBF24" style={{ marginRight: 4 }} />
                    <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>1 248</Text>
                  </View>
                </View>
              </View>

              {/* Grouped Right Side: Energy & Coins */}
              <View style={{ flexDirection: 'row', gap: 6 }}>
                {/* 2. Energy Widget */}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20, 15, 5, 0.5)', borderWidth: 1, borderColor: '#D97706', borderRadius: 10, padding: 6, paddingHorizontal: 8 }}>
                  <Ionicons name="flash" size={14} color="#F59E0B" style={{ marginRight: 5 }} />
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 13, marginRight: 5 }}>2</Text>
                  <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold', fontSize: 14 }}>+</Text>
                </View>

                {/* 3. Coins Widget */}
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(20, 15, 5, 0.5)', borderWidth: 1, borderColor: '#D97706', borderRadius: 10, padding: 6, paddingHorizontal: 8 }}>
                  <Image source={require('../assets/s_coin.png')} style={{ width: 16, height: 16, marginRight: 5 }} resizeMode="contain" />
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 13, marginRight: 5 }}>12k</Text>
                  <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold', fontSize: 14 }}>+</Text>
                </View>
              </View>
            </View>
          </ScrollView>
        </View>

        {/* RANKING TAB CONTENT */}
        <View style={{ flex: 1, display: activeTab === 'ranking' ? 'flex' : 'none', backgroundColor: '#05050C' }}>
          <ScrollView style={{ flexShrink: 1 }} contentContainerStyle={{ padding: 20, paddingBottom: 0 }} showsVerticalScrollIndicator={false}>
{/* Top Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 20 }}>
              <TouchableOpacity style={styles.rankingBackBtn} onPress={() => setActiveTab('home')}>
                <MaterialCommunityIcons name="arrow-left" size={24} color="#FFF" />
              </TouchableOpacity>
              
              <View style={{ flex: 1, alignItems: 'center' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="trophy" size={20} color="#F59E0B" />
                  <Text style={styles.rankingTopTitle}>{t.rankingTitle || "REYTING"}</Text>
                </View>
                <Text style={styles.rankingTopSubtitle}>{t.rankingSubtitle || "Eng kuchli matematiklar"}</Text>
              </View>
              <View style={{ width: 44 }} />
{/* Dummy view for centering */}
            </View>

{/* Golden Frame Card */}
            <ImageBackground source={require('../assets/ranking_frame.png')} style={styles.rankingGoldenFrame} resizeMode="stretch">
{/* Left: Avatar with wreath */}
              <View style={styles.rankingFrameLeft}>
                 <Image source={selectedAvatarObj ? selectedAvatarObj.img : require('../assets/opponent_1.png')} style={styles.rankingAvatar} />
              </View>

{/* Middle: User Info */}
              <View style={styles.rankingFrameMiddle}>
                <Text style={styles.rankingUserName}>IQROMAX</Text>
                <View style={styles.rankingUserPosition}>
                  <MaterialCommunityIcons name="trophy" size={16} color="#F59E0B" />
                  <Text style={styles.rankingPositionNumber}>#1</Text>
                </View>
                <View style={styles.rankingUserXpBadge}>
                  <Text style={styles.rankingUserXpText}>1248 XP</Text>
                </View>
              </View>

{/* Right: Badge and Progress */}
              <View style={styles.rankingFrameRight}>
                <View style={styles.rankingBadgeRow}>
                  <Image source={require('../assets/ranking_badge.png')} style={styles.rankingBadgeIcon} resizeMode="contain" />
                  <View>
                    <Text style={styles.rankingBadgeText}>GOLD III</Text>
                    <View style={{ flexDirection: 'row', marginTop: 2 }}>
                      <MaterialCommunityIcons name="star" size={10} color="#F59E0B" />
                      <MaterialCommunityIcons name="star" size={10} color="#F59E0B" />
                      <MaterialCommunityIcons name="star" size={10} color="#F59E0B" />
                      <MaterialCommunityIcons name="star" size={10} color="#4B5563" />
                      <MaterialCommunityIcons name="star" size={10} color="#4B5563" />
                    </View>
                  </View>
                </View>

{/* Progress Bar */}
                <View style={styles.rankingProgressContainer}>
                  <View style={styles.rankingProgressBarBg}>
                    <View style={[styles.rankingProgressBarFill, { width: '78%' }]} />
                  </View>
                  <Text style={styles.rankingProgressPercent}>78%</Text>
                </View>

                <Text style={styles.rankingTargetText}>{t.platinumTarget || "Platinum V gacha"}</Text>
                <Text style={styles.rankingXpLeftText}>
                  <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold' }}>352</Text>
                  <Text>{' '}</Text>
                  <Text>{t.xpRemaining || "XP qoldi"}</Text>
                </Text>

              </View>
            </ImageBackground>

            {/* Podium Section */}
            <View style={styles.podiumContainer}>
              <ImageBackground source={require('../assets/ranking_podium.png')} style={styles.podiumImage} resizeMode="contain">
                
                {/* 2nd Place (Left) */}
                <View style={styles.podiumSecond}>
                   <Image source={require('../assets/avatar_david.jpg')} style={styles.podiumAvatar} />
                </View>

                {/* 1st Place (Center) */}
                <View style={styles.podiumFirst}>
                   <Image source={selectedAvatarObj ? selectedAvatarObj.img : require('../assets/opponent_1.png')} style={styles.podiumAvatarFirst} />
                </View>

                {/* 3rd Place (Right) */}
                <View style={styles.podiumThird}>
                   <Image source={require('../assets/avatar_lily.jpg')} style={styles.podiumAvatar} />
                </View>

              </ImageBackground>

              {/* User Info Under Podium */}
              <View style={styles.podiumInfoRow}>
                {/* 2nd Place Info */}
                <View style={[styles.podiumInfoBox, { marginTop: -45, marginLeft: 5 }]}>
                  <Text style={styles.podiumInfoName}>MathKing</Text>
                  <View style={styles.podiumInfoXpBadge}>
                    <Text style={styles.podiumInfoXpText}>1150 XP</Text>
                  </View>
                </View>

                {/* 1st Place Info */}
                <View style={[styles.podiumInfoBox, { marginTop: -30 }]}>
                  <Text style={[styles.podiumInfoName, { color: '#F59E0B' }]}>IQROMAX</Text>
                  <View style={styles.podiumInfoXpBadge}>
                    <Text style={styles.podiumInfoXpText}>1248 XP</Text>
                  </View>
                </View>

                {/* 3rd Place Info */}
                <View style={[styles.podiumInfoBox, { marginTop: -48, marginRight: 5 }]}>
                  <Text style={styles.podiumInfoName}>FastBrain</Text>
                  <View style={styles.podiumInfoXpBadge}>
                    <Text style={styles.podiumInfoXpText}>1120 XP</Text>
                  </View>
                </View>
              </View>
            </View>

          </ScrollView>

          {/* Sticky Search Bar */}
          <View style={styles.leaderboardSearchContainer}>
            <Animated.View style={[styles.leaderboardSearchBox, { 
              flex: 1,
              marginRight: 12,
              borderColor: searchBorderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['rgba(192, 132, 252, 0.25)', 'rgba(192, 132, 252, 0.9)']
              }),
              shadowColor: '#C084FC',
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: searchBorderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 0.6]
              }),
              shadowRadius: 10,
              elevation: searchBorderAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 6]
              })
            }]}>
              <Text style={styles.leaderboardSearchIcon}>🔍</Text>
              <TextInput
                style={styles.leaderboardSearchInput}
                placeholder={t.searchPlaceholder}
                placeholderTextColor="rgba(255,255,255,0.35)"
                value={leaderboardSearch}
                onChangeText={setLeaderboardSearch}
                keyboardType="default"
                returnKeyType="search"
              />
              {leaderboardSearch.length > 0 && (
                <TouchableOpacity onPress={() => setLeaderboardSearch('')} style={styles.leaderboardSearchClear}>
                  <Text style={styles.leaderboardSearchClearText}>✕</Text>
                </TouchableOpacity>
              )}
            </Animated.View>

            {/* My Profile Button */}
            <TouchableOpacity 
              style={styles.floatingMyProfileBtn}
              onPress={() => {
                setHighlightedUserId(7); // User ID 7
                leaderboardScrollRef.current?.scrollTo({y: 350, animated: true});
                setTimeout(() => setHighlightedUserId(null), 3000); // Remove highlight after 3 seconds
              }}
              activeOpacity={0.8}
            >
              <View style={styles.floatingMyProfileInner}>
                <Feather name="user" size={24} color="#C084FC" />
              </View>
            </TouchableOpacity>
          </View>

          {/* Leaderboard Table - scrollable separately */}
          <ScrollView ref={leaderboardScrollRef} style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
            <View style={styles.leaderboardContainer}>
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((item, index) => (
                  <Animated.View key={item.id} style={[
                    styles.leaderboardRow, 
                    (index !== filteredLeaderboard.length - 1 && item.id !== highlightedUserId) && styles.leaderboardRowBorder,
                    item.id === highlightedUserId && {
                      backgroundColor: searchBorderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(192, 132, 252, 0.05)', 'rgba(192, 132, 252, 0.2)']
                      }),
                      borderColor: searchBorderAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(192, 132, 252, 0.3)', 'rgba(192, 132, 252, 1)']
                      }),
                      borderWidth: 1.5,
                      borderBottomWidth: 1.5, // Explicitly override bottom width
                      borderRadius: 12,
                      zIndex: 10,
                      elevation: 10,
                    }
                  ]}>
                    <Text style={styles.leaderboardRank}>{item.id}</Text>
                    <Image source={item.avatar} style={styles.leaderboardAvatar} />
                    <Text style={styles.leaderboardName}>{item.name}</Text>
                    <Text style={styles.leaderboardXp}>{item.xp} XP</Text>
                  </Animated.View>
                ))
              ) : (
                <View style={styles.leaderboardNoResult}>
                  <Text style={styles.leaderboardNoResultText}>Hech narsa topilmadi</Text>
                </View>
              )}
            </View>
          </ScrollView>

        </View>

        {/* PROFILE TAB CONTENT */}
        <View style={{ flex: 1, display: activeTab === 'profile' ? 'flex' : 'none', backgroundColor: '#05050C', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight - 5 : 30 }}>
          <View style={styles.profileHeader}>
            <View style={styles.profileHeaderRight}>
              <View style={[styles.profileStatBoxXp, { flex: 1 }]}>
                <Image source={require('../assets/xp_icon.jpg')} style={styles.profileStatIconLeft} />
                <View style={styles.profileStatTextWrapper}>
                  <Text style={styles.profileStatValueTop}>128 560</Text>
                </View>
              </View>
              <View style={[styles.profileStatBox, { flex: 1 }]}>
                <Image source={require('../assets/lightning_energy.png')} style={styles.profileStatIconEnergy} />
                <Text style={styles.profileStatValueMid}>2/10</Text>
                <TouchableOpacity style={styles.profileStatPlusBtn}>
                  <Text style={styles.profileStatPlusText}>+</Text>
                </TouchableOpacity>
              </View>
              <View style={[styles.profileStatBox, { flex: 1, marginRight: 0 }]}>
                <Image source={require('../assets/s_coin.png')} style={styles.profileStatIconCoin} />
                <Text style={styles.profileStatValueMid}>12 450</Text>
                <TouchableOpacity style={styles.profileStatPlusBtn}>
                  <Text style={styles.profileStatPlusText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Main Card Section */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 16 }}>
              {/* Card 1: Info Card */}
              <View style={[styles.profileInfoCardContainer, { flex: 1.5, marginRight: 10 }]}>
                <ImageBackground 
                  source={require('../assets/space_bg.jpg')} 
                  style={styles.profileInfoCardBg}
                  imageStyle={styles.profileInfoCardBgImage}
                >
                  <View style={styles.profileInfoCardContent}>
                    {/* Left: Avatar & Frame */}
                    <View style={styles.profileAvatarContainer}>
                      <Image source={require('../assets/avatar_maks.png')} style={styles.profileBigAvatar} />
                      <Image source={require('../assets/gold_frame.png')} style={styles.profileGoldFrame} />
                    </View>

                    {/* Right: Info */}
                    <View style={styles.profileDetailsContainer}>
                      <Text style={styles.profileMainName} numberOfLines={1}>IQROMAX</Text>
                      
                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailIcon}>🇺🇿</Text>
                        <Text style={styles.profileDetailText} numberOfLines={1}>Uzbekistan</Text>
                      </View>

                      <View style={styles.profileDetailRow}>
                        <Image source={require('../assets/gold_star.png')} style={styles.profileStarIconSm} />
                        <Text style={styles.profileDetailTextGold} numberOfLines={1}>GOLD III</Text>
                      </View>

                      <View style={styles.profileDetailRow}>
                        <Text style={styles.profileDetailIcon}>🏆</Text>
                        <Text style={styles.profileDetailText} numberOfLines={1}>#1 Reyting</Text>
                      </View>
                    </View>
                  </View>
                </ImageBackground>
              </View>

              {/* Card 2: Progress Card */}
              <View style={[styles.profileProgressCard, { flex: 1 }]}>
                <View style={styles.profileProgressHeaderRow}>
                  <Image source={require('../assets/gold_star.png')} style={styles.profileStarIconMd} />
                  <Text style={styles.profileProgressTitle} numberOfLines={1}>GOLD III</Text>
                </View>

                <View style={styles.profileProgressBarContainer}>
                  <View style={styles.profileProgressBarTrack}>
                    <View style={[styles.profileProgressBarFill, { width: '78%' }]} />
                  </View>
                  <Text style={styles.profileProgressPercent}>78%</Text>
                </View>

                <View style={{ flex: 1 }}>
                  <Text style={styles.profileProgressSubtitle} numberOfLines={1}>Platinum V gacha</Text>
                  <Text style={styles.profileProgressXpLeft} numberOfLines={1}><Text style={styles.profileProgressXpHighlight}>352 XP</Text> qoldi</Text>
                </View>

                <TouchableOpacity style={styles.profileBatafsilBtn}>
                  <Text style={styles.profileBatafsilText}>BATAFSIL</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#F59E0B" style={styles.profileBatafsilIcon} />
                </TouchableOpacity>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
            {/* STATISTIKA SECTION */}
            <View style={styles.statSectionContainer}>
              <View style={styles.statSectionHeader}>
                <Image source={require('../assets/stat_icon_1.png')} style={styles.statSectionTitleIcon} />
                <Text style={styles.statSectionTitle}>{t.stats}</Text>
              </View>

              <View style={styles.statGridContainer}>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_2.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>1248</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statRating}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_3.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>0.8s</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statSpeed}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_4.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>95%</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statAccuracy}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_5.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>14</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statStreak}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_6.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>256</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statExercises}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_7.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>18</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statAchievements}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_8.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>128560</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statXP}</Text>
                </View>
                <View style={styles.gridStatCard}>
                  <Image source={require('../assets/stat_icon_9.png')} style={styles.gridStatCardIcon} />
                  <Text style={styles.gridStatCardValue}>12450</Text>
                  <Text style={styles.gridStatCardLabel}>{t.statCoin}</Text>
                </View>
              </View>
            </View>

            {/* YUTUQLAR SECTION */}
            <View style={styles.yutuqSectionContainer}>
              <View style={styles.yutuqHeaderRow}>
                <View style={styles.yutuqHeaderLeft}>
                  <Text style={styles.yutuqCrownIcon}>👑</Text>
                  <Text style={styles.yutuqSectionTitle}>{t.achievementsTitle}</Text>
                </View>
                
                <View style={styles.yutuqPaginationDots}>
                  {[0, 1, 2, 3, 4].map((dotIndex) => (
                    <View 
                      key={dotIndex} 
                      style={[
                        styles.yutuqDot, 
                        (currentYutuqIndex % 5) === dotIndex && styles.yutuqDotActive
                      ]} 
                    />
                  ))}
                </View>

                <TouchableOpacity style={styles.yutuqViewAllBtn}>
                  <Text style={styles.yutuqViewAllText}>{t.seeAll}</Text>
                  <MaterialCommunityIcons name="chevron-right" size={16} color="#c084fc" />
                </TouchableOpacity>
              </View>

              <ScrollView 
                ref={yutuqScrollRef}
                horizontal 
                showsHorizontalScrollIndicator={false} 
                contentContainerStyle={styles.yutuqCarouselContainer}
              >
                {/* 12 Achievement Cards */}
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_1.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 1</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_2.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 2</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_3.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achv14Days}</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_4.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvTop10}</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_5.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGold3}</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_6.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 6</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_7.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 7</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_8.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 8</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_9.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 9</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_10.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 10</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_11.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 11</Text>
                </View>
                <View style={styles.yutuqCard}>
                  <Image source={require('../assets/yutuq_12.png')} style={styles.yutuqCardIcon} />
                  <Text style={styles.yutuqCardLabel}>{t.achvGeneric} 12</Text>
                </View>
              </ScrollView>
            </View>

            {/* FAOLIYAT VA KOLLEKSIYA */}
            <View style={styles.activityCollectionRow}>
              {/* FAOLIYAT TARIXI CARD */}
              <View style={styles.activityCard}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityHeaderLeft}>
                    <Image source={require('../assets/yangi_1.png')} style={styles.activityHeaderIcon} />
                    <Text style={styles.activityHeaderTitle}>{t.activityTitle}</Text>
                  </View>
                  <TouchableOpacity>
                    <Text style={styles.activityHeaderLink}>{t.activitySeeAll}</Text>
                  </TouchableOpacity>
                </View>

                <View style={styles.activityList}>
                  <View style={styles.activityItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_2.png')} style={styles.activityItemIcon} />
                      <View>
                        <Text style={styles.activityItemTitle}>{t.actSimple}</Text>
                        <Text style={styles.activityItemSub}>{t.actToday}, 12:30</Text>
                      </View>
                    </View>
                    <Text style={styles.activityItemValueGreen}>95%</Text>
                  </View>

                  <View style={styles.activityItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_3.png')} style={styles.activityItemIcon} />
                      <View>
                        <Text style={styles.activityItemTitle}>{t.actBattle}</Text>
                        <Text style={styles.activityItemSub}>{t.actToday}, 11:45</Text>
                      </View>
                    </View>
                    <Text style={styles.activityItemValueGreen}>{t.actWin}</Text>
                  </View>

                  <View style={styles.activityItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_4.png')} style={styles.activityItemIcon} />
                      <View>
                        <Text style={styles.activityItemTitle}>{t.actFast}</Text>
                        <Text style={styles.activityItemSub}>{t.actToday}, 10:15</Text>
                      </View>
                    </View>
                    <Text style={styles.activityItemValueGreen}>92%</Text>
                  </View>

                  <View style={[styles.activityItem, { borderBottomWidth: 0, paddingBottom: 0, marginBottom: 0 }]}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_5.png')} style={styles.activityItemIcon} />
                      <View>
                        <Text style={styles.activityItemTitle}>{t.actAbacus}</Text>
                        <Text style={styles.activityItemSub}>{t.actYesterday}, 21:20</Text>
                      </View>
                    </View>
                    <Text style={styles.activityItemValueGreen}>88%</Text>
                  </View>
                </View>
              </View>

              {/* MENING KOLLEKSIYAM CARD */}
              <View style={styles.collectionCard}>
                <View style={styles.activityHeader}>
                  <View style={styles.activityHeaderLeft}>
                    <Image source={require('../assets/yangi_6.png')} style={styles.activityHeaderIcon} />
                    <Text style={styles.activityHeaderTitle}>{t.collectionTitle}</Text>
                  </View>
                </View>

                <View style={styles.collectionList}>
                  <View style={styles.collectionItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_7.png')} style={styles.collectionItemIcon} />
                      <Text style={styles.activityItemTitle}>{t.collAvatars}</Text>
                    </View>
                    <Text style={styles.collectionItemValue}>18</Text>
                  </View>

                  <View style={styles.collectionItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_8.png')} style={styles.collectionItemIcon} />
                      <Text style={styles.activityItemTitle}>{t.collFrames}</Text>
                    </View>
                    <Text style={styles.collectionItemValue}>12</Text>
                  </View>

                  <View style={styles.collectionItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_9.png')} style={styles.collectionItemIcon} />
                      <Text style={styles.activityItemTitle}>{t.collBgs}</Text>
                    </View>
                    <Text style={styles.collectionItemValue}>8</Text>
                  </View>

                  <View style={styles.collectionItem}>
                    <View style={styles.activityItemLeft}>
                      <Image source={require('../assets/yangi_10.png')} style={styles.collectionItemIcon} />
                      <Text style={styles.activityItemTitle}>{t.collChars}</Text>
                    </View>
                    <Text style={styles.collectionItemValue}>3</Text>
                  </View>
                </View>

                <TouchableOpacity style={styles.inventoryBtn}>
                  <Text style={styles.inventoryBtnText}>{t.collBtn}</Text>
                </TouchableOpacity>
              </View>
            </View>

          </ScrollView>
        </View>


        {/* Stats Row 2 */}
        <View style={styles.navBarContainer}>
          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'home' && styles.navItemActive]} 
            onPress={() => setActiveTab('home')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="home" 
              size={26} 
              color={activeTab === 'home' ? '#A855F7' : '#9CA3AF'} 
            />
            <Text style={[styles.navText, activeTab === 'home' && styles.navTextActive]}>
              {t.navHome}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'exercise' && styles.navItemActive]} 
            onPress={() => setActiveTab('exercise')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="view-grid-outline" 
              size={26} 
              color={activeTab === 'exercise' ? '#A855F7' : '#9CA3AF'} 
            />
            <Text style={[styles.navText, activeTab === 'exercise' && styles.navTextActive]}>
              {t.navExercise}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'inventory' && styles.navItemActive]} 
            onPress={() => setActiveTab('inventory')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="bag-personal-outline" 
              size={26} 
              color={activeTab === 'inventory' ? '#A855F7' : '#9CA3AF'} 
            />
            <Text style={[styles.navText, activeTab === 'inventory' && styles.navTextActive]}>
              {t.navInventory}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'ranking' && styles.navItemActive]} 
            onPress={() => setActiveTab('ranking')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="trophy-outline" 
              size={26} 
              color={activeTab === 'ranking' ? '#A855F7' : '#9CA3AF'} 
            />
            <Text style={[styles.navText, activeTab === 'ranking' && styles.navTextActive]}>
              {t.navRanking}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.navItem, activeTab === 'profile' && styles.navItemActive]} 
            onPress={() => setActiveTab('profile')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons 
              name="account-outline" 
              size={26} 
              color={activeTab === 'profile' ? '#A855F7' : '#9CA3AF'} 
            />
            <Text style={[styles.navText, activeTab === 'profile' && styles.navTextActive]}>
              {t.navProfile}
            </Text>
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
  header: {
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 0, // Removed padding to touch cards
    backgroundColor: '#05050C',
    zIndex: 10, // Ensure header is above main content (and its absolute image)
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  iconButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#12121D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoIqro: {
    color: '#FFFFFF',
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  logoMax: {
    color: '#A855F7', // Purple
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1,
  },
  rightIcons: {
    flexDirection: 'row',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A16',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statImage: {
    width: 36,
    height: 36,
    marginRight: 8,
    borderRadius: 18,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  statLabel: {
    color: '#888899',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  plusButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#12121D',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  mainContent: {
    flex: 1,
    backgroundColor: '#05050C',
  },
  fixedTopSection: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  scrollMask: {
    position: 'absolute',
    top: 350, 
    left: 0,
    right: 0,
    height: 160, 
    backgroundColor: '#05050C',
    zIndex: 0,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0, 
    left: 0,
    right: 0,
    width: '100%',
    height: 350, // Fixed height to align scroll content
    resizeMode: 'cover',
  },
  contentOverlay: {
    height: 350, // Match the background image height
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    paddingLeft: 10,
    paddingTop: 45, 
  },
  leftPanelContainer: {
    height: '100%',
    alignItems: 'center',
    marginRight: 0,
    zIndex: 10,
  },
  leftPanelTitle: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  leftPanel: {
    width: 75,
    maxHeight: '85%',
    backgroundColor: 'rgba(20, 15, 35, 0.85)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    alignItems: 'center',
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
    elevation: 8,
  },
  avatarList: {
    alignItems: 'center',
    paddingBottom: 10,
  },
  avatarItem: {
    width: 52,
    height: 52,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  avatarItemSelected: {
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
  },
  dropdownIconContainer: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: 'rgba(20, 15, 35, 0.95)',
    borderRadius: 10,
    padding: 2,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  barchaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(168, 85, 247, 0.2)', // Slightly purple background
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderRadius: 10,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(168, 85, 247, 0.4)',
  },
  barchaText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '700',
    marginRight: 2,
  },
  rightPanel: {
    width: 135, // Set fixed width so card and buttons align perfectly
    zIndex: 10,
  },
  glassCard: {
    backgroundColor: 'rgba(25, 20, 40, 0.7)',
    borderRadius: 12, // Shrunk
    padding: 10, // Shrunk
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    marginBottom: 10, // Shrunk
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Shrunk
  },
  mathMasterLogo: {
    width: 35, 
    height: 35, 
    marginRight: 8, 
  },
  cardTitles: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFF',
    fontSize: 12, // Shrunk text
    fontFamily: 'Inter_700Bold',
  },
  cardSubtitle: {
    color: '#A855F7',
    fontSize: 9, // Shrunk text
    fontFamily: 'Inter_600SemiBold',
    marginTop: 2,
  },
  cardDesc: {
    color: '#D1D5DB',
    fontSize: 8, // Shrunk text
    fontFamily: 'Inter_400Regular',
    lineHeight: 12, // Shrunk
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Align buttons to edges
    marginTop: 15,
    gap: 8,
  },
  actionButton: {
    flex: 1, // Stretch to fill the half space each
    backgroundColor: 'rgba(25, 20, 40, 0.7)',
    borderRadius: 12,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    aspectRatio: 1,
  },
  notificationDotRed: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#EF4444',
  },
  actionButtonText: {
    color: '#FFF',
    fontSize: 7, // Shrunk text
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
    textAlign: 'center',
  },
  levelBarContainer: {
    paddingHorizontal: 20,
    alignItems: 'center',
    zIndex: 10,
  },
  levelCardWrapper: {
    width: '100%',
    height: 65, 
    justifyContent: 'center',
  },
  levelCard: {
    backgroundColor: '#070716',
    borderRadius: 16, // Shrunk slightly
    borderWidth: 1,
    borderColor: '#1F1F3D',
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10, // Shrunk
    paddingLeft: 75, // Shrunk space for smaller shield
    paddingRight: 10, // Shrunk
    height: '100%',
  },
  progressSection: {
    flex: 1,
    marginRight: 80, // Increased margin to keep progress bar away from the larger chest
  },
  progressHeaderRow: {
    marginBottom: 4, // Shrunk
  },
  progressValueBold: {
    color: '#FFF',
    fontSize: 14, // Shrunk
    fontFamily: 'Inter_700Bold',
  },
  progressValueNormal: {
    color: '#D1D5DB',
    fontSize: 12, // Shrunk
    fontFamily: 'Inter_400Regular',
  },
  progressXP: {
    color: '#A855F7',
    fontSize: 12, // Shrunk
    fontFamily: 'Inter_700Bold',
  },
  progressBarTrack: {
    height: 8, // Shrunk
    backgroundColor: '#1F1F3D',
    borderRadius: 4,
    marginBottom: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#6D28D9',
    borderRadius: 5,
  },
  progressFooterText: {
    color: '#D1D5DB',
    fontSize: 9, // Shrunk
    fontFamily: 'Inter_400Regular',
  },
  rightLevelInfo: {
    alignItems: 'flex-end',
  },
  rightLevelLabel: {
    color: '#FFF',
    fontSize: 10, // Shrunk
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  rightLevelSub: {
    color: '#D1D5DB',
    fontSize: 8, // Shrunk
    fontFamily: 'Inter_400Regular',
  },
  shieldWrapper: {
    position: 'absolute',
    left: -10, // Shrunk overlap
    top: -15,  // Shrunk overlap
    width: 80, // Shrunk
    height: 100, // Shrunk
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
  },
  shieldImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  shieldTextWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6, // Shrunk
  },
  shieldLevelText: {
    color: '#FFF',
    fontSize: 8, // Shrunk
    fontFamily: 'Inter_600SemiBold',
  },
  shieldLevelNumber: {
    color: '#FFF',
    fontSize: 20, // Shrunk
    fontFamily: 'Inter_900Black',
  },
  chestWrapper: {
    position: 'absolute',
    right: -15, // Adjusted to stick out on the right
    top: -20,  // Centered vertically for 105px height ((105 - 65) / 2 = 20)
    width: 105, // Enlarged
    height: 105, // Enlarged
    zIndex: 5,
  },
  chestImage: {
    width: '100%',
    height: '100%',
  },
  startButton: {
    width: '105%',
    alignSelf: 'center',
    height: 70,
    marginTop: 15,
    zIndex: 10,
  },
  startButtonBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#451A03',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginRight: 35,
    textTransform: 'uppercase',
  },
  startButtonTouchable: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginTop: 0, // Reset to 0 since action cards take up the space
    zIndex: 20, 
  },
  actionCardsContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Center them
    paddingHorizontal: 10, 
    marginTop: 0, // Reset to 0 since paddingTop handles positioning
    marginBottom: 20,
    zIndex: 0,
    gap: 2, // Even closer to each other
  },
  actionCardWrapper: {
    flex: 1, // Let flex box handle the equal distribution
    alignItems: 'center',
  },
  actionImage: {
    width: '100%', // Takes full width of the flex item
    height: 95, // Increased height to make them taller
    justifyContent: 'flex-end', // Place text at the bottom inside the image
    paddingBottom: 10, // Padding from the bottom of the card
  },
  actionText: {
    color: '#FFF',
    fontSize: 9, // Slightly larger text
    fontFamily: 'Inter_700Bold', // Made bold for readability inside image
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  notificationDotCard: {
    position: 'absolute',
    top: 5,
    right: 5,
    width: 14, // Slightly larger dot for larger card
    height: 14,
    borderRadius: 7,
    backgroundColor: '#EF4444', // Red dot
    zIndex: 5,
    borderWidth: 2,
    borderColor: '#05050C',
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10, // Reduced from 15 to bring cards closer
  },
  statsTitle: {
    color: '#D1D5DB', // Light gray
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  seeAllText: {
    color: '#A855F7', // Purple
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  navBarContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#05050C',
    borderTopWidth: 1,
    borderTopColor: '#1F1F30',
    paddingBottom: 25, 
    zIndex: 100, // Stay above everything
    elevation: 20, // Add elevation for Android zIndex to work
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  statCardBlock: {
    backgroundColor: '#070716', // Very dark blue/black
    borderWidth: 1.5,
    borderRadius: 8, // Slightly smaller radius
    width: '24%', // Fits 4 in a row
    paddingVertical: 6, // Smaller height
    paddingHorizontal: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statCardInner: {
    flexDirection: 'row', // Icon on left, text on right
    alignItems: 'center',
    justifyContent: 'center',
  },
  statIconLeft: {
    marginRight: 4, // Space between icon and text
    marginBottom: 0,
  },
  statTextRight: {
    alignItems: 'flex-start', // Align text to left
    flexShrink: 1, // Ensure text shrinks to fit
  },
  statTopLabel: {
    color: '#FFF',
    fontSize: 6, // Reduced size to fit horizontally
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
    textTransform: 'uppercase',
  },
  statMainNumber: {
    color: '#FFF',
    fontSize: 14, // Reduced size
    fontFamily: 'Inter_700Bold',
    marginBottom: 0,
  },
  statBottomLabel: {
    fontSize: 6, // Reduced size
    fontFamily: 'Inter_500Medium',
  },
  navBarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
    backgroundColor: '#050512', // Very dark blue/black matching the image
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderTopWidth: 1,
    borderRightWidth: 1,
    borderLeftWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  navItem: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 16,
    minWidth: '18%',
  },
  navItemActive: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)', // Light purple translucent bg
  },
  navText: {
    color: '#9CA3AF', // Gray color
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 4,
    textTransform: 'uppercase',
  },
  navTextActive: {
    color: '#A855F7', // Bright purple
  },
  exHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 10,
  },
  exBackButton: {
    width: 40,
    height: 40,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#3B0764',
    backgroundColor: '#0A0A14',
    alignItems: 'center',
    justifyContent: 'center',
  },
  exTitleContainer: {
    alignItems: 'center',
    flex: 1,
    paddingHorizontal: 10,
  },
  exTitle: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  exSubtitle: {
    color: '#9CA3AF',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 4,
    textAlign: 'center',
  },
  exEnergyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B0764',
    backgroundColor: '#0A0A14',
    borderRadius: 14,
    paddingHorizontal: 10,
    height: 40,
    gap: 4,
  },
  exEnergyText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  exerciseSectionTitle: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 6,
  },
  exerciseTypesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  exerciseCard: {
    flex: 1,
    marginHorizontal: 2,
    aspectRatio: 0.62, // Taller cards
    borderRadius: 10,
    overflow: 'hidden',
  },
  exerciseCardBg: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
  },
  exerciseCardContent: {
    paddingHorizontal: 4,
    paddingBottom: 8,
    alignItems: 'center',
    height: '50%',
    justifyContent: 'flex-end',
  },
  exerciseCardTextContainer: {
    alignItems: 'center',
    marginBottom: 8,
    minHeight: 32,
    justifyContent: 'center',
    width: '100%',
  },
  exerciseCardTitle: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 2,
    width: '100%',
  },
  exerciseCardDesc: {
    color: '#D1D5DB', // Light gray
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    width: '100%',
  },
  exerciseCardEnergyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 6,
    paddingVertical: 4,
    width: '90%',
    gap: 4,
  },
  exerciseCardEnergyText: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },

  // INFO CARD
  infoCardContainer: {
    marginTop: 20,
    width: '100%',
    aspectRatio: 1.6, // Based on the provided image dimensions approximately
    borderRadius: 16,
    overflow: 'hidden',
  },
  infoCardBg: {
    width: '100%',
    height: '100%',
  },
  infoCardContent: {
    flex: 1,
    flexDirection: 'row',
  },
  infoTextContainer: {
    flex: 1,
    paddingLeft: '44%', // Shifted further to the right
    paddingRight: 15,
    paddingVertical: 20,
    justifyContent: 'center',
  },
  infoTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 8,
  },
  infoDesc: {
    color: '#D1D5DB',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    lineHeight: 16,
    marginBottom: 10,
  },
  infoOpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginBottom: 15,
  },
  infoOpsLabel: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  infoOpAdd: {
    color: '#4ADE80', // Green
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  infoOpSub: {
    color: '#60A5FA', // Blue
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  infoOpMul: {
    color: '#F97316', // Orange
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  infoOpDiv: {
    color: '#38BDF8', // Light Blue
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  infoExampleLabel: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginBottom: 6,
  },
  infoExamplesGrid: {
    flexDirection: 'row',
  },
  infoExampleCol: {
    flex: 1,
    gap: 6,
  },
  infoExAdd: {
    color: '#4ADE80',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  infoExSub: {
    color: '#60A5FA',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  infoExMul: {
    color: '#F97316',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  infoExDiv: {
    color: '#38BDF8',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  
  // START EXERCISE BUTTON
  startExerciseBtn: {
    marginTop: 15,
    backgroundColor: '#4C1D95',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    width: '100%',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  startBtnIcon: {
    marginRight: 10,
  },
  startExerciseBtnText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
  
  // EXAMPLES SELECTOR
  examplesContainer: {
    marginTop: 15,
    backgroundColor: '#070710',
    borderRadius: 16,
    padding: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#1A103C',
  },
  examplesHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  examplesIconBox: {
    width: 44,
    height: 44,
    backgroundColor: '#150A2E',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  examplesHeaderTextContainer: {
    flex: 1,
  },
  examplesTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  examplesSubtitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  examplesSelectorClosed: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0D0820', 
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: '#3B1877',
  },
  examplesSelectorValueText: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_600SemiBold',
  },
  examplesSelectorLabelText: {
    color: '#D8B4FE',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  examplesPickerExpanded: {
    backgroundColor: '#070710',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A103C',
    height: 120,
    overflow: 'hidden',
  },
  examplesPickerScroll: {
    width: '100%',
  },
  examplesPickerItem: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  examplesPickerItemSelected: {
    backgroundColor: '#1E1045',
    borderRadius: 12,
    marginHorizontal: 10,
  },
  examplesPickerItemText: {
    color: '#6B7280',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  examplesPickerItemTextSelected: {
    color: '#fff',
    fontWeight: 'bold',
  },
  examplesPickerItemLabel: {
    fontSize: 14,
    color: '#D1D5DB',
    fontWeight: 'normal',
  },

  // OPERATIONS SECTION
  opsContainer: {
    marginTop: 15,
    backgroundColor: '#070710',
    borderRadius: 16,
    padding: 16,
    paddingRight: 0, // Let ScrollView extend to edge
    width: '100%',
    borderWidth: 1,
    borderColor: '#1A103C',
  },
  opsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingRight: 16,
  },
  opsIconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  opsHeaderTextContainer: {
    flex: 1,
  },
  opsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  opsSubtitle: {
    color: '#9CA3AF',
    fontSize: 14,
    marginTop: 2,
  },
  opsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingRight: 16,
  },
  opsCard: {
    flex: 1,
    height: 110,
    backgroundColor: '#0f1020',
    borderRadius: 12,
    padding: 6,
    marginHorizontal: 3,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  opsCardSelected: {
    backgroundColor: '#160a2b',
    borderColor: '#A855F7',
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  opsCheckmarkBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opsCardIconWrapper: {
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  opsFormulaIcon: {
    fontSize: 18,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontFamily: 'serif',
  },
  opsFormulaIconSelected: {
    color: '#fff',
  },
  opsCardTitle: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    marginBottom: 2,
    textAlign: 'center',
  },
  opsCardTitleSelected: {
    color: '#fff',
  },
  opsCardDesc: {
    color: '#9CA3AF',
    fontSize: 9,
    textAlign: 'center',
    lineHeight: 11,
  },
  // ABACUS SECTION STYLES
  abacusSectionTitle: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    marginTop: 20,
    marginBottom: 10,
  },
  abacusCardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
  },
  abacusDiffCard: {
    flex: 1,
    backgroundColor: '#0A0A16',
    borderWidth: 1,
    borderColor: '#1A103C',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 4,
    alignItems: 'center',
    position: 'relative',
  },
  abacusDiffCardSelected: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.1)',
  },
  abacusDiffEmoji: {
    fontSize: 24,
    marginBottom: 8,
  },
  abacusDiffTitle: {
    color: '#D1D5DB',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 4,
    textAlign: 'center',
  },
  abacusDiffTitleSelected: {
    color: '#A855F7',
    fontFamily: 'Inter_600SemiBold',
  },
  abacusStarsRow: {
    flexDirection: 'row',
    gap: 2,
  },
  abacusCheckbox: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: '#374151',
  },
  abacusCountCard: {
    flex: 1,
    backgroundColor: '#0A0A16',
    borderWidth: 1,
    borderColor: '#1A103C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
  },
  abacusCountCardSelected: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  abacusCountNum: {
    color: '#E5E7EB',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
  },
  abacusCountNumSelected: {
    color: '#A855F7',
  },
  abacusCountLabel: {
    color: '#6B7280',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },
  abacusCountLabelSelected: {
    color: '#A855F7',
  },
  abacusOpCard: {
    flex: 1,
    backgroundColor: '#0A0A16',
    borderWidth: 1,
    borderColor: '#1A103C',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    position: 'relative',
  },
  abacusOpCardSelected: {
    borderColor: '#A855F7',
  },
  abacusOpTitle: {
    color: '#E5E7EB',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 6,
  },
  abacusOpSymbol: {
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  abacusOpAdd: { color: '#22C55E' },
  abacusOpSub: { color: '#EF4444' },
  abacusOpMul: { color: '#F59E0B' },
  abacusOpDiv: { color: '#3B82F6' },
  abacusOpCheckCircle: {
    position: 'absolute',
    top: -6,
    right: -6,
    backgroundColor: '#A855F7',
    borderRadius: 12,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // BATTLE SECTION STYLES
  battleCardContainer: {
    width: '100%',
    aspectRatio: 1.85, // Fixed aspect ratio to prevent squashing (taller)
    borderRadius: 16,
    overflow: 'hidden',
  },
  battleCardBg: {
    width: '100%',
    height: '100%',
  },
  battleCardOverlay: {
    flex: 1,
    position: 'relative',
  },
  battleLeftPlayer: {
    position: 'absolute',
    top: '25%', // Reverted back
    left: '24%',
    alignItems: 'flex-start',
  },
  battleRightPlayer: {
    position: 'absolute',
    top: '25%', // Reverted back
    left: '60%',
    alignItems: 'flex-start',
  },
  battlePlayerLabelYou: {
    color: '#38BDF8', // Light Blue
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  battlePlayerLabelOpp: {
    color: '#EF4444', // Red
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  battlePlayerNameYou: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
    maxWidth: 90,
  },
  battlePlayerNameOpp: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 4,
    maxWidth: 90,
  },
  battleLevelBadgeYou: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  battleLevelBadgeOpp: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    marginBottom: 6,
  },
  battleLevelTextYou: {
    color: '#D8B4FE',
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  battleLevelTextOpp: {
    color: '#D8B4FE',
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
  },
  battleTrophyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  battleTrophyTextYou: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  battleTrophyTextOpp: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  leaderboardContainer: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#080B13',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.15)',
  },
  floatingMyProfileBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#05050C',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(192, 132, 252, 0.4)',
    shadowColor: '#C084FC',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 10,
    elevation: 8,
  },
  floatingMyProfileInner: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#C084FC',
    justifyContent: 'center',
    alignItems: 'center',
  },
  battleReytingText: {
    color: '#9CA3AF',
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
  },

  // BATTLE MODES STYLES
  battleModeCard: {
    backgroundColor: '#05050C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 6,
    width: '23.5%', // Ensure 4 items fit in a row without scrolling
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  battleModeCardActive: {
    borderColor: '#A855F7',
    backgroundColor: 'rgba(168, 85, 247, 0.05)',
    shadowColor: '#A855F7',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  battleModeIcon: {
    width: 35,
    height: 35,
    marginBottom: 6,
  },
  battleModeTitle: {
    color: '#F8FAFC',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
    marginBottom: 4,
  },
  battleModeDesc: {
    color: '#9CA3AF',
    fontSize: 7,
    fontFamily: 'Inter_400Regular',
    textAlign: 'center',
    marginBottom: 6,
    minHeight: 25, // Ensure uniform height for all cards
  },
  battleModeEnergyBadge: {
    backgroundColor: '#1E1B4B',
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 'auto', // Pushes badge to the bottom
  },
  battleModeEnergyText: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    marginLeft: 2,
  },

  // DAILY BOXES STYLES
  dailyBoxCard: {
    backgroundColor: '#05050C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 12,
    flex: 1,
    justifyContent: 'space-between',
  },
  dailyBoxTitle: {
    color: '#F8FAFC',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },

  // BEST RESULTS STYLES
  bestResultsCard: {
    backgroundColor: '#05050C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    padding: 15,
    marginTop: 5,
    marginBottom: 20,
    width: '100%',
  },
  bestResultsTitle: {
    color: '#F8FAFC',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginBottom: 15,
  },
  bestResultsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bestResultItem: {
    alignItems: 'center',
    flex: 1,
  },
  bestResultIcon: {
    width: 36,
    height: 36,
    marginBottom: 8,
  },
  bestResultLabel: {
    color: '#9CA3AF',
    fontSize: 9,
    fontFamily: 'Inter_400Regular',
    marginBottom: 4,
    textAlign: 'center',
  },
  bestResultValue: {
    color: '#F8FAFC',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  bestResultDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  // QUICK OPPONENT STYLES
  quickOpponentTitle: {
    color: '#F8FAFC',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  quickOpponentRefresh: {
    color: '#A855F7',
    fontSize: 11,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 4,
  },
  opponentCard: {
    backgroundColor: '#05050C',
    borderRadius: 12, // Improved border corners
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)', // Made border even more visible
    paddingHorizontal: 4,
    paddingTop: 12,
    paddingBottom: 6, // Reduced to make button stick to bottom
    width: '24%', // Fit 4 in a row
    justifyContent: 'space-between',
    minHeight: 135,
  },
  opponentHeader: {
    flexDirection: 'column', // Avatar on top, text below for larger sizes to fit
    alignItems: 'center',
    marginBottom: 10,
  },
  opponentAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginBottom: 4,
  },
  opponentInfo: {
    alignItems: 'center',
    width: '100%',
  },
  opponentName: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    textAlign: 'center',
  },
  opponentLevel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  opponentRating: {
    color: '#EAB308',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginLeft: 2,
  },
  opponentBattleBtn: {
    backgroundColor: '#166534',
    borderRadius: 6,
    paddingVertical: 6,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0, // Button sticks to the bottom border
  },
  opponentBattleText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginBottom: 1,
  },
  opponentEnergyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  opponentEnergyText: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
    marginLeft: 2,
  },

  // START BATTLE BUTTON STYLES
  battleModeStartBtn: {
    backgroundColor: '#F59E0B', // Rich Orange Base
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FDE68A', // Light glow border
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginTop: -5, // Lifted button upwards
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 8,
  },
  battleStartIconContainer: {
    marginRight: 15,
  },
  battleStartTextContainer: {
    flex: 1,
  },
  battleStartTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  battleStartSubtext: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
    opacity: 0.95,
  },
  battleStartArrowContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // RANKING TAB STYLES
  rankingBackBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#111827',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  rankingTopTitle: {
    color: '#F59E0B',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 8,
  },
  rankingTopSubtitle: {
    color: '#D1D5DB',
    fontSize: 12,
    fontFamily: 'Inter_400Regular',
    marginTop: 4,
  },
  rankingGoldenFrame: {
    width: '100%',
    height: 130, // Reduced height for the frame
    flexDirection: 'row',
    alignItems: 'center',
  },
  rankingFrameLeft: {
    width: 115, // Adjusted to match the new height
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingAvatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    marginTop: -28, // Shifted even further upwards
    marginLeft: 34,
  },
  rankingFrameMiddle: {
    flex: 1,
    justifyContent: 'center',
    paddingLeft: 26, // Shifted even further right
  },
  rankingUserName: {
    color: '#FFF',
    fontSize: 14, // Slightly reduced
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  rankingUserPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rankingPositionNumber: {
    color: '#F59E0B',
    fontSize: 18, // Slightly reduced
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 6,
  },
  rankingUserXpBadge: {
    backgroundColor: '#4C1D95',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 6,
  },
  rankingUserXpText: {
    color: '#FFF',
    fontSize: 10, // Slightly reduced
    fontFamily: 'Inter_700Bold',
  },
  rankingFrameRight: {
    flex: 1.2,
    justifyContent: 'center',
    paddingRight: 15,
  },
  rankingBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rankingBadgeIcon: {
    width: 28,
    height: 28,
    marginRight: 6,
  },
  rankingBadgeText: {
    color: '#FDE68A',
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  rankingProgressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  rankingProgressBarBg: {
    flex: 1,
    height: 6,
    backgroundColor: '#374151',
    borderRadius: 3,
    marginRight: 8,
    overflow: 'hidden',
  },
  rankingProgressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 3,
  },
  rankingProgressPercent: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  rankingTargetText: {
    color: '#D1D5DB',
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  rankingXpLeftText: {
    color: '#9CA3AF',
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
  },

  // PODIUM STYLES
  podiumContainer: {
    marginTop: -25, // Negative margin to pull the whole block upwards
    width: '100%',
    alignItems: 'center',
  },
  podiumImage: {
    width: '100%',
    height: 240,
    position: 'relative',
  },
  podiumFirst: {
    position: 'absolute',
    top: '19%', // Shifted further downwards
    left: '50%',
    marginLeft: -33, // half of width
    width: 66,
    height: 66,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  podiumAvatarFirst: {
    width: '100%',
    height: '100%',
  },
  podiumSecond: {
    position: 'absolute',
    top: '35%', // Shifted further upwards
    left: '11%',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  podiumThird: {
    position: 'absolute',
    top: '33%', // Shifted further upwards
    right: '11%',
    width: 54,
    height: 54,
    borderRadius: 27,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  podiumAvatar: {
    width: '100%',
    height: '100%',
  },
  podiumInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
    marginTop: -30, // overlap with the bottom of the podium
  },
  podiumInfoBox: {
    alignItems: 'center',
    width: '30%',
  },
  podiumInfoName: {
    color: '#E5E7EB',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  podiumInfoXpBadge: {
    backgroundColor: '#3730A3',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  podiumInfoXpText: {
    color: '#DDD6FE',
    fontSize: 10,
    fontFamily: 'Inter_800ExtraBold',
  },

  // LEADERBOARD STYLES
  leaderboardSearchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    paddingTop: 12,
    marginTop: -320,
    backgroundColor: '#05050C',
    width: '100%',
  },
  leaderboardSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1320',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.25)',
  },
  leaderboardSearchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  leaderboardSearchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
    padding: 0,
  },
  leaderboardSearchClear: {
    padding: 4,
  },
  leaderboardSearchClearText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
  },
  leaderboardNoResult: {
    paddingVertical: 30,
    alignItems: 'center',
  },
  leaderboardNoResultText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    fontFamily: 'Inter_400Regular',
  },
  leaderboardContainer: {
    marginTop: 12,
    width: '100%',
    backgroundColor: '#080B13',
    borderRadius: 16,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  leaderboardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  leaderboardRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.03)',
  },
  leaderboardRank: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_700Bold',
    width: 24,
    textAlign: 'center',
  },
  leaderboardAvatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginHorizontal: 16,
  },
  leaderboardName: {
    flex: 1,
    color: '#E5E7EB',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
  leaderboardXp: {
    color: '#C084FC',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  
  // PROFILE STYLES
  profileHeader: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  profileStatBoxXp: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(192, 132, 252, 0.4)',
    borderRadius: 8,
    paddingHorizontal: 4,
    marginRight: 6,
    height: 32,
  },
  profileStatBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 6,
    marginRight: 6,
    height: 32,
  },
  profileStatIconLeft: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginLeft: -10,
    marginRight: 6,
    borderRadius: 6,
  },
  profileStatIconEnergy: {
    width: 24,
    height: 28,
    resizeMode: 'contain',
    marginRight: 6,
    marginLeft: 2,
  },
  profileStatIconCoin: {
    width: 28,
    height: 28,
    resizeMode: 'contain',
    marginRight: 6,
  },
  profileStatTextWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileStatValueTop: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    marginRight: 4,
  },
  profileStatValueBot: {
    color: '#E5E7EB',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    marginTop: 0,
  },
  profileStatValueMid: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  profileStatPlusBtn: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#3D250E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileStatPlusText: {
    color: '#F59E0B',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    marginTop: -2,
  },
  
  // PROFILE CARDS
  profileInfoCardContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1.5,
    borderColor: '#6b21a8',
    marginBottom: 16,
  },
  profileInfoCardBg: {
    flex: 1,
    padding: 10,
    paddingLeft: 12,
  },
  profileInfoCardBgImage: {
    opacity: 0.8,
  },
  profileInfoCardContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  profileAvatarContainer: {
    width: 95,
    height: 95,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  profileBigAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    zIndex: 1,
  },
  profileGoldFrame: {
    position: 'absolute',
    width: 105,
    height: 105,
    resizeMode: 'contain',
    zIndex: 2,
  },
  profileDetailsContainer: {
    flex: 1,
    alignItems: 'flex-start',
  },
  profileMainName: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  profileDetailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  profileDetailIcon: {
    fontSize: 10,
    marginRight: 4,
  },
  profileStarIconSm: {
    width: 12,
    height: 12,
    resizeMode: 'contain',
    marginRight: 4,
  },
  profileDetailText: {
    color: '#E5E7EB',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
  },
  profileDetailTextGold: {
    color: '#FCD34D',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },

  // PROFILE PROGRESS CARD
  profileProgressCard: {
    backgroundColor: '#0a0a0a',
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#b45309',
    padding: 10,
    marginBottom: 16,
  },
  profileProgressHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  profileStarIconMd: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 6,
  },
  profileProgressTitle: {
    color: '#FCD34D',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  profileProgressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  profileProgressBarTrack: {
    flex: 1,
    height: 8,
    backgroundColor: '#1f2937',
    borderRadius: 4,
    marginRight: 6,
    overflow: 'hidden',
  },
  profileProgressBarFill: {
    height: '100%',
    backgroundColor: '#F59E0B',
    borderRadius: 4,
  },
  profileProgressPercent: {
    color: '#E5E7EB',
    fontSize: 10,
    fontFamily: 'Inter_600SemiBold',
    width: 24,
  },
  profileProgressSubtitle: {
    color: '#D1D5DB',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 2,
  },
  profileProgressXpLeft: {
    color: '#D1D5DB',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginBottom: 10,
  },
  profileProgressXpHighlight: {
    color: '#FCD34D',
    fontFamily: 'Inter_700Bold',
  },
  profileBatafsilBtn: {
    width: '100%',
    height: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderWidth: 1,
    borderColor: '#F59E0B',
    borderRadius: 8,
  },
  profileBatafsilText: {
    color: '#FCD34D',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginRight: 2,
  },

  // STATISTIKA SECTION
  statSectionContainer: {
    marginTop: 10,
    marginBottom: 40,
  },
  statSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statSectionTitleIcon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
    marginRight: 8,
  },
  statSectionTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  statGridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridStatCard: {
    width: '23.5%',
    backgroundColor: '#0a0a14',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f1f38',
    paddingVertical: 8,
    paddingHorizontal: 2,
    alignItems: 'center',
    marginBottom: 8,
  },
  gridStatCardIcon: {
    width: 26,
    height: 26,
    resizeMode: 'contain',
    marginBottom: 6,
  },
  gridStatCardValue: {
    color: '#FFF',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  gridStatCardLabel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
  },

  // YUTUQLAR SECTION
  yutuqSectionContainer: {
    marginBottom: 40,
  },
  yutuqHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  yutuqHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yutuqCrownIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  yutuqSectionTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  yutuqPaginationDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yutuqDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#374151',
    marginHorizontal: 3,
  },
  yutuqDotActive: {
    backgroundColor: '#a855f7',
  },
  yutuqViewAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  yutuqViewAllText: {
    color: '#c084fc',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
    marginRight: 2,
  },
  yutuqCarouselContainer: {
    paddingRight: 20,
  },
  yutuqCard: {
    width: 100,
    height: 120,
    backgroundColor: '#0a0a14',
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#1f1f38',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
  },
  yutuqCardIcon: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 4,
  },
  yutuqCardLabel: {
    color: '#E5E7EB',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },

  // ACTIVITY & COLLECTION SECTION
  activityCollectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 100, // padding at the bottom of the scroll view
  },
  activityCard: {
    flex: 1.1,
    backgroundColor: '#0a0a14',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1f1f38',
    padding: 8,
    marginRight: 8,
  },
  collectionCard: {
    flex: 0.9,
    backgroundColor: '#0a0a14',
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: '#1f1f38',
    padding: 8,
  },
  activityHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  activityHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityHeaderIcon: {
    width: 14,
    height: 14,
    resizeMode: 'contain',
    marginRight: 4,
  },
  activityHeaderTitle: {
    color: '#FFF',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
  },
  activityHeaderLink: {
    color: '#c084fc',
    fontSize: 8,
    fontFamily: 'Inter_500Medium',
    marginLeft: 4,
  },
  activityList: {
    flex: 1,
    justifyContent: 'space-between',
  },
  activityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#1f1f38',
    paddingBottom: 8,
    // removed marginBottom: 8 to let space-between handle spacing
  },
  activityItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  activityItemIcon: {
    width: 22,
    height: 22,
    resizeMode: 'contain',
    marginRight: 6,
  },
  activityItemTitle: {
    color: '#E5E7EB',
    fontSize: 9,
    fontFamily: 'Inter_500Medium',
    marginBottom: 1,
  },
  activityItemSub: {
    color: '#9CA3AF',
    fontSize: 7,
    fontFamily: 'Inter_400Regular',
  },
  activityItemValueGreen: {
    color: '#4ade80', // neon green
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  collectionList: {
    flex: 1,
    marginBottom: 12,
  },
  collectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#05050C',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#1f1f38',
    paddingHorizontal: 8,
    paddingVertical: 6,
    marginBottom: 6,
  },
  collectionItemIcon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
    marginRight: 6,
  },
  collectionItemValue: {
    color: '#FFF',
    fontSize: 10,
    fontFamily: 'Inter_700Bold',
  },
  inventoryBtn: {
    backgroundColor: '#3b0764',
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  inventoryBtnText: {
    color: '#E5E7EB',
    fontSize: 9,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 0.5,
  },
});
