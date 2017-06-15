// See http://brunch.io for documentation.
exports.modules = {
	wrapper: false
}

exports.files = {
	javascripts: {
		joinTo: {
	  		'vendor.js': /^(?!app)/,
	  		'script.js': /^app/
		}
	},
	stylesheets: {joinTo: 'style.css'}
};

exports.plugins = {
	babel: {
		presets: [['env', {
			targets: {
				browsers: ['last 2 versions']
			},
			useBuiltIns: true
		}], 'babili']
	}
};

exports.server = {
	port: 8000
}
