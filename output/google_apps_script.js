/**
 * L-TEX Candidate Questionnaire — Google Apps Script
 *
 * This script receives candidate data from the HTML form,
 * saves it to a Google Sheet, and sends a Telegram notification.
 *
 * SETUP:
 * 1. Create a Google Sheet
 * 2. Open Extensions > Apps Script
 * 3. Paste this entire code
 * 4. Set BOT_TOKEN and CHAT_ID below
 * 5. Deploy as Web App (Execute as: Me, Access: Anyone)
 * 6. Copy the Web App URL to the HTML form CONFIG.GOOGLE_SCRIPT_URL
 *
 * See SETUP_INSTRUCTIONS.md for detailed steps.
 */

// ═══ CONFIGURATION ═══
const BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';  // From @BotFather
const CHAT_ID  = 'YOUR_TELEGRAM_CHAT_ID';     // Your chat/group ID
const SEND_TELEGRAM = true;                     // Set false to disable

// ═══ MAIN HANDLER ═══
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // Save to Google Sheet
    const row = saveToSheet(data);

    // Send Telegram notification
    if (SEND_TELEGRAM && BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
      sendTelegramNotification(data, row);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'ok', row: row }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ═══ SAVE TO GOOGLE SHEET ═══
function saveToSheet(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName('Кандидати');

  // Create sheet with headers if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet('Кандидати');
    const headers = [
      'Дата',
      'ПІБ', 'Вік', 'Місто', 'Телефон', 'Telegram', 'Email',
      'Стаж', 'Досвід продажів', 'Опис досвіду', 'Секонд-хенд', '1С',
      'Остання посада', 'Причина пошуку',
      'Освіта', 'Навч. заклад', 'Рік закінчення', 'Курси', 'Мови',
      'Інструменти', 'Водійські права', 'Авто', 'Відрядження', 'Офіс',
      'Ситуація 1', 'Ситуація 2', 'Ситуація 3',
      'Зарплата (грн)', 'Важливе в роботі', 'Джерело', 'Готовність',
      'Чому L-TEX',
      'Авто-рейтинг', 'Рівень', 'Ручний рейтинг', 'Нотатки HR'
    ];
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setBackground('#1a2b4a');
    headerRange.setFontColor('#ffffff');
    headerRange.setFontWeight('bold');
    headerRange.setFontSize(10);
    sheet.setFrozenRows(1);

    // Set column widths
    sheet.setColumnWidth(1, 140);   // Date
    sheet.setColumnWidth(2, 200);   // Name
    for (let i = 3; i <= headers.length; i++) {
      sheet.setColumnWidth(i, 130);
    }
  }

  const p = data.step1_personal;
  const exp = data.step2_experience;
  const edu = data.step3_education;
  const sk = data.step4_skills;
  const sit = data.step5_situations;
  const mot = data.step6_motivation;

  const experienceLabels = { 'less1': 'До 1 року', '1-3': '1-3 роки', '3-5': '3-5 років', '5+': '5+ років' };
  const yesNoLabels = { 'yes': 'Так', 'no': 'Ні', 'partly': 'Частково', 'depends': 'Залежно' };

  const row = [
    new Date(),
    p.fullName, p.age, p.city, p.phone, p.telegram, p.email,
    experienceLabels[exp.totalExperience] || exp.totalExperience,
    yesNoLabels[exp.salesExperience] || '',
    exp.salesDescription,
    yesNoLabels[exp.secondhandExperience] || '',
    yesNoLabels[exp.experience1C] || '',
    exp.lastJob,
    exp.reasonForSearch,
    edu.level,
    edu.institution,
    edu.year,
    edu.courses,
    (edu.languages || []).join(', '),
    (sk.tools || []).join(', '),
    yesNoLabels[sk.driverLicense] || '',
    yesNoLabels[sk.ownCar] || '',
    yesNoLabels[sk.travelReady] || '',
    yesNoLabels[sk.officeReady] || '',
    sit.situation1,
    sit.situation2,
    sit.situation3,
    mot.desiredSalary,
    (mot.importantInWork || []).join(', '),
    mot.vacancySource,
    mot.startDate,
    mot.whyLtex,
    data.autoScore || 0,
    data.scoreLabel || '',
    '',  // Manual rating — empty for HR
    ''   // Notes — empty for HR
  ];

  const newRow = sheet.getLastRow() + 1;
  sheet.getRange(newRow, 1, 1, row.length).setValues([row]);

  // Conditional formatting for score column
  const scoreCell = sheet.getRange(newRow, row.length - 3); // Auto-score column
  const score = data.autoScore || 0;
  if (score >= 50) {
    scoreCell.setBackground('#eafaf1');
    scoreCell.setFontColor('#1e8449');
  } else if (score >= 30) {
    scoreCell.setBackground('#fef9e7');
    scoreCell.setFontColor('#b7950b');
  } else {
    scoreCell.setBackground('#fdedec');
    scoreCell.setFontColor('#c0392b');
  }
  scoreCell.setFontWeight('bold');

  // Format date cell
  sheet.getRange(newRow, 1).setNumberFormat('dd.MM.yyyy HH:mm');

  return newRow;
}

