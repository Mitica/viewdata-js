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
			set: function(props, index) {
				props = props || {};
				if (utils.isArray(props)) {
					for (var i = 0; i < props.length; i++) {
						viewdata.set(props[i], i);
					}
				} else {
					index = index || 0;
					propList[index] = propList[index] || {};
					for (var prop in props) {
						propList[index][prop] = props[prop];
					}
				}

				return viewdata;
			},
			//change position
			change: function(positionOne, positionTwo) {
				if (utils.isNumber(positionOne) && utils.isNumber(positionTwo)) {
					var one = propList[positionOne];
					propList[positionOne] = propList[positionTwo];
					propList[positionTwo] = one;
				} else {
					throw new Error('positionOne and positionTwo must be numbers!');
				}
				return viewdata;
			}
		};

		return viewdata;
	};
};
