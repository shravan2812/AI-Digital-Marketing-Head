import "dotenv/config";
import nodemailer from "nodemailer";

console.log("Gmail user:", process.env.GMAIL_USER);
console.log(
  "App password loaded:",
  Boolean(process.env.GMAIL_APP_PASSWORD)
);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendEmail = async ({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) => {
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject,
    html,
  });
};