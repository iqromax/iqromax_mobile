import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import adVideoRoutes from './adVideoRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env') });

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  path: '/api/socket.io',
  cors: { origin: '*' }
});
app.set('io', io);

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

import missionRoutes from './missionRoutes.js';
import shopRoutes from './shopRoutes.js';
import inventorySkinRoutes from './inventorySkinRoutes.js';

// Mount the ad video routes
app.use('/api', adVideoRoutes);
app.use('/api', missionRoutes);
app.use('/api', shopRoutes);
app.use('/api', inventorySkinRoutes);

// Serve the uploads directory for files and shop images
app.use('/uploads', express.static(path.join(__dirname, '../../public/uploads')));
app.use('/api/uploads', express.static(path.join(__dirname, '../../public/uploads')));

// Nodemailer Config
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Helper: Generate OTP
const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const EMAIL_TRANSLATIONS: Record<string, any> = {
  en: { subject: 'IQROMAX - Verify your email address', hello: 'Hello', defaultName: 'Student', body: 'Thank you for registering at IQROMAX! Please use the verification code below to confirm your email address. This code will expire in exactly <strong>1 minute</strong>.', ignore: 'If you did not request this code, please ignore this email.' },
  ru: { subject: 'IQROMAX - Подтвердите ваш email', hello: 'Здравствуйте', defaultName: 'Студент', body: 'Спасибо за регистрацию в IQROMAX! Пожалуйста, используйте код подтверждения ниже, чтобы подтвердить свой адрес электронной почты. Этот код истекает ровно через <strong>1 минуту</strong>.', ignore: 'Если вы не запрашивали этот код, проигнорируйте это письмо.' },
  uz: { subject: 'IQROMAX - Emailingizni tasdiqlang', hello: 'Salom', defaultName: 'O\'quvchi', body: 'IQROMAX da ro\'yxatdan o\'tganingiz uchun tashakkur! Email manzilingizni tasdiqlash uchun quyidagi tasdiqlash kodidan foydalaning. Ushbu kod aynan <strong>1 daqiqadan</strong> so\'ng o\'z kuchini yo\'qotadi.', ignore: 'Agar siz ushbu kodni so\'ramagan bo\'lsangiz, iltimos, ushbu xatni e\'tiborsiz qoldiring.' },
  ar: { subject: 'IQROMAX - تأكيد بريدك الإلكتروني', hello: 'مرحباً', defaultName: 'طالب', body: 'شكرًا لتسجيلك في IQROMAX! يرجى استخدام رمز التحقق أدناه لتأكيد عنوان بريدك الإلكتروني. ستنتهي صلاحية هذا الرمز بعد <strong>دقيقة واحدة</strong> بالضبط.', ignore: 'إذا لم تطلب هذا الرمز، يرجى تجاهل هذا البريد الإلكتروني.' },
  tr: { subject: 'IQROMAX - E-postanızı doğrulayın', hello: 'Merhaba', defaultName: 'Öğrenci', body: 'IQROMAX\'a kayıt olduğunuz için teşekkürler! E-posta adresinizi doğrulamak için lütfen aşağıdaki doğrulama kodunu kullanın. Bu kodun süresi tam olarak <strong>1 dakika</strong> içinde dolacaktır.', ignore: 'Bu kodu siz istemediyseniz, lütfen bu e-postayı dikkate almayın.' },
  zh: { subject: 'IQROMAX - 验证您的电子邮件', hello: '你好', defaultName: '学生', body: '感谢您在IQROMAX注册！请使用下面的验证码确认您的电子邮件地址。此验证码将在<strong>1分钟</strong>后过期。', ignore: '如果您没有请求此代码，请忽略此电子邮件。' },
  ky: { subject: 'IQROMAX - Электрондук почтаңызды ырастаңыз', hello: 'Салам', defaultName: 'Студент', body: 'IQROMAX сайтына катталганыңыз үчүн рахмат! Электрондук почтаңызды ырастоо үчүн төмөндөгү ырастоо кодун колдонуңуз. Бул код так <strong>1 мүнөттөн</strong> кийин жараксыз болот.', ignore: 'Эгер бул кодду сурабасаңыз, бул катты этибарга албаңыз.' },
  kk: { subject: 'IQROMAX - Электрондық поштаңызды растаңыз', hello: 'Сәлеметсіз бе', defaultName: 'Студент', body: 'IQROMAX сайтына тіркелгеніңіз үшін рақмет! Электрондық поштаңызды растау үшін төмендегі растау кодын пайдаланыңыз. Бұл код дәл <strong>1 минуттан</strong> кейін жарамсыз болады.', ignore: 'Егер бұл кодты сұрамасаңыз, бұл хатты елемеңіз.' },
  tg: { subject: 'IQROMAX - Почтаи электронии худро тасдиқ кунед', hello: 'Салом', defaultName: 'Донишҷӯ', body: 'Ташаккур барои сабти ном дар IQROMAX! Лутфан рамзи тасдиқи зеринро барои тасдиқи суроғаи почтаи электронии худ истифода баред. Ин рамз пас аз <strong>1 дақиқа</strong> беэътибор мешавад.', ignore: 'Агар шумо ин рамзро дархост накарда бошед, лутфан ин номаро нодида гиред.' },
  ja: { subject: 'IQROMAX - メールアドレスの確認', hello: 'こんにちは', defaultName: '学生', body: 'IQROMAXにご登録いただきありがとうございます！メールアドレスを確認するには、以下の確認コードを使用してください。このコードは正確に<strong>1分</strong>で有効期限が切れます。', ignore: 'このコードをリクエストしていない場合は、このメールを無視してください。' },
  ko: { subject: 'IQROMAX - 이메일 주소 확인', hello: '안녕하세요', defaultName: '학생', body: 'IQROMAX에 가입해 주셔서 감사합니다! 이메일 주소를 확인하려면 아래 인증 코드를 사용하세요. 이 코드는 정확히 <strong>1분</strong> 후에 만료됩니다.', ignore: '이 코드를 요청하지 않았다면 이 이메일을 무시하세요.' }
};

