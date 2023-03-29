require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

const url = 'https://api.telegram.org/bot';
const apiToken = process.env.TOKEN;

app.post('/bot', (req, res) => {
  // console.log(req.body);
  const chatId = req.body.message.chat.id;
  const sentMessage = req.body.message.text;
  // Regex for hello
  if (sentMessage.match(/hello/gi)) {
    axios
      .post(`${url}${apiToken}/sendMessage`, {
        chat_id: chatId,
        text: 'hello back 👋'
      })
      .then((response) => {
        res.status(200).send(response);
      })
      .catch((error) => {
        res.send(error);
      });
  } else {
    // if no hello present, just respond with 200
    res.status(200).send({});
  }
});

app.listen(port, () => console.log('app is running at port', port));
