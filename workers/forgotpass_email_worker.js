const Queue = require("bull");
const env = require("../config/environment");
const forgotPassMailer = require("../mailers/forgotpass_mailer");

const forgotPassQueue = new Queue(
  "forgot-pass",
  `redis://default:${env.redis_password}@redis-16171.c301.ap-south-1-1.ec2.cloud.redislabs.com:16171`
);

//run parallelly using bull
forgotPassQueue.process(10, function (job, done) {
  forgotPassMailer.newpass(job.data);
  done();
});
module.exports = forgotPassQueue;
