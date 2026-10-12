const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { Otp } = require('../db');

// Request OTP for Login
router.post('/send-otp', async (req, res) => {
  try {
    const { email } = req.body;

    if (!email || !email.trim()) {
      return res.status(400).json({ error: 'Email address is required.' });
    }

    const requestedEmail = email.trim().toLowerCase();
    const configuredAdminEmail = (process.env.ADMIN_EMAIL || '').trim().toLowerCase();

    // If ADMIN_EMAIL is set in .env and doesn't match requested email -> error!
    if (configuredAdminEmail && requestedEmail !== configuredAdminEmail) {
      return res.status(400).json({
        error: 'Wrong email ID. Access is restricted to the registered admin email address.'
      });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store or update OTP in MongoDB
    await Otp.findOneAndUpdate(
      { email: requestedEmail },
      { otp, expiresAt },
      { upsert: true, new: true }
    );

    const smtpUser = (process.env.SMTP_USER || '').trim();
    const smtpPass = (process.env.SMTP_PASS || '').trim();
    const smtpHost = process.env.SMTP_HOST || 'smtp.gmail.com';
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);

    let emailSent = false;
    let devOtp = null;

    if (smtpUser && smtpPass) {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpHost,
          port: smtpPort,
          secure: smtpPort === 465,
          auth: {
            user: smtpUser,
            pass: smtpPass
          }
        });

        await transporter.sendMail({
          from: `"Sumit Patel Portfolio Admin" <${smtpUser}>`,
          to: requestedEmail,
          subject: 'Your Admin Login OTP Code',
          text: `Your Admin OTP login code is: ${otp}. Valid for 10 minutes.`,
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #09090b; color: #ffffff; border-radius: 12px;">
              <h2 style="color: #FF6B2B; margin-top: 0;">Admin Portal OTP Verification</h2>
              <p>Use the OTP code below to sign in to your Portfolio Admin Panel:</p>
              <div style="font-size: 32px; font-weight: bold; letter-spacing: 6px; color: #FF6B2B; background: #18181b; padding: 16px; text-align: center; border-radius: 8px; margin: 20px 0;">
                ${otp}
              </div>
              <p style="color: #a1a1aa; font-size: 13px;">This OTP will expire in 10 minutes. If you did not request this, please ignore this email.</p>
            </div>
          `
        });
        emailSent = true;
      } catch (err) {
        console.error('SMTP Email sending error:', err.message);
        devOtp = otp;
      }
    } else {
      console.log(`\n==========================================`);
      console.log(`🔑 [DEV OTP] Admin OTP for ${requestedEmail}: ${otp}`);
      console.log(`==========================================\n`);
      devOtp = otp;
    }

    return res.json({
      success: true,
      message: emailSent
        ? `OTP sent successfully to ${requestedEmail}`
        : `OTP generated successfully. (Dev mode: check console or use OTP below)`,
      devOtp: devOtp
    });
  } catch (err) {
    console.error('Send OTP error:', err);
    return res.status(500).json({ error: 'Failed to send OTP: ' + err.message });
  }
});

// Verify OTP & Login
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ error: 'Email and OTP are required.' });
    }

    const requestedEmail = email.trim().toLowerCase();

    const record = await Otp.findOne({ email: requestedEmail });

    if (!record) {
      return res.status(400).json({ error: 'No OTP request found for this email. Please request a new OTP.' });
    }

    if (Date.now() > new Date(record.expiresAt).getTime()) {
      return res.status(400).json({ error: 'OTP has expired. Please request a new OTP.' });
    }

    if (record.otp !== otp.trim()) {
      return res.status(400).json({ error: 'Invalid OTP code. Please check and try again.' });
    }

    // Clear used OTP
    await Otp.deleteOne({ email: requestedEmail });

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      { email: requestedEmail, role: 'admin' },
      process.env.JWT_SECRET || 'sp-portfolio-admin-secret-jwt-key-2026',
      { expiresIn: '7d' }
    );

    return res.json({
      success: true,
      token,
      user: { email: requestedEmail, role: 'admin' }
    });
  } catch (err) {
    console.error('Verify OTP error:', err);
    return res.status(500).json({ error: 'Failed to verify OTP' });
  }
});

// Verify token on page refresh
router.get('/verify-token', (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ valid: false });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'sp-portfolio-admin-secret-jwt-key-2026');
    return res.json({ valid: true, user: decoded });
  } catch (err) {
    return res.status(401).json({ valid: false });
  }
});

module.exports = router;
