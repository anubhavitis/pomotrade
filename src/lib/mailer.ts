import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD, // Use App Password, not your regular password
  },
});

export async function sendWaitlistEmail(email: string) {
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: email,
    subject: "Welcome to EzDawg Waitlist!",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333;">Welcome to Our Waitlist!</h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for joining our waitlist. We're thrilled to have you as part of our community!
        </p>
        <p style="color: #666; line-height: 1.6;">
          We'll keep you updated about:
          <ul>
            <li>Our launch date</li>
            <li>Special early-access features</li>
            <li>Exclusive offers for waitlist members</li>
          </ul>
        </p>
        <div>
          <p>
            If you have any questions, feel free to reply to this email.
          </p>
          <p>
            Best regards,
            <br />
            Anubhav Singhal
            <br />
            Cofounder, EzDawg
          </p>
        </div>
        <p style="color: #888; font-size: 12px; margin-top: 30px;">
          © ${new Date().getFullYear()} EzDawg. All rights reserved.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Email sending error:", error);
    return false;
  }
}
