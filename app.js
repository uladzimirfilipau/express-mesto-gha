const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost:27017/mestodb";

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require("./routes/users");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use("/users", userRouter);

app.listen(PORT);
