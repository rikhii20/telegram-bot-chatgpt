require('dotenv').config();

const express = require('express');
const app = express();
const { Telegraf, Context } = require('telegraf');
const { message } = require('telegraf/filters');
const axios = require('axios');
const port = process.env.PORT || 80;
const { Configuration, OpenAIApi } = require('openai');

const apiToken = process.env.TELEGRAM_TOKEN;

const bot = new Telegraf(apiToken);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.post('/', (req, res) => {
  console.log(req.body);
  bot.hears('animal', async (ctx) => {
    try {
      const completion = await openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: 'hello world' }]
      });
      const message = completion.data.choices[0].message.content;
      bot.telegram.sendMessage(ctx.chat.id, message, {});
    } catch (error) {
      console.log(error);
      console.log(error);
    }
  });
});

// bot.launch();
bot.telegram.setWebhook('https://telegram-bot-chatgpt-ghtg.onrender.com');
app.listen(port, () => console.log('app is running'));
// bot
//   .launch({
//     webhook: {
//       domain: 'https://telegram-bot-chatgpt-ghtg.onrender.com',
//       port: port
//     }
//   })
//   .then(() => console.log('app is running'))
//   .catch((err) => console.log(err));
