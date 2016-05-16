var StreamPng = require('streampng');
var expect = require('chai').expect;
var chai = require('chai');
var data = require('./fixtures/pics');
var nock = require("nock");

process.env.METHODE_API_ROOTPATH = 'http://localhost';
var uploader = require('../lib/exporter');


describe("uploader", function() {


    after(function(){
        delete process.env.ROOTPATH;
    });

    var expectations = [
        {statusCode: 200, status: "success", expected: "File successfully uploaded" },
        {statusCode: 400, status: "failure", expected: "File upload failed"}
    ];

    expectations.forEach(function(expectation) {
        it('should return ' +expectation.status +' when api response code is ' + expectation.statusCode , function (done) {
            nock('http://localhost:80')
                .filteringRequestBody(function () {
                    return '*';
                })
                .post('/object/create', '*')
                .reply(expectation.statusCode, '');
            uploader.uploadToMethode(data, 'filename', function (response) {
                expect(response).to.match(new RegExp(expectation.expected));
                done();

            });

        });
    })

    it('should return a failure message on api error', function(done) {
        nock('http://localhost:80')
            .filteringRequestBody(function() {
                return '*';
            })
            .post('/object/create', '*')
            .replyWithError('*');
        uploader.uploadToMethode(data, "filename", function(response) {
            expect(response).to.match(/^File upload failed/);
            done();

        });

    });

    it('should retry 3 times on 401', function(done) {
        nock('http://localhost')
            .filteringRequestBody(function() {
                return '*';
            })
            .post('/object/create', '*')
            .times(3)
            .reply(401);
        uploader.uploadToMethode(data, "filename", function(response) {
            expect(response).to.match(/^File upload failed/);
            done();

        });
    });
});
