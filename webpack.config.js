'use strict'
const path = require('path');
const fs = require('fs');
const TARGET = process.env.npm_lifecycle_event;

let webpackConfig= {
    entry: {
        controller : './src/client/controller.tsx',
        music : './src/client/music.tsx'
    },
    output: {
        path: path.resolve(__dirname, `./dist/client/js`),
        filename: '[name].js',
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"]
    },
    devServer : {
        port : 8080,
    },
    module: {
        rules: [{
            test: /\.(ts|tsx)?$/,
            use:[{
                loader: 'ts-loader',
                options: {
                    configFile : "tsconfigForFrontEnd.json"
                }
            }],
            exclude: /node_modules/
        }]
    }
};
  
module.exports = webpackConfig


// for(let fileData of fs.readdirSync(`./src/client`, {withFileTypes : true})){
//     webpackConfig.entry[fileData.name.slice(0,-4)] = `./src/client/${fileData.name}`
// }

// const AddEntry = (src) =>{
//     for (let fileData of fs.readdirSync(src, {withFileTypes : true})){
//         if (fileData.isDirectory()){
//             AddEntry(src + `/${fileData.name}`)
//         }else if(fileData.isFile()){
//             webpackConfig.entry[fileData.name.slice(0,-4)] = src + `/${fileData.name}`
//         }
//     }
// }