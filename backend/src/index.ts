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

// 1. Send OTP
app.post('/api/auth/send-otp', async (req, res) => {
  console.log('--- SEND OTP REQUEST ---');
  console.log('Body:', req.body);
  console.log('SMTP_USER:', process.env.SMTP_USER);
  try {
    const { email, name } = req.body;
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

    // Send Email
    const mailOptions = {
      from: `"IQROMAX Admin" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'IQROMAX - Verify your email address',
      html: `
        <div style="font-family: Arial, sans-serif; max-w: 600px; margin: 0 auto; background-color: #070712; color: #ffffff; padding: 40px; border-radius: 16px; border: 1px solid #1A1A2F;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 900; margin: 0; letter-spacing: 2px;">
              IQRO<span style="color: #A855F7;">MAX</span>
            </h1>
          </div>
          
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 20px;">Hello ${name || 'Student'},</h2>
          
          <p style="color: #C7D2FE; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
            Thank you for registering at IQROMAX! Please use the verification code below to confirm your email address. 
            This code will expire in exactly <strong>1 minute</strong>.
          </p>
          
          <div style="text-align: center; background-color: #121223; padding: 20px; border-radius: 12px; border: 1px solid #2D1B69; margin-bottom: 30px;">
            <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #A855F7;">${code}</span>
          </div>
          
          <p style="color: #818CF8; font-size: 14px; text-align: center; margin-top: 40px;">
            If you did not request this code, please ignore this email.
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

// Helper: Generate Custom ID
const generateCustomId = async () => {
  const count = await prisma.user.count();
  const nextId = count + 1;
  return `#${nextId.toString().padStart(4, '0')}`;
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

// User login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { phone, password } = req.body;

    const user = await prisma.user.findFirst({ where: { phone } });
    if (!user) return res.status(400).json({ error: 'Foydalanuvchi topilmadi. Telefon raqamini tekshiring.' });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: 'Parol noto\'g\'ri' });

    if (user.status !== 'Faol') return res.status(403).json({ error: 'Akkauntingiz faol emas. Adminga murojaat qiling.' });

    res.json({ message: 'Login successful', user });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Ichki server xatosi' });
  }
});

// 4. Admin API: Get Users
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

// Serve admin panel static files in production
app.use(express.static(path.join(__dirname, '../../admin_panel/dist')));

// Fallback to admin panel for unhandled routes
app.use((req, res) => {
  res.sendFile(path.join(__dirname, '../../admin_panel/dist/index.html'));
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
