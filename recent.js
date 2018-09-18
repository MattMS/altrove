// Core imports

const http = require('http')

// Library imports

const cheerio = require('cheerio')
const makeDatastore = require('@google-cloud/datastore')

// Local imports

const makeRequest = require('./make_request')

// Constants

const datastore = makeDatastore()

const recentSearchesURL = 'http://trove.nla.gov.au/recentSearches'

// Parse HTML and create JSON object

function saveSearches(html) {
	const $ = cheerio.load(html)
	var results = []

	$('#static > table tr').each(function(index, element) {
		const $tr = cheerio.load(this)
		var text = $tr('a').text()
		var time = $tr(this)('td').first().text()

		if (time != '' && text != '') {
			results.push({
				data: {text, time},
				key: datastore.key('Search')
			})
		}
	})

	return datastore.upsert(results)
}

// Exports

module.exports = () =>
	makeRequest(recentSearchesURL)
	.then(saveSearches)
