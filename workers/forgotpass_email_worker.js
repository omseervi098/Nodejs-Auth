const Queue = require("bull");
const forgotPassMailer = require("../mailers/forgotpass_mailer");
const forgotPassQueue = new Queue("forgot-pass", "redis://127.0.0.1:6379");
//run parallelly using bull
forgotPassQueue.process(10, function (job, done) {
  forgotPassMailer.newpass(job.data);
  done();
});
module.exports = forgotPassQueue;
