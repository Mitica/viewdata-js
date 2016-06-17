'use strict';

var utils = require('./utils');
var reduce = require('./reduce');

module.exports = function viewdataFactory(repository) {

	return function(propList) {
		propList = propList || {};
		propList = utils.isArray(propList) ? propList : [propList];

		var viewdata = {
			get: function(callback) {
				if (!utils.isFunction(callback)) {
					throw new Error('Param `callback` is required');
				}

				return reduce(repository, propList, callback);
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
