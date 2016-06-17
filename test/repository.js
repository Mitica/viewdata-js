'use strict';

var repository = require('../lib/repository');
var assert = require('assert');
var path = require('path');

describe('repository', function() {
	it('should load an object', function(done) {
		var rep = repository({
			one: function() {
				return 1;
			}
		});
		assert.equal('function', typeof rep.get);
		rep.get('one', {}, null, function(error, result) {
			assert.equal(1, result);
			done(error);
		});
	});

	it('should load a file', function(done) {
		var rep = repository(path.join(__dirname, '/repository/getName.js'));
		assert.equal('function', typeof rep.get);
		rep.get('getName', {}, null, function(error, result) {
			assert.equal('name', result);
			done(error);
		});
	});

	it('should load files', function() {
		var rep = repository(path.join(__dirname, '/repository/*.js'));
		assert.equal(true, rep.hasMethod('getName'));
		assert.equal(true, rep.hasMethod('place'));
		assert.equal(true, rep.hasMethod('country'));
	});
});
