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
    res.pipe(stamper.stamp(req.body));
});

app.post('/read', function(req, res) {
    /*res.send(stamper.read(req.))*/
})

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
