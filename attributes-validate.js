
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (session, payload, attributes) {

    for (const attribute of attributes) {
        const [ item, items ] = attribute;

        if (session[items] && (item in payload || items in payload)) {
            const limits = [];

            if (payload[items]) {
                if (Array.isArray(payload[items])) {
                    limits.push(...payload[items]);
                } else {
                    return false;
                }
            }

            if (payload[item]) {
                if (typeof payload[item] === 'string') {
                    limits.push(payload[item]);
                } else {
                    return false;
                }
            }

            for (const limit of limits) {
                if (!session[items].includes(limit)) {
                    return false;
                }
            }

        }
    }

    return true;
}
