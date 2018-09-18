// Core imports

const http = require('http')

// Library imports

const cheerio = require('cheerio')

// Constants

const recentSearchesURL = 'http://trove.nla.gov.au/recentSearches'

// Make HTTP request

const makeRequest = (url) => new Promise(function(resolve, reject) {
	http.get(url, function(res) {
		var data = ''

		res.on('data', function(chunk) {
			data += chunk
		})

		res.on('end', function() {
			return resolve(data)
		})

		res.on('error', function(err) {
			return reject(err)
		})
	})
})

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
