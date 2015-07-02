var StreamPng = require('streampng');
var Base64Decode = require('base64-stream').decode;
var fs = require('fs');


/*
data is an object like:
 {
    file: <base64 encoded png image data>,
    stamp: {
        author: 'blah',
        program: 'blah'
    }
 }
*/
module.exports = {
    stamp : function(data, callback) {
        var b = new Buffer(data.file, 'base64');
        var png = StreamPng(b);
        // apply the chunks
        var chunks = Object.keys(data.stamp)
            .map(function(keyword) {
                return StreamPng.Chunk.tEXt({
                    keyword: keyword,
                    text: data.stamp[keyword]
                });
            })

        chunks.map(function(chunk) {
            png.inject(chunk);
        });

        png.out(function(error, buffer) {
            callback(error, buffer);
        });

    },

    read : function(data, cb) {
        var chunks = [];
        var png = StreamPng(data);

        png.on('tEXt', function(chunk) {
            var c = {};
            c[chunk.keyword] = chunk.text;
            chunks.push(c);
        })

        png.on('end', function() {
            cb(null, chunks);
        });
    }
};


/*{
    "Author":	"user@ft.com"
    "Description":  image.title
    "Copyright":	"2015 financial times ltd"
    "Creation Time":	new Date().toISOString()
    "Software": "Microsoft Excel 97"
    "Disclaimer":	""
    "Warning": ""
    "Source":	""
    "Comment": ""
}*/
