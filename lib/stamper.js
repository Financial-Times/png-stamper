var extract = require('png-chunks-extract');
var encode = require('png-chunks-encode');
var text = require('png-chunk-text');


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
    stamp: function(data, cb) {
        var chunks = extract(new Buffer(data.file, 'base64'));

        Object.keys(data.stamp).map(function(keyword) {
            chunks.splice(-1, 0, text.encode(keyword, data.stamp[keyword]))
        });

        cb(null, new Buffer(encode(chunks)));

    },

    read : function(data, cb){

        var chunks = [];

        data = extract(data).filter(function (chunk) {
            return chunk.name === 'tEXt'
        });

        data.map(function (chunk) {
            var c = {};
            var d = text.decode(chunk.data);
            c[d.keyword] = d.text
            chunks.push(c);
        });

        cb(null, chunks);
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
