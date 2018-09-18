// Core imports

const http = require('http')

// Library imports

const cheerio = require('cheerio')

// Local imports

const makeRequest = require('./make_request')

// Constants

const recentSearchesURL = 'http://trove.nla.gov.au/recentSearches'

// Parse HTML and create JSON object

const processResults = (html) => new Promise(function(resolve, reject) {
	const $ = cheerio.load(html)
	var obj = {}

	$('#static > table tr').each(function(index, element) {
		const $tr = cheerio.load(this)
		var text = $tr('a').text()
		var time = $tr(this)('td').first().text()

		if (time != '' && text != '') {
			if (obj[text]) {
				obj[text].push(time)
			} else {
				obj[text] = [time]
			}
		}
	})

	resolve(obj)
})

// Exports

module.exports = () => makeRequest(recentSearchesURL).then(processResults)
