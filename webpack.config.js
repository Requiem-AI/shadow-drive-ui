const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const DefinePlugin = require('webpack/lib/DefinePlugin');
const {VueLoaderPlugin} = require("vue-loader");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	mode: 'development',
	target: "web",
	entry: './src/main.js',
	devServer: {
		static: './dist',
		hot: true,
	},
	plugins: [
		new NodePolyfillPlugin(),
		new VueLoaderPlugin(),
		new HtmlWebpackPlugin({
			title: 'Hot Module Replacement',
			template: './public/index.html',
		}),
		new DefinePlugin({
			'process.env': {}
		}),
		new CopyPlugin({
			patterns: [
				{ from: path.resolve(__dirname, 'src/assets'), to: path.resolve(__dirname, 'dist/assets') },
			],
		})
	],
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
	output: {
		path: path.resolve(__dirname, 'dist'),
	},
	module: {
		rules: [
			{
				test: /\.vue$/,
				loader: "vue-loader",
			},
			{ test: /\.css$/, exclude: /node_modules/, use: ['vue-style-loader', 'css-loader']},
			{
				test: /\.scss$/,
				use: [
					'vue-style-loader',
					'css-loader',
					'sass-loader'
				]
			},
		],
	},
	resolve: {
		alias: {
			vue$: "vue/dist/vue.runtime.esm.js",
		},
		extensions: ["*", ".js", ".vue", ".json"],
		fallback: {
			"fs": false,
		}
	},
};
