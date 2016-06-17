'use strict';

exports.noop = function() {};

var is = exports.is = function(obj, type, throwname, cb) {
	if (typeof obj !== type) {
		if (throwname) {
			var error = new Error('Param `' + throwname + '` must be a ' + type);
			if (cb) {
				return cb(error);
			}
			throw error;
		} else {
			return false;
		}
	}
	return true;
};

// exports.isString = function(obj, throwname, cb) {
// 	return is(obj, 'string', throwname, cb);
// };

exports.isObject = function(obj, throwname, cb) {
	return is(obj, 'object', throwname, cb);
};

exports.isUndefined = function(obj, throwname, cb) {
	return is(obj, 'undefined', throwname, cb);
};

exports.isString = function(obj, throwname, cb) {
	return is(obj, 'string', throwname, cb);
};

// exports.isNumber = function(obj, throwname, cb) {
// 	return is(obj, 'number', throwname, cb);
// };

exports.isFunction = function(obj, throwname, cb) {
	return is(obj, 'function', throwname, cb);
};

exports.isArray = Array.isArray;

exports.assign = function(target, source) {
	target = target || {};

	for (var prop in source) {
		target[prop] = source[prop];
	}

	return target;
};
