const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');
const http = require('http');
const port = process.env.PORT || 8080;
const app = express();
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const apiKey = process.env.APIKEY;
const fetch = require('node-fetch');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Sent index');
    }
  });
});

app.get('/imgsearch', (req, res) => {
  const searchTerm = req.query.search;
  const offset = parseInt(req.query.offset) + 1 || 1;
  const searchUrl = 'https://www.pixabay.com/api/?key=' + apiKey + "&q=" + encodeURIComponent(searchTerm) + "&page=" + offset;

  mongodb.connect(mongoUrl, (err, db) => {
    if (err) throw err;
    const docs = db.collection('urls');
    const record = {
      date: new Date(),
      search: searchTerm
    };
    docs.insert(record, (err, data) => {
      if (err) throw err;
      db.close();
    });
  });

  fetch(searchUrl).then((result) => {
    let str = "";
    let returnVal = [];
    result.body.on('data', (chunk) => {str += chunk});
    result.body.on('end', () => {
      const data = JSON.parse(str);
      for (let x in data.hits) {
        returnVal[x] = {};
        returnVal[x].pageURL = data.hits[x].pageUrl;
        returnVal[x].tags = data.hits[x].tags;
        returnVal[x].user = data.hits[x].user;
      };
    });
    console.log(returnVal);
    res.json(returnVal);
  }).catch((err) => {console.log("FAILED! " + err)});
});


app.listen(port, () => {
  console.log("server listening on " + port);
});
