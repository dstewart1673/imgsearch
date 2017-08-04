const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const fetch = require('node-fetch');
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const apiKey = process.env.APIKEY;
const baseURL = "https://pixabay.com/api/?key=" + apiKey + "&q=";

function search(searchTerm, offset) {
  const searchUrl = baseURL + encodeURIComponent(searchTerm);
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
  fetch(searchUrl).then((result) => {
    return JSON.stringify(result.splice(10 * offset, 10 * (offset + 1)));
  });
}

module.exports = search;
