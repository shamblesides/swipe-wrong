const fs = require('fs');
const express = require('express');

if (!fs.existsSync('data')) fs.mkdirSync('data', {recursive: true});
if (!fs.existsSync('data/chosen.txt')) fs.writeFileSync('data/chosen.txt', '');
const db = fs.readFileSync('data/chosen.txt').toString()
    .split('\n')
    .reduce((set, word) => word ? set.add(word) : set, new Set());

const app = express();
app.use(express.json());
app.get('/api/chosen', (req, res) => res.json([...db.keys()]));
app.post('/api/word', (req, res) => {
    const { word, used } = req.body;
    if (used) db.add(word);
    else db.delete(word);
    fs.writeFileSync('data/chosen.txt', [...db.keys()].join('\n'));
    console.log(`[${used?'YES!':'undo'}]    "${word}"`);
    res.sendStatus(204);
})
app.use(express.static('web'))

app.listen(80, () => console.log('---WORD SERVER UP---'));
