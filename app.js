const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const mongoDB = "mongodb://localhost:27017/mestodb";

const { PORT = 3000 } = process.env;
const app = express();

const userRouter = require("./routes/users");
const cardRouter = require("./routes/cards");

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

mongoose.connect(mongoDB, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

app.use((req, res, next) => {
  req.user = {
    _id: "62cc28c1100fe03c04da406b",
  };

  next();
});

app.use("/users", userRouter);
app.use("/cards", cardRouter);

app.use("*", (req, res) => {
  res.status(404).send({
    message: "Страница не найдена",
  });
});

app.listen(PORT);
