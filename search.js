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
  let str = "";
  const req = http.request(options, (res) => {
    res.on('data', (chunk) => {str += chunk});
    res.on('end', () => {console.log(JSON.parse(str))});
  }).end();
  /*fetch(searchUrl).then((result) => {
    return result.json;
  }).then((json) => {
    console.log(json);
  }).catch(() => {console.log("FAILED!")});*/
}

module.exports = search;
