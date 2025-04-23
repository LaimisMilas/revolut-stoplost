const path = require('path');

module.exports = {
    entry: {
        revolut: './src/index.js',
        revolut_tab: './web/index.js',
        revolut_login: './login/index.js',
    },
    output: {
        path: path.resolve(__dirname, './package'),
        filename: '[name].click.js',
    },
    mode: 'development', // arba 'production' development
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                },
            }, 
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }
        ],
    },
    resolve: {
        extensions: ['.js', '.jsx', '.css'],
    },
};

