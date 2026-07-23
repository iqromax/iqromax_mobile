export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  category: string;
  image: string;
  author: string;
  readTime: string;
  tags: string[];
}

export const blogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Mental arifmetika: Bolalar uchun qanday foydasi bor?",
    excerpt: "Mental arifmetika nafaqat tez hisoblash, balki mantiqiy fikrlashni rivojlantirish uchun ham muhim.",
    content: `
      Mental arifmetika - bu bolaning miya faoliyatini har tomonlama rivojlantirishga qaratilgan noyob metodika. 
      Ko'pchilik buni faqat tez hisoblash deb o'ylaydi, ammo uning foydasi ancha kengroq.
      
      Birinchidan, mental arifmetika bolada diqqatni jamlash qobiliyatini oshiradi. Tasavvurdagi abakus bilan ishlash uchun bola butun diqqatini bitta vazifaga qaratishi kerak.
      
      Ikkinchidan, bu xotirani kuchaytiradi. Sonlarni va ularning abakusdagi ko'rinishini yodda saqlash vizual va eshitish xotirasini rivojlantiradi.
      
      Uchinchidan, o'ng va chap yarim sharlarning birgalikda ishlashi. Abakus bilan ishlashda ikkala qo'lning barmoqlari ishlatiladi, bu esa miya yarim sharlari o'rtasidagi bog'liqlikni kuchaytiradi.
    `,
    date: "12 May, 2026",
    category: "Ta'lim",
    image: "https://images.unsplash.com/photo-1543269664-76bc3997d9ea?q=80&w=2070&auto=format&fit=crop",
    author: "Ali Valiyev",
    readTime: "5 min",
    tags: ["Mental Arifmetika", "Bolalar Ta'limi", "Mantiq"]
  },
  {
    id: 2,
    title: "Soroban metodikasi sirlari",
    excerpt: "Yaponiyaning qadimiy hisoblash usuli bugungi kunda dunyo bo'ylab mashhur bo'lishining sabablari.",
    content: `
      Soroban - bu yaponcha abakus bo'lib, u asrlar davomida takomillashib kelgan. Bugungi kunda u mental arifmetika ta'limining asosi hisoblanadi. Metodikaning siri shundaki, u mavhum sonlarni aniq vizual tasvirlarga aylantiradi.
      
      Bola sonlarni shunchaki raqam sifatida emas, balki abakusdagi toshlar holati sifatida ko'radi. Bu jarayon bolaga murakkab matematik amallarni sekundlar ichida bajarish imkonini beradi. Soroban bilan shug'ullanadigan bolalar odatda maktabda boshqa fanlarni ham tezroq o'zlashtira boshlaydilar, chunki ularning tahliliy fikrlash qobiliyati yuqori bo'ladi.
      
      Shuningdek, Soroban mashqlari bolada sabr-toqat va o'ziga bo'lgan ishonchni shakllantiradi. Har bir to'g'ri yechilgan misol kichik bir g'alaba bo'lib, bolani yanada murakkabroq vazifalarni bajarishga ruhlantiradi.
    `,
    date: "10 May, 2026",
    category: "Metodika",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2132&auto=format&fit=crop",
    author: "Malika Orifova",
    readTime: "4 min",
    tags: ["Soroban", "Yaponiya", "Matematika"]
  },
  {
    id: 3,
    title: "Onlayn ta'limda motivatsiyani saqlash",
    excerpt: "Masofaviy ta'limda bolaning diqqatini qanday qilib bir joyda jamlash mumkin?",
    content: `
      Hozirgi kunda onlayn ta'lim hayotimizning ajralmas qismiga aylandi. Biroq, ko'plab ota-onalar bolaning kompyuter qarshisida zerikib qolishidan xavotirda bo'lishadi.
      
      Motivatsiyani saqlashning eng yaxshi yo'li - bu gamifikatsiya (o'yinlashtirish). Bizning platformamiz aynan shu tamoyilga asoslangan. Bola misol yechayotganda o'zini o'yin o'ynayotgandek his qilishi kerak.
      
      Shuningdek, kunlik tartib juda muhim. Onlayn darslarni ham xuddi maktab darslaridek bir vaqtda va maxsus tayyorlangan joyda o'tash bolada mas'uliyat hissini uyg'otadi. Ota-onalarning rag'batlantirishi esa bolaga qo'shimcha kuch beradi.
    `,
    date: "08 May, 2026",
    category: "Psixologiya",
    image: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=2070&auto=format&fit=crop",
    author: "Jasur Bekov",
    readTime: "6 min",
    tags: ["Onlayn Ta'lim", "Motivatsiya", "Ota-onalar"]
  },
  {
    id: 4,
    title: "Mantiqiy fikrlashni qanday rivojlantirish mumkin?",
    excerpt: "Bolalarda mantiqiy fikrlashni shakllantirish bo'yicha eng samarali uslublar to'plami.",
    content: `
      Mantiqiy fikrlash - bu bolaning hayoti davomida kerak bo'ladigan eng muhim ko'nikmalardan biridir. Uni rivojlantirish uchun faqat matematika emas, balki turli mantiqiy jumboqlar va o'yinlar yordam beradi.
      
      Shaxmat va shashka kabi o'yinlar bolani bir necha qadam oldinni o'ylashga o'rgatadi. Shuningdek, kundalik hayotdagi oddiy savollar ham bolani tahlil qilishga majbur qilishi mumkin. Masalan, "Nima uchun yomg'ir yog'adi?" yoki "Mashina qanday yuradi?" kabi savollarga javob topish orqali bola sabab-oqibat bog'liqligini tushunib boradi.
    `,
    date: "05 May, 2026",
    category: "Rivojlanish",
    image: "https://images.unsplash.com/photo-1516627145497-ae6968895b74?q=80&w=2040&auto=format&fit=crop",
    author: "Zebo Ahmedova",
    readTime: "5 min",
    tags: ["Rivojlanish", "Mantiq", "O'yinlar"]
  },
  {
    id: 5,
    title: "Xotirani kuchaytirish mashqlari",
    excerpt: "Har kuni bajariladigan 10 daqiqalik mashqlar yordamida vizual xotirani 2 baravar oshiring.",
    content: `
      Vizual xotira bolada o'qish va yozish jarayonini ancha osonlashtiradi. Uni rivojlantirishning eng oddiy usuli - bu "Eslab qol va chiz" mashqidir. Bolaga 30 soniya davomida bir nechta rasm ko'rsatiladi va keyin ularni eslab qolganicha chizishi so'raladi.
      
      Yana bir usul - bu "Zanjir" usuli. Bunda bola bir-biriga bog'liq bo'lmagan so'zlarni hikoya orqali bog'lab yodda saqlashi kerak. Bu nafaqat xotirani, balki tasavvur qilish qobiliyatini ham ajoyib tarzda oshiradi.
    `,
    date: "02 May, 2026",
    category: "Mashqlar",
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?q=80&w=2068&auto=format&fit=crop",
    author: "Otabek G'ulomov",
    readTime: "4 min",
    tags: ["Xotira", "Mashqlar", "Vizualizatsiya"]
  },
  {
    id: 6,
    title: "Bolalar uchun IT va matematika bog'liqligi",
    excerpt: "Nima uchun dasturlashni o'rganishdan oldin matematikani yaxshi bilish kerak?",
    content: `
      Dasturlash - bu aslida amaliy matematika demakdir. Har bir algoritm va har bir funksiya ortida matematik mantiq yotadi. Bolalar uchun scratch yoki python kabi tillarni o'rganishda matematik tushunchalar juda qo'l keladi.
      
      Koordinatalar tizimi, o'zgaruvchilar va shartli amallar - bularning barchasi matematikadan kelib chiqqan. Shuning uchun mental arifmetika bilan shug'ullanadigan bolalar IT sohasida ham boshqalarga qaraganda ancha muvaffaqiyatli bo'lishadi. Chunki ularning miyasi algoritmlarni tezroq va aniqroq qabul qiladi.
    `,
    date: "28 April, 2026",
    category: "Texnologiya",
    image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?q=80&w=2031&auto=format&fit=crop",
    author: "Sardor Ikromov",
    readTime: "7 min",
    tags: ["IT", "Matematika", "Kelajak"]
  }
];
