const express = require('express');
const app = express();
const path = require('path');
const port = 8080;

app.use('/static', express.static(path.join(__dirname, 'public')));

app.get('/api/test', (req, res) => {
  res.send('test output')
})

app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`)
})
