import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST || "smtp.gmail.com";
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.FROM_EMAIL || SMTP_USER;

let transporter;

export function getTransporter() {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_PORT === 465,
      auth: { user: SMTP_USER, pass: SMTP_PASS },
    });
  }
  return transporter;
}

export async function sendOtpMail({ to, otp }) {
  const mailer = getTransporter();
  const subject = "Kode OTP Reset Password";
  const html = `
    <p>Halo,</p>
    <p>Berikut adalah kode OTP Anda untuk reset password:</p>
    <h2 style="letter-spacing: 4px;">${otp}</h2>
    <p>Kode ini berlaku selama 10 menit. Jika Anda tidak meminta reset password, abaikan email ini.</p>
  `;
  await mailer.sendMail({ from: FROM_EMAIL, to, subject, html });
}