const FORGOT_PASS_TRANSLATIONS: Record<string, any> = {
  en: { subject: 'IQROMAX - Password Reset Code', hello: 'Hello', defaultName: 'User', body: 'We received a request to reset your password. Please use the verification code below to reset it. This code will expire in exactly <strong>1 minute</strong>.', ignore: 'If you did not request a password reset, please ignore this email.' },
  ru: { subject: 'IQROMAX - Код сброса пароля', hello: 'Здравствуйте', defaultName: 'Студент', body: 'Мы получили запрос на сброс вашего пароля. Пожалуйста, используйте код подтверждения ниже, чтобы сбросить его. Этот код истекает ровно через <strong>1 минуту</strong>.', ignore: 'Если вы не запрашивали сброс пароля, проигнорируйте это письмо.' },
  uz: { subject: 'IQROMAX - Parolni tiklash kodi', hello: 'Salom', defaultName: 'O\'quvchi', body: 'Biz parolingizni tiklash bo\'yicha so\'rov oldik. Uni tiklash uchun quyidagi tasdiqlash kodidan foydalaning. Ushbu kod aynan <strong>1 daqiqadan</strong> so\'ng o\'z kuchini yo\'qotadi.', ignore: 'Agar siz parolni tiklashni so\'ramagan bo\'lsangiz, iltimos, ushbu xatni e\'tiborsiz qoldiring.' },
  ar: { subject: 'IQROMAX - رمز إعادة تعيين كلمة المرور', hello: 'مرحباً', defaultName: 'طالب', body: 'لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك. يرجى استخدام رمز التحقق أدناه لإعادة تعيينها. ستنتهي صلاحية هذا الرمز بعد <strong>دقيقة واحدة</strong> بالضبط.', ignore: 'إذا لم تطلب إعادة تعيين كلمة المرور، يرجى تجاهل هذا البريد الإلكتروني.' },
  tr: { subject: 'IQROMAX - Şifre Sıfırlama Kodu', hello: 'Merhaba', defaultName: 'Öğrenci', body: 'Şifrenizi sıfırlama isteği aldık. Sıfırlamak için lütfen aşağıdaki doğrulama kodunu kullanın. Bu kodun süresi tam olarak <strong>1 dakika</strong> içinde dolacaktır.', ignore: 'Şifre sıfırlama isteğinde bulunmadıysanız, lütfen bu e-postayı dikkate almayın.' },
  zh: { subject: 'IQROMAX - 密码重置代码', hello: '你好', defaultName: '学生', body: '我们收到了重置您的密码的请求。请使用下面的验证码进行重置。此验证码将在<strong>1分钟</strong>后过期。', ignore: '如果您没有请求重置密码，请忽略此电子邮件。' },
  ky: { subject: 'IQROMAX - Сырсөздү калыбына келтирүү коду', hello: 'Салам', defaultName: 'Студент', body: 'Биз сиздин сырсөздү калыбына келтирүү өтүнүчүн алдык. Аны калыбына келтирүү үчүн төмөндөгү ырастоо кодун колдонуңуз. Бул код так <strong>1 мүнөттөн</strong> кийин жараксыз болот.', ignore: 'Эгер сырсөздү калыбына келтирүүнү сурабасаңыз, бул катты этибарга албаңыз.' },
  kk: { subject: 'IQROMAX - Құпия сөзді қалпына келтіру коды', hello: 'Сәлеметсіз бе', defaultName: 'Студент', body: 'Біз сіздің құпия сөзіңізді қалпына келтіру сұрауын алдық. Оны қалпына келтіру үшін төмендегі растау кодын пайдаланыңыз. Бұл код дәл <strong>1 минуттан</strong> кейін жарамсыз болады.', ignore: 'Егер құпия сөзді қалпына келтіруді сұрамасаңыз, бұл хатты елемеңіз.' },
  tg: { subject: 'IQROMAX - Рамзи барқароркунии парол', hello: 'Салом', defaultName: 'Донишҷӯ', body: 'Мо дархостро барои барқарор кардани пароли шумо гирифтем. Лутфан рамзи тасдиқи зеринро барои барқарор кардани он истифода баред. Ин рамз пас аз <strong>1 дақиқа</strong> беэътибор мешавад.', ignore: 'Агар шумо барқароркунии паролро дархост накарда бошед, лутфан ин номаро нодида гиред.' },
  ja: { subject: 'IQROMAX - パスワードリセットコード', hello: 'こんにちは', defaultName: '学生', body: 'パスワードのリセットリクエストを受け取りました。リセットするには以下の確認コードを使用してください。このコードは正確に<strong>1分</strong>で有効期限が切れます。', ignore: 'パスワードのリセットをリクエストしていない場合は、このメールを無視してください。' },
  ko: { subject: 'IQROMAX - 비밀번호 재설정 코드', hello: '안녕하세요', defaultName: '학생', body: '비밀번호 재설정 요청을 받았습니다. 재설정하려면 아래 인증 코드를 사용하세요. 이 코드는 정확히 <strong>1분</strong> 후에 만료됩니다.', ignore: '비밀번호 재설정을 요청하지 않았다면 이 이메일을 무시하세요.' }
};

// 1. Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  console.log('--- SEND OTP REQUEST ---');
  console.log('Body:', req.body);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  try {
    const { email, name, language = 'en' } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    // Check if user is already registered with this email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Bu email dan oldin ro\'yxatdan o\'tilgan' });
    }

    const code = generateOTP();
    // Expiry: 1 minute from now
    const expiresAt = new Date(Date.now() + 60 * 1000);

    // Save or update OTP
    await prisma.otp.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    const t = EMAIL_TRANSLATIONS[language] || EMAIL_TRANSLATIONS['en'];

    // Send Email
    const mailOptions = {
      from: `"IQROMAX Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #070712; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1A1A2F;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">
              IQRO<span style="color: #A855F7;">MAX</span>
            </h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">${t.hello} ${name || t.defaultName},</h2>
          
          <p style="color: #C7D2FE; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>
          
          <div style="text-align: center; background-color: #121223; padding: 20px; border-radius: 12px; border: 1px solid #2D1B69; margin-bottom: 30px;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #A855F7;">${code}</span>
          </div>
          
          <p style="color: #818CF8; font-size: 14px; text-align: center; margin-top: 40px;">
            ${t.ignore}
          </p>
        </div>
      `,
    };

    console.log('Sending email to:', email);
    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent successfully:', info.messageId);
    } catch (mailErr) {
      console.error('Nodemailer sendMail failed, but OTP code generated:', code, mailErr);
    }

    res.json({ message: 'OTP sent successfully', code });
  } catch (error) {
    console.error('Email send error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// 2. Verify OTP
app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const record = await prisma.otp.findUnique({ where: { email } });
    if (!record) return res.status(400).json({ error: 'OTP not found for this email' });

    if (record.code !== otp) {
      return res.status(400).json({ error: 'Invalid verification code' });
    }

    if (new Date() > record.expiresAt) {
      return res.status(400).json({ error: 'Verification code has expired. Please request a new one.' });
    }

    // Success
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Forgot password OTP
app.post('/api/auth/forgot-password-otp', async (req, res) => {
  try {
    const { email, language = 'en' } = req.body;
    
    // Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Return localized error message if possible, or simple error
      const tLogin = LOGIN_TRANSLATIONS[language] || LOGIN_TRANSLATIONS['en'];
      return res.status(400).json({ error: tLogin.userNotFound });
    }

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 60 * 1000);

    await prisma.otp.upsert({
      where: { email },
      update: { code, expiresAt },
      create: { email, code, expiresAt },
    });

    const t = FORGOT_PASS_TRANSLATIONS[language] || FORGOT_PASS_TRANSLATIONS['en'];

    const mailOptions = {
      from: `"IQROMAX Security" <${process.env.SMTP_USER}>`,
      to: email,
      subject: t.subject,
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #070712; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1A1A2F;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">
              IQRO<span style="color: #A855F7;">MAX</span>
            </h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">${t.hello} ${user.name || t.defaultName},</h2>
          
          <p style="color: #C7D2FE; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            ${t.body}
          </p>
          
          <div style="text-align: center; background-color: #121223; padding: 20px; border-radius: 12px; border: 1px solid #2D1B69; margin-bottom: 30px;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #A855F7;">${code}</span>
          </div>
          
          <p style="color: #818CF8; font-size: 14px; text-align: center; margin-top: 40px;">
            ${t.ignore}
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    res.json({ message: 'OTP sent successfully' });
  } catch (error) {
    console.error('Forgot password OTP error:', error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

// Reset password
app.post('/api/auth/reset-password', async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const cleanEmail = String(email).trim().toLowerCase();
    
    // Case insensitive search
    const user = await prisma.user.findFirst({
      where: {
        email: { equals: cleanEmail, mode: 'insensitive' }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User with this email not found' });
    }

    const hashedPassword = await bcrypt.hash(newPassword.trim(), 10);
    
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    });

    console.log(`Password reset successfully for user email: ${cleanEmail}`);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Helper: Generate Custom ID (6-character random alphanumeric ID from specified set)
// Character set: A B C D E F G H J K L M N P Q R T U V W X Y Z 2 3 4 5 6 7 8 9
const generateCustomId = async () => {
  const chars = 'ABCDEFGHJKLMNPQRTVWXYZ23456789';
  const letters = 'ABCDEFGHJKLMNPQRTVWXYZ';
  const digits = '23456789';

  while (true) {
    let result = '';
    // Ensure mixture of letters and numbers (e.g. 4 letters, 2 digits or mixed)
    // Create 6 character array
    const idArr: string[] = [];
    
    // Pick 4 letters
    for (let i = 0; i < 4; i++) {
      idArr.push(letters.charAt(Math.floor(Math.random() * letters.length)));
    }
    // Pick 2 digits
    for (let i = 0; i < 2; i++) {
      idArr.push(digits.charAt(Math.floor(Math.random() * digits.length)));
    }
    
    // Shuffle the 6 characters randomly
    for (let i = idArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [idArr[i], idArr[j]] = [idArr[j], idArr[i]];
    }
    
    result = idArr.join('');
    const customId = `#${result}`;
    const exists = await prisma.user.findUnique({ where: { customId } });
    if (!exists) {
      return customId;
    }
  }
};

// 3. Final Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role, name, phone, email, password, country, language, character, referralCode } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) return res.status(400).json({ error: 'User already exists with this email' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const customId = await generateCustomId();

    const user = await prisma.user.create({
      data: {
        customId,
        role: role || 'Student',
        name,
        phone,
        email,
        password: hashedPassword,
        country,
        language,
        character,
        status: 'Faol',
      },
    });

    // Referral logic
    if (referralCode) {
      try {
        const cleanRefCode = referralCode.replace(/^#+/, '');
        const referrer = await prisma.user.findFirst({
          where: {
            OR: [
              { customId: referralCode.toUpperCase() },
              { customId: `#${cleanRefCode}` },
              { customId: cleanRefCode }
            ]
          }
        });
        if (referrer) {
          // @ts-ignore
          await prisma.referral.create({
            data: {
              referrerId: referrer.id,
              referredId: user.id,
              status: 'WAITING'
            }
          });
        }
      } catch (err) {
        console.error('Referral creation error:', err);
      }
    }

    res.status(201).json({ message: 'User created successfully', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

const LOGIN_TRANSLATIONS: Record<string, any> = {
  en: { userNotFound: 'User not found. Check your phone number.', wrongPass: 'Incorrect password', inactive: 'Account is not active. Contact admin.', serverErr: 'Internal server error' },
  ru: { userNotFound: 'Пользователь не найден. Проверьте номер телефона.', wrongPass: 'Неверный пароль', inactive: 'Аккаунт не активен. Обратитесь к админу.', serverErr: 'Внутренняя ошибка сервера' },
  uz: { userNotFound: 'Foydalanuvchi topilmadi. Telefon raqamini tekshiring.', wrongPass: 'Parol noto\'g\'ri', inactive: 'Akkauntingiz faol emas. Adminga murojaat qiling.', serverErr: 'Ichki server xatosi' },
  ar: { userNotFound: 'المستخدم غير موجود. تحقق من رقم الهاتف.', wrongPass: 'كلمة المرور غير صحيحة', inactive: 'الحساب غير نشط. اتصل بالمسؤول.', serverErr: 'خطأ داخلي في الخادم' },
  tr: { userNotFound: 'Kullanıcı bulunamadı. Telefon numaranızı kontrol edin.', wrongPass: 'Yanlış şifre', inactive: 'Hesap aktif değil. Yönetici ile iletişime geçin.', serverErr: 'Dahili sunucu hatası' },
  zh: { userNotFound: '未找到用户。请检查您的电话号码。', wrongPass: '密码错误', inactive: '帐户未激活。请联系管理员。', serverErr: '内部服务器错误' },
  ky: { userNotFound: 'Колдонуучу табылган жок. Телефон номериңизди текшериңиз.', wrongPass: 'Сырсөз туура эмес', inactive: 'Аккаунт активдүү эмес. Админге кайрылыңыз.', serverErr: 'Ички сервер катасы' },
  kk: { userNotFound: 'Пайдаланушы табылмады. Телефон нөміріңізді тексеріңіз.', wrongPass: 'Құпия сөз қате', inactive: 'Аккаунт белсенді емес. Әкімшіге хабарласыңыз.', serverErr: 'Ішкі сервер қатесі' },
  tg: { userNotFound: 'Корбар ёфт нашуд. Рақами телефони худро тафтиш кунед.', wrongPass: 'Рамз нодуруст аст', inactive: 'Ҳисоб фаъол нест. Бо админ тамос гиред.', serverErr: 'Хатои дохилии сервер' },
  ja: { userNotFound: 'ユーザーが見つかりません。電話番号を確認してください。', wrongPass: 'パスワードが間違っています', inactive: 'アカウントはアクティブではありません。管理者にお問い合わせください。', serverErr: '内部サーバーエラー' },
  ko: { userNotFound: '사용자를 찾을 수 없습니다. 전화번호를 확인하세요.', wrongPass: '잘못된 비밀번호', inactive: '계정이 비활성 상태입니다. 관리자에게 문의하세요.', serverErr: '내부 서버 오류' }
};

// User login
// Teacher application request
app.post('/api/teacher/request', async (req, res) => {
  try {
    const { name, phone, email, password } = req.body;
    if (!name || !phone || !email || !password) {
      return res.status(400).json({ error: 'Iltimos, barcha maydonlarni to\'ldiring' });
    }

    // Check existing email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Ushbu email bilan ro\'yxatdan o\'tilgan' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    // @ts-ignore
    const teacherReq = await prisma.teacherRequest.create({
      data: {
        name,
        phone,
        email,
        password: hashedPassword,
        status: 'PENDING'
      }
    });

    res.status(201).json({ message: 'So\'rovingiz yuborildi', request: teacherReq });
  } catch (error) {
    console.error('Teacher request error:', error);
    res.status(500).json({ error: 'Server xatosi yuz berdi' });
  }
});

// Admin: Get all teacher requests and teachers
app.get('/api/teacher/requests', async (req, res) => {
  try {
    // @ts-ignore
    const requests = await prisma.teacherRequest.findMany({
      orderBy: { createdAt: 'desc' }
    });
    const teachers = await prisma.user.findMany({
      where: { role: { equals: 'teacher', mode: 'insensitive' } },
      orderBy: { createdAt: 'desc' }
    });
    res.json({ requests, teachers });
  } catch (error) {
    console.error('Fetch teacher requests error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Admin: Approve teacher request
app.post('/api/teacher/approve', async (req, res) => {
  try {
    const { id } = req.body;
    // @ts-ignore
    const reqItem = await prisma.teacherRequest.findUnique({ where: { id } });
    if (!reqItem) return res.status(404).json({ error: 'So\'rov topilmadi' });

    // Generate random 8-char password
    const generatedPass = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(generatedPass, 10);
    const customId = await generateCustomId();

    // Create teacher user
    const teacherUser = await prisma.user.create({
      data: {
        customId,
        role: 'teacher',
        name: reqItem.name,
        phone: reqItem.phone,
        email: reqItem.email,
        password: hashedPassword,
        status: 'Faol'
      }
    });

    // Update request status
    // @ts-ignore
    await prisma.teacherRequest.update({
      where: { id },
      data: { status: 'APPROVED' }
    });

    // Send localized email to teacher with login credentials
    const mailOptions = {
      from: `"IQROMAX Admin" <${process.env.SMTP_USER}>`,
      to: reqItem.email,
      subject: 'IQROMAX - O\'qituvchilik so\'rovingiz tasdiqlandi!',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070712; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1A1A2F;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">
              IQRO<span style="color: #A855F7;">MAX</span>
            </h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 16px;">Tabriklaymiz, ${reqItem.name}!</h2>
          <p style="color: #C7D2FE; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Sizning IQROMAX platformasida o'qituvchilik qilish bo'yicha yuborgan so'rovingiz admin tomonidan muvaffaqiyatli tasdiqlandi!
          </p>
          
          <div style="background-color: #121223; padding: 24px; border-radius: 14px; border: 1px solid #A855F7; margin-bottom: 30px;">
            <p style="color: #9CA3AF; font-size: 14px; margin-bottom: 10px;">Tizimga kirish ma'lumotlaringiz:</p>
            <p style="color: #FFFFFF; font-size: 16px; margin: 6px 0;"><strong>Username (Ismingiz):</strong> <span style="color: #A855F7;">${reqItem.name}</span></p>
            <p style="color: #FFFFFF; font-size: 16px; margin: 6px 0;"><strong>Parol (Password):</strong> <span style="color: #10B981; font-weight: bold;">${generatedPass}</span></p>
          </div>
          
          <p style="color: #818CF8; font-size: 14px; text-align: center;">
            Ushbu ma'lumotlar orqali mobil ilovaning O'qituvchi bo'limida tizimga kirishingiz mumkin.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'O\'qituvchi muvaffaqiyatli tasdiqlandi va emailga parol yuborildi', user: teacherUser });
  } catch (error) {
    console.error('Approve teacher error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

// Admin: Reject teacher request
app.post('/api/teacher/reject', async (req, res) => {
  try {
    const { id, reason } = req.body;
    // @ts-ignore
    const reqItem = await prisma.teacherRequest.findUnique({ where: { id } });
    if (!reqItem) return res.status(404).json({ error: 'So\'rov topilmadi' });

    // @ts-ignore
    await prisma.teacherRequest.update({
      where: { id },
      data: { status: 'REJECTED' }
    });

    const rejectionReasonText = reason && reason.trim() ? reason.trim() : 'Taqdim etilgan ma\'lumotlar talablarimizga mos kelmadi.';

    const mailOptions = {
      from: `"IQROMAX Admin" <${process.env.SMTP_USER}>`,
      to: reqItem.email,
      subject: 'IQROMAX - O\'qituvchilik so\'rovingiz bo\'yicha habar',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070712; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1A1A2F;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">
              IQRO<span style="color: #EF4444;">MAX</span>
            </h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 16px;">Xayrli kun, ${reqItem.name}!</h2>
          <p style="color: #C7D2FE; font-size: 16px; line-height: 1.6; margin-bottom: 24px;">
            Afsuski, IQROMAX platformasida o'qituvchilik qilish bo'yicha yuborgan so'rovingiz admin tomonidan rad etildi.
          </p>
          
          <div style="background-color: #121223; padding: 24px; border-radius: 14px; border: 1px solid #EF4444; margin-bottom: 30px;">
            <p style="color: #9CA3AF; font-size: 14px; margin-bottom: 8px;"><strong>Rad etilish sababi:</strong></p>
            <p style="color: #F87171; font-size: 15px; line-height: 1.5; margin: 0;">${rejectionReasonText}</p>
          </div>
          
          <p style="color: #818CF8; font-size: 14px; text-align: center;">
            Qo'shimcha savollaringiz bo'lsa, qo'llab-quvvatlash xizmati bilan bog mezoningiz mumkin.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'So\'rov rad etildi va emailga habar yuborildi' });
  } catch (error) {
    console.error('Reject teacher error:', error);
    res.status(500).json({ error: 'Server xatosi' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, username, password, language = 'en' } = req.body;
    const t = LOGIN_TRANSLATIONS[language] || LOGIN_TRANSLATIONS['en'];

    const identifier = (phone || username || '').trim();
    if (!identifier) return res.status(400).json({ error: t.userNotFound });

    // Normalize phone numbers (e.g. +998901234567 vs 998901234567)
    const cleanPhone = identifier.replace(/[^\d+]/g, '');
    const phoneWithoutPlus = cleanPhone.replace(/^\+/, '');
    const phoneWithPlus = '+' + phoneWithoutPlus;

    // Search by phone (with or without +), email, customId, or name (case-insensitive username)
    const cleanIdentifier = identifier.trim();
    const cleanIdWithoutHash = cleanIdentifier.replace(/^#+/, '');

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phone: identifier },
          { phone: phoneWithPlus },
          { phone: phoneWithoutPlus },
          { email: { equals: cleanIdentifier, mode: 'insensitive' } },
          { name: { equals: cleanIdentifier, mode: 'insensitive' } },
          { customId: { equals: cleanIdentifier.toUpperCase(), mode: 'insensitive' } },
          { customId: { equals: `#${cleanIdWithoutHash.toUpperCase()}`, mode: 'insensitive' } }
        ]
      }
    });

    if (!user) return res.status(400).json({ error: t.userNotFound });

    const validPassword = await bcrypt.compare(String(password || '').trim(), user.password);
    if (!validPassword) return res.status(400).json({ error: t.wrongPass });

    if (user.status !== 'Faol') return res.status(403).json({ error: t.inactive });

    // Update user's language to the one they selected during login
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { language }
    });

    res.json({ message: 'Login successful', user: updatedUser });
  } catch (error) {
    console.error('Login error:', error);
    const lang = req.body?.language || 'en';
    const tError = LOGIN_TRANSLATIONS[lang] || LOGIN_TRANSLATIONS['en'];
    res.status(500).json({ error: tError.serverErr });
  }
});


// Get referrals
app.get('/api/referrals/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const cleanId = customId.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: customId.toUpperCase() },
          { customId: `#${cleanId}` },
          { customId: cleanId }
        ]
      }
    });
    
    if (!user) return res.status(404).json({ error: 'User not found' });
    
    // @ts-ignore
    const referrals = await prisma.referral.findMany({
      where: { referrerId: user.id },
      orderBy: { createdAt: 'desc' }
    });
    
    const results = await Promise.all(referrals.map(async (ref: any) => {
      const referredUser = await prisma.user.findUnique({ where: { id: ref.referredId } });
      return {
        id: ref.id,
        name: referredUser ? referredUser.name : 'Noma\'lum',
        status: ref.status,
        reward: ref.status === 'ACTIVE' ? '+1⚡' : '-'
      };
    }));
    
    res.json(results);
  } catch (error) {
    console.error('Referrals fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Add XP to user
app.post('/api/user/xp', async (req, res) => {
  try {
    const { customId, xpToAdd } = req.body;
    if (!customId || xpToAdd == null) return res.status(400).json({ error: 'customId and xpToAdd are required' });

    const cleanId = customId.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: customId.toUpperCase() },
          { customId: `#${cleanId}` },
          { customId: cleanId }
        ]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { xp: { increment: xpToAdd } }
    });

    io.emit('user_xp_updated', { customId: updatedUser.customId, xp: updatedUser.xp });

    res.json({ message: 'XP added successfully', xp: updatedUser.xp });
  } catch (error) {
    console.error('Update XP error:', error);
    res.status(500).json({ error: 'Failed to update XP' });
  }
});

// Add Coin to user
app.post('/api/user/coin', async (req, res) => {
  try {
    const { customId, coinToAdd } = req.body;
    if (!customId || coinToAdd == null) return res.status(400).json({ error: 'customId and coinToAdd are required' });

    const cleanId = customId.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: customId.toUpperCase() },
          { customId: `#${cleanId}` },
          { customId: cleanId }
        ]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { coin: { increment: coinToAdd } }
    });

    io.emit('user_coin_updated', { customId: updatedUser.customId, coin: updatedUser.coin });

    res.json({ message: 'Coin added successfully', coin: updatedUser.coin });
  } catch (error) {
    console.error('Update Coin error:', error);
    res.status(500).json({ error: 'Failed to update Coin' });
  }
});

