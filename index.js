import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import TelegramBot from "node-telegram-bot-api";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("json spaces", 2);
app.use(
  cors({
    origin: "*",
  })
);

app.use((req, res, next) => {
  const pass = req.headers["authorization"];
  if (pass !== process.env.PASS) {
    return res.sendStatus(401); // Unauthorized
  }
  next();
});

const telegramRoute = express.Router();
telegramRoute.post("/send", (req, res) => {
  const { botToken, clientId, msg } = req.body;

  if (
    typeof botToken != "string" ||
    typeof clientId != "string" ||
    typeof msg != "string"
  )
    return res.status(400).send("Body Error");

  const bot = new TelegramBot(botToken, { polling: false });

  try {
    bot.sendMessage(clientId, msg);
    res.status(200).send("Done");
  } catch {
    res.status(400).send("Fielad");
  }
});

app.use("/telegram", telegramRoute);
app.all("*", (req, res) => res.sendStatus(404));

const server = app.listen(process.env.PORT, () =>
  console.log("Server is online")
);
