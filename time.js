
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

const months = [
    'january', 'february', 'march',
    'april', 'may', 'june',
    'july', 'august', 'september',
    'october', 'november', 'december'
];

const parse = function (data) {
    if (data === null || data === undefined) {
        return null;
    } else if (typeof data === 'string') {
        const [ year, month, day ] = data.split('-');
        return new Date(Number(year), Number(month)-1, Number(day)).getTime();
    } else if (typeof data === 'number') {
        const date = new Date(data);
        const year = date.getFullYear();
        const month = months[date.getMonth()];
        const day = date.getDate();
        const hour = date.getHours();
        const minute = date.getMinutes();
        const second = date.getSeconds();
        const millisecond = date.getMilliseconds();
        return { year, month, day, hour, minute, second, millisecond };
    } else {
        throw new Error('Time.parse - invalid argument type');
    }
};

const stringify =  function (data) {
    const { year, month, day, hour, minute } = parse(data);
    return `${year} ${month} ${day}, ${hour}:${minute}`;
};

// end of day: one ms before midnight
const end = function (stamp) {
    const date = stamp ? new Date(stamp) : new Date();
    date.setHours(23, 59, 59, 999);
    return date.getTime();
};

const now = function () {
    return Date.now();
};

// default 24h
const later = function (data) {
    data = data || (1000*60*60*24);
    return Date.now() + data;
};

// milliseconds to seconds
const mstos = function (ms) {
    return ~~(ms/1000);
};

// seconds to milliseconds
const stoms = function (s) {
    return (s*1000);
};

export default Object.freeze({
    later, mstos, stoms,
    stringify, parse, end, now, months
});
