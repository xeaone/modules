
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (data) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onerror = (error) => reject(error);
        reader.onload = (events) => resolve(events.target.result);
        reader.readAsText(data);
    });
}
