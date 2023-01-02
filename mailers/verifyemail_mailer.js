const nodemailer = require("../config/nodemailer");
const env = require("../config/environment");
//Another way of export method
exports.verifyEmailMail = (email, token) => {
  let htmlString = nodemailer.renderTemplate(
    {
      accessToken: token,
      domain: env.domain,
    },
    "/verify_email/verifyemail.ejs"
  );
  //console.log('Inside new forgetpass mailer');
  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: email,
      subject: "NodeAuth | Confirm your email",
      html: htmlString,
    },
    (err, info) => {
      if (err) {
        console.log("Error in sending mail", err);
        return;
      }
      console.log("Message sent");
      return;
    }
  );
};
