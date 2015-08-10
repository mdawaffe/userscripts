var path = require( 'path' );

var webpack = require( 'webpack' );

module.exports = {
	name: 'main',
	devtool: 'source-map',
	entry: [
		'./index'
	],
	output: {
		path: path.join( __dirname, 'build' ),
		filename: 'app.js',
		publicPath: '/build/',
	},
	plugins: [
		new webpack.NoErrorsPlugin()
	],
	resolve: {
		extensions: ['', '.js']
	},
	module: {
		loaders: [{
			test: /\.js$/,
			loaders: [ 'babel' ],
			exclude: /node_modules/
		}, {
			test: /\.css$/,
			loaders: [ 'style', 'css' ]
		}, {
			test: /\.png$/,
			loader: "url-loader?limit=1000"
		}]
	}
};
