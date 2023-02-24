const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        arches: './arches/arches.js',
        island: './island/island.js',
        canyon: './canyon/canyon.js',
        city: './city/city.js',
        yggdrasil: './yggdrasil/yggdrasil.js',
        ginnungagap: './ginnungagap/ginnungagap.js',
        tutorial: './tutorial/tutorial.js'
    },
    plugins: [
        new CleanWebpackPlugin(),
    ],
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    },
    mode: 'production',
    devtool: 'source-map',
    module: {
        rules: [
            {
                test: /\.glsl$/,
                use: [
                    {loader: 'webpack-glsl-loader'},
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 4096
                        }
                    }
                ]
            }
        ]
    }
};
