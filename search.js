const express = require('express');
const http = require('http');
const router = express.Router();
const mongodb = require('mongodb');
const fetch = require('node-fetch');
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const apiKey = process.env.APIKEY;

function search(searchTerm, offset) {

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
    })

  });
  const options = {
    hostname: 'www.pixabay.com',
    path: '/api/?key=' + apiKey + "&q=" + encodeURIComponent(searchTerm)
  };
  const req = http.request(options, (res) => {
    console.log(res.body.hits);
  });
  req.on('error', (e) => {
    console.error(`problem with request: ${e.message}`);
  });
  req.end();
  /*fetch(searchUrl).then((result) => {
    return result.json;
  }).then((json) => {
    console.log(json);
  }).catch(() => {console.log("FAILED!")});*/
}

module.exports = search;
