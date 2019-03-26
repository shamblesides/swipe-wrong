const { MongoClient } = require('mongodb');

const url = process.env.APP_MONGO_URL || 'mongodb://localhost:27017';

let _db = null;

MongoClient.connect(url, {useNewUrlParser:true}, (err, client) => {
    if (err) {
        console.error(`Could not connect to ${url}: ${err}`)
        return process.exit(1);
    }
    _db = client.db('swipe-wrong')
})

module.exports = async function db() {
    while (1) {
        if (_db) return _db;
        await new Promise(res => setTimeout(() => res(), 100));
    }
}
