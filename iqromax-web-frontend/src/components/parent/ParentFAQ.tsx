import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/**
 * Ko'p beriladigan savollar — accordion.
 */
export const ParentFAQ = () => {
  const faqs = [
    {
      q: "Farzandim hozirda IQROMAX'dan qanday foydalanadi?",
      a: 'Farzandingiz o\'z hisobiga kirib, kurslarni o\'rganadi, mashqlar bajaradi va o\'yinli darslar orqali bilim oladi. Siz esa shu paneldan natijalarni kuzatasiz.',
    },
    {
      q: "Ma'lumotlar xavfsizligi qanday ta'minlangan?",
      a: 'Barcha ma\'lumotlar shifrlangan kanal orqali uzatiladi va xavfsiz serverlarda saqlanadi. Sizning va farzandingizning ma\'lumotlari uchinchi shaxslarga uzatilmaydi.',
    },
    {
      q: "Ota-ona sifatida nimalarni boshqarishim mumkin?",
      a: 'Siz farzandingiz uchun kunlik maqsadlarni belgilashingiz, dars vaqtlarini cheklashingiz, hisobotlar olishingiz va trener bilan bog\'lanishingiz mumkin.',
    },
    {
      q: 'Agar bir nechta farzandim bo\'lsa, ularni qanday qo\'shaman?',
      a: 'Sozlamalar bo\'limidan "Farzand qo\'shish" tugmasini bosib, har bir farzand uchun alohida profil yaratish mumkin.',
    },
    {
      q: "Kursni tugatgandan so'ng sertifikat olish mumkinmi?",
      a: 'Ha, har bir tugallangan kurs uchun farzandingiz raqamli sertifikatga ega bo\'ladi va uni profilidan yuklab olishi mumkin.',
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Ko'p beriladigan <span className="text-orange-500">savollar</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          Eng ko'p so'raladigan savollarga javob topdik.
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-2xl bg-card border border-border/40 p-2 sm:p-4 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`faq-${i}`} className="border-b border-border/40 last:border-b-0">
              <AccordionTrigger className="text-left text-sm sm:text-base font-semibold hover:no-underline px-3 sm:px-4">
                {f.q}
              </AccordionTrigger>
              <AccordionContent className="text-xs sm:text-sm text-muted-foreground leading-relaxed px-3 sm:px-4 pb-4">
                {f.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
};
