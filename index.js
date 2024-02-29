const express = require("express");
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const API_URL = process.env.API_URL;
const bodyParser = require('body-parser');

const citizensRouter = require('./routes/citizenship');

app.use(morgan('tiny'))
app.use(bodyParser.json());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

// Routes
app.use(`${API_URL}/citizenships`, citizensRouter);

mongoose
  .connect(process.env.DATABASE_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "MLDB",
  })
  .then(() => {
    console.log("Database Connecting...");
  })
  .catch((err) => {
    console.log("an error was ocuured");
    console.log(err);
  });
app.listen(3000, () => {
  console.log("Database Listenning...");
});
