require('dotenv').config();

const express = require('express');
const app = express();
const { Telegraf } = require('telegraf');
const { message } = require('telegraf/filters');
const axios = require('axios');
const port = process.env.PORT || 8080;
const { Configuration, OpenAIApi } = require('openai');

const apiToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(apiToken);
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY
// });
// const openai = new OpenAIApi(configuration);

// app.use(bot.webhookCallback('/'));
// bot.telegram.setWebhook('https://telegram-bot-chatgpt-ghtg.onrender.com/');

// bot.command('start', (ctx) => {
//   bot.telegram.sendMessage(
//     ctx.chat.id,
//     'Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it'
//   );
// });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/', (req, res) => {
  console.log(req.body);
  bot.hears('hello', (ctx) => ctx.reply('haiiii'));
});

// bot
//   .launch({
//     webhook: {
//       domain: 'https://telegram-bot-chatgpt-ghtg.onrender.com',
//       port: port
//     }
//   })
//   .then((data) => console.log('app is running'))
//   .catch((err) => console.log(err));
bot.telegram.setWebhook('https://telegram-bot-chatgpt-ghtg.onrender.com');
// bot.launch();
app.listen(port, () => console.log('app is running at port', port));
