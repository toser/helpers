'use strict';

import path from 'path';
import shorturl from 'shorturl';
import fs from 'fs';

/**
 * joins current dir and given filePath together
 *
 * @param filePath
 * @returns {string}
 */
export const buildLocalPath = (filePath, dir) => path.join(dir, filePath);

/**
 *
 * @param filePath
 */
export const getJSON = (filePath, dir) => fs.readFileSync(buildLocalPath(filePath, dir), 'utf8');

/**
 *
 * @param input
 */
export const parseJSON = input => JSON.parse(input);

/**
 * loads json config
 *
 * @param filePath
 * @returns {object}
 */
export const getConfig = (filePath, dir) => parseJSON(getJSON(filePath, dir));

/**
 * check if object has a specific property set (not undefined/null/false/empty string)
 *
 * @param prop
 * @returns {function(): boolean}
 */
export const hasPropSet = prop => {
    return obj => !!obj && (!!obj[prop] || obj[prop] === 0 || obj[prop] === '');
};

/**
 * check if an object has all properties set given by an array (not undefined/null/false/empty string)
 *
 * @param props
 * @returns {function(): boolean}
 */
export const hasAllPropsSet = props => {

    return obj => {

        return props.reduce((hasAll, prop) => {

            if (!hasAll) {
                return false;
            }
            else {
                return hasPropSet(prop)(obj);
            }
        }, true);
    };
};

export const anyHasPropSet = prop => {

    return arr => {

        return arr.reduce((anyHas, obj) => {

            if (anyHas) {
                return true;
            }
            else {
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
export const hasPropValue = (prop, value) => {

    return el => el[prop] === value;
};

/**
 * checks if object has a specific value on property 'name'
 *
 * @param name
 * @returns {Function}
 */
export const hasNameValue = name => hasPropValue('name', name);

/**
 * checks if object has a specific value on property 'type'
 *
 * @param type
 * @returns {Function}
 */
export const hasTypeValue = type => hasPropValue('type', type);

/**
 * filter array for specific objects with specific name property
 *
 * @param arr
 * @param name
 * @returns {Array}
 */
export const getByName = (arr, name) => arr.filter(hasNameValue(name));

/**
 * filter array for specific objects with specific type property
 *
 * @param arr
 * @param type
 * @returns {Array}
 */
export const getByType = (arr, type) => arr.filter(hasTypeValue(type));

/**
 * get's first object with specific name property
 *
 * @param arr
 * @param name
 * @returns {object}
 */
export const getFirstByName = (arr, name) => getByName(arr, name)[0];

/**
 * get's first object with specific type property
 *
 * @param arr
 * @param type
 * @returns {object}
 */
export const getFirstByType = (arr, type) => getByType(arr, type)[0];

/**
 * get comma separated string of name properties values from an array of objects
 *
 * @param arr
 * @returns {string}
 */
export const getNameList = arr => {
    return arr.reduce((list, category) => {

        if (list.length) {
            return `${list}, ${category.name}`
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
export const getRandomEntry = arr => arr[Math.floor(Math.random() * arr.length)];

/**
 * shorten url
 *
 * @param url
 * @returns {Promise}
 */
export const shortenUrl = url => {

    return new Promise(function (resolve, reject) {

        shorturl(url, result => {

            if (!result) {
                reject('shortenUrl: service not available');
            }
            else {
                resolve(result);
            }
        });
    });
};

/**
 * deep copy of an object
 *
 * @param obj
 */
export const copyObject = obj => JSON.parse(JSON.stringify(obj));

/**
 * deep copy of an array
 *
 * @param obj
 */
export const copyArray = arr => copyObject(arr);

/**
 * returns a new array sorted by a property value
 *
 * @param arr
 * @param prop
 * @returns {Array}
 */
export const sortByProp = (arr, prop) => {

    let copy = copyArray(arr);

    return copy.sort(function (a, b) {
        if (a[prop] > b[prop]) {
            return 1;
        }
        else if (a[prop] < b[prop]) {
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
export const sortByDeepProp = (arr, prop) => {

    let copy = JSON.parse(JSON.stringify(arr)),
        deepProp = prop.split('.');

    return copy.sort(function (a, b) {

        deepProp.reduce((full, curr) => {
            a = a[curr];
            b = b[curr];
        });

        if (a > b) {
            return 1;
        }
        else if (a < b) {
            return -1;
        }

        return 0;
    });
};

/**
 * capitalize first letter of given string
 *
 * @param str
 * @returns {string}
 */
export const capitalize = str => str[0].toUpperCase() + str.slice(1);