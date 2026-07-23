import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', info.messageId);
    res.json({ message: 'OTP sent successfully' });
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
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.user.update({
      where: { email },
      data: { password: hashedPassword }
    });

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Failed to reset password' });
  }
});

// Helper: Generate Custom ID
const generateCustomId = async () => {
  let count = await prisma.user.count();
  let nextId = count + 1;
  let customId = `#${nextId.toString().padStart(4, '0')}`;
  
  while (true) {
    const exists = await prisma.user.findUnique({ where: { customId } });
    if (!exists) {
      return customId;
    }
    nextId++;
    customId = `#${nextId.toString().padStart(4, '0')}`;
  }
};

// 3. Final Register
app.post('/api/auth/register', async (req, res) => {
  try {
    const { role, name, phone, email, password, country, language, character } = req.body;

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
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password, language = 'en' } = req.body;
    const t = LOGIN_TRANSLATIONS[language] || LOGIN_TRANSLATIONS['en'];

    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) return res.status(400).json({ error: t.userNotFound });

    const validPassword = await bcrypt.compare(password, user.password);
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

// 4. Admin API: Get Users
app.get('/api/users/search/:customId', async (req, res) => {
  try {
    const { customId } = req.params;
    const user = await prisma.user.findUnique({
      where: { customId: customId.toUpperCase() }
    });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    res.json({
      id: user.customId,
      name: user.name,
      level: 1, // Assuming no level column in DB yet
      rating: 1000, // Default rating
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
    
    const filter = role ? {
      OR: [
        { role: String(role) },
        { role: String(role).toLowerCase() },
        { role: String(role).charAt(0).toUpperCase() + String(role).slice(1).toLowerCase() }
      ]
    } : {};
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
    await prisma.user.delete({
      where: { id }
    });
    // Emit real-time event to connected clients
    io.emit('user_deleted', { id });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Sync delete from Supabase Admin Panel
app.delete('/api/admin/users/sync-delete/:username', async (req, res) => {
  try {
    const { username } = req.params;
    const user = await prisma.user.findFirst({
      where: { name: username }
    });
    
    if (user) {
      await prisma.user.delete({ where: { id: user.id } });
      io.emit('user_deleted', { id: user.id });
      res.json({ message: 'User synced and deleted successfully' });
    } else {
      res.status(404).json({ error: 'User not found in local database' });
    }
  } catch (error) {
    console.error('Sync delete error:', error);
    res.status(500).json({ error: 'Failed to sync delete user' });
  }
});

// Serve admin panel static files in production
app.use(express.static(path.join(__dirname, '../admin_panel/dist')));

// Fallback to admin panel for unhandled routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../admin_panel/dist/index.html'));
});

const PORT = process.env.PORT || 5000;

// --- BATTLE INVITE & NOTIFICATION IN-MEMORY LOGIC ---
const onlineUsers = new Map<string, string>(); // customId -> socket.id
const notifications = [] as any[]; // Mock DB for notifications

io.on('connection', (socket) => {
  console.log('New socket connected:', socket.id);

  socket.on('register', (customId) => {
    onlineUsers.set(customId.toUpperCase(), socket.id);
    console.log(customId + ' registered with socket ' + socket.id);
  });

  socket.on('send_battle_invite', (data) => {
    // data: { senderId, targetId, senderName, senderAvatar, level, rating }
    console.log('Battle invite from ' + data.senderId + ' to ' + data.targetId);
    const targetSocketId = onlineUsers.get(data.targetId.toUpperCase());
    
    // Save to notifications array
    const notif = {
      id: Math.random().toString(36).substring(7),
      userId: data.targetId.toUpperCase(),
      senderId: data.senderId.toUpperCase(),
      senderName: data.senderName,
      senderAvatar: data.senderAvatar,
      level: data.level,
      rating: data.rating,
      type: 'BATTLE_INVITE',
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };
    notifications.push(notif);

    if (targetSocketId) {
      io.to(targetSocketId).emit('receive_battle_invite', notif);
    }
  });

  socket.on('respond_battle_invite', (data) => {
    // data: { notifId, status: 'ACCEPTED' | 'REJECTED' }
    const notif = notifications.find(n => n.id === data.notifId);
    if (notif) {
      notif.status = data.status;
      // Send message back to sender
      const senderSocketId = onlineUsers.get(notif.senderId);
      if (senderSocketId) {
        io.to(senderSocketId).emit('battle_invite_response', notif);
      }
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

app.get('/api/notifications/:customId', (req, res) => {
  const { customId } = req.params;
  const userNotifs = notifications.filter(n => n.userId === customId.toUpperCase() && n.status === 'PENDING');
  res.json(userNotifs);
});
// ----------------------------------------------------

server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
