var StreamPng = require('streamPng')
var stamper = require('../lib/stamper');
var expect = require('chai').expect;
var data = require('./fixtures/pics');
var _ = require('underscore');


describe("stamper", function() {
    it('stamps the png with the correct information', function(done) {
        stamper.stamp(data, function(err, buffer) {
            expect(err).to.be.null;
            var stampProps = Object.keys(data.stamp).map(function(k) {
                var o = {};
                o[k] = data.stamp[k];
                return o;
            });
            stamper.read(buffer, function(err, chunks) {
                expect(err).to.be.null;
                for (var i = 0; i < stampProps.length; i++) {
                    expect(_.findWhere(chunks, stampProps[i])).to.be.truthy;
                }
                done();
            })
        })
    });
});
