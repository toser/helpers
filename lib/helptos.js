'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.sortByDeepProp = exports.sortByProp = exports.copyArray = exports.shortenUrl = exports.getRandomEntry = exports.getNameList = exports.getFirstByName = exports.getByName = exports.hasNameValue = exports.hasPropValue = exports.anyHasPropSet = exports.hasAllPropsSet = exports.hasPropSet = exports.getConfig = exports.parseJSON = exports.getJSON = exports.buildLocalPath = undefined;

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _shorturl = require('shorturl');

var _shorturl2 = _interopRequireDefault(_shorturl);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * joins current dir and given filePath together
 *
 * @param filePath
 * @returns {string}
 */
var buildLocalPath = exports.buildLocalPath = function buildLocalPath(filePath, dir) {
    return _path2.default.join(dir, filePath);
};

/**
 *
 * @param filePath
 */
var getJSON = exports.getJSON = function getJSON(filePath, dir) {
    return _fs2.default.readFileSync(buildLocalPath(filePath, dir), 'utf8');
};

/**
 *
 * @param input
 */
var parseJSON = exports.parseJSON = function parseJSON(input) {
    return JSON.parse(input);
};

/**
 * loads json config
 *
 * @param filePath
 * @returns {object}
 */
var getConfig = exports.getConfig = function getConfig(filePath, dir) {
    return parseJSON(getJSON(filePath, dir));
};

/**
 * check if object has a specific property set (not undefined/null/false/empty string)
 *
 * @param prop
 * @returns {function(): boolean}
 */
var hasPropSet = exports.hasPropSet = function hasPropSet(prop) {
    return function (obj) {
        return !!obj && (!!obj[prop] || obj[prop] === 0 || obj[prop] === '');
    };
};

/**
 * check if an object has all properties set given by an array (not undefined/null/false/empty string)
 *
 * @param props
 * @returns {function(): boolean}
 */
var hasAllPropsSet = exports.hasAllPropsSet = function hasAllPropsSet(props) {

    return function (obj) {

        return props.reduce(function (hasAll, prop) {

            if (!hasAll) {
                return false;
            } else {
                return hasPropSet(prop)(obj);
            }
        }, true);
    };
};

var anyHasPropSet = exports.anyHasPropSet = function anyHasPropSet(prop) {

    return function (arr) {

        return arr.reduce(function (anyHas, obj) {

            if (anyHas) {
                return true;
            } else {
                return hasPropSet(prop)(obj);
            }
        }, false);
    };
};

/**
 * checks if object has property with a specific value
 *
 * @param prop
 * @param value
 * @returns {Function}
 */
var hasPropValue = exports.hasPropValue = function hasPropValue(prop, value) {

    return function (el) {
        return el[prop] === value;
    };
};

/**
 * checks if object has a specific value on property 'name'
 *
 * @param name
 * @returns {Function}
 */
var hasNameValue = exports.hasNameValue = function hasNameValue(name) {
    return hasPropValue('name', name);
};

/**
 * filter array for specific objects with specific name property
 *
 * @param arr
 * @param name
 * @returns {Array}
 */
var getByName = exports.getByName = function getByName(arr, name) {
    return arr.filter(hasNameValue(name));
};

/**
 * get's first object with specific name property
 *
 * @param arr
 * @param name
 * @returns {object}
 */
var getFirstByName = exports.getFirstByName = function getFirstByName(arr, name) {
    return getByName(arr, name)[0];
};

/**
 * get comma separated string of name properties values from an array of objects
 *
 * @param arr
 * @returns {string}
 */
var getNameList = exports.getNameList = function getNameList(arr) {
    return arr.reduce(function (list, category) {

        if (list.length) {
            return list + ', ' + category.name;
        }

        return category.name;
    }, '');
};

/**
 * get random entry from array
 *
 * @param arr
 * @returns {*}
 */
var getRandomEntry = exports.getRandomEntry = function getRandomEntry(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
};

/**
 * shorten url
 *
 * @param url
 * @returns {Promise}
 */
var shortenUrl = exports.shortenUrl = function shortenUrl(url) {

    return new Promise(function (resolve, reject) {

        (0, _shorturl2.default)(url, function (result) {

            if (!result) {
                reject('shortenUrl: service not available');
            } else {
                resolve(result);
            }
        });
    });
};

var copyArray = exports.copyArray = function copyArray(arr) {
    return JSON.parse(JSON.stringify(arr));
};

/**
 * returns a new array sorted by a property value
 *
 * @param arr
 * @param prop
 * @returns {Array}
 */
var sortByProp = exports.sortByProp = function sortByProp(arr, prop) {

    var copy = copyArray(arr);

    return copy.sort(function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        } else if (a[prop] < b[prop]) {
            return -1;
        }

        return 0;
    });
};

/**
 * returns a new array sorted by a property value that is in a deeper level
 *
 *
 * @param arr
 * @param prop - e.g. '.user.purchases.average'
 * @returns {Array}
 */
var sortByDeepProp = exports.sortByDeepProp = function sortByDeepProp(arr, prop) {

    var copy = JSON.parse(JSON.stringify(arr)),
        deepProp = prop.split('.');

    return copy.sort(function (a, b) {

        deepProp.reduce(function (full, curr) {
            a = a[curr];
            b = b[curr];
        });

        if (a > b) {
            return 1;
        } else if (a < b) {
            return -1;
        }

        return 0;
    });
};