const express = require('express');
const http = require('http');
const router = express.Router();
const mongodb = require('mongodb');
const fetch = require('node-fetch');
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const apiKey = process.env.APIKEY;

function search(searchTerm, offset) {
  const searchUrl = 'https://www.pixabay.com/api/?key=' + apiKey + "&q=" + encodeURIComponent(searchTerm) + "&page=" + offset;
  let returnVal = [];
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
  /*const options = {
    hostname: 'www.pixabay.com',
    path: '/api/?key=' + apiKey + "&q=" + encodeURIComponent(searchTerm)
  };
  let str = "";
  const req = http.request(options, (res) => {
    res.on('data', (chunk) => {str += chunk});
    res.on('end', () => {console.log(str)});
  }).end();*/
  fetch(searchUrl).then((result) => {
    let str = "";
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
  }).catch((err) => {console.log("FAILED! " + err)});
  console.log(returnVal);
  return returnVal;
}

module.exports = search;
