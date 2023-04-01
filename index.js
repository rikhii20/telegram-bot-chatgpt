require('dotenv').config();

const express = require('express');
const app = express();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const port = process.env.PORT || 8080;
const { Configuration, OpenAIApi } = require('openai');

const telegramToken = process.env.TELEGRAM_TOKEN;
const hookUrl = process.env.HOOK_URL;
const telegramUrl = process.env.TELEGRAM_URL;

// instance
const bot = new Telegraf(telegramToken);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const init = async () => {
  try {
    const res = await axios.get(
      `${telegramUrl}${telegramToken}/setwebhook?url=${hookUrl}`
    );
    console.log(res.data);
  } catch (error) {
    console.log(error);
  }
};

app.post('/', async (req, res) => {
  const chatId = req.body.message.chat.id;
  const msg = req.body.message.text;

  try {
    if (msg.match(/\/start/gi)) {
      bot.command('start', (ctx) => ctx.reply('Welcome 👋\nmay I help you?'));
      return res.send();
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: msg }]
    });
    const message = completion.data.choices[0].message.content;
    await axios.post(`${telegramUrl}${telegramToken}/sendMessage`, {
      chat_id: chatId,
      text: message
    });
    return res.send();
  } catch (error) {
    console.log(error);
  }
});

// bot.launch(); -> test in local environment

app.listen(port, async () => {
  console.log('app is running');
  await init();
});
