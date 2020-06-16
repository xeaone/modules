
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (items, option) {
    const keys = Object.keys(option);
    return items.filter(item => {

        for (const key of keys) {
            const optionValue = typeof option[key] === 'string' ? option[key].toLowerCase() : option[key];

            if (optionValue === '' || optionValue === null || optionValue === undefined) continue;

            if (optionValue === '*') continue;

            if (optionValue instanceof Array) {
                let flag = false;

                for (const value of optionValue) {
                    const itemValue = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key]  ;
                    flag = itemValue instanceof Array ? itemValue.includes(value) : itemValue === value;
                    if (flag) break;
                }

                if (flag) continue;
                else return false;
            }

            const itemValue = typeof item[key] === 'string' ? item[key].toLowerCase() : item[key];
            if (optionValue !== itemValue) return false;

        }

        return true;
    });
}
