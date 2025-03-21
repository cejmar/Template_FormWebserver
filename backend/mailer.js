// backend/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

async function sendConfirmationMail(name, email) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: email,
    subject: `Deine Anmeldung zur ${process.env.ORGANIZATION_NAME}`,
    text: `Hallo ${name},\n\ndanke für deine Anmeldung zur ${process.env.ORGANIZATION_NAME}! Wir freuen uns auf dich.\n\nLiebe Grüße\nDein ${process.env.ORGANIZATION_NAME}-Team`,
  });
}

async function sendAdminNotification(name, email, questions_suggestions, payment_method) {
  await transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: process.env.MAIL_TO,
    subject: "Neue Anmeldung eingegangen",
    text: `Neue Anmeldung:\n\nName: ${name}\nE-Mail: ${email}\nZahlungsoption: ${payment_method}\nFragen oder Vorschläge: ${questions_suggestions}`,
  });
}

module.exports = { sendConfirmationMail, sendAdminNotification };
