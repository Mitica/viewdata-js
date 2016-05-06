'use strict';

var utils = require('./utils');
var async = require('async');

module.exports = function viewdataFactory(repository) {

	if (!repository) {
		throw new Error('Param `repository` is required', repository);
	}

	var factory = function(props, viewdata, callback) {
		if (utils.isFunction(viewdata)) {
			callback = viewdata;
			viewdata = {};
		} else {
			if (!utils.isFunction(callback)) {
				throw new Error('Param `callback` is required');
			}

			if (!utils.isObject(viewdata)) {
				return callback(new Error('Param `viewdata` must be an object'));
			}
		}
		if (!utils.isObject(props)) {
			return callback(new Error('Param `props` must be an object'));
		}

		function processProperty(data, prop, cb) {
			var property = props[prop];
			if (property === false || property.load === false) {
				return cb(null, data);
			}
			var name = property.source || prop;
			var opts = property.options;
			if (utils.isFunction(opts)) {
				opts = opts(data);
			}

			if (!utils.isFunction(repository[name])) {
				return cb(new Error('Repository does not contain method `' + name + '`'));
			}

			var propResult = repository[name].call(repository, opts, data, function(error, propData) {
				if (error) {
					return cb(error);
				}
				data[prop] = propData;
				cb(null, data);
			});

			if (!utils.isUndefined(propResult)) {
				if (utils.isFunction(propResult.then)) {
					propResult.then(function(propData) {
						data[prop] = propData;
						cb(null, data);
					}, cb);
				} else {
					data[prop] = propResult;
					cb(null, data);
				}
			}
		}

		async.reduce(Object.keys(props), viewdata, processProperty, callback);
	};

	return factory;

};
