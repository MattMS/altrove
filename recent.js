// Core imports

const http = require('http')

// Library imports

const cheerio = require('cheerio')

// Local imports

const makeRequest = require('./make_request')

// Constants

const recentSearchesURL = 'https://trove.nla.gov.au/recentSearches'

// Parse HTML and create JSON object

function saveSearches(html) {
	const $ = cheerio.load(html)
	var results = []

	$('#static > table tr').each(function(index, element) {
		const $tr = cheerio.load(this)
		var text = $tr('a').text().trim()
		var time = $tr('td').first().text().trim()

		if (time != '' && text != '') {
			results.push({text, time})
		}
	})

	return results
}

// Exports

module.exports = () =>
	makeRequest(recentSearchesURL)
	.then(saveSearches)
