const fs = require('fs')

const sass = require('node-sass')

const outFile = 'public/main.css'

sass.render({
	file: 'src/styles/scss/main.scss',
	outFile
}, function(err, result) {
	if (err) console.error(err)
	else {
		fs.writeFile(outFile, result.css, function(err) {
			if (err) console.error(err)
			else console.log('Done')
		})
	}
})
