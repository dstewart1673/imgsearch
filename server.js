const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');
const search = require('./search');
const port = process.env.PORT || 8080;
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

app.get('/imgsearch', (req, res) => {
  const searchTerm = req.params.search;
  const offset = req.params.offset || 0;
  res.send(search(searchTerm, offset));
}));
