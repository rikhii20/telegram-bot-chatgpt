require('dotenv').config();

const express = require('express');
const app = express();
const axios = require('axios');
const { Configuration, OpenAIApi } = require('openai');
const port = process.env.PORT || 8080;

const telegramToken = process.env.TELEGRAM_TOKEN;
const hookUrl = process.env.HOOK_URL;
const telegramUrl = process.env.TELEGRAM_URL;

// instance
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
  // req.body.message
  try {
    const strSplit = req.body.message.text.split(':');
    if (req.body.message.text.match(/\/start/gi)) {
      const msg =
        'Welcome to ProtoBot👋\n\nYou can control me by sending these commands:\n\n/start - starting the bot\n/image:{free-text} - generating photo/image\nFree text to ask me any question with any languages';
      await axios.post(`${telegramUrl}${telegramToken}/sendMessage`, {
        chat_id: req.body.message.chat.id,
        text: msg
      });
      return res.send();
    }

    if (strSplit[0].match(/\/image/gi)) {
      const msg = 'Wait a second...';
      await axios.post(`${telegramUrl}${telegramToken}/sendMessage`, {
        chat_id: req.body.message.chat.id,
        text: msg
      });
      const generateImage = await openai.createImage({
        prompt: strSplit[1],
        n: 3,
        size: '1024x1024'
      });

      const images = generateImage.data.data;
      await Promise.all(
        images.map(async (image) => {
          await axios.post(`${telegramUrl}${telegramToken}/sendMessage`, {
            chat_id: req.body.message.chat.id,
            text: image.url
          });
        })
      );
      return res.send();
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: text }]
    });
    const message = completion.data.choices[0].message.content;
    await axios.post(`${telegramUrl}${telegramToken}/sendMessage`, {
      chat_id: req.body.message.chat.id,
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
