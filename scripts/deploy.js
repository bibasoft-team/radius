
var exec = require('shelljs.exec')

const BUILD_PATH = './build'
const ENDPOINT = process.env.AWS_ENDPOINT
const TARGET = process.env.AWS_TARGET
const BUCKET = process.env.AWS_BUCKET
const process_start_at = new Date();

// TODO move to package
exec(
    [
        `aws`,
        `--endpoint-url=${ENDPOINT}`,
        `--delete`,
        `s3`,
        `sync`,
        `${BUILD_PATH}`,
        `s3://${combineURLs(BUCKET, TARGET)}`,
        `--only-show-errors`
    ].join(' '), { stdio: 'inherit' }
);


console.log(`deploy time: ${(new Date() - process_start_at) / 1000}s`)


// TODO use https://www.npmjs.com/package/url-join
function combineURLs(baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
        : baseURL;
}