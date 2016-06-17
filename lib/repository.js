'use strict';

var debug = require('debug')('viewdata:repository');

var utils = require('./utils');

function loadFunction(method, container, name) {
	if (!name) {
		throw new Error('name must be defined');
	}
	debug('set repository method %s', name);
	container[name] = method;
}

function loadSegment(segment, container, name) {
	if (utils.isFunction(segment)) {
		loadFunction(segment, container, name);
	} else if (utils.isObject(segment)) {
		for (var method in segment) {
			if (utils.isFunction(segment[method])) {
				loadFunction(segment[method], container, method);
			}
		}
	} else {
		throw new Error('Segment must be an object');
	}
}

function loadSet(set, container, fileName) {
	if (utils.isArray(set)) {
		set.forEach(function(segment) {
			loadSegment(segment, container, fileName);
		});
	}
	loadSegment(set, container, fileName);
}

function loadFiles(pattern, container) {
	var glob = require('glob');
	var path = require('path');

	var files = glob.sync(pattern) || [];

	files.forEach(function(file) {
		debug('loading file %s', file);
		var name = path.basename(file);
		name = name.substr(0, name.lastIndexOf('.') || name.length);
		loadSet(require(file), container, name);
	});
}

module.exports = function create(sources) {
	var container = {};

	sources = utils.isArray(sources) ? sources : [sources];

	sources.forEach(function(source) {
		if (utils.isString(source)) {
			loadFiles(source, container);
		} else {
			loadSet(source, container);
		}
	});

	return {
		methods: function() {
			return Object.keys(container);
		},
		hasMethod: function(name) {
			return !!container[name];
		},
		get: function(name, params, callback) {
			if (!container[name]) {
				throw new Error('repository doesn`t contain method `' + name + '`');
			}
			var resolved = false;

			function callCb(error, result) {
				if (!resolved) {
					resolved = true;
					callback(error, result);
				}
			}

			var propResult = container[name].call(null, params, function(error, propData) {
				if (error) {
					return callCb(error);
				}
				callCb(null, propData);
			});

			if (!utils.isUndefined(propResult)) {
				// is Promise
				if (utils.isFunction(propResult.then)) {
					propResult.then(function(propData) {
						callCb(null, propData);
					}, callCb);
				} else {
					callCb(null, propResult);
				}
			}
		}
	};
};
