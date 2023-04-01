require('dotenv').config();

const express = require('express');
const app = express();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const port = process.env.PORT || 8080;
const { Configuration, OpenAIApi } = require('openai');

const apiToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(apiToken);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/', (req, res) => {
  if (req.body === 'hi') {
    return bot.hears(req.body, (ctx) => ctx.reply(res.send('welcome! 👋')));
  }
});

// bot.command('start', (ctx) => {
//   bot.telegram.sendMessage(
//     ctx.chat.id,
//     'Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it'
//   );
// });

// bot.command('animal', (ctx) => {
//   bot.telegram.sendMessage(
//     ctx.chat.id,
//     'Hello there! Welcome to the Code Capsules telegram bot.\nI respond to /ethereum. Please try it'
//   );
// });

// bot.launch();
app.listen(port, () => console.log('app is running at port', port));
