import re

file_path = '/home/iam_masharipov/Desktop/iqromax_mobile/screens/StudentDashboardScreen.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

translations = {
  'en': ', invCharacter: "CHARACTER", invAvatar: "AVATAR", invFrame: "FRAME", invBg: "BG", invUnlocked: "Unlocked:", invSkins: "SKINS", invTopWear: "TOP WEAR", invPants: "PANTS", invShoes: "SHOES", invAccessories: "ACCESSORIES", invBackpacks: "BACKPACKS", invActiveChar: "ACTIVE CHARACTER"',
  'ru': ', invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "РАМКА", invBg: "ФОН", invUnlocked: "Разблокировано:", invSkins: "СКИНЫ", invTopWear: "ВЕРХНЯЯ ОДЕЖДА", invPants: "ШТАНЫ", invShoes: "ОБУВЬ", invAccessories: "АКСЕССУАРЫ", invBackpacks: "РЮКЗАКИ", invActiveChar: "АКТИВНЫЙ ПЕРСОНАЖ"',
  'uz': ', invCharacter: "PERSONAJ", invAvatar: "AVATAR", invFrame: "RAMKA", invBg: "FON", invUnlocked: "Ochilgan:", invSkins: "SKINLAR", invTopWear: "USTKI KIYIM", invPants: "SHIM", invShoes: "OYOQ KIYIM", invAccessories: "AKSESSUARLAR", invBackpacks: "RYUKZAKLAR", invActiveChar: "AKTIV PERSONAJ"',
  'ar': ', invCharacter: "شخصية", invAvatar: "صورة رمزية", invFrame: "إطار", invBg: "خلفية", invUnlocked: "مفتوح:", invSkins: "جلود", invTopWear: "ملابس علوية", invPants: "سراويل", invShoes: "أحذية", invAccessories: "إكسسوارات", invBackpacks: "حقائب ظهر", invActiveChar: "شخصية نشطة"',
  'tr': ', invCharacter: "KARAKTER", invAvatar: "AVATAR", invFrame: "ÇERÇEVE", invBg: "ARKA PLAN", invUnlocked: "Açıldı:", invSkins: "GÖRÜNÜMLER", invTopWear: "ÜST GİYİM", invPants: "PANTOLON", invShoes: "AYAKKABI", invAccessories: "AKSESUARLAR", invBackpacks: "SIRT ÇANTALARI", invActiveChar: "AKTİF KARAKTER"',
  'zh': ', invCharacter: "角色", invAvatar: "头像", invFrame: "相框", invBg: "背景", invUnlocked: "已解锁:", invSkins: "皮肤", invTopWear: "上衣", invPants: "裤子", invShoes: "鞋子", invAccessories: "配饰", invBackpacks: "背包", invActiveChar: "当前角色"',
  'ky': ', invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "АЛКАК", invBg: "ФОН", invUnlocked: "Ачылды:", invSkins: "СКИНДЕР", invTopWear: "ҮСТҮҢКҮ КИЙИМ", invPants: "ШЫМ", invShoes: "БУТ КИЙИМ", invAccessories: "АКСЕССУАРЛАР", invBackpacks: "РЮКЗАКТАР", invActiveChar: "АКТИВДҮҮ ПЕРСОНАЖ"',
  'kk': ', invCharacter: "КЕЙІПКЕР", invAvatar: "АВАТАР", invFrame: "ЖАҚТАУ", invBg: "ФОН", invUnlocked: "Ашылды:", invSkins: "СКИНДЕР", invTopWear: "ЖОҒАРҒЫ КИІМ", invPants: "ШАЛБАР", invShoes: "АЯҚ КИІМ", invAccessories: "АКСЕССУАРЛАР", invBackpacks: "РЮКЗАКТАР", invActiveChar: "БЕЛСЕНДІ КЕЙІПКЕР"',
  'tg': ', invCharacter: "ПЕРСОНАЖ", invAvatar: "АВАТАР", invFrame: "ЧОРЧӮБА", invBg: "ФОН", invUnlocked: "Кушода шуд:", invSkins: "СКИНҲО", invTopWear: "ЛИБОСИ БОЛОӢ", invPants: "ШИМ", invShoes: "ПОЙАФЗОЛ", invAccessories: "ЛАВОЗИМОТ", invBackpacks: "ҶУЗВДОНҲО", invActiveChar: "ПЕРСОНАЖИ ФАЪОЛ"',
  'ja': ', invCharacter: "キャラクター", invAvatar: "アバター", invFrame: "フレーム", invBg: "背景", invUnlocked: "ロック解除:", invSkins: "スキン", invTopWear: "トップス", invPants: "パンツ", invShoes: "靴", invAccessories: "アクセサリー", invBackpacks: "バックパック", invActiveChar: "アクティブなキャラクター"',
  'ko': ', invCharacter: "캐릭터", invAvatar: "아바타", invFrame: "프레임", invBg: "배경", invUnlocked: "잠금 해제:", invSkins: "스킨", invTopWear: "상의", invPants: "바지", invShoes: "신발", invAccessories: "액세서리", invBackpacks: "배낭", invActiveChar: "활성 캐릭터"'
}

for lang, extra in translations.items():
    # regex to find the end of the dictionary for a specific language
    # Example line: "  en: { title: "Math Master", ... }, " or "  en: { title: "Math Master", ... } "
    pattern = r'^(\s*'+lang+r':\s*\{.*?)(\}\s*,?\s*)$'
    content = re.sub(pattern, r'\1' + extra + r' \2', content, flags=re.MULTILINE)

# Also replace the inline translations in JSX
content = content.replace("language === 'uz' ? 'INVENTAR' : 'INVENTORY'", "t.navInventory")
content = content.replace("language === 'uz' ? 'STATISTIKA' : 'STATISTICS'", "t.stats")
content = content.replace("language === 'uz' ? 'AKTIV PERSONAJ' : 'ACTIVE CHARACTER'", "t.invActiveChar")

content = content.replace("language === 'uz' ? 'PERSONAJ' : 'CHARACTER'", "t.invCharacter")
content = content.replace("language === 'uz' ? 'AVATAR' : 'AVATAR'", "t.invAvatar")
content = content.replace("language === 'uz' ? 'RAMKA' : 'FRAME'", "t.invFrame")
content = content.replace("language === 'uz' ? 'FON' : 'BG'", "t.invBg")

content = content.replace("language === 'uz' ? 'PERSONAJLAR' : 'CHARACTERS'", "t.characters")
content = content.replace("language === 'uz' ? 'Ochilgan: 3 / 8' : 'Unlocked: 3 / 8'", "`${t.invUnlocked} 3 / 8`")

content = content.replace("language === 'uz' ? 'SKINLAR' : 'SKINS'", "t.invSkins")

content = content.replace("language === 'uz' ? 'USTKI KIYIM' : 'TOP WEAR'", "t.invTopWear")
content = content.replace("language === 'uz' ? 'SHIM' : 'PANTS'", "t.invPants")
content = content.replace("language === 'uz' ? 'OYOQ KIYIM' : 'SHOES'", "t.invShoes")
content = content.replace("language === 'uz' ? 'AKSESSUARLAR' : 'ACCESSORIES'", "t.invAccessories")
content = content.replace("language === 'uz' ? 'RYUKZAKLAR' : 'BACKPACKS'", "t.invBackpacks")

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print("Patch applied successfully.")
