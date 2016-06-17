'use strict';

var repository = require('../lib/repository');
var assert = require('assert');
var path = require('path');

describe('repository', function() {
	it('should load an object', function() {
		var rep = repository({
			one: function() {
				return 1;
			},
			two: function() {
				return 2;
			}
		});
		assert.equal('function', typeof rep.get);
		assert.equal(1, rep.get('one'));
		assert.equal(2, rep.get('two'));
	});

	it('should load a file', function() {
		var rep = repository(path.join(__dirname, '/repository/getName.js'));
		assert.equal('function', typeof rep.get);
		assert.equal('name', rep.get('getName'));
	});

	it('should load files', function() {
		var rep = repository(path.join(__dirname, '/repository/*.js'));
		assert.equal(true, rep.hasMethod('getName'));
		assert.equal(true, rep.hasMethod('place'));
		assert.equal(true, rep.hasMethod('country'));
	});
});
