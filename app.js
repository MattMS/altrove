// Library imports

const express = require('express')
const makeDatastore = require('@google-cloud/datastore')
// const {map} = require('ramda')

// Local imports

const downloadRecentSearches = require('./recent')
const getRandomPictures = require('./random_pictures')

// Helper functions

const addKeyToResult = data => ({
	data,
	key: datastore.key('Search')
})

const map = f => arr => arr.map(f)

const ensureResults = results => (0 < results.length ? results : Promise.reject('No results'))

// Setup server

const app = express()

const datastore = makeDatastore()

app.set('view engine', 'pug')

app.use('/scripts', express.static('src/scripts'))
app.use('/static', express.static('public'))

app.get('/', function(req, res) {
	res.render('index')
})

/*
Receives GET request with `query` parameter.
For example: `/autocomplete?query=test`

Returns JSON with `results` Array of Strings.
For example: `{"results": ["test 123", "test abc"]}`
*/
app.get('/autocomplete', function(req, res) {
	// TODO: Implement search
	res.json({results: [req.query.query]})
})

app.get('/random/pictures.json', getRandomPictures)

app.get('/update-recent-searches', function(req, res) {
	downloadRecentSearches()
	.then(ensureResults)
	.then(map(addKeyToResult))
	.then(datastore.save)
	.then(result => res.status(200).send('Done'))
	.catch(function(err) {
		console.error(err)
		res.status(500).send('Server error').end()
	})
})

// Start server

const PORT = process.env.PORT || 8080

if (module === require.main) {
	app.listen(PORT, function() {
		console.log(`App listening on port ${PORT}.`)
	})
}

module.exports = app
