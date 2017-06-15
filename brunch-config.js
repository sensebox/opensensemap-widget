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
	jscc: {
      	values: {
        	_ADDRESS: 'http://localhost:8000/'
    	}
    },
	babel: {
		presets: [['env', {
			targets: {
				browsers: ['last 2 versions']
			},
			useBuiltIns: true
		}]]
	}
};

exports.server = {
	port: 8000
}

exports.overrides = {
  production: {
    plugins: {
    	jscc: {
    		values: {
    			_ADDRESS: 'https://sensebox.de/opensensemap-widget/'
    		}
    	},
    	babel: {
    		presets: [['env', {
    			targets: {
    				browsers: ['last 2 versions']
    			},
    			useBuiltIns: true
    		}], 'babili']
    	}
    }
  }
}

