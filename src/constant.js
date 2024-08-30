const {getURL} = require('./config.js');

const PARENT_URL= getURL();
const VERSION_URL = 'api/v1/subtitle/';
const SEARCH = PARENT_URL + VERSION_URL + 'search/';
const DOWNLOAD = PARENT_URL + VERSION_URL + 'download/';

const getSearchEndpoint = () => {
    return SEARCH;
}

const getDownloadEndpoint = () => {
    return DOWNLOAD;
}

const getHeader = (key) => {
    return {"X-API-KEY": key};
};

module.exports = {
    getSearchEndpoint,
    getDownloadEndpoint,
    getHeader
};
