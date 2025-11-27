const sgMail = require('@sendgrid/mail');

// Try to use SendGrid if API key is available, fallback to nodemailer
const USE_SENDGRID = !!process.env.SENDGRID_API_KEY;

if (USE_SENDGRID) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  console.log('✅ Using SendGrid for emails (works on Render!)');
}

// Fallback nodemailer setup (for local development without SendGrid)
const nodemailer = require('nodemailer');

// Create email transporter with optimized settings for Render
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // Use TLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    },
    tls: {
      rejectUnauthorized: false // Allow self-signed certificates
    },
    connectionTimeout: 10000, // 10 seconds
    greetingTimeout: 10000,
    socketTimeout: 10000
  });
};

// Send OTP email
const sendOTPEmail = async (to, otp, name) => {
  try {
    // Use SendGrid if available (works on Render!)
    if (USE_SENDGRID) {
      const msg = {
        to: to,
        from: {
          email: process.env.EMAIL_USER || 'noreply@Hospo.health',
          name: 'Hospo Healthcare'
        },
        subject: 'Your OTP for Hospo Healthcare Registration',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
              .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
              .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
              .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Welcome to Hospo Healthcare</h1>
              </div>
              <div class="content">
                <p>Hello ${name || 'Doctor'},</p>
                <p>Thank you for registering with Hospo Healthcare. To complete your registration, please use the OTP below:</p>
                
                <div class="otp-box">
                  <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                  <p class="otp-code">${otp}</p>
                  <p style="margin: 0; font-size: 12px; color: #999;">This OTP is valid for 10 minutes</p>
                </div>
                
                <p>If you didn't request this OTP, please ignore this email.</p>
                <p>Best regards,<br>Hospo Healthcare Team</p>
              </div>
              <div class="footer">
                <p>&copy; ${new Date().getFullYear()} Hospo Healthcare. All rights reserved.</p>
              </div>
            </div>
          </body>
          </html>
        `
      };

      await sgMail.send(msg);
      console.log('✅ Email sent via SendGrid to:', to);
      return { success: true, provider: 'sendgrid' };
    }
    
    // Fallback to nodemailer (for local development)
    const transporter = createTransporter();
    
    const mailOptions = {
      from: `"Hospo Healthcare" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: 'Your OTP for Hospo Healthcare Registration',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .otp-box { background: white; border: 2px dashed #667eea; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
            .otp-code { font-size: 32px; font-weight: bold; color: #667eea; letter-spacing: 5px; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Welcome to Hospo Healthcare</h1>
            </div>
            <div class="content">
              <p>Hello ${name || 'Doctor'},</p>
              <p>Thank you for registering with Hospo Healthcare. To complete your registration, please use the OTP below:</p>
              
              <div class="otp-box">
                <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
                <p class="otp-code">${otp}</p>
                <p style="margin: 0; font-size: 12px; color: #999;">This OTP is valid for 10 minutes</p>
              </div>
              
              <p>If you didn't request this OTP, please ignore this email.</p>
              <p>Best regards,<br>Hospo Healthcare Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Hospo Healthcare. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Add timeout to prevent hanging
    const sendPromise = transporter.sendMail(mailOptions);
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Email timeout')), 20000)
    );

    const info = await Promise.race([sendPromise, timeoutPromise]);
    console.log('✅ Email sent via Gmail to:', to);
    return { success: true, messageId: info.messageId, provider: 'gmail' };
  } catch (error) {
    console.error('❌ Email failed:', error.message);
    // Don't block registration - just log the error
    return { success: false, error: error.message };
  }
};

module.exports = { sendOTPEmail };
