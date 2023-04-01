require('dotenv').config();

const express = require('express');
const app = express();
const { Telegraf } = require('telegraf');
const axios = require('axios');
const port = process.env.PORT || 8080;
const { Configuration, OpenAIApi } = require('openai');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
const apiToken = process.env.TELEGRAM_TOKEN;
const hookUrl = process.env.HOOK_URL;
const url = 'https://api.telegram.org/bot';

const bot = new Telegraf(apiToken);
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const init = async () => {
  try {
    const res = await axios.get(
      `https://${url}${apiToken}/setwebhook?url=${hookUrl}`
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
    await axios.post(`${url}${apiToken}/sendMessage`, {
      chat_id: chatId,
      text: message
    });
    return res.send();
  } catch (error) {
    console.log(error);
  }
});

// bot.hears('animal', async (ctx) => {
//   try {
//     const completion = await openai.createChatCompletion({
//       model: 'gpt-3.5-turbo',
//       messages: [{ role: 'user', content: 'hello world' }]
//     });
//     const message = completion.data.choices[0].message.content;
//     bot.telegram.sendMessage(ctx.chat.id, message, {});
//   } catch (error) {
//     console.log(error);
//   }
// });
// bot.launch();
app.listen(port, async () => {
  console.log('app is running');
  await init();
});
// bot
//   .launch({
//     webhook: {
//       domain: 'https://telegram-bot-chatgpt-ghtg.onrender.com',
//       port: port
//     }
//   })
//   .then(() => console.log('app is running'))
//   .catch((err) => console.log(err));
