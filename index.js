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
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

bot.command('start', (ctx) => {
  bot.telegram.sendMessage(
    ctx.chat.id,
    'Hello there! Welcome to the AwesomeBot 👋'
  );
});

bot.command('ethereum', (ctx) => {
  var rate;
  console.log(ctx);
  axios
    .get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
    )
    .then((response) => {
      console.log(response.data);
      rate = response.data.ethereum;
      const message = `Hello, today the ethereum price is ${rate.usd}USD`;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    });
});

bot
  .launch({
    webhook: {
      domain: 'https://telegram-bot-chatgpt-ghtg.onrender.com',
      port: port
    }
  })
  .then(() => console.log('app is running'))
  .catch((err) => console.log(err));
