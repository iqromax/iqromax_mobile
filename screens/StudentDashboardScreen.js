import React, { useState, useEffect, useRef, Suspense, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, Animated, ScrollView, Platform, UIManager, LayoutAnimation, TextInput, Alert, Modal, Easing, KeyboardAvoidingView, ActivityIndicator, Share, DeviceEventEmitter } from 'react-native';
import * as Clipboard from 'expo-clipboard';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Image, ImageBackground } from 'expo-image';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as THREE from 'three';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}
import { Feather, MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { Canvas, useFrame } from '@react-three/fiber/native';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei/native';
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

if (GLTFLoader && GLTFLoader.prototype) {
  GLTFLoader.prototype.setMeshoptDecoder(MeshoptDecoder);
}
if (useGLTF.setMeshoptDecoder) {
  useGLTF.setMeshoptDecoder(MeshoptDecoder);
}
import io from 'socket.io-client';
import { SOCKET_URL, API_URL, getShopImageUrl } from '../src/config/api';
import { LinearGradient } from 'expo-linear-gradient';
import { calculateUserRank } from '../src/utils/rankUtils';
import { useEnergy } from '../src/hooks/useEnergy';
import { MYSTERY_TRANSLATIONS } from './MysteryBoxScreen';

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

const ENERGY_TRANSLATIONS = {
  en: 'Energy',
  ru: 'Энергия',
  uz: 'Energiya',
  ar: 'طاقة',
  tr: 'Enerji',
  zh: '能量',
  ky: 'Энергия',
  kk: 'Энергия',
  tg: 'Энергия',
  ja: 'エネルギー',
  ko: '에너지',
};

const TOP_PLAYERS_TRANSLATIONS = {
  en: 'of players',
  ru: 'игроков',
  uz: "o'yinchilar orasida",
  ar: 'من اللاعبين',
  tr: 'oyuncular arasında',
  zh: '的玩家',
  ky: 'оюнчулардын арасында',
  kk: 'ойыншылар арасында',
  tg: 'аз бозигарон',
  ja: 'のプレイヤー',
  ko: '플레이어 중',
};

const MAX_RANK_TRANSLATIONS = {
  en: 'MAX Rank',
  ru: 'МАКС Ранг',
  uz: 'MAX Daraja',
  ar: 'أقصى رتبة',
  tr: 'MAX Derece',
  zh: '最高段位',
  ky: 'МАКС Даража',
  kk: 'МАКС Деңгей',
  tg: 'МАКС Сатҳ',
  ja: 'MAX ランク',
  ko: 'MAX 랭크',
};

const RANK_TO_TRANSLATIONS = {
  en: (rank) => `to ${rank}`,
  ru: (rank) => `до ${rank}`,
  uz: (rank) => `${rank} gacha`,
  ar: (rank) => `إلى ${rank}`,
  tr: (rank) => `${rank}'e kadar`,
  zh: (rank) => `到 ${rank}`,
  ky: (rank) => `${rank} чейин`,
  kk: (rank) => `${rank} дейін`,
  tg: (rank) => `то ${rank}`,
  ja: (rank) => `${rank} まで`,
  ko: (rank) => `${rank} 까지`,
};

const BADGE_TRANSLATIONS = {
  en: { firstWin: 'First Win', days14: '14 Days', top10: 'Top 10', platinum: 'Platinum', master: 'Master' },
  ru: { firstWin: 'Первая победа', days14: '14 Дней', top10: 'Топ 10', platinum: 'Платина', master: 'Мастер' },
  uz: { firstWin: 'Birinchi G\'alaba', days14: '14 Kun', top10: 'Top 10', platinum: 'Platina', master: 'Master' },
  ar: { firstWin: 'أول فوز', days14: '14 يوم', top10: 'أفضل 10', platinum: 'بلاتينيوم', master: 'ماستر' },
  tr: { firstWin: 'İlk Galibiyet', days14: '14 Gün', top10: 'İlk 10', platinum: 'Platin', master: 'Usta' },
  zh: { firstWin: '首胜', days14: '14天', top10: '前10名', platinum: '铂金', master: '大师' },
  ky: { firstWin: 'Биринчи Жеңиш', days14: '14 Күн', top10: 'Топ 10', platinum: 'Платина', master: 'Мастер' },
  kk: { firstWin: 'Бірінші Жеңіс', days14: '14 Күн', top10: 'Топ 10', platinum: 'Платина', master: 'Шебер' },
  tg: { firstWin: 'Аввалин Ғалаба', days14: '14 Рӯз', top10: 'Топ 10', platinum: 'Платина', master: 'Устод' },
  ja: { firstWin: '初勝利', days14: '14日間', top10: 'トップ10', platinum: 'プラチナ', master: 'マスター' },
  ko: { firstWin: '첫 승리', days14: '14일', top10: '탑 10', platinum: '플래티넘', master: '마스터' },
};

const CHANGE_LANGUAGE_TEXT = {
  en: 'Change Language',
  ru: 'Изменить язык',
  uz: 'Tilni o\'zgartirish',
  ar: 'تغيير اللغة',
  tr: 'Dili Değiştir',
  zh: '更改语言',
  ky: 'Тилди өзгөртүү',
  kk: 'Тілді өзгерту',
  tg: 'Ивази забон',
  ja: '言語を変更',
  ko: '언어 변경',
};

const AVAILABLE_LANGUAGES = [
  { code: 'uz', name: "O'zbek", flag: '🇺🇿' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'tr', name: 'Türkçe', flag: '🇹🇷' },
  { code: 'zh', name: '中文', flag: '🇨🇳' },
  { code: 'ky', name: 'Кыргызча', flag: '🇰🇬' },
  { code: 'kk', name: 'Қазақша', flag: '🇰🇿' },
  { code: 'tg', name: 'Тоҷикӣ', flag: '🇹🇯' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'ko', name: '한국어', flag: '🇰🇷' },
];

export const DASHBOARD_TRANSLATIONS = {
  en: { title: "Math Master", subtitle: "Level 24", desc: "Great for learning math, conquer the world with this!", clothes: "CLOTHES", accessories: "ACCESSORIES", levelText: "LEVEL", toNextLevel: "To next level", startExercise: "START EXERCISE", stats: "STATISTICS", seeAll: "SEE ALL >", logic: "LOGIC", logicDesc: "Great!", speed: "SPEED", speedDesc: "Good", accuracy: "ACCURACY", accuracyDesc: "Excellent!", streak: "STREAK", streakDesc: "Days", navHome: "HOME", navExercise: "EXERCISE", navInventory: "INVENTORY", navRanking: "RANKING", navProfile: "PROFILE", missions: "MISSIONS", exerciseSubtitle: "Choose the exercise type that suits you and continue learning!", infoTitle: "About Simple Math", infoDesc: "The simple math exercise develops the skill of performing arithmetic operations quickly and correctly.", infoOpsLabel: "Operations:", infoOps: ["addition", "subtraction", "multiplication", "division"], infoExampleLabel: "Example:", examplesCountTitle: "NUMBER OF EXAMPLES", examplesCountSubtitle: "Choose from 7 to 25 examples", exampleWord: "examples", opsTitle: "OPERATIONS", opsSubtitle: "Choose the operation type", opsOddiy: "Simple", opsOddiyDesc: "Addition, subtraction, multiplication, division", opsF5: "Formula 5", opsF5Desc: "Formulas up to 5", opsF10: "Formula 10", opsF10Desc: "Formulas up to 10", opsAralash: "Mixed", opsAralashDesc: "All operations mixed", speedSelectTitle: "SPEED", speedSelectSubtitle: "Choose exercise speed", secondWord: "seconds", characters: "CHARACTERS", all: "ALL", abacusInfoTitle: "ABOUT ABACUS", abacusInfoDesc: "1 upper bead means 5, 4 lower beads mean 1 each.", abacusLearnRules: "Learn rules", abacusDifficulty: "DIFFICULTY LEVEL", abacusBeginner: "Beginner", abacusIntermediate: "Intermediate", abacusAdvanced: "Advanced", abacusOpsTitle: "OPERATIONS", abacusAddSub: "Addition & Subtraction", abacusMult: "Multiplication", abacusDiv: "Division", speedInfoTitle: "ABOUT SPEED MATH", speedInfoDesc: "Test your speed and accuracy by calculating against time!", speedListItem1: "Time-limited examples", speedListItem2: "Fast answer = more points", speedListItem3: "Accuracy is important!", speedExamplesTitle: "NUMBER OF EXAMPLES", speedExamplesSubtitle: "Choose 7 to 25 examples", speedTimeTitle: "TIME LIMIT", speedTimeSubtitle: "Choose from 0.5 to 2 seconds", speedOpsTitle: "OPERATIONS", speedOpsSubtitle: "Choose operation type", speedKopaytirish: "Multiplication", speedBolish: "Division", speedAralash: "Mixed", speedAllOps: "All operations", speedSecLabel: "seconds" , battleTabTitle: "BATTLE", battleYou: "YOU", battleOpponent: "Opponent", battleRating: "Rating", battleLevel: "Level" , bmOddiy: "Simple Battle", bmOddiyDesc: "Fast calculation with equals", bmReyting: "Rating Battle", bmReytingDesc: "With strong opponents for rating points", bmTurnir: "Tournament Battle", bmTurnirDesc: "Participate in tournaments and win prizes", bmDost: "Battle with Friend", bmDostDesc: "Invite your friend and compete" , bmDailyMission: "DAILY BATTLE MISSION", bmDailyMissionDesc: "Participate in 3 battles", bmDailyBonus: "DAILY BONUS" , bestResults: "BEST RESULTS", bestVictories: "Victories", bestStreak: "Winning streak", bestTime: "Fastest time" , quickOpponent: "QUICK OPPONENT", refresh: "Refresh" , startBattle: "START BATTLE", startBattleSubtext: "Choose an opponent and achieve victory!" , rankingTitle: "RANKING", rankingSubtitle: "The strongest mathematicians", platinumTarget: "to Platinum V", xpRemaining: "XP remaining", searchPlaceholder: "Search user...", statRating: "Rating", statSpeed: "Speed", statAccuracy: "Accuracy", statStreak: "Streak", statExercises: "Exercises", statAchievements: "Achievements", statXP: "XP", statCoin: "Coin", achievementsTitle: "ACHIEVEMENTS", achv14Days: "14 day streak", achvTop10: "Top 10", achvGold3: "Gold III", achvGeneric: "Achievement", activityTitle: "ACTIVITY HISTORY", activitySeeAll: "See all >", actSimple: "Simple math", actBattle: "Battle", actFast: "Fast math", actAbacus: "Abacus", actToday: "Today", actYesterday: "Yesterday", actWin: "Victory", collectionTitle: "My collection", collAvatars: "Avatars", collFrames: "Frames", collBgs: "Backgrounds", collChars: "Characters", collBtn: "GO TO INVENTORY >" , invCharacter: "CHARACTER", invAvatar: "AVATAR", invFrame: "FRAME", invBg: "BG", invUnlocked: "Unlocked:", invSkins: "SKINS", invTopWear: "TOP WEAR", invPants: "PANTS", invShoes: "SHOES", invAccessories: "ACCESSORIES", invBackpacks: "BACKPACKS", invActiveChar: "ACTIVE CHARACTER", digitsTitle: "DIGITS", digitsSubtitle: "Select the number of digits to participate", digitsLabel: "digits", logout: "Logout", alertEnergyTitle: "Attention!", alertEnergyText: "You do not have enough energy. 1 energy will regenerate in ", alertEnergyBtn: "Close", authModalTitle: "Complete Authorization", authModalDesc: "Fill in your details to unlock all app features and functions.", authPhonePlaceholder: "Your phone number", authEmailPlaceholder: "Your email", authPasswordPlaceholder: "Your password", authConfirmPasswordPlaceholder: "Confirm password", authCloseBtn: "Close", authSaveBtn: "Save", otpTitle: "Verify Email", otpSub1: "We sent a 4-digit code to ", otpSub2: ".", otpVerifyBtn: "Verify", authSuccessTitle: "Success!", authSuccessMsg: "Account successfully authorized! All features unlocked.", authDupTitle: "Warning", authDupMsg: "This email or phone number is already registered. Please try another or log in.", authTryAgainBtn: "Try Again", authLoginBtn: "Login", shopTitle: "IQROSHOP STORE", shopSubtitle: "Spend your coins and get awesome items!", shopBtnLabel: "SHOP", shopInventory: "INVENTORY", shopEnergy: "ENERGY", shopMystery: "CHEST", shopTop: "Top Wear", shopPants: "Pants", shopShoes: "Shoes", shopAccessories: "Accessories", shopBackpacks: "Backpacks" },
  ru: { title: "Мастер математики", subtitle: "Уровень 24", desc: "Отлично для изучения математики, завоюйте мир с этим!", clothes: "ОДЕЖДА", accessories: "АКСЕССУАРЫ", levelText: "УРОВЕНЬ", toNextLevel: "До след. уровня", startExercise: "НАЧАТЬ ТРЕНИРОВКУ", stats: "СТАТИСТИКА", seeAll: "ВСЕ >", logic: "ЛОГИКА", logicDesc: "Отлично!", speed: "СКОРОСТЬ", speedDesc: "Хорошо", accuracy: "ТОЧНОСТЬ", accuracyDesc: "Превосходно!", streak: "СЕРИЯ", streakDesc: "Дней", navHome: "ГЛАВНАЯ", navExercise: "ТРЕНИРОВКА", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИИ", exerciseSubtitle: "Выберите подходящий тип упражнений и продолжайте обучение!", infoTitle: "О простом счете", infoDesc: "Упражнение на простой счет развивает навык быстрого и правильного выполнения арифметических операций.", infoOpsLabel: "Операции:", infoOps: ["сложение", "вычитание", "умножение", "деление"], infoExampleLabel: "Пример:", examplesCountTitle: "КОЛИЧЕСТВО ПРИМЕРОВ", examplesCountSubtitle: "Выберите от 7 до 25 примеров", exampleWord: "примеров", opsTitle: "ОПЕРАЦИИ", opsSubtitle: "Выберите тип операций", opsOddiy: "Простые", opsOddiyDesc: "Сложение, вычитание, умножение, деление", opsF5: "Формула 5", opsF5Desc: "Формулы до 5", opsF10: "Формула 10", opsF10Desc: "Формулы до 10", opsAralash: "Вперемешку", opsAralashDesc: "Все операции вперемешку", speedSelectTitle: "СКОРОСТЬ", speedSelectSubtitle: "Выберите скорость тренировки", secondWord: "секунд", characters: "ПЕРСОНАЖИ", all: "ВCЕ", abacusInfoTitle: "ОБ АБАКУСЕ", abacusInfoDesc: "1 верхняя косточка равна 5, 4 нижние — по 1.", abacusLearnRules: "Изучить правила", abacusDifficulty: "УРОВЕНЬ СЛОЖНОСТИ", abacusBeginner: "Новичок", abacusIntermediate: "Средний", abacusAdvanced: "Сложный", abacusOpsTitle: "ОПЕРАЦИИ", abacusAddSub: "Сложение и вычитание", abacusMult: "Умножение", abacusDiv: "Деление", speedInfoTitle: "О СКОРОСТНОМ СЧЕТЕ", speedInfoDesc: "Проверьте скорость и точность, решая примеры на время!", speedListItem1: "Примеры на время", speedListItem2: "Быстрый ответ = больше баллов", speedListItem3: "Точность важна!", speedExamplesTitle: "КОЛИЧЕСТВО ПРИМЕРОВ", speedExamplesSubtitle: "Выберите от 7 до 25 примеров", speedTimeTitle: "ЛИМИТ ВРЕМЕНИ", speedTimeSubtitle: "Выберите от 0.5 до 2 секунд", speedOpsTitle: "ОПЕРАЦИИ", speedOpsSubtitle: "Выберите тип операций", speedKopaytirish: "Умножение", speedBolish: "Деление", speedAralash: "Смешанно", speedAllOps: "Все операции", speedSecLabel: "секунд" , battleTabTitle: "БИТВА", battleYou: "ВЫ", battleOpponent: "Соперник", battleRating: "Рейтинг", battleLevel: "Уровень" , bmOddiy: "Простая Битва", bmOddiyDesc: "Быстрый счет с равными", bmReyting: "Рейтинговая Битва", bmReytingDesc: "С сильными противниками за очки", bmTurnir: "Турнирная Битва", bmTurnirDesc: "Участвуйте в турнирах и выигрывайте призы", bmDost: "Битва с Другом", bmDostDesc: "Пригласите друга и соревнуйтесь" , bmDailyMission: "ЕЖЕДНЕВНАЯ МИССИЯ", bmDailyMissionDesc: "Участвуйте в 3 битвах", bmDailyBonus: "ЕЖЕДНЕВНЫЙ БОНУС" , bestResults: "ЛУЧШИЕ РЕЗУЛЬТАТЫ", bestVictories: "Победы", bestStreak: "Серия побед", bestTime: "Лучшее время" , quickOpponent: "БЫСТРЫЙ ПРОТИВНИК", refresh: "Обновить" , startBattle: "НАЧАТЬ БИТВУ", startBattleSubtext: "Выберите противника и одержите победу!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Сильнейшие математики", platinumTarget: "до Platinum V", xpRemaining: "XP осталось", searchPlaceholder: "Поиск пользователя...", statRating: "Рейтинг", statSpeed: "Скорость", statAccuracy: "Точность", statStreak: "Серия", statExercises: "Упражнения", statAchievements: "Достижения", statXP: "Опыт", statCoin: "Монеты", achievementsTitle: "ДОСТИЖЕНИЯ", achv14Days: "14 дней подряд", achvTop10: "Топ 10", achvGold3: "Золото III", achvGeneric: "Достижение", activityTitle: "ИСТОРИЯ АКТИВНОСТИ", activitySeeAll: "Смотреть все >", actSimple: "Простой счет", actBattle: "Битва", actFast: "Быстрый счет", actAbacus: "Абакус", actToday: "Сегодня", actYesterday: "Вчера", actWin: "Победа", collectionTitle: "Моя коллекция", collAvatars: "Аватары", collFrames: "Рамки", collBgs: "Фоны", collChars: "Персонажи", collBtn: "ПЕРЕЙТИ В ИНВЕНТАРЬ >" , invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "РАМКА", invBg: "ФОН", invUnlocked: "Разблокировано:", invSkins: "СКИНЫ", invTopWear: "ВЕРХНЯЯ ОДЕЖДА", invPants: "ШТАНЫ", invShoes: "ОБУВЬ", invAccessories: "АКСЕССУАРЫ", invBackpacks: "РЮКЗАКИ", invActiveChar: "АКТИВНЫЙ ПЕРСОНАЖ", digitsTitle: "ЗНАЧНОСТЬ", digitsSubtitle: "Выберите количество знаков", digitsLabel: "-значный", logout: "Выйти", alertEnergyTitle: "Внимание!", alertEnergyText: "У вас недостаточно энергии. 1 энергия восстановится через ", alertEnergyBtn: "Закрыть", authModalTitle: "Пройдите авторизацию", authModalDesc: "Заполните свои данные, чтобы открыть все возможности и функции приложения.", authPhonePlaceholder: "Ваш номер телефона", authEmailPlaceholder: "Ваш email", authPasswordPlaceholder: "Ваш пароль", authConfirmPasswordPlaceholder: "Подтвердите пароль", authCloseBtn: "Закрыть", authSaveBtn: "Сохранить", otpTitle: "Подтвердите Email", otpSub1: "Мы отправили 4-значный код на ", otpSub2: ".", otpVerifyBtn: "Подтвердить", authSuccessTitle: "Успешно!", authSuccessMsg: "Ваш аккаунт успешно авторизован! Все функции разблокированы.", authDupTitle: "Предупреждение", authDupMsg: "Этот email или номер телефона уже зарегистрирован. Попробуйте другой или войдите.", authTryAgainBtn: "Попробовать снова", authLoginBtn: "Войти", shopTitle: "МАГАЗИН IQROSHOP", shopSubtitle: "Тратьте монеты и получайте крутые предметы!", shopBtnLabel: "МАГАЗИН", shopInventory: "ИНВЕНТАРЬ", shopEnergy: "ЭНЕРГИЯ", shopMystery: "СУНДУК", shopTop: "Верхняя одежда", shopPants: "Штаны", shopShoes: "Обувь", shopAccessories: "Аксессуары", shopBackpacks: "Рюкзаки" },
  uz: { title: "Matematika Ustasi", subtitle: "24-daraja", desc: "Matematika o'rganishda zo'r, bu bilan dunyoni egallang!", clothes: "KIYIMLAR", accessories: "AKSESSUARLAR", levelText: "LEVEL", toNextLevel: "Keyingi levelgacha yana", startExercise: "MASHQNI BOSHLASH", stats: "STATISTIKALAR", seeAll: "BARCHASI >", logic: "MANTIQ", logicDesc: "Zor!", speed: "TEZLIK", speedDesc: "Yaxshi", accuracy: "ANIQLIK", accuracyDesc: "A'lo!", streak: "SERIYA", streakDesc: "Kun", navHome: "BOSH SAHIFA", navExercise: "MASHQ", navInventory: "INVENTAR", navRanking: "REYTING", navProfile: "PROFIL", missions: "MISSIYALAR", exerciseSubtitle: "O'zingizga mos mashq turini tanlang va o'rganishni davom eting!", infoTitle: "Oddiy hisob haqida", infoDesc: "Oddiy hisob mashqi arifmetik amallarni tez va to'g'ri bajarish ko'nikmasini rivojlantiradi.", infoOpsLabel: "Amallar:", infoOps: ["qo'shish", "ayirish", "ko'paytirish", "bo'lish"], infoExampleLabel: "Misol:", examplesCountTitle: "HADLAR SONI", examplesCountSubtitle: "7 dan 25 hadgacha tanlang", exampleWord: "had", opsTitle: "AMALLAR", opsSubtitle: "Amallar turini tanlang", opsOddiy: "Oddiy", opsOddiyDesc: "Qo'shish, ayirish, ko'paytirish, bo'lish", opsF5: "Formula 5", opsF5Desc: "5 gacha bo'lgan formulalar", opsF10: "Formula 10", opsF10Desc: "10 gacha bo'lgan formulalar", opsAralash: "Aralash", opsAralashDesc: "Barcha amallar aralash holda", speedSelectTitle: "TEZLIK", speedSelectSubtitle: "Mashq bajarish tezligini tanlang", secondWord: "soniya", characters: "PERSONAJLAR", all: "BARCHA", abacusInfoTitle: "ABAKUS (SOROBAN) HAQIDA", abacusInfoDesc: "Yuqori qatordagi 1 ta boncuk – 5 qiymatni, pastki qatordagi 4 ta boncuk – 1 qiymatni bildiradi.", abacusLearnRules: "Qoidalarni o'rganish", abacusDifficulty: "QIYINCHILIK DARAJASI", abacusBeginner: "Boshlang'ich", abacusIntermediate: "O'rta", abacusAdvanced: "Murakkab", abacusOpsTitle: "AMALLAR", abacusAddSub: "Qo'shish va Ayirish", abacusMult: "Ko'paytirish", abacusDiv: "Bo'lish", speedInfoTitle: "TEZKOR HISOBLASH HAQIDA", speedInfoDesc: "Vaqt bilan hisoblash orqali tezlik va aniqligingizni sinab ko'ring!", speedListItem1: "Vaqt cheklovi bilan misollar", speedListItem2: "Tez javob – ko'proq ball", speedListItem3: "Aniqlik muhim!", speedExamplesTitle: "MISOLLAR SONI", speedExamplesSubtitle: "7 dan 25 gacha misol tanlang", speedTimeTitle: "VAQT CHEKLOVI", speedTimeSubtitle: "0.5 soniyadan 2 soniyagacha vaqt tanlang", speedOpsTitle: "AMALLAR", speedOpsSubtitle: "Amallar turini tanlang", speedKopaytirish: "Ko'paytirish", speedBolish: "Bo'lish", speedAralash: "Aralash", speedAllOps: "Barcha amallar", speedSecLabel: "soniya" , battleTabTitle: "BATTLE", battleYou: "SIZ", battleOpponent: "Raqib", battleRating: "Reyting", battleLevel: "Level" , bmOddiy: "Oddiy Battle", bmOddiyDesc: "Teng kuchdagilar bilan tezkor hisoblash", bmReyting: "Reyting Battle", bmReytingDesc: "Reyting ochkolari uchun kuchli raqiblar bilan", bmTurnir: "Turnir Battle", bmTurnirDesc: "Turnirlarda qatnashing va sovrin yuting", bmDost: "Do'st bilan Battle", bmDostDesc: "Do'stingizni taklif qiling va bellashing" , bmDailyMission: "KUNLIK BATTLE MISSIYASI", bmDailyMissionDesc: "3 ta battle'da ishtirok eting", bmDailyBonus: "KUNLIK BONUS" , bestResults: "ENG YAXSHI NATIJALAR", bestVictories: "G'alabalar", bestStreak: "G'alaba seriyasi", bestTime: "Eng tez vaqt" , quickOpponent: "TEZKOR RAQIB", refresh: "Yangilash" , startBattle: "BATTLE BOSHLASH", startBattleSubtext: "Raqib tanlang va g'alabaga erishing!" , rankingTitle: "REYTING", rankingSubtitle: "Eng kuchli matematiklar", platinumTarget: "Platinum V gacha", xpRemaining: "XP qoldi", searchPlaceholder: "Foydalanuvchi qidirish...", statRating: "Reyting", statSpeed: "Tezlik", statAccuracy: "Aniqlik", statStreak: "Streak", statExercises: "Mashq", statAchievements: "Yutuq", statXP: "XP", statCoin: "Coin", achievementsTitle: "YUTUQLAR", achv14Days: "14 kunlik seriya", achvTop10: "Top 10", achvGold3: "Gold III", achvGeneric: "Yutuq", activityTitle: "FAOLIYAT TARIXI", activitySeeAll: "Barchasini ko'rish >", actSimple: "Oddiy hisob", actBattle: "Battle", actFast: "Tezkor hisob", actAbacus: "Abakus", actToday: "Bugun", actYesterday: "Kecha", actWin: "G'alaba", collectionTitle: "Mening kolleksiyam", collAvatars: "Avatarlar", collFrames: "Ramkalar", collBgs: "Fonlar", collChars: "Personajlar", collBtn: "INVENTARGA O'TISH >" , invCharacter: "PERSONAJ", invAvatar: "AVATAR", invFrame: "RAMKA", invBg: "FON", invUnlocked: "Ochilgan:", invSkins: "SKINLAR", invTopWear: "USTKI KIYIM", invPants: "SHIM", invShoes: "OYOQ KIYIM", invAccessories: "AKSESSUARLAR", invBackpacks: "RYUKZAKLAR", invActiveChar: "AKTIV PERSONAJ", digitsTitle: "SON XONASI", digitsSubtitle: "Qatnashadigan sonlar xonasini tanlang", digitsLabel: "xonali", logout: "Tizimdan chiqish", alertEnergyTitle: "Diqqat!", alertEnergyText: "Sizda kerakli energiya mavjud emas. Bitta energiya to'lishiga ", alertEnergyBtn: "Yopish", authModalTitle: "Avtorizatsiyadan o'ting", authModalDesc: "Ilovadagi barcha imkoniyatlar va funksiyalardan to'liq foydalanish uchun ma'lumotlaringizni to'ldiring.", authPhonePlaceholder: "Telefon raqamingiz", authEmailPlaceholder: "Elektron pochtangiz", authPasswordPlaceholder: "Parolingiz", authConfirmPasswordPlaceholder: "Parolni tasdiqlang", authCloseBtn: "Yopish", authSaveBtn: "Saqlash", otpTitle: "Emailni tasdiqlang", otpSub1: "Biz 4 xonali tasdiqlash kodini ", otpSub2: " manziliga yubordik.", otpVerifyBtn: "Tasdiqlash", authSuccessTitle: "Muvaffaqiyatli!", authSuccessMsg: "Akkauntingiz muvaffaqiyatli avtorizatsiyadan o'tdi! Barcha imkoniyatlar ochildi.", authDupTitle: "Ogohlantirish", authDupMsg: "Bu email yoki telefon raqamidan oldin ro'yxatdan o'tilgan. Iltimos, boshqa ma'lumot kiriting yoki tizimga kiring.", authTryAgainBtn: "Boshqatdan urinib ko'rish", authLoginBtn: "Kirish", shopTitle: "IQROSHOP DO'KON", shopSubtitle: "Tangalaringizni sarflang va buyumlarga ega bo'ling!", shopBtnLabel: "DO'KON", shopInventory: "INVENTAR", shopEnergy: "ENERGIYA", shopMystery: "SANDIQ", shopTop: "Ustki kiyim", shopPants: "Shim", shopShoes: "Oyoq kiyim", shopAccessories: "Aksessuarlar", shopBackpacks: "Ryukzaklar" },
  ar: { title: "سيد الرياضيات", subtitle: "مستوى 24", desc: "رائع لتعلم الرياضيات، اغز العالم بهذا!", clothes: "ملابس", accessories: "إكسسوارات", levelText: "مستوى", toNextLevel: "للمستوى التالي", startExercise: "ابدأ التمرين", stats: "الإحصائيات", seeAll: "عرض الكل >", logic: "المنطق", logicDesc: "رائع!", speed: "السرعة", speedDesc: "جيد", accuracy: "الدقة", accuracyDesc: "ممتاز!", streak: "سلسلة", streakDesc: "أيام", navHome: "الرئيسية", navExercise: "تمرين", navInventory: "مخزون", navRanking: "تصنيف", navProfile: "ملف شخصي", missions: "المهام", exerciseSubtitle: "اختر نوع التمرين الذي يناسبك واستمر في التعلم!", infoTitle: "حول الحساب البسيط", infoDesc: "تمرين الحساب البسيط يطور مهارة إجراء العمليات الحسابية بسرعة وبشكل صحيح.", infoOpsLabel: "العمليات:", infoOps: ["جمع", "طرح", "ضرب", "قسمة"], infoExampleLabel: "مثال:", examplesCountTitle: "عدد الأمثلة", examplesCountSubtitle: "اختر من 7 إلى 25 مثالًا", exampleWord: "أمثلة", opsTitle: "العمليات", opsSubtitle: "اختر نوع العملية", opsOddiy: "بسيط", opsOddiyDesc: "جمع، طرح، ضرب، قسمة", opsF5: "صيغة 5", opsF5Desc: "صيغ حتى 5", opsF10: "صيغة 10", opsF10Desc: "صيغ حتى 10", opsAralash: "مختلط", opsAralashDesc: "جميع العمليات مختلطة", speedSelectTitle: "السرعة", speedSelectSubtitle: "اختر سرعة التمرين", secondWord: "ثواني", characters: "الشخصيات", all: "الكل", abacusInfoTitle: "حول المعداد", abacusInfoDesc: "حبة علوية واحدة تعني 5، 4 حبات سفلية تعني 1 لكل منها.", abacusLearnRules: "تعلم القواعد", abacusDifficulty: "مستوى الصعوبة", abacusBeginner: "مبتدئ", abacusIntermediate: "متوسط", abacusAdvanced: "متقدم", abacusOpsTitle: "العمليات", abacusAddSub: "الجمع والطرح", abacusMult: "الضرب", abacusDiv: "القسمة", speedInfoTitle: "حول الحساب السريع", speedInfoDesc: "اختبر سرعتك ودقتك عن طريق الحساب ضد الوقت!", speedListItem1: "أمثلة محدودة بوقت", speedListItem2: "إجابة سريعة = نقاط أكثر", speedListItem3: "الدقة مهمة!", speedExamplesTitle: "عدد الأمثلة", speedExamplesSubtitle: "اختر 7 إلى 25 مثالًا", speedTimeTitle: "الحد الزمني", speedTimeSubtitle: "اختر من 0.5 إلى 2 ثانية", speedOpsTitle: "العمليات", speedOpsSubtitle: "اختر نوع العملية", speedKopaytirish: "ضرب", speedBolish: "قسمة", speedAralash: "مختلط", speedAllOps: "جميع العمليات", speedSecLabel: "ثواني" , battleTabTitle: "معركة", battleYou: "أنت", battleOpponent: "الخصم", battleRating: "تقييم", battleLevel: "مستوى" , bmOddiy: "معركة بسيطة", bmOddiyDesc: "حساب سريع مع المتكافئين", bmReyting: "معركة التقييم", bmReytingDesc: "مع خصوم أقوياء للحصول على نقاط", bmTurnir: "معركة البطولة", bmTurnirDesc: "شارك في البطولات واربح جوائز", bmDost: "معركة مع صديق", bmDostDesc: "ادع صديقك وتنافس" , bmDailyMission: "المهمة اليومية", bmDailyMissionDesc: "شارك في 3 معارك", bmDailyBonus: "مكافأة يومية" , bestResults: "أفضل النتائج", bestVictories: "انتصارات", bestStreak: "سلسلة انتصارات", bestTime: "أسرع وقت" , quickOpponent: "الخصم السريع", refresh: "تحديث" , startBattle: "بدء المعركة", startBattleSubtext: "اختر خصمًا وحقق النصر!" , rankingTitle: "التصنيف", rankingSubtitle: "أقوى علماء الرياضيات", platinumTarget: "إلى Platinum V", xpRemaining: "XP متبقي", searchPlaceholder: "البحث عن مستخدم...", statRating: "التقييم", statSpeed: "السرعة", statAccuracy: "الدقة", statStreak: "سلسلة", statExercises: "التمارين", statAchievements: "الإنجازات", statXP: "نقاط الخبرة", statCoin: "عملات", achievementsTitle: "الإنجازات", achv14Days: "سلسلة 14 يومًا", achvTop10: "أفضل 10", achvGold3: "الذهب III", achvGeneric: "إنجاز", activityTitle: "سجل النشاط", activitySeeAll: "عرض الكل >", actSimple: "حساب بسيط", actBattle: "معركة", actFast: "حساب سريع", actAbacus: "معداد", actToday: "اليوم", actYesterday: "أمس", actWin: "انتصار", collectionTitle: "مجموعتي", collAvatars: "الصور الرمزية", collFrames: "الإطارات", collBgs: "الخلفيات", collChars: "الشخصيات", collBtn: "الذهاب إلى المخزون >" , invCharacter: "شخصية", invAvatar: "صورة رمزية", invFrame: "إطار", invBg: "خلفية", invUnlocked: "مفتوح:", invSkins: "جلود", invTopWear: "ملابس علوية", invPants: "سراويل", invShoes: "أحذية", invAccessories: "إكسسوارات", invBackpacks: "حقائب ظهر", invActiveChar: "شخصية نشطة", digitsTitle: "عدد الأرقام", digitsSubtitle: "حدد عدد الأرقام للمشاركة", digitsLabel: "أرقام", logout: "تسجيل خروج" },
  tr: { title: "Matematik Ustası", subtitle: "Seviye 24", desc: "Matematik öğrenmek için harika, bununla dünyayı fethet!", clothes: "GİYSİLER", accessories: "AKSESUARLAR", levelText: "SEVİYE", toNextLevel: "Sonraki seviyeye", startExercise: "EGZERSİZE BAŞLA", stats: "İSTATİSTİKLER", seeAll: "TÜMÜ >", logic: "MANTIK", logicDesc: "Harika!", speed: "HIZ", speedDesc: "İyi", accuracy: "DOĞRULUK", accuracyDesc: "Mükemmel!", streak: "SERİ", streakDesc: "Gün", navHome: "ANA SAYFA", navExercise: "EGZERSİZ", navInventory: "ENVANTER", navRanking: "SIRALAMA", navProfile: "PROFİL", missions: "GÖREVLER", exerciseSubtitle: "Size uygun egzersiz türünü seçin ve öğrenmeye devam edin!", infoTitle: "Basit Matematik Hakkında", infoDesc: "Basit matematik egzersizi aritmetik işlemleri hızlı ve doğru bir şekilde yapma becerisini geliştirir.", infoOpsLabel: "İşlemler:", infoOps: ["toplama", "çıkarma", "çarpma", "bölme"], infoExampleLabel: "Örnek:", examplesCountTitle: "ÖRNEK SAYISI", examplesCountSubtitle: "7 ile 25 arası örnek seçin", exampleWord: "örnek", opsTitle: "İŞLEMLER", opsSubtitle: "İşlem türünü seçin", opsOddiy: "Basit", opsOddiyDesc: "Toplama, çıkarma, çarpma, bölme", opsF5: "Formül 5", opsF5Desc: "5'e kadar formüller", opsF10: "Formül 10", opsF10Desc: "10'a kadar formüller", opsAralash: "Karışık", opsAralashDesc: "Tüm işlemler karışık", speedSelectTitle: "HIZ", speedSelectSubtitle: "Egzersiz hızını seçin", secondWord: "saniye", characters: "KARAKTERLER", all: "TÜMÜ", abacusInfoTitle: "ABAKÜS HAKKINDA", abacusInfoDesc: "Üst sıradaki 1 boncuk 5, alt sıradaki 4 boncuk her biri 1 değerindedir.", abacusLearnRules: "Kuralları öğren", abacusDifficulty: "ZORLUK SEVİYESİ", abacusBeginner: "Başlangıç", abacusIntermediate: "Orta", abacusAdvanced: "Zor", abacusOpsTitle: "İŞLEMLER", abacusAddSub: "Toplama ve Çıkarma", abacusMult: "Çarpma", abacusDiv: "Bölme", speedInfoTitle: "HIZLI HESAPLAMA HAKKINDA", speedInfoDesc: "Zamana karşı hesaplayarak hızınızı ve doğruluğunuzu test edin!", speedListItem1: "Zaman sınırlı örnekler", speedListItem2: "Hızlı cevap = daha fazla puan", speedListItem3: "Doğruluk önemlidir!", speedExamplesTitle: "ÖRNEK SAYISI", speedExamplesSubtitle: "7 ile 25 arası örnek seçin", speedTimeTitle: "ZAMAN SINIRI", speedTimeSubtitle: "0.5 ile 2 saniye arası seçin", speedOpsTitle: "İŞLEMLER", speedOpsSubtitle: "İşlem türünü seçin", speedKopaytirish: "Çarpma", speedBolish: "Bölme", speedAralash: "Karışık", speedAllOps: "Tüm işlemler", speedSecLabel: "saniye" , battleTabTitle: "SAVAŞ", battleYou: "SEN", battleOpponent: "Rakip", battleRating: "Derece", battleLevel: "Seviye" , bmOddiy: "Basit Savaş", bmOddiyDesc: "Eşit güçtekilerle hızlı hesaplama", bmReyting: "Derece Savaşı", bmReytingDesc: "Puanlar için güçlü rakiplerle", bmTurnir: "Turnuva Savaşı", bmTurnirDesc: "Turnuvalara katılın ve ödüller kazanın", bmDost: "Arkadaşla Savaş", bmDostDesc: "Arkadaşınızı davet edin ve yarışın" , bmDailyMission: "GÜNLÜK GÖREV", bmDailyMissionDesc: "3 savaşa katılın", bmDailyBonus: "GÜNLÜK BONUS" , bestResults: "EN İYİ SONUÇLAR", bestVictories: "Zaferler", bestStreak: "Galibiyet serisi", bestTime: "En hızlı zaman" , quickOpponent: "HIZLI RAKİP", refresh: "Yenile" , startBattle: "SAVAŞA BAŞLA", startBattleSubtext: "Bir rakip seçin ve zafere ulaşın!" , rankingTitle: "SIRALAMA", rankingSubtitle: "En güçlü matematikçiler", platinumTarget: "Platinum V'e kadar", xpRemaining: "XP kaldı", searchPlaceholder: "Kullanıcı ara...", statRating: "Derece", statSpeed: "Hız", statAccuracy: "Doğruluk", statStreak: "Seri", statExercises: "Egzersizler", statAchievements: "Başarılar", statXP: "XP", statCoin: "Jeton", achievementsTitle: "BAŞARILAR", achv14Days: "14 günlük seri", achvTop10: "İlk 10", achvGold3: "Altın III", achvGeneric: "Başarı", activityTitle: "ETKİNLİK GEÇMİŞİ", activitySeeAll: "Tümünü gör >", actSimple: "Basit hesap", actBattle: "Savaş", actFast: "Hızlı hesap", actAbacus: "Abaküs", actToday: "Bugün", actYesterday: "Dün", actWin: "Zafer", collectionTitle: "Koleksiyonum", collAvatars: "Avatarlar", collFrames: "Çerçeveler", collBgs: "Arka Planlar", collChars: "Karakterler", collBtn: "ENVANTERE GİT >" , invCharacter: "KARAKTER", invAvatar: "AVATAR", invFrame: "ÇERÇEVE", invBg: "ARKA PLAN", invUnlocked: "Açıldı:", invSkins: "GÖRÜNÜMLER", invTopWear: "ÜST GİYİM", invPants: "PANTOLON", invShoes: "AYAKKABI", invAccessories: "AKSESUARLAR", invBackpacks: "SIRT ÇANTALARI", invActiveChar: "AKTİF KARAKTER", digitsTitle: "BASAMAKLAR", digitsSubtitle: "Katılacak basamak sayısını seçin", digitsLabel: "basamaklı", logout: "Çıkış Yap" },
  zh: { title: "数学大师", subtitle: "24级", desc: "非常适合学习数学，用它征服世界！", clothes: "服装", accessories: "配饰", levelText: "等级", toNextLevel: "距离下一级还有", startExercise: "开始练习", stats: "统计数据", seeAll: "全部 >", logic: "逻辑", logicDesc: "太棒了！", speed: "速度", speedDesc: "很好", accuracy: "准确度", accuracyDesc: "极好！", streak: "连胜", streakDesc: "天", navHome: "首页", navExercise: "练习", navInventory: "库存", navRanking: "排名", navProfile: "个人资料", missions: "任务", exerciseSubtitle: "选择适合您的练习类型并继续学习！", infoTitle: "关于简单算术", infoDesc: "简单算术练习培养快速正确执行算术运算的技能。", infoOpsLabel: "运算:", infoOps: ["加法", "减法", "乘法", "除法"], infoExampleLabel: "例子:", examplesCountTitle: "例子数量", examplesCountSubtitle: "选择7到25个例子", exampleWord: "个例子", opsTitle: "运算", opsSubtitle: "选择运算类型", opsOddiy: "简单", opsOddiyDesc: "加、减、乘、除", opsF5: "公式5", opsF5Desc: "最高为5的公式", opsF10: "公式10", opsF10Desc: "最高为10的公式", opsAralash: "混合", opsAralashDesc: "所有运算混合", speedSelectTitle: "速度", speedSelectSubtitle: "选择练习速度", secondWord: "秒", characters: "角色", all: "全部", abacusInfoTitle: "关于算盘", abacusInfoDesc: "上面1颗珠子表示5，下面4颗珠子各表示1。", abacusLearnRules: "学习规则", abacusDifficulty: "难度级别", abacusBeginner: "初学者", abacusIntermediate: "中级", abacusAdvanced: "高级", abacusOpsTitle: "运算", abacusAddSub: "加法和减法", abacusMult: "乘法", abacusDiv: "除法", speedInfoTitle: "关于快速计算", speedInfoDesc: "通过计时计算测试您的速度和准确性！", speedListItem1: "限时例子", speedListItem2: "答得快=得分高", speedListItem3: "准确性很重要！", speedExamplesTitle: "例子数量", speedExamplesSubtitle: "选择7到25个例子", speedTimeTitle: "时间限制", speedTimeSubtitle: "选择0.5到2秒", speedOpsTitle: "运算", speedOpsSubtitle: "选择运算类型", speedKopaytirish: "乘法", speedBolish: "除法", speedAralash: "混合", speedAllOps: "所有运算", speedSecLabel: "秒" , battleTabTitle: "战斗", battleYou: "你", battleOpponent: "对手", battleRating: "评分", battleLevel: "等级" , bmOddiy: "简单战斗", bmOddiyDesc: "与实力相当者进行快速计算", bmReyting: "排名战斗", bmReytingDesc: "与强敌交手赚取积分", bmTurnir: "锦标赛战斗", bmTurnirDesc: "参加锦标赛赢取奖品", bmDost: "好友战斗", bmDostDesc: "邀请好友并竞争" , bmDailyMission: "每日任务", bmDailyMissionDesc: "参与3场战斗", bmDailyBonus: "每日奖励" , bestResults: "最佳结果", bestVictories: "胜利", bestStreak: "连胜", bestTime: "最快时间" , quickOpponent: "快速对手", refresh: "刷新" , startBattle: "开始战斗", startBattleSubtext: "选择对手并取得胜利！" , rankingTitle: "排名", rankingSubtitle: "最强的数学家", platinumTarget: "到 Platinum V", xpRemaining: "XP 剩余" , invCharacter: "角色", invAvatar: "头像", invFrame: "相框", invBg: "背景", invUnlocked: "已解锁:", invSkins: "皮肤", invTopWear: "上衣", invPants: "裤子", invShoes: "鞋子", invAccessories: "配饰", invBackpacks: "背包", invActiveChar: "当前角色", digitsTitle: "位数", digitsSubtitle: "选择参与的位数", digitsLabel: "位数", logout: "登出" },
  ky: { title: "Математика чебери", subtitle: "24-деңгээл", desc: "Математика үйрөнүү үчүн сонун, муну менен дүйнөнү багындыр!", clothes: "КИЙИМДЕР", accessories: "АКСЕССУАРЛАР", levelText: "ДЕҢГЭЭЛ", toNextLevel: "Кийинки деңгээлге чейин", startExercise: "КӨНҮГҮҮНҮ БАШТОО", stats: "СТАТИСТИКА", seeAll: "БАРДЫГЫ >", logic: "ЛОГИКА", logicDesc: "Жакшы!", speed: "ЫЛДАМДЫК", speedDesc: "Жакшы", accuracy: "ТАКТЫК", accuracyDesc: "Эң жакшы!", streak: "СЕРИЯ", streakDesc: "Күн", navHome: "БАШКЫ БЕТ", navExercise: "КӨНҮГҮҮ", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИЯЛАР", exerciseSubtitle: "Сизге туура келген көнүгүү түрүн тандап, үйрөнүүнү улантыңыз!", infoTitle: "Жөнөкөй эсеп жөнүндө", infoDesc: "Жөнөкөй эсеп көнүгүүсү арифметикалык амалдарды тез жана туура аткаруу көндүмүн өнүктүрөт.", infoOpsLabel: "Амалдар:", infoOps: ["кошуу", "кемитүү", "көбөйтүү", "бөлүү"], infoExampleLabel: "Мисал:", examplesCountTitle: "МИСАЛДАР САНЫ", examplesCountSubtitle: "7ден 25ке чейин мисал тандаңыз", exampleWord: "мисал", opsTitle: "АМАЛДАР", opsSubtitle: "Амалдын түрүн тандаңыз", opsOddiy: "Жөнөкөй", opsOddiyDesc: "Кошуу, кемитүү, көбөйтүү, бөлүү", opsF5: "Формула 5", opsF5Desc: "5ке чейинки формулалар", opsF10: "Формула 10", opsF10Desc: "10го чейинки формулалар", opsAralash: "Аралаш", opsAralashDesc: "Бардык амалдар аралаш", speedSelectTitle: "ЫЛДАМДЫК", speedSelectSubtitle: "Көнүгүү ылдамдыгын тандаңыз", secondWord: "секунд", characters: "ПЕРСОНАЖДАР", all: "БАРДЫГЫ", abacusInfoTitle: "АБАКУС ЖӨНҮНДӨ", abacusInfoDesc: "Жогорку катардагы 1 мончок 5ти, төмөнкү катардагы 4 мончоктун ар бири 1ди билдирет.", abacusLearnRules: "Эрежелерди үйрөнүү", abacusDifficulty: "КЫЙЫНЧЫЛЫК ДЕҢГЭЭЛИ", abacusBeginner: "Башталгыч", abacusIntermediate: "Орто", abacusAdvanced: "Кыйын", abacusOpsTitle: "АМАЛДАР", abacusAddSub: "Кошуу жана Кемитүү", abacusMult: "Көбөйтүү", abacusDiv: "Бөлүү", speedInfoTitle: "ЫКЧАМ ЭСЕП ЖӨНҮНДӨ", speedInfoDesc: "Убакыт менен эсептеп ылдамдыгыңызды жана тактыгыңызды сынап көрүңүз!", speedListItem1: "Убакыт чектелген мисалдар", speedListItem2: "Тез жооп = көбүрөөк упай", speedListItem3: "Тактык маанилүү!", speedExamplesTitle: "МИСАЛДАР САНЫ", speedExamplesSubtitle: "7ден 25ке чейин мисал тандаңыз", speedTimeTitle: "УБАКЫТ ЧЕГИ", speedTimeSubtitle: "0.5тен 2 секундага чейин тандаңыз", speedOpsTitle: "АМАЛДАР", speedOpsSubtitle: "Амалдын түрүн тандаңыз", speedKopaytirish: "Көбөйтүү", speedBolish: "Бөлүү", speedAralash: "Аралаш", speedAllOps: "Бардык амалдар", speedSecLabel: "секунд" , battleTabTitle: "САЛМАШ", battleYou: "СИЗ", battleOpponent: "Атаандаш", battleRating: "Рейтинг", battleLevel: "Деңгээл" , bmOddiy: "Жөнөкөй салмат", bmOddiyDesc: "Тең күчтүүлөр менен тез эсептөө", bmReyting: "Рейтинг салмат", bmReytingDesc: "Упайлар үчүн күчтүү атаандаштар менен", bmTurnir: "Турнир салмат", bmTurnirDesc: "Турнирлерге катышып, байгелерди утуп алыңыз", bmDost: "Дос менен салмат", bmDostDesc: "Досуңузду чакырып, атаандашыңыз" , bmDailyMission: "КҮНДҮК МИССИЯ", bmDailyMissionDesc: "3 салматка катышыңыз", bmDailyBonus: "КҮНДҮК БОНУС" , bestResults: "ЭҢ ЖАКШЫ НАТЫЙЖАЛАР", bestVictories: "Жеңиштер", bestStreak: "Жеңиштер сериясы", bestTime: "Эң тез убакыт" , quickOpponent: "ТЕЗКАР КАРШЫЛАШ", refresh: "Жаңыртуу" , startBattle: "СОГУШТУ БАШТОО", startBattleSubtext: "Каршылашты тандап, жеңишке жет!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Эң күчтүү математиктер", platinumTarget: "Platinum V чейин", xpRemaining: "XP калды", searchPlaceholder: "Колдонуучуну издөө...", statRating: "Рейтинг", statSpeed: "Ылдамдык", statAccuracy: "Тактык", statStreak: "Серия", statExercises: "Көнүгүүлөр", statAchievements: "Жетишкендиктер", statXP: "XP", statCoin: "Монета", achievementsTitle: "ЖЕТИШКЕНДИКТЕР", achv14Days: "14 күндүк серия", achvTop10: "Топ 10", achvGold3: "Алтын III", achvGeneric: "Жетишкендик", activityTitle: "АКТИВДҮҮЛҮК ТАРЫХЫ", activitySeeAll: "Баарын көрүү >", actSimple: "Жөнөкөй эсеп", actBattle: "Салмат", actFast: "Тез эсеп", actAbacus: "Абакус", actToday: "Бүгүн", actYesterday: "Кечээ", actWin: "Жеңиш", collectionTitle: "Менин коллекциям", collAvatars: "Аватарлар", collFrames: "Алкактар", collBgs: "Фондор", collChars: "Персонаждар", collBtn: "ИНВЕНТАРГА ӨТҮҮ >" , invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "АЛКАК", invBg: "ФОН", invUnlocked: "Ачылды:", invSkins: "СКИНДЕР", invTopWear: "ҮСТҮҢКҮ КИЙИМ", invPants: "ШЫМ", invShoes: "БУТ КИЙИМ", invAccessories: "АКСЕССУАРЛАР", invBackpacks: "РЮКЗАКТАР", invActiveChar: "АКТИВДҮҮ ПЕРСОНАЖ", digitsTitle: "ОРУН САНДАР", digitsSubtitle: "Катыша турган орун сандарды тандаңыз", digitsLabel: "орундуу", logout: "Чыгуу" },
  kk: { title: "Математика шебері", subtitle: "24-деңгей", desc: "Математика үйрену үшін керемет, осымен әлемді бағындыр!", clothes: "КИІМДЕР", accessories: "АКСЕССУАРЛАР", levelText: "ДЕҢГЕЙ", toNextLevel: "Келесі деңгейге дейін", startExercise: "ЖАТТЫҒУДЫ БАСТАУ", stats: "СТАТИСТИКА", seeAll: "БАРЛЫҒЫ >", logic: "ЛОГИКА", logicDesc: "Керемет!", speed: "ЖЫЛДАМДЫҚ", speedDesc: "Жақсы", accuracy: "ДӘЛДІК", accuracyDesc: "Өте жақсы!", streak: "СЕРИЯ", streakDesc: "Күн", navHome: "БАСҚЫ БЕТ", navExercise: "ЖАТТЫҒУ", navInventory: "ИНВЕНТАРЬ", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛЬ", missions: "МИССИЯЛАР", exerciseSubtitle: "Өзіңізге сәйкес келетін жаттығу түрін тандап, оқуды жалғастырыңыз!", infoTitle: "Қарапайым есеп туралы", infoDesc: "Қарапайым есеп жаттығуы арифметикалық амалдарды жылдам әрі дұрыс орындау дағдысын дамытады.", infoOpsLabel: "Амалдар:", infoOps: ["қосу", "азайту", "көбейту", "бөлу"], infoExampleLabel: "Мысал:", examplesCountTitle: "МЫСАЛДАР САНЫ", examplesCountSubtitle: "7-ден 25-ке дейін мысал таңдаңыз", exampleWord: "мысал", opsTitle: "АМАЛДАР", opsSubtitle: "Амал түрін таңдаңыз", opsOddiy: "Қарапайым", opsOddiyDesc: "Қосу, азайту, көбейту, бөлу", opsF5: "Формула 5", opsF5Desc: "5-ке дейінгі формулалар", opsF10: "Формула 10", opsF10Desc: "10-ға дейінгі формулалар", opsAralash: "Аралас", opsAralashDesc: "Барлық амалдар аралас", speedSelectTitle: "ЖЫЛДАМДЫҚ", speedSelectSubtitle: "Жаттығу жылдамдығын таңдаңыз", secondWord: "секунд", characters: "КЕЙІПКЕРЛЕР", all: "БАРЛЫҒЫ", abacusInfoTitle: "АБАКУС ТУРАЛЫ", abacusInfoDesc: "Жоғарғы қатардағы 1 моншақ 5-ті, төменгі қатардағы 4 моншақ әрқайсысы 1-ді білдіреді.", abacusLearnRules: "Ережелерді үйрену", abacusDifficulty: "ҚИЫНДЫҚ ДЕҢГЕЙІ", abacusBeginner: "Бастауыш", abacusIntermediate: "Орташа", abacusAdvanced: "Қиын", abacusOpsTitle: "АМАЛДАР", abacusAddSub: "Қосу және Азайту", abacusMult: "Көбейту", abacusDiv: "Бөлу", speedInfoTitle: "ЖЫЛДАМ ЕСЕП ТУРАЛЫ", speedInfoDesc: "Уақытпен есептеу арқылы жылдамдық пен дәлдікті тексеріңіз!", speedListItem1: "Уақыты шектеулі мысалдар", speedListItem2: "Жылдам жауап = көбірек ұпай", speedListItem3: "Дәлдік маңызды!", speedExamplesTitle: "МЫСАЛДАР САНЫ", speedExamplesSubtitle: "7-ден 25-ке дейін мысал таңдаңыз", speedTimeTitle: "УАҚЫТ ШЕКТЕУІ", speedTimeSubtitle: "0.5-тен 2 секундқа дейін таңдаңыз", speedOpsTitle: "АМАЛДАР", speedOpsSubtitle: "Амал түрін таңдаңыз", speedKopaytirish: "Көбейту", speedBolish: "Бөлу", speedAralash: "Аралас", speedAllOps: "Барлық амалдар", speedSecLabel: "секунд" , battleTabTitle: "ЖЕКПЕ-ЖЕК", battleYou: "СІЗ", battleOpponent: "Қарсылас", battleRating: "Рейтинг", battleLevel: "Деңгей" , bmOddiy: "Қарапайым жекпе-жек", bmOddiyDesc: "Тең күштілермен жылдам есептеу", bmReyting: "Рейтинг жекпе-жек", bmReytingDesc: "Рейтинг үшін күшті қарсыластармен", bmTurnir: "Турнир жекпе-жек", bmTurnirDesc: "Турнирлерге қатысып, жүлделер ұтып алыңыз", bmDost: "Доспен жекпе-жек", bmDostDesc: "Досыңызды шақырып, жарысыңыз" , bmDailyMission: "КҮНДЕЛІКТІ МИССИЯ", bmDailyMissionDesc: "3 жекпе-жекке қатысыңыз", bmDailyBonus: "КҮНДЕЛІКТІ БОНУС" , bestResults: "ЕҢ ЖАҚСЫ НӘТИЖЕЛЕР", bestVictories: "Жеңістер", bestStreak: "Жеңістер сериясы", bestTime: "Ең жылдам уақыт" , quickOpponent: "ЖЫЛДАМ ҚАРСЫЛАС", refresh: "Жаңарту" , startBattle: "ШАЙҚАСТЫ БАСТАУ", startBattleSubtext: "Қарсыласты таңдап, жеңіске жетіңіз!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Ең мықты математиктер", platinumTarget: "Platinum V дейін", xpRemaining: "XP қалды" , invCharacter: "КЕЙІПКЕР", invAvatar: "АВАТАР", invFrame: "ЖАҚТАУ", invBg: "ФОН", invUnlocked: "Ашылды:", invSkins: "СКИНДЕР", invTopWear: "ЖОҒАРҒЫ КИІМ", invPants: "ШАЛБАР", invShoes: "АЯҚ КИІМ", invAccessories: "АКСЕССУАРЛАР", invBackpacks: "РЮКЗАКТАР", invActiveChar: "БЕЛСЕНДІ КЕЙІПКЕР", digitsTitle: "ОРЫН САНДАР", digitsSubtitle: "Қатысатын орын сандарды таңдаңыз", digitsLabel: "орынды", logout: "Шығу" },
  tg: { title: "Устоди математика", subtitle: "Сатҳи 24", desc: "Барои омӯзиши математика олӣ аст, бо ин ҷаҳонро фатҳ кунед!", clothes: "ЛИБОСҲО", accessories: "ЛАВОЗИМОТ", levelText: "САТҲ", toNextLevel: "То сатҳи навбатӣ", startExercise: "ОҒОЗИ МАШҚ", stats: "СТАТИСТИКА", seeAll: "ҲАМА >", logic: "МАНТИҚ", logicDesc: "Олӣ!", speed: "СУРЪАТ", speedDesc: "Хуб", accuracy: "ДАҚИҚӢ", accuracyDesc: "Аъло!", streak: "СЕРИЯ", streakDesc: "Рӯз", navHome: "АСОСӢ", navExercise: "МАШҚ", navInventory: "ИНВЕНТАР", navRanking: "РЕЙТИНГ", navProfile: "ПРОФИЛ", missions: "МИССИЯҲО", exerciseSubtitle: "Навъи машқи ба шумо мувофиқро интихоб кунед ва омӯзишро давом диҳед!", infoTitle: "Дар бораи ҳисоби оддӣ", infoDesc: "Машқи ҳисоби оддӣ маҳорати зуд ва дуруст иҷро кардани амалҳои арифметикиро инкишоф медиҳад.", infoOpsLabel: "Амалҳо:", infoOps: ["ҷамъ", "тарҳ", "зарб", "тақсим"], infoExampleLabel: "Мисол:", examplesCountTitle: "МИҚДОРИ МИСОЛҲО", examplesCountSubtitle: "Аз 7 то 25 мисол интихоб кунед", exampleWord: "мисол", opsTitle: "АМАЛҲО", opsSubtitle: "Намуди амалро интихоб кунед", opsOddiy: "Оддӣ", opsOddiyDesc: "Ҷамъ, тарҳ, зарб, тақсим", opsF5: "Формулаи 5", opsF5Desc: "Формулаҳо то 5", opsF10: "Формулаи 10", opsF10Desc: "Формулаҳо то 10", opsAralash: "Омехта", opsAralashDesc: "Ҳамаи амалҳо омехта", speedSelectTitle: "СУРЪАТ", speedSelectSubtitle: "Суръати машқро интихоб кунед", secondWord: "сония", characters: "ПЕРСОНАЖҲО", all: "ҲАМА", abacusInfoTitle: "ДАР БОРАИ АБАКУС", abacusInfoDesc: "1 маҳтоби болоӣ ба 5, 4 маҳтоби поёнӣ ҳар кадом ба 1 баробар аст.", abacusLearnRules: "Омӯзиши қоидаҳо", abacusDifficulty: "САТҲИ МУШКИЛӢ", abacusBeginner: "Шурӯъкунанда", abacusIntermediate: "Миёна", abacusAdvanced: "Мушкил", abacusOpsTitle: "АМАЛҲО", abacusAddSub: "Ҷамъ ва Тарҳ", abacusMult: "Зарб", abacusDiv: "Тақсим", speedInfoTitle: "ДАР БОРАИ ҲИСОБИ ЗУД", speedInfoDesc: "Бо ҳисобкунӣ бар зидди вақт суръат ва дақиқии худро санҷед!", speedListItem1: "Мисолҳои маҳдуди вақт", speedListItem2: "Ҷавоби зуд = холҳои бештар", speedListItem3: "Дақиқӣ муҳим аст!", speedExamplesTitle: "МИҚДОРИ МИСОЛҲО", speedExamplesSubtitle: "Аз 7 то 25 мисол интихоб кунед", speedTimeTitle: "МАҲДУДИЯТИ ВАҚТ", speedTimeSubtitle: "Аз 0.5 то 2 сония интихоб кунед", speedOpsTitle: "АМАЛҲО", speedOpsSubtitle: "Намуди амалро интихоб кунед", speedKopaytirish: "Зарб", speedBolish: "Тақсим", speedAralash: "Омехта", speedAllOps: "Ҳамаи амалҳо", speedSecLabel: "сония" , battleTabTitle: "ҶАНГ", battleYou: "ШУМО", battleOpponent: "Ҳариф", battleRating: "Рейтинг", battleLevel: "Сатҳ" , bmOddiy: "Ҷанги оддӣ", bmOddiyDesc: "Ҳисоби зуд бо ҳамқувватҳо", bmReyting: "Ҷанги рейтинг", bmReytingDesc: "Барои холҳо бо ҳарифҳои қавӣ", bmTurnir: "Ҷанги мусобиқа", bmTurnirDesc: "Дар мусобиқаҳо иштирок кунед ва ҷоизаҳо гиред", bmDost: "Ҷанг бо дӯст", bmDostDesc: "Дӯсти худро даъват кунед ва рақобат кунед" , bmDailyMission: "ВАЗИФАИ ҲАРРӮЗА", bmDailyMissionDesc: "Дар 3 ҷанг иштирок кунед", bmDailyBonus: "БОНУСИ ҲАРРӮЗА" , bestResults: "НАТИҶАҲОИ БЕҲТАРИН", bestVictories: "Ғалабаҳо", bestStreak: "Силсилаи ғалабаҳо", bestTime: "Вақти тезтарин" , quickOpponent: "РАҚИБИ ТЕЗ", refresh: "Навсозӣ" , startBattle: "ОҒОЗИ НАБАРД", startBattleSubtext: "Рақибро интихоб кунед ва ғалаба ба даст оред!" , rankingTitle: "РЕЙТИНГ", rankingSubtitle: "Пурқувваттарин математикҳо", platinumTarget: "То Platinum V", xpRemaining: "XP боқимонда" , invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "ЧОРЧӮБА", invBg: "ФОН", invUnlocked: "Кушода шуд:", invSkins: "СКИНҲО", invTopWear: "ЛИБОСИ БОЛОӢ", invPants: "ШИМ", invShoes: "ПОЙАФЗОЛ", invAccessories: "ЛАВОЗИМОТ", invBackpacks: "ҶУЗВДОНҲО", invActiveChar: "ПЕРСОНАЖИ ФАЪОЛ", digitsTitle: "РАҚАМҲО", digitsSubtitle: "Миқдори рақамҳоро интихоб кунед", digitsLabel: "рақама", logout: "Хуруҷ" },
  ja: { title: "数学マスター", subtitle: "レベル 24", desc: "数学の学習に最適です。これで世界を征服しましょう！", clothes: "服", accessories: "アクセサリー", levelText: "レベル", toNextLevel: "次のレベルまで", startExercise: "練習を始める", stats: "統計", seeAll: "すべて >", logic: "論理", logicDesc: "素晴らしい！", speed: "スピード", speedDesc: "良い", accuracy: "正確さ", accuracyDesc: "優秀！", streak: "連続", streakDesc: "日", navHome: "ホーム", navExercise: "練習", navInventory: "在庫", navRanking: "ランキング", navProfile: "プロフィール", missions: "ミッション", exerciseSubtitle: "自分に合ったエクササイズタイプを選んで、学習を続けましょう！", infoTitle: "簡単な計算について", infoDesc: "簡単な計算の練習は、算術演算を素早く正確に実行するスキルを養います。", infoOpsLabel: "演算:", infoOps: ["加算", "減算", "乗算", "除算"], infoExampleLabel: "例:", examplesCountTitle: "例の数", examplesCountSubtitle: "7から25の例を選択してください", exampleWord: "例", opsTitle: "操作", opsSubtitle: "操作タイプを選択してください", opsOddiy: "シンプル", opsOddiyDesc: "加算、減算、乗算、除算", opsF5: "式5", opsF5Desc: "5までの式", opsF10: "式10", opsF10Desc: "10までの式", opsAralash: "混合", opsAralashDesc: "すべての操作が混在", speedSelectTitle: "スピード", speedSelectSubtitle: "練習の速度を選択してください", secondWord: "秒", characters: "キャラクター", all: "すべて", abacusInfoTitle: "そろばんについて", abacusInfoDesc: "上の珠1つは5を、下の珠4つはそれぞれ1を表します。", abacusLearnRules: "ルールを学ぶ", abacusDifficulty: "難易度", abacusBeginner: "初心者", abacusIntermediate: "中級", abacusAdvanced: "上級", abacusOpsTitle: "操作", abacusAddSub: "加算と減算", abacusMult: "乗算", abacusDiv: "除算", speedInfoTitle: "スピード計算について", speedInfoDesc: "時間と競争してスピードと正確さをテストしましょう！", speedListItem1: "時間制限のある例", speedListItem2: "早い回答 = 高得点", speedListItem3: "正確さが重要！", speedExamplesTitle: "例の数", speedExamplesSubtitle: "7から25の例を選択", speedTimeTitle: "制限時間", speedTimeSubtitle: "0.5〜2秒から選択", speedOpsTitle: "操作", speedOpsSubtitle: "操作タイプを選択", speedKopaytirish: "乗算", speedBolish: "除算", speedAralash: "混合", speedAllOps: "すべての操作", speedSecLabel: "秒" , battleTabTitle: "バトル", battleYou: "あなた", battleOpponent: "対戦相手", battleRating: "評価", battleLevel: "レベル" , bmOddiy: "シンプルなバトル", bmOddiyDesc: "同等の相手と高速計算", bmReyting: "レーティングバトル", bmReytingDesc: "ポイントのための強い相手と", bmTurnir: "トーナメントバトル", bmTurnirDesc: "トーナメントに参加して賞品を獲得", bmDost: "友達とバトル", bmDostDesc: "友達を招待して競う" , bmDailyMission: "デイリーミッション", bmDailyMissionDesc: "3回のバトルに参加する", bmDailyBonus: "デイリーボーナス" , bestResults: "最高の結果", bestVictories: "勝利", bestStreak: "連勝", bestTime: "最速タイム" , quickOpponent: "クイック対戦相手", refresh: "更新" , startBattle: "バトル開始", startBattleSubtext: "対戦相手を選んで勝利を掴もう！" , rankingTitle: "ランキング", rankingSubtitle: "最強の数学者たち", platinumTarget: "Platinum V まで", xpRemaining: "XP 残り", searchPlaceholder: "ユーザーを検索...", statRating: "評価", statSpeed: "スピード", statAccuracy: "正確さ", statStreak: "連続", statExercises: "練習", statAchievements: "実績", statXP: "XP", statCoin: "コイン", achievementsTitle: "実績", achv14Days: "14日連続", achvTop10: "トップ10", achvGold3: "ゴールド III", achvGeneric: "実績", activityTitle: "活動履歴", activitySeeAll: "すべて見る >", actSimple: "簡単な計算", actBattle: "バトル", actFast: "速算", actAbacus: "そろばん", actToday: "今日", actYesterday: "昨日", actWin: "勝利", collectionTitle: "マイコレクション", collAvatars: "アバター", collFrames: "フレーム", collBgs: "背景", collChars: "キャラクター", collBtn: "在庫へ行く >" , invCharacter: "キャラクター", invAvatar: "アバター", invFrame: "フレーム", invBg: "背景", invUnlocked: "ロック解除:", invSkins: "スキン", invTopWear: "トップス", invPants: "パンツ", invShoes: "靴", invAccessories: "アクセサリー", invBackpacks: "バックパック", invActiveChar: "アクティブなキャラクター", digitsTitle: "桁数", digitsSubtitle: "参加する桁数を選択してください", digitsLabel: "桁", logout: "ログアウト" },
  ko: { title: "수학 마스터", subtitle: "레벨 24", desc: "수학 학습에 좋습니다. 이것으로 세상을 정복하세요!", clothes: "옷", accessories: "액세서리", levelText: "레벨", toNextLevel: "다음 레벨까지", startExercise: "연습 시작", stats: "통계", seeAll: "모두 보기 >", logic: "논리", logicDesc: "훌륭해요!", speed: "속도", speedDesc: "좋음", accuracy: "정확도", accuracyDesc: "매우 우수함!", streak: "연속", streakDesc: "일", navHome: "홈", navExercise: "운동", navInventory: "인벤토리", navRanking: "순위", navProfile: "프로필", missions: "임무", exerciseSubtitle: "자신에게 맞는 운동 유형을 선택하고 계속 학습하세요!", infoTitle: "간단한 계산에 대하여", infoDesc: "간단한 계산 연습은 산술 연산을 빠르고 정확하게 수행하는 능력을 기릅니다.", infoOpsLabel: "연산:", infoOps: ["덧셈", "뺄셈", "곱셈", "나눗셈"], infoExampleLabel: "예:", examplesCountTitle: "예제 수", examplesCountSubtitle: "7에서 25개의 예제를 선택하세요", exampleWord: "예제", opsTitle: "연산", opsSubtitle: "연산 유형을 선택하세요", opsOddiy: "단순", opsOddiyDesc: "덧셈, 뺄셈, 곱셈, 나눗셈", opsF5: "공식 5", opsF5Desc: "5까지의 공식", opsF10: "공식 10", opsF10Desc: "10까지의 공식", opsAralash: "혼합", opsAralashDesc: "모든 연산 혼합", speedSelectTitle: "속도", speedSelectSubtitle: "운동 속도를 선택하세요", secondWord: "초", characters: "캐릭터", all: "모두", abacusInfoTitle: "주판에 대하여", abacusInfoDesc: "위쪽 알 1개는 5를 의미하고 아래쪽 알 4개는 각각 1을 의미합니다.", abacusLearnRules: "규칙 배우기", abacusDifficulty: "난이도", abacusBeginner: "초급", abacusIntermediate: "중급", abacusAdvanced: "고급", abacusOpsTitle: "연산", abacusAddSub: "덧셈과 뺄셈", abacusMult: "곱셈", abacusDiv: "나눗셈", speedInfoTitle: "스피드 계산에 대하여", speedInfoDesc: "시간에 맞서 계산하여 속도와 정확성을 테스트하세요!", speedListItem1: "시간 제한 예제", speedListItem2: "빠른 답변 = 더 많은 점수", speedListItem3: "정확성이 중요합니다!", speedExamplesTitle: "예제 수", speedExamplesSubtitle: "7에서 25개 예제 선택", speedTimeTitle: "시간 제한", speedTimeSubtitle: "0.5초에서 2초 사이 선택", speedOpsTitle: "연산", speedOpsSubtitle: "연산 유형 선택", speedKopaytirish: "곱셈", speedBolish: "나눗셈", speedAralash: "혼합", speedAllOps: "모든 연산", speedSecLabel: "초" , battleTabTitle: "전투", battleYou: "당신", battleOpponent: "상대", battleRating: "평가", battleLevel: "레벨" , bmOddiy: "단순한 전투", bmOddiyDesc: "동등한 상대와 빠른 계산", bmReyting: "등급 전투", bmReytingDesc: "점수를 위한 강력한 상대와 함께", bmTurnir: "토너먼트 전투", bmTurnirDesc: "토너먼트에 참가하고 상품을 받으세요", bmDost: "친구와 전투", bmDostDesc: "친구를 초대하고 경쟁하세요" , bmDailyMission: "일일 미션", bmDailyMissionDesc: "3번의 전투에 참여하세요", bmDailyBonus: "일일 보너스" , bestResults: "최고의 결과", bestVictories: "승리", bestStreak: "연승", bestTime: "가장 빠른 시간" , quickOpponent: "빠른 상대", refresh: "새로고침" , startBattle: "배틀 시작", startBattleSubtext: "상대를 선택하고 승리하세요!" , rankingTitle: "랭킹", rankingSubtitle: "최강의 수학자들", platinumTarget: "Platinum V 까지", xpRemaining: "XP 남음", searchPlaceholder: "사용자 검색...", statRating: "평가", statSpeed: "속도", statAccuracy: "정확도", statStreak: "연속", statExercises: "연습", statAchievements: "업적", statXP: "XP", statCoin: "코인", achievementsTitle: "업적", achv14Days: "14일 연속", achvTop10: "상위 10", achvGold3: "골드 III", achvGeneric: "업적", activityTitle: "활동 기록", activitySeeAll: "모두 보기 >", actSimple: "간단한 계산", actBattle: "전투", actFast: "빠른 계산", actAbacus: "주판", actToday: "오늘", actYesterday: "어제", actWin: "승리", collectionTitle: "내 컬렉션", collAvatars: "아바타", collFrames: "프레임", collBgs: "배경", collChars: "캐릭터", collBtn: "인벤토리로 가기 >" , invCharacter: "캐릭터", invAvatar: "아바타", invFrame: "프레임", invBg: "배경", invUnlocked: "잠금 해제:", invSkins: "스킨", invTopWear: "상의", invPants: "바지", invShoes: "신발", invAccessories: "액세서리", invBackpacks: "배낭", invActiveChar: "활성 캐릭터", digitsTitle: "자릿수", digitsSubtitle: "참여할 자릿수를 선택하세요", digitsLabel: "자리", logout: "로그아웃" },
};


const EXERCISE_TYPES_TRANSLATIONS = {
  uz: { title: "MASHQ TURLARI", calcTitle: "Tasavvur", calcDesc: "Qo'shish, ayirish, ko'paytirish, bo'lish", abacusTitle: "Abakus", abacusDesc: "Serotan yordamida hisoblash", speedTitle: "Ko'paytirish va bo'lish", speedDesc: "Vaqt bilan hisoblash", battleTitle: "Battle", battleDesc: "Boshqa o'yinchilarga qarshi" , invCharacter: "PERSONAJ", invAvatar: "AVATAR", invFrame: "RAMKA", invBg: "FON", invUnlocked: "Ochilgan:", invSkins: "SKINLAR", invTopWear: "USTKI KIYIM", invPants: "SHIM", invShoes: "OYOQ KIYIM", invAccessories: "AKSESSUARLAR", invBackpacks: "RYUKZAKLAR", invActiveChar: "AKTIV PERSONAJ", digitsTitle: "SON XONASI", digitsSubtitle: "Qatnashadigan sonlar xonasini tanlang", digitsLabel: "xonali", logout: "Tizimdan chiqish" },
  en: { title: "EXERCISE TYPES", calcTitle: "Basic Math", calcDesc: "Addition, subtraction, multiplication, division", abacusTitle: "Abacus", abacusDesc: "Calculate using Soroban", speedTitle: "Multiplication & Division", speedDesc: "Calculate against time", battleTitle: "Battle", battleDesc: "Against other players" , invCharacter: "CHARACTER", invAvatar: "AVATAR", invFrame: "FRAME", invBg: "BG", invUnlocked: "Unlocked:", invSkins: "SKINS", invTopWear: "TOP WEAR", invPants: "PANTS", invShoes: "SHOES", invAccessories: "ACCESSORIES", invBackpacks: "BACKPACKS", invActiveChar: "ACTIVE CHARACTER", digitsTitle: "DIGITS", digitsSubtitle: "Select the number of digits to participate", digitsLabel: "digits", logout: "Logout" },
  ru: { title: "ВИДЫ ТРЕНИРОВОК", calcTitle: "Простая математика", calcDesc: "Сложение, вычитание, умножение, деление", abacusTitle: "Абакус", abacusDesc: "Счет на соробане", speedTitle: "Умножение и деление", speedDesc: "Счет на время", battleTitle: "Битва", battleDesc: "Против других игроков" , invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "РАМКА", invBg: "ФОН", invUnlocked: "Разблокировано:", invSkins: "СКИНЫ", invTopWear: "ВЕРХНЯЯ ОДЕЖДА", invPants: "ШТАНЫ", invShoes: "ОБУВЬ", invAccessories: "АКСЕССУАРЫ", invBackpacks: "РЮКЗАКИ", invActiveChar: "АКТИВНЫЙ ПЕРСОНАЖ", digitsTitle: "ЗНАЧНОСТЬ", digitsSubtitle: "Выберите количество знаков", digitsLabel: "-значный", logout: "Выйти" },
  ar: { title: "أنواع التمارين", calcTitle: "حساب بسيط", calcDesc: "الجمع والطرح والضرب والقسمة", abacusTitle: "المعداد", abacusDesc: "احسب باستخدام سوروبان", speedTitle: "الضرب والقسمة", speedDesc: "احسب ضد الوقت", battleTitle: "معركة", battleDesc: "ضد لاعبين آخرين" , invCharacter: "شخصية", invAvatar: "صورة رمزية", invFrame: "إطار", invBg: "خلفية", invUnlocked: "مفتوح:", invSkins: "جلود", invTopWear: "ملابس علوية", invPants: "سراويل", invShoes: "أحذية", invAccessories: "إكسسوارات", invBackpacks: "حقائب ظهر", invActiveChar: "شخصية نشطة", digitsTitle: "عدد الأرقام", digitsSubtitle: "حدد عدد الأرقام للمشاركة", digitsLabel: "أرقام", logout: "تسجيل خروج" },
  tr: { title: "EGZERSİZ TÜRLERİ", calcTitle: "Basit Matematik", calcDesc: "Toplama, çıkarma, çarpma, bölme", abacusTitle: "Abaküs", abacusDesc: "Soroban kullanarak hesapla", speedTitle: "Çarpma ve Bölme", speedDesc: "Zamana karşı hesapla", battleTitle: "Savaş", battleDesc: "Diğer oyunculara karşı" , invCharacter: "KARAKTER", invAvatar: "AVATAR", invFrame: "ÇERÇEVE", invBg: "ARKA PLAN", invUnlocked: "Açıldı:", invSkins: "GÖRÜNÜMLER", invTopWear: "ÜST GİYİM", invPants: "PANTOLON", invShoes: "AYAKKABI", invAccessories: "AKSESUARLAR", invBackpacks: "SIRT ÇANTALARI", invActiveChar: "AKTİF KARAKTER", digitsTitle: "BASAMAKLAR", digitsSubtitle: "Katılacak basamak sayısını seçin", digitsLabel: "basamaklı", logout: "Çıkış Yap" },
  zh: { title: "练习类型", calcTitle: "基础数学", calcDesc: "加、减、乘、除", abacusTitle: "算盘", abacusDesc: "使用算盘计算", speedTitle: "乘法与除法", speedDesc: "计时计算", battleTitle: "对战", battleDesc: "对战其他玩家" , invCharacter: "角色", invAvatar: "头像", invFrame: "相框", invBg: "背景", invUnlocked: "已解锁:", invSkins: "皮肤", invTopWear: "上衣", invPants: "裤子", invShoes: "鞋子", invAccessories: "配饰", invBackpacks: "背包", invActiveChar: "当前角色", digitsTitle: "位数", digitsSubtitle: "选择参与的位数", digitsLabel: "位数", logout: "登出" },
  ky: { title: "КӨНҮГҮҮ ТҮРЛӨРҮ", calcTitle: "Жөнөкөй эсеп", calcDesc: "Кошуу, кемитүү, көбөйтүү, бөлүү", abacusTitle: "Абакус", abacusDesc: "Соробандын жардамы менен эсептөө", speedTitle: "Көбөйтүү жана бөлүү", speedDesc: "Убакыт менен эсептөө", battleTitle: "Салгылашуу", battleDesc: "Башка оюнчуларга каршы" , invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "АЛКАК", invBg: "ФОН", invUnlocked: "Ачылды:", invSkins: "СКИНДЕР", invTopWear: "ҮСТҮҢКҮ КИЙИМ", invPants: "ШЫМ", invShoes: "БУТ КИЙИМ", invAccessories: "АКСЕССУАРЛАР", invBackpacks: "РЮКЗАКТАР", invActiveChar: "АКТИВДҮҮ ПЕРСОНАЖ", digitsTitle: "ОРУН САНДАР", digitsSubtitle: "Катыша турган орун сандарды тандаңыз", digitsLabel: "орундуу", logout: "Чыгуу" },
  kk: { title: "ЖАТТЫҒУ ТҮРЛЕРІ", calcTitle: "Қарапайым есеп", calcDesc: "Қосу, алу, көбейту, бөлу", abacusTitle: "Абакус", abacusDesc: "Соробан көмегімен есептеу", speedTitle: "Көбейту және бөлу", speedDesc: "Уақытпен есептеу", battleTitle: "Шайқас", battleDesc: "Басқа ойыншыларға қарсы" , invCharacter: "КЕЙІПКЕР", invAvatar: "АВАТАР", invFrame: "ЖАҚТАУ", invBg: "ФОН", invUnlocked: "Ашылды:", invSkins: "СКИНДЕР", invTopWear: "ЖОҒАРҒЫ КИІМ", invPants: "ШАЛБАР", invShoes: "АЯҚ КИІМ", invAccessories: "АКСЕССУАРЛАР", invBackpacks: "РЮКЗАКТАР", invActiveChar: "БЕЛСЕНДІ КЕЙІПКЕР", digitsTitle: "ОРЫН САНДАР", digitsSubtitle: "Қатысатын орын сандарды таңдаңыз", digitsLabel: "орынды", logout: "Шығу" },
  tg: { title: "НАМУДҲОИ МАШҚ", calcTitle: "Ҳисоби оддӣ", calcDesc: "Ҷамъ, тарҳ, зарб, тақсим", abacusTitle: "Абакус", abacusDesc: "Бо ёрии соробан ҳисоб кунед", speedTitle: "Зарб ва тақсим", speedDesc: "Ҳисоб бо ва вақт", battleTitle: "Ҷанг", battleDesc: "Бар зидди бозингарони дигар" , invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "ЧОРЧӮБА", invBg: "ФОН", invUnlocked: "Кушода шуд:", invSkins: "СКИНҲО", invTopWear: "ЛИБОСИ БОЛОӢ", invPants: "ШИМ", invShoes: "ПОЙАФЗОЛ", invAccessories: "ЛАВОЗИМОТ", invBackpacks: "ҶУЗВДОНҲО", invActiveChar: "ПЕРСОНАЖИ ФАЪОЛ", digitsTitle: "РАҚАМҲО", digitsSubtitle: "Миқдори рақамҳоро интихоб кунед", digitsLabel: "рақама", logout: "Хуруҷ" },
  ja: { title: "練習の種類", calcTitle: "基本の数学", calcDesc: "足し算、引き算、掛け算、割り算", abacusTitle: "そろばん", abacusDesc: "そろばんを使って計算する", speedTitle: "掛け算と割り算", speedDesc: "時間と競争して計算する", battleTitle: "バトル", battleDesc: "他のプレイヤーと対戦" , invCharacter: "キャラクター", invAvatar: "アバター", invFrame: "フレーム", invBg: "背景", invUnlocked: "ロック解除:", invSkins: "スキン", invTopWear: "トップス", invPants: "パンツ", invShoes: "靴", invAccessories: "アクセサリー", invBackpacks: "バックパック", invActiveChar: "アクティブなキャラクター", digitsTitle: "桁数", digitsSubtitle: "参加する桁数を選択してください", digitsLabel: "桁", logout: "ログアウト" },
  ko: { title: "연습 유형", calcTitle: "기본 수학", calcDesc: "덧셈, 뺄셈, 곱셈, 나눗셈", abacusTitle: "주판", abacusDesc: "주판을 사용하여 계산", speedTitle: "곱셈과 나눗셈", speedDesc: "시간에 맞서 계산", battleTitle: "배틀", battleDesc: "다른 플레이어와 대결" , invCharacter: "캐릭터", invAvatar: "아바타", invFrame: "프레임", invBg: "배경", invUnlocked: "잠금 해제:", invSkins: "스킨", invTopWear: "상의", invPants: "바지", invShoes: "신발", invAccessories: "액세서리", invBackpacks: "배낭", invActiveChar: "활성 캐릭터", digitsTitle: "자릿수", digitsSubtitle: "참여할 자릿수를 선택하세요", digitsLabel: "자리", logout: "로그아웃" },
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
useGLTF.preload(require('../assets/models/ochki_9_optimized.glb'));
useGLTF.preload(require('../assets/models/ochki_4_optimized.glb'));

function AccessoryModel({ modelPath, yPos, characterIndex, isHeadwear = false }) {
  if (!modelPath) return null;
  const glbSource = typeof modelPath === 'string' ? (modelPath.startsWith('http') ? modelPath : `${API_URL}${modelPath.replace('/api', '')}`) : modelPath;
  const { scene } = useGLTF(glbSource, true, true, (loader) => {
    if (loader && loader.setMeshoptDecoder) {
      loader.setMeshoptDecoder(MeshoptDecoder);
    }
  });
  
  // Fix for WebGL Shader Error: ERROR___ERROR_IN_EXPONENT caused by hyphens (e-5) in material names
  React.useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
         if (Array.isArray(child.material)) {
            child.material.forEach(mat => {
               if (mat.name) mat.name = mat.name.replace(/-/g, '_');
            });
         } else {
            if (child.material.name) child.material.name = child.material.name.replace(/-/g, '_');
         }
      }
    });
  }, [scene]);
  
  const accessoryScale = isHeadwear ? 0.65 : 0.50;
  
  let xOffset = -0.02;
  let heightOffset = isHeadwear ? 2.35 : 2.10; // Bosh kiyim (hat/cap) head height positioning
  let zOffset = isHeadwear ? 0.05 : 0.20;
  
  if (characterIndex === 1) { // Maks
    heightOffset = isHeadwear ? 1.75 : 1.50; 
  } else if (characterIndex >= 4) { // Qizlar
    heightOffset = isHeadwear ? 2.30 : 2.05; 
    zOffset = isHeadwear ? 0.10 : 0.30; 
  }
  
  const posX = xOffset;
  const posY = yPos + heightOffset;
  const posZ = zOffset;
  
  return (
    <primitive 
      object={scene.clone()} 
      scale={accessoryScale} 
      position={[posX, posY, posZ]} 
      rotation={[0, -Math.PI / 2, 0]}
    />
  );
}

