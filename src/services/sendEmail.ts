import nodemailer from "nodemailer";
import Log from "../middlewares/Log";

export default class SendEmail {
  public static async login(email: string, token: string) {
    Log.info(`Sending email to ${email}`);
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
      const text = `${process.env.FRONTEND_URL}/login/` + token;
      if (process.env.NODE_ENV !== "test") {
        await transporter.sendMail({
          from: "Cook Off CodeChef VIT <no-reply@cookoff.cc>",
          to: email,
          subject: "Login using Email",
          text,
        });
        Log.info("Email sent");
      }
    } catch (err) {
      Log.error(err);
    }
  }
}
