const express = require("express");
const app = express();
require("dotenv/config");
const mongoose = require("mongoose");
const morgan = require("morgan");
const API_URL = process.env.API_URL;
const bodyParser = require('body-parser');

const citizensRouter = require('./routes/citizenship');
const ratingDetailsRouter = require('./routes/rating-details');
const lessonRouter = require('./routes/lesson');
const userRouter = require('./routes/user');
const commentRouter = require('./routes/comment');
const likeRouter = require('./routes/lesson-like');
const playlistRouter = require('./routes/playlist');
const orderRouter = require('./routes/order');
const playlistRatingRouter = require('./routes/playlist-rating');

app.use(morgan('tiny'))
app.use(bodyParser.json());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));
app.use('/public/lessons', express.static(__dirname + '/public/lessons'));

// Routes
app.use(`${API_URL}/citizenships`, citizensRouter);
app.use(`${API_URL}/ratingDetails`, ratingDetailsRouter);
app.use(`${API_URL}/lessons`, lessonRouter);
app.use(`${API_URL}/users`, userRouter);
app.use(`${API_URL}/comments`, commentRouter);
app.use(`${API_URL}/likes`, likeRouter);
app.use(`${API_URL}/playlists`, playlistRouter);
app.use(`${API_URL}/orders`, orderRouter);
app.use(`${API_URL}/playlistRatings`, playlistRatingRouter);

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
