const fs = require('fs');
const path = require('path');
const express = require('express');

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
        weight: weight ** 0.93
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

const app = express();
app.get('/api/words', (req, res) => res.json({
    time: 60,
    words: Array(60*4).fill().map(randomWord)
}));
app.use(express.static(path.join(__dirname, 'web')));
app.listen(80, (err) => console.log(err || 'Ready'));
