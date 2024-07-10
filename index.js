const express = require('express');
const { MongoClient } = require('mongodb');
const shortid = require('shortid');
const app = express();
const port = 3000;
const uri = 'your_mongodb_uri';

app.use(express.json());

let db;
MongoClient.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(client => {
    db = client.db('urlshortener');
    console.log('Connected to Database');
  })
  .catch(error => console.error(error));

app.post('/shorten', async (req, res) => {
  const { originalUrl } = req.body;
  const shortUrl = shortid.generate();
  await db.collection('urls').insertOne({ originalUrl, shortUrl });
  res.json({ originalUrl, shortUrl });
});

app.get('/:shortUrl', async (req, res) => {
  const { shortUrl } = req.params;
  const url = await db.collection('urls').findOne({ shortUrl });
  if (url) {
    res.redirect(url.originalUrl);
  } else {
    res.status(404).send('URL not found');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
