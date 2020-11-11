const express = require('express');
const path = require('path');

const app = express();
const port = 9000;
const { log } = console;

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(port, () => {
  log(`\nServer is running on port: ${port}`);
});
