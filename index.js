const express = require('express');
const app = express();
const path = require('path');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');

app.listen(port, () => console.log(`listening on port ${port}!`));
app.use(express.static(__dirname + '/css'));
app.use(express.static(__dirname + '/js'));


app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname + '/index.html'));
});
