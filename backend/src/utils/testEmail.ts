import "dotenv/config";
import { sendEmail } from "./email.js";

const testEmail = async () => {
  try {
    await sendEmail({
      to: process.env.GMAIL_USER!,
      subject: "AI Digital SaaS - Email Test",
      html: `
        <h1>Email system is working!</h1>
        <p>This email was sent using Nodemailer and Gmail.</p>
      `,
    });

    console.log("✅ Test email sent successfully");
  } catch (error) {
    console.error("❌ Failed to send test email");
    console.error(error);
  }
};

testEmail();