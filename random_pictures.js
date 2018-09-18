// Core imports

const querystring = require('querystring')
const url = require('url')

// Local imports

const make_request = require('./make_request')

// Constants

const trove_api = 'http://api.trove.nla.gov.au/'

// Helper functions

const get_start = (count, total) => parseInt(Math.random() * (total - count))

function get_trove_url (args, n, s) {
	if (!s) s = 1

	args['encoding'] = 'json'
	args['n'] = n
	args['q'] = ' '
	args['s'] = s

	return trove_api + 'result?' + querystring.stringify(args)
}

const get_work_count = (args) =>
	make_request(get_trove_url(args, 1))
	.then(JSON.parse)
	.then(obj => obj.response.zone[0].records.total)

const trove_search = (args, count) =>
	get_work_count(args)
	.then(total => get_trove_url(args, count, get_start(count, total))
	.then(make_request)
	.then(JSON.parse)

// Exports

module.exports = function(req, res, next) {
	var query = url.parse(req.url, true).query

	var args = {
		key: process.env.TROVE_KEY,
		'l-availability': 'y/f',
		'l-format': 'Photograph',
		zone: 'picture'
	}

	var count = parseInt(query.count)
	count = (!count || count < 1) ? 10 : Math.min(count, 100)

	var fixed_works = []

	function get_random_works(count) {
		trove_search(args, count)
		.then(function (obj) {
			var works = obj.response.zone[0].records.work
			var ids
			var sent = false

			works.forEach(function (work) {
				if (!sent) {
					ids = work.identifier
					if (ids && ids.length > 1 && ids[1].linktype == 'thumbnail') {
						fixed_works.push({
							i: ids[1].value,
							l: work.troveUrl,
							//t: work.title,
						})
					}

					if (fixed_works.length >= count) {
						sent = true
						res.send({
							image: fixed_works
						})
						next()
					}
				}
			})

			if (fixed_works.length < count) {
				get_random_works(count - fixed_works.length + 1)
				//args['n'] = works[works.length - 1].id
				//trove_search.get_works(args, count, function (err, obj) {
			}
		})
		.catch(err => next(err))
	}

	get_random_works(count)
}
