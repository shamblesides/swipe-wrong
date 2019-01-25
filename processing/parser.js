const fs = require('fs');
const { Transform, Writable } = require('stream');
const parse = require('csv-parse');

// const freq = new Map();

process.stdin
  .pipe(parse({ columns: true }))
  .pipe(new Transform({
    objectMode: true,
    transform(row, _, callback) {
      for (let i = 0; i <= 9; ++i) {
        const key = 'essay'+i;
        const words = (row[key] || '')
          .replace(/<[^<>]+>/g, ' ')
          .replace(/&amp;/g, '&')
          .replace(/&gt;/g, '>')
          .replace(/&lt;/g, '<')
          .replace(/&mdash;/g, '-')
          .match(/[a-z0-9'\-&]+/ig)
          // .trim();
        if (words && words.length > 0) this.push(words);
      }
      callback();
    }
  }))
  .pipe(new Transform({
    objectMode: true,
    transform(words, _, callback) {
      // words.forEach(word => this.push(word));
      for (const length of [1,2,3,4]) {
        for (let i = 0; i <= words.length - length; ++i) {
          this.push(words.slice(i, i+length).join(' ')+'\n');
        }
      }
      callback();
    }
  }))
  // .pipe(new Writable({
  //   objectMode: true,
  //   write(word, _, callback) {
  //     if (!freq.has(word)) freq.set(word, 1);
  //     else (freq.set(word, freq.get(word) + 1));
  //     // console.log(word);
  //     callback();
  //   }
  // }))
  // .on('finish', () => {
  //   freq.forEach((count, word) => count > 50 && console.log(`${count} ${word}`));
  // });
  // .pipe(new Writable({
  //   objectMode: true,
  //   write(word, _, callback) {
  //     console.log(word);
  //     callback();
  //   }
  // }))
  .pipe(process.stdout);
