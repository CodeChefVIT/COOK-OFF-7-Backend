import nodemailer from "nodemailer";
import Log from "../middlewares/Log";

export default class SendEmail {
  public static async verify(email: string, link: string) {
    Log.info(`Sending verification email to ${email}`);
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: process.env.GMAIL_ID,
          pass: process.env.GMAIL_PASSWORD,
        },
      });
      if (process.env.NODE_ENV !== "test") {
        await transporter.sendMail({
          from: "Cook Off CodeChef VIT <no-reply@cookoff.cc>",
          to: email,
          subject: "Verify your email",
          html: `<p>Click <a href="${link}">here</a> to verify your email</p>`,
        });
        Log.info("Email sent");
      }
    } catch (err) {
      Log.error(err);
    }
  }
}
