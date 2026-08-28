import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { MentalMathGenerator } from './mathGenerator';

/**
 * Generates a structured 30-column (3 blocks x 10 columns) or 60-column PDF worksheet
 * based on selected operation type ('oddiy', 'f5', 'f10', 'aralash').
 */
export async function generateMathWorksheetPDF(opType = 'oddiy') {
  // Generate 30 columns of math problems with 7 rows of terms each (matching sample images)
  const columnsCount = 30;
  const termsPerRow = 7;
  const columns = [];

  for (let col = 1; col <= columnsCount; col++) {
    const generated = MentalMathGenerator.generate(opType, 1, termsPerRow);
    // Parse terms array from generated display (e.g. "4 + 6 - 3 - 5 + 6 - 8 - 6")
    let terms = [];
    if (generated && generated.display) {
      const parts = generated.display.split(' ');
      terms.push(parts[0]); // First positive term
      for (let i = 1; i < parts.length; i += 2) {
        const sign = parts[i];
        const val = parts[i + 1];
        terms.push(sign === '-' ? `-${val}` : `${val}`);
      }
    } else {
      // Fallback
      terms = ['4', '6', '-3', '-5', '6', '-8', '-6'];
    }

    columns.push({
      id: col,
      terms: terms.slice(0, termsPerRow)
    });
  }

  // Group columns into 3 blocks of 10 columns (Block 1: 1-10, Block 2: 11-20, Block 3: 21-30)
  const block1 = columns.slice(0, 10);
  const block2 = columns.slice(10, 20);
  const block3 = columns.slice(20, 30);

  const getOpTitle = (type) => {
    switch (type) {
      case 'f5': return "Formula 5 (Kichik Do'st) Topshiriqlari";
      case 'f10': return "Formula 10 (Katta Do'st) Topshiriqlari";
      case 'aralash': return "Aralash (Formula 5 + Formula 10) Topshiriqlari";
      default: return "Oddiy Hisob Topshiriqlari";
    }
  };

  const renderBlockTable = (blockCols) => {
    let headerRow = '<tr>' + blockCols.map(c => `<th style="border: 2.5px solid #000; padding: 6px; font-size: 16px; font-weight: 900; text-align: center; background-color: #F8FAFC;">${c.id}</th>`).join('') + '</tr>';
    
    let bodyRows = '';
    for (let r = 0; r < termsPerRow; r++) {
      bodyRows += '<tr>' + blockCols.map(c => `<td style="border: 1px solid #000; padding: 5px 2px; font-size: 15px; font-weight: 700; text-align: center; font-family: monospace;">${c.terms[r] || ''}</td>`).join('') + '</tr>';
    }

    // 2 Empty answer rows matching sample image structure
    let answerRow1 = '<tr>' + blockCols.map(() => `<td style="border: 2px solid #000; height: 32px; background-color: #FFF;"></td>`).join('') + '</tr>';
    let answerRow2 = '<tr>' + blockCols.map(() => `<td style="border: 2.5px solid #000; height: 32px; background-color: #FFF;"></td>`).join('') + '</tr>';

    return `
      <table style="width: 100%; border-collapse: collapse; margin-bottom: 22px;">
        <thead>${headerRow}</thead>
        <tbody>
          ${bodyRows}
          ${answerRow1}
          ${answerRow2}
        </tbody>
      </table>
    `;
  };

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          @page { size: A4 portrait; margin: 15mm 12mm 15mm 12mm; }
          body { font-family: 'Helvetica Neue', Arial, sans-serif; color: #000; margin: 0; padding: 0; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #6D28D9; padding-bottom: 10px; margin-bottom: 18px; }
          .logo-text { font-size: 26px; font-weight: 900; color: #6D28D9; letter-spacing: 1px; }
          .sub-logo { font-size: 12px; color: #10B981; font-weight: 700; }
          .title { font-size: 16px; font-weight: 800; color: #1E1035; text-transform: uppercase; }
          .info-row { font-size: 12px; font-weight: 600; color: #4B5563; margin-bottom: 14px; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <span class="logo-text">IQRO<span style="color: #10B981;">MAX</span></span>
            <div class="sub-logo">MENTAL ARIFMETIKA AKADEMIYASI</div>
          </div>
          <div style="text-align: right;">
            <div class="title">${getOpTitle(opType)}</div>
            <div style="font-size: 11px; color: #6B7280; margin-top: 3px;">Sana: ${new Date().toLocaleDateString('uz-UZ')}</div>
          </div>
        </div>

        <div class="info-row">
          <span>O'quvchi ismi: __________________________</span>
          <span>Vaqt: _______ soniya</span>
          <span>To'g'ri javoblar: ____ / 30</span>
        </div>

        ${renderBlockTable(block1)}
        ${renderBlockTable(block2)}
        ${renderBlockTable(block3)}

        <div style="position: absolute; bottom: 5mm; left: 0; right: 0; text-align: center; font-size: 10px; color: #9CA3AF; border-top: 1px solid #E5E7EB; padding-top: 6px;">
          IQROMAX Platformasi tomonidan avtomatik generatsiya qilindi | www.iqromax.uz
        </div>
      </body>
    </html>
  `;

  try {
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    return uri;
  } catch (error) {
    console.error('PDF Generation Error:', error);
    throw error;
  }
}

export async function sharePDFFile(fileUri) {
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri, {
      mimeType: 'application/pdf',
      dialogTitle: 'IQROMAX PDF Topshiriq Jadvallarini Ulashish',
      UTI: 'com.adobe.pdf'
    });
  } else {
    alert("Qurilmangizda fayllarni ulashish imkoniyati mavjud emas");
  }
}
