'use strict';

// var debug = require('debug')('viewdata:reduce');
var utils = require('./utils');
var async = require('async');

module.exports = function reduce(repository, propList, callback) {

	var locals = {};

	function reduceProps(props, cbProps) {
		function processProperty(prop, cb) {
			var property = props[prop];
			if (property === false || property.load === false) {
				return cb(null);
			}
			var name = property.source || prop;
			var opts = property.options;
			if (utils.isFunction(opts)) {
				opts = opts(locals);
			}

			var propResult = repository.get(name, opts, function(error, propData) {
				if (error) {
					return cb(error);
				}
				locals[prop] = propData;
				cb(null);
			});

			if (!utils.isUndefined(propResult)) {
				// is Promise
				if (utils.isFunction(propResult.then)) {
					propResult.then(function(propData) {
						locals[prop] = propData;
						cb(null);
					}, cb);
				} else {
					locals[prop] = propResult;
					cb(null);
				}
			}
		}

		async.parallel(Object.keys(props)
			.map(function(prop) {
				return processProperty.bind(null, prop);
			}), cbProps);
	}

	var series = propList.map(function(props) {
		return reduceProps.bind(null, props);
	});

	async.series(series, function(error) {
		if (error) {
			return callback(error);
		}
		callback(null, locals);
	});
};
