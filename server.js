const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const groupRoutes = require("./routes/groupRoutes");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();

const db = mongoose.connect(process.env.MONGO_URI, {
  dbName: process.env.DB_NAME,
  user: process.env.DB_USER,
  pass: process.env.DB_PASSWORD,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});

const PORT = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(groupRoutes);
app.use(userRoutes);

db.then(() => {
  app.listen(PORT);
  console.info("Server running on PORT: ", PORT);
}).catch(console.error);

module.exports = app;
