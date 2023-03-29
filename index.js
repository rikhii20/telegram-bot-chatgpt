require('dotenv').config();

const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/bot', (req, res) => {
  return res.send('hello world');
});

app.listen(port, () => console.log('app is running at port', port));
