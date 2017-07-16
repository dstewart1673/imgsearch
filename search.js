const express = require('express');
const router = express.Router();
const mongodb = require('mongodb');
const fetch = require('node-fetch');
const MongoClient = mongodb.MongoClient;
const mongoUrl = process.env.MONGOLAB_URI;
const apiKey = process.env.APIKEY;
const baseURL = "https://pixabay.com/api/?key=" + apiKey + "&q=";

function search(searchTerm) {
  const searchUrl = baseURL + encodeURIComponent(searchTerm);
  mongodb.connect(url, (err, db) => {
    if (err) throw err;
    const docs = db.collection('urls');
    
  });
  fetch(url).then((result) => {
    res.send(JSON.stringify(result));
  })
}

router.get('/:query', (req, res) => {



})