function CharacterModel({ characterIndex, yOffset = 0, accessoryPath = null, headwearPath = null, isHeadwear = false }) {
  const models = {
    0: require('../assets/models/athletic_man_optimized.glb'),
    1: require('../assets/models/adult_male_optimized.glb'),
    2: require('../assets/models/mannequin_clothing_optimized.glb'),
    3: require('../assets/models/businessman_optimized.glb'),
    4: require('../assets/models/fashion_model_optimized.glb'),
    5: require('../assets/models/casual_outfit_optimized.glb'),
    6: require('../assets/models/beige_trench_coat_optimized.glb'),
    7: require('../assets/models/stylized_girl_optimized.glb')
  };
  
  const modelPath = models[characterIndex] || models[0];
  const { scene } = useGLTF(modelPath, true, true, (loader) => {
    if (loader && loader.setMeshoptDecoder) {
      loader.setMeshoptDecoder(MeshoptDecoder);
    }
  });

  // Fix Android GL materials: Convert materials to MeshLambertMaterial so textures render clearly with lighting instead of black silhouette
  React.useMemo(() => {
    scene.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        const newMats = mats.map(mat => {
          if (mat.map) {
            const lambert = new THREE.MeshLambertMaterial({
              map: mat.map,
              side: THREE.DoubleSide,
              transparent: mat.transparent || false,
              alphaTest: mat.alphaTest || 0,
            });
            return lambert;
          }
          return new THREE.MeshLambertMaterial({
            color: mat.color ? mat.color : 0xcccccc,
            side: THREE.DoubleSide,
          });
        });
        child.material = Array.isArray(child.material) ? newMats : newMats[0];
      }
    });
  }, [scene]);

  let yPos = -0.2 + yOffset; // Standard position for all characters
  if (characterIndex === 1) yPos = 1.2 + yOffset; // Maks is positioned lower by default, so we move him up

  return (
    <>
      <primitive object={scene} scale={6.3} position={[0, yPos, 0]} rotation={[0, -Math.PI / 2, 0]} />
      {accessoryPath && <AccessoryModel modelPath={accessoryPath} yPos={yPos} characterIndex={characterIndex} isHeadwear={false} />}
      {headwearPath && <AccessoryModel modelPath={headwearPath} yPos={yPos} characterIndex={characterIndex} isHeadwear={true} />}
      <OrbitControls 
        enableZoom={false} 
        enablePan={false} 
        minPolarAngle={Math.PI / 2} 
        maxPolarAngle={Math.PI / 2} 
        rotateSpeed={4.0}
        target={[0, 0, 0]}
      />
    </>
  );
}

