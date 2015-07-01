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
module.exports = function(data) {
    var inStream = Base64Decode(data.file);
    var outStream = fs.createWriteStream(data.filename);
    var png = StreamPng(inStream);

    // apply the chunks
    Object.keys(data.stamp)
        .map(function(keyword) {
            return StreamPng.Chunk.tEXt({
                keyword: keyword,
                text: data.stamp[keyword]
            });
        })
        .map(png.inject);

    // pipe the output to the outStream
    png.out().pipe(outStream);

    // return the pipe
    return outStream;
}


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
