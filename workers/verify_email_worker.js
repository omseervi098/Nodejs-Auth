const Queue = require("bull");
const verifyMailer = require("../mailers/verifyemail_mailer");
const verifyEmailQueue = new Queue("verifyemail", "redis://127.0.0.1:6379");
//run parallelly
verifyEmailQueue.process(10, function (job, done) {
  verifyMailer.verifyEmailMail(job.data.email, job.data.token);
  done();
});
module.exports = verifyEmailQueue;
