const express = require('express');
const mongodb = require('mongodb');
const fs = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;
const app = express();
const search = require('./search');

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
  const offset = req.query.offset || 0;
  const results = search(searchTerm, offset);
  console.log(results);
  res.json(results);
});


app.listen(port, () => {
  console.log("server listening on " + port);
});
