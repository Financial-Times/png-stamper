require('dotenv').load();
var _ = require('underscore');
console.log(process.env.PORT);

var stamper = require('./lib/stamper');
var express = require('express');
var app = express();

app.use(require('body-parser').json({ type: 'application/json' }));
app.use(require('body-parser').raw({ type: 'image/png' }));

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

app.post('/contains/:key/:value', function(req, res) {
    stamper.read(req.body, function(err, chunks) {
        var chunk = {};
            chunk[req.params.key] = req.params.value;
        var contains = _.findWhere(chunks, chunk);

        if (!contains) {
            return res.send({error: "key not matched"});
        }

        res.send(contains);
    });
})

var server = app.listen(process.env.PORT, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});
