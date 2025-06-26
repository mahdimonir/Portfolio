import nodemailer from "nodemailer";

// Create reusable transporter object using SMTP transport
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendContactEmail = async ({ name, email, subject, message }) => {
  try {
    const mailOptions = {
      from: `${name} <${email}>`,
      to: process.env.SMTP_USER,
      replyTo: email,
      subject: `Portfolio Contact: ${subject}`,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
};

export const sendPasswordResetEmail = async (to, otp) => {
  try {
    const mailOptions = {
      from: process.env.SMTP_USER,
      to,
      subject: "Password Reset OTP",
      html: `
        <h3>Password Reset Request</h3>
        <p>You have requested to reset your password. Here is your One-Time Password (OTP):</p>
        <h2 style="letter-spacing: 5px; font-size: 32px; text-align: center; padding: 10px; background: #f5f5f5; border-radius: 5px;">${otp}</h2>
        <p>This OTP will expire in 10 minutes.</p>
        <p>If you did not request this password reset, please ignore this email.</p>
        <p>For security reasons, please do not share this OTP with anyone.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(`Failed to send password reset email: ${error.message}`);
  }
};
