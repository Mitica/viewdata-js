'use strict';

var repository = require('./repository');
var viewdata = require('./viewdata');

module.exports = function viewdataFactory(sources) {

	if (!sources) {
		throw new Error('Param `sources` is required');
	}

	var rep = repository(sources);

	return viewdata(rep);
};
