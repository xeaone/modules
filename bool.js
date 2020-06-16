
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (data) {
    if (typeof data === 'string') {
        const options = [ 'yes', 'true' ];
        return options.includes(data.toLowerCase()) ? true : false;
    } else if (typeof data === 'boolean') {
        return data ? 'yes' : 'no';
    } else {
        return null;
    }
}
