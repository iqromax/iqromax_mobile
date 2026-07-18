const fs = require('fs');

let fileContent = fs.readFileSync('screens/StudentDashboardScreen.js', 'utf8');

const additions = {
  uz: ', digitsTitle: "SON XONASI", digitsSubtitle: "Qatnashadigan sonlar xonasini tanlang", digitsLabel: "xonali"',
  en: ', digitsTitle: "DIGITS", digitsSubtitle: "Select the number of digits to participate", digitsLabel: "digits"',
  ru: ', digitsTitle: "ЗНАЧНОСТЬ", digitsSubtitle: "Выберите количество знаков", digitsLabel: "-значный"',
  ar: ', digitsTitle: "عدد الأرقام", digitsSubtitle: "حدد عدد الأرقام للمشاركة", digitsLabel: "أرقام"',
  tr: ', digitsTitle: "BASAMAKLAR", digitsSubtitle: "Katılacak basamak sayısını seçin", digitsLabel: "basamaklı"',
  zh: ', digitsTitle: "位数", digitsSubtitle: "选择参与的位数", digitsLabel: "位数"',
  ky: ', digitsTitle: "ОРУН САНДАР", digitsSubtitle: "Катыша турган орун сандарды тандаңыз", digitsLabel: "орундуу"',
  kk: ', digitsTitle: "ОРЫН САНДАР", digitsSubtitle: "Қатысатын орын сандарды таңдаңыз", digitsLabel: "орынды"',
  tg: ', digitsTitle: "РАҚАМҲО", digitsSubtitle: "Миқдори рақамҳоро интихоб кунед", digitsLabel: "рақама"',
  ja: ', digitsTitle: "桁数", digitsSubtitle: "参加する桁数を選択してください", digitsLabel: "桁"',
  ko: ', digitsTitle: "자릿수", digitsSubtitle: "참여할 자릿수를 선택하세요", digitsLabel: "자리"'
};

for (const lang of Object.keys(additions)) {
  const regex = new RegExp(`(${lang}: \\{.*?)(\\s*\\})`, 'g');
  fileContent = fileContent.replace(regex, (match, p1, p2) => {
    if (p1.includes('invActiveChar')) {
      return `${p1}${additions[lang]}${p2}`;
    }
    return match;
  });
}

// Also replace UI texts
fileContent = fileContent.replace(/<Text style=\{styles\.examplesTitle\}>SON XONASI<\/Text>/g, '<Text style={styles.examplesTitle}>{ext.digitsTitle}</Text>');
fileContent = fileContent.replace(/<Text style=\{styles\.examplesSubtitle\}>Qatnashadigan sonlar xonasini tanlang<\/Text>/g, '<Text style={styles.examplesSubtitle}>{ext.digitsSubtitle}</Text>');
fileContent = fileContent.replace(/\{selectedDigits\} xonali \(\{selectedDigits === 1 \? '1-9' : selectedDigits === 2 \? '10-99' : selectedDigits === 3 \? '100-999' : '1000-9999'\}\)/g, "{selectedDigits} {ext.digitsLabel} ({selectedDigits === 1 ? '1-9' : selectedDigits === 2 ? '10-99' : selectedDigits === 3 ? '100-999' : '1000-9999'})");
fileContent = fileContent.replace(/const label = `\$\{d\} xonali \(\$\{d === 1 \? '1-9' : d === 2 \? '10-99' : d === 3 \? '100-999' : '1000-9999'\}\)`;/g, "const label = `${d} ${ext.digitsLabel} (${d === 1 ? '1-9' : d === 2 ? '10-99' : d === 3 ? '100-999' : '1000-9999'})`;");

fs.writeFileSync('screens/StudentDashboardScreen.js', fileContent);
