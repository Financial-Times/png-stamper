require('dotenv').load();

console.log(process.env.PORT);

var stamper = require('./lib/stamper');
var express = require('express');
var app = express();

app.use(require('body-parser').json());

app.get('/', function (req, res) {
  res.send('PNG Stamper Service OK!');
});

app.post('/stamp', function(req, res) {
    stamper.stamp(req.body, function(err, buffer) {
        res.header("Content-Type", "image/png");
        res.send(buffer);
    });
});

app.post('/read', function(req, res) {
    stamper.read(req.body, function(err, chunks) {
        res.header("Content-Type", "application/json");
        res.send(chunks);
    });
});

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