const getAvatarByName = (name) => {
  if (!name) return require('../assets/avatar_maks.png');
  const lower = name.toLowerCase();
  if (lower.includes('alex')) return require('../assets/avatar_alex.jpg');
  if (lower.includes('maks')) return require('../assets/avatar_maks.png');
  if (lower.includes('david')) return require('../assets/avatar_david.jpg');
  if (lower.includes('kevin')) return require('../assets/avatar_kevin.png');
  if (lower.includes('lily')) return require('../assets/avatar_lily.jpg');
  if (lower.includes('maya')) return require('../assets/avatar_maya.jpg');
  if (lower.includes('sophia')) return require('../assets/avatar_sophia.png');
  if (lower.includes('emma')) return require('../assets/avatar_emma.jpg');
  return require('../assets/avatar_maks.png');
};

export default function StudentDashboardScreen({ navigation, route }) {
  const { energy: currentEnergy, addEnergy, consumeEnergy, formattedTime, isPremium, checkPremiumActive } = useEnergy();
  const [user, setUser] = useState(route.params?.user);
  const [isEnergyAlertVisible, setIsEnergyAlertVisible] = useState(false);
  const [requiredEnergyAlert, setRequiredEnergyAlert] = useState(1);
  const { language = 'uz', selectedChar = 0 } = route.params || {};
  const [activeTab, setActiveTab] = useState('home');
  const [activeAvatarIndex, setActiveAvatarIndex] = useState(selectedChar);
  const [equippedAccessories, setEquippedAccessories] = useState({});
  const equippedAccessory = equippedAccessories[activeAvatarIndex] || null;
  const [equippedHeadwears, setEquippedHeadwears] = useState({});
  const equippedHeadwear = equippedHeadwears[activeAvatarIndex] || null;
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
  const searchRotationAnim = useRef(new Animated.Value(0)).current;
  const highlightAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(searchRotationAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true
      })
    ).start();
  }, [searchRotationAnim]);

  const searchSpin = searchRotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg']
  });

  const [leaderboardData, setLeaderboardData] = useState([]);
  
  const [userXp, setUserXp] = useState(user?.xp || 0);
  const [userCoin, setUserCoin] = useState(user?.coin || 0);
  // Guest user check: True ONLY if user is a guest user (explicitly isGuest: true or no user object exists)
  const isGuestUser = Boolean(!user || user.isGuest === true);
  
  // Custom Premium Alert Modal State
  const [customAlert, setCustomAlert] = useState({
    visible: false,
    title: '',
    message: '',
    type: 'success', // 'success' or 'warning'
    buttons: []
  });

  const showCustomAlert = (title, message, type = 'success', buttons = []) => {
    setCustomAlert({
      visible: true,
      title,
      message,
      type,
      buttons
    });
  };

  const closeCustomAlert = () => {
    setCustomAlert(prev => ({ ...prev, visible: false }));
  };

  // Auth Required Modal & Registration State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authPhone, setAuthPhone] = useState('');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authConfirmPassword, setAuthConfirmPassword] = useState('');
  const [authPromo, setAuthPromo] = useState('');
  const [authShowPassword, setAuthShowPassword] = useState(false);
  const [authShowConfirmPassword, setAuthShowConfirmPassword] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);

  // OTP Modal State
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '']);
  const [otpTimer, setOtpTimer] = useState(60);
  const [otpLoading, setOtpLoading] = useState(false);
  const otpInputRefs = useRef([]);

  const checkGuestAuth = (actionCallback) => {
    if (isGuestUser) {
      AsyncStorage.getItem('pending_referral_promo').then(savedPromo => {
        if (savedPromo) setAuthPromo(savedPromo);
      }).catch(() => {});
      setIsAuthModalOpen(true);
      return false;
    }
    if (actionCallback) actionCallback();
    return true;
  };
  
  const [realStats, setRealStats] = useState({ logic: 0, speedTime: '0.0', accuracy: 0 });
  const [battleBestStats, setBattleBestStats] = useState({ victories: 0, bestStreak: 0, fastestTime: '0.0' });
  const [activityHistory, setActivityHistory] = useState([]);

  // Referral, Cashback & Mystery Box Modals
  const [isReferralModalOpen, setIsReferralModalOpen] = useState(false);
  const [isMysteryBoxModalOpen, setIsMysteryBoxModalOpen] = useState(false);
  const [isShopModalOpen, setIsShopModalOpen] = useState(false);
  const [activeShopTab, setActiveShopTab] = useState('inventory'); // 'inventory' | 'energy' | 'mystery'
  const [activeSkinCategory, setActiveSkinCategory] = useState('headwear'); // 'headwear' | 'top' | 'pants' | 'shoes' | 'accessories' | 'backpacks'
  const [shopItems, setShopItems] = useState([]);

  // Shop Purchase Animation state
  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState(null);

  const triggerPurchaseAnimation = (item, targetLocation) => {
    setPurchaseSuccessItem({ ...item, targetLocation });
  };

  const closePurchaseOverlay = () => {
    setPurchaseSuccessItem(null);
  };

  const [backendSkins, setBackendSkins] = useState([]);
  const [skinPurchaseAlertItem, setSkinPurchaseAlertItem] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/shop-items`)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setShopItems(data);
      })
      .catch(err => console.log('Shop items fetch err:', err));

    const fetchInventorySkins = () => {
      fetch(`${API_URL}/inventory-skins`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) setBackendSkins(data);
        })
        .catch(err => console.log('Inventory skins fetch err:', err));
    };
    fetchInventorySkins();

    const skinSub = DeviceEventEmitter.addListener('inventory_skins_updated', fetchInventorySkins);
    return () => skinSub.remove();
  }, []);
  const [myPromoCode, setMyPromoCode] = useState(user?.customId ? `IQ-${user.customId}` : 'IQROMAX2026');
  const [promoChangeCount, setPromoChangeCount] = useState(0);
  const [newPromoInput, setNewPromoInput] = useState('');
  const [isEditingPromo, setIsEditingPromo] = useState(false);
  const [mysteryKeysCount, setMysteryKeysCount] = useState(1); // 1 free box for new user
  const [potentialCashback, setPotentialCashback] = useState(0);
  const [realCashback, setRealCashback] = useState(0);
  const [isOpeningBox, setIsOpeningBox] = useState(false);
  const [boxReward, setBoxReward] = useState(null);

  useFocusEffect(
    useCallback(() => {
      import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
        const userIdKey = user?.customId || user?.id || 'guest';
        AsyncStorage.getItem(`user_game_stats_${userIdKey}`).then(val => {
          if (val) {
            const parsed = JSON.parse(val);
            setRealStats({
              logic: parsed.logic !== undefined ? parsed.logic : 0,
              speedTime: parsed.speedTime !== undefined ? parsed.speedTime : '0.0',
              accuracy: parsed.accuracy !== undefined ? parsed.accuracy : 0
            });
          } else {
            setRealStats({ logic: 0, speedTime: '0.0', accuracy: 0 });
          }
        }).catch(e => console.log(e));

        AsyncStorage.getItem(`user_mystery_keys_count_${userIdKey}`).then(kVal => {
          if (kVal !== null) {
            setMysteryKeysCount(parseInt(kVal, 10));
          }
        }).catch(e => console.log(e));

        AsyncStorage.getItem(`user_battle_stats_${userIdKey}`).then(bVal => {
          if (bVal) {
            const parsed = JSON.parse(bVal);
            setBattleBestStats({
              victories: parsed.victories || 0,
              bestStreak: parsed.bestStreak || 0,
              fastestTime: parsed.fastestTime || '0.0'
            });
          } else {
            setBattleBestStats({ victories: 0, bestStreak: 0, fastestTime: '0.0' });
          }
        }).catch(e => console.log(e));

        AsyncStorage.getItem(`user_activity_history_${userIdKey}`).then(histVal => {
          if (histVal) {
            setActivityHistory(JSON.parse(histVal).slice(0, 3));
          } else {
            AsyncStorage.getItem('user_activity_history').then(globalHist => {
              if (globalHist) {
                setActivityHistory(JSON.parse(globalHist).slice(0, 3));
              } else {
                setActivityHistory([]);
              }
            }).catch(e => console.log(e));
          }
        }).catch(e => console.log(e));

        AsyncStorage.getItem('user_data').then(uDataStr => {
          if (uDataStr) {
            const parsedUserData = JSON.parse(uDataStr);
            if (parsedUserData.coin !== undefined) setUserCoin(parsedUserData.coin);
            if (parsedUserData.xp !== undefined) setUserXp(parsedUserData.xp);
          }
        }).catch(e => console.log(e));
      });
    }, [user?.customId, user?.id, route.params])
  );



  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('user_data_updated', () => {
      AsyncStorage.getItem('user_data').then(uDataStr => {
        if (uDataStr) {
          const parsedUserData = JSON.parse(uDataStr);
          if (parsedUserData.coin !== undefined) setUserCoin(parsedUserData.coin);
          if (parsedUserData.xp !== undefined) setUserXp(parsedUserData.xp);
        }
      }).catch(e => console.log(e));
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const userRankInfo = calculateUserRank(userXp);

  useEffect(() => {
    if (activeTab === 'ranking') {
      const fetchRanking = async () => {
        try {
          const res = await fetch(`${API_URL}/ranking?t=${Date.now()}`);
          if (res.ok) {
            const data = await res.json();
            // Alert.alert('Debug Data', JSON.stringify(data)); // Commented out to prevent annoyance if it works, but let's actually show it once
            if (Array.isArray(data)) {
              if (data.length === 0) {
                Alert.alert('Ogohlantirish', 'Backend bo\'sh ro\'yxat qaytardi!');
              }
              const rankedData = data.map((u, index) => ({
                customId: u.id,
                rank: index + 1,
                name: u.name || '---',
                xp: u.xp || 0,
                avatar: u.avatar && u.avatar.startsWith('http') ? { uri: u.avatar } : getAvatarByName(u.avatar)
              }));
              setLeaderboardData(rankedData);
            } else {
              Alert.alert('Xatolik', 'Data array emas: ' + JSON.stringify(data));
            }
          } else {
            Alert.alert('Xatolik', 'Server xatosi: ' + res.status);
          }
        } catch (e) {
          Alert.alert('Fetch Xatolik', e.message || 'Noma\'lum xato');
          console.error('Fetch ranking error:', e);
        }
      };
      fetchRanking();
    }
  }, [activeTab]);

  const filteredLeaderboard = leaderboardData.filter(item => {
    const q = leaderboardSearch.trim().toLowerCase();
    if (!q) return true;
    const nameMatch = item.name.toLowerCase().includes(q);
    const xpMatch = item.xp.toString().includes(q);
    return nameMatch || xpMatch;
  });

  const t = DASHBOARD_TRANSLATIONS[language] || DASHBOARD_TRANSLATIONS['en'];
  const mt = MYSTERY_TRANSLATIONS[language] || MYSTERY_TRANSLATIONS['uz'];
  const ext = EXERCISE_TYPES_TRANSLATIONS[language] || EXERCISE_TYPES_TRANSLATIONS['en'];
  const coinText = COIN_TRANSLATIONS[language] || COIN_TRANSLATIONS['en'];
  const energyText = ENERGY_TRANSLATIONS[language] || ENERGY_TRANSLATIONS['uz'];

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
  const [activeExerciseType, setActiveExerciseType] = useState(route.params?.initialExerciseType || 'abacus');

  const [isPersonajOpen, setIsPersonajOpen] = useState(false);
  const [isSkinlarOpen, setIsSkinlarOpen] = useState(false);

  const togglePersonajAccordion = () => {
    if (!checkGuestAuth()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsPersonajOpen(prev => {
      if (!prev) setIsSkinlarOpen(false);
      return !prev;
    });
  };

  const toggleSkinlarAccordion = () => {
    if (!checkGuestAuth()) return;
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsSkinlarOpen(prev => {
      if (!prev) setIsPersonajOpen(false);
      return !prev;
    });
  };

  const updateCharacterOnServer = async (index) => {
    const charNames = {
      0: 'alex',
      1: 'maks',
      2: 'david',
      3: 'kevin',
      4: 'lily',
      5: 'maya',
      6: 'emma',
      7: 'sophia'
    };
    const characterName = charNames[index] || 'maks';
    
    // Update local user state immediately
    setUser(prev => {
      const updated = { ...prev, character: characterName };
      import('@react-native-async-storage/async-storage').then(({ default: AsyncStorage }) => {
         AsyncStorage.setItem('user_data', JSON.stringify(updated)).catch(e => console.log(e));
      });
      return updated;
    });

    if (user?.customId || route.params?.user?.customId) {
      const customId = user?.customId || route.params?.user?.customId;
      try {
        await fetch(`${API_URL}/user/character`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ customId, character: characterName })
        });
      } catch (err) {
        console.log('Error updating character on server', err);
      }
    }
  };
  
  useFocusEffect(
    useCallback(() => {
      const loadUser = async () => {
        try {
          const dataStr = await AsyncStorage.getItem('user_data');
          if (dataStr) {
            const localUser = JSON.parse(dataStr);
            setUser(localUser);
            if (localUser.coin !== undefined) setUserCoin(localUser.coin);
            if (localUser.xp !== undefined) setUserXp(localUser.xp);
            
            // Sync with backend to get latest XP and stats by fetching ranking
            fetch(`${API_URL}/ranking?t=${Date.now()}`)
              .then(res => res.json())
              .then(data => {
                if (Array.isArray(data)) {
                  const me = data.find(u => {
                    if (!u.id || !localUser.customId) return false;
                    const rankId = String(u.id).replace(/^#+/, '').trim().toUpperCase();
                    const myId = String(localUser.customId).replace(/^#+/, '').trim().toUpperCase();
                    return rankId === myId;
                  });
                  if (me) {
                    setUserXp(me.xp);
                    setUser(prev => {
                      const updated = { ...prev, xp: me.xp, isGuest: false };
                      AsyncStorage.setItem('user_data', JSON.stringify(updated)).catch(e => console.log(e));
                      return updated;
                    });
                  }
                }
              })
              .catch(err => {
                console.log('Error syncing user from ranking', err);
              });
          }
        } catch (e) {
          console.log('Error reloading user data', e);
        }
      };
      loadUser();
    }, [])
  );

  const [isNotifModalOpen, setIsNotifModalOpen] = useState(false);
  const [notificationsList, setNotificationsList] = useState([]);
  const dismissedNotifsRef = useRef(new Set());

  const loadNotifications = async () => {
    try {
      const stored = await AsyncStorage.getItem('user_notifications');
      const localList = stored ? JSON.parse(stored) : [];
      
      let serverList = [];
      if (user?.customId) {
        try {
          let cleanId = String(user.customId).trim();
          if (!cleanId.startsWith('#')) cleanId = '#' + cleanId;
          const encodedId = encodeURIComponent(cleanId);
          const res = await fetch(`${API_URL}/notifications/${encodedId}`);
          if (res.ok) {
            const text = await res.text();
            if (text && text.trim().startsWith('[')) {
              serverList = JSON.parse(text);
            }
          }
        } catch (err) {
          // Ignore server fetch error silently and fall back to local notifications
        }
      }
      
      const merged = [...localList];
      serverList.forEach(sn => {
        if (!merged.some(ln => ln.id === sn.id) && !dismissedNotifsRef.current.has(sn.id)) {
          merged.push(sn);
        }
      });
      setNotificationsList(merged);
    } catch (e) {
      // Silently fall back if storage fails
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 4000);
    return () => clearInterval(interval);
  }, [user?.customId]);

  const handleNotifRespond = async (notif, status) => {
    // Optimistic UI update: remove immediately
    dismissedNotifsRef.current.add(notif.id);
    const updatedList = notificationsList.filter(n => n.id !== notif.id);
    setNotificationsList(updatedList);
    AsyncStorage.setItem('user_notifications', JSON.stringify(updatedList)).catch(() => {});

    try {
      if (notif.type === 'BATTLE_INVITE') {
        const socket = io(SOCKET_URL, { 
          path: '/api/socket.io',
          transports: ['websocket'] 
        });
        socket.emit('respond_battle_invite', {
          notifId: notif.id,
          status,
          targetName: user?.name || "Do'stingiz",
          targetAvatar: user?.avatar || null
        });
      } else {
        await fetch(`${API_URL}/notifications/${notif.id}/respond`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status })
        });
      }

      if (status === 'ACCEPTED' && notif.type === 'BATTLE_INVITE') {
        setIsNotifModalOpen(false);
        navigation.navigate('BattleMatchmaking', { mode: 'dost', inviteData: notif });
      }
    } catch (e) {
      console.error('Notif respond error:', e);
    }
  };

  // Real-time socket logic for battle invites and updates
  useEffect(() => {
    if (!user?.id) return;
    
    // Connect to backend socket
    const socket = io(SOCKET_URL, { 
      path: '/api/socket.io',
      transports: ['websocket'] 
    });
    
    // Register user to receive targeted messages
    if (user.customId) {
      socket.emit('register', user.customId);
    }

    socket.on('user_updated', (data) => {
      if (String(data.id) === String(user?.id) || (data.customId && user?.customId && String(data.customId).toUpperCase() === String(user.customId).toUpperCase())) {
        setUser(data);
      }
      
      setLeaderboardData(prev => {
        if (!prev || prev.length === 0) return prev;
        return prev.map(u => {
          if (data.customId && u.customId && String(u.customId).toUpperCase() === String(data.customId).toUpperCase()) {
            return {
              ...u,
              name: data.name || u.name,
              avatar: data.character ? getAvatarByName(data.character) : u.avatar
            };
          }
          return u;
        });
      });
    });

    socket.on('user_xp_updated', async (data) => {
      if (user?.customId && String(data.customId).toUpperCase() === String(user.customId).toUpperCase()) {
        setUser(prev => {
          const updated = { ...prev, xp: data.xp };
          AsyncStorage.setItem('user_data', JSON.stringify(updated)).catch(console.error);
          return updated;
        });
      }
      
      setLeaderboardData(prev => {
        if (!prev || prev.length === 0) return prev;
        const newData = prev.map(u => 
          (String(u.customId).toUpperCase() === String(data.customId).toUpperCase()) ? { ...u, xp: data.xp } : u
        ).sort((a, b) => b.xp - a.xp);
        
        // Re-assign ranks after sorting
        return newData.map((u, index) => ({ ...u, rank: index + 1 }));
      });
    });

    socket.on('user_deleted', (data) => {
      setLeaderboardData(prev => {
        if (!prev || prev.length === 0) return prev;
        
        const newData = prev.filter(u => {
          const userIdentifier = u.id || u.customId;
          if (!userIdentifier || !data.customId) return String(userIdentifier) !== String(data.customId);
          return String(userIdentifier).replace(/^#+/, '').trim().toUpperCase() !== String(data.customId).replace(/^#+/, '').trim().toUpperCase();
        });
        
        return newData.map((u, index) => ({ ...u, rank: index + 1 }));
      });
    });

    
    socket.on('shop_item_updated', (newItem) => {
      setShopItems(prev => {
        const exists = prev.some(i => i.id === newItem.id);
        if (exists) return prev.map(i => i.id === newItem.id ? newItem : i);
        return [newItem, ...prev];
      });
    });

    socket.on('shop_item_deleted', (deletedId) => {
      setShopItems(prev => prev.filter(i => i.id !== deletedId));
    });

    socket.on('inventory_skin_created', (newSkin) => {
      setBackendSkins(prev => {
        const exists = prev.some(s => s.id === newSkin.id);
        if (exists) return prev.map(s => s.id === newSkin.id ? newSkin : s);
        return [newSkin, ...prev];
      });
    });

    socket.on('inventory_skins_updated', (skin) => {
      setBackendSkins(prev => {
        const exists = prev.some(s => s.id === skin.id);
        if (exists) return prev.map(s => s.id === skin.id ? skin : s);
        return [skin, ...prev];
      });
    });

    socket.on('inventory_skin_deleted', (deletedId) => {
      setBackendSkins(prev => prev.filter(s => s.id !== deletedId));
    });

    return () => {
      socket.disconnect();
    };
  }, [user?.id, user?.customId]);

  useEffect(() => {
    if (route.params?.initialTab) {
      setActiveTab(route.params.initialTab);
    }
    if (route.params?.initialExerciseType) {
      setActiveExerciseType(route.params.initialExerciseType);
    }
  }, [route.params]);
  const [isExamplesPickerOpen, setIsExamplesPickerOpen] = useState(false);
  const [selectedExamples, setSelectedExamples] = useState(15);
  const [selectedOperation, setSelectedOperation] = useState('oddiy');
  const exampleNumbers = [2, ...Array.from({ length: 19 }, (_, i) => i + 7)];
  const speedExampleNumbers = [2, 5, 10];
  
  const [isSpeedPickerOpen, setIsSpeedPickerOpen] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(1);
  const [isDigitsPickerOpen, setIsDigitsPickerOpen] = useState(false);
  const [selectedDigits, setSelectedDigits] = useState(1);
  const speedOptions = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.5, 2, 2.5, 3];

  const [abacusDifficulty, setAbacusDifficulty] = useState('orta');
  const [abacusExamplesCount, setAbacusExamplesCount] = useState(30);
  const [abacusOperations, setAbacusOperations] = useState(['add']);

  const [speedSecExamples, setSpeedSecExamples] = useState(15);
  const [isSpeedSecExamplesOpen, setIsSpeedSecExamplesOpen] = useState(false);
  const [speedSecTime, setSpeedSecTime] = useState(1.0);
  const [isSpeedSecTimeOpen, setIsSpeedSecTimeOpen] = useState(false);
  const [speedSecOperation, setSpeedSecOperation] = useState('kopaytirish');
  const [speedSecDigits, setSpeedSecDigits] = useState(1);
  const [isSpeedSecDigitsOpen, setIsSpeedSecDigitsOpen] = useState(false);
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
    // Disabled infinite pulseAnim loop to fix severe Android lag
  }, [pulseAnim]);

  const borderColorInterp = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(31, 31, 61, 1)', 'rgba(168, 85, 247, 1)'], // Pulses from dark border to bright purple
  });

  const [inventorySubTab, setInventorySubTab] = useState('personaj'); // 'personaj', 'avatar', 'ramka', 'fon'
  const [activeRamkaFilter, setActiveRamkaFilter] = useState('BARCHASI');

  // Count-up animation for Level 24
  const [levelNumber, setLevelNumber] = useState(0);
  useEffect(() => {
    let current = 0;
    const target = userRankInfo?.levelNumber || 1;
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
  }, [userRankInfo?.levelNumber]);

  const framesData = [
    { id: 1, name: 'Ramka 1', rarity: 'EPIC', color: '#A855F7', state: 'AKTIV', image: require('../assets/ramka1.png') },
    { id: 2, name: 'Ramka 2', rarity: 'EPIC', color: '#A855F7', state: 'KIYISH', image: require('../assets/ramka2.png') },
    { id: 3, name: 'Ramka 3', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/ramka3.png') },
    { id: 4, name: 'Ramka 4', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/ramka4.png') },
  ];

  const [activeFonFilter, setActiveFonFilter] = useState('BARCHASI');

  const fonData = [
    { id: 1, name: 'Neon City', rarity: 'EPIC', color: '#A855F7', state: 'AKTIV', image: require('../assets/dashboard_bg_new.jpg') },
    { id: 2, name: 'Cosmic Space', rarity: 'EPIC', color: '#A855F7', state: 'KIYISH', image: require('../assets/space_bg.jpg') },
    { id: 3, name: 'Aurora Sky', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/dashboard_bg.jpg') },
    { id: 4, name: 'Sunset Beach', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/character_bg.png') },
    { id: 5, name: 'Cyber Grid', rarity: 'EPIC', color: '#A855F7', state: 'KIYISH', image: require('../assets/character_bg.png') },
    { id: 6, name: 'Frozen World', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/character_bg.png') },
    { id: 7, name: 'Mystic Forest', rarity: 'RARE', color: '#3B82F6', state: 'KIYISH', image: require('../assets/character_bg.png') },
    { id: 8, name: 'Golden Palace', rarity: 'LEGENDARY', color: '#EAB308', state: 'BUY', price: '10 000', image: require('../assets/character_bg.png') },
    { id: 9, name: 'Dragon Realm', rarity: 'LEGENDARY', color: '#EAB308', state: 'BUY', price: '15 000', image: require('../assets/character_bg.png') },
    { id: 10, name: 'Dark Matter', rarity: 'EPIC', color: '#A855F7', state: 'BUY', price: '9 000', image: require('../assets/character_bg.png') },
  ];

  const [kiyimKategoriya, setKiyimKategoriya] = useState('bosh_kiyim');
  const [activeKiyimFilter, setActiveKiyimFilter] = useState('BARCHASI');

  const kiyimData = [];

  const renderFramesGrid = () => {
    const filteredData = activeRamkaFilter === 'BARCHASI' ? framesData : framesData.filter(item => item.rarity === activeRamkaFilter);
    return filteredData.map((item, i) => {
      return (
        <View key={item.id} style={{ width: '18%', aspectRatio: 0.75, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: item.state === 'AKTIV' ? '#EAB308' : 'rgba(255,255,255,0.08)', marginBottom: 12, padding: 8, paddingBottom: 10, alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {item.state === 'AKTIV' && (
             <View style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#EAB308', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
               <MaterialCommunityIcons name="check" size={10} color="#000" />
             </View>
          )}
          <Image source={item.image} style={{ width: '80%', height: '50%', marginTop: 5 }} contentFit="contain" />
          <View style={{ alignItems: 'center', width: '100%', marginTop: 2, marginBottom: 2 }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 8, textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{item.name}</Text>
            <Text style={{ color: item.color, fontFamily: 'Inter_700Bold', fontSize: 7, marginBottom: 6 }}>{item.rarity}</Text>
            
            {item.state === 'AKTIV' && (
              <View style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <MaterialCommunityIcons name="check-circle" size={10} color="#EAB308" style={{ marginRight: 4 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>AKTIV</Text>
              </View>
            )}
            {item.state === 'KIYISH' && (
              <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 4, width: '100%', alignItems: 'center' }}>
                 <Text style={{ color: '#60A5FA', fontFamily: 'Inter_700Bold', fontSize: 8 }}>KIYISH</Text>
              </TouchableOpacity>
            )}
            {item.state === 'BUY' && (
              <TouchableOpacity style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={require('../assets/s_coin.png')} style={{ width: 10, height: 10, marginRight: 3 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>{item.price}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      )
    });
  };

  const renderRamkaScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#05050C' }}>

        <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginTop: 10, height: 260 }}>


          <ImageBackground source={require('../assets/character_bg.png')} style={{ flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 16, overflow: 'hidden', marginHorizontal: 10, marginVertical: 5 }} imageStyle={{ borderRadius: 16, transform: [{ translateY: -40 }, { scale: 1.1 }] }}>
            <View style={{ width: 160, height: 160, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
               <Image source={require('../assets/avatar_maks.png')} style={{ width: 110, height: 110, borderRadius: 55 }} />
               <Image source={require('../assets/gold_frame.png')} style={{ position: 'absolute', width: 160, height: 160 }} contentFit="contain" />
               <View style={{ position: 'absolute', bottom: -20, width: 180, height: 40, borderRadius: 90, borderWidth: 1, borderColor: '#3B82F6', transform: [{ scaleY: 0.3 }], shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.8, shadowRadius: 10 }} />
               <View style={{ position: 'absolute', bottom: -20, width: 140, height: 30, borderRadius: 70, borderWidth: 2, borderColor: '#60A5FA', transform: [{ scaleY: 0.3 }], shadowColor: '#60A5FA', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15 }} />
            </View>
            <View style={{ marginTop: 20, alignItems: 'center' }}>
              <View style={{ backgroundColor: 'rgba(168,85,247,0.2)', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 4, marginBottom: 5 }}>
                <Text style={{ color: '#A855F7', fontFamily: 'Inter_700Bold', fontSize: 9 }}>EPIC</Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 16, marginBottom: 5 }}>Tech Frame</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <MaterialCommunityIcons name="check-circle" size={12} color="#EAB308" style={{ marginRight: 4 }} />
                <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 10 }}>AKTIV</Text>
              </View>
            </View>
          </ImageBackground>


        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 20 }} />

        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
              {[
                { id: 'BARCHASI', label: 'BARCHASI', icon: 'view-grid', color: '#FFFFFF' },
                { id: 'ODDIY', label: 'ODDIY', icon: 'circle-small', color: '#10B981' },
                { id: 'RARE', label: 'RARE', icon: 'diamond', color: '#3B82F6' },
                { id: 'EPIC', label: 'EPIC', icon: 'diamond', color: '#A855F7' },
                { id: 'LEGENDARY', label: 'LEGENDARY', icon: 'crown', color: '#EAB308' }
              ].map(filter => {
                const isActive = activeRamkaFilter === filter.id;
                return (
                  <TouchableOpacity 
                    key={filter.id}
                    onPress={() => setActiveRamkaFilter(filter.id)}
                    style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 8, borderWidth: 1, borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)' }}
                  >
                    {filter.icon === 'circle-small' ? (
                      <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: filter.color, marginRight: 6 }} />
                    ) : (
                      <MaterialCommunityIcons name={filter.icon} size={filter.icon === 'crown' ? 12 : filter.icon === 'view-grid' ? 14 : 10} color={filter.color} style={{ marginRight: 6 }} />
                    )}
                    <Text style={{ color: isActive ? '#FFFFFF' : '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>{filter.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
              <MaterialCommunityIcons name="filter-variant" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '2.5%' }}>
               {renderFramesGrid()}
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const renderKiyimGrid = () => {
    const combinedSkins = [...backendSkins, ...kiyimData];
    let filteredByCategory = combinedSkins.filter(item => item.category === kiyimKategoriya);
    const filteredData = activeKiyimFilter === 'BARCHASI' ? filteredByCategory : filteredByCategory.filter(item => item.rarity === activeKiyimFilter);

    if (filteredData.length === 0) {
      return (
        <View style={{ width: '100%', paddingVertical: 40, alignItems: 'center', justifyContent: 'center' }}>
          <MaterialCommunityIcons name="tshirt-crew-outline" size={32} color="rgba(255,255,255,0.2)" />
          <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 11, marginTop: 8 }}>
            Ushbu bo'limda skinlar yo'q
          </Text>
        </View>
      );
    }

    return filteredData.map((item, i) => {
      const rarityColor = item.rarity === 'LEGENDARY' ? '#EAB308' : item.rarity === 'EPIC' ? '#A855F7' : item.rarity === 'RARE' ? '#3B82F6' : '#10B981';
      
      const isPricedOrLocked = Boolean(item.isLocked || (item.price && Number(item.price) > 0));
      
      // Determine if item is equipped
      const itemGlb = item.modelUrl || item.glbModel || item.model;
      let currentItemState = item.state || 'KIYISH';

      if (item.category === 'bosh_kiyim') {
        if (itemGlb && equippedHeadwear === itemGlb) {
          currentItemState = 'KIYILGAN';
        } else if (equippedHeadwear && currentItemState === 'KIYILGAN') {
          currentItemState = 'KIYISH';
        }
      } else if (item.category === 'aksessuar') {
        if (itemGlb && equippedAccessory === itemGlb) {
          currentItemState = 'KIYILGAN';
        } else if (equippedAccessory && currentItemState === 'KIYILGAN') {
          currentItemState = 'KIYISH';
        }
      }

      const imgSrc = item.imageUrl ? { uri: item.imageUrl.startsWith('http') ? item.imageUrl : `${API_URL}${item.imageUrl.replace('/api', '')}` } : (item.image || require('../assets/yangi_1.png'));

      const handleSkinPress = () => {
        if (isPricedOrLocked) {
          setSkinPurchaseAlertItem(item);
        } else {
          handleEquip();
        }
      };

      const handleEquip = () => {
        if (isPricedOrLocked) {
          setSkinPurchaseAlertItem(item);
          return;
        }

        if (item.category === 'bosh_kiyim') {
          setEquippedHeadwears(prev => {
            const current = prev[activeAvatarIndex];
            if (current === itemGlb) {
              const updated = { ...prev };
              delete updated[activeAvatarIndex];
              return updated;
            }
            return { ...prev, [activeAvatarIndex]: itemGlb };
          });
        } else if (item.category === 'aksessuar') {
          setEquippedAccessories(prev => {
            const current = prev[activeAvatarIndex];
            if (current === itemGlb) {
              const updated = { ...prev };
              delete updated[activeAvatarIndex];
              return updated;
            }
            return { ...prev, [activeAvatarIndex]: itemGlb };
          });
        }
      };

      return (
        <TouchableOpacity 
          key={item.id || i} 
          activeOpacity={0.8}
          onPress={handleSkinPress}
          style={{ width: '22%', aspectRatio: 0.55, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: currentItemState === 'KIYILGAN' ? '#EAB308' : 'rgba(255,255,255,0.08)', marginBottom: 12, padding: 6, alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}
        >
          {currentItemState === 'KIYILGAN' ? (
             <View style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#EAB308', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
               <MaterialCommunityIcons name="check" size={10} color="#000" />
             </View>
          ) : null}
          {isPricedOrLocked ? (
             <View style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#1F2937', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
               <MaterialCommunityIcons name="lock" size={8} color="#FFFFFF" />
             </View>
          ) : null}
          <Image source={imgSrc} style={{ width: '85%', height: '50%', borderRadius: 6, marginTop: 6 }} contentFit="contain" />
          <View style={{ alignItems: 'center', width: '100%', marginTop: 6, marginBottom: 2 }}>
            <Text style={{ color: isPricedOrLocked ? '#9CA3AF' : '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 8, textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{String(item.name || '')}</Text>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 6 }}>
              <Text style={{ color: rarityColor, fontFamily: 'Inter_700Bold', fontSize: 7 }}>{item.rarity || 'ODDIY'}</Text>
            </View>
            
            {currentItemState === 'KIYILGAN' ? (
              <TouchableOpacity onPress={handleEquip} style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <MaterialCommunityIcons name="check-circle" size={10} color="#EAB308" style={{ marginRight: 4 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>KIYILGAN</Text>
              </TouchableOpacity>
            ) : isPricedOrLocked ? (
              <TouchableOpacity onPress={handleSkinPress} style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={require('../assets/s_coin.png')} style={{ width: 10, height: 10, marginRight: 3 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>{String(item.price || 'BUY')}</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={handleEquip} style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', alignItems: 'center' }}>
                 <Text style={{ color: '#3B82F6', fontFamily: 'Inter_700Bold', fontSize: 8 }}>KIYISH</Text>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    });
  };

  const renderKiyimScreen = () => {
    const headerTexts = {
      'bosh_kiyim': { title: 'BOSH KIYIM', subtitle: 'Personajingiz uchun bosh kiyim tanlang' },
      'ustki_kiyim': { title: 'KIYIM-KECHAK', subtitle: 'Personajingiz uslubini tanlang' },
      'shim': { title: 'SHIM', subtitle: 'O\'zingizga mos shim tanlang' },
      'oyoq_kiyim': { title: 'OYOQ KIYIM', subtitle: 'Qulay poyabzal tanlang' },
      'aksessuar': { title: 'AKSESSUAR', subtitle: 'Personajingizni bezang' },
      'ryukzak': { title: 'RYUKZAK', subtitle: 'Orqa sumkangizni tanlang' }
    };
    const currentHeader = headerTexts[kiyimKategoriya] || headerTexts['ustki_kiyim'];

    return (
      <View style={{ flex: 1, backgroundColor: '#05050C' }}>
        
        {/* Top Section (Showcase & Categories) */}
        <View style={{ paddingHorizontal: 15, height: 420, marginTop: Platform.OS === 'android' ? StatusBar.currentHeight + 4 : 8 }}>
          {/* Main Background Image for the whole top section */}
          <View style={{ position: 'absolute', top: 0, left: 15, right: 15, bottom: 0, borderRadius: 20, overflow: 'hidden' }}>
            <Image 
              source={require('../assets/dashboard_bg_new.jpg')} 
              style={{ width: '100%', height: '100%' }} 
              contentFit="cover" 
            />
          </View>
          
          <View style={{ flexDirection: 'row', flex: 1, zIndex: 1, paddingVertical: 10 }}>
            {/* Left Column: Vertical Categories */}
            <View style={{ width: 95, justifyContent: 'flex-start', gap: 6 }}>
              {[
                { key: 'bosh_kiyim', label: 'BOSH KIYIM', icon: 'crown' },
                { key: 'ustki_kiyim', label: 'USTKI KIYIM', icon: 'tshirt-crew' },
                { key: 'shim', label: 'SHIM', icon: 'human-handsdown' },
                { key: 'oyoq_kiyim', label: 'OYOQ KIYIM', icon: 'shoe-sneaker' },
                { key: 'aksessuar', label: 'AKSESSUAR', icon: 'glasses' },
                { key: 'ryukzak', label: 'RYUKZAK', icon: 'bag-personal' },
              ].map((item) => {
                const isActive = kiyimKategoriya === item.key;
                return (
                  <TouchableOpacity
                    key={item.key}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 12,
                      paddingHorizontal: 8,
                      borderRadius: 12,
                      backgroundColor: isActive ? 'rgba(217, 119, 6, 0.4)' : 'rgba(15,17,30,0.6)',
                      borderWidth: 1,
                      borderColor: isActive ? '#D97706' : 'rgba(255,255,255,0.1)',
                      position: 'relative',
                    }}
                    onPress={() => setKiyimKategoriya(item.key)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name={item.icon} size={14} color={isActive ? '#F59E0B' : '#9CA3AF'} style={{ marginRight: 6 }} />
                    <Text style={{ color: isActive ? '#F59E0B' : '#9CA3AF', fontFamily: 'Inter_700Bold', fontSize: 8 }}>
                      {item.label}
                    </Text>
                    {isActive && (
                      <View style={{ position: 'absolute', right: -6, width: 0, height: 0, borderTopWidth: 6, borderBottomWidth: 6, borderLeftWidth: 6, borderTopColor: 'transparent', borderBottomColor: 'transparent', borderLeftColor: '#F59E0B' }} />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Center Column: Showcase */}
            <View style={{ flex: 1, marginHorizontal: 10, position: 'relative' }}>
              <View style={{ position: 'absolute', top: 0, bottom: -20, left: 0, right: 0, zIndex: 2 }} pointerEvents="box-none">
                <Canvas frameloop="demand" style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="auto" gl={{ alpha: true }}>
                  <ambientLight intensity={2} color="#ffffff" />
                  <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#000000" />
                  <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                  <directionalLight position={[-10, 10, -5]} intensity={1} color="#ffffff" />
                  <Suspense fallback={null}>
                    <CharacterModel characterIndex={activeAvatarIndex} accessoryPath={equippedAccessory} headwearPath={equippedHeadwear} yOffset={0.5} />
                  </Suspense>
                </Canvas>
              </View>
              <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center' }}>
                <View style={{ width: 120, height: 30, borderRadius: 60, borderWidth: 2, borderColor: '#3B82F6', transform: [{ scaleY: 0.3 }], shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15 }} />
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 15 }} />

        {/* Filter Section */}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
              {[
                { id: 'BARCHASI', label: 'BARCHASI', color: '#EAB308' },
                { id: 'ODDIY', label: 'ODDIY', color: '#10B981' },
                { id: 'RARE', label: 'RARE', color: '#3B82F6' },
                { id: 'EPIC', label: 'EPIC', color: '#A855F7' },
                { id: 'LEGENDARY', label: 'LEGENDARY', color: '#EAB308' }
              ].map(filter => {
                const isActive = activeKiyimFilter === filter.id;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => setActiveKiyimFilter(filter.id)}
                    style={{
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                      borderWidth: 1,
                      borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'
                    }}
                  >
                    <Text style={{ color: isActive ? filter.color : '#9CA3AF', fontFamily: 'Inter_700Bold', fontSize: 10 }}>{filter.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
              <MaterialCommunityIcons name="filter-variant" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Grid View */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '4%' }}>
               {renderKiyimGrid()}
            </View>
          </ScrollView>
        </View>

      </View>
    );
  };

  const renderFonGrid = () => {
    const filteredData = activeFonFilter === 'BARCHASI' ? fonData : fonData.filter(item => item.rarity === activeFonFilter);
    return filteredData.map((item, i) => {
      return (
        <View key={item.id} style={{ width: '18%', aspectRatio: 0.55, backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: 10, borderWidth: 1, borderColor: item.state === 'AKTIV' ? '#EAB308' : 'rgba(255,255,255,0.08)', marginBottom: 12, padding: 6, alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
          {item.state === 'AKTIV' && (
             <View style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#EAB308', justifyContent: 'center', alignItems: 'center', zIndex: 2 }}>
               <MaterialCommunityIcons name="check" size={10} color="#000" />
             </View>
          )}
          <Image source={item.image} style={{ width: '100%', height: '55%', borderRadius: 6, marginTop: 2 }} contentFit="cover" />
          <View style={{ alignItems: 'center', width: '100%', marginTop: 6, marginBottom: 2 }}>
            <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 8, textAlign: 'center', marginBottom: 2 }} numberOfLines={1}>{item.name}</Text>
            <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, marginBottom: 6 }}>
              <Text style={{ color: item.color, fontFamily: 'Inter_700Bold', fontSize: 7 }}>{item.rarity}</Text>
            </View>
            
            {item.state === 'AKTIV' && (
              <View style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <MaterialCommunityIcons name="check-circle" size={10} color="#EAB308" style={{ marginRight: 4 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>AKTIV</Text>
              </View>
            )}
            {item.state === 'KIYISH' && (
              <TouchableOpacity style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', alignItems: 'center' }}>
                 <Text style={{ color: '#60A5FA', fontFamily: 'Inter_700Bold', fontSize: 8 }}>KIYISH</Text>
              </TouchableOpacity>
            )}
            {item.state === 'BUY' && (
              <TouchableOpacity style={{ backgroundColor: 'rgba(234,179,8,0.15)', paddingHorizontal: 4, paddingVertical: 4, borderRadius: 4, width: '100%', flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                 <Image source={require('../assets/s_coin.png')} style={{ width: 10, height: 10, marginRight: 3 }} />
                 <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>{item.price}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      );
    });
  };

  const renderFonScreen = () => {
    return (
      <View style={{ flex: 1, backgroundColor: '#05050C' }}>
        
        {/* Top Section */}
        <View style={{ flexDirection: 'row', paddingHorizontal: 15, marginTop: 10, height: 350 }}>
          
          {/* Center Column: Showcase */}
          <View style={{ flex: 1, marginHorizontal: 0, borderRadius: 16, overflow: 'hidden', position: 'relative', borderWidth: 1, borderColor: '#3B82F6' }}>
            <Image 
              source={require('../assets/dashboard_bg_new.jpg')} 
              style={{ position: 'absolute', width: '100%', height: '100%', transform: [{ scale: 2.2 }] }} 
              contentFit="cover" 
            />
            {/* 3D Model */}
            <View style={{ position: 'absolute', top: 0, bottom: -20, left: 0, right: 0, zIndex: 2 }} pointerEvents="box-none">
              <Canvas frameloop="demand" style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="auto" gl={{ alpha: true }}>
                <ambientLight intensity={2} color="#ffffff" />
                <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#000000" />
                <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-10, 10, -5]} intensity={1} color="#ffffff" />
                <Suspense fallback={null}>
                  <CharacterModel characterIndex={activeAvatarIndex} accessoryPath={equippedAccessory} yOffset={1.1} />
                </Suspense>
              </Canvas>
            </View>
            <View style={{ position: 'absolute', bottom: 10, left: 0, right: 0, alignItems: 'center' }}>
              <View style={{ width: 120, height: 30, borderRadius: 60, borderWidth: 2, borderColor: '#3B82F6', transform: [{ scaleY: 0.3 }], shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 1, shadowRadius: 15 }} />
            </View>
          </View>
          
        </View>

        <View style={{ height: 1, backgroundColor: 'rgba(255,255,255,0.05)', marginVertical: 15 }} />

        {/* Filter Section */}
        <View style={{ flex: 1, paddingHorizontal: 15 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingRight: 20 }}>
              {[
                { id: 'BARCHASI', label: 'BARCHASI', icon: 'view-grid', color: '#FFFFFF' },
                { id: 'ODDIY', label: 'ODDIY', icon: 'circle-small', color: '#10B981' },
                { id: 'RARE', label: 'RARE', icon: 'diamond', color: '#3B82F6' },
                { id: 'EPIC', label: 'EPIC', icon: 'diamond', color: '#A855F7' },
                { id: 'LEGENDARY', label: 'LEGENDARY', icon: 'crown', color: '#EAB308' }
              ].map(filter => {
                const isActive = activeFonFilter === filter.id;
                return (
                  <TouchableOpacity
                    key={filter.id}
                    onPress={() => setActiveFonFilter(filter.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 8,
                      backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                      borderWidth: 1,
                      borderColor: isActive ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.05)'
                    }}
                  >
                    {filter.icon && (
                      <MaterialCommunityIcons name={filter.icon} size={filter.icon === 'crown' ? 12 : filter.icon === 'view-grid' ? 14 : 10} color={filter.color} style={{ marginRight: 6 }} />
                    )}
                    <Text style={{ color: isActive ? '#FFFFFF' : '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 10 }}>{filter.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginLeft: 8 }}>
              <MaterialCommunityIcons name="filter-variant" size={16} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          {/* Grid View */}
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 180 }}>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: '2.5%' }}>
               {renderFonGrid()}
            </View>
          </ScrollView>
        </View>

      </View>
    );
  };


  const saveActivityLog = async (title, xpGained = 0) => {
    try {
      const histVal = await AsyncStorage.getItem('user_activity_history');
      let history = histVal ? JSON.parse(histVal) : [];
      const now = new Date();
      const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      
      const newEntry = {
        id: Date.now(),
        title,
        time: `${t.actToday || 'Bugun'}, ${timeStr}`,
        xpGained
      };

      history = [newEntry, ...history.filter(h => h.title !== title || (Date.now() - h.id > 30000))].slice(0, 3);
      await AsyncStorage.setItem('user_activity_history', JSON.stringify(history));
      setActivityHistory(history);
    } catch (e) {}
  };

  const handleStartBattle = async () => {
    if (!checkGuestAuth()) return;
    const isUserPremium = await checkPremiumActive();
    if (!isUserPremium && currentEnergy < 2) {
      setRequiredEnergyAlert(2);
      setIsEnergyAlertVisible(true);
      return;
    }
    const success = await consumeEnergy(2);
    if (success) {
      saveActivityLog("1v1 Boshma-bosh o'yin", 0);
      if (activeBattleMode === 'dost') {
        navigation.navigate('FriendInvite', { language });
      } else if (activeBattleMode === 'oddiy') {
        navigation.navigate('BattleSettings', { battleMode: activeBattleMode, language: language });
      } else {
        navigation.navigate('BattleMatchmaking', { battleMode: activeBattleMode, language: language });
      }
    }
  };

  const handleStartExercise = async () => {
    if (!checkGuestAuth()) return;
    const isSpeed = activeExerciseType === 'speed';
    const reqEnergy = isSpeed ? 2 : 1;
    const isUserPremium = await checkPremiumActive();
    if (!isUserPremium && currentEnergy < reqEnergy) {
      setRequiredEnergyAlert(reqEnergy);
      setIsEnergyAlertVisible(true);
      return;
    }
    const success = await consumeEnergy(reqEnergy);
    if (success) {
      if (activeExerciseType === 'abacus') {
        saveActivityLog("Abakus simulyatori", 10);
        navigation.navigate('AbacusSimulator', { language });
      } else {
        const isMultiply = ['multiply', 'kopaytirish', 'divide', 'bolish'].includes(isSpeed ? speedSecOperation : selectedOperation);
        const modeTitle = isSpeed 
          ? "Ko'paytirish va bo'lish" 
          : isMultiply ? "Ko'paytirish va bo'lish" : "Tasavvur (Oddiy hisob)";
        saveActivityLog(modeTitle, 0);

        navigation.navigate('OddiyHisobGame', {
          examplesCount: isSpeed ? speedSecExamples : selectedExamples,
          operation: isSpeed ? speedSecOperation : selectedOperation,
          speed: isSpeed ? speedSecTime : selectedSpeed,
          digits: isSpeed ? speedSecDigits : selectedDigits,
          language: language,
          isSpeedMode: isSpeed,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05050C" />
      
      {/* Home Tab Content */}
      <View style={{ flex: 1, display: activeTab === 'home' ? 'flex' : 'none' }}>
      {/* HEADER PART */}
      <View style={[styles.header, { paddingTop: 10 }]}>
        {/* Top Row: Logo, Icons */}
        <View style={styles.topRow}>
          {/* Logo */}
          <View style={styles.logoContainer} pointerEvents="none">
            <Text style={styles.logoIqro}>IQRO</Text>
            <Text style={styles.logoMax}>MAX</Text>
          </View>

          {/* Right Icons */}
          <View style={styles.rightIcons}>
            <TouchableOpacity style={styles.iconButton} activeOpacity={0.7} onPress={() => checkGuestAuth(() => { loadNotifications(); setIsNotifModalOpen(true); })}>
              <Feather name="bell" size={22} color="#FFFFFF" />
              {notificationsList.length > 0 && <View style={styles.notificationDot} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Stats Row: Energy, Coin and XP */}
        <View style={[styles.statsRow, { zIndex: 999 }]}>
          {/* Energy Card */}
          <TouchableOpacity 
            style={[styles.statCard, { marginRight: 6 }]} 
            activeOpacity={0.8}
            onPress={() => checkGuestAuth(() => navigation.navigate('EnergyCenter'))}
          >
            <View style={styles.statContent}>
              <Image source={require('../assets/lightning_energy.png')} style={styles.statImage} />
              <View>
                <Text style={styles.statValue}>{currentEnergy}</Text>
                <Text style={styles.statLabel}>{energyText}</Text>
              </View>
            </View>
            <View style={styles.plusButton}>
              <Feather name="plus" size={14} color="#F59E0B" />
            </View>
          </TouchableOpacity>

          {/* Coin Card */}
          <View style={[styles.statCard, { marginRight: 6 }]}>
            <View style={styles.statContent}>
              <Image source={require('../assets/s_coin.png')} style={styles.statImage} />
              <View>
                <Text style={styles.statValue}>{userCoin}</Text>
                <Text style={styles.statLabel}>{coinText || 'COIN'}</Text>
              </View>
            </View>
          </View>

          {/* XP Card */}
          <View style={styles.statCard}>
            <View style={styles.statContent}>
              <Image source={require('../assets/xp.jpg')} style={styles.statImage} />
              <View>
                <Text style={styles.statValue}>{userXp}</Text>
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
          <View style={styles.scrollMask} pointerEvents="none" />

          <View style={styles.contentOverlay} pointerEvents="box-none">
            


            {/* Canvas Container */}
            <View style={{ position: 'absolute', top: -30, bottom: 0, left: 0, right: 0, zIndex: 1, transform: [{ translateX: -20 }] }} pointerEvents="box-none">
              <Canvas frameloop="demand" style={{ flex: 1, width: '100%', backgroundColor: 'transparent' }} pointerEvents="auto" gl={{ alpha: true }}>
                <ambientLight intensity={2.5} color="#ffffff" />
                <hemisphereLight intensity={1.8} color="#ffffff" groundColor="#444444" />
                <Environment preset="city" />
                <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                <directionalLight position={[-10, 10, -5]} intensity={1.5} color="#ffffff" />
                <Suspense fallback={null}>
                  <CharacterModel characterIndex={activeAvatarIndex} accessoryPath={equippedAccessory} />
                </Suspense>
              </Canvas>
            </View>
            

            {/* Right Panel with Vertical Stats */}
            <View style={styles.rightSideStatsPanel}>
              {/* Card 0: Shop Button */}
              <TouchableOpacity
                style={[styles.rightStatBlock, { backgroundColor: 'rgba(234, 179, 8, 0.15)', borderColor: '#F59E0B' }]}
                activeOpacity={0.8}
                onPress={() => checkGuestAuth(() => {
                  setActiveShopTab('inventory');
                  setActiveSkinCategory('headwear');
                  setIsShopModalOpen(true);
                })}
              >
                <FontAwesome5 name="store" size={18} color="#F59E0B" />
                <View style={styles.rightStatTextCol}>
                  <Text style={[styles.rightStatTopLabel, { color: '#F59E0B' }]} numberOfLines={1}>IQROSHOP</Text>
                  <Text style={[styles.rightStatNumber, { color: '#FFF', fontSize: 11 }]} numberOfLines={1}>{t.shopBtnLabel || "DO'KON"}</Text>
                </View>
              </TouchableOpacity>

              {/* Card 1: Logic */}
              <View style={[styles.rightStatBlock, { borderColor: '#1E3A8A' }]}>
                <MaterialCommunityIcons name="brain" size={18} color="#3B82F6" />
                <View style={styles.rightStatTextCol}>
                  <Text style={styles.rightStatTopLabel} numberOfLines={1}>{t.logic}</Text>
                  <Text style={styles.rightStatNumber}>{realStats.logic}%</Text>
                  <Text style={[styles.rightStatSubLabel, { color: '#3B82F6' }]} numberOfLines={1}>
                    {realStats.logic > 0 ? `+${realStats.logic}%` : '0%'}
                  </Text>
                </View>
              </View>

              {/* Card 2: Speed */}
              <View style={[styles.rightStatBlock, { borderColor: '#14532D' }]}>
                <Ionicons name="flash" size={18} color="#22C55E" />
                <View style={styles.rightStatTextCol}>
                  <Text style={styles.rightStatTopLabel} numberOfLines={1}>{t.speed}</Text>
                  <Text style={styles.rightStatNumber}>{realStats.speedTime}s</Text>
                  <Text style={[styles.rightStatSubLabel, { color: '#22C55E' }]} numberOfLines={1}>
                    {parseFloat(realStats.speedTime) > 0 ? `${realStats.speedTime}s` : '0.0s'}
                  </Text>
                </View>
              </View>

              {/* Card 3: Accuracy */}
              <View style={[styles.rightStatBlock, { borderColor: '#78350F' }]}>
                <MaterialCommunityIcons name="target" size={18} color="#F59E0B" />
                <View style={styles.rightStatTextCol}>
                  <Text style={styles.rightStatTopLabel} numberOfLines={1}>{t.accuracy}</Text>
                  <Text style={styles.rightStatNumber}>{realStats.accuracy}%</Text>
                  <Text style={[styles.rightStatSubLabel, { color: '#F59E0B' }]} numberOfLines={1}>
                    {realStats.accuracy > 0 ? `+${realStats.accuracy}%` : '0%'}
                  </Text>
                </View>
              </View>
            </View>
          </View>

        {/* Level Progress Bar Section */}
        <View style={[styles.levelBarContainer, { marginTop: 25 }]} pointerEvents="box-none">
          <View style={styles.levelCardWrapper}>
            <Animated.View style={[styles.levelCard, { borderColor: borderColorInterp, borderWidth: 1.5 }]}>
              
              {/* Middle Progress Section (flex: 1) */}
              <View style={styles.progressSection}>
                <View style={styles.progressHeaderRow}>
                  <Text style={styles.progressValueBold}>{userXp}<Text style={styles.progressValueNormal}> / {userRankInfo.isMax ? 'MAX' : userRankInfo.nextRankXP} </Text><Text style={styles.progressXP}>XP</Text></Text>
                </View>
                <View style={styles.progressBarTrack}>
                  <View style={[styles.progressBarFill, { width: `${userRankInfo.progressPercent}%`, backgroundColor: userRankInfo.color }]} />
                </View>
                <Text style={styles.progressFooterText}>{userRankInfo.isMax ? 'Max darajadasiz!' : `${t.toNextLevel} ${userRankInfo.xpRemaining} XP`}</Text>
              </View>
              
            </Animated.View>
            
            {/* Overlapping Shield (Absolute) */}
            <View style={styles.shieldWrapper}>
              <Image source={require('../assets/level_shield.png')} style={styles.shieldImage} contentFit="contain" />
              <View style={styles.shieldTextWrapper}>
                <Text style={styles.shieldLevelText}>{t.levelText}</Text>
                <Text style={styles.shieldLevelNumber}>{levelNumber}</Text>
              </View>
            </View>

            {/* Overlapping Chest (Absolute) */}
            <View style={styles.chestWrapper}>
              <Image source={require('../assets/level_chest.png')} style={styles.chestImage} contentFit="contain" />
            </View>
          </View>

          {/* Start Exercise Button */}
          <TouchableOpacity 
            activeOpacity={0.7} 
            style={styles.startButton}
            onPress={() => setActiveTab('exercise')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Image source={require('../assets/start_btn_new.png')} style={{ position: 'absolute', width: '100%', height: '100%' }} contentFit="fill" pointerEvents="none" />
            <View style={styles.startButtonTouchable} pointerEvents="none">
              <Text style={styles.startButtonText}>{t.startExercise}</Text>
            </View>
          </TouchableOpacity>
        </View>
        </View>

        {/* Scrollable Bottom Section */}
        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 510, paddingBottom: 110 }}>
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

            <TouchableOpacity style={styles.exEnergyButton} activeOpacity={0.7} onPress={() => navigation.navigate('EnergyCenter', { language })}>
              <Image source={require('../assets/energy_icon.png')} style={{ width: 18, height: 18 }} contentFit="contain" />
              <Text style={styles.exEnergyText}>{currentEnergy}</Text>
              <Ionicons name="add" size={14} color="#FBBF24" />
            </TouchableOpacity>
          </View>

          {/* MASHQ TURLARI SECTION */}
          <Text style={styles.exerciseSectionTitle}>{ext.title}</Text>
          <View style={styles.exerciseTypesRow}>
          
          {/* Card 1: Abakus */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('abacus')}
          >
            <ImageBackground source={require('../assets/card_abacus.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} contentFit="cover">
              <View style={styles.exerciseCardContent}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.abacusTitle}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#0A2B66' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} contentFit="contain" />
                  <Text style={styles.exerciseCardEnergyText}>1</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'abacus' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#3B82F6', shadowColor: '#3B82F6', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>

          {/* Card 2: Tasavvur (Oddiy hisob) */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('calc')}
          >
            <ImageBackground source={require('../assets/card_speed.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} contentFit="cover">
              <View style={styles.exerciseCardContent}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.calcTitle}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#104414' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} contentFit="contain" />
                  <Text style={styles.exerciseCardEnergyText}>1</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'calc' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#22C55E', shadowColor: '#22C55E', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>

          {/* Card 3: Ko'paytirish va bo'lish */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('speed')}
          >
            <ImageBackground source={require('../assets/card_calc.png')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} contentFit="cover">
              <View style={styles.exerciseCardContent}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={2}>{ext.speedTitle}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#0A2B66' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} contentFit="contain" />
                  <Text style={styles.exerciseCardEnergyText}>2</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'speed' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#A855F7', shadowColor: '#A855F7', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>

          {/* Card 4: Battle */}
          <TouchableOpacity 
            style={styles.exerciseCard} 
            activeOpacity={0.8}
            onPress={() => setActiveExerciseType('battle')}
          >
            <ImageBackground source={require('../assets/card_battle.jpg')} style={styles.exerciseCardBg} imageStyle={{ borderRadius: 10 }} contentFit="cover">
              <View style={styles.exerciseCardContent}>
                <View style={styles.exerciseCardTextContainer}>
                  <Text style={styles.exerciseCardTitle} numberOfLines={1} adjustsFontSizeToFit>{ext.battleTitle}</Text>
                </View>
                <View style={[styles.exerciseCardEnergyBtn, { backgroundColor: '#6B2A03' }]}>
                  <Image source={require('../assets/energy_icon.png')} style={{ width: 10, height: 10 }} contentFit="contain" />
                  <Text style={styles.exerciseCardEnergyText}>2</Text>
                </View>
              </View>
            </ImageBackground>
            {activeExerciseType === 'battle' && (
              <View style={{ position: 'absolute', top: 2, bottom: 2, left: 0, right: 0, borderWidth: 2, borderColor: '#D97706', shadowColor: '#D97706', shadowOpacity: 0.8, shadowRadius: 10, shadowOffset: { width: 0, height: 0 }, elevation: 10 }} pointerEvents="none" />
            )}
          </TouchableOpacity>
        </View>
        </View>

        <ScrollView style={{ flex: 1 }} nestedScrollEnabled={true} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: Platform.OS === 'android' ? 315 : 285, paddingBottom: 170, paddingHorizontal: 20 }}>
        
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
                   <Image source={require('../assets/abacus_info.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" />
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

          </View>
        )}

        {/* CALC ONLY CONFIGURATION */}
        {activeExerciseType === 'calc' && (
          <>
        {/* INFO CARD SECTION */}
        <View style={[styles.infoCardContainer, { marginTop: 20, marginBottom: 15 }]}>
          <ImageBackground source={require('../assets/info_card_bg.png')} style={styles.infoCardBg} imageStyle={{ borderRadius: 16 }} contentFit="contain">
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
                    nestedScrollEnabled={true}
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
                    nestedScrollEnabled={true}
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

            {/* DIGITS SECTION */}
            <View style={styles.examplesContainer}>
              <View style={styles.examplesHeader}>
                <View style={styles.examplesIconBox}>
                  <MaterialCommunityIcons name="numeric" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={styles.examplesTitle}>{ext.digitsTitle}</Text>
                  <Text style={styles.examplesSubtitle}>{ext.digitsSubtitle}</Text>
                </View>
              </View>

              {!isDigitsPickerOpen ? (
                <TouchableOpacity
                  style={styles.examplesSelectorClosed}
                  activeOpacity={0.8}
                  onPress={() => setIsDigitsPickerOpen(true)}
                >
                  <Text style={styles.examplesSelectorValueText}>
                    {selectedDigits} {ext.digitsLabel} ({selectedDigits === 1 ? '1-9' : selectedDigits === 2 ? '10-99' : selectedDigits === 3 ? '100-999' : '1000-9999'})
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#A855F7" />
                </TouchableOpacity>
              ) : (
                <View style={styles.examplesPickerExpanded}>
                  <ScrollView
                    style={styles.examplesPickerScroll}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                  >
                    {[1, 2, 3, 4].map((d) => {
                      const isSelected = selectedDigits === d;
                      const label = `${d} ${ext.digitsLabel} (${d === 1 ? '1-9' : d === 2 ? '10-99' : d === 3 ? '100-999' : '1000-9999'})`;
                      return (
                        <TouchableOpacity
                          key={d.toString()}
                          style={[styles.examplesPickerItem, isSelected && styles.examplesPickerItemSelected]}
                          onPress={() => {
                            setSelectedDigits(d);
                            setIsDigitsPickerOpen(false);
                          }}
                        >
                          <Text style={[styles.examplesPickerItemText, isSelected && styles.examplesPickerItemTextSelected]}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </ScrollView>
                  <TouchableOpacity
                    style={styles.examplesPickerCloseBtn}
                    onPress={() => setIsDigitsPickerOpen(false)}
                  >
                    <MaterialCommunityIcons name="chevron-up" size={24} color="#A855F7" />
                  </TouchableOpacity>
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
                   <Image source={require('../assets/speed_info.png')} style={{ width: '100%', height: '100%' }} contentFit="contain" />
                </View>
              </View>
            </View>

            {/* SPEED DIGITS SECTION */}
            <View style={[styles.examplesContainer, { backgroundColor: '#0A0A16', marginTop: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
              <View style={styles.examplesHeader}>
                <View style={[styles.examplesIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <MaterialCommunityIcons name="numeric" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={[styles.examplesTitle, { color: '#F8FAFC' }]}>{ext.digitsTitle || 'SON XONASI'}</Text>
                  <Text style={[styles.examplesSubtitle, { color: '#6B7280' }]}>{ext.digitsSubtitle || 'Qatnashadigan sonlar xonasini tanlang'}</Text>
                </View>
              </View>

              {!isSpeedSecDigitsOpen ? (
                <TouchableOpacity
                  style={[styles.examplesSelectorClosed, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]}
                  activeOpacity={0.8}
                  onPress={() => setIsSpeedSecDigitsOpen(true)}
                >
                  <Text style={[styles.examplesSelectorValueText, { color: '#F8FAFC' }]}>
                    {speedSecDigits} <Text style={[styles.examplesSelectorLabelText, { color: '#9CA3AF' }]}>{ext.digitsLabel || 'xonali'}</Text> <Text style={{ color: '#6B7280', fontSize: 14 }}>({speedSecDigits === 1 ? '1-9' : speedSecDigits === 2 ? '10-99' : speedSecDigits === 3 ? '100-999' : '1000-9999'})</Text>
                  </Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View style={[styles.examplesPickerExpanded, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                  <ScrollView
                    style={styles.examplesPickerScroll}
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                  >
                    <View style={{ height: 40 }} />
                    {[1, 2, 3, 4].map((d) => {
                      const isSelected = speedSecDigits === d;
                      const label = `${d} ${ext.digitsLabel || 'xonali'} (${d === 1 ? '1-9' : d === 2 ? '10-99' : d === 3 ? '100-999' : '1000-9999'})`;
                      return (
                        <TouchableOpacity
                          key={d.toString()}
                          style={[styles.examplesPickerItem, isSelected && { backgroundColor: 'rgba(168, 85, 247, 0.2)' }]}
                          onPress={() => {
                            setSpeedSecDigits(d);
                            setIsSpeedSecDigitsOpen(false);
                          }}
                        >
                          <Text style={[styles.examplesPickerItemText, { color: '#9CA3AF' }, isSelected && { color: '#A855F7', fontWeight: 'bold' }]}>
                            {label}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                    <View style={{ height: 40 }} />
                  </ScrollView>
                  <TouchableOpacity
                    style={[styles.examplesPickerCloseBtn, { borderTopColor: 'rgba(255, 255, 255, 0.05)' }]}
                    onPress={() => setIsSpeedSecDigitsOpen(false)}
                  >
                    <MaterialCommunityIcons name="chevron-up" size={24} color="#A855F7" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* SPEED MISOL SONI */}
            <View style={[styles.examplesContainer, { backgroundColor: '#0A0A16', marginTop: 15, borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' }]}>
              <View style={styles.examplesHeader}>
                <View style={[styles.examplesIconBox, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
                  <MaterialCommunityIcons name="calculator" size={24} color="#A855F7" />
                </View>
                <View style={styles.examplesHeaderTextContainer}>
                  <Text style={[styles.examplesTitle, { color: '#F8FAFC' }]}>{t.examplesCountTitleSpeed || 'MISOLLAR SONI'}</Text>
                  <Text style={[styles.examplesSubtitle, { color: '#6B7280' }]}>{t.examplesCountSubtitleSpeed || '2, 5, ёки 10 ta misol tanlang'}</Text>
                </View>
              </View>

              {!isSpeedSecExamplesOpen ? (
                <TouchableOpacity 
                  style={[styles.examplesSelectorClosed, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]} 
                  activeOpacity={0.8}
                  onPress={() => setIsSpeedSecExamplesOpen(true)}
                >
                  <Text style={[styles.examplesSelectorValueText, { color: '#F8FAFC' }]}>{speedSecExamples} <Text style={[styles.examplesSelectorLabelText, { color: '#9CA3AF' }]}>{t.exampleWordSpeed || 'ta misol'}</Text></Text>
                  <MaterialCommunityIcons name="chevron-down" size={24} color="#9CA3AF" />
                </TouchableOpacity>
              ) : (
                <View style={[styles.examplesPickerExpanded, { backgroundColor: '#05050C', borderColor: 'rgba(168, 85, 247, 0.3)' }]}>
                  <ScrollView 
                    style={styles.examplesPickerScroll} 
                    nestedScrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={40}
                    decelerationRate="fast"
                    onMomentumScrollEnd={(e) => {
                      const offsetY = e.nativeEvent.contentOffset.y;
                      const index = Math.round(offsetY / 40);
                      if (speedExampleNumbers[index]) setSpeedSecExamples(speedExampleNumbers[index]);
                    }}
                  >
                    <View style={{ height: 40 }} />
                    {speedExampleNumbers.map((num) => {
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
                            {num} {isSelected && <Text style={{ color: '#9CA3AF', fontSize: 14 }}>( {t.exampleWordSpeed || 'ta misol'} )</Text>}
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
                  style={[{ flex: 1, backgroundColor: '#05050C', borderRadius: 12, padding: 15, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.05)', marginLeft: 5 }, speedSecOperation === 'bolish' && { borderColor: '#A855F7', backgroundColor: 'rgba(168, 85, 247, 0.1)', shadowColor: '#A855F7', shadowOpacity: 0.5, shadowRadius: 8, elevation: 5 }]}
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
              </View>
            </View>
          </View>
        )}

        {/* BATTLE ONLY CONFIGURATION */}
        {activeExerciseType === 'battle' && (
          <View style={{ marginTop: 15, marginBottom: 15 }}>

            <View style={styles.battleCardContainer}>
              <ImageBackground source={require('../assets/battle_vs_bg.png')} style={styles.battleCardBg} imageStyle={{ borderRadius: 16 }} contentFit="fill">
                <View style={styles.battleCardOverlay}>
                  
                  {/* Left Player (You) */}
                  <View style={styles.battleLeftPlayer}>
                    <Text style={styles.battlePlayerLabelYou}>{t.battleYou || 'SIZ'}</Text>
                    <Text style={styles.battlePlayerNameYou} numberOfLines={2} adjustsFontSizeToFit>{t.title ? t.title.replace(' ', '\n') : ''}</Text>
                    <View style={styles.battleLevelBadgeYou}>
                      <Text style={styles.battleLevelTextYou}>{t.battleLevel || 'Level'} 24</Text>
                    </View>
                    <View style={styles.battleTrophyRow}>
                      <MaterialCommunityIcons name="trophy" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
                      <Text style={styles.battleTrophyTextYou}>1 250</Text>
                    </View>
                    <Text style={styles.battleReytingText}>{t.battleRating || 'Reyting'}</Text>
                  </View>

                  {/* Right Player (Opponent) */}
                  <View style={styles.battleRightPlayer}>
                    <Text style={styles.battlePlayerLabelOpp}>{t.battleOpponent || 'Raqib'}</Text>
                    <Text style={styles.battlePlayerNameOpp} numberOfLines={2} adjustsFontSizeToFit>IQ{'\n'}Warrior</Text>
                    <View style={styles.battleLevelBadgeOpp}>
                      <Text style={styles.battleLevelTextOpp}>{t.battleLevel || 'Level'} 22</Text>
                    </View>
                    <View style={styles.battleTrophyRow}>
                      <MaterialCommunityIcons name="trophy" size={12} color="#F59E0B" style={{ marginRight: 4 }} />
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
                <Image source={require('../assets/battle_mode_oddiy.png')} style={styles.battleModeIcon} contentFit="contain" />
                <Text style={styles.battleModeTitle} numberOfLines={2}>{t.bmOddiy || 'Oddiy Battle'}</Text>
                <Text style={styles.battleModeDesc} numberOfLines={3}>{t.bmOddiyDesc || 'Teng kuchdagilar bilan tezkor hisoblash'}</Text>
                <View style={styles.battleModeEnergyBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#F59E0B" />
                  <Text style={styles.battleModeEnergyText}>1</Text>
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
                <Image source={require('../assets/battle_mode_dost.jpg')} style={styles.battleModeIcon} contentFit="contain" />
                <Text style={styles.battleModeTitle} numberOfLines={2}>{t.bmDost || "Do'st bilan Battle"}</Text>
                <Text style={styles.battleModeDesc} numberOfLines={3}>{t.bmDostDesc || "Do'stingizni taklif qiling va bellashing"}</Text>
                <View style={styles.battleModeEnergyBadge}>
                  <MaterialCommunityIcons name="lightning-bolt" size={10} color="#F59E0B" />
                  <Text style={styles.battleModeEnergyText}>0</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* BEST RESULTS SECTION */}
            <View style={styles.bestResultsCard}>
              <Text style={styles.bestResultsTitle}>{t.bestResults || 'ENG YAXSHI NATIJALAR'}</Text>
              
              <View style={styles.bestResultsRow}>
                {/* Victories */}
                <View style={styles.bestResultItem}>
                  <Image source={require('../assets/best_victories.png')} style={styles.bestResultIcon} contentFit="contain" />
                  <Text style={styles.bestResultLabel}>{t.bestVictories || "G'alabalar"}</Text>
                  <Text style={styles.bestResultValue}>{battleBestStats.victories}</Text>
                </View>

                {/* Vertical Divider */}
                <View style={styles.bestResultDivider} />

                {/* Winning Streak */}
                <View style={styles.bestResultItem}>
                  <Image source={require('../assets/best_streak.png')} style={styles.bestResultIcon} contentFit="contain" />
                  <Text style={styles.bestResultLabel}>{t.bestStreak || "G'alaba seriyasi"}</Text>
                  <Text style={styles.bestResultValue}>{battleBestStats.bestStreak}</Text>
                </View>

                {/* Vertical Divider */}
                <View style={styles.bestResultDivider} />

                {/* Fastest Time */}
                <View style={styles.bestResultItem}>
                  <Image source={require('../assets/best_time.png')} style={styles.bestResultIcon} contentFit="contain" />
                  <Text style={styles.bestResultLabel}>{t.bestTime || "Eng tez vaqt"}</Text>
                  <Text style={styles.bestResultValue}>{battleBestStats.fastestTime}s</Text>
                </View>
              </View>
            </View>


          </View>
        )}

        <View style={{ height: 100 }} />
        </ScrollView>
        <View style={{ position: 'absolute', bottom: 46, left: 0, right: 0, paddingHorizontal: 20, paddingTop: 8, paddingBottom: 6, backgroundColor: '#05050C', zIndex: 50, borderTopWidth: 1, borderTopColor: 'rgba(255, 255, 255, 0.05)' }}>
          {/* START EXERCISE BUTTON */}
          {activeExerciseType === 'battle' ? (
            <TouchableOpacity 
              style={styles.battleModeStartBtn}
              onPress={handleStartBattle}
            >
              <View style={styles.battleStartIconContainer}>
                <Image source={require('../assets/battle_mode_oddiy.png')} style={{ width: 44, height: 44 }} contentFit="contain" />
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
              onPress={handleStartExercise}
            >
              <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FFF" style={styles.startBtnIcon} />
              <Text style={styles.startExerciseBtnText}>
                {activeExerciseType === 'abacus' ? (t.startAbacus || "ABAKUSNI OCHISH") : t.startExercise}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        </View>

        {/* INVENTORY TAB CONTENT */}
        <View style={{ flex: 1, display: activeTab === 'inventory' ? 'flex' : 'none', backgroundColor: '#05050C' }}>
          {/* Inventory Global Header */}
          <View 
            style={{ 
              flexDirection: 'row', 
              paddingHorizontal: 15, 
              paddingTop: 10, 
              paddingBottom: 15, 
              justifyContent: 'space-between', 
              alignItems: 'center', 
            }}
          >
            {/* 1. Left Section */}
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {inventorySubTab !== 'personaj' ? (
                <TouchableOpacity 
                  style={{ width: 40, height: 40, borderRadius: 8, backgroundColor: 'rgba(255,255,255,0.05)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
                  onPress={() => setInventorySubTab('personaj')}
                >
                  <Feather name="arrow-left" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(10, 15, 30, 0.5)', borderRadius: 12, padding: 8, paddingRight: 32, paddingLeft: 10 }}>
                  <View style={{ width: 60, height: 60, justifyContent: 'center', alignItems: 'center', marginRight: 10 }}>
                    <Image source={baseAvatarsList.find(a => a.id === activeAvatarIndex)?.img || require('../assets/avatar_maks.png')} style={{ width: 42, height: 42, borderRadius: 21, zIndex: 1 }} />
                    <Image source={require('../assets/gold_frame.png')} style={{ position: 'absolute', width: 60, height: 60, zIndex: 2 }} contentFit="contain" />
                  </View>
                  <View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 2 }}>
                      <Text style={{ fontSize: 12, marginRight: 4 }}>🇺🇿</Text>
                      <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>{user?.name || "Player"}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons name="trophy" size={13} color="#FBBF24" style={{ marginRight: 4 }} />
                      <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_600SemiBold', fontSize: 13 }}>{userRankInfo.levelNumber}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

          </View>

          {(inventorySubTab === 'personaj' || inventorySubTab === 'avatar') && (
            <>
              <View style={{ flex: 0 }}>
            {/* End Global Header */}

              {/* Showcase Container */}
              <View style={{ height: 350, position: 'relative', marginHorizontal: 15, borderRadius: 16, overflow: 'hidden', marginBottom: 15 }}>
                {/* Background image from character selection */}
                <Image 
                  source={require('../assets/character_bg.png')} 
                  style={{ position: 'absolute', width: '100%', height: '100%', borderRadius: 16 }} 
                  contentFit="cover" 
                />

                {/* 3D Model Render */}
                <View style={{ position: 'absolute', top: 0, bottom: -20, left: 0, right: 0, zIndex: 2 }} pointerEvents="box-none">
                  <Canvas frameloop="demand" style={{ flex: 1, backgroundColor: 'transparent' }} pointerEvents="auto" gl={{ alpha: true }}>
                    <ambientLight intensity={2} color="#ffffff" />
                    <hemisphereLight intensity={1.5} color="#ffffff" groundColor="#000000" />
                    <Environment preset="city" />
                    <directionalLight position={[10, 10, 5]} intensity={2.5} color="#ffffff" />
                    <directionalLight position={[-10, 10, -5]} intensity={1} color="#ffffff" />
                    <Suspense fallback={null}>
                      <CharacterModel characterIndex={activeAvatarIndex} accessoryPath={equippedAccessory} yOffset={0.5} />
                    </Suspense>
                  </Canvas>
                </View>

                {/* Left Absolute Overlay: Active Character Details */}
                <View style={{ position: 'absolute', top: 15, left: 15, backgroundColor: 'rgba(10, 15, 30, 0.75)', borderWidth: 1, borderColor: '#1E3A8A', borderRadius: 12, padding: 10, width: 115, zIndex: 3 }}>
                  <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8, letterSpacing: 0.5, marginBottom: 4 }}>
                    {t.invActiveChar}
                  </Text>
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 13, marginBottom: 4 }} numberOfLines={1}>
                    {activeAvatarIndex === 0 ? 'Alex' : activeAvatarIndex === 1 ? 'Tech Genius' : activeAvatarIndex === 2 ? 'Creative Mind' : activeAvatarIndex === 3 ? 'Mental Warrior' : activeAvatarIndex === 4 ? 'Lily' : activeAvatarIndex === 5 ? 'Maya' : activeAvatarIndex === 6 ? 'Sophia' : 'Emma'}
                  </Text>
                  <View style={{ alignSelf: 'flex-start', backgroundColor: activeAvatarIndex === 1 || activeAvatarIndex === 2 ? '#581C87' : activeAvatarIndex === 3 || activeAvatarIndex === 5 ? '#1E3A8A' : '#1F2937', borderRadius: 4, paddingVertical: 2, paddingHorizontal: 6, marginBottom: 6 }}>
                    <Text style={{ color: activeAvatarIndex === 1 || activeAvatarIndex === 2 ? '#D8B4FE' : activeAvatarIndex === 3 || activeAvatarIndex === 5 ? '#93C5FD' : '#D1D5DB', fontFamily: 'Inter_700Bold', fontSize: 8 }}>
                      {activeAvatarIndex === 1 || activeAvatarIndex === 2 ? 'EPIC' : activeAvatarIndex === 3 || activeAvatarIndex === 5 ? 'RARE' : 'COMMON'}
                    </Text>
                  </View>
                  <Ionicons name="information-circle-outline" size={14} color="#9CA3AF" />
                </View>

                {/* Right Absolute Overlay: Equipped items stack */}
                <View style={{ position: 'absolute', top: 15, right: 15, gap: 8, zIndex: 3 }}>
                  {/* Avatar card */}
                  <View style={{ width: 68, height: 60, borderRadius: 10, backgroundColor: 'rgba(10, 15, 30, 0.75)', borderWidth: 1, borderColor: '#1E3A8A', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                    <View style={{ position: 'absolute', top: 4, right: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: '#10B981' }} />
                    <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_700Bold', fontSize: 7, marginBottom: 2 }}>AVATAR</Text>
                    <Image source={selectedAvatarObj ? selectedAvatarObj.img : require('../assets/opponent_1.png')} style={{ width: 22, height: 22, borderRadius: 11 }} />
                    <Text style={{ color: '#10B981', fontFamily: 'Inter_500Medium', fontSize: 7, marginTop: 2 }}>Taqilgan</Text>
                  </View>
                </View>

                {/* Bottom Left Absolute Overlay: Level Progress */}
                <View style={{ position: 'absolute', bottom: 15, left: 15, backgroundColor: 'rgba(10, 15, 30, 0.75)', borderWidth: 1, borderColor: '#1E3A8A', borderRadius: 12, padding: 8, width: 120, zIndex: 3 }}>
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 11 }}>{t.levelText} {userRankInfo.levelNumber}</Text>
                  <View style={{ height: 4, backgroundColor: '#1A1B2D', borderRadius: 2, width: '100%', marginVertical: 4 }}>
                    <View style={{ height: 4, backgroundColor: '#EAB308', borderRadius: 2, width: `${userRankInfo.progressPercent}%` }} />
                  </View>
                  <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 8 }}>{Math.floor(userXp)} / {userRankInfo.isMax ? Math.floor(userXp) : userRankInfo.nextRankXP}</Text>
                </View>
              </View>

            </View>

            {/* Scrollable part for items grid and skins */}
            <ScrollView 
              style={{ flex: 1 }} 
              contentContainerStyle={{ paddingBottom: 110, paddingHorizontal: 15 }} 
              showsVerticalScrollIndicator={false}
            >

              {/* 1. PERSONAJLAR ACCORDION DROPDOWN BUTTON */}
              <TouchableOpacity
                style={{
                  flexDirection: 'row',
                  justify: 'space-between',
                  alignItems: 'center',
                  backgroundColor: '#0F111E',
                  borderWidth: 1.5,
                  borderColor: isPersonajOpen ? '#EAB308' : '#1F2937',
                  borderRadius: 14,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  marginTop: 10,
                  marginBottom: 10,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.4,
                  shadowRadius: 4,
                  elevation: 4,
                }}
                activeOpacity={0.8}
                onPress={togglePersonajAccordion}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(234, 179, 8, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                    <MaterialCommunityIcons name="account-group" size={20} color="#EAB308" />
                  </View>
                  <View>
                    <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                      {t.characters || 'PERSONAJLAR'}
                    </Text>
                    <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 2 }}>
                      {isPersonajOpen ? "Yopish uchun bosing" : "Personajlarni ko'rish va almashtirish"}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>

              {/* PERSONAJLAR GRID CONTENT */}
              {isPersonajOpen && inventorySubTab === 'personaj' && (
                <View style={{ marginBottom: 15, paddingHorizontal: 2 }}>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start', gap: 8 }}>
                    {[
                      { id: 0, name: 'Alex', rarity: 'COMMON', locked: false, avatar: require('../assets/avatar_alex.jpg'), gender: 'boys' },
                      { id: 1, name: 'Tech Genius', rarity: 'EPIC', locked: false, avatar: require('../assets/avatar_maks.png'), gender: 'boys' },
                      { id: 2, name: 'Creative Mind', rarity: 'EPIC', locked: false, avatar: require('../assets/avatar_david.jpg'), gender: 'boys' },
                      { id: 3, name: 'Mental Warrior', rarity: 'RARE', locked: false, avatar: require('../assets/avatar_kevin.png'), gender: 'boys' },
                      { id: 4, name: 'Lily', rarity: 'COMMON', locked: false, avatar: require('../assets/avatar_lily.jpg'), gender: 'girls' },
                      { id: 5, name: 'Maya', rarity: 'RARE', locked: false, avatar: require('../assets/avatar_maya.jpg'), gender: 'girls' },
                      { id: 6, name: 'Sophia', rarity: 'EPIC', locked: false, avatar: require('../assets/avatar_sophia.png'), gender: 'girls' },
                      { id: 7, name: 'Emma', rarity: 'EPIC', locked: false, avatar: require('../assets/avatar_emma.jpg'), gender: 'girls' },
                    ]
                    .filter(item => {
                      const userGender = route.params?.gender || (activeAvatarIndex < 4 ? 'boys' : 'girls');
                      return item.gender === userGender;
                    })
                    .map((item) => {
                    const isSelected = activeAvatarIndex === item.id;
                    return (
                      <TouchableOpacity
                        key={item.id}
                        style={{
                          width: '23%',
                          aspectRatio: 0.75,
                          backgroundColor: '#0F111E',
                          borderWidth: 1,
                          borderColor: isSelected ? '#EAB308' : '#1F2937',
                          borderRadius: 10,
                          padding: 4,
                          alignItems: 'center',
                          justify: 'flex-start',
                          marginBottom: 8,
                          position: 'relative',
                        }}
                        onPress={() => {
                          if (!item.locked) {
                            setActiveAvatarIndex(item.id);
                            updateCharacterOnServer(item.id);
                          }
                        }}
                        activeOpacity={item.locked ? 1 : 0.7}
                      >
                        {/* Checked badge */}
                        {isSelected && (
                          <View style={{ position: 'absolute', top: 4, right: 4, width: 14, height: 14, borderRadius: 7, backgroundColor: '#EAB308', alignItems: 'center', justifyContent: 'center', zIndex: 5 }}>
                            <MaterialCommunityIcons name="check" size={10} color="#000" />
                          </View>
                        )}

                        {/* Image */}
                        <View style={{ width: 56, height: 56, borderRadius: 28, overflow: 'hidden', marginTop: 6, opacity: item.locked ? 0.4 : 1, position: 'relative', alignSelf: 'center', backgroundColor: '#151624', borderWidth: 1, borderColor: isSelected ? '#EAB308' : '#22253B', justifyContent: 'center', alignItems: 'center' }}>
                          <Image source={item.avatar} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                          {item.locked && (
                            <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }}>
                              <Ionicons name="lock-closed" size={12} color="#9CA3AF" />
                            </View>
                          )}
                        </View>

                        <View style={{ width: '100%', alignItems: 'center', marginTop: 6 }}>
                          {item.locked ? (
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              {item.type === 'coin' ? (
                                <Image source={require('../assets/s_coin.png')} style={{ width: 8, height: 8, marginRight: 2 }} />
                              ) : (
                                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: '#A855F7', marginRight: 2 }} />
                              )}
                              <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 8 }}>{item.price}</Text>
                            </View>
                          ) : (
                            <View style={{ backgroundColor: item.rarity === 'EPIC' ? '#581C87' : item.rarity === 'RARE' ? '#1E3A8A' : '#1F2937', borderRadius: 3, paddingVertical: 1, paddingHorizontal: 4 }}>
                              <Text style={{ color: item.rarity === 'EPIC' ? '#D8B4FE' : item.rarity === 'RARE' ? '#93C5FD' : '#D1D5DB', fontFamily: 'Inter_700Bold', fontSize: 7 }}>
                                {item.rarity}
                              </Text>
                            </View>
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* 2. SKINLAR ACCORDION DROPDOWN BUTTON */}
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                justify: 'space-between',
                alignItems: 'center',
                backgroundColor: '#0F111E',
                borderWidth: 1.5,
                borderColor: isSkinlarOpen ? '#A855F7' : '#1F2937',
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                marginBottom: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.4,
                shadowRadius: 4,
                elevation: 4,
              }}
              activeOpacity={0.8}
              onPress={toggleSkinlarAccordion}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: 'rgba(168, 85, 247, 0.15)', justifyContent: 'center', alignItems: 'center', marginRight: 12 }}>
                  <MaterialCommunityIcons name="tshirt-crew" size={20} color="#A855F7" />
                </View>
                <View>
                  <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 13, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {t.invSkins || 'SKINLAR'}
                  </Text>
                  <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_500Medium', fontSize: 10, marginTop: 2 }}>
                    {isSkinlarOpen ? "Yopish uchun bosing" : "Kiyimlar, poyabzal va aksessuarlar kiyish"}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>

            {/* SKINLAR GRID CONTENT */}
            {isSkinlarOpen && (
              <View style={{ marginBottom: 15, paddingHorizontal: 2 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {[
                    { keyId: 'ustki_kiyim', label: t.invTopWear,     icon: 'tshirt-crew',     color: '#D97706', bg: 'rgba(217,119,6,0.1)',   border: 'rgba(217,119,6,0.35)',  count: '8 / 24' },
                    { keyId: 'shim',        label: t.invPants,       icon: 'human-handsdown', color: '#06B6D4', bg: 'rgba(6,182,212,0.1)',   border: 'rgba(6,182,212,0.35)',  count: '6 / 15' },
                    { keyId: 'oyoq_kiyim',  label: t.invShoes,       icon: 'shoe-sneaker',    color: '#10B981', bg: 'rgba(16,185,129,0.1)',  border: 'rgba(16,185,129,0.35)', count: '4 / 12' },
                    { keyId: 'aksessuar',   label: t.invAccessories, icon: 'glasses',         color: '#EAB308', bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.35)',  count: '3 / 10' },
                    { keyId: 'ryukzak',     label: t.invBackpacks,   icon: 'bag-personal',    color: '#A855F7', bg: 'rgba(168,85,247,0.1)',  border: 'rgba(168,85,247,0.35)', count: '5 / 18' },
                  ].map((item, i) => (
                    <TouchableOpacity
                      key={i}
                      style={{
                        width: '31%',
                        paddingVertical: 12,
                        borderRadius: 12,
                        backgroundColor: item.bg,
                        borderWidth: 1,
                        borderColor: item.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                      onPress={() => {
                        setKiyimKategoriya(item.keyId);
                        setInventorySubTab('kiyim');
                      }}
                      activeOpacity={0.8}
                    >
                      <MaterialCommunityIcons name={item.icon} size={22} color={item.color} />
                      <View style={{ height: 5 }} />
                      <Text style={{ color: '#FFFFFF', fontFamily: 'Inter_700Bold', fontSize: 8, textAlign: 'center' }}>
                        {item.label}
                      </Text>
                      <View style={{ height: 4 }} />
                      <View style={{ backgroundColor: 'rgba(0,0,0,0.25)', borderRadius: 5, paddingHorizontal: 7, paddingVertical: 2 }}>
                        <Text style={{ color: item.color, fontFamily: 'Inter_700Bold', fontSize: 8 }}>
                          {item.count}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}
            </ScrollView>
            </>
          )}
          {inventorySubTab === 'kiyim' && renderKiyimScreen()}

            </View>

        {/* RANKING TAB CONTENT */}
        <View style={{ flex: 1, display: activeTab === 'ranking' ? 'flex' : 'none', backgroundColor: '#05050C' }}>
          {/* STATIC TOP SECTION: Header, Golden Frame, Podium & Search Bar */}
          <View style={{ paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10 }}>
            {/* Top Header */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 15 }}>
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
            </View>

{(() => {
  const top1 = leaderboardData[0] || { name: '---', xp: 0, avatar: require('../assets/avatar_alex.jpg') };
  const top2 = leaderboardData[1] || { name: '---', xp: 0, avatar: require('../assets/avatar_david.jpg') };
  const top3 = leaderboardData[2] || { name: '---', xp: 0, avatar: require('../assets/avatar_lily.jpg') };
  
  const top1RankInfo = calculateUserRank(top1.xp);
  
  return (
    <>
      {/* Golden Frame Card */}
      <ImageBackground source={require('../assets/ranking_frame.png')} style={styles.rankingGoldenFrame} contentFit="fill">
        {/* Left: Avatar with wreath */}
        <View style={styles.rankingFrameLeft}>
            <Image source={top1.avatar} style={styles.rankingAvatar} />
        </View>

        {/* Middle: User Info */}
        <View style={styles.rankingFrameMiddle}>
          <Text style={styles.rankingUserName} numberOfLines={1}>{top1.name}</Text>
          <View style={styles.rankingUserPosition}>
            <MaterialCommunityIcons name="trophy" size={16} color="#F59E0B" />
            <Text style={styles.rankingPositionNumber}>#1</Text>
          </View>
          <View style={styles.rankingUserXpBadge}>
            <Text style={styles.rankingUserXpText}>{top1.xp} XP</Text>
          </View>
        </View>

        {/* Right: Badge and Progress */}
        <View style={styles.rankingFrameRight}>
          <View style={styles.rankingBadgeRow}>
            <Image source={require('../assets/ranking_badge.png')} style={styles.rankingBadgeIcon} contentFit="contain" />
            <View>
              <Text style={[styles.rankingBadgeText, { color: top1RankInfo.color }]}>{top1RankInfo.name}</Text>
              <View style={{ flexDirection: 'row', marginTop: 2 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                  <MaterialCommunityIcons 
                    key={i} 
                    name="star" 
                    size={10} 
                    color={i < top1RankInfo.stars ? top1RankInfo.color : '#4B5563'} 
                  />
                ))}
              </View>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.rankingProgressContainer}>
            <View style={styles.rankingProgressBarBg}>
              <View style={[styles.rankingProgressBarFill, { width: `${Math.round(top1RankInfo.progressPercent)}%`, backgroundColor: top1RankInfo.color }]} />
            </View>
            <Text style={styles.rankingProgressPercent}>{Math.round(top1RankInfo.progressPercent)}%</Text>
          </View>

          <Text style={styles.rankingTargetText}>{top1RankInfo.isMax ? 'MAX Rank' : (t.platinumTarget?.replace('Platinum V', top1RankInfo.nextRankName) || `${top1RankInfo.nextRankName} gacha`)}</Text>
          {top1RankInfo.isMax ? (
             <Text style={styles.rankingXpLeftText}>
               <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold' }}>Chempion</Text>
             </Text>
          ) : (
            <Text style={styles.rankingXpLeftText}>
              <Text style={{ color: top1RankInfo.color, fontFamily: 'Inter_700Bold' }}>{top1RankInfo.xpRemaining}</Text>
              <Text>{' '}</Text>
              <Text>{t.xpRemaining || "XP qoldi"}</Text>
            </Text>
          )}

        </View>
      </ImageBackground>

      {/* Podium Section */}
      <View style={styles.podiumContainer}>
        <ImageBackground source={require('../assets/ranking_podium.png')} style={styles.podiumImage} contentFit="contain">
          
          {/* 2nd Place (Left) */}
          <View style={styles.podiumSecond}>
              <Image source={top2.avatar} style={styles.podiumAvatar} />
          </View>

          {/* 1st Place (Center) */}
          <View style={styles.podiumFirst}>
              <Image source={top1.avatar} style={styles.podiumAvatarFirst} />
          </View>

          {/* 3rd Place (Right) */}
          <View style={styles.podiumThird}>
              <Image source={top3.avatar} style={styles.podiumAvatar} />
          </View>

        </ImageBackground>

        {/* User Info Under Podium */}
        <View style={styles.podiumInfoRow}>
          {/* 2nd Place Info */}
          <View style={[styles.podiumInfoBox, { marginTop: -50, marginLeft: 5 }]}>
            <Text style={styles.podiumInfoName} numberOfLines={1}>{top2.name}</Text>
            <View style={styles.podiumInfoXpBadge}>
              <Text style={styles.podiumInfoXpText}>{top2.xp} XP</Text>
            </View>
          </View>

          {/* 1st Place Info */}
          <View style={[styles.podiumInfoBox, { marginTop: -42 }]}>
            <Text style={[styles.podiumInfoName, { color: '#F59E0B' }]} numberOfLines={1}>{top1.name}</Text>
            <View style={styles.podiumInfoXpBadge}>
              <Text style={styles.podiumInfoXpText}>{top1.xp} XP</Text>
            </View>
          </View>

          {/* 3rd Place Info */}
          <View style={[styles.podiumInfoBox, { marginTop: -52, marginRight: 5 }]}>
            <Text style={styles.podiumInfoName} numberOfLines={1}>{top3.name}</Text>
            <View style={styles.podiumInfoXpBadge}>
              <Text style={styles.podiumInfoXpText}>{top3.xp} XP</Text>
            </View>
          </View>
        </View>
      </View>
    </>
  );
})()}

            {/* Search Bar (STATIC FIXED) */}
            <View style={[styles.leaderboardSearchContainer, { marginTop: 0, paddingHorizontal: 0 }]}>
              <View style={{ flex: 1, marginRight: 12, borderRadius: 14, overflow: 'hidden', backgroundColor: 'rgba(192, 132, 252, 0.1)', position: 'relative', elevation: 4, shadowColor: '#C084FC', shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 6 }}>
                <Animated.View style={{
                  position: 'absolute',
                  top: '-50%', left: '-50%', right: '-50%', bottom: '-50%',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transform: [{ rotate: searchSpin }]
                }}>
                  <LinearGradient
                    colors={['transparent', '#C084FC', 'transparent']}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ width: '100%', height: 40 }}
                  />
                </Animated.View>
                <View style={[styles.leaderboardSearchBox, { flex: 1, margin: 1.5, borderWidth: 0, paddingVertical: 8 }]}>
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
                </View>
              </View>

              {/* My Profile Button */}
              <TouchableOpacity 
                style={styles.floatingMyProfileBtn}
                onPress={() => {
                  if (!user?.customId) {
                    showCustomAlert('Ogohlantirish', 'Foydalanuvchi ma\'lumotlari topilmadi!', 'warning');
                    return;
                  }
                  const userIndex = filteredLeaderboard.findIndex(item => item.customId === user.customId);
                  if (userIndex !== -1) {
                    setHighlightedUserId(user.customId);
                    
                    const ITEM_HEIGHT = 67; 
                    
                    leaderboardScrollRef.current?.scrollTo({ y: userIndex * ITEM_HEIGHT, animated: true });
                    
                    highlightAnim.setValue(0);
                    Animated.sequence([
                      Animated.timing(highlightAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
                      Animated.timing(highlightAnim, { toValue: 0.2, duration: 400, useNativeDriver: false }),
                      Animated.timing(highlightAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
                      Animated.timing(highlightAnim, { toValue: 0.2, duration: 400, useNativeDriver: false }),
                      Animated.timing(highlightAnim, { toValue: 1, duration: 400, useNativeDriver: false }),
                      Animated.timing(highlightAnim, { toValue: 0, duration: 500, useNativeDriver: false })
                    ]).start();

                    setTimeout(() => {
                      setHighlightedUserId(null);
                    }, 3000);
                  } else {
                    showCustomAlert('Ogohlantirish', 'Siz reyting jadvalidan topilmadingiz yoki qidiruv natijasiga mos kelmadingiz!', 'warning');
                  }
                }}
                activeOpacity={0.8}
              >
                <View style={styles.floatingMyProfileInner}>
                  <Feather name="user" size={24} color="#C084FC" />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {/* ONLY LEADERBOARD TABLE IS SCROLLABLE */}
          <ScrollView 
            ref={leaderboardScrollRef} 
            style={{ flex: 1 }} 
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }} 
            showsVerticalScrollIndicator={false}
          >
            <View style={[styles.leaderboardContainer, { marginTop: 0 }]}>
              {filteredLeaderboard.length > 0 ? (
                filteredLeaderboard.map((item, index) => (
                  <Animated.View key={item.customId || index} style={[
                    styles.leaderboardRow, 
                    (index !== filteredLeaderboard.length - 1 && item.customId !== highlightedUserId) && styles.leaderboardRowBorder,
                    item.customId === highlightedUserId && {
                      backgroundColor: highlightAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(192, 132, 252, 0.05)', 'rgba(192, 132, 252, 0.4)']
                      }),
                      borderColor: highlightAnim.interpolate({
                        inputRange: [0, 1],
                        outputRange: ['rgba(192, 132, 252, 0.3)', 'rgba(192, 132, 252, 1)']
                      }),
                      borderWidth: 2,
                      borderBottomWidth: 2, 
                      borderRadius: 12,
                      zIndex: 10,
                      elevation: 10,
                    }
                  ]}>
                    <Text style={styles.leaderboardRank}>{item.rank}</Text>
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
        
        <View style={{ flex: 1, width: '100%', height: '100%', display: activeTab === 'profile' ? 'flex' : 'none', backgroundColor: '#05050C', paddingTop: 10 }}>
          
          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 160, paddingHorizontal: 20 }} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled">
            {/* Header: Title */}
            <View style={{flexDirection: 'row', justifyContent: 'center', marginBottom: 20}}>
              <Text style={{color: '#fff', fontSize: 22, fontFamily: 'Inter_700Bold'}}>{t.navProfile}</Text>
            </View>

            {/* Avatar & Main Info Card */}
            <View style={styles.proCardGlass}>
              <View style={styles.proAvatarContainer}>
                <View style={styles.proAvatarGlow} />
                <Image source={baseAvatarsList.find(a => a.id === activeAvatarIndex)?.img || require('../assets/avatar_maks.png')} style={styles.proAvatarImg} />
                <View style={styles.proAvatarBadge}>
                  <Text style={styles.proAvatarBadgeText}>{user?.level || 12}</Text>
                </View>
              </View>
              <Text style={styles.proUserName} numberOfLines={1}>{user?.name || 'IQROMAX CHAMPION'}</Text>
              <Text style={styles.proUserTag} numberOfLines={1}>#{String(user?.customId || '0000').replace(/^#+/, '')} | {user?.email || "No Email"}</Text>
              
              <View style={styles.proTopStatsRow}>
                <View style={styles.proTopStatItem}>
                   <Image source={require('../assets/xp_icon.jpg')} style={styles.proTopStatIcon} />
                   <Text style={styles.proTopStatValue}>{userXp}</Text>
                   <Text style={styles.proTopStatLabel}>{t.statXP || 'XP'}</Text>
                </View>
                <View style={styles.proTopStatDivider} />
                <View style={styles.proTopStatItem}>
                   <Image source={require('../assets/s_coin.png')} style={styles.proTopStatIcon} />
                   <Text style={styles.proTopStatValue}>{userCoin}</Text>
                   <Text style={styles.proTopStatLabel}>{coinText || 'COIN'}</Text>
                </View>
                <View style={styles.proTopStatDivider} />
                <View style={styles.proTopStatItem}>
                   <Image source={require('../assets/lightning_energy.png')} style={styles.proTopStatIcon} />
                   <Text style={styles.proTopStatValue}>{currentEnergy}/10</Text>
                   <Text style={styles.proTopStatLabel}>{ENERGY_TRANSLATIONS[language] || ENERGY_TRANSLATIONS['uz']}</Text>
                </View>
              </View>
            </View>

            {/* Rank/Tier Holographic Card */}
            <View style={styles.proTierCard}>
              <ImageBackground source={require('../assets/space_bg.jpg')} style={styles.proTierBg} imageStyle={{borderRadius: 24, opacity: 0.6}}>
                <View style={styles.proTierOverlay}>
                  <View style={styles.proTierLeft}>
                    <Image source={require('../assets/gold_star.png')} style={styles.proTierIcon} />
                    <View>
                      <Text style={[styles.proTierTitle, { color: userRankInfo.color }]}>{userRankInfo.name}</Text>
                      <Text style={styles.proTierSub}>Top {userXp > 5000 ? '1' : userXp > 1000 ? '5' : '15'}% {TOP_PLAYERS_TRANSLATIONS[language] || TOP_PLAYERS_TRANSLATIONS['uz']}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.proTierProgressContainer}>
                    <View style={styles.proTierProgressHeader}>
                      <Text style={styles.proTierTarget}>{userRankInfo.isMax ? (MAX_RANK_TRANSLATIONS[language] || MAX_RANK_TRANSLATIONS['uz']) : RANK_TO_TRANSLATIONS[language] ? RANK_TO_TRANSLATIONS[language](userRankInfo.nextRankName) : RANK_TO_TRANSLATIONS['uz'](userRankInfo.nextRankName)}</Text>
                      <Text style={styles.proTierPercent}>{Math.round(userRankInfo.progressPercent)}%</Text>
                    </View>
                    <View style={styles.proTierProgressBar}>
                      <View style={[styles.proTierProgressFill, { width: `${Math.round(userRankInfo.progressPercent)}%`, backgroundColor: userRankInfo.color }]} />
                    </View>
                  </View>
                </View>
              </ImageBackground>
            </View>

            {/* REFERRAL CASHBACK & MYSTERY BOX ACTION CARDS */}
            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
              {/* Mystery Box Card */}
              <TouchableOpacity 
                style={{
                  flex: 1,
                  backgroundColor: '#1E1B4B',
                  borderRadius: 18,
                  padding: 14,
                  borderWidth: 1.5,
                  borderColor: '#A855F7',
                  shadowColor: '#A855F7',
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                  alignItems: 'center'
                }}
                activeOpacity={0.8}
                onPress={() => navigation.navigate('MysteryBox', { user, language })}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(168, 85, 247, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#A855F7' }}>
                  <MaterialCommunityIcons name="treasure-chest" size={26} color="#F59E0B" />
                </View>
                <Text style={{ color: '#FFF', fontSize: 13, fontFamily: 'Inter_700Bold', textAlign: 'center' }}>{mt.mysteryBox || 'SIRLI SANDIQ'}</Text>
                <View style={{ backgroundColor: '#A855F7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 6 }}>
                  <Text style={{ color: '#FFF', fontSize: 10, fontFamily: 'Inter_700Bold' }}>{mysteryKeysCount} {mt.taBox || 'ta sandiq'}</Text>
                </View>
              </TouchableOpacity>

              {/* Promo Code & Cashback Card */}
              <TouchableOpacity 
                style={{
                  flex: 1,
                  backgroundColor: '#0F172A',
                  borderRadius: 18,
                  padding: 14,
                  borderWidth: 1.5,
                  borderColor: '#38BDF8',
                  shadowColor: '#38BDF8',
                  shadowOpacity: 0.3,
                  shadowRadius: 8,
                  elevation: 6,
                  alignItems: 'center'
                }}
                activeOpacity={0.8}
                onPress={() => setIsReferralModalOpen(true)}
              >
                <View style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(56, 189, 248, 0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 8, borderWidth: 1, borderColor: '#38BDF8' }}>
                  <MaterialCommunityIcons name="ticket-percent" size={26} color="#38BDF8" />
                </View>
                <Text style={{ color: '#FFF', fontSize: 13, fontFamily: 'Inter_700Bold', textAlign: 'center' }}>{mt.promoCashback || 'PROMOKOD & KESHBEK'}</Text>
                <View style={{ backgroundColor: 'rgba(56, 189, 248, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10, marginTop: 6 }}>
                  <Text style={{ color: '#38BDF8', fontSize: 10, fontFamily: 'Inter_700Bold' }}>{mt.cashbackTag || '25% Keshbek'}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Stats Grid - Connected to Real User Data */}
            <View style={styles.proSectionHeader}>
              <Text style={styles.proSectionTitle}>{t.stats}</Text>
            </View>
            
            <View style={styles.proStatsGrid}>
              <View style={styles.proStatBox}>
                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#FBBF24" />
                <Text style={styles.proStatBoxValue}>{realStats.speedTime}s</Text>
                <Text style={styles.proStatBoxLabel}>{t.statSpeed}</Text>
              </View>
              <View style={styles.proStatBox}>
                <MaterialCommunityIcons name="bullseye-arrow" size={24} color="#10B981" />
                <Text style={styles.proStatBoxValue}>{realStats.accuracy}%</Text>
                <Text style={styles.proStatBoxLabel}>{t.statAccuracy}</Text>
              </View>
              <View style={styles.proStatBox}>
                <MaterialCommunityIcons name="brain" size={24} color="#3B82F6" />
                <Text style={styles.proStatBoxValue}>{realStats.logic}%</Text>
                <Text style={styles.proStatBoxLabel}>{t.logic}</Text>
              </View>
              <View style={styles.proStatBox}>
                <MaterialCommunityIcons name="trophy-award" size={24} color="#8B5CF6" />
                <Text style={styles.proStatBoxValue}>{userXp}</Text>
                <Text style={styles.proStatBoxLabel}>{t.statXP || 'XP'}</Text>
              </View>
            </View>

            {/* Timeline Activity - Real Dynamic Data (Last 3 entries) */}
            <View style={styles.proSectionHeader}>
              <Text style={styles.proSectionTitle}>{t.activityTitle}</Text>
            </View>
            
            <View style={styles.proTimelineContainer}>
              {activityHistory.length > 0 ? (
                activityHistory.map((item, index) => {
                  const colors = ['#10B981', '#3B82F6', '#A855F7'];
                  const themeColor = colors[index % colors.length];
                  const isLast = index === activityHistory.length - 1;

                  // Translate activity title dynamically if matches known titles
                  let translatedTitle = item.title;
                  if (item.title === "1v1 Boshma-bosh o'yin") {
                    translatedTitle = t.bmOddiy || "1v1 Battle";
                  } else if (item.title === "Abakus simulyatori") {
                    translatedTitle = t.actAbacus || "Abacus Simulator";
                  } else if (item.title === "Ko'paytirish va bo'lish") {
                    translatedTitle = `${t.abacusMult || 'Multiplication'} & ${t.abacusDiv || 'Division'}`;
                  } else if (item.title === "Tasavvur (Oddiy hisob)") {
                    translatedTitle = t.actSimple || "Simple Math";
                  }

                  // Translate 'Bugun' in time string
                  const translatedTime = item.time ? item.time.replace("Bugun", t.actToday || "Today") : "";

                  return (
                    <View key={item.id || index} style={styles.proTimelineItem}>
                      <View style={styles.proTimelineDotLine}>
                        <View style={[styles.proTimelineDot, { backgroundColor: themeColor, shadowColor: themeColor }]} />
                        {!isLast && <View style={styles.proTimelineLine} />}
                      </View>
                      <View style={styles.proTimelineContent}>
                        <View style={{ flex: 1 }}>
                          <Text style={styles.proTimelineTitle}>{translatedTitle}</Text>
                          <Text style={styles.proTimelineSub}>{translatedTime}</Text>
                        </View>
                        <View style={[styles.proTimelineTag, { backgroundColor: `${themeColor}20` }]}>
                          <Text style={[styles.proTimelineTagText, { color: themeColor }]}>
                            {item.xpGained > 0 ? `+${item.xpGained} XP` : (t.doneTag || 'Bajarildi')}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })
              ) : (
                <View style={{ paddingVertical: 15, alignItems: 'center' }}>
                  <Text style={{ color: '#6B7280', fontSize: 12, fontFamily: 'Inter_500Medium' }}>
                    Hali o'yinlar tarixi mavjud emas
                  </Text>
                </View>
              )}
            </View>

            {/* Language Settings */}
            <View style={styles.proSectionHeader}>
              <Text style={styles.proSectionTitle}>{CHANGE_LANGUAGE_TEXT[language] || CHANGE_LANGUAGE_TEXT['uz']}</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.languageScrollContainer}>
              {AVAILABLE_LANGUAGES.map((lang) => {
                const isActive = language === lang.code;
                return (
                  <TouchableOpacity 
                    key={lang.code}
                    style={[styles.languageCard, isActive && styles.languageCardActive]}
                    activeOpacity={0.7}
                    onPress={async () => {
                      try {
                        const userDataStr = await AsyncStorage.getItem('user_data');
                        if (userDataStr) {
                          const userData = JSON.parse(userDataStr);
                          userData.language = lang.code;
                          await AsyncStorage.setItem('user_data', JSON.stringify(userData));
                        }
                        navigation.setParams({ language: lang.code });
                      } catch (e) {
                        console.error('Error changing language:', e);
                      }
                    }}
                  >
                    <Text style={[styles.languageFlag, isActive && styles.languageFlagActive]}>{lang.flag}</Text>
                    <Text style={[styles.languageName, isActive && styles.languageNameActive]}>{lang.name}</Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Logout Button */}
            <TouchableOpacity 
              style={styles.proLogoutBtn}
              activeOpacity={0.8}
              onPress={async () => {
                try {
                  await AsyncStorage.removeItem('user_data');
                } catch (e) {}
                navigation.reset({ index: 0, routes: [{ name: 'StepOne' }] });
              }}
            >
              <MaterialCommunityIcons name="logout-variant" size={20} color="#EF4444" />
              <Text style={styles.proLogoutText}>{t.logout}</Text>
            </TouchableOpacity>

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
            onPress={() => checkGuestAuth(() => setActiveTab('profile'))}
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

        {/* NOTIFICATION SECTION MODAL */}
        <Modal transparent visible={isNotifModalOpen} animationType="fade">
          <View style={styles.notifModalOverlay}>
            <View style={styles.notifModalCard}>
              <View style={styles.notifModalHeader}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <MaterialCommunityIcons name="bell-ring" size={24} color="#FBBF24" style={{ marginRight: 8 }} />
                  <Text style={styles.notifModalTitle}>Xabarnomalar</Text>
                </View>
                <TouchableOpacity onPress={() => setIsNotifModalOpen(false)}>
                  <MaterialCommunityIcons name="close-circle" size={26} color="#9CA3AF" />
                </TouchableOpacity>
              </View>

              <ScrollView style={{ maxHeight: 400, width: '100%' }} showsVerticalScrollIndicator={false}>
                {notificationsList.length === 0 ? (
                  <View style={styles.notifEmptyBox}>
                    <MaterialCommunityIcons name="bell-off-outline" size={50} color="#4B5563" style={{ marginBottom: 12 }} />
                    <Text style={styles.notifEmptyTitle}>Xabarnomalar yo'q</Text>
                    <Text style={styles.notifEmptySub}>Hozircha sizga yangi xabarnomalar kelmadi</Text>
                  </View>
                ) : (
                  notificationsList.map((notif, idx) => {
                    if (notif.type === 'BATTLE_INVITE') {
                      return (
                        <View key={notif.id || idx} style={styles.notifItemCard}>
                          <View style={styles.notifItemHeader}>
                            <Image 
                              source={notif.senderAvatar ? { uri: notif.senderAvatar } : require('../assets/avatar_alex.jpg')} 
                              style={styles.notifItemAvatar} 
                            />
                            <View style={{ flex: 1 }}>
                              <Text style={styles.notifItemSender}>{notif.senderName || 'Foydalanuvchi'}</Text>
                              <Text style={styles.notifItemStats}>Level {notif.level || 1} • Rating {notif.rating || 1000}</Text>
                            </View>
                            <View style={styles.notifBadge}>
                              <Text style={styles.notifBadgeText}>Yangi</Text>
                            </View>
                          </View>
                          <Text style={styles.notifItemMsg}>⚔️ Sizni jangga taklif qilgandi!</Text>
                          <View style={styles.notifItemActions}>
                            <TouchableOpacity 
                              style={styles.notifRejectBtn} 
                              onPress={() => handleNotifRespond(notif, 'REJECTED')}
                            >
                              <MaterialCommunityIcons name="close" size={16} color="#FFF" style={{ marginRight: 4 }} />
                              <Text style={styles.notifRejectText}>Rad etish</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                              style={styles.notifAcceptBtn} 
                              onPress={() => handleNotifRespond(notif, 'ACCEPTED')}
                            >
                              <MaterialCommunityIcons name="sword-cross" size={16} color="#FFF" style={{ marginRight: 4 }} />
                              <Text style={styles.notifAcceptText}>Qabul qilish</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    } else {
                      return (
                        <View key={notif.id || idx} style={styles.notifItemCard}>
                          <View style={styles.notifItemHeader}>
                            <View style={[styles.notifItemAvatar, { backgroundColor: 'rgba(168, 85, 247, 0.2)', justifyContent: 'center', alignItems: 'center' }]}>
                              <MaterialCommunityIcons name={notif.type === 'ADMIN' ? 'shield-crown-outline' : 'bell-ring-outline'} size={24} color="#A855F7" />
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={styles.notifItemSender}>{notif.title || 'Tizim Xabari'}</Text>
                              <Text style={styles.notifItemStats}>{new Date(notif.createdAt).toLocaleDateString()}</Text>
                            </View>
                          </View>
                          <Text style={styles.notifItemMsg}>{notif.message || ''}</Text>
                          <View style={styles.notifItemActions}>
                            <TouchableOpacity 
                              style={[styles.notifAcceptBtn, { backgroundColor: '#3B82F6', width: '100%' }]} 
                              onPress={() => handleNotifRespond(notif, 'READ')}
                            >
                              <MaterialCommunityIcons name="check-all" size={16} color="#FFF" style={{ marginRight: 4 }} />
                              <Text style={styles.notifAcceptText}>O'qildi</Text>
                            </TouchableOpacity>
                          </View>
                        </View>
                      );
                    }
                  })
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

      {/* Energy Alert Modal */}
      <Modal
        visible={isEnergyAlertVisible}
        transparent={true}
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#1E1E2E' }]}>
            <View style={[styles.modalIconContainer, { backgroundColor: 'rgba(239,68,68,0.1)' }]}>
              <MaterialCommunityIcons name="lightning-bolt" size={32} color="#EF4444" />
            </View>
            <Text style={[styles.modalTitle, { color: '#EF4444' }]}>{t.alertEnergyTitle || "Diqqat!"}</Text>
            <Text style={styles.modalDesc}>
              {t.alertEnergyText || "Sizda kerakli energiya mavjud emas. Bitta energiya to'lishiga "}
              <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold' }}> {formattedTime}</Text>
            </Text>
            
            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#F59E0B', flex: 1 }]} 
                onPress={() => setIsEnergyAlertVisible(false)}
              >
                <Text style={[styles.modalBtnPrimaryText, { color: '#FFF' }]}>{t.alertEnergyBtn || "Yopish"}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AUTHORIZATION REQUIRED MODAL */}
      <Modal visible={isAuthModalOpen} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: '#0D0D1A', borderWidth: 1, borderColor: '#A855F7', padding: 20 }]}>
            <View style={{ alignItems: 'center', marginBottom: 15 }}>
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(168, 85, 247, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: '#A855F7' }}>
                <MaterialCommunityIcons name="lock-alert-outline" size={32} color="#A855F7" />
              </View>
              <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 6 }}>
                {t.authModalTitle || "Avtorizatsiyadan o'ting"}
              </Text>
              <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', lineHeight: 18 }}>
                {t.authModalDesc || "Ilovadagi barcha imkoniyatlar va funksiyalardan to'liq foydalanish uchun ma'lumotlaringizni to'ldiring."}
              </Text>
            </View>

            {/* Registration Form Fields */}
            <View style={{ gap: 10, width: '100%', marginBottom: 15 }}>
              <View style={styles.authInputWrapper}>
                <Feather name="phone" size={16} color="#888899" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.authInputField}
                  placeholder={t.authPhonePlaceholder || "Telefon raqamingiz"}
                  placeholderTextColor="#555566"
                  keyboardType="phone-pad"
                  value={authPhone}
                  onChangeText={setAuthPhone}
                />
              </View>

              <View style={styles.authInputWrapper}>
                <Feather name="mail" size={16} color="#888899" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.authInputField}
                  placeholder={t.authEmailPlaceholder || "Elektron pochtangiz"}
                  placeholderTextColor="#555566"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={authEmail}
                  onChangeText={setAuthEmail}
                />
              </View>

              <View style={styles.authInputWrapper}>
                <Feather name="lock" size={16} color="#888899" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.authInputField}
                  placeholder={t.authPasswordPlaceholder || "Parolingiz"}
                  placeholderTextColor="#555566"
                  secureTextEntry={!authShowPassword}
                  value={authPassword}
                  onChangeText={setAuthPassword}
                />
                <TouchableOpacity onPress={() => setAuthShowPassword(!authShowPassword)}>
                  <Feather name={authShowPassword ? "eye" : "eye-off"} size={16} color="#888899" />
                </TouchableOpacity>
              </View>

              <View style={styles.authInputWrapper}>
                <Feather name="lock" size={16} color="#888899" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.authInputField}
                  placeholder={t.authConfirmPasswordPlaceholder || "Parolni tasdiqlang"}
                  placeholderTextColor="#555566"
                  secureTextEntry={!authShowConfirmPassword}
                  value={authConfirmPassword}
                  onChangeText={setAuthConfirmPassword}
                />
                <TouchableOpacity onPress={() => setAuthShowConfirmPassword(!authShowConfirmPassword)}>
                  <Feather name={authShowConfirmPassword ? "eye" : "eye-off"} size={16} color="#888899" />
                </TouchableOpacity>
              </View>

              <View style={styles.authInputWrapper}>
                <MaterialCommunityIcons name="ticket-percent-outline" size={16} color="#888899" style={{ marginRight: 10 }} />
                <TextInput
                  style={styles.authInputField}
                  placeholder="Promokod (ixtiyoriy)"
                  placeholderTextColor="#555566"
                  autoCapitalize="characters"
                  value={authPromo}
                  onChangeText={setAuthPromo}
                />
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 10, width: '100%' }}>
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#1A1A2E', flex: 0.4 }]}
                onPress={() => setIsAuthModalOpen(false)}
              >
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold' }}>{t.authCloseBtn || "Yopish"}</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#A855F7', flex: 0.6 }]}
                disabled={authLoading}
                onPress={async () => {
                  if (!authPhone.trim() || !authEmail.trim() || !authPassword || !authConfirmPassword) {
                    Alert.alert('Xatolik', 'Iltimos, barcha maydonlarni to\'ldiring!');
                    return;
                  }
                  if (authPassword !== authConfirmPassword) {
                    Alert.alert('Xatolik', 'Parollar mos kelmadi!');
                    return;
                  }

                  setAuthLoading(true);
                  try {
                    const controller = new AbortController();
                    const timeoutId = setTimeout(() => controller.abort(), 8000);

                    const response = await fetch(`${API_URL}/auth/send-otp`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: authEmail.trim(), name: user?.name || 'O\'quvchi', language }),
                      signal: controller.signal
                    }).finally(() => clearTimeout(timeoutId));

                    const data = await response.json();
                    if (response.ok) {
                      setIsAuthModalOpen(false);
                      setIsOtpModalOpen(true);
                    } else {
                      const errMsg = String(data.error || 'Server xatosi yuz berdi');
                      const isDup = errMsg.toLowerCase().includes('already') || 
                                    errMsg.toLowerCase().includes('mavjud') || 
                                    errMsg.toLowerCase().includes('ro\'yxatdan') || 
                                    errMsg.toLowerCase().includes('registered') ||
                                    errMsg.toLowerCase().includes('oldin');

                      if (isDup) {
                        showCustomAlert(
                          t.authDupTitle || 'Ogohlantirish',
                          t.authDupMsg || 'Bu email yoki telefon raqamidan oldin ro\'yxatdan o\'tilgan. Iltimos, boshqa ma\'lumot kiriting yoki tizimga kiring.',
                          'warning',
                          [
                            {
                              text: t.authTryAgainBtn || 'Boshqatdan urinib ko\'rish',
                              onPress: () => {
                                setAuthEmail('');
                                setAuthPhone('');
                                setAuthPassword('');
                                setAuthConfirmPassword('');
                              }
                            },
                            {
                              text: t.authLoginBtn || 'Kirish',
                              onPress: () => {
                                setIsAuthModalOpen(false);
                                navigation.navigate('AuthScreen', { language, initialTab: 'login' });
                              }
                            }
                          ]
                        );
                      } else {
                        showCustomAlert('Xatolik', errMsg, 'warning');
                      }
                    }
                  } catch (e) {
                    console.log('Send OTP catch error:', e);
                    // Open OTP modal directly as graceful fallback so user is never blocked
                    setIsAuthModalOpen(false);
                    setIsOtpModalOpen(true);
                  } finally {
                    setAuthLoading(false);
                  }
                }}
              >
                {authLoading ? (
                  <ActivityIndicator color="#FFF" />
                ) : (
                  <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold' }}>{t.authSaveBtn || "Saqlash"}</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* EMAIL OTP VERIFICATION MODAL */}
      <Modal visible={isOtpModalOpen} transparent animationType="fade">
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalOverlay}
        >
          <View style={[styles.modalContent, { backgroundColor: '#0D0D1A', borderWidth: 1, borderColor: '#10B981', padding: 20, alignItems: 'center' }]}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(16, 185, 129, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: '#10B981' }}>
              <MaterialCommunityIcons name="email-check-outline" size={32} color="#10B981" />
            </View>

            <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 6 }}>
              {t.otpTitle || "Emailni tasdiqlang"}
            </Text>
            <Text style={{ color: '#9CA3AF', fontSize: 12, textAlign: 'center', marginBottom: 20, lineHeight: 18 }}>
              {t.otpSub1 || "Biz 4 xonali tasdiqlash kodini "}<Text style={{ color: '#10B981', fontWeight: 'bold' }}>{authEmail}</Text>{t.otpSub2 || " manziliga yubordik."}
            </Text>

            {/* OTP Inputs */}
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 20 }}>
              {otpCode.map((digit, idx) => (
                <TextInput
                  key={idx}
                  ref={(ref) => (otpInputRefs.current[idx] = ref)}
                  style={{
                    width: 50,
                    height: 60,
                    borderRadius: 12,
                    borderWidth: 2,
                    borderColor: digit ? '#10B981' : '#1A1A2E',
                    backgroundColor: '#05050C',
                    color: '#FFF',
                    fontSize: 24,
                    fontFamily: 'Inter_700Bold',
                    textAlign: 'center'
                  }}
                  keyboardType="numeric"
                  maxLength={1}
                  value={digit}
                  onChangeText={(text) => {
                    const newOtp = [...otpCode];
                    newOtp[idx] = text;
                    setOtpCode(newOtp);
                    if (text && idx < 3) {
                      otpInputRefs.current[idx + 1]?.focus();
                    }
                  }}
                />
              ))}
            </View>

            {otpLoading ? (
              <ActivityIndicator color="#10B981" style={{ marginBottom: 15 }} />
            ) : (
              <TouchableOpacity 
                style={[styles.modalBtn, { backgroundColor: '#10B981', width: '100%', paddingVertical: 14 }]}
                onPress={async () => {
                  const code = otpCode.join('');
                  if (code.length < 4) {
                    showCustomAlert('Xatolik', 'Iltimos, 4 xonali kodni kiriting!', 'warning');
                    return;
                  }

                  setOtpLoading(true);
                  try {
                    const verifyRes = await fetch(`${API_URL}/auth/verify-otp`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: authEmail.trim(), otp: code })
                    });

                    if (!verifyRes.ok) {
                      const errData = await verifyRes.json();
                      showCustomAlert('Xatolik', errData.error || 'Kod noto\'g\'ri!', 'warning');
                      setOtpLoading(false);
                      return;
                    }

                    // Register user on server
                    const regRes = await fetch(`${API_URL}/auth/register`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        role: user?.role || 'student',
                        name: user?.name || 'O\'quvchi',
                        phone: authPhone.trim(),
                        email: authEmail.trim(),
                        password: authPassword,
                        country: user?.country || 'UZ',
                        language,
                        character: user?.character || 'maks',
                        referralCode: authPromo.trim() || undefined
                      })
                    });

                    const regData = await regRes.json();
                    if (regRes.ok) {
                      const fullUser = { 
                        ...user,
                        ...regData.user, 
                        isGuest: false,
                        phone: authPhone.trim(),
                        email: authEmail.trim()
                      };
                      await AsyncStorage.setItem('user_data', JSON.stringify(fullUser));
                      setUser(fullUser);
                      if (route.params?.user) {
                        route.params.user.isGuest = false;
                        route.params.user.phone = authPhone.trim();
                        route.params.user.email = authEmail.trim();
                      }
                      setIsOtpModalOpen(false);
                      setIsAuthModalOpen(false);
                      showCustomAlert(
                        t.authSuccessTitle || 'Muvaffaqiyatli!', 
                        t.authSuccessMsg || 'Akkauntingiz muvaffaqiyatli avtorizatsiyadan o\'tdi! Barcha imkoniyatlar ochildi.',
                        'success',
                        [
                          {
                            text: 'OK',
                            onPress: () => {
                              setActiveTab('profile');
                            }
                          }
                        ]
                      );
                    } else {
                      Alert.alert('Xatolik', regData.error || 'Ro\'yxatdan o\'tishda xatolik');
                    }
                  } catch (e) {
                    Alert.alert('Xatolik', 'Tarmoq xatosi yuz berdi');
                  } finally {
                    setOtpLoading(false);
                  }
                }}
              >
                <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 16 }}>{t.otpVerifyBtn || "Tasdiqlash"}</Text>
              </TouchableOpacity>
            )}
          </View>
        </KeyboardAvoidingView>
      </Modal>

      {/* REFERRAL & CASHBACK MODAL */}
      <Modal visible={isReferralModalOpen} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#0B0F19', borderWidth: 1.5, borderColor: '#38BDF8', padding: 22, borderRadius: 24, maxHeight: '85%' }]}>
            
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, width: '100%' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, paddingRight: 10 }}>
                <MaterialCommunityIcons name="ticket-percent" size={24} color="#38BDF8" />
                <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Inter_700Bold' }} numberOfLines={1}>PROMOKOD & KESHBEK</Text>
              </View>
              <TouchableOpacity 
                onPress={() => setIsReferralModalOpen(false)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close-circle" size={26} color="#9CA3AF" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
              {/* Promo Code Box */}
              <View style={{ backgroundColor: '#1E293B', borderRadius: 16, padding: 16, borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)' }}>
                <Text style={{ color: '#94A3B8', fontSize: 11, fontFamily: 'Inter_600SemiBold', textTransform: 'uppercase', marginBottom: 6 }}>Sizning Shaxsiy Promokodingiz</Text>
                
                {isEditingPromo ? (
                  <View style={{ flexDirection: 'row', gap: 8 }}>
                    <TextInput 
                      style={{ flex: 1, backgroundColor: '#0F172A', color: '#38BDF8', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8, fontFamily: 'Inter_700Bold', borderWidth: 1, borderColor: '#38BDF8' }}
                      value={newPromoInput}
                      onChangeText={setNewPromoInput}
                      placeholder="Yangi promokod"
                      placeholderTextColor="#64748B"
                      autoCapitalize="characters"
                    />
                    <TouchableOpacity 
                      style={{ backgroundColor: '#38BDF8', paddingHorizontal: 16, borderRadius: 10, justifyContent: 'center' }}
                      onPress={() => {
                        if (!newPromoInput.trim()) return;
                        if (promoChangeCount > 0) {
                          showCustomAlert('Pullik xizmat', 'Promokodni qayta o\'zgartirish 500 coin yoki $0.99 turadi', 'warning');
                        }
                        setMyPromoCode(newPromoInput.trim().toUpperCase());
                        setPromoChangeCount(prev => prev + 1);
                        setIsEditingPromo(false);
                        showCustomAlert('Muvaffaqiyatli', 'Promokod yangilandi!', 'success');
                      }}
                    >
                      <Text style={{ color: '#0F172A', fontFamily: 'Inter_700Bold' }}>Saqlash</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text style={{ color: '#38BDF8', fontSize: 20, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1 }}>{myPromoCode}</Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TouchableOpacity 
                        style={{ backgroundColor: 'rgba(56, 189, 248, 0.15)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}
                        onPress={async () => {
                          await Clipboard.setStringAsync(myPromoCode);
                          showCustomAlert('Nusxalandi!', 'Promokod nusxalandi', 'success');
                        }}
                      >
                        <Text style={{ color: '#38BDF8', fontSize: 12, fontFamily: 'Inter_700Bold' }}>Nusxalash</Text>
                      </TouchableOpacity>
                      <TouchableOpacity 
                        style={{ backgroundColor: 'rgba(255, 255, 255, 0.08)', paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 }}
                        onPress={() => {
                          setNewPromoInput(myPromoCode);
                          setIsEditingPromo(true);
                        }}
                      >
                        <MaterialCommunityIcons name="pencil" size={16} color="#94A3B8" />
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
                
                <Text style={{ color: '#64748B', fontSize: 10, marginTop: 8, fontFamily: 'Inter_400Regular' }}>
                  * Birinchi tahrirlash bepul, keyingi o'zgartirishlar pullik bo'ladi.
                </Text>
              </View>

              {/* Cashback Stats Grid - Clean Locked Overlay */}
              <Text style={{ color: '#FFF', fontSize: 14, fontFamily: 'Inter_700Bold', marginTop: 4 }}>KESHBEK HAMYONI (25%)</Text>

              <View style={{ position: 'relative', marginTop: 8 }}>
                <View style={{ flexDirection: 'row', gap: 10, opacity: 0.35 }}>
                  {/* 1. Potential Cashback */}
                  <View style={{ flex: 1, backgroundColor: '#0B132B', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#1E293B' }}>
                    <MaterialCommunityIcons name="clock-outline" size={20} color="#64748B" />
                    <Text style={{ color: '#64748B', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 6 }}>Ehtimoliy Keshbek</Text>
                    <Text style={{ color: '#64748B', fontSize: 16, fontFamily: 'Inter_800ExtraBold', marginTop: 2 }}>${potentialCashback}</Text>
                    <Text style={{ color: '#475569', fontSize: 8, marginTop: 4, lineHeight: 11 }}>Taklif etilgan do'stlaringiz balansidan 25% qismi.</Text>
                  </View>

                  {/* 2. Real Cashback */}
                  <View style={{ flex: 1, backgroundColor: '#0B132B', padding: 14, borderRadius: 16, borderWidth: 1, borderColor: '#1E293B' }}>
                    <MaterialCommunityIcons name="cash-multiple" size={20} color="#64748B" />
                    <Text style={{ color: '#64748B', fontSize: 10, fontFamily: 'Inter_600SemiBold', marginTop: 6 }}>Haqiqiy Keshbek</Text>
                    <Text style={{ color: '#64748B', fontSize: 16, fontFamily: 'Inter_800ExtraBold', marginTop: 2 }}>${realCashback}</Text>
                    <Text style={{ color: '#475569', fontSize: 8, marginTop: 4, lineHeight: 11 }}>Ilova ichida xarid qilish uchun tayyor.</Text>
                  </View>
                </View>

                {/* Center Lock Badge Overlay */}
                <View style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center' }}>
                  <View style={{ backgroundColor: 'rgba(15, 23, 42, 0.94)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 14, borderWidth: 1, borderColor: '#F59E0B', flexDirection: 'row', alignItems: 'center', gap: 8, shadowColor: '#F59E0B', shadowOpacity: 0.3, shadowRadius: 6, elevation: 5 }}>
                    <MaterialCommunityIcons name="lock-clock" size={20} color="#F59E0B" />
                    <Text style={{ color: '#F1F5F9', fontSize: 11, fontFamily: 'Inter_700Bold' }}>{mt.realPaymentsLock || "Real to'lovlar bilan faollashadi"}</Text>
                  </View>
                </View>
              </View>

              {/* Share Referral Link Button */}
              <TouchableOpacity 
                style={{ backgroundColor: '#38BDF8', paddingVertical: 14, borderRadius: 14, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 6 }}
                activeOpacity={0.8}
                onPress={() => {
                  const promo = user?.customId ? user.customId.replace(/^#+/, '') : 'IQROMAX';
                  const link = `https://iqromax.net/downloading?promo=${promo}`;
                  Share.share({
                    message: `IQROMAX ilovasida ro'yxatdan o'ting va 3 kunlik BEPUL Premium hamda Sirli Sandiq sovg'asini oling!\n\nMening promokodim: ${promo}\n\nIlovani yuklab olish uchun havola:\n${link}`
                  });
                }}
              >
                <MaterialCommunityIcons name="share-variant" size={20} color="#0F172A" />
                <Text style={{ color: '#0F172A', fontFamily: 'Inter_700Bold', fontSize: 15 }}>DO'STLARNI TAKLIF QILISH</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* MYSTERY BOX MODAL */}
      <Modal visible={isMysteryBoxModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: '#0D091B', borderWidth: 1.5, borderColor: '#A855F7', padding: 24, borderRadius: 26, alignItems: 'center' }]}>
            
            <TouchableOpacity 
              style={{ position: 'absolute', top: 16, right: 16 }}
              onPress={() => {
                setIsMysteryBoxModalOpen(false);
                setBoxReward(null);
              }}
            >
              <MaterialCommunityIcons name="close-circle" size={26} color="#9CA3AF" />
            </TouchableOpacity>

            <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_800ExtraBold', textAlign: 'center', marginBottom: 4 }}>
              SIRLI SANDIQ 🎁
            </Text>
            <Text style={{ color: '#C084FC', fontSize: 12, textAlign: 'center', fontFamily: 'Inter_600SemiBold', marginBottom: 20 }}>
              {mysteryKeysCount > 0 ? `Sizda ${mysteryKeysCount} ta sandiq bor!` : "Imkoniyatlar tugadi. Do'stlaringizni taklif qiling!"}
            </Text>

            {/* Glowing Box Image / Animation */}
            <View style={{ width: 140, height: 140, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <Image 
                source={require('../assets/level_chest.png')} 
                style={{ width: 130, height: 130 }} 
                contentFit="contain" 
              />
            </View>

            {boxReward ? (
              <View style={{ backgroundColor: 'rgba(168, 85, 247, 0.15)', borderWidth: 1, borderColor: '#A855F7', borderRadius: 16, padding: 16, alignItems: 'center', width: '100%', marginBottom: 20 }}>
                <Text style={{ color: '#F59E0B', fontSize: 12, fontFamily: 'Inter_700Bold', textTransform: 'uppercase', marginBottom: 4 }}>TABRIKLAYMIZ! 🎉</Text>
                <Text style={{ color: '#FFF', fontSize: 16, fontFamily: 'Inter_800ExtraBold', textAlign: 'center' }}>{boxReward}</Text>
              </View>
            ) : null}

            {/* Action Button */}
            <TouchableOpacity 
              style={{
                width: '100%',
                paddingVertical: 14,
                borderRadius: 14,
                backgroundColor: mysteryKeysCount > 0 ? '#A855F7' : '#374151',
                alignItems: 'center',
                shadowColor: '#A855F7',
                shadowOpacity: 0.5,
                shadowRadius: 10
              }}
              disabled={mysteryKeysCount <= 0 || isOpeningBox}
              activeOpacity={0.8}
              onPress={() => {
                setIsOpeningBox(true);
                setTimeout(async () => {
                  const rewards = [
                    '3 kunlik BEPUL Premium Status! 👑',
                    '+250 Oltin Coinlar! 🪙',
                    '20% Maxsus Chegirma Kuponi! 🏷️',
                    '+500 Oltin Coinlar! 🪙',
                    '1 kunlik BEPUL Premium! ⚡',
                    'Nodir Personaj Skini! 🎭'
                  ];
                  const randomReward = rewards[Math.floor(Math.random() * rewards.length)];
                  setBoxReward(randomReward);
                  const nextKeys = Math.max(0, mysteryKeysCount - 1);
                  setMysteryKeysCount(nextKeys);
                  try {
                    const uIdKey = user?.customId || user?.id || 'guest';
                    await AsyncStorage.setItem(`user_mystery_keys_count_${uIdKey}`, nextKeys.toString());
                  } catch(e) {}
                  setIsOpeningBox(false);
                }, 800);
              }}
            >
              <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 16 }}>
                {isOpeningBox ? "OCHILMOQDA..." : mysteryKeysCount > 0 ? "SANDIQNI OCHISH ✨" : "KALITLAR TUGADI"}
              </Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>

      {/* SHOP MODAL (Oldi-Sotti Do'kon) */}
      <Modal visible={isShopModalOpen} transparent={false} animationType="slide" statusBarTranslucent={true}>
        <View style={{ flex: 1, backgroundColor: '#05050C', paddingTop: Platform.OS === 'ios' ? 44 : (StatusBar.currentHeight || 24) }}>
          <StatusBar barStyle="light-content" backgroundColor="#05050C" translucent={true} />
          <View style={{ flex: 1 }}>
            {/* Shop Header (Fixed Strict Standard Height) */}
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              paddingHorizontal: 18,
              paddingTop: 12,
              paddingBottom: 14,
              backgroundColor: 'rgba(15, 15, 30, 0.95)',
              borderBottomWidth: 1,
              borderBottomColor: 'rgba(245, 158, 11, 0.2)',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 6 },
              shadowOpacity: 0.4,
              shadowRadius: 10,
              elevation: 8
            }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}>
                <LinearGradient
                  colors={['#F59E0B', '#D97706']}
                  style={{ 
                    width: 44, 
                    height: 44, 
                    borderRadius: 14, 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    marginRight: 12,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    shadowColor: '#F59E0B',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.5,
                    shadowRadius: 6
                  }}
                >
                  <FontAwesome5 name="store" size={18} color="#FFF" />
                </LinearGradient>
                <View style={{ flex: 1, marginRight: 8 }}>
                  <Text style={{ color: '#FFF', fontSize: 17, fontFamily: 'Inter_900Black', letterSpacing: 0.6 }} numberOfLines={1}>
                    {t.shopTitle || "IQROSHOP DO'KON"}
                  </Text>
                </View>
              </View>

              {/* User Balance Badge */}
              <View style={{ 
                flexDirection: 'row', 
                alignItems: 'center', 
                backgroundColor: 'rgba(245, 158, 11, 0.15)', 
                borderWidth: 1.5, 
                borderColor: '#F59E0B', 
                paddingHorizontal: 12, 
                paddingVertical: 7, 
                borderRadius: 22, 
                marginRight: 10 
              }}>
                <Image source={require('../assets/s_coin.png')} style={{ width: 20, height: 20, marginRight: 6 }} />
                <Text style={{ color: '#F59E0B', fontFamily: 'Inter_900Black', fontSize: 15 }}>{userCoin}</Text>
              </View>

              <TouchableOpacity 
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.08)', 
                  borderWidth: 1, 
                  borderColor: 'rgba(255, 255, 255, 0.15)', 
                  width: 38, 
                  height: 38, 
                  borderRadius: 19, 
                  justifyContent: 'center', 
                  alignItems: 'center' 
                }}
                activeOpacity={0.7}
                onPress={() => setIsShopModalOpen(false)}
              >
                <Ionicons name="close" size={22} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Shop Main Category Tabs */}
            <View style={{ flexDirection: 'row', paddingHorizontal: 15, paddingTop: 15, paddingBottom: 10, gap: 8 }}>
              {/* Tab 1: Inventar */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: activeShopTab === 'inventory' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  borderWidth: 1.5,
                  borderColor: activeShopTab === 'inventory' ? '#F59E0B' : 'rgba(255, 255, 255, 0.08)',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6
                }}
                onPress={() => setActiveShopTab('inventory')}
              >
                <FontAwesome5 name="tshirt" size={14} color={activeShopTab === 'inventory' ? '#F59E0B' : '#888899'} />
                <Text style={{ color: activeShopTab === 'inventory' ? '#F59E0B' : '#888899', fontFamily: 'Inter_700Bold', fontSize: 12 }}>{t.shopInventory || "INVENTAR"}</Text>
              </TouchableOpacity>

              {/* Tab 2: Energiya */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: activeShopTab === 'energy' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  borderWidth: 1.5,
                  borderColor: activeShopTab === 'energy' ? '#F59E0B' : 'rgba(255, 255, 255, 0.08)',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6
                }}
                onPress={() => setActiveShopTab('energy')}
              >
                <MaterialCommunityIcons name="lightning-bolt" size={16} color={activeShopTab === 'energy' ? '#F59E0B' : '#888899'} />
                <Text style={{ color: activeShopTab === 'energy' ? '#F59E0B' : '#888899', fontFamily: 'Inter_700Bold', fontSize: 12 }}>{t.shopEnergy || "ENERGIYA"}</Text>
              </TouchableOpacity>

              {/* Tab 3: Sirli Sandiq */}
              <TouchableOpacity
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 14,
                  backgroundColor: activeShopTab === 'mystery' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  borderWidth: 1.5,
                  borderColor: activeShopTab === 'mystery' ? '#F59E0B' : 'rgba(255, 255, 255, 0.08)',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6
                }}
                onPress={() => setActiveShopTab('mystery')}
              >
                <MaterialCommunityIcons name="treasure-chest" size={16} color={activeShopTab === 'mystery' ? '#F59E0B' : '#888899'} />
                <Text style={{ color: activeShopTab === 'mystery' ? '#F59E0B' : '#888899', fontFamily: 'Inter_700Bold', fontSize: 12 }}>{t.shopMystery || "SANDIQ"}</Text>
              </TouchableOpacity>
            </View>

            {/* TAB CONTENT AREA */}
            <ScrollView contentContainerStyle={{ paddingHorizontal: 15, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              
              {/* === INVENTAR (SKINLAR) SECTION === */}
              {activeShopTab === 'inventory' && (
                <View>
                  {/* Skin Sub-categories filter horizontal scroll */}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingVertical: 10 }}>
                    {[
                      { id: 'headwear', label: t.shopHeadwear || 'Bosh kiyim', icon: 'hat-cowboy' },
                      { id: 'top', label: t.shopTop || 'Ustki kiyim', icon: 'tshirt' },
                      { id: 'pants', label: t.shopPants || 'Shim', icon: 'user-ninja' },
                      { id: 'shoes', label: t.shopShoes || 'Oyoq kiyim', icon: 'shoe-prints' },
                      { id: 'accessories', label: t.shopAccessories || 'Aksessuarlar', icon: 'glasses' },
                      { id: 'backpacks', label: t.shopBackpacks || 'Ryukzaklar', icon: 'suitcase' }
                    ].map(sub => (
                      <TouchableOpacity
                        key={sub.id}
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 20,
                          backgroundColor: activeSkinCategory === sub.id ? '#A855F7' : 'rgba(255, 255, 255, 0.06)',
                          borderWidth: 1,
                          borderColor: activeSkinCategory === sub.id ? '#C084FC' : 'rgba(255, 255, 255, 0.1)',
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6
                        }}
                        onPress={() => setActiveSkinCategory(sub.id)}
                      >
                        <FontAwesome5 name={sub.icon} size={12} color={activeSkinCategory === sub.id ? '#FFF' : '#AAA'} />
                        <Text style={{ color: activeSkinCategory === sub.id ? '#FFF' : '#AAA', fontFamily: 'Inter_600SemiBold', fontSize: 12 }}>{sub.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>

                  {/* Skins Items Grid */}
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: 12, marginTop: 10 }}>
                    {shopItems
                      .filter(item => item.category === 'inventory' && (item.subcategory || 'top') === activeSkinCategory)
                      .map(item => {
                        const iconName = activeSkinCategory === 'headwear' ? 'hat-cowboy' : activeSkinCategory === 'top' ? 'tshirt' : activeSkinCategory === 'pants' ? 'user-ninja' : activeSkinCategory === 'shoes' ? 'shoe-prints' : activeSkinCategory === 'accessories' ? 'glasses' : 'suitcase';
                        const itemColor = '#F59E0B';
                        const fullImgUrl = getShopImageUrl(item.imageUrl);

                        return (
                          <View 
                            key={item.id} 
                            style={{
                              width: '48%',
                              backgroundColor: 'rgba(18, 18, 35, 0.75)',
                              borderRadius: 18,
                              borderWidth: 1.5,
                              borderColor: 'rgba(245, 158, 11, 0.25)',
                              padding: 12,
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: 10,
                              shadowColor: '#000',
                              shadowOffset: { width: 0, height: 4 },
                              shadowOpacity: 0.3,
                              shadowRadius: 6,
                              elevation: 5
                            }}
                          >
                            {/* Product Preview Image Frame (Non-circular) */}
                            <View style={{ 
                              width: '100%', 
                              height: 105, 
                              borderRadius: 14, 
                              backgroundColor: 'rgba(7, 7, 18, 0.85)', 
                              justifyContent: 'center', 
                              alignItems: 'center', 
                              borderWidth: 1, 
                              borderColor: 'rgba(255, 255, 255, 0.08)',
                              overflow: 'hidden',
                              padding: 6
                            }}>
                              {fullImgUrl ? (
                                <Image source={{ uri: fullImgUrl }} style={{ width: '100%', height: '100%', resizeMode: 'contain' }} />
                              ) : (
                                <FontAwesome5 name={iconName} size={36} color={itemColor} />
                              )}
                            </View>

                            <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 13, textAlign: 'center', marginTop: 2 }} numberOfLines={1}>{item.name}</Text>
                            
                            <TouchableOpacity
                              style={{
                                width: '100%',
                                backgroundColor: userCoin >= item.price ? 'rgba(245, 158, 11, 0.25)' : 'rgba(255,255,255,0.05)',
                                borderWidth: 1.5,
                                borderColor: userCoin >= item.price ? '#F59E0B' : 'rgba(255,255,255,0.1)',
                                paddingVertical: 10,
                                borderRadius: 12,
                                flexDirection: 'row',
                                justifyContent: 'center',
                                alignItems: 'center',
                                gap: 6
                              }}
                              activeOpacity={0.8}
                              onPress={() => {
                                if (userCoin < item.price) {
                                  showCustomAlert("Tangalar yetarli emas!", `Ushbu skinni sotib olish uchun sizga kamida ${item.price} Coin kerak. Hozir sizda ${userCoin} Coin bor.`, "warning");
                                  return;
                                }

                                showCustomAlert(
                                  "Mahsulot Xaridi",
                                  `Siz ushbu "${item.name}" mahsulotini ${item.price} tangaga xarid qilmoqchimisiz?\n\n${item.description || "Ushbu buyum profilingiz va personajingiz uchun moslashtiriladi."}`,
                                  "warning",
                                  [
                                    { text: "Bekor qilish", onPress: () => {} },
                                    {
                                      text: "Xarid qilish",
                                      onPress: async () => {
                                        try {
                                          const newCoin = userCoin - item.price;
                                          setUserCoin(newCoin);
                                          const uDataStr = await AsyncStorage.getItem('user_data');
                                          if (uDataStr) {
                                            const uData = JSON.parse(uDataStr);
                                            uData.coin = newCoin;
                                            await AsyncStorage.setItem('user_data', JSON.stringify(uData));
                                          }
                                          triggerPurchaseAnimation(item, "Bosh sahifa -> INVENTAR");
                                        } catch(e) {}
                                      }
                                    }
                                  ]
                                );
                              }}
                            >
                              <Image source={require('../assets/s_coin.png')} style={{ width: 15, height: 15 }} />
                              <Text style={{ color: userCoin >= item.price ? '#F59E0B' : '#888', fontFamily: 'Inter_800ExtraBold', fontSize: 13 }}>{item.price}</Text>
                            </TouchableOpacity>
                          </View>
                        );
                      })}

                    {shopItems.filter(item => item.category === 'inventory' && (item.subcategory || 'top') === activeSkinCategory).length === 0 && (
                      <View style={{ width: '100%', paddingVertical: 30, alignItems: 'center' }}>
                        <FontAwesome5 name="store-alt-slash" size={32} color="#666" />
                        <Text style={{ color: '#888', fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 8 }}>Ushbu bo'limda hozircha mahsulotlar yo'q</Text>
                      </View>
                    )}
                  </View>
                </View>
              )}

              {/* === ENERGIYA SECTION === */}
              {activeShopTab === 'energy' && (
                <View style={{ gap: 12, marginTop: 10 }}>
                  {shopItems
                    .filter(item => item.category === 'energy')
                    .map(item => {
                      const fullImgUrl = getShopImageUrl(item.imageUrl);
                      return (
                        <View 
                          key={item.id} 
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                            padding: 14,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(245, 158, 11, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#F59E0B', overflow: 'hidden' }}>
                              {fullImgUrl ? (
                                <Image source={{ uri: fullImgUrl }} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                              ) : (
                                <MaterialCommunityIcons name="lightning-bolt" size={24} color="#F59E0B" />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 14 }}>{item.name}</Text>
                              <Text style={{ color: '#888899', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 }}>{item.description || `+${item.value || 1} ta energiya chaqmoq`}</Text>
                            </View>
                          </View>

                          <TouchableOpacity
                            style={{
                              backgroundColor: userCoin >= item.price ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                              borderWidth: 1,
                              borderColor: userCoin >= item.price ? '#F59E0B' : 'rgba(255,255,255,0.1)',
                              paddingHorizontal: 14,
                              paddingVertical: 10,
                              borderRadius: 12,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6
                            }}
                            onPress={() => {
                              if (userCoin < item.price) {
                                showCustomAlert("Tangalar yetarli emas!", `Ushbu energiyani sotib olish uchun sizga kamida ${item.price} Coin kerak. Hozir sizda ${userCoin} Coin bor.`, "warning");
                                return;
                              }

                              showCustomAlert(
                                "Mahsulot Xaridi",
                                `Siz ushbu "${item.name}" (+${item.value || 1} Energiya chaqmoq) paketini ${item.price} tangaga xarid qilmoqchimisiz?\n\n${item.description || "Harid qilingan energiya Energiya Markaziga saqlanadi."}`,
                                "warning",
                                [
                                  { text: "Bekor qilish", onPress: () => {} },
                                  {
                                    text: "Xarid qilish",
                                    onPress: async () => {
                                      try {
                                        const newCoin = userCoin - item.price;
                                        setUserCoin(newCoin);
                                        const uDataStr = await AsyncStorage.getItem('user_data');
                                        if (uDataStr) {
                                          const uData = JSON.parse(uDataStr);
                                          uData.coin = newCoin;
                                          await AsyncStorage.setItem('user_data', JSON.stringify(uData));
                                        }

                                        const energyValue = item.value || 1;
                                         if (currentEnergy < 10) {
                                           await addEnergy(energyValue);
                                           triggerPurchaseAnimation(item, "Balansingizga qo'shildi!");
                                         } else {
                                           const activeIdKey = user?.customId || user?.id || (uDataStr ? JSON.parse(uDataStr).customId || JSON.parse(uDataStr).id : 'guest');
                                           const energyStorageKey = `purchased_energy_inventory_${activeIdKey}`;
                                           const existingPurchasedStr = await AsyncStorage.getItem(energyStorageKey);
                                           const existingPurchased = existingPurchasedStr ? JSON.parse(existingPurchasedStr) : [];
                                           const newItemEntry = {
                                             id: `purchased_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
                                             name: item.name,
                                             value: energyValue,
                                             purchasedAt: Date.now()
                                           };
                                           existingPurchased.push(newItemEntry);
                                           await AsyncStorage.setItem(energyStorageKey, JSON.stringify(existingPurchased));
                                           DeviceEventEmitter.emit('purchased_energy_updated');
                                           triggerPurchaseAnimation(item, "Energiya Markazi -> Harid qilingan energiyalar");
                                         }
                                      } catch(e) {}
                                    }
                                  }
                                ]
                              );
                            }}
                          >
                            <Image source={require('../assets/s_coin.png')} style={{ width: 14, height: 14 }} />
                            <Text style={{ color: userCoin >= item.price ? '#F59E0B' : '#888', fontFamily: 'Inter_800ExtraBold', fontSize: 13 }}>{item.price}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                  {shopItems.filter(item => item.category === 'energy').length === 0 && (
                    <View style={{ width: '100%', paddingVertical: 30, alignItems: 'center' }}>
                      <MaterialCommunityIcons name="lightning-bolt-outline" size={32} color="#666" />
                      <Text style={{ color: '#888', fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 8 }}>Energiya bo'limida hozircha mahsulotlar yo'q</Text>
                    </View>
                  )}
                </View>
              )}

              {/* === SIRLI SANDIQ SECTION === */}
              {activeShopTab === 'mystery' && (
                <View style={{ gap: 12, marginTop: 10 }}>
                  <View style={{ backgroundColor: 'rgba(168, 85, 247, 0.1)', borderWidth: 1, borderColor: 'rgba(168, 85, 247, 0.3)', borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <MaterialCommunityIcons name="treasure-chest" size={32} color="#A855F7" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 14 }}>Sirli Sandiq Kalitlari</Text>
                      <Text style={{ color: '#C084FC', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 }}>Kalitlar bilan sandiqni oching va nodir mukofotlarni qo'lga kiriting!</Text>
                    </View>
                  </View>

                  {shopItems
                    .filter(item => item.category === 'mystery')
                    .map(item => {
                      const fullImgUrl = getShopImageUrl(item.imageUrl);
                      return (
                        <View 
                          key={item.id} 
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: 16,
                            borderWidth: 1,
                            borderColor: 'rgba(255, 255, 255, 0.08)',
                            padding: 14,
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
                            <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(168, 85, 247, 0.15)', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#A855F7', overflow: 'hidden' }}>
                              {fullImgUrl ? (
                                <Image source={{ uri: fullImgUrl }} style={{ width: 30, height: 30, resizeMode: 'contain' }} />
                              ) : (
                                <MaterialCommunityIcons name="key-variant" size={24} color="#F59E0B" />
                              )}
                            </View>
                            <View style={{ flex: 1 }}>
                              <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 14 }}>{item.name}</Text>
                              <Text style={{ color: '#888899', fontFamily: 'Inter_500Medium', fontSize: 11, marginTop: 2 }}>{item.description || `${item.value || 1} marotaba sandiq ochish imkoni`}</Text>
                            </View>
                          </View>

                          <TouchableOpacity
                            style={{
                              backgroundColor: userCoin >= item.price ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255,255,255,0.05)',
                              borderWidth: 1,
                              borderColor: userCoin >= item.price ? '#F59E0B' : 'rgba(255,255,255,0.1)',
                              paddingHorizontal: 14,
                              paddingVertical: 10,
                              borderRadius: 12,
                              flexDirection: 'row',
                              alignItems: 'center',
                              gap: 6
                            }}
                            onPress={() => {
                              if (userCoin < item.price) {
                                showCustomAlert("Tangalar yetarli emas!", `Ushbu kalitni sotib olish uchun sizga kamida ${item.price} Coin kerak. Hozir sizda ${userCoin} Coin bor.`, "warning");
                                return;
                              }

                              showCustomAlert(
                                "Mahsulot Xaridi",
                                `Siz ushbu "${item.name}" kalitini ${item.price} tangaga xarid qilmoqchimisiz?\n\n${item.description || "Sirli Sandiq bo'limida ishlatiladi."}`,
                                "warning",
                                [
                                  { text: "Bekor qilish", onPress: () => {} },
                                  {
                                    text: "Xarid qilish",
                                    onPress: async () => {
                                      try {
                                        const newCoin = userCoin - item.price;
                                        setUserCoin(newCoin);
                                        const uDataStr = await AsyncStorage.getItem('user_data');
                                        if (uDataStr) {
                                          const uData = JSON.parse(uDataStr);
                                          uData.coin = newCoin;
                                          await AsyncStorage.setItem('user_data', JSON.stringify(uData));
                                        }
                                        const kVal = item.value || 1;
                                        const uKey = user?.customId || user?.id || 'guest';
                                        const curKStr = await AsyncStorage.getItem(`user_mystery_keys_count_${uKey}`);
                                        const curK = curKStr !== null ? parseInt(curKStr, 10) : 1;
                                        const totK = curK + kVal;
                                        await AsyncStorage.setItem(`user_mystery_keys_count_${uKey}`, totK.toString());
                                        setMysteryKeysCount(totK);
                                        triggerPurchaseAnimation(item, "Bosh sahifa -> Sirli Sandiq bo'limi");
                                      } catch(e) {}
                                    }
                                  }
                                ]
                              );
                            }}
                          >
                            <Image source={require('../assets/s_coin.png')} style={{ width: 14, height: 14 }} />
                            <Text style={{ color: userCoin >= item.price ? '#F59E0B' : '#888', fontFamily: 'Inter_800ExtraBold', fontSize: 13 }}>{item.price}</Text>
                          </TouchableOpacity>
                        </View>
                      );
                    })}

                  {shopItems.filter(item => item.category === 'mystery').length === 0 && (
                    <View style={{ width: '100%', paddingVertical: 30, alignItems: 'center' }}>
                      <MaterialCommunityIcons name="key-remove" size={32} color="#666" />
                      <Text style={{ color: '#888', fontFamily: 'Inter_500Medium', fontSize: 13, marginTop: 8 }}>Sandiq bo'limida hozircha kalitlar yo'q</Text>
                    </View>
                  )}
                </View>
              )}

            </ScrollView>

            {/* SHOP PURCHASE SUCCESS ANIMATED OVERLAY (INSIDE SHOP CONTAINER) */}
            {purchaseSuccessItem && (
              <View 
                style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  right: 0, 
                  bottom: 0, 
                  backgroundColor: 'rgba(5, 5, 15, 0.94)', 
                  justifyContent: 'center', 
                  alignItems: 'center', 
                  zIndex: 999999
                }}
              >
                <View
                  style={{
                    width: '88%',
                    backgroundColor: '#0E0E1E',
                    borderRadius: 28,
                    borderWidth: 2,
                    borderColor: '#F59E0B',
                    padding: 24,
                    alignItems: 'center',
                    shadowColor: '#F59E0B',
                    shadowOffset: { width: 0, height: 12 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 25
                  }}
                >
                  {/* Glowing Top Badge */}
                  <View style={{
                    width: 74,
                    height: 74,
                    borderRadius: 37,
                    backgroundColor: 'rgba(245, 158, 11, 0.15)',
                    borderWidth: 2,
                    borderColor: '#F59E0B',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 14,
                    shadowColor: '#F59E0B',
                    shadowOffset: { width: 0, height: 4 },
                    shadowOpacity: 0.6,
                    shadowRadius: 10
                  }}>
                    {getShopImageUrl(purchaseSuccessItem.imageUrl) ? (
                      <Image source={{ uri: getShopImageUrl(purchaseSuccessItem.imageUrl) }} style={{ width: 48, height: 48, resizeMode: 'contain' }} />
                    ) : (purchaseSuccessItem.category === 'energy' || (purchaseSuccessItem.name && purchaseSuccessItem.name.toLowerCase().includes('energiya'))) ? (
                      <MaterialCommunityIcons name="lightning-bolt" size={44} color="#F59E0B" />
                    ) : (purchaseSuccessItem.category === 'mystery' || (purchaseSuccessItem.name && purchaseSuccessItem.name.toLowerCase().includes('kalit'))) ? (
                      <MaterialCommunityIcons name="key-variant" size={44} color="#F59E0B" />
                    ) : (
                      <MaterialCommunityIcons name="star-two-points" size={44} color="#F59E0B" />
                    )}
                  </View>

                  <Text style={{ color: '#F59E0B', fontSize: 13, fontFamily: 'Inter_800ExtraBold', letterSpacing: 1.2, textTransform: 'uppercase' }}>
                    MUVAFFAQIYATLI XARID! 🎉
                  </Text>

                  <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_900Black', textAlign: 'center', marginTop: 6 }}>
                    {purchaseSuccessItem.name}
                  </Text>

                  <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', marginTop: 6, lineHeight: 18 }}>
                    {purchaseSuccessItem.description || "Ushbu mahsulot muvaffaqiyatli harid qilindi!"}
                  </Text>

                  {/* Where to find info card */}
                  <View style={{
                    width: '100%',
                    backgroundColor: 'rgba(245, 158, 11, 0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(245, 158, 11, 0.3)',
                    borderRadius: 16,
                    padding: 12,
                    marginTop: 16,
                    alignItems: 'center',
                    flexDirection: 'row',
                    gap: 10
                  }}>
                    <MaterialCommunityIcons name="map-marker-path" size={22} color="#F59E0B" />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#F59E0B', fontSize: 11, fontFamily: 'Inter_700Bold', textTransform: 'uppercase' }}>
                        Qayerdan topish mumkin?
                      </Text>
                      <Text style={{ color: '#FFF', fontSize: 12, fontFamily: 'Inter_600SemiBold', marginTop: 2 }}>
                        {purchaseSuccessItem.targetLocation || "Bosh sahifa bo'limida"}
                      </Text>
                    </View>
                  </View>

                  {/* Price spent info */}
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 14 }}>
                    <Text style={{ color: '#9CA3AF', fontSize: 12, fontFamily: 'Inter_500Medium' }}>To'landi:</Text>
                    <Image source={require('../assets/s_coin.png')} style={{ width: 14, height: 14 }} />
                    <Text style={{ color: '#F59E0B', fontSize: 14, fontFamily: 'Inter_800ExtraBold' }}>-{purchaseSuccessItem.price} Coin</Text>
                  </View>

                  {/* OK / YOPISH BUTTON */}
                  <TouchableOpacity
                    activeOpacity={0.8}
                    style={{
                      width: '100%',
                      paddingVertical: 14,
                      borderRadius: 16,
                      backgroundColor: '#F59E0B',
                      alignItems: 'center',
                      marginTop: 18,
                      shadowColor: '#F59E0B',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 0.4,
                      shadowRadius: 8
                    }}
                    onPress={closePurchaseOverlay}
                  >
                    <Text style={{ color: '#000', fontFamily: 'Inter_900Black', fontSize: 15, letterSpacing: 0.5 }}>
                      TUSHUNARLI
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* CUSTOM ALERT MODAL INSIDE SHOP */}
            <Modal visible={customAlert.visible} transparent animationType="fade">
              <View style={styles.modalOverlay}>
                <View style={[
                  styles.modalContent, 
                  { 
                    backgroundColor: '#0D0D1A', 
                    borderWidth: 1.5, 
                    borderColor: customAlert.type === 'success' ? '#10B981' : '#F59E0B', 
                    padding: 24, 
                    alignItems: 'center',
                    borderRadius: 24,
                    shadowColor: customAlert.type === 'success' ? '#10B981' : '#F59E0B',
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.35,
                    shadowRadius: 16,
                    elevation: 12
                  }
                ]}>
                  <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 8, marginTop: 4 }}>
                    {customAlert.title}
                  </Text>

                  <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
                    {customAlert.message}
                  </Text>

                  <View style={{ width: '100%', gap: 10 }}>
                    {customAlert.buttons && customAlert.buttons.length > 0 ? (
                      customAlert.buttons.map((btn, idx) => (
                        <TouchableOpacity
                          key={idx}
                          activeOpacity={0.8}
                          style={{
                            width: '100%',
                            paddingVertical: 14,
                            borderRadius: 14,
                            backgroundColor: idx === 0 && customAlert.buttons.length > 1 ? '#1A1A2E' : (customAlert.type === 'success' ? '#10B981' : '#A855F7'),
                            borderWidth: idx === 0 && customAlert.buttons.length > 1 ? 1 : 0,
                            borderColor: '#2A2A40',
                            alignItems: 'center'
                          }}
                          onPress={() => {
                            const action = btn.onPress;
                            if (action) action();
                            closeCustomAlert();
                          }}
                        >
                          <Text style={{
                            color: idx === 0 && customAlert.buttons.length > 1 ? '#9CA3AF' : '#FFF',
                            fontFamily: 'Inter_700Bold',
                            fontSize: 15
                          }}>
                            {btn.text}
                          </Text>
                        </TouchableOpacity>
                      ))
                    ) : (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={{
                          width: '100%',
                          paddingVertical: 14,
                          borderRadius: 14,
                          backgroundColor: customAlert.type === 'success' ? '#10B981' : '#A855F7',
                          alignItems: 'center'
                        }}
                        onPress={closeCustomAlert}
                      >
                        <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 15 }}>OK</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        </View>
      </Modal>



      {/* GLOBAL ROOT ALERT MODAL */}
      <Modal visible={customAlert.visible && !isShopModalOpen} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: '#0D0D1A', 
              borderWidth: 1.5, 
              borderColor: customAlert.type === 'success' ? '#10B981' : '#F59E0B', 
              padding: 24, 
              alignItems: 'center',
              borderRadius: 24,
              shadowColor: customAlert.type === 'success' ? '#10B981' : '#F59E0B',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 12
            }
          ]}>
            <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 8, marginTop: 4 }}>
              {customAlert.title}
            </Text>

            <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', marginBottom: 24, lineHeight: 20 }}>
              {customAlert.message}
            </Text>

            <View style={{ width: '100%', gap: 10 }}>
              {customAlert.buttons && customAlert.buttons.length > 0 ? (
                customAlert.buttons.map((btn, idx) => (
                  <TouchableOpacity
                    key={idx}
                    activeOpacity={0.8}
                    style={{
                      width: '100%',
                      paddingVertical: 14,
                      borderRadius: 14,
                      backgroundColor: idx === 0 && customAlert.buttons.length > 1 ? '#1A1A2E' : (customAlert.type === 'success' ? '#10B981' : '#A855F7'),
                      borderWidth: idx === 0 && customAlert.buttons.length > 1 ? 1 : 0,
                      borderColor: '#2A2A40',
                      alignItems: 'center'
                    }}
                    onPress={() => {
                      const action = btn.onPress;
                      if (action) action();
                      closeCustomAlert();
                    }}
                  >
                    <Text style={{
                      color: idx === 0 && customAlert.buttons.length > 1 ? '#9CA3AF' : '#FFF',
                      fontFamily: 'Inter_700Bold',
                      fontSize: 15
                    }}>
                      {btn.text}
                    </Text>
                  </TouchableOpacity>
                ))
              ) : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  style={{
                    width: '100%',
                    paddingVertical: 14,
                    borderRadius: 14,
                    backgroundColor: customAlert.type === 'success' ? '#10B981' : '#A855F7',
                    alignItems: 'center'
                  }}
                  onPress={closeCustomAlert}
                >
                  <Text style={{ color: '#FFF', fontFamily: 'Inter_700Bold', fontSize: 15 }}>OK</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>

      {/* SKIN PURCHASE ALERT MODAL */}
      <Modal visible={!!skinPurchaseAlertItem} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={[
            styles.modalContent, 
            { 
              backgroundColor: '#0D0D1A', 
              borderWidth: 1.5, 
              borderColor: '#EAB308', 
              padding: 24, 
              alignItems: 'center',
              borderRadius: 24,
              shadowColor: '#EAB308',
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.35,
              shadowRadius: 16,
              elevation: 12
            }
          ]}>
            <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(234,179,8,0.15)', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 1, borderColor: '#EAB308' }}>
              <MaterialCommunityIcons name="lock" size={30} color="#EAB308" />
            </View>

            <Text style={{ color: '#FFF', fontSize: 20, fontFamily: 'Inter_700Bold', textAlign: 'center', marginBottom: 8 }}>
              {skinPurchaseAlertItem?.name || "Skin xaridi"}
            </Text>

            <Text style={{ color: '#9CA3AF', fontSize: 13, textAlign: 'center', marginBottom: 20, lineHeight: 20 }}>
              Ushbu skinni kiyish uchun avval uni IQROSHOP do'konidan xarid qilishingiz kerak!
            </Text>

            {skinPurchaseAlertItem?.price > 0 && (
              <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(234,179,8,0.1)', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, marginBottom: 20, borderWidth: 1, borderColor: 'rgba(234,179,8,0.3)' }}>
                <Image source={require('../assets/s_coin.png')} style={{ width: 18, height: 18, marginRight: 8 }} />
                <Text style={{ color: '#EAB308', fontFamily: 'Inter_700Bold', fontSize: 16 }}>{skinPurchaseAlertItem.price} Coin</Text>
              </View>
            )}

            <View style={{ width: '100%', gap: 10 }}>
              <TouchableOpacity
                activeOpacity={0.85}
                style={{
                  width: '100%',
                  paddingVertical: 14,
                  borderRadius: 14,
                  backgroundColor: '#EAB308',
                  alignItems: 'center',
                  shadowColor: '#EAB308',
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.3,
                  shadowRadius: 8
                }}
                onPress={() => {
                  setSkinPurchaseAlertItem(null);
                  setActiveShopTab('inventory');
                  const catSubmap = {
                    'ustki_kiyim': 'top',
                    'bosh_kiyim': 'top',
                    'shim': 'pants',
                    'oyoq_kiyim': 'shoes',
                    'aksessuar': 'accessories',
                    'ryukzak': 'backpacks'
                  };
                  if (skinPurchaseAlertItem?.category) {
                    setActiveSkinCategory(catSubmap[skinPurchaseAlertItem.category] || 'top');
                  }
                  setIsShopModalOpen(true);
                }}
              >
                <Text style={{ color: '#000', fontFamily: 'Inter_700Bold', fontSize: 15 }}>XARID QILISH</Text>
              </TouchableOpacity>

              <TouchableOpacity
                activeOpacity={0.8}
                style={{
                  width: '100%',
                  paddingVertical: 12,
                  borderRadius: 14,
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  borderWidth: 1,
                  borderColor: 'rgba(255,255,255,0.1)',
                  alignItems: 'center'
                }}
                onPress={() => setSkinPurchaseAlertItem(null)}
              >
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_600SemiBold', fontSize: 14 }}>Bekor qilish</Text>
              </TouchableOpacity>
            </View>
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
    paddingTop: 0,
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
    justifyContent: 'flex-end',
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
    gap: 6,
  },
  statCard: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#0A0A16',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: '#1A1A2E',
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statImage: {
    width: 28,
    height: 28,
    marginRight: 6,
    borderRadius: 14,
  },
  statValue: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    marginBottom: 1,
  },
  statLabel: {
    color: '#888899',
    fontSize: 9,
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
    top: 475, 
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
    height: 475, // Slightly increased height for ideal positioning
    resizeMode: 'cover',
  },
  contentOverlay: {
    height: 475, // Match the background image height
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
  goldenShopButton: {
    position: 'absolute',
    right: 20,
    top: 40,
    zIndex: 20,
    alignItems: 'center',
  },
  goldenShopGradient: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFF5C0',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.6,
    shadowRadius: 10,
    elevation: 8,
  },
  shopBadge: {
    backgroundColor: '#EAB308',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 8,
    marginTop: -8,
    borderWidth: 1,
    borderColor: '#FFF',
  },
  shopBadgeText: {
    color: '#000',
    fontSize: 9,
    fontFamily: 'Inter_900Black',
  },
  rightSideStatsPanel: {
    position: 'absolute',
    right: 12,
    top: 110,
    width: 112,
    zIndex: 10,
    gap: 10,
  },
  rightStatBlock: {
    backgroundColor: 'rgba(7, 7, 22, 0.88)',
    borderWidth: 1.5,
    borderRadius: 12,
    paddingVertical: 7,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 5,
  },
  rightStatTextCol: {
    marginLeft: 8,
    flex: 1,
  },
  rightStatTopLabel: {
    color: '#9CA3AF',
    fontSize: 8,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  rightStatNumber: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_900Black',
    lineHeight: 16,
  },
  rightStatSubLabel: {
    fontSize: 8,
    fontFamily: 'Inter_600SemiBold',
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
    position: 'relative',
    zIndex: 99,
    elevation: 10,
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
    zIndex: 100,
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
  // PODIUM STYLES
  podiumContainer: {
    marginTop: -5, // Clean separation from golden frame
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  podiumImage: {
    width: '100%',
    height: 230,
    position: 'relative',
  },
  podiumFirst: {
    position: 'absolute',
    top: '19%', 
    left: '50%',
    marginLeft: -33, 
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
    top: '34%', 
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
    top: '32%', 
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
    marginTop: -75, // Position name badges cleanly inside the pedestal blocks
  },
  podiumInfoBox: {
    alignItems: 'center',
    width: '30%',
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
    aspectRatio: 1.85,
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
    top: '25%',
    left: '24%',
    alignItems: 'flex-start',
  },
  battleRightPlayer: {
    position: 'absolute',
    top: '25%',
    left: '60%',
    alignItems: 'flex-start',
  },
  battlePlayerLabelYou: {
    color: '#38BDF8', // Light Blue
    fontSize: Platform.OS === 'android' ? 13 : 14,
    fontFamily: 'Inter_700Bold',
    textTransform: 'uppercase',
    marginBottom: Platform.OS === 'android' ? 0 : 2,
  },
  battlePlayerLabelOpp: {
    color: '#EF4444', // Red
    fontSize: Platform.OS === 'android' ? 13 : 14,
    fontFamily: 'Inter_700Bold',
    marginBottom: Platform.OS === 'android' ? 0 : 2,
  },
  battlePlayerNameYou: {
    color: '#FFF',
    fontSize: Platform.OS === 'android' ? 9 : 10,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: Platform.OS === 'android' ? 2 : 4,
    maxWidth: 90,
  },
  battlePlayerNameOpp: {
    color: '#FFF',
    fontSize: Platform.OS === 'android' ? 9 : 10,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: Platform.OS === 'android' ? 2 : 4,
    maxWidth: 90,
  },
  battleLevelBadgeYou: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: Platform.OS === 'android' ? 6 : 8,
    paddingVertical: Platform.OS === 'android' ? 2 : 4,
    borderRadius: 6,
    marginBottom: Platform.OS === 'android' ? 3 : 6,
  },
  battleLevelBadgeOpp: {
    backgroundColor: '#1E1B4B',
    paddingHorizontal: Platform.OS === 'android' ? 6 : 8,
    paddingVertical: Platform.OS === 'android' ? 2 : 4,
    borderRadius: 6,
    marginBottom: Platform.OS === 'android' ? 3 : 6,
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
    width: '48%', // Adjusted for 2 items
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
    height: 140, // Uniform fixed height for golden card image
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 15,
  },
  rankingFrameLeft: {
    width: 112, 
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  rankingAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    marginTop: -22, 
    marginLeft: 36,
  },
  rankingFrameMiddle: {
    flex: 1.1,
    justifyContent: 'center',
    paddingLeft: 34, 
  },
  rankingUserName: {
    color: '#FFF',
    fontSize: 12, 
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.2,
  },
  rankingUserPosition: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  rankingPositionNumber: {
    color: '#F59E0B',
    fontSize: 16, 
    fontFamily: 'Inter_800ExtraBold',
    marginLeft: 4,
  },
  rankingUserXpBadge: {
    backgroundColor: '#4C1D95',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  rankingUserXpText: {
    color: '#FFF',
    fontSize: 9, 
    fontFamily: 'Inter_700Bold',
  },
  rankingFrameRight: {
    flex: 1.3,
    justifyContent: 'center',
    paddingRight: 10,
    paddingLeft: 5,
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
    marginTop: 0,
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
    paddingRight: 10,
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

  /* --- NEW PROFILE STYLES --- */
  proCardGlass: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 20,
  },
  proAvatarContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  proAvatarGlow: {
    position: 'absolute',
    top: -10, left: -10, right: -10, bottom: -10,
    borderRadius: 60,
    backgroundColor: 'rgba(168, 85, 247, 0.2)',
    zIndex: 0,
  },
  proAvatarImg: {
    width: 90, height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#A855F7',
    zIndex: 1,
  },
  proAvatarBadge: {
    position: 'absolute',
    bottom: -5,
    alignSelf: 'center',
    backgroundColor: '#10B981',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 2,
    borderWidth: 2,
    borderColor: '#05050C',
  },
  proAvatarBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  proUserName: {
    color: '#FFF',
    fontSize: 22,
    fontFamily: 'Inter_700Bold',
    marginBottom: 4,
  },
  proUserTag: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    marginBottom: 24,
  },
  proTopStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  proTopStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  proTopStatIcon: {
    width: 28, height: 28,
    borderRadius: 14,
    marginBottom: 8,
  },
  proTopStatValue: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  proTopStatLabel: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  proTopStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  proTierCard: {
    borderRadius: 24,
    overflow: 'hidden',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  proTierBg: {
    width: '100%',
    padding: 20,
  },
  proTierOverlay: {
    flexDirection: 'column',
  },
  proTierLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  proTierIcon: {
    width: 48, height: 48,
    marginRight: 12,
  },
  proTierTitle: {
    color: '#FBBF24',
    fontSize: 20,
    fontFamily: 'Inter_800ExtraBold',
  },
  proTierSub: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  proTierProgressContainer: {
    width: '100%',
  },
  proTierProgressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  proTierTarget: {
    color: '#D1D5DB',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
  },
  proTierPercent: {
    color: '#FBBF24',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  proTierProgressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  proTierProgressFill: {
    height: '100%',
    backgroundColor: '#FBBF24',
    borderRadius: 4,
  },
  proSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    marginTop: 10,
  },
  proSectionTitle: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
  },
  proSectionLink: {
    color: '#A855F7',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
  },
  proStatsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  proStatBox: {
    width: '48%',
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 16,
  },
  proStatBoxValue: {
    color: '#FFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
    marginTop: 8,
    marginBottom: 2,
  },
  proStatBoxLabel: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  proBadgeScroll: {
    paddingBottom: 24,
  },
  proBadgeActive: {
    width: 80,
    alignItems: 'center',
    marginRight: 16,
  },
  proBadgeInactive: {
    width: 80,
    alignItems: 'center',
    marginRight: 16,
    opacity: 0.3,
  },
  proBadgeImg: {
    width: 60, height: 60,
    marginBottom: 8,
  },
  proBadgeText: {
    color: '#FFF',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  proBadgeTextInactive: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter_600SemiBold',
    textAlign: 'center',
  },
  proTimelineContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    marginBottom: 24,
  },
  proTimelineItem: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  proTimelineDotLine: {
    alignItems: 'center',
    marginRight: 16,
  },
  proTimelineDot: {
    width: 12, height: 12,
    borderRadius: 6,
    marginTop: 4,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },
  proTimelineLine: {
    width: 2,
    height: 50,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    marginTop: 4,
  },
  proTimelineContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingBottom: 24,
  },
  proTimelineTitle: {
    color: '#FFF',
    fontSize: 15,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 2,
  },
  proTimelineSub: {
    color: '#6B7280',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  proTimelineTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  proTimelineTagText: {
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },
  languageScrollContainer: {
    paddingLeft: 0,
    paddingRight: 20,
    marginBottom: 24,
    gap: 12,
  },
  languageCard: {
    backgroundColor: '#1E1B2E',
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 100,
  },
  languageCardActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    borderColor: '#7C3AED',
  },
  languageFlag: {
    fontSize: 24,
    marginBottom: 8,
    opacity: 0.7,
  },
  languageFlagActive: {
    opacity: 1,
  },
  languageName: {
    color: '#8A8A93',
    fontFamily: 'Inter_600SemiBold',
    fontSize: 14,
  },
  languageNameActive: {
    color: '#FFFFFF',
  },
  proLogoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 68, 68, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
    borderRadius: 16,
    paddingVertical: 16,
    marginBottom: 20,
  },
  proLogoutText: {
    color: '#EF4444',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
    marginLeft: 8,
  },
  notifModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(5, 5, 12, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  notifModalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#0A0A16',
    borderRadius: 24,
    padding: 24,
    borderWidth: 1.5,
    borderColor: '#3B82F6',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
  },
  notifModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  notifModalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontFamily: 'Inter_700Bold',
  },
  notifEmptyBox: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  notifEmptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Inter_700Bold',
    marginBottom: 6,
  },
  notifEmptySub: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
  },
  notifItemCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  notifItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  notifItemAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: '#3B82F6',
    marginRight: 12,
  },
  notifItemSender: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  notifItemStats: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_500Medium',
  },
  notifBadge: {
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
  },
  notifBadgeText: {
    color: '#F59E0B',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  notifItemMsg: {
    color: '#EAB308',
    fontSize: 14,
    fontFamily: 'Inter_600SemiBold',
    marginBottom: 14,
  },
  notifItemActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  notifRejectBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderWidth: 1,
    borderColor: '#EF4444',
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  notifRejectText: {
    color: '#EF4444',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  notifAcceptBtn: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    paddingVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
  notifAcceptText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontFamily: 'Inter_700Bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 15,
  },
  modalIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 22,
    fontFamily: 'Inter_800ExtraBold',
    marginBottom: 8,
    textAlign: 'center',
  },
  modalDesc: {
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
    color: '#D1D5DB',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 24,
  },
  modalButtons: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  modalBtn: {
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalBtnPrimaryText: {
    fontSize: 16,
    fontFamily: 'Inter_700Bold',
  },
  authInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#05050C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A1A2E',
    height: 48,
    paddingHorizontal: 12,
  },
  authInputField: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Inter_500Medium',
  },
});

