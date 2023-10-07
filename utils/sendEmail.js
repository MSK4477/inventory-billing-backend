import  nodemailer from "nodemailer";

const sendEmail = async (subject, message, send_to, sent_from) => {
  // Create Email Transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",   
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    }
  });

  // Option for sending email
  const options = {
    from: sent_from,
    to: send_to,
    subject: subject,
    html: message,
  };

  // send email
  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log(err);
    } else {
      console.log(info);
    }
  });
};

export default  sendEmail;