// ═══ TELEGRAM NOTIFICATION ═══
function sendTelegramNotification(data, rowNumber) {
  const p = data.step1_personal;
  const exp = data.step2_experience;
  const edu = data.step3_education;
  const sk = data.step4_skills;
  const score = data.autoScore || 0;
  const scoreLabel = data.scoreLabel || '—';

  const expLabels = { 'less1': '<1', '1-3': '1-3', '3-5': '3-5', '5+': '5+' };
  const yn = { 'yes': '✅', 'no': '❌', 'partly': '🔶', 'depends': '🔶' };

  // Score emoji
  let scoreEmoji = '🔴';
  if (score >= 50) scoreEmoji = '🟢';
  else if (score >= 30) scoreEmoji = '🟡';

  const message = [
    '📋 *Нова анкета кандидата*',
    '',
    `👤 *${p.fullName}*`,
    `📍 ${p.city} | ${p.age} р.`,
    `📞 ${p.phone}`,
    `💬 ${p.telegram}`,
    '',
    `${scoreEmoji} *Рейтинг: ${score}/78 (${scoreLabel})*`,
    '',
    '📊 *Ключові показники:*',
    `• Стаж: ${expLabels[exp.totalExperience] || '—'} р.`,
    `• Продажі: ${yn[exp.salesExperience] || '—'}`,
    `• Секонд-хенд: ${yn[exp.secondhandExperience] || '—'}`,
    `• 1С: ${yn[exp.experience1C] || '—'}`,
    `• Освіта: ${edu.level || '—'}`,
    `• Права: ${yn[sk.driverLicense] || '—'} | Авто: ${yn[sk.ownCar] || '—'}`,
    `• Офіс: ${yn[sk.officeReady] || '—'}`,
    '',
    `💰 Зарплата: ${data.step6_motivation.desiredSalary} грн`,
    `🗓 Готовність: ${data.step6_motivation.startDate}`,
    `📣 Джерело: ${data.step6_motivation.vacancySource}`,
    '',
    `📄 Рядок #${rowNumber} в Google Sheets`
  ].join('\n');

  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const options = {
    method: 'post',
    contentType: 'application/json',
    payload: JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown'
    })
  };

  try {
    UrlFetchApp.fetch(url, options);
  } catch (err) {
    Logger.log('Telegram error: ' + err.toString());
  }
}

// ═══ TEST FUNCTION ═══
// Run this to test the sheet setup without real data
function testSetup() {
  const testData = {
    step1_personal: { fullName: 'Тест Тестович', age: '25', city: 'Луцьк', phone: '+380671234567', telegram: '@test', email: 'test@test.com' },
    step2_experience: { totalExperience: '1-3', salesExperience: 'yes', salesDescription: 'Тестовий досвід', secondhandExperience: 'no', experience1C: 'partly', lastJob: 'Тестова посада', reasonForSearch: 'Тест' },
    step3_education: { level: 'Вища', institution: 'ЛНТУ', year: '2020', courses: 'Тестовий курс', languages: ['Українська', 'Англійська'] },
    step4_skills: { tools: ['Excel', '1С'], driverLicense: 'yes', ownCar: 'yes', travelReady: 'yes', officeReady: 'yes' },
    step5_situations: { situation1: 'Тестова відповідь 1', situation2: 'Тестова відповідь 2', situation3: 'Тестова відповідь 3' },
    step6_motivation: { desiredSalary: '25000', importantInWork: ['Стабільна ставка'], vacancySource: 'Telegram', startDate: 'Одразу', whyLtex: 'Тест' },
    autoScore: 55,
    scoreLabel: 'Високий',
    timestamp: new Date().toISOString()
  };

  const row = saveToSheet(testData);
  Logger.log('Test row added: ' + row);

  if (SEND_TELEGRAM && BOT_TOKEN !== 'YOUR_TELEGRAM_BOT_TOKEN') {
    sendTelegramNotification(testData, row);
    Logger.log('Telegram notification sent');
  }
}
