'use strict';

var utils = require('./utils');
var reduce = require('./reduce');

module.exports = function viewdataFactory(repository) {

	return function(propList) {
		propList = propList || {};
		propList = utils.isArray(propList) ? propList : [propList];

		var viewdata = {
			get: function(locals, callback) {
				if (utils.isFunction(locals)) {
					callback = locals;
					locals = {};
				} else if (!utils.isFunction(callback)) {
					throw new Error('Param `callback` is required');
				}

				locals = locals || {};

				return reduce(locals, repository, propList, callback);
			},
			set: function(newProps, index) {
				newProps = newProps || {};
				if (utils.isArray(newProps)) {
					for (var i = 0; i < newProps.length; i++) {
						viewdata.set(newProps[i], i);
					}
				} else {
					index = index || 0;
					propList[index] = propList[index] || {};
					for (var prop in newProps) {
						propList[index][prop] = newProps[prop];
					}
				}

				return viewdata;
			}
		};

		return viewdata;
	};
};
