require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3000;
const router = require("./router");
const path = require("path");

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());

app.use("/", express.static(path.join(__dirname, "/")));
app.use(router);

app.listen(port, () => {
  console.log(`runnning on port:${port}`);
});

module.exports = app;
