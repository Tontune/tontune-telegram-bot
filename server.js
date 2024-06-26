const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const TelegramBot = require("node-telegram-bot-api");

const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());

const TELEGRAM_BOT_TOKEN = "6636461019:AAF0CTuzZiATCfPva7-Ukom4PsZxNwge5M0";
const WEB_APP_URL = "https://tontune.github.io/tontune-telegram-web-app/";

const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

let chatId = 500;

bot.on("message", (msg) => {
  chatId = msg.chat.id;
});

bot.onText(/[\s\S]*/, (msg) => {
  const chatId = msg.chat.id;

  // Replace 'path/to/your/image.jpg' with the actual path to your image file
  const message =
    "🎉 Welcome to Tontune Demo! 🎵\nPlease connect wallet first\n\nHere's what you can do with Tontune:\n- 🎤 Discover new artists and explosive tracks.\n- 🏆 Participate in music challenges.\n- 💎 Collect and trade exclusive music NFTs.\n\n❗Note: In this demo version, the feature to mint actual tokens is not yet available. We are excited to roll out this functionality in the near future, allowing you to fully engage with all aspects of Tontune. Keep an eye on updates as we enhance your music experience!";
  const button1 = {
    text: "Open Tontune",
    web_app: { url: WEB_APP_URL },
  };
  const button2 = {
    text: "TG Channel",
    url: "https://t.me/TontuneApp",
  };
  const button3 = {
    text: "Landing Page",
    url: "https://tontune.xyz/",
  };

  // Create an array of inline button rows (each row is an array of button options)
  const inlineButtons = [[button1, button2, button3]];

  const buttonOptions = {
    reply_markup: {
      inline_keyboard: inlineButtons,
    },
  };

  bot
    .sendMessage(chatId, message, {
      parse_mode: "HTML",
      ...buttonOptions,
    })
    .catch((error) => {
      console.error("Error sending photo:", error);
    });
});

app.get("/chatId", (req, res) => {
  res.send({ chatId });
});

app.listen(3050, () => {
  console.log("Server is running on port 3050");
});
