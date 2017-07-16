const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');
const search = require('./search');
const port = process.env.PORT || 8080;
const MongoClient = mongodb.MongoClient;
const url = process.env.MONGOLAB_URI;
const app = express();

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'), (err) => {
    if (err) {
      throw err;
    } else {
      console.log('Sent index');
    }
  });
});

app.get('/imgsearch/:query', (req, res) => {
  const searchTerm = req.params.query;
  res.send(search(searchTerm));
}));
