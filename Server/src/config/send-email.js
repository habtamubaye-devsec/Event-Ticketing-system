const nodemailer = require("nodemailer");

// Create a test account or replace with real credentials.
const sendMail = async ({ email, subject, text, html }) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject,
      text,
      html,
    };
    await transporter.sendMail(mailOptions);

    console.log("Message sent");
  } catch (error) {
    console.error("error in sending email", error);
    return error;
  }
};

module.exports = sendMail;
