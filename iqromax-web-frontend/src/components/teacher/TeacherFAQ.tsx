import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

/** O'qituvchilar uchun ko'p beriladigan savollar. */
export const TeacherFAQ = () => {
  const faqs = [
    {
      q: "Qanday qilib o'qituvchi bo'lib ro'yxatdan o'taman?",
      a: 'Ro\'yxatdan o\'tish bosqichida "O\'qituvchi" rolini tanlang, profilingizni to\'ldiring va birinchi guruhingizni oching. Tasdiqlangach, darslar berishni boshlashingiz mumkin.',
    },
    {
      q: "Daromad qanday hisoblanadi va to'lov qachon amalga oshiriladi?",
      a: "Har bir guruhdan tushgan daromaddan platforma komissiyasi (10-15%) ushlanib qolinadi. Qoldiq summa har oyning 1-sanasida sizning balansingizga o'tkaziladi va istalgan vaqtda yechib olishingiz mumkin.",
    },
    {
      q: "Bir nechta guruh ochishim mumkinmi?",
      a: 'Ha, cheksiz guruh va kurslar yarata olasiz. Premium tarif sizga avtomatik xabarnomalar, AI tahlili va ko\'proq o\'quvchi hisobini boshqarish imkoniyatini beradi.',
    },
    {
      q: "Ota-onalar bilan qanday bog'lanaman?",
      a: 'Har bir o\'quvchining ota-onasi avtomatik kuzatuv huquqiga ega. Siz "Xabarlar" bo\'limidan to\'g\'ridan-to\'g\'ri xabar yuborishingiz mumkin.',
    },
    {
      q: 'Dars materiallarini IQROMAX taqdim etadimi?',
      a: 'Ha, asosiy mavzular bo\'yicha tayyor materiallar, taqdimotlar va testlar mavjud. Shuningdek, o\'z materiallaringizni ham yuklashingiz mumkin.',
    },
  ];

  return (
    <section>
      <div className="text-center mb-8">
        <h2 className="font-display font-black text-2xl sm:text-3xl md:text-4xl mb-2">
          Ko'p beriladigan <span className="text-emerald-600">savollar</span>
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto">
          O'qituvchilar tomonidan eng ko'p so'raladigan savollarga javoblar.
        </p>
      </div>

      <div className="max-w-3xl mx-auto rounded-2xl bg-card border border-border/40 p-2 sm:p-4 shadow-sm">
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`teacher-faq-${i}`} className="border-b border-border/40 last:border-b-0">
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
