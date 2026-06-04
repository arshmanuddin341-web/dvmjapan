/**
 * Email Utility
 * Handles email sending using Nodemailer with Gmail SMTP (App Password)
 * 
 * Gmail App Password: Google Account → Security → 2-Step Verification → App passwords
 * Generate a 16-character password for "Mail" and use it in GMAIL_APP_PASSWORD
 */

const nodemailer = require('nodemailer');

/** Gmail SMTP defaults */
const GMAIL_HOST = 'smtp.gmail.com';
const GMAIL_PORT = 587;

/**
 * Create reusable transporter for Gmail SMTP with App Password
 * Uses GMAIL_USER (full email) and GMAIL_APP_PASSWORD (16-char app password)
 */
const createTransporter = () => {
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (!user || !pass) {
    throw new Error(
      'Gmail SMTP not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env (use App Password, not account password).'
    );
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || GMAIL_HOST,
    port: parseInt(process.env.SMTP_PORT, 10) || GMAIL_PORT,
    secure: false,
    auth: {
      user,
      pass,
    },
    // Required for Gmail; use STARTTLS on port 587
    tls: {
      rejectUnauthorized: true,
    },
  });
};

/**
 * Send an email
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} options.html - HTML content
 * @returns {Promise<Object>} Nodemailer send result
 */
const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = createTransporter();

  const fromEmail = process.env.EMAIL_FROM_ADDRESS || process.env.GMAIL_USER || process.env.SMTP_USER;
  const mailOptions = {
    from: `"${process.env.EMAIL_FROM_NAME || 'Car Auction'}" <${fromEmail}>`,
    to,
    subject,
    text,
    html,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Email sent: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

/**
 * Send verification email to user
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @param {string} verificationUrl - Full verification URL with token
 * @returns {Promise<Object>}
 */
const sendVerificationEmail = async (email, name, verificationUrl) => {
  const subject = 'Verify Your Email - Car Auction';
  
  const text = `
Hello ${name},

Thank you for registering at Car Auction!

Please verify your email address by clicking the link below:

${verificationUrl}

This link will expire in 24 hours.

If you did not create an account, please ignore this email.

Best regards,
Car Auction Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your Email</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 20px 0; }
    .button:hover { opacity: 0.9; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .warning { background: #fff3cd; border: 1px solid #ffc107; padding: 10px; border-radius: 4px; margin-top: 20px; font-size: 13px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Car Auction</h1>
    </div>
    <div class="content">
      <h2>Hello ${name}!</h2>
      <p>Thank you for registering at Car Auction. To complete your registration and start bidding on amazing vehicles, please verify your email address.</p>
      
      <div style="text-align: center;">
        <a href="${verificationUrl}" class="button">Verify Email Address</a>
      </div>
      
      <p>Or copy and paste this link in your browser:</p>
      <p style="word-break: break-all; color: #667eea;">${verificationUrl}</p>
      
      <div class="warning">
        <strong>⏰ This link will expire in 24 hours.</strong><br>
        If you did not create an account, please ignore this email.
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Car Auction. All rights reserved.</p>
      <p>This is an automated email. Please do not reply.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: email, subject, text, html });
};

/**
 * Send welcome email after verification
 * @param {string} email - User's email address
 * @param {string} name - User's name
 * @returns {Promise<Object>}
 */
const sendWelcomeEmail = async (email, name) => {
  const subject = 'Welcome to Car Auction!';
  const loginUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`;

  const text = `
Hello ${name},

Your email has been verified successfully!

Welcome to Car Auction - your destination for amazing car deals.

You can now:
- Browse thousands of vehicles
- Place bids on live auctions
- Sell your own vehicles

Start exploring: ${loginUrl}

Best regards,
Car Auction Team
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to Car Auction</title>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .header h1 { color: #fff; margin: 0; font-size: 24px; }
    .content { background: #f9f9f9; padding: 30px; border: 1px solid #e0e0e0; }
    .button { display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #fff; padding: 14px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; }
    .features { margin: 20px 0; }
    .features li { margin: 10px 0; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .success { background: #d4edda; border: 1px solid #28a745; padding: 15px; border-radius: 4px; text-align: center; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚗 Car Auction</h1>
    </div>
    <div class="content">
      <div class="success">
        <strong>✅ Email Verified Successfully!</strong>
      </div>
      
      <h2>Welcome, ${name}!</h2>
      <p>Your email has been verified and your account is now fully activated.</p>
      
      <p>With your verified account, you can now:</p>
      <ul class="features">
        <li>🔍 Browse thousands of vehicles</li>
        <li>💰 Place bids on live auctions</li>
        <li>🚗 List your own vehicles for sale</li>
        <li>⭐ Save favorites and track auctions</li>
      </ul>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${loginUrl}" class="button">Start Exploring</a>
      </div>
    </div>
    <div class="footer">
      <p>&copy; ${new Date().getFullYear()} Car Auction. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to: email, subject, text, html });
};

module.exports = {
  sendEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
};
