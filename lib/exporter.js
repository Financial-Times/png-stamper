var moment = require('moment')
    , request = require('request')
    , fs = require('fs')
    , tcf = require('tough-cookie-filestore');

var rootPath = process.env.ROOTPATH
    , uploadPath = '/FT/Graphics/Online/Charts/' + moment().format('YYYY/MM/DD')
    , cookiepath = 'cookies.json';


if (!fs.existsSync(cookiepath)) {
    fs.closeSync(fs.openSync(cookiepath, 'w'));
}

var jar = request.jar(new tcf(cookiepath))
    , request = request.defaults({headers: {'SWTToken': process.env.SWTToken}, jar: jar})
    , retry = 0;


function constructFileName(filename){
    return filename.replace(/\.([^\.]+)/, '-'+moment().unix()+'.$1');
}

function handleResponse(res, data, filename, cb) {

    if (res.statusCode === 401 && ++retry < 3) {
        authenticateAndUpload(data, filename, cb);
    }
    else if (res.statusCode === 200) {
        cb('Upload successful ' + uploadPath + '/' + constructFileName(filename))
    }
    else {
        cb('File upload failed ' + res.body)
    }

}

function authenticateAndUpload(data, filename, cb) {
    request.post(rootPath + '/auth/login', {
        form: {
            username: process.env.METHODEUSERNAME,
            pwd: process.env.METHODEPASSWORD,
            connectionId: process.env.CONNECTIONID
        }
    }, function () {
        uploadToMethode(data, filename, cb);
    })
}

exports.uploadToMethode = uploadToMethode = function uploadToMethode(data, filename, cb) {
    var r = request.post(rootPath + '/object/create', {
        formData: {
            folderPath: uploadPath,
            newObjOption: 3,
            name: constructFileName(filename),
            file: new Buffer(data)
        }
    });

    r.on('error', function(err){
        cb('File upload failed ' + err)
    });

    r.on('response', function(res){
        handleResponse(res, data, filename, cb);
    })
}


