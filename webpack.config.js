const HtmlWebpackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin")
const TerserPlugin = require("terser-webpack-plugin")
const path = require("path")

module.exports = {
	entry: "./src/index.ts",
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: "ts-loader",
				exclude: /node_modules/,
			},
			{ test: /\.css$/, use: [MiniCssExtractPlugin.loader, "css-loader"] },
			{ test: /\.pug$/, loader: "pug-loader" },
			{
				test: /\.svg$/,
				use: "raw-loader",
			},
		],
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"],
	},
	output: {
		path: path.join(__dirname, "dist"),
		publicPath: "",
		filename: "bundle.js",
	},
	mode: "production",
	plugins: [
		new HtmlWebpackPlugin({
			inject: false,
			cache: false,
			template: "src/template.pug",
			filename: "../public/index.html",
			// favicon: "favicon.ico",
			title: "values-common",
		}),
		new MiniCssExtractPlugin({ filename: "css/style.css" }),
	],
	optimization: {
		minimize: true,
		minimizer: [new CssMinimizerPlugin(), new TerserPlugin()],
	},
}
