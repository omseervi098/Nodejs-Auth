const nodemailer = require("../config/nodemailer");

//Another way of export method
const env = require("../config/environment");
exports.newpass = (forgotpass) => {
  let htmlString = nodemailer.renderTemplate(
    {
      forgotpass: forgotpass,
      domain: env.domain,
    },
    "/forgotpass/new_password.ejs"
  );
  //console.log('Inside new forgetpass mailer');
  nodemailer.transporter.sendMail(
    {
      from: env.smtp.auth.user,
      to: forgotpass.user.email,
      subject: "NodeAuth | Forgot Password",
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
