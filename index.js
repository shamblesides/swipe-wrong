const express = require('express');

const db = {};

const app = express();
app.use(express.json());
app.post('/api/word', (req, res) => {
    const { word, used } = req.body;
    console.log(`[${used?'YES!':'undo'}]    "${word}"`);
    db[word] = used;
    res.sendStatus(204);
})
app.use(express.static('web'))

app.listen(80, () => console.log('---WORD SERVER UP---'));
