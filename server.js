require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

// Email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Contact form endpoint
app.post('/contact', async (req, res) => {
  const { name, email, phone, message, website } = req.body;

  // Honeypot spam check
  if (website) {
    return res.status(400).json({ success: false, message: 'Spam submission blocked.' });
  }

  // Basic validation
  if (!name || !email || !message) {
    return res.status(400).json({ success: false, message: 'Name, email, and message are required.' });
  }

  try {
    // Email to the church
    await transporter.sendMail({
      from: `"KFMI Contact Form" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Contact Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5A2CA0;">New Contact Form Submission</h2>
          <table style="width:100%; border-collapse: collapse;">
            <tr><td style="padding:8px; font-weight:bold;">Name:</td><td style="padding:8px;">${name}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px; font-weight:bold;">Email:</td><td style="padding:8px;"><a href="mailto:${email}">${email}</a></td></tr>
            <tr><td style="padding:8px; font-weight:bold;">Phone:</td><td style="padding:8px;">${phone || 'Not provided'}</td></tr>
            <tr style="background:#f5f5f5;"><td style="padding:8px; font-weight:bold; vertical-align:top;">Message:</td><td style="padding:8px;">${message.replace(/\n/g, '<br/>')}</td></tr>
          </table>
          <p style="color:#888; font-size:12px; margin-top:20px;">Sent from Kairos Faith Ministry International website contact form.</p>
        </div>
      `,
    });

    // Auto-reply to the sender
    await transporter.sendMail({
      from: `"Kairos Faith Ministry International" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Thank you for contacting Kairos Faith Ministry International',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #5A2CA0;">Thank You, ${name}!</h2>
          <p>We have received your message and will get back to you within 24–48 hours.</p>
          <p>Here is a copy of your message:</p>
          <blockquote style="border-left: 4px solid #5A2CA0; padding-left: 12px; color: #555;">
            ${message.replace(/\n/g, '<br/>')}
          </blockquote>
          <br/>
          <p>God bless you,<br/><strong>Kairos Faith Ministry International</strong></p>
          <p style="color:#888; font-size:12px;">Koforidua Okorase | +233 500 079 389</p>
        </div>
      `,
    });

    console.log(`Contact form submitted by ${name} (${email})`);
    res.json({ success: true, message: 'Thank you for contacting Kairos Faith Ministry International! We will get back to you shortly.' });

  } catch (error) {
    console.error('Email sending failed:', error.message);
    res.status(500).json({ success: false, message: 'Could not send your message. Please try WhatsApp or call us instead.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
