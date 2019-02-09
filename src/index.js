const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const express = require('express');
const nanoid = require('nanoid/generate');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');

if (!fs.existsSync('./secret')) {
    const secret = crypto.randomBytes(256/8)
    fs.writeFileSync('./secret', secret);
}
const jwtSecret = fs.readFileSync('./secret');
const auth = expressJwt({ secret: jwtSecret })

const freqMap = fs.readFileSync(path.resolve(__dirname, './data/phrases.txt'))
    .toString()
    .split('\n')
    .map(line => line.trim())
    .map(line => ({
        weight: +line.split(' ')[0],
        word: line.substr(line.indexOf(' ')+1),
    }))
    .map(({ word, weight }) => ({
        word,
        weight: weight ** 0.6
    }))
    .reduce((map, { word, weight }) => word ? map.set(word, weight) : map, new Map())

const [db, randMax] = fs.readFileSync(path.resolve(__dirname, './data/chosen.txt'))
    .toString()
    .split('\n')
    .map(word => ({ word, weight: freqMap.get(word) }))
    .sort((a, b) => (b.weight - a.weight) || (a.word.localeCompare(b.word)))
    .reduce(([arr, total], { word, weight }) => {
        arr.push({ word, min: total });
        return [arr, total+weight];
    }, [[], 0])

function randomWord() {
    const i = Math.floor(Math.random() * randMax);
    
    let l = 0, r = db.length - 1;
    while (r > l) {
        const mid = Math.ceil(l + (r-l)/2);
        const { min } = db[mid];
        if (i < min) r = mid - 1;
        else l = mid;
    }
    return db[l].word;
}

const profiles = {};

const app = express();
app.use(express.json());
app.get('/api/words', (req, res) => {
    const time = 60;
    const words = Array(time*4).fill().map(randomWord);
    const futureSlug = nanoid('abcdefhjknpstxyz23456789', 12).match(/.{4}/g).join('-');
    const token = jwt.sign({ words, futureSlug }, jwtSecret, { expiresIn: '15 minutes' })
    res.json({ words, time, token });
});
app.post('/api/profile', auth, (req, res) => {
    // validate everything
    const validators = [
        body => Array.isArray(body),
        body => body.length <= req.user.words.length,
        body => body.every(el => (typeof el === 'object')),
        body => body.every(el => (
            JSON.stringify(Object.keys(el).sort()) === JSON.stringify(["word","x","y"])
        )),
        body => body.every(el => typeof el.word === 'string'),
        body => body.every(el => typeof el.x === 'number'),
        body => body.every(el => typeof el.y === 'number'),
    ];
    for (const validator of validators) {
        if (!validator(req.body)) {
            return res.status(400).json({ error: "Invalid body" });
        }
    }
    const allowedWords = [...req.user.words];
    for (const word of req.body.map(el => el.word)) {
        const idx = allowedWords.indexOf(word);
        if (idx === -1) return res.status(400).json({ error: `Invalid word: ${word}`})
        allowedWords.splice(idx, 1);
    }

    const slug = req.user.futureSlug;
    profiles[slug] = req.body;
    const token = jwt.sign({ slug }, jwtSecret)
    res.status(200).json({ slug, token });
});
app.get('/api/profile/:id([-0-9a-z]+)', (req, res) => {
    const profile = profiles[req.params.id];
    if (profile) {
        res.json(profiles[req.params.id]);
    } else {
        res.status(404).json({ error: 'Not found' })
    }
    
});
app.use(express.static(path.join(__dirname, 'web')));
app.listen(80, (err) => console.log(err || 'Ready'));
