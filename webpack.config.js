const path = require('path')
const webpack = require("webpack");

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: path.resolve(__dirname, './demo/app'),
	devtool: 'source-map',
	output: {
		path: path.resolve(__dirname, './dist'),
		filename: 'app.bundle.js'
	},

	resolve: {
		extensions: ['.ts', '.tsx', '.js', '.jsx']
	},

	module: {
		rules: [{
			test: /\.tsx?$/,
			exclude: /node_modules/,
			loaders: ['ts-loader']
		}]
	},

	plugins: [
		new BrowserSyncPlugin({
			host: 'localhost',
			port: 8080,
			server: {
				baseDir: ['dist']
			}
		})
	]
}