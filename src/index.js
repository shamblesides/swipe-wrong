const path = require('path');
const express = require('express');
const api = require('./api/api');

const app = express();

app.use('/api', api);
app.use(express.static(path.join(__dirname, 'web')));

app.listen(3000, (err) => console.log(err || 'Ready'));
