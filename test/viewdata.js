'use strict';

var assert = require('assert');
var viewdata = require('../lib/viewdata');
var Promise = require('bluebird');

function syncFn(result) {
	return function() {
		return result;
	};
}

function asyncFn(result) {
	return function() {
		var cb = arguments[arguments.length - 1];
		cb(null, result);
	};
}

function promiseFn(result) {
	return function() {
		return new Promise(function(resolve) {
			resolve(result);
		});
	};
}

describe('viewdata factory', function() {
	it('should throw an exception', function() {
		assert.throws(function() {
			viewdata();
			// done();
		});
	});

	it('should work with sync methods', function(done) {
		var container = viewdata({
			one: syncFn(1)
		});
		container({ one: true }, {}, function(error, vd) {
			assert.equal(vd.one, 1);
			done(error);
		});
	});

	it('should work with async methods', function(done) {
		var container = viewdata({
			one: asyncFn(1)
		});
		container({ one: true }, {}, function(error, vd) {
			assert.equal(vd.one, 1);
			done(error);
		});
	});

	it('should work with Promises', function(done) {
		var container = viewdata({
			one: promiseFn(1)
		});
		container({ one: true }, {}, function(error, vd) {
			assert.equal(vd.one, 1);
			done(error);
		});
	});

	it('should work with Promise, async & sync methods', function(done) {
		var container = viewdata({
			syncData: syncFn(1),
			asyncData: asyncFn(2),
			promiseData: promiseFn(3)
		});
		container({ syncData: true, asyncData: true, promiseData: {} }, { init: 100 },
			function(error, vd) {
				assert.equal(vd.syncData, 1);
				assert.equal(vd.asyncData, 2);
				assert.equal(vd.promiseData, 3);
				assert.equal(vd.init, 100);
				done(error);
			});
	});
});