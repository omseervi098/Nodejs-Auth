const Queue = require("bull");
const env = require("../config/environment");
const forgotPassMailer = require("../mailers/forgotpass_mailer");

const forgotPassQueue = new Queue("forgot-pass", {
  redis: {
    port: env.redis_port,
    host: env.redis_url,
    password: env.redis_password,
  },
});

//run parallelly using bull
forgotPassQueue.process(10, function (job, done) {
  forgotPassMailer.newpass(job.data);
  done();
});
module.exports = forgotPassQueue;
