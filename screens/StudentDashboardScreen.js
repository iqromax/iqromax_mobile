import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Image, Animated, ImageBackground, ScrollView, Platform } from 'react-native';
import { Feather, MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';

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
  en: { title: "Math Master", subtitle: "Level 24", desc: "Great for learning math, conquer the world with this!", clothes: "CLOTHES", accessories: "ACCESSORIES", levelText: "LEVEL", toNextLevel: "To next level", startExercise: "START EXERCISE", stats: "STATISTICS", seeAll: "SEE ALL >", logic: "LOGIC", logicDesc: "Great!", speed: "SPEED", speedDesc: "Good", accuracy: "ACCURACY", accuracyDesc: "Excellent!", streak: "STREAK", streakDesc: "Days", navHome: "HOME", navExercise: "EXERCISE", navInventory: "INVENTORY", navRanking: "RANKING", navProfile: "PROFILE", missions: "MISSIONS", exerciseSubtitle: "Choose the exercise type that suits you and continue learning!", infoTitle: "About Simple Math", infoDesc: "The simple math exercise develops the skill of performing arithmetic operations quickly and correctly.", infoOpsLabel: "Operations:", infoOps: ["addition", "subtraction", "multiplication", "division"], infoExampleLabel: "Example:", examplesCountTitle: "NUMBER OF EXAMPLES", examplesCountSubtitle: "Choose from 7 to 25 examples", exampleWord: "examples", opsTitle: "OPERATIONS", opsSubtitle: "Choose the operation type", opsOddiy: "Simple", opsOddiyDesc: "Addition, subtraction, multiplication, division", opsF5: "Formula 5", opsF5Desc: "Formulas up to 5", opsF10: "Formula 10", opsF10Desc: "Formulas up to 10", opsAralash: "Mixed", opsAralashDesc: "All operations mixed" },
  ru: { title: "Мастер математики", subtitle: "Уровень 24", desc: "Отлично для изучения математики, завоюйте мир с этим!", clothes: "ОДЕЖДА", accessories: "АКСЕССУАРЫ", levelText: "УРОВЕНЬ", toNextLevel: "До след. уровня", startExercise: "НАЧАТЬ ТРЕНИРОВКУ", stats: "СТАТИСТИКА", seeAll: "ВСЕ >", logic: "ЛОГИКА", logicDesc: "Отлично!", speed: "СКОРОСТЬ", speedDesc: "Хорошо", accuracy: "ТОЧНОСТЬ", accuracyDesc: "Превосходно!", streak: "СЕРИЯ", streakDesc: "Дней", navHome: "ГЛАВНАЯ", navExercise: "ТРЕНИРОВКА", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИИ", exerciseSubtitle: "Выберите подходящий тип упражнений и продолжайте обучение!", infoTitle: "О простом счете", infoDesc: "Упражнение на простой счет развивает навык быстрого и правильного выполнения арифметических операций.", infoOpsLabel: "Операции:", infoOps: ["сложение", "вычитание", "умножение", "деление"], infoExampleLabel: "Пример:", examplesCountTitle: "КОЛИЧЕСТВО ПРИМЕРОВ", examplesCountSubtitle: "Выберите от 7 до 25 примеров", exampleWord: "примеров", opsTitle: "ОПЕРАЦИИ", opsSubtitle: "Выберите тип операций", opsOddiy: "Простые", opsOddiyDesc: "Сложение, вычитание, умножение, деление", opsF5: "Формула 5", opsF5Desc: "Формулы до 5", opsF10: "Формула 10", opsF10Desc: "Формулы до 10", opsAralash: "Вперемешку", opsAralashDesc: "Все операции вперемешку" },
  uz: { title: "Matematika Ustasi", subtitle: "24-daraja", desc: "Matematika o'rganishda zo'r, bu bilan dunyoni egallang!", clothes: "KIYIMLAR", accessories: "AKSESSUARLAR", levelText: "LEVEL", toNextLevel: "Keyingi levelgacha yana", startExercise: "MASHQNI BOSHLASH", stats: "STATISTIKALAR", seeAll: "BARCHASI >", logic: "MANTIQ", logicDesc: "Zor!", speed: "TEZLIK", speedDesc: "Yaxshi", accuracy: "ANIQLIK", accuracyDesc: "A'lo!", streak: "SERIYA", streakDesc: "Kun", navHome: "BOSH SAHIFA", navExercise: "MASHQ", navInventory: "INVENTAR", navRanking: "REYTING", navProfile: "PROFIL", missions: "MISSIYALAR", exerciseSubtitle: "O'zingizga mos mashq turini tanlang va o'rganishni davom eting!", infoTitle: "Oddiy hisob haqida", infoDesc: "Oddiy hisob mashqi arifmetik amallarni tez va to'g'ri bajarish ko'nikmasini rivojlantiradi.", infoOpsLabel: "Amallar:", infoOps: ["qo'shish", "ayirish", "ko'paytirish", "bo'lish"], infoExampleLabel: "Misol:", examplesCountTitle: "MISOLLAR SONI", examplesCountSubtitle: "7 dan 25 gacha misol tanlang", exampleWord: "misol", opsTitle: "AMALLAR", opsSubtitle: "Amallar turini tanlang", opsOddiy: "Oddiy", opsOddiyDesc: "Qo'shish, ayirish, ko'paytirish, bo'lish", opsF5: "Formula 5", opsF5Desc: "5 gacha bo'lgan formulalar", opsF10: "Formula 10", opsF10Desc: "10 gacha bo'lgan formulalar", opsAralash: "Aralash", opsAralashDesc: "Barcha amallar aralash holda" },
  ar: { title: "سيد الرياضيات", subtitle: "مستوى 24", desc: "رائع لتعلم الرياضيات، اغز العالم بهذا!", clothes: "ملابس", accessories: "إكسسوارات", levelText: "مستوى", toNextLevel: "للمستوى التالي", startExercise: "ابدأ التمرين", stats: "الإحصائيات", seeAll: "عرض الكل >", logic: "المنطق", logicDesc: "رائع!", speed: "السرعة", speedDesc: "جيد", accuracy: "الدقة", accuracyDesc: "ممتاز!", streak: "سلسلة", streakDesc: "أيام", navHome: "الرئيسية", navExercise: "تمرين", navInventory: "مخزون", navRanking: "تصنيف", navProfile: "ملف شخصي", missions: "المهام", exerciseSubtitle: "اختر نوع التمرين الذي يناسبك واستمر في التعلم!", infoTitle: "حول الحساب البسيط", infoDesc: "تمرين الحساب البسيط يطور مهارة إجراء العمليات الحسابية بسرعة وبشكل صحيح.", infoOpsLabel: "العمليات:", infoOps: ["جمع", "طرح", "ضرب", "قسمة"], infoExampleLabel: "مثال:", examplesCountTitle: "عدد الأمثلة", examplesCountSubtitle: "اختر من 7 إلى 25 مثالًا", exampleWord: "أمثلة", opsTitle: "العمليات", opsSubtitle: "اختر نوع العملية", opsOddiy: "بسيط", opsOddiyDesc: "جمع، طرح، ضرب، قسمة", opsF5: "صيغة 5", opsF5Desc: "صيغ حتى 5", opsF10: "صيغة 10", opsF10Desc: "صيغ حتى 10", opsAralash: "مختلط", opsAralashDesc: "جميع العمليات مختلطة" },
  tr: { title: "Matematik Ustası", subtitle: "Seviye 24", desc: "Matematik öğrenmek için harika, bununla dünyayı fethet!", clothes: "GİYSİLER", accessories: "AKSESUARLAR", levelText: "SEVİYE", toNextLevel: "Sonraki seviyeye", startExercise: "EGZERSİZE BAŞLA", stats: "İSTATİSTİKLER", seeAll: "TÜMÜ >", logic: "MANTIK", logicDesc: "Harika!", speed: "HIZ", speedDesc: "İyi", accuracy: "DOĞRULUK", accuracyDesc: "Mükemmel!", streak: "SERİ", streakDesc: "Gün", navHome: "ANA SAYFA", navExercise: "EGZERSİZ", navInventory: "ENVANTER", navRanking: "SIRALAMA", navProfile: "PROFİL", missions: "GÖREVLER", exerciseSubtitle: "Size uygun egzersiz türünü seçin ve öğrenmeye devam edin!", infoTitle: "Basit Matematik Hakkında", infoDesc: "Basit matematik egzersizi aritmetik işlemleri hızlı ve doğru bir şekilde yapma becerisini geliştirir.", infoOpsLabel: "İşlemler:", infoOps: ["toplama", "çıkarma", "çarpma", "bölme"], infoExampleLabel: "Örnek:", examplesCountTitle: "ÖRNEK SAYISI", examplesCountSubtitle: "7 ile 25 arası örnek seçin", exampleWord: "örnek", opsTitle: "İŞLEMLER", opsSubtitle: "İşlem türünü seçin", opsOddiy: "Basit", opsOddiyDesc: "Toplama, çıkarma, çarpma, bölme", opsF5: "Formül 5", opsF5Desc: "5'e kadar formüller", opsF10: "Formül 10", opsF10Desc: "10'a kadar formüller", opsAralash: "Karışık", opsAralashDesc: "Tüm işlemler karışık" },
  zh: { title: "数学大师", subtitle: "24级", desc: "非常适合学习数学，用它征服世界！", clothes: "服装", accessories: "配饰", levelText: "等级", toNextLevel: "距离下一级还有", startExercise: "开始练习", stats: "统计数据", seeAll: "全部 >", logic: "逻辑", logicDesc: "太棒了！", speed: "速度", speedDesc: "很好", accuracy: "准确度", accuracyDesc: "极好！", streak: "连胜", streakDesc: "天", navHome: "首页", navExercise: "练习", navInventory: "库存", navRanking: "排名", navProfile: "个人资料", missions: "任务", exerciseSubtitle: "选择适合您的练习类型并继续学习！", infoTitle: "关于简单算术", infoDesc: "简单算术练习培养快速正确执行算术运算的技能。", infoOpsLabel: "运算:", infoOps: ["加法", "减法", "乘法", "除法"], infoExampleLabel: "例子:", examplesCountTitle: "例子数量", examplesCountSubtitle: "选择7到25个例子", exampleWord: "个例子", opsTitle: "运算", opsSubtitle: "选择运算类型", opsOddiy: "简单", opsOddiyDesc: "加、减、乘、除", opsF5: "公式5", opsF5Desc: "最高为5的公式", opsF10: "公式10", opsF10Desc: "最高为10的公式", opsAralash: "混合", opsAralashDesc: "所有运算混合" },
  ky: { title: "Математика чебери", subtitle: "24-деңгээл", desc: "Математика үйрөнүү үчүн сонун, муну менен дүйнөнү багындыр!", clothes: "КИЙИМДЕР", accessories: "АКСЕССУАРЛАР", levelText: "ДЕҢГЭЭЛ", toNextLevel: "Кийинки деңгээлге чейин", startExercise: "КӨНҮГҮҮНҮ БАШТОО", stats: "СТАТИСТИКА", seeAll: "БАРДЫГЫ >", logic: "ЛОГИКА", logicDesc: "Жакшы!", speed: "ЫЛДАМДЫК", speedDesc: "Жакшы", accuracy: "ТАКТЫК", accuracyDesc: "Эң жакшы!", streak: "СЕРИЯ", streakDesc: "Күн", navHome: "БАШКЫ БЕТ", navExercise: "КӨНҮГҮҮ", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИЯЛАР", exerciseSubtitle: "Сизге туура келген көнүгүү түрүн тандап, үйрөнүүнү улантыңыз!", infoTitle: "Жөнөкөй эсеп жөнүндө", infoDesc: "Жөнөкөй эсеп көнүгүүсү арифметикалык амалдарды тез жана туура аткаруу көндүмүн өнүктүрөт.", infoOpsLabel: "Амалдар:", infoOps: ["кошуу", "кемитүү", "көбөйтүү", "бөлүү"], infoExampleLabel: "Мисал:", examplesCountTitle: "МИСАЛДАР САНЫ", examplesCountSubtitle: "7ден 25ке чейин мисал тандаңыз", exampleWord: "мисал", opsTitle: "АМАЛДАР", opsSubtitle: "Амалдын түрүн тандаңыз", opsOddiy: "Жөнөкөй", opsOddiyDesc: "Кошуу, кемитүү, көбөйтүү, бөлүү", opsF5: "Формула 5", opsF5Desc: "5ке чейинки формулалар", opsF10: "Формула 10", opsF10Desc: "10го чейинки формулалар", opsAralash: "Аралаш", opsAralashDesc: "Бардык амалдар аралаш" },
  kk: { title: "Математика шебері", subtitle: "24-деңгей", desc: "Математика үйрену үшін керемет, осымен әлемді бағындыр!", clothes: "КИІМДЕР", accessories: "АКСЕССУАРЛАР", levelText: "ДЕҢГЕЙ", toNextLevel: "Келесі деңгейге дейін", startExercise: "ЖАТТЫҒУДЫ БАСТАУ", stats: "СТАТИСТИКА", seeAll: "БАРЛЫҒЫ >", logic: "ЛОГИКА", logicDesc: "Керемет!", speed: "ЖЫЛДАМДЫҚ", speedDesc: "Жақсы", accuracy: "ДӘЛДІК", accuracyDesc: "Өте жақсы!", streak: "СЕРИЯ", streakDesc: "Күн", navHome: "БАСҚЫ БЕТ", navExercise: "ЖАТТЫҒУ", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИЯЛАР", exerciseSubtitle: "Өзіңізге сәйкес келетін жаттығу түрін тандап, оқуды жалғастырыңыз!", infoTitle: "Қарапайым есеп туралы", infoDesc: "Қарапайым есеп жаттығуы арифметикалық амалдарды жылдам әрі дұрыс орындау дағдысын дамытады.", infoOpsLabel: "Амалдар:", infoOps: ["қосу", "азайту", "көбейту", "бөлу"], infoExampleLabel: "Мысал:", examplesCountTitle: "МЫСАЛДАР САНЫ", examplesCountSubtitle: "7-ден 25-ке дейін мысал таңдаңыз", exampleWord: "мысал", opsTitle: "АМАЛДАР", opsSubtitle: "Амал түрін таңдаңыз", opsOddiy: "Қарапайым", opsOddiyDesc: "Қосу, азайту, көбейту, бөлу", opsF5: "Формула 5", opsF5Desc: "5-ке дейінгі формулалар", opsF10: "Формула 10", opsF10Desc: "10-ға дейінгі формулалар", opsAralash: "Аралас", opsAralashDesc: "Барлық амалдар аралас" },
  tg: { title: "Устоди математика", subtitle: "Сатҳи 24", desc: "Барои омӯзиши математика олӣ аст, бо ин ҷаҳонро фатҳ кунед!", clothes: "ЛИБОСҲО", accessories: "ЛАВОЗИМОТ", levelText: "САТҲ", toNextLevel: "То сатҳи навбатӣ", startExercise: "ОҒОЗИ МАШҚ", stats: "СТАТИСТИКА", seeAll: "ҲАМА >", logic: "МАНТИҚ", logicDesc: "Олӣ!", speed: "СУРЪАТ", speedDesc: "Хуб", accuracy: "ДАҚИҚӢ", accuracyDesc: "Аъло!", streak: "СЕРИЯ", streakDesc: "Рӯз", navHome: "АСОСӢ", navExercise: "МАШҚ", navInventory: "ИНВЕНТАР", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛ", missions: "МИССИЯҲО", exerciseSubtitle: "Навъи машқи ба шумо мувофиқро интихоб кунед ва омӯзишро давом диҳед!", infoTitle: "Дар бораи ҳисоби оддӣ", infoDesc: "Машқи ҳисоби оддӣ маҳорати зуд ва дуруст иҷро кардани амалҳои арифметикиро инкишоф медиҳад.", infoOpsLabel: "Амалҳо:", infoOps: ["ҷамъ", "тарҳ", "зарб", "тақсим"], infoExampleLabel: "Мисол:", examplesCountTitle: "МИҚДОРИ МИСОЛҲО", examplesCountSubtitle: "Аз 7 то 25 мисол интихоб кунед", exampleWord: "мисол", opsTitle: "АМАЛҲО", opsSubtitle: "Намуди амалро интихоб кунед", opsOddiy: "Оддӣ", opsOddiyDesc: "Ҷамъ, тарҳ, зарб, тақсим", opsF5: "Формулаи 5", opsF5Desc: "Формулаҳо то 5", opsF10: "Формулаи 10", opsF10Desc: "Формулаҳо то 10", opsAralash: "Омехта", opsAralashDesc: "Ҳамаи амалҳо омехта" },
  ja: { title: "数学マスター", subtitle: "レベル 24", desc: "数学の学習に最適です。これで世界を征服しましょう！", clothes: "服", accessories: "アクセサリー", levelText: "レベル", toNextLevel: "次のレベルまで", startExercise: "練習を始める", stats: "統計", seeAll: "すべて >", logic: "論理", logicDesc: "素晴らしい！", speed: "スピード", speedDesc: "良い", accuracy: "正確さ", accuracyDesc: "優秀！", streak: "連続", streakDesc: "日", navHome: "ホーム", navExercise: "練習", navInventory: "在庫", navRanking: "ランキング", navProfile: "プロフィール", missions: "ミッション", exerciseSubtitle: "自分に合ったエクササイズタイプを選んで、学習を続けましょう！", infoTitle: "簡単な計算について", infoDesc: "簡単な計算の練習は、算術演算を素早く正確に実行するスキルを養います。", infoOpsLabel: "演算:", infoOps: ["加算", "減算", "乗算", "除算"], infoExampleLabel: "例:", examplesCountTitle: "例の数", examplesCountSubtitle: "7から25の例を選択してください", exampleWord: "例", opsTitle: "操作", opsSubtitle: "操作タイプを選択してください", opsOddiy: "シンプル", opsOddiyDesc: "加算、減算、乗算、除算", opsF5: "式5", opsF5Desc: "5までの式", opsF10: "式10", opsF10Desc: "10までの式", opsAralash: "混合", opsAralashDesc: "すべての操作が混在" },
  ko: { title: "수학 마스터", subtitle: "레벨 24", desc: "수학 학습에 좋습니다. 이것으로 세상을 정복하세요!", clothes: "옷", accessories: "액세서리", levelText: "레벨", toNextLevel: "다음 레벨까지", startExercise: "연습 시작", stats: "통계", seeAll: "모두 보기 >", logic: "논리", logicDesc: "훌륭해요!", speed: "속도", speedDesc: "좋음", accuracy: "정확도", accuracyDesc: "매우 우수함!", streak: "연속", streakDesc: "일", navHome: "홈", navExercise: "운동", navInventory: "인벤토리", navRanking: "순위", navProfile: "프로필", missions: "임무", exerciseSubtitle: "자신에게 맞는 운동 유형을 선택하고 계속 학습하세요!", infoTitle: "간단한 계산에 대하여", infoDesc: "간단한 계산 연습은 산술 연산을 빠르고 정확하게 수행하는 능력을 기릅니다.", infoOpsLabel: "연산:", infoOps: ["덧셈", "뺄셈", "곱셈", "나눗셈"], infoExampleLabel: "예:", examplesCountTitle: "예제 수", examplesCountSubtitle: "7에서 25개의 예제를 선택하세요", exampleWord: "예제", opsTitle: "연산", opsSubtitle: "연산 유형을 선택하세요", opsOddiy: "단순", opsOddiyDesc: "덧셈, 뺄셈, 곱셈, 나눗셈", opsF5: "공식 5", opsF5Desc: "5까지의 공식", opsF10: "공식 10", opsF10Desc: "10까지의 공식", opsAralash: "혼합", opsAralashDesc: "모든 연산 혼합" },
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

export default function StudentDashboardScreen({ navigation, route }) {
  const { language = 'uz' } = route.params || {};
  const t = DASHBOARD_TRANSLATIONS[language] || DASHBOARD_TRANSLATIONS['en'];
  const ext = EXERCISE_TYPES_TRANSLATIONS[language] || EXERCISE_TYPES_TRANSLATIONS['en'];
  const coinText = COIN_TRANSLATIONS[language] || COIN_TRANSLATIONS['en'];
  const [activeTab, setActiveTab] = useState('home');
  const [isExamplesPickerOpen, setIsExamplesPickerOpen] = useState(false);
  const [selectedExamples, setSelectedExamples] = useState(15);
  const [selectedOperation, setSelectedOperation] = useState('oddiy');
  const exampleNumbers = Array.from({ length: 19 }, (_, i) => i + 7);

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
          <View style={styles.statCard}>
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
          <View style={styles.startButton} pointerEvents="box-none">
            <ImageBackground source={require('../assets/start_btn_new.png')} style={styles.startButtonBg} resizeMode="stretch">
              <TouchableOpacity activeOpacity={0.7} style={styles.startButtonTouchable}>
                <Text style={styles.startButtonText}>{t.startExercise}</Text>
              </TouchableOpacity>
            </ImageBackground>
          </View>
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
        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, backgroundColor: '#05050C', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 15 }}>
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
          <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.8}>
            <ImageBackground source={require('../assets/card_calc.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={styles.exerciseCardContent}>
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
          </TouchableOpacity>

          {/* Card 2 */}
          <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.8}>
            <ImageBackground source={require('../assets/card_abacus.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={styles.exerciseCardContent}>
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
          </TouchableOpacity>

          {/* Card 3 */}
          <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.8}>
            <ImageBackground source={require('../assets/card_speed.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={styles.exerciseCardContent}>
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
          </TouchableOpacity>

          {/* Card 4 */}
          <TouchableOpacity style={styles.exerciseCard} activeOpacity={0.8}>
            <ImageBackground source={require('../assets/card_battle.jpg')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} resizeMode="cover">
              <View style={styles.exerciseCardContent}>
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
          </TouchableOpacity>
        </View>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 280, paddingBottom: 120, paddingHorizontal: 20 }}>
        {/* INFO CARD SECTION */}
        <View style={styles.infoCardContainer}>
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

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.opsScroll} contentContainerStyle={styles.opsScrollContent}>
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

          </ScrollView>
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
    justifyContent: 'flex-end',
    paddingRight: 10,
    paddingLeft: 20,
    paddingTop: 45, 
  },
  rightPanel: {
    width: 135, // Set fixed width so card and buttons align perfectly
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
    marginTop: 0,
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
  
  // EXAMPLES SELECTOR
  examplesContainer: {
    marginTop: 0,
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
    marginTop: 10,
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
  opsScroll: {
    // ScrollView styles
  },
  opsScrollContent: {
    paddingRight: 16,
    gap: 12,
  },
  opsCard: {
    width: 140,
    height: 140,
    backgroundColor: '#0f1020',
    borderRadius: 12,
    padding: 12,
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
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#A855F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  opsCardIconWrapper: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  opsFormulaIcon: {
    fontSize: 24,
    color: '#9CA3AF',
    fontStyle: 'italic',
    fontFamily: 'serif',
  },
  opsFormulaIconSelected: {
    color: '#fff',
  },
  opsCardTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  opsCardTitleSelected: {
    color: '#fff',
  },
  opsCardDesc: {
    color: '#9CA3AF',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
});
