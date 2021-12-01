// const { when, whenDev, whenProd, whenTest, ESLINT_MODES, POSTCSS_MODES, } = require("@craco/craco");
const path = require("path");
const fs = require('fs');
const configPaths = (pathString) => {
    let file = fs.readFileSync(pathString, { encoding: 'utf-8' });
    file = JSON.parse(file);
    const baseUrl = file.compilerOptions.baseUrl;
    const paths = file.compilerOptions.paths;
    const alias = Object.keys(paths).reduce((obj, k) => {
        const aliasDir = k.replace(/\/\*/, '');
        obj[aliasDir] = path.resolve(__dirname, baseUrl + '/' + paths[k][0].replace(/\*/, ''))
        return obj;
    }, {});
    return alias;
}
module.exports = {
    reactScriptsVersion: "react-scripts" /* (default value) */,
    typescript: {
        enableTypeChecking: true /* (default value)  */
    },
    webpack: {
        alias: configPaths('./tsconfig.paths.json')
    },
};