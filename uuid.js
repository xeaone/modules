let RandomBytes;
let RandomBytesSync;

let BufferToHex;
let BufferToHexSync;

if (typeof window === 'undefined') {

    const Util = require('util');
    const Crypto = require('crypto');

    RandomBytesSync = Crypto.randomBytes;
    RandomBytes = Util.promisify(Crypto.randomBytes);

    BufferToHex = async buffer => buffer.toString('hex');
    BufferToHexSync = buffer => buffer.toString('hex');

} else {

    RandomBytesSync = function (size) {
        const bytes = new Uint8Array(size);
        const values = window.crypto.getRandomValues(bytes);
        return values.buffer;
    };

    const BufferToHexSync = function (buffer) {
        const bytes = new Uint8Array(buffer);
        const hexes = [];

        for (let i = 0, l = bytes.length; i < l; i++) {

            let hex = bytes[ i ].toString(16);
            let pad = ('00' + hex).slice(-2);

            hexes.push(pad);
        }

        return hexes.join('');
    };

    RandomBytes = async size => RandomBytes(size);
    BufferToHex = async buffer => BufferToHexSync(buffer);

}

export default {

    async four () {
        let bytes = RandomBytes(16);

        bytes[ 6 ] = (bytes[ 6 ] & 0x0f) | 0x40;
        bytes[ 8 ] = (bytes[ 8 ] & 0x3f) | 0x80;

        bytes = BufferToHex(bytes).match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

        bytes.shift();

        return bytes.join('-');
    },

    fourSync () {
        let bytes = RandomBytesSync(16);

        bytes[ 6 ] = (bytes[ 6 ] & 0x0f) | 0x40;
        bytes[ 8 ] = (bytes[ 8 ] & 0x3f) | 0x80;

        bytes = BufferToHexSync(bytes).match(/(.{8})(.{4})(.{4})(.{4})(.{12})/);

        bytes.shift();

        return bytes.join('-');
    }

};