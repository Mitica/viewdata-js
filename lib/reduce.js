'use strict';

var debug = require('debug')('viewdata:reduce');
var utils = require('./utils');
var async = require('async');

module.exports = function reduce(locals, repository, propList, callback) {
	function reduceProps(props, cbProps) {
		function processProperty(prop, cb) {
			var property = props[prop];
			if (property === false || property.load === false) {
				return cb(null);
			}
			var name = property.source || prop;
			var params = property.params;
			if (utils.isFunction(params)) {
				params = params.call(null, locals);
			}

			repository.get(name, locals, params, function(error, propData) {
				if (error) {
					if (property.required === false) {
						debug('pass unrequired property %s', prop);
						error = null;
					}
					return cb(error);
				}
				if (~[undefined, null].indexOf(propData) && property.required === true) {
					return cb(new Error('Property `' + name + '` is required'));
				}
				debug('got property %s', name);
				locals[prop] = propData;
				cb(null);
			});
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
