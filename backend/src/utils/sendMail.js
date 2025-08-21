import dotenv from "dotenv";
import ejs from "ejs";
import nodemailer from "nodemailer";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Render EJS template
const renderEmailTemplate = async (templateName, data) => {
  const templatePath = path.join(
    __dirname,
    ".",
    "email-templates",
    `${templateName}.ejs`
  );
  return ejs.renderFile(templatePath, data);
};

// Mail transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Generic email sender
export const sendEmail = async ({ email, subject, templateName, data }) => {
  const html = await renderEmailTemplate(templateName, data);

  const mailOptions = {
    from: `"Mahdimonir Portfolio" <${process.env.SMTP_USER}>`,
    to: email,
    subject,
    html,
  };

  await transporter.sendMail(mailOptions);
};

// Specific reusable emails
export const sendActivationCode = async (email, otp, name) => {
  await sendEmail({
    email,
    subject: "Account Activation Code - Mahdimonir Portfolio",
    templateName: "mail-template",
    data: { name, otp, type: "activation" },
  });
};

export const sendPasswordResetEmail = async (email, otp, name) => {
  await sendEmail({
    email,
    subject: "Reset Your Password - Mahdimonir Portfolio",
    templateName: "mail-template",
    data: { name, otp, type: "passwordReset" },
  });
};

export const send2FAVerificationCode = async (email, otp, name) => {
  await sendEmail({
    email,
    subject: "2FA Verification Code - Mahdimonir Portfolio",
    templateName: "mail-template",
    data: { name, otp, type: "activation" },
  });
};

export const sendReplyEmail = async (email, subject, message, senderName) => {
  const transporter = nodemailer.createTransport({
    service: "gmail", // Or your email service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Your Name" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Re: ${subject}`,
    text: `Dear ${senderName},\n\n${message}\n\nBest regards,\nYour Name`,
    html: `<p>Dear ${senderName},</p><p>${message}</p><p>Best regards,<br>Your Name</p>`,
  };

  await transporter.sendMail(mailOptions);
};
