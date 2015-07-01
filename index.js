require('env');

var stamper = require('./lib/stamper');
var express = require('express');
var app = express();

app.use(require('body-parser'));

app.get('/', function (req, res) {
  res.send('PNG Stamper Service OK!');
});

app.post('/stamp', function(req, res) {
    res.send(stamper(req.body));
});


var server = app.listen(process.env.port, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
