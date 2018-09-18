const https = require('https')

module.exports = (url) => new Promise(function(resolve, reject) {
	https.get(url, function(res) {
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
