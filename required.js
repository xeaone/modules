
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default function (data) {
    const names = arguments[1] instanceof Array ? arguments[1] : Array.prototype.slice.call(arguments, 1);
    return names.find(name => name in data === false);
}
