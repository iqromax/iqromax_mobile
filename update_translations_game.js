const fs = require('fs');

let fileContent = fs.readFileSync('screens/OddiyHisobGameScreen.js', 'utf8');

const additions = {
  uz: ', gameTitle: "ODDIY HISOB", tipTitle: "Maslahat", tipDesc: "Keyingi savolda yordam beradi"',
  en: ', gameTitle: "SIMPLE MATH", tipTitle: "Tip", tipDesc: "Helps in the next question"',
  ru: ', gameTitle: "ПРОСТОЙ СЧЕТ", tipTitle: "Подсказка", tipDesc: "Поможет в следующем вопросе"',
  ar: ', gameTitle: "حساب بسيط", tipTitle: "تلميح", tipDesc: "يساعد في السؤال التالي"',
  tr: ', gameTitle: "BASİT HESAP", tipTitle: "İpucu", tipDesc: "Sonraki soruda yardımcı olur"',
  zh: ', gameTitle: "简单算术", tipTitle: "提示", tipDesc: "在下一个问题中会有帮助"',
  ky: ', gameTitle: "ЖӨНӨКӨЙ ЭСЕП", tipTitle: "Кеңеш", tipDesc: "Кийинки суроодо жардам берет"',
  kk: ', gameTitle: "ҚАРАПАЙЫМ ЕСЕП", tipTitle: "Кеңес", tipDesc: "Келесі сұрақта көмектеседі"',
  tg: ', gameTitle: "ҲИСОБИ ОДДӢ", tipTitle: "Маслиҳат", tipDesc: "Дар саволи навбатӣ кӯмак мекунад"',
  ja: ', gameTitle: "簡単な計算", tipTitle: "ヒント", tipDesc: "次の問題で役立ちます"',
  ko: ', gameTitle: "간단한 계산", tipTitle: "팁", tipDesc: "다음 질문에 도움이 됩니다"'
};

for (const lang of Object.keys(additions)) {
  const regex = new RegExp(`(${lang}: \\{.*?)(\\s*\\})`, 'g');
  fileContent = fileContent.replace(regex, (match, p1, p2) => {
    if (p1.includes('averageTime')) {
      return `${p1}${additions[lang]}${p2}`;
    }
    return match;
  });
}

// Replace in UI
fileContent = fileContent.replace(/<Text style=\{styles\.titleText\}>ODDIY HISOB<\/Text>/g, '<Text style={styles.titleText}>{t.gameTitle}</Text>');
fileContent = fileContent.replace(/<Text style=\{styles\.tipTitle\}>Maslahat<\/Text>/g, '<Text style={styles.tipTitle}>{t.tipTitle}</Text>');
fileContent = fileContent.replace(/<Text style=\{styles\.tipDesc\}>Keyingi savolda yordam beradi<\/Text>/g, '<Text style={styles.tipDesc}>{t.tipDesc}</Text>');

fs.writeFileSync('screens/OddiyHisobGameScreen.js', fileContent);
