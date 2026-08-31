import React, { useState, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, SafeAreaView, Platform, StatusBar, Share, Alert, DeviceEventEmitter } from 'react-native';
import { MaterialCommunityIcons, Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as Clipboard from 'expo-clipboard';
import AsyncStorage from '@react-native-async-storage/async-storage';
import io from 'socket.io-client';
import { API_URL } from '../src/config/api';

export const MYSTERY_TRANSLATIONS = {
  uz: {
    mysteryBox: "SIRLI SANDIQ",
    keysCountLabel: "1 ta sandiq",
    promoCashback: "PROMOKOD & KESHBEK",
    cashbackTag: "25% Keshbek",
    keysAvailable: "Sizda mavjud kalitlar",
    ta: "ta",
    taBox: "ta sandiq",
    openBoxBtn: "SANDIQNI OCHISH ✨",
    mainDesc: "Kalitlar bilan sandiqni oching va qimmatbaho sovg'alarni qo'lga kiring!",
    howToGetKeys: "Kalitlar qanday olinadi? ➔",
    myRewards: "Mening sovg'alarim 🎁 ➔",
    openingText: "SANDIQ OCHILMOQDA... ✨",
    openingSub: "Omadingiz sinalmoqda, kuting! 🎁",
    yourReward: "SIZNING SOVG'ANGIZ!",
    awesomeBtn: "AJOYIB! 🎉",
    howToTitle: "KALITLAR QANDAY OLINADI?",
    item1Title: "Yangi foydalanuvchi bonusi",
    item1Sub: "Ro'yxatdan o'tganingiz uchun +1 ta oltin kalit berildi.",
    item2Title: "Do'stlarni taklif eting",
    item2Sub: "Har bir yangi do'st uchun +1 ta kalit oling.",
    item3Title: "Kunlik faollik",
    item3Sub: "Har kuni kamida 1 ta mashq ishlang va 7 kunda kalit oling.",
    getBtn: "Olish 🔑",
    daysCount: "kun",
    moreKeysTitle: "Ko'proq kalitlar - ko'proq imkoniyatlar!",
    moreKeysSub: "Faol bo'ling va sovg'alarni qo'lga kiriting!",
    inviteTitle: "DO'STLARNI TAKLIF ETISH",
    inviteHero: "Do'stlaringizni taklif eting va kalitlarga ega bo'ling!",
    yourInviteLink: "Sizning taklif havolangiz",
    copied: "Nusxalandi!",
    copyText: "Kopiyalash",
    moreShare: "Yana",
    congratsTitle: "TABRIKLAYMIZ! 🎉",
    youGotKey: "Siz yangi oltin kalitga ega bo'ldingiz!",
    totalKeys: "Endi sizda jami",
    continueBtn: "Davom etish",
    myRewardsTitle: "SOVG'ALARIM",
    tabActive: "Faol",
    tabHistory: "Tarix",
    noRewards: "Sovg'alar mavjud emas",
    dateUntil: "Tugash muddati:",
    dateEnded: "Tugagan sana:",
    dateGiven: "Berilgan sana: Bugun",
    bonusTitle: "Yangi Foydalanuvchi Bonusi",
    keyBadge: "1 ta Kalit",
    daysBadge: "kun",
    doneTag: "Bajarildi",
    realPaymentsLock: "Real to'lovlar bilan faollashadi"
  },
  ru: {
    mysteryBox: "ТАЙНЫЙ СУНДУК",
    keysCountLabel: "1 сундук",
    promoCashback: "ПРОМОКОД И КЭШБЭК",
    cashbackTag: "25% Кэшбэк",
    keysAvailable: "Доступные ключи",
    ta: "шт",
    taBox: "сундуков",
    openBoxBtn: "ОТКРЫТЬ СУНДУК ✨",
    mainDesc: "Открывайте сундук ключами и получайте ценные призы!",
    howToGetKeys: "Как получить ключи? ➔",
    myRewards: "Мои награды 🎁 ➔",
    openingText: "СУНДУК ОТКРЫВАЕТСЯ... ✨",
    openingSub: "Испытайте удачу, подождите! 🎁",
    yourReward: "ВАША НАГРАДА!",
    awesomeBtn: "ОТЛИЧНО! 🎉",
    howToTitle: "КАК ПОЛУЧИТЬ КЛЮЧИ?",
    item1Title: "Бонус новому пользователю",
    item1Sub: "Вы получили +1 золотой ключ за регистрацию.",
    item2Title: "Приглашайте друзей",
    item2Sub: "Получайте +1 ключ за каждого друга.",
    item3Title: "Ежедневная активность",
    item3Sub: "Решайте минимум 1 упражнение каждый день и получите ключ за 7 дней.",
    getBtn: "Забрать 🔑",
    daysCount: "дн.",
    moreKeysTitle: "Больше ключей — больше возможностей!",
    moreKeysSub: "Будьте активны и получайте призы!",
    inviteTitle: "ПРИГЛАСИТЬ ДРУЗЕЙ",
    inviteHero: "Приглашайте друзей и получайте ключи!",
    yourInviteLink: "Ваша ссылка для приглашения",
    copied: "Скопировано!",
    copyText: "Копировать",
    moreShare: "Еще",
    congratsTitle: "ПОЗДРАВЛЯЕМ! 🎉",
    youGotKey: "Вы получили новый золотой ключ!",
    totalKeys: "Теперь у вас всего",
    continueBtn: "Продолжить",
    myRewardsTitle: "МОИ НАГРАДЫ",
    tabActive: "Активные",
    tabHistory: "История",
    noRewards: "Награды отсутствуют",
    dateUntil: "Срок действия:",
    dateEnded: "Дата окончания:",
    dateGiven: "Дата выдачи: Сегодня",
    bonusTitle: "Бонус нового пользователя",
    keyBadge: "1 Ключ",
    daysBadge: "дн.",
    doneTag: "Выполнено",
    realPaymentsLock: "Активируется с реальными платежами"
  },
  en: {
    mysteryBox: "MYSTERY BOX",
    keysCountLabel: "1 chest",
    promoCashback: "PROMOCODE & CASHBACK",
    cashbackTag: "25% Cashback",
    keysAvailable: "Your available keys",
    ta: "keys",
    taBox: "chests",
    openBoxBtn: "OPEN MYSTERY BOX ✨",
    mainDesc: "Open mystery boxes with keys and win valuable rewards!",
    howToGetKeys: "How to get keys? ➔",
    myRewards: "My Rewards 🎁 ➔",
    openingText: "OPENING MYSTERY BOX... ✨",
    openingSub: "Testing your luck, please wait! 🎁",
    yourReward: "YOUR REWARD!",
    awesomeBtn: "AWESOME! 🎉",
    howToTitle: "HOW TO GET KEYS?",
    item1Title: "New User Bonus",
    item1Sub: "You received +1 golden key for registering.",
    item2Title: "Invite Friends",
    item2Sub: "Get +1 key for every invited friend.",
    item3Title: "Daily Activity",
    item3Sub: "Solve at least 1 exercise daily to get a key in 7 days.",
    getBtn: "Claim 🔑",
    daysCount: "days",
    moreKeysTitle: "More keys - more chances!",
    moreKeysSub: "Stay active and claim awesome gifts!",
    inviteTitle: "INVITE FRIENDS",
    inviteHero: "Invite your friends and earn golden keys!",
    yourInviteLink: "Your invitation link",
    copied: "Copied!",
    copyText: "Copy",
    moreShare: "More",
    congratsTitle: "CONGRATULATIONS! 🎉",
    youGotKey: "You unlocked a new golden key!",
    totalKeys: "Now you have a total of",
    continueBtn: "Continue",
    myRewardsTitle: "MY REWARDS",
    tabActive: "Active",
    tabHistory: "History",
    noRewards: "No rewards available",
    dateUntil: "Expires at:",
    dateEnded: "Ended at:",
    dateGiven: "Given date: Today",
    bonusTitle: "New User Bonus",
    keyBadge: "1 Key",
    daysBadge: "days",
    doneTag: "Completed",
    realPaymentsLock: "Activates with real payments"
  },
  ar: {
    mysteryBox: "الصندوق السري",
    keysCountLabel: "صندوق واحد",
    promoCashback: "الرمز الترويجي والاسترداد",
    cashbackTag: "استرداد 25%",
    keysAvailable: "المفاتيح المتاحة لديك",
    ta: "مفاتيح",
    taBox: "صناديق",
    openBoxBtn: "افتح الصندوق ✨",
    mainDesc: "افتح الصناديق بالمفاتيح واحصل على جوائز قيمة!",
    howToGetKeys: "كيف تحصل على المفاتيح؟ ➔",
    myRewards: "مكافآتي 🎁 ➔",
    openingText: "جاري فتح الصندوق... ✨",
    openingSub: "جاري اختبار حظك، يرجى الانتظار! 🎁",
    yourReward: "مكافأتك!",
    awesomeBtn: "رائع! 🎉",
    howToTitle: "كيف تحصل على المفاتيح؟",
    item1Title: "مكافأة المستخدم الجديد",
    item1Sub: "حصلت على مفتاح ذهبي واحد للتسجيل.",
    item2Title: "دعوة الأصدقاء",
    item2Sub: "احصل على مفتاح واحد لكل صديق.",
    item3Title: "النشاط اليومي",
    item3Sub: "حل تمرينًا واحدًا يوميًا واحصل على مفتاح خلال 7 أيام.",
    getBtn: "استلام 🔑",
    daysCount: "أيام",
    moreKeysTitle: "مفاتيح أكثر - فرص أكثر!",
    moreKeysSub: "كن نشيطًا واحصل على الهدايا!",
    inviteTitle: "دعوة الأصدقاء",
    inviteHero: "ادعُ أصدقاءك واحصل على المفاتيح!",
    yourInviteLink: "رابط الدعوة الخاص بك",
    copied: "تم النسخ!",
    copyText: "نسخ",
    moreShare: "المزيد",
    congratsTitle: "تهانينا! 🎉",
    youGotKey: "حصلت على مفتاح ذهبي جديد!",
    totalKeys: "لديك الآن إجمالي",
    continueBtn: "متابعة",
    myRewardsTitle: "مكافآتي",
    tabActive: "نشط",
    tabHistory: "السجل",
    noRewards: "لا توجد مكافآت",
    dateUntil: "تاريخ الانتهاء:",
    dateEnded: "تاريخ الانتهاء:",
    dateGiven: "تاريخ الإعطاء: اليوم",
    bonusTitle: "مكافأة المستخدم الجديد",
    keyBadge: "مفتاح 1",
    daysBadge: "أيام",
    doneTag: "مكتمل",
    realPaymentsLock: "يتم التفعيل مع المدفوعات الحقيقية"
  },
  tr: {
    mysteryBox: "GİZEMLİ KUTU",
    keysCountLabel: "1 kutu",
    promoCashback: "PROMOSYON KODU & NAKİT İADE",
    cashbackTag: "%25 Nakit İade",
    keysAvailable: "Mevcut anahtarlarınız",
    ta: "adet",
    taBox: "kutu",
    openBoxBtn: "KUTUYU AÇ ✨",
    mainDesc: "Gizemli kutuları anahtarlarla açın ve değerli hediyeler kazanın!",
    howToGetKeys: "Anahtarlar nasıl alınır? ➔",
    myRewards: "Ödüllerim 🎁 ➔",
    openingText: "KUTU AÇILIYOR... ✨",
    openingSub: "Şansınız deneniyor, lütfen bekleyin! 🎁",
    yourReward: "ÖDÜLÜNÜZ!",
    awesomeBtn: "HARİKA! 🎉",
    howToTitle: "ANAHTARLAR NASIL ALINIR?",
    item1Title: "Yeni Kullanıcı Bonusu",
    item1Sub: "Kayıt olduğunuz için +1 altın anahtar kazandınız.",
    item2Title: "Arkadaşlarınızı Davet Edin",
    item2Sub: "Her yeni arkadaşınız için +1 anahtar alın.",
    item3Title: "Günlük Aktivite",
    item3Sub: "Her gün en az 1 egzersiz yapın ve 7 günde anahtar kazanın.",
    getBtn: "Al 🔑",
    daysCount: "gün",
    moreKeysTitle: "Daha fazla anahtar - daha fazla şans!",
    moreKeysSub: "Aktif olun ve hediyeleri kazanın!",
    inviteTitle: "ARKADAŞLARINI DAVET ET",
    inviteHero: "Arkadaşlarınızı davet edin ve anahtar kazanın!",
    yourInviteLink: "Davet bağlantınız",
    copied: "Kopyalandı!",
    copyText: "Kopyala",
    moreShare: "Daha Fazla",
    congratsTitle: "TEBRİKLER! 🎉",
    youGotKey: "Yeni bir altın anahtar kazandınız!",
    totalKeys: "Şimdi toplamda",
    continueBtn: "Devam Et",
    myRewardsTitle: "ÖDÜLLERİM",
    tabActive: "Aktif",
    tabHistory: "Geçmiş",
    noRewards: "Ödül bulunamadı",
    dateUntil: "Son kullanma:",
    dateEnded: "Bitiş tarihi:",
    dateGiven: "Verilme tarihi: Bugün",
    bonusTitle: "Yeni Kullanıcı Bonusu",
    keyBadge: "1 Anahtar",
    daysBadge: "gün",
    doneTag: "Tamamlandı",
    realPaymentsLock: "Gerçek ödemelerle aktifleşir"
  },
  zh: {
    mysteryBox: "神秘宝箱",
    keysCountLabel: "1 个宝箱",
    promoCashback: "优惠码与返现",
    cashbackTag: "25% 返现",
    keysAvailable: "您拥有的钥匙",
    ta: "把",
    taBox: "个宝箱",
    openBoxBtn: "开启宝箱 ✨",
    mainDesc: "使用钥匙开启宝箱，赢取珍贵奖励！",
    howToGetKeys: "如何获取钥匙？➔",
    myRewards: "我的奖励 🎁 ➔",
    openingText: "宝箱开启中... ✨",
    openingSub: "正在测试您的运气，请稍候！🎁",
    yourReward: "您的奖励！",
    awesomeBtn: "太棒了！🎉",
    howToTitle: "如何获取钥匙？",
    item1Title: "新用户奖励",
    item1Sub: "感谢注册，您已获得 +1 把金钥匙。",
    item2Title: "邀请好友",
    item2Sub: "每邀请一位新好友即可获得 +1 把钥匙。",
    item3Title: "每日活跃",
    item3Sub: "每天至少完成1个练习，7天后即可获得钥匙。",
    getBtn: "领取 🔑",
    daysCount: "天",
    moreKeysTitle: "钥匙越多，机会越多！",
    moreKeysSub: "保持活跃，赢取好礼！",
    inviteTitle: "邀请好友",
    inviteHero: "邀请好友，获取金钥匙！",
    yourInviteLink: "您的邀请链接",
    copied: "已复制！",
    copyText: "复制",
    moreShare: "更多",
    congratsTitle: "恭喜！🎉",
    youGotKey: "您获得了新的金钥匙！",
    totalKeys: "现在您共有",
    continueBtn: "继续",
    myRewardsTitle: "我的奖励",
    tabActive: "有效",
    tabHistory: "历史",
    noRewards: "暂无奖励",
    dateUntil: "到期时间：",
    dateEnded: "结束时间：",
    dateGiven: "赠送日期：今天",
    bonusTitle: "新用户奖励",
    keyBadge: "1 把钥匙",
    daysBadge: "天",
    doneTag: "已完成",
    realPaymentsLock: "通过真实支付激活"
  },
  ky: {
    mysteryBox: "СЫРДУУ САНДЫК",
    keysCountLabel: "1 сандык",
    promoCashback: "ПРОМОКОД ЖАНА КЭШБЭК",
    cashbackTag: "25% Кэшбэк",
    keysAvailable: "Сизде бар ачкычтар",
    ta: "даана",
    taBox: "сандык",
    openBoxBtn: "САНДЫКТЫ АЧУУ ✨",
    mainDesc: "Ачкычтар менен сандыктарды ачып, баалуу белектерди утууңуз!",
    howToGetKeys: "Ачкычтарды кантип алса болот? ➔",
    myRewards: "Менин белектерим 🎁 ➔",
    openingText: "САНДЫК АЧЫЛУУДА... ✨",
    openingSub: "Бактыңызды текшерип жатабыз, күтө туруңуз! 🎁",
    yourReward: "СИЗДИН БЕЛЕГИҢИЗ!",
    awesomeBtn: "СОНУН! 🎉",
    howToTitle: "АЧКЫЧТАРДЫ КАНТИП АЛСА БОЛОТ?",
    item1Title: "Жаңы колдонуучу бонусу",
    item1Sub: "Катталганыңыз үчүн +1 алтын ачкыч берилди.",
    item2Title: "Досторду чакырыңыз",
    item2Sub: "Ар бир жаңы дос үчүн +1 ачкыч алыңыз.",
    item3Title: "Күндөлүк активдүүлүк",
    item3Sub: "Күн сайын кеминде 1 көнүгүү иштеп, 7 күндө ачкыч алыңыз.",
    getBtn: "Алуу 🔑",
    daysCount: "күн",
    moreKeysTitle: "Көбүрөөк ачкыч - көбүрөөк мүмкүнчүлүк!",
    moreKeysSub: "Активдүү болуп, белектерге ээ болуңуз!",
    inviteTitle: "ДОСТОРДУ ЧАКЫРУУ",
    inviteHero: "Досторуңузду чакырып, ачкычтарга ээ болуңуз!",
    yourInviteLink: "Сиздин чакыруу шилтемеңиз",
    copied: "Көчүрүлдү!",
    copyText: "Көчүрүү",
    moreShare: "Дагы",
    congratsTitle: "КУТТУКТАЙБЫЗ! 🎉",
    youGotKey: "Сиз жаңы алтын ачкычка ээ болдуңуз!",
    totalKeys: "Эми сизде жалпы",
    continueBtn: "Улантуу",
    myRewardsTitle: "МЕНИН БЕЛЕКТЕРИМ",
    tabActive: "Активдүү",
    tabHistory: "Тарых",
    noRewards: "Белектер жок",
    dateUntil: "Аяктоо мөөнөтү:",
    dateEnded: "Аяктаган күнү:",
    dateGiven: "Берилген күнү: Бүгүн",
    bonusTitle: "Жаңы Колдонуучу Бонусу",
    keyBadge: "1 Ачкыч",
    daysBadge: "күн",
    doneTag: "Аткарылды",
    realPaymentsLock: "Реалдуу төлөмдөр менен активдешет"
  },
  kk: {
    mysteryBox: "СЫРЛЫ САНДЫҚ",
    keysCountLabel: "1 сандық",
    promoCashback: "ПРОМОКОД ЖӘНЕ КЭШБЭК",
    cashbackTag: "25% Кэшбэк",
    keysAvailable: "Сіздегі бар кілттер",
    ta: "дана",
    taBox: "сандық",
    openBoxBtn: "САНДЫҚТЫ АШУ ✨",
    mainDesc: "Кілттермен сандықты ашып, бағалы сыйлықтарды ұтып алыңыз!",
    howToGetKeys: "Кілттерді қалай алуға болады? ➔",
    myRewards: "Менің сыйлықтарым 🎁 ➔",
    openingText: "САНДЫҚ АШЫЛУДА... ✨",
    openingSub: "Бағыңыз сыналуда, күте тұрыңыз! 🎁",
    yourReward: "СІЗДІҢ СЫЙЛЫҒЫҢЫЗ!",
    awesomeBtn: "КЕРЕМЕТ! 🎉",
    howToTitle: "КІЛТТЕРДІ ҚАЛАЙ АЛУҒА БОЛАДЫ?",
    item1Title: "Жаңа пайдаланушы бонусы",
    item1Sub: "Тіркелгеніңіз үшін +1 алтын кілт берілді.",
    item2Title: "Достарыңызды шақырыңыз",
    item2Sub: "Әрбір жаңа дос үшін +1 кілт алыңыз.",
    item3Title: "Күнделікті белсенділік",
    item3Sub: "Күн сайын кемінде 1 жаттығу жасап, 7 күнде кілт алыңыз.",
    getBtn: "Алу 🔑",
    daysCount: "күн",
    moreKeysTitle: "Көбірек кілт — көбірек мүмкіндік!",
    moreKeysSub: "Белсенді болыңыз және сыйлықтарға ие болыңыз!",
    inviteTitle: "ДОСТАРДЫ ШАҚЫРУ",
    inviteHero: "Достарыңызды шақырып, кілттерге ие болыңыз!",
    yourInviteLink: "Сіздің шақыру сілтемеңіз",
    copied: "Көшірілді!",
    copyText: "Көшіру",
    moreShare: "Тағы",
    congratsTitle: "ҚҰТТЫҚТАЙМЫЗ! 🎉",
    youGotKey: "Сіз жаңа алтын кілтке ие болдыңыз!",
    totalKeys: "Енді сізде барлығы",
    continueBtn: "Жалғастыру",
    myRewardsTitle: "МЕНІҢ СЫЙЛЫҚТАРЫМ",
    tabActive: "Белсенді",
    tabHistory: "Тарих",
    noRewards: "Сыйлықтар жоқ",
    dateUntil: "Аяқталу мерзімі:",
    dateEnded: "Аяқталған күні:",
    dateGiven: "Берілген күні: Бүгін",
    bonusTitle: "Жаңа Пайдаланушы Бонусы",
    keyBadge: "1 Кілт",
    daysBadge: "күн",
    doneTag: "Орындалды"
  },
  tg: {
    mysteryBox: "САНДУҚИ ПИНҲОНӢ",
    keysCountLabel: "1 сандуқ",
    promoCashback: "ПРОМОКОД ВА КЭШБЕК",
    cashbackTag: "25% Кэшбек",
    keysAvailable: "Калидҳои мавҷудаи шумо",
    ta: "адад",
    taBox: "сандуқ",
    openBoxBtn: "КУШОДАНИ САНДУҚ ✨",
    mainDesc: "Сандуқҳоро бо калидҳо кушоед ва тӯҳфаҳои қиматнок ба даст оред!",
    howToGetKeys: "Калидҳоро чӣ тавр бояд гирифт? ➔",
    myRewards: "Тӯҳфаҳои ман 🎁 ➔",
    openingText: "САНДУҚ КУШОДА ШУДААСТ... ✨",
    openingSub: "Бахти шумо санҷида мешавад, лутфан интизор шавед! 🎁",
    yourReward: "ТӮҲФАИ ШУМО!",
    awesomeBtn: "ОЛӢ! 🎉",
    howToTitle: "КАЛИДҲОРО ЧӢ ТАВР БОЯД ГИРИФТ?",
    item1Title: "Бонуси корбари нав",
    item1Sub: "Барои аъзогӣ ба шумо +1 калиди тиллоӣ дода шуд.",
    item2Title: "Дӯстонро даъват кунед",
    item2Sub: "Барои ҳар як дӯсти нав +1 калид гиред.",
    item3Title: "Фаъолияти ҳаррӯза",
    item3Sub: "Ҳар рӯз ҳадди аққал 1 машқро иҷро кунед ва дар 7 рӯз калид гиред.",
    getBtn: "Гирифтан 🔑",
    daysCount: "рӯз",
    moreKeysTitle: "Калидҳои бештар - имкониятҳои бештар!",
    moreKeysSub: "Фаъол бошед ва тӯҳфаҳо ба даст оред!",
    inviteTitle: "ДАЪВАТИ ДӮСТОН",
    inviteHero: "Дӯстони худро даъват кунед ва калидҳо гиред!",
    yourInviteLink: "Истиноди даъвати шумо",
    copied: "Нусхабардорӣ шуд!",
    copyText: "Нусхабардорӣ",
    moreShare: "Зиёдтар",
    congratsTitle: "ТАБРИК МЕКУНЕМ! 🎉",
    youGotKey: "Шумо соҳиби калиди нав шудед!",
    totalKeys: "Инак шумо дорои",
    continueBtn: "Идома додан",
    myRewardsTitle: "ТӮҲФАҲОИ МАН",
    tabActive: "Фаъол",
    tabHistory: "Таърих",
    noRewards: "Тӯҳфаҳо нестанд",
    dateUntil: "Мӯҳлати анҷом:",
    dateEnded: "Санаи анҷом:",
    dateGiven: "Санаи додан: Имрӯз",
    bonusTitle: "Бонуси Корбари Нав",
    keyBadge: "1 Калид",
    daysBadge: "рӯз",
    doneTag: "Иҷро шуд"
  },
  ja: {
    mysteryBox: "ミステリーボックス",
    keysCountLabel: "1個の宝箱",
    promoCashback: "プロモコード＆キャッシュバック",
    cashbackTag: "25% キャッシュバック",
    keysAvailable: "所持キー",
    ta: "個",
    taBox: "個の宝箱",
    openBoxBtn: "宝箱を開ける ✨",
    mainDesc: "キーで宝箱を開けて、豪華な報酬をゲットしよう！",
    howToGetKeys: "キーの獲得方法は？ ➔",
    myRewards: "獲得した報酬 🎁 ➔",
    openingText: "宝箱を開けています... ✨",
    openingSub: "運試し中、少々お待ちください！ 🎁",
    yourReward: "あなたの報酬！",
    awesomeBtn: "素晴らしい！ 🎉",
    howToTitle: "キーの獲得方法は？",
    item1Title: "新規ユーザーボーナス",
    item1Sub: "登録ボーナスとしてゴールドキーを1個獲得しました。",
    item2Title: "友達を招待する",
    item2Sub: "新しい友達を1人招待するごとにキーを1個獲得。",
    item3Title: "毎日のアクティビティ",
    item3Sub: "毎日最低1回練習を解いて、7日目にキーを獲得しよう。",
    getBtn: "受け取る 🔑",
    daysCount: "日",
    moreKeysTitle: "キーが多いほどチャンスが増える！",
    moreKeysSub: "アクティブに活動して豪華プレゼントをゲット！",
    inviteTitle: "友達を招待",
    inviteHero: "友達を招待してゴールドキーを獲得しよう！",
    yourInviteLink: "あなたの招待リンク",
    copied: "コピーしました！",
    copyText: "コピー",
    moreShare: "その他",
    congratsTitle: "おめでとうございます！ 🎉",
    youGotKey: "新しいゴールドキーを獲得しました！",
    totalKeys: "現在の合計所持数:",
    continueBtn: "続ける",
    myRewardsTitle: "獲得した報酬",
    tabActive: "有効",
    tabHistory: "履歴",
    noRewards: "報酬はありません",
    dateUntil: "有効期限:",
    dateEnded: "終了日:",
    dateGiven: "進呈日: 今日",
    bonusTitle: "新規ユーザーボーナス",
    keyBadge: "1 キー",
    daysBadge: "日",
    doneTag: "完了",
    realPaymentsLock: "実際の決済で有効化されます"
  },
  ko: {
    mysteryBox: "미스테리 상자",
    keysCountLabel: "상자 1개",
    promoCashback: "프로모션 코드 & 캐시백",
    cashbackTag: "25% 캐시백",
    keysAvailable: "보유 중인 열쇠",
    ta: "개",
    taBox: "개 상자",
    openBoxBtn: "상자 열기 ✨",
    mainDesc: "열쇠로 보물상자를 열고 푸짐한 보상을 받으세요!",
    howToGetKeys: "열쇠를 얻는 방법은? ➔",
    myRewards: "내 보상 🎁 ➔",
    openingText: "상자를 여는 중... ✨",
    openingSub: "행운을 시험하고 있습니다. 잠시만 기다려주세요! 🎁",
    yourReward: "획득한 보상!",
    awesomeBtn: "멋져요! 🎉",
    howToTitle: "열쇠를 얻는 방법은?",
    item1Title: "신규 유저 보너스",
    item1Sub: "가입 축하 황금 열쇠 1개를 받았습니다.",
    item2Title: "친구 초대하기",
    item2Sub: "새로운 친구를 초대할 때마다 열쇠 1개 획득.",
    item3Title: "매일 연속 출석",
    item3Sub: "매일 최소 1개 연습을 풀고 7일째에 열쇠를 받으세요.",
    getBtn: "받기 🔑",
    daysCount: "일",
    moreKeysTitle: "열쇠가 많을수록 더 많은 기회!",
    moreKeysSub: "꾸준히 활동하고 선물을 받으세요!",
    inviteTitle: "친구 초대",
    inviteHero: "친구를 초대하고 황금 열쇠를 받으세요!",
    yourInviteLink: "내 초대 링크",
    copied: "복사되었습니다!",
    copyText: "복사",
    moreShare: "더보기",
    congratsTitle: "축하합니다! 🎉",
    youGotKey: "새로운 황금 열쇠를 획득했습니다!",
    totalKeys: "현재 보유한 총 열쇠:",
    continueBtn: "계속하기",
    myRewardsTitle: "내 보상",
    tabActive: "사용 가능",
    tabHistory: "기록",
    noRewards: "보상이 없습니다",
    dateUntil: "만료일:",
    dateEnded: "종료일:",
    dateGiven: "지급일: 오늘",
    bonusTitle: "신규 유저 보너스",
    keyBadge: "열쇠 1개",
    daysBadge: "일",
    doneTag: "완료",
    realPaymentsLock: "실제 결제 시 활성화됩니다"
  }
};

export default function MysteryBoxScreen({ navigation, route }) {
  const { user, initialTab = 'main', language = 'uz' } = route.params || {};
  const t = MYSTERY_TRANSLATIONS[language] || MYSTERY_TRANSLATIONS['uz'];

  // Active Tab: 'main' (Sirli Sandiq) | 'opening' | 'reward' | 'how_to_get' | 'invite' | 'key_claimed' | 'my_rewards'
  const [activeScreen, setActiveScreen] = useState(initialTab);
  // Per-user isolated storage key
  const userIdKey = user?.customId || user?.id || 'guest';
  const KEYS_STORAGE_KEY = `user_mystery_keys_count_${userIdKey}`;
  const REWARDS_STORAGE_KEY = `user_won_rewards_history_${userIdKey}`;

  const [keysCount, setKeysCount] = useState(1); // 1 key for new registered user
  const [claimedReward, setClaimedReward] = useState(null);
  const [rewardsTab, setRewardsTab] = useState('Faol'); // 'Faol' | 'Tarix'

  // Invitation & Referral state
  const rawPromo = user?.customId ? user.customId.replace(/^#+/, '') : 'MICHAEL';
  const referralLink = `https://iqromax.net/downloading?promo=${rawPromo}`;
  const shareMessage = `IQROMAX ilovasida ro'yxatdan o'ting va 3 kunlik BEPUL Premium hamda Sirli Sandiq sovg'asini oling!\n\nMening promokodim: ${rawPromo}\n\nIlovani yuklab olish uchun havola:\n${referralLink}`;
  const [isCopied, setIsCopied] = useState(false);

  // Real dynamic states for bonus keys & streak
  const [welcomeBonusClaimed, setWelcomeBonusClaimed] = useState(true); // User received 1 bonus key on registration
  const [streakDays, setStreakDays] = useState(0);
  const [streakClaimed, setStreakClaimed] = useState(false);

  useFocusEffect(
    useCallback(() => {
      async function loadUserData() {
        try {
          const storedKeys = await AsyncStorage.getItem(KEYS_STORAGE_KEY);
          if (storedKeys !== null) {
            setKeysCount(parseInt(storedKeys, 10));
          } else {
            setKeysCount(1);
            await AsyncStorage.setItem(KEYS_STORAGE_KEY, '1');
          }

          const storedStreak = await AsyncStorage.getItem('user_daily_streak_days');
          const lastExerciseDate = await AsyncStorage.getItem('user_last_exercise_date');
          const todayStr = new Date().toISOString().slice(0, 10);
          
          let daysCount = storedStreak ? parseInt(storedStreak, 10) : 0;
          if (lastExerciseDate === todayStr && daysCount === 0) {
            daysCount = 1;
          }

          setStreakDays(Math.min(7, Math.max(0, daysCount)));
          if (daysCount >= 7) {
            const claimed = await AsyncStorage.getItem('streak_7_key_claimed');
            setStreakClaimed(claimed === 'true');
          }
        } catch (e) {}
      }
      loadUserData();
    }, [KEYS_STORAGE_KEY])
  );

  React.useEffect(() => {
    const sub = DeviceEventEmitter.addListener('user_keys_updated', () => {
      AsyncStorage.getItem(KEYS_STORAGE_KEY).then(val => {
        if (val !== null) setKeysCount(parseInt(val, 10));
      }).catch(() => {});
    });
    return () => sub.remove();
  }, [KEYS_STORAGE_KEY]);

  const handleClaimStreakBonus = async () => {
    if (streakDays >= 7 && !streakClaimed) {
      setKeysCount(prev => prev + 1);
      setStreakClaimed(true);
      try {
        await AsyncStorage.setItem('streak_7_key_claimed', 'true');
      } catch(e) {}
      Alert.alert("Tabriklaymiz! 🎉", "7 kunlik faollik uchun +1 ta oltin kalit berildi!");
    }
  };

  // Rewards List State with real storage
  const [rewardsList, setRewardsList] = useState([]);

  const loadSavedRewards = async () => {
    try {
      const storedRewards = await AsyncStorage.getItem(REWARDS_STORAGE_KEY);
      if (storedRewards) {
        const parsed = JSON.parse(storedRewards);
        let currentPremExp = await AsyncStorage.getItem('user_premium_expires_at');
        
        // Query backend for real DB status to ensure sync with Admin Panel
        try {
          if (user?.id || user?.customId) {
            const res = await fetch(`${API_URL}/admin/users`);
            if (res.ok) {
              const allUsers = await res.json();
              const me = allUsers.find(u => u.id === user.id || u.customId === user.customId || u.email === user.email);
              if (me) {
                if (me.premiumExpiresAt) {
                  const expTime = new Date(me.premiumExpiresAt).getTime();
                  if (!isNaN(expTime) && Date.now() < expTime) {
                    currentPremExp = expTime.toString();
                    await AsyncStorage.setItem('user_premium_expires_at', expTime.toString());
                  } else {
                    currentPremExp = null;
                    await AsyncStorage.removeItem('user_premium_expires_at');
                  }
                } else {
                  currentPremExp = null;
                  await AsyncStorage.removeItem('user_premium_expires_at');
                }
              }
            }
          }
        } catch (err) {}

        const now = Date.now();
        const updated = parsed.map(item => {
          if (item.type === 'premium') {
            const hasActivePremKey = !!currentPremExp && parseInt(currentPremExp, 10) > now;
            const isStillActive = hasActivePremKey && (!item.expiresAt || now < item.expiresAt);
            const expDateObj = item.expiresAt ? new Date(item.expiresAt) : new Date();
            const dateStr = expDateObj.toLocaleDateString();
            const timeStr = expDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            return {
              ...item,
              date: isStillActive ? `Tugash muddati: ${dateStr} ${timeStr}` : `Tugagan sana: ${dateStr} ${timeStr}`,
              status: isStillActive ? 'Faol' : 'Tarix'
            };
          }
          return item;
        });
        setRewardsList(updated);
        await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updated));
      } else {
        // Initial default rewards if empty for this user
        const initialRewards = [
          { id: '1', title: 'Yangi Foydalanuvchi Bonusi', date: 'Berilgan sana: Bugun', status: 'Faol', type: 'premium', icon: 'crown', color: '#F59E0B', badge: '1 ta Kalit' }
        ];
        setRewardsList(initialRewards);
        await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(initialRewards));
      }
    } catch (e) {}
  };

  const copyLink = async () => {
    await Clipboard.setStringAsync(referralLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const shareReferral = async () => {
    try {
      await Share.share({ message: shareMessage });
    } catch (e) {}
  };

  // Fetch Admin Created Mystery Box Items
  const [adminBoxItems, setAdminBoxItems] = useState([]);

  React.useEffect(() => {
    loadSavedRewards();

    async function fetchAdminItems() {
      try {
        const res = await fetch(`${API_URL}/mystery-box`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setAdminBoxItems(data);
          }
        }
      } catch (e) {}
    }
    fetchAdminItems();

    // Socket listener: when admin revokes premium, update or clear active premium item from user's Sovg'alarim list
    const socket = io(API_URL, { transports: ['websocket'] });
    socket.on('premium_revoked', async (data) => {
      // Check if event targets current user or matches customId/id
      const matchesUser = !user || 
        (data.userId && data.userId === user.id) || 
        (data.customId && data.customId === user.customId) ||
        (data.userId && data.userId === user.customId);

      if (matchesUser) {
        try {
          await AsyncStorage.removeItem('user_premium_expires_at');
          const storedRewards = await AsyncStorage.getItem(REWARDS_STORAGE_KEY);
          if (storedRewards) {
            const parsed = JSON.parse(storedRewards);
            // Update active premium reward item status to 'Tarix' or remove active premium
            const updated = parsed.map(item => {
              if (item.type === 'premium') {
                return {
                  ...item,
                  status: 'Tarix',
                  date: `Tugagan sana: ${new Date().toLocaleDateString()}`
                };
              }
              return item;
            }).filter(item => item.status !== 'Faol' || item.type !== 'premium');

            setRewardsList(updated);
            await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updated));
          }
        } catch (e) {
          console.error('Revoke socket handling error:', e);
        }
      }
    });

    return () => {
      socket.off('premium_revoked');
      socket.disconnect();
    };
  }, [userIdKey]);

  const openBoxHandler = () => {
    if (keysCount <= 0) return;
    setActiveScreen('opening');
    setTimeout(async () => {
      let selected = null;
      if (adminBoxItems.length > 0) {
        const randomItem = adminBoxItems[Math.floor(Math.random() * adminBoxItems.length)];
        selected = {
          title: randomItem.name,
          sub: randomItem.description,
          badge: randomItem.badge || (randomItem.type === 'energy' ? `⚡ ${randomItem.value || 1} Energiya` : `👑 ${randomItem.value || 1} kun Premium`),
          type: randomItem.type || 'premium',
          value: randomItem.value || 1
        };
      } else {
        const rewardOptions = [
          { title: '1 KUNLIK BEPUL PREMIUM', sub: 'Ajoyib! Siz 1 kunlik (24 soat) Premium status yutdingiz! Chaqmoqlaringiz cheksiz bo\'ldi!', badge: '👑 1 kun Premium', type: 'premium', value: 1 },
          { title: '3 KUNLIK BEPUL PREMIUM', sub: 'Ajoyib! Siz 3 kunlik Premium status yutdingiz! Chaqmoqlaringiz cheksiz bo\'ldi!', badge: '👑 3 kun Premium', type: 'premium', value: 3 },
          { title: '5 TA ENERGIYA CHAQMOQLAR', sub: 'Ajoyib! Siz +5 ta energiya chaqmoq yutdingiz!', badge: '⚡ +5 Energiya', type: 'energy', value: 5 },
        ];
        selected = rewardOptions[Math.floor(Math.random() * rewardOptions.length)];
      }

      // Activate Premium logic or Energy logic & save to history
      try {
        let expTime = null;
        if (selected.type === 'premium') {
          const days = selected.value || 1;
          const currentExp = await AsyncStorage.getItem('user_premium_expires_at');
          const baseTime = (currentExp && parseInt(currentExp, 10) > Date.now()) ? parseInt(currentExp, 10) : Date.now();
          expTime = baseTime + (days * 24 * 60 * 60 * 1000); // Add days * 24 Hours
          await AsyncStorage.setItem('user_premium_expires_at', expTime.toString());

          // Send to backend server to update DB and emit real-time socket event for Admin Panel
          if (user?.id || user?.customId) {
            fetch(`${API_URL}/user/claim-premium`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                userId: user.id || user.customId,
                days: days
              })
            }).catch(() => {});
          }
        } else if (selected.type === 'energy') {
          const addVal = selected.value || 1;
          const storedData = await AsyncStorage.getItem('user_energy_data');
          let curEnergy = 2;
          let lastUpdated = Date.now();
          if (storedData) {
            const parsed = JSON.parse(storedData);
            curEnergy = parsed.energy || 2;
            lastUpdated = parsed.lastUpdated || Date.now();
          }
          const newEnergy = Math.min(10, curEnergy + addVal);
          await AsyncStorage.setItem('user_energy_data', JSON.stringify({ energy: newEnergy, lastUpdated }));
        }

        let dateLabel = `Yutib olindi: ${new Date().toLocaleDateString()}`;
        if (selected.type === 'premium' && expTime) {
          const expDateObj = new Date(expTime);
          const dateStr = expDateObj.toLocaleDateString();
          const timeStr = expDateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
          dateLabel = `Tugash muddati: ${dateStr} ${timeStr}`;
        }

        // Save new reward to user's real rewards history array
        const newHistoryItem = {
          id: Date.now().toString(),
          title: selected.title,
          sub: selected.sub,
          date: dateLabel,
          status: 'Faol',
          expiresAt: expTime,
          type: selected.type,
          icon: selected.type === 'energy' ? 'lightning-bolt' : 'crown',
          color: selected.type === 'energy' ? '#F59E0B' : '#A855F7',
          badge: selected.badge
        };

        const updatedHistory = [newHistoryItem, ...rewardsList];
        setRewardsList(updatedHistory);
        await AsyncStorage.setItem(REWARDS_STORAGE_KEY, JSON.stringify(updatedHistory));

      } catch (e) {
        console.error('Save reward error:', e);
      }

      setClaimedReward(selected);
      setKeysCount(prev => {
        const nextVal = Math.max(0, prev - 1);
        AsyncStorage.setItem(KEYS_STORAGE_KEY, nextVal.toString()).catch(() => {});
        return nextVal;
      });
      setActiveScreen('reward');
    }, 1500);
  };

  // Render header with Back button & info button
  const renderHeader = (title, onInfoPress) => (
    <View style={styles.headerRow}>
      <TouchableOpacity style={styles.backCircleBtn} onPress={() => navigation.goBack()}>
        <MaterialCommunityIcons name="chevron-left" size={28} color="#FFF" />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>{title}</Text>
      {onInfoPress ? (
        <TouchableOpacity style={styles.infoCircleBtn} onPress={onInfoPress}>
          <MaterialCommunityIcons name="information-outline" size={22} color="#9CA3AF" />
        </TouchableOpacity>
      ) : (
        <View style={{ width: 40 }} />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070714" />

      {/* SCREEN 1: MAIN SIRLI SANDIQ */}
      {activeScreen === 'main' && (
        <View style={{ flex: 1 }}>
          {renderHeader(t.mysteryBox, () => setActiveScreen('how_to_get'))}

          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Keys Count Pill */}
            <View style={styles.keysPillCard}>
              <Image source={require('../assets/gold_star.png')} style={styles.keyIconImg} contentFit="contain" />
              <View>
                <Text style={styles.keysLabel}>{t.keysAvailable}</Text>
                <Text style={styles.keysValue}>{keysCount} {t.ta}</Text>
              </View>
            </View>

            {/* Glowing Chest */}
            <View style={styles.chestGlowContainer}>
              <View style={styles.chestGlowCircle} />
              <Image source={require('../assets/sirli_sandiq_high_quality_nurli.gif')} style={styles.chestImg} contentFit="contain" />
            </View>

            <Text style={styles.mainDescText}>
              {t.mainDesc}
            </Text>

            {/* Action Button */}
            <TouchableOpacity 
              style={[styles.mainGradientBtn, keysCount <= 0 && { opacity: 0.6 }]} 
              activeOpacity={0.8}
              disabled={keysCount <= 0}
              onPress={openBoxHandler}
            >
              <Text style={styles.mainGradientBtnText}>{t.openBoxBtn}</Text>
            </TouchableOpacity>

            {/* Link: How to get keys */}
            <TouchableOpacity style={styles.howToLinkBtn} onPress={() => setActiveScreen('how_to_get')}>
              <Text style={styles.howToLinkText}>{t.howToGetKeys}</Text>
            </TouchableOpacity>

            {/* Link: My rewards */}
            <TouchableOpacity style={[styles.howToLinkBtn, { marginTop: 10 }]} onPress={() => setActiveScreen('my_rewards')}>
              <Text style={[styles.howToLinkText, { color: '#A855F7' }]}>{t.myRewards}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* SCREEN 2: OPENING ANIMATION */}
      {activeScreen === 'opening' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#070714' }}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%', marginTop: -40 }}>
            <View style={[styles.chestGlowContainer, { width: 420, height: 420, marginVertical: 0 }]}>
              <Image source={require('../assets/sirli_sandiq_juda_tez_high_speed.gif')} style={{ width: 400, height: 400 }} contentFit="contain" />
            </View>

            {/* Premium Animated Glowing Status Badge */}
            <View style={styles.openingStatusBadge}>
              <MaterialCommunityIcons name="sparkles" size={20} color="#F59E0B" style={{ marginRight: 8 }} />
              <Text style={styles.openingStatusText}>
                {t.openingText}
              </Text>
            </View>

            <Text style={{ color: '#9CA3AF', fontSize: 13, fontFamily: 'Inter_500Medium', marginTop: 10 }}>
              {t.openingSub}
            </Text>
          </View>
        </View>
      )}

      {/* SCREEN 3: SIZNING SOVG'ANGIZ (REWARD) */}
      {activeScreen === 'reward' && (
        <View style={{ flex: 1 }}>
          {renderHeader(t.yourReward)}

          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
            {/* Reward Card */}
            <View style={styles.rewardCardContainer}>
              <View style={styles.rewardIconGlowCircle}>
                <MaterialCommunityIcons name="crown" size={64} color="#FBBF24" />
              </View>

              <Text style={styles.rewardCardSubTitle}>{claimedReward?.badge || `3 ${t.daysBadge.toUpperCase()}`}</Text>
              <Text style={styles.rewardCardTitle}>{claimedReward?.title || 'BEPUL PREMIUM'}</Text>
              <Text style={styles.rewardCardDesc}>{claimedReward?.sub || 'Premium status active!'}</Text>

              <View style={styles.rewardBadgeChip}>
                <Text style={styles.rewardBadgeChipText}>⚡ {claimedReward?.badge || `3 ${t.daysBadge}`}</Text>
              </View>
            </View>

            {/* AJOYIB BUTTON */}
            <TouchableOpacity 
              style={styles.mainGradientBtn} 
              activeOpacity={0.8}
              onPress={() => setActiveScreen('main')}
            >
              <Text style={styles.mainGradientBtnText}>{t.awesomeBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* SCREEN 4: KALITLAR QANDAY OLINADI? */}
      {activeScreen === 'how_to_get' && (
        <View style={{ flex: 1 }}>
          {renderHeader(t.howToTitle)}

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 10, gap: 14 }} showsVerticalScrollIndicator={false}>
            
            {/* Item 1: Yangi foydalanuvchi bonusi */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.15)', borderColor: '#3B82F6', borderWidth: 1 }]}>
                <MaterialCommunityIcons name="account-star-outline" size={24} color="#3B82F6" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>{t.item1Title}</Text>
                <Text style={styles.howItemSub}>{t.item1Sub}</Text>
              </View>
              <View style={styles.howCheckBtn}>
                <MaterialCommunityIcons name="check-bold" size={16} color="#10B981" />
              </View>
            </View>

            {/* Item 2: Do'stlarni taklif eting */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(34, 197, 94, 0.15)', borderColor: '#22C55E', borderWidth: 1 }]}>
                <MaterialCommunityIcons name="account-multiple-plus-outline" size={24} color="#22C55E" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>{t.item2Title}</Text>
                <Text style={styles.howItemSub}>{t.item2Sub}</Text>
              </View>
              <TouchableOpacity 
                style={styles.howInvitePlusCircleBtn} 
                activeOpacity={0.8}
                onPress={() => setActiveScreen('invite')}
              >
                <MaterialCommunityIcons name="plus" size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Item 3: Kunlik faollik */}
            <View style={styles.howItemCard}>
              <View style={[styles.howIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B', borderWidth: 1 }]}>
                <MaterialCommunityIcons name="calendar-fire" size={24} color="#F59E0B" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.howItemTitle}>{t.item3Title}</Text>
                <Text style={styles.howItemSub}>{t.item3Sub}</Text>
              </View>
              {streakDays >= 7 ? (
                streakClaimed ? (
                  <View style={styles.howCheckBtn}>
                    <MaterialCommunityIcons name="check-bold" size={16} color="#10B981" />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.howClaimBtn} onPress={handleClaimStreakBonus}>
                    <Text style={styles.howClaimBtnText}>{t.getBtn}</Text>
                  </TouchableOpacity>
                )
              ) : (
                <View style={styles.howProgressChip}>
                  <Text style={styles.howProgressChipText}>🔥 {streakDays}/7 {t.daysCount}</Text>
                </View>
              )}
            </View>

            {/* Bottom Banner */}
            <View style={styles.howBottomBanner}>
              <MaterialCommunityIcons name="gift-outline" size={32} color="#F59E0B" style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold', fontSize: 12 }}>{t.moreKeysTitle}</Text>
                <Text style={{ color: '#9CA3AF', fontFamily: 'Inter_400Regular', fontSize: 11, marginTop: 2 }}>{t.moreKeysSub}</Text>
              </View>
            </View>
          </ScrollView>
        </View>
      )}

      {/* SCREEN 5: DO'STLARNI TAKLIF ETISH */}
      {activeScreen === 'invite' && (
        <View style={{ flex: 1 }}>
          {renderHeader(t.inviteTitle)}

          <ScrollView contentContainerStyle={{ paddingHorizontal: 20, alignItems: 'center', paddingTop: 10 }} showsVerticalScrollIndicator={false}>
            {/* Gift Icon */}
            <View style={styles.giftIconContainer}>
              <MaterialCommunityIcons name="gift" size={56} color="#F59E0B" />
            </View>

            <Text style={{ color: '#FFF', fontSize: 18, fontFamily: 'Inter_700Bold', textAlign: 'center', marginTop: 16 }}>
              {t.inviteHero}
            </Text>

            {/* Referral Link Box */}
            <View style={styles.inviteLinkCard}>
              <Text style={{ color: '#64748B', fontSize: 11, textAlign: 'center', fontFamily: 'Inter_500Medium', marginBottom: 6 }}>{t.yourInviteLink}</Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <Text style={{ color: '#A855F7', fontSize: 14, fontFamily: 'Inter_700Bold' }}>{referralLink}</Text>
                <TouchableOpacity onPress={copyLink}>
                  <MaterialCommunityIcons name={isCopied ? "check" : "content-copy"} size={18} color="#A855F7" />
                </TouchableOpacity>
              </View>
            </View>

            {/* Social Share Grid */}
            <View style={styles.shareGridRow}>
              <TouchableOpacity style={styles.shareGridItem} onPress={shareReferral}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#229ED9' }]}>
                  <MaterialCommunityIcons name="send" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>Telegram</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareGridItem} onPress={shareReferral}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#25D366' }]}>
                  <MaterialCommunityIcons name="whatsapp" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>WhatsApp</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareGridItem} onPress={copyLink}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#334155' }]}>
                  <MaterialCommunityIcons name="content-copy" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>{t.copyText}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.shareGridItem} onPress={shareReferral}>
                <View style={[styles.shareIconCircle, { backgroundColor: '#475569' }]}>
                  <MaterialCommunityIcons name="dots-horizontal" size={20} color="#FFF" />
                </View>
                <Text style={styles.shareGridLabel}>{t.moreShare}</Text>
              </TouchableOpacity>
            </View>

          </ScrollView>
        </View>
      )}

      {/* SCREEN 6: YANGI KALIT OLINDINGIZ */}
      {activeScreen === 'key_claimed' && (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 }}>
          <View style={styles.chestGlowContainer}>
            <View style={[styles.chestGlowCircle, { backgroundColor: 'rgba(251, 191, 36, 0.25)', width: 240, height: 240 }]} />
            <MaterialCommunityIcons name="key-radiance" size={100} color="#FBBF24" />
          </View>

          <Text style={{ color: '#FFF', fontSize: 22, fontFamily: 'Inter_800ExtraBold', textAlign: 'center', marginTop: 20 }}>
            {t.congratsTitle}
          </Text>
          <Text style={{ color: '#9CA3AF', fontSize: 14, fontFamily: 'Inter_500Medium', textAlign: 'center', marginTop: 8 }}>
            {t.totalKeys} <Text style={{ color: '#F59E0B', fontFamily: 'Inter_700Bold' }}>{keysCount}</Text> {t.ta}.
          </Text>

          <TouchableOpacity 
            style={[styles.mainGradientBtn, { marginTop: 40 }]} 
            activeOpacity={0.8}
            onPress={() => setActiveScreen('main')}
          >
            <Text style={styles.mainGradientBtnText}>{t.continueBtn}</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* SCREEN 7: SOVG'ALARIM */}
      {activeScreen === 'my_rewards' && (
        <View style={{ flex: 1 }}>
          {renderHeader(t.myRewardsTitle)}

          <View style={{ flex: 1, paddingHorizontal: 20 }}>
            {/* Tabs Row */}
            <View style={styles.rewardsTabRow}>
              {[t.tabActive, t.tabHistory].map((tabLabel, idx) => {
                const tabKey = idx === 0 ? 'Faol' : 'Tarix';
                return (
                  <TouchableOpacity 
                    key={tabKey} 
                    style={[styles.rewardsTabItem, rewardsTab === tabKey && styles.rewardsTabItemActive]}
                    onPress={() => setRewardsTab(tabKey)}
                  >
                    <Text style={[styles.rewardsTabText, rewardsTab === tabKey && styles.rewardsTabTextActive]}>{tabLabel}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* List */}
            <ScrollView contentContainerStyle={{ gap: 12, paddingTop: 10, paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
              {rewardsList.filter(item => item.status === rewardsTab).length > 0 ? (
                rewardsList
                  .filter(item => item.status === rewardsTab)
                  .map((item) => (
                    <View key={item.id} style={styles.rewardListItem}>
                      <View style={[styles.rewardListIconBox, { backgroundColor: `${item.color || '#F59E0B'}20` }]}>
                        <MaterialCommunityIcons name={item.icon || 'gift-outline'} size={24} color={item.color || '#F59E0B'} />
                      </View>
                      <View style={{ flex: 1, paddingLeft: 12 }}>
                        <Text style={styles.rewardListTitle}>{item.type === 'premium' ? t.bonusTitle : item.title}</Text>
                        <Text style={styles.rewardListDate}>{item.date.replace('Tugash muddati:', t.dateUntil).replace('Tugagan sana:', t.dateEnded).replace('Berilgan sana: Bugun', t.dateGiven)}</Text>
                      </View>
                      {item.badge ? (
                        <View style={[styles.activeTagBadge, { backgroundColor: 'rgba(245, 158, 11, 0.15)', borderColor: '#F59E0B', borderWidth: 1 }]}>
                          <Text style={[styles.activeTagBadgeText, { color: '#F59E0B' }]}>{item.badge.replace('1 ta Kalit', t.keyBadge).replace('kun', t.daysBadge)}</Text>
                        </View>
                      ) : item.status === 'Faol' ? (
                        <View style={styles.activeTagBadge}>
                          <Text style={styles.activeTagBadgeText}>{t.tabActive}</Text>
                        </View>
                      ) : (
                        <View style={[styles.activeTagBadge, { backgroundColor: 'rgba(100, 116, 139, 0.15)' }]}>
                          <Text style={[styles.activeTagBadgeText, { color: '#94A3B8' }]}>{t.tabHistory}</Text>
                        </View>
                      )}
                    </View>
                  ))
              ) : (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop: 60 }}>
                  <MaterialCommunityIcons name="gift-off-outline" size={54} color="#475569" />
                  <Text style={{ color: '#94A3B8', fontSize: 14, fontFamily: 'Inter_600SemiBold', marginTop: 12 }}>
                    {t.noRewards}
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      )}

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#070714',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.06)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 50,
    paddingTop: 10,
  },
  keysPillCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13112A',
    borderWidth: 1.5,
    borderColor: '#382A5F',
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    gap: 14,
    marginTop: 6,
  },
  keyIconImg: {
    width: 32,
    height: 32,
  },
  keysLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  keysValue: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  chestGlowContainer: {
    width: 320,
    height: 320,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 15,
    alignSelf: 'center',
  },
  chestGlowCircle: {
    display: 'none',
  },
  chestImg: {
    width: 310,
    height: 310,
  },
  mainDescText: {
    color: '#9CA3AF',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    paddingHorizontal: 20,
    lineHeight: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  mainGradientBtn: {
    width: '100%',
    backgroundColor: '#F59E0B',
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  mainGradientBtnText: {
    color: '#070714',
    fontSize: 16,
    fontFamily: 'Inter_800ExtraBold',
    letterSpacing: 0.5,
  },
  howToLinkBtn: {
    marginTop: 16,
  },
  howToLinkText: {
    color: '#38BDF8',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },

  openingStatusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#13112A',
    borderWidth: 1.5,
    borderColor: '#F59E0B',
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 12,
    shadowColor: '#F59E0B',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 14,
    elevation: 10,
    marginTop: 10,
  },
  openingStatusText: {
    color: '#F59E0B',
    fontSize: 15,
    fontFamily: 'Inter_900Black',
    letterSpacing: 1.5,
  },

  // REWARD CARD
  rewardCardContainer: {
    width: '100%',
    backgroundColor: '#13112A',
    borderWidth: 1.5,
    borderColor: '#A855F7',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#A855F7',
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 12,
  },
  rewardIconGlowCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(251, 191, 36, 0.12)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  rewardCardSubTitle: {
    color: '#9CA3AF',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
    letterSpacing: 1,
  },
  rewardCardTitle: {
    color: '#F59E0B',
    fontSize: 22,
    fontFamily: 'Inter_900Black',
    marginTop: 4,
    textAlign: 'center',
  },
  rewardCardDesc: {
    color: '#D1D5DB',
    fontSize: 13,
    fontFamily: 'Inter_500Medium',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 18,
  },
  rewardBadgeChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  rewardBadgeChipText: {
    color: '#F59E0B',
    fontSize: 12,
    fontFamily: 'Inter_700Bold',
  },

  // HOW TO GET
  howItemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1225',
    borderWidth: 1,
    borderColor: '#1E2342',
    borderRadius: 18,
    padding: 16,
  },
  howIconBox: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  howItemTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  howItemSub: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
    lineHeight: 15,
  },
  howCheckBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  howInvitePlusCircleBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 5,
  },
  howClaimBtn: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 10,
  },
  howClaimBtnText: {
    color: '#070714',
    fontSize: 11,
    fontFamily: 'Inter_800ExtraBold',
  },
  howProgressChip: {
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.3)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
  },
  howProgressChipText: {
    color: '#F59E0B',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
  howBottomBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    borderWidth: 1,
    borderColor: 'rgba(245, 158, 11, 0.2)',
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },

  // INVITE SCREEN
  giftIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  inviteLinkCard: {
    width: '100%',
    backgroundColor: '#0F1225',
    borderWidth: 1,
    borderColor: '#1E2342',
    borderRadius: 18,
    padding: 16,
    marginVertical: 20,
  },
  shareGridRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 24,
  },
  shareGridItem: {
    alignItems: 'center',
    gap: 6,
  },
  shareIconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareGridLabel: {
    color: '#9CA3AF',
    fontSize: 11,
    fontFamily: 'Inter_500Medium',
  },
  inviteStatsContainer: {
    width: '100%',
    backgroundColor: '#0F1225',
    borderWidth: 1,
    borderColor: '#1E2342',
    borderRadius: 18,
    padding: 18,
  },
  inviteStatNum: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Inter_800ExtraBold',
  },
  inviteStatLabel: {
    color: '#64748B',
    fontSize: 10,
    fontFamily: 'Inter_500Medium',
    marginTop: 2,
  },

  // REWARDS LIST
  rewardsTabRow: {
    flexDirection: 'row',
    backgroundColor: '#0F1225',
    borderRadius: 14,
    padding: 4,
    marginBottom: 16,
  },
  rewardsTabItem: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  rewardsTabItemActive: {
    backgroundColor: '#1E2342',
  },
  rewardsTabText: {
    color: '#64748B',
    fontSize: 13,
    fontFamily: 'Inter_600SemiBold',
  },
  rewardsTabTextActive: {
    color: '#FFF',
    fontFamily: 'Inter_700Bold',
  },
  rewardListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0F1225',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: '#1E2342',
  },
  rewardListIconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rewardListTitle: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'Inter_700Bold',
  },
  rewardListDate: {
    color: '#64748B',
    fontSize: 11,
    fontFamily: 'Inter_400Regular',
    marginTop: 2,
  },
  activeTagBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  activeTagBadgeText: {
    color: '#10B981',
    fontSize: 11,
    fontFamily: 'Inter_700Bold',
  },
});
