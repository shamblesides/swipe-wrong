const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const express = require("express");
const nanoid = require("nanoid/generate");
const jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");
const randomWord = require("./words");
const getName = require("./names");
const Store = require("./storage");

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const dbFilepath = path.resolve(".data/db");
const db = Store(dbFilepath);

const SECRET_FILE = path.resolve(".data/secret");

if (!fs.existsSync(SECRET_FILE)) {
  const secret = crypto.randomBytes(256 / 8);
  fs.writeFileSync(SECRET_FILE, secret);
}
const jwtSecret = fs.readFileSync(SECRET_FILE);
const auth = expressJwt({ secret: jwtSecret });

const app = express.Router();

app.use(express.json());

app.get("/names", (req, res) => {
  const names = Array(100)
    .fill()
    .map(getName);
  const pics = [
    "/pics/cat.png",
    "/pics/goth.png",
    "/pics/hipster.png",
    "/pics/anime.png",
    "/pics/makeup.png",
    "/pics/suit.png"
  ];
  const token = jwt.sign({ names, pics }, jwtSecret, { expiresIn: "3 days" });
  res.json({ names, pics, token });
});

app.post("/game", auth, (req, res) => {
  // get selected name from body
  const { name, pic } = req.body;
  const { names, pics } = req.user;
  if (!names.includes(name))
    return res.status(400).json({ error: "Invalid name" });
  if (!pics.includes(pic))
    return res.status(400).json({ error: "Invalid pic" });
  // send game data
  const time = 60;
  const words = Array(time * 4)
    .fill()
    .map(randomWord);
  const futureSlug = nanoid("abcdefhjknpstxyz23456789", 12)
    .match(/.{4}/g)
    .join("-");
  const token = jwt.sign({ words, name, pic, futureSlug }, jwtSecret, {
    expiresIn: "15 minutes"
  });
  res.json({ words, time, token });
});

app.post("/profile", auth, (req, res) => {
  // validate everything
  const validators = [
    body => Array.isArray(body),
    body => body.length <= req.user.words.length,
    body => body.every(el => typeof el === "object"),
    body =>
      body.every(
        el =>
          JSON.stringify(Object.keys(el).sort()) ===
          JSON.stringify(["word", "x", "y"])
      ),
    body => body.every(el => typeof el.word === "string"),
    body => body.every(el => typeof el.x === "number"),
    body => body.every(el => typeof el.y === "number")
  ];
  const words = req.body;
  for (const validator of validators) {
    if (!validator(words)) {
      return res.status(400).json({ error: "Invalid body" });
    }
  }
  const allowedWords = [...req.user.words];
  for (const word of words.map(el => el.word)) {
    const idx = allowedWords.indexOf(word);
    if (idx === -1)
      return res.status(400).json({ error: `Invalid word: ${word}` });
    allowedWords.splice(idx, 1);
  }

  const { name, pic, futureSlug: slug } = req.user;
  const date = new Date().toJSON();
  db.put({ _id: slug, words, name, pic, date });
  const token = jwt.sign({ slug }, jwtSecret);
  res.status(200).json({ slug, token });
});

app.get("/profile", (req, res) => {
  const randomDocs = shuffle(db.keys())
    .slice(0, 50)
    .map(key => db.findOrFail(key));

  // all of the docs here, without duplicates
  // const docs = latestDocs.concat(randomDocs)
  const docs = randomDocs.filter(
    (doc, _, arr) => arr.find(({ _id }) => _id === doc._id) === doc
  );

  const profiles = docs.map(({ name, pic, words }) => ({ name, pic, words }));
  res.json(profiles);
});

app.get("/profile/:id([-0-9a-z]+)", (req, res) => {
  const profile = db.findOrFail(req.params.id);
  if (profile) {
    const { words, name, pic } = profile;
    res.json({ words, name, pic });
  } else {
    res.status(404).json({ error: "Not found" });
  }
});

module.exports = app;
