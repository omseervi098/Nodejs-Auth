const Queue = require("bull");
const verifyMailer = require("../mailers/verifyemail_mailer");
const env = require("../config/environment");
const verifyEmailQueue = new Queue(
  "verifyemail",
  `redis://default:${env.redis_password}@redis-16171.c301.ap-south-1-1.ec2.cloud.redislabs.com:16171`
);
//run parallelly
verifyEmailQueue.process(10, function (job, done) {
  verifyMailer.verifyEmailMail(job.data.email, job.data.token);
  done();
});
module.exports = verifyEmailQueue;