// Update user character
app.put('/api/user/character', async (req, res) => {
  try {
    const { customId, character } = req.body;
    if (!customId || !character) return res.status(400).json({ error: 'customId and character are required' });

    const cleanId = customId.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: customId.toUpperCase() },
          { customId: `#${cleanId}` },
          { customId: cleanId }
        ]
      }
    });

    if (!user) return res.status(404).json({ error: 'User not found' });

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { character }
    });

    io.emit('user_updated', updatedUser);

    res.json({ message: 'Character updated successfully', character: updatedUser.character });
  } catch (error) {
    console.error('Update character error:', error);
    res.status(500).json({ error: 'Failed to update character' });
  }
});

// 4. Admin API: Get Users

app.get('/api/ranking', async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      where: { 
        OR: [
          { role: { contains: 'student', mode: 'insensitive' } },
          { role: { contains: 'Student', mode: 'insensitive' } }
        ],
        status: 'Faol'
      },
      orderBy: {
        xp: 'desc'
      }
    });
    
    const rankingData = users.map((u, index) => ({
      id: u.customId,
      name: u.name,
      xp: u.xp || 0,
      coin: u.coin || 0,
      avatar: u.character || null,
    }));
    
    res.json(rankingData);
  } catch (error) {
    console.error('Error fetching ranking:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/users/search/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const searchId = customId.startsWith('#') ? customId.toUpperCase() : '#' + customId.toUpperCase();
    
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: searchId },
          { customId: customId.toUpperCase() }
        ]
      }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      uuid: user.id,
      id: user.customId,
      name: user.name,
      status: user.status,
      level: 1, // Assuming no level column in DB yet
      rating: 1000, // Default rating
      xp: user.xp || 0,
      energy: user.energy || 0,
      avatar: user.character || 'https://api.dicebear.com/7.x/avataaars/png?seed=' + user.name
    });
  } catch (error) {
    console.error('Error searching user:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/admin/users', async (req, res) => {
  try {
    const { role } = req.query;
    
    let filter: any = {};
    if (role) {
      const roleStr = String(role).toLowerCase();
      if (roleStr === 'student') {
        filter = {
          OR: [
            { role: { equals: 'student', mode: 'insensitive' } },
            { role: { contains: 'Student', mode: 'insensitive' } }
          ]
        };
      } else {
        filter = {
          role: { contains: String(role), mode: 'insensitive' }
        };
      }
    }

    const users = await prisma.user.findMany({ 
      where: filter,
      orderBy: { createdAt: 'desc' } 
    });
    
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Update a user
app.put('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, phone, email, status } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { name, phone, email, status }
    });
    // Emit real-time event
    io.emit('user_updated', user);
    res.json(user);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// Delete a user
app.delete('/api/admin/users/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await prisma.user.findUnique({ where: { id } });
    
    if (userToDelete) {
      // If deleting a teacher or user, also cleanup matching teacher requests by email or phone
      if (userToDelete.email || userToDelete.phone) {
        // @ts-ignore
        await prisma.teacherRequest.deleteMany({
          where: {
            OR: [
              ...(userToDelete.email ? [{ email: userToDelete.email }] : []),
              ...(userToDelete.phone ? [{ phone: userToDelete.phone }] : [])
            ]
          }
        });
      }

      await prisma.user.delete({
        where: { id }
      });
      
      // Emit real-time event to connected clients
      io.emit('user_deleted', { id: userToDelete.id, customId: userToDelete.customId });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Sync delete from Supabase Admin Panel
app.delete('/api/admin/users/sync-delete/:identifier', async (req, res) => {
  try {
    const { identifier } = req.params;
    const cleanId = identifier.replace(/^#+/, '');
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { name: { equals: identifier, mode: 'insensitive' } },
          { customId: { equals: identifier, mode: 'insensitive' } },
          { customId: { equals: `#${cleanId}`, mode: 'insensitive' } },
          { customId: { equals: cleanId, mode: 'insensitive' } },
          { id: identifier },
          { email: { equals: identifier, mode: 'insensitive' } },
          { phone: identifier }
        ]
      }
    });
    
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
      console.log(`[Sync Delete] User deleted and event emitted for: ${user.name} (${user.customId})`);
      io.emit('user_deleted', { id: user.id, customId: user.customId });
      res.json({ message: 'User synced and deleted successfully' });
    } else {
      console.warn(`[Sync Delete] User not found in local database for identifier: ${identifier}`);
      res.status(404).json({ error: 'User not found in local database' });
    }
  } catch (error) {
    console.error('Sync delete error:', error);
    res.status(500).json({ error: 'Failed to sync delete user' });
  }
});

// Check user existence/status API
app.get('/api/user/status/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return res.status(444).json({ exists: false, deleted: true });
    }
    res.json({ exists: true, status: user.status });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- MYSTERY BOX ADMIN & APP API ---
app.get('/api/mystery-box', async (req, res) => {
  try {
    // @ts-ignore
    const items = await prisma.mysteryBoxItem.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' }
    });
    res.json(items);
  } catch (error) {
    console.error('Fetch mystery box items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/admin/mystery-box', async (req, res) => {
  try {
    const { name, description, type, value } = req.body;
    if (!name || !description) {
      return res.status(400).json({ error: 'Nomi va tavsifi kiritilishi shart!' });
    }

    const itemValue = parseInt(value, 10) || 1;
    const derivedBadge = type === 'energy' ? `⚡ ${itemValue} Energiya` : `👑 ${itemValue} kun Premium`;

    // @ts-ignore
    const newItem = await prisma.mysteryBoxItem.create({
      data: {
        name: name.trim(),
        description: description.trim(),
        badge: derivedBadge,
        type: type || 'premium',
        value: itemValue,
        isActive: true
      }
    });

    res.status(201).json({ message: 'Sirli sovg\'a muvaffaqiyatli yaratildi', item: newItem });
  } catch (error) {
    console.error('Create mystery box item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.put('/api/admin/mystery-box/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, type, value } = req.body;

    const itemValue = parseInt(value, 10) || 1;
    const derivedBadge = type === 'energy' ? `⚡ ${itemValue} Energiya` : `👑 ${itemValue} kun Premium`;

    // @ts-ignore
    const updatedItem = await prisma.mysteryBoxItem.update({
      where: { id },
      data: {
        name: name.trim(),
        description: description.trim(),
        badge: derivedBadge,
        type: type || 'premium',
        value: itemValue
      }
    });

    res.json({ message: 'Sirli sovg\'a muvaffaqiyatli yangilandi', item: updatedItem });
  } catch (error) {
    console.error('Update mystery box item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/admin/mystery-box/:id', async (req, res) => {
  try {
    const { id } = req.params;
    // @ts-ignore
    await prisma.mysteryBoxItem.delete({ where: { id } });
    res.json({ message: 'Sirli sovg\'a o\'chirildi' });
  } catch (error) {
    console.error('Delete mystery box item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Claim Premium endpoint for app when user wins premium from Mystery Box
app.post('/api/user/claim-premium', async (req, res) => {
  try {
    const { userId, days } = req.body;
    if (!userId || !days) {
      return res.status(400).json({ error: 'userId va days kerak' });
    }

    // Find user in DB by ID or customId
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ id: userId }, { customId: userId }, { email: userId }]
      }
    });

    if (!existingUser) {
      return res.status(404).json({ error: 'User topilmadi' });
    }

    const currentExp = existingUser.premiumExpiresAt ? new Date(existingUser.premiumExpiresAt).getTime() : Date.now();
    const baseTime = currentExp > Date.now() ? currentExp : Date.now();
    const newExpDate = new Date(baseTime + (parseInt(days, 10) * 24 * 60 * 60 * 1000));

    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        premiumExpiresAt: newExpDate
      }
    });

    // Real-time broadcast to update Admin Panel instantly
    io.emit('new_premium_user_claimed', updatedUser);

    res.json({ message: 'Premium muvaffaqiyatli saqlandi', user: updatedUser });
  } catch (error) {
    console.error('Claim premium error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- ADMIN PREMIUM USERS MANAGEMENT API ---
app.get('/api/admin/premium-users', async (req, res) => {
  try {
    // Fetch users with active or past premium, or registered as Premium
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { premiumExpiresAt: { not: null } },
          { role: { contains: 'Premium' } }
        ]
      },
      orderBy: { updatedAt: 'desc' }
    });

    res.json(users);
  } catch (error) {
    console.error('Fetch premium users error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Revoke/Delete Premium Subscription for a user
app.post('/api/admin/revoke-premium', async (req, res) => {
  try {
    const { userId } = req.body;
    if (!userId) {
      return res.status(400).json({ error: 'User ID talab qilinadi' });
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        premiumExpiresAt: null,
        role: 'Student'
      }
    });

    // Broadcast socket event to instant sync with mobile app
    io.emit('premium_revoked', { userId: updatedUser.id, customId: updatedUser.customId });

    res.json({ message: 'Premium obuna muvaffaqiyatli bekor qilindi', user: updatedUser });
  } catch (error) {
    console.error('Revoke premium error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// --- PROMO CODE VALIDATION API ---
app.get('/api/promo/validate/:promoCode', async (req, res) => {
  try {
    const { promoCode } = req.params;
    if (!promoCode) {
      return res.status(400).json({ valid: false, error: 'Promokod kiritilmadi' });
    }

    const cleanPromo = promoCode.replace(/^#+/, '').trim().toUpperCase();
    const searchId = '#' + cleanPromo;

    const referrer = await prisma.user.findFirst({
      where: {
        OR: [
          { customId: searchId },
          { customId: cleanPromo }
        ]
      }
    });

    if (!referrer || referrer.status !== 'Faol') {
      return res.json({ valid: false, promo: cleanPromo, error: 'Promokod mavjud emas yoki foydalanuvchi o\'chirib yuborilgan' });
    }

    res.json({ valid: true, promo: cleanPromo, referrerName: referrer.name });
  } catch (error) {
    console.error('Validate promo error:', error);
    res.status(500).json({ valid: false, error: 'Server error' });
  }
});

// --- APP DOWNLOAD LINK SETTING API ---
app.get('/api/download-link', async (req, res) => {
  try {
    const setting = await prisma.appSetting.findUnique({
      where: { key: 'app_download_link' }
    });
    res.json({ link: setting?.value || 'https://iqromax.net' });
  } catch (error) {
    res.json({ link: 'https://iqromax.net' });
  }
});

app.post('/api/admin/download-link', async (req, res) => {
  try {
    const { link } = req.body;
    if (!link || !link.trim()) {
      return res.status(400).json({ error: 'Link manzili kiritilmadi' });
    }

    const updated = await prisma.appSetting.upsert({
      where: { key: 'app_download_link' },
      update: { value: link.trim() },
      create: { key: 'app_download_link', value: link.trim() }
    });

    res.json({ message: 'Download link muvaffaqiyatli saqlandi', link: updated.value });
  } catch (error) {
    console.error('Save download link error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Serve admin panel static files in production
app.use(express.static(path.join(__dirname, '../admin_panel/dist')));

// --- TEACHER DIRECT MESSAGE & NOTIFICATION API ---
app.post('/api/teacher/send-message', async (req, res) => {
  try {
    const { teacherName, studentId, studentName, studentEmail, message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Xabar matni kiritilmadi' });
    }

    const cleanMsg = message.trim();

    // Find student in DB by ID, customId, or name
    let studentUser = null;
    if (studentId || studentEmail || studentName) {
      studentUser = await prisma.user.findFirst({
        where: {
          OR: [
            ...(studentId ? [{ id: studentId }, { customId: studentId }, { customId: `#${studentId.replace(/^#+/, '')}` }] : []),
            ...(studentEmail ? [{ email: { equals: studentEmail, mode: 'insensitive' } }] : []),
            ...(studentName ? [{ name: { equals: studentName, mode: 'insensitive' } }] : [])
          ]
        }
      });
    }

    const targetEmail = studentUser?.email || studentEmail;
    const targetUserId = studentUser?.id || studentId || 'ALL';

    // 1. Create In-App Notification in DB
    const newNotif = await prisma.notification.create({
      data: {
        userId: studentUser?.customId || targetUserId,
        title: `💬 O'qituvchidan habar (${teacherName || "O'qituvchi"})`,
        message: cleanMsg,
        type: 'ADMIN',
        status: 'PENDING'
      }
    });

    // 2. Emit Real-time Socket Event
    io.emit('teacher_message_sent', {
      studentId: studentUser?.id,
      studentCustomId: studentUser?.customId,
      teacherName: teacherName || "O'qituvchi",
      title: `💬 O'qituvchidan habar`,
      message: cleanMsg,
      createdAt: newNotif.createdAt
    });

    // 3. Send Stylized Email if student has valid email
    if (targetEmail && targetEmail.includes('@')) {
      const mailOptions = {
        from: `"IQROMAX O'qituvchi Portal" <${process.env.SMTP_USER}>`,
        to: targetEmail,
        subject: `IQROMAX - O'qituvchingiz ${teacherName || ''} dan yangi xabar!`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #070712; color: #ffffff; padding: 40px; border-radius: 20px; border: 1.5px solid #A855F7;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">
                IQRO<span style="color: #A855F7;">MAX</span>
              </h1>
              <p style="color: #9CA3AF; font-size: 13px; margin-top: 4px;">O'qituvchilar va O'quvchilar Portali</p>
            </div>
            
            <h2 style="color: #ffffff; font-size: 22px; margin-bottom: 16px;">Salom, ${studentUser?.name || studentName || "O'quvchi"}! 👋</h2>
            <p style="color: #C7D2FE; font-size: 15px; line-height: 1.6; margin-bottom: 24px;">
              Sizning o'qituvchingiz <strong>${teacherName || "O'qituvchi"}</strong> sizga IQROMAX ilovasi orqali maxsus xabar yubordi:
            </p>
            
            <div style="background-color: #121228; padding: 24px; border-radius: 16px; border: 1px solid #A855F7; margin-bottom: 30px; shadow-color: #A855F7;">
              <div style="display: flex; align-items: center; margin-bottom: 12px;">
                <span style="font-size: 24px; margin-right: 10px;">💬</span>
                <strong style="color: #A855F7; font-size: 16px;">O'qituvchi Xabari:</strong>
              </div>
              <p style="color: #FFFFFF; font-size: 16px; line-height: 1.6; margin: 0; font-style: italic; white-space: pre-wrap;">"${cleanMsg}"</p>
            </div>
            
            <p style="color: #818CF8; font-size: 14px; text-align: center;">
              Ushbu xabarni IQROMAX mobil ilovangizdagi Bildirishnomalar bo'limida ham ko'rishingiz mumkin.
            </p>
          </div>
        `
      };

      try {
        await transporter.sendMail(mailOptions);
      } catch (mailErr) {
        console.error('Teacher email sending error:', mailErr);
      }
    }

    res.json({ message: 'Xabar o\'quvchiga va emailiga muvaffaqiyatli yuborildi!' });
  } catch (error) {
    console.error('Send teacher message error:', error);
    res.status(500).json({ error: 'Xabarni yuborishda xatolik yuz berdi' });
  }
});

// --- TEACHER INVITATION API ---
app.post('/api/teacher/send-invite', async (req, res) => {
  try {
    const { teacherId, teacherName, teacherCustomId, studentId, studentCustomId } = req.body;
    if (!studentId && !studentCustomId) {
      return res.status(400).json({ error: 'O\'quvchi IDsi ko\'rsatilmadi' });
    }

    // Find target student
    const studentUser = await prisma.user.findFirst({
      where: {
        OR: [
          ...(studentId ? [{ id: studentId }] : []),
          ...(studentCustomId ? [{ customId: studentCustomId }, { customId: `#${studentCustomId.replace(/^#+/, '')}` }] : [])
        ]
      }
    });

    if (!studentUser) {
      return res.status(404).json({ error: 'O\'quvchi topilmadi' });
    }

    const cleanStudentCustomId = studentUser.customId;

    // Check if pending invitation already sent
    const existingNotif = await prisma.notification.findFirst({
      where: {
        userId: cleanStudentCustomId,
        type: 'TEACHER_INVITE',
        status: 'PENDING'
      }
    });

    if (existingNotif) {
      return res.status(400).json({ error: 'Ushbu o\'quvchiga taklifnoma yuborilgan' });
    }

    // Create TEACHER_INVITE Notification
    const inviteData = {
      teacherId: teacherId || teacherCustomId,
      teacherName: teacherName || "O'qituvchi",
      teacherCustomId: teacherCustomId || teacherId
    };

    const newNotif = await prisma.notification.create({
      data: {
        userId: cleanStudentCustomId,
        senderId: teacherCustomId || teacherId,
        title: `👨‍🏫 O'qituvchingizni tasdiqlang!`,
        message: JSON.stringify(inviteData),
        type: 'TEACHER_INVITE',
        status: 'PENDING'
      }
    });

    // Real-time socket emit
    io.emit('teacher_invite_sent', {
      studentCustomId: cleanStudentCustomId,
      teacherName: teacherName || "O'qituvchi",
      notif: newNotif
    });

    res.json({ message: 'Taklifnoma muvaffaqiyatli yuborildi!', notif: newNotif });
  } catch (error) {
    console.error('Send teacher invite error:', error);
    res.status(500).json({ error: 'Taklifnoma yuborishda xatolik yuz berdi' });
  }
});

// --- BATTLE INVITE & NOTIFICATION REST API ---
app.get('/api/notifications/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const userNotifs = await prisma.notification.findMany({
      where: {
        userId: customId.toUpperCase(),
        status: 'PENDING'
      },
      orderBy: { createdAt: 'desc' }
    });
    
    const formatted = userNotifs.map(n => {
      let extra = {};
      if (n.type === 'BATTLE_INVITE' && n.message) {
        try { extra = JSON.parse(n.message); } catch (e) {}
      }
      return { ...n, ...extra };
    });
    res.json(formatted);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.get('/api/admin/notifications/history', async (req, res) => {
  try {
    const rawNotifications = await prisma.notification.findMany({
      where: { type: 'ADMIN' },
      orderBy: { createdAt: 'desc' }
    });

    const groupedMap = new Map();

    for (const notif of rawNotifications) {
      // Group by title, message, and minute of creation to ensure batches are grouped together
      const timeKey = new Date(notif.createdAt).toISOString().slice(0, 16); 
      const key = `${notif.title}_${notif.message}_${timeKey}`;
      
      if (!groupedMap.has(key)) {
        groupedMap.set(key, {
          id: notif.id,
          title: notif.title || 'Tizim Xabari',
          message: notif.message || '',
          createdAt: notif.createdAt,
          target: notif.userId,
          total: 0,
          readCount: 0
        });
      }
      
      const group = groupedMap.get(key);
      group.total += 1;
      if (notif.status === 'READ') {
        group.readCount += 1;
      }
      if (group.total > 1) {
        group.target = 'ALL';
      }
    }

    const history = Array.from(groupedMap.values());
    res.json(history);
  } catch (error) {
    console.error('History fetch error:', error);
    res.status(500).json({ error: 'Xatolik yuz berdi' });
  }
});

app.post('/api/notifications/admin-send', async (req, res) => {
  try {
    const { title, message, target } = req.body; // target: 'ALL' or specific customId
    if (!title || !message || !target) return res.status(400).json({ error: 'Missing fields' });

    if (target === 'ALL') {
      const allUsers = await prisma.user.findMany({ select: { customId: true } });
      const notifsToCreate = allUsers.map(u => ({
        userId: u.customId,
        type: 'ADMIN',
        title,
        message,
        status: 'PENDING'
      }));
      await prisma.notification.createMany({ data: notifsToCreate });
      
      // Emit to all online users
      io.emit('receive_admin_notification', { type: 'ADMIN', title, message, status: 'PENDING', createdAt: new Date().toISOString() });
    } else {
      const targetUser = await prisma.user.findFirst({ where: { customId: target.toUpperCase() } });
      if (!targetUser) return res.status(404).json({ error: 'User not found' });
      
      const notif = await prisma.notification.create({
        data: {
          userId: targetUser.customId,
          type: 'ADMIN',
          title,
          message,
          status: 'PENDING'
        }
      });
      const targetSocketId = onlineUsers.get(targetUser.customId);
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive_admin_notification', notif);
      }
    }
    res.json({ message: 'Notification sent' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send notification' });
  }
});

// Mark notification as read or responded
app.post('/api/notifications/:id/respond', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updated = await prisma.notification.update({
      where: { id },
      data: { status }
    });

    if (updated.type === 'TEACHER_INVITE' && status === 'ACCEPTED') {
      try {
        let inviteData: any = {};
        if (updated.message) {
          try { inviteData = JSON.parse(updated.message); } catch (e) {}
        }
        const teacherId = inviteData.teacherCustomId || inviteData.teacherId || updated.senderId;

        if (teacherId && updated.userId) {
          // Update student user's teacherId field in database (or character tag / role relation)
          await prisma.user.updateMany({
            where: {
              OR: [
                { customId: updated.userId },
                { id: updated.userId }
              ]
            },
            data: {
              // Store assigned teacher ID inside status or extra metadata if needed
              country: teacherId // Use optional field to bind teacherId
            }
          });
        }
      } catch (err) {
        console.error('Assign teacher error:', err);
      }
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Fallback to admin panel for unhandled routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../admin_panel/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

// --- SOCKET LOGIC ---
const onlineUsers = new Map<string, string>(); // customId -> socket.id

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  socket.on('register', (customId) => {
    onlineUsers.set(customId.toUpperCase(), socket.id);
    console.log(customId + ' registered with socket ' + socket.id);
  });

  socket.on('send_battle_invite', async (data) => {
    // data: { senderId, targetId, senderName, senderAvatar, level, rating }
    console.log('Battle invite from ' + data.senderId + ' to ' + data.targetId);
    
    try {
      // Save to database
      const notif = await prisma.notification.create({
        data: {
          userId: data.targetId.toUpperCase(),
          senderId: data.senderId.toUpperCase(),
          type: 'BATTLE_INVITE',
          message: JSON.stringify({
            senderName: data.senderName,
            senderAvatar: data.senderAvatar,
            level: data.level,
            rating: data.rating
          }),
          status: 'PENDING'
        }
      });

      const targetSocketId = onlineUsers.get(data.targetId.toUpperCase());
      if (targetSocketId) {
        io.to(targetSocketId).emit('receive_battle_invite', {
          ...notif,
          senderName: data.senderName,
          senderAvatar: data.senderAvatar,
          level: data.level,
          rating: data.rating
        });
      }
    } catch (e) {
      console.error('Error saving battle invite:', e);
    }
  });

  socket.on('respond_battle_invite', async (data) => {
    // data: { notifId, status: 'ACCEPTED' | 'REJECTED', targetName?: string, targetAvatar?: string }
    try {
      const notif = await prisma.notification.update({
        where: { id: data.notifId },
        data: { status: data.status }
      });
      
      if (notif && notif.senderId) {
        const senderSocketId = onlineUsers.get(notif.senderId);
        if (senderSocketId) {
          io.to(senderSocketId).emit('battle_invite_response', {
            ...notif,
            targetName: data.targetName,
            targetAvatar: data.targetAvatar
          });
        }
      }
    } catch (e) {
      console.error('Error responding to battle invite:', e);
    }
  });

  socket.on('disconnect', () => {
    for (const [key, value] of onlineUsers.entries()) {
      if (value === socket.id) {
        onlineUsers.delete(key);
        break;
      }
    }
  });
});
// ----------------------------------------------------

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
