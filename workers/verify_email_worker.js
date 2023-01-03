const Queue = require("bull");
const verifyMailer = require("../mailers/verifyemail_mailer");
const verifyEmailQueue = new Queue("verifyemail", {
  redis: {
    port: env.redis_port,
    host: env.redis_url,
    password: env.redis_password,
  },
});
//run parallelly
verifyEmailQueue.process(10, function (job, done) {
  verifyMailer.verifyEmailMail(job.data.email, job.data.token);
  done();
});
module.exports = verifyEmailQueue;
