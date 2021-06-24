require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT;
const router = require("./router");
const path = require("path");
const morgan = require('morgan')
// const cronJob = require("cron").CronJob;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

app.use("/", express.static(path.join(__dirname, "/")));
app.use(router);

app.listen(port, () => {
  // var job = new cronJob(new Date(new Date().setSeconds(new Date().getSeconds() +10)), function() {
  //   console.log(new Date(new Date().setSeconds(new Date().getSeconds() +10)));
  // }, null, true, 'America/Los_Angeles');
  // job.start();

  console.log(`runnning on port:${port}`);
});

module.exports = app;
