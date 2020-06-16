
/*
	This Source Code Form is subject to the terms of the Mozilla Public
	License, v. 2.0. If a copy of the MPL was not distributed with this
	file, You can obtain one at http://mozilla.org/MPL/2.0/.
*/

export default class Draw {

    constructor (option = {}) {
        this.x = 0;
        this.y = 0;
        this.points = [];
        this.flag = false;
        this.width = option.width || 1;
        this.fill = option.fill || null;
        this.line = option.line || 'black';
        this.quality = option.quality || 0.5;
        this._type = option.type || 'image/webp';
        this._up = this.tick.bind(this, this.change.bind(this, 'up'));
        this._out = this.tick.bind(this, this.change.bind(this, 'out'));
        this._down = this.tick.bind(this, this.change.bind(this, 'down'));
        this._move = this.tick.bind(this, this.change.bind(this, 'move'));
    }

    type (type) {
        if (typeof type !== 'string') throw new Error('type invalid');
        this._type = type;
        return this;
    }

    canvas (canvas) {
        canvas = typeof canvas === 'string' ? document.body.querySelector(canvas) : canvas;

        if (!(canvas instanceof HTMLCanvasElement)) throw new Error('canvas invalid');

        this._canvas = canvas;

        this._context = this._canvas.getContext('2d', {
            desynchronized: true,
            preserveDrawingBuffer: true
        });

        this._canvas.width = this._canvas.parentElement.clientWidth;
        this._canvas.height = this._canvas.parentElement.clientHeight;

        if (this.fill) {
            this._context.fillStyle = this.fill;
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
        }

        return this;
    }

    unlisten () {
        this._canvas.style.cursor = 'default';

        this._canvas.removeEventListener('mouseup', this._up);
        this._canvas.removeEventListener('mouseout', this._out);
        this._canvas.removeEventListener('mousedown', this._down);
        this._canvas.removeEventListener('mousemove', this._move);
        this._canvas.removeEventListener('touchend', this._up);
        this._canvas.removeEventListener('touchmove', this._move);
        this._canvas.removeEventListener('touchstart', this._down);

        return this;
    }

    listen () {
        this._canvas.style.cursor = 'crosshair';

        this._canvas.addEventListener('mouseup', this._up, false);
        this._canvas.addEventListener('mouseout', this._out, false);
        this._canvas.addEventListener('mousedown', this._down, false);
        this._canvas.addEventListener('mousemove', this._move, false);
        this._canvas.addEventListener('touchend', this._up, false);
        this._canvas.addEventListener('touchmove', this._move, false);
        this._canvas.addEventListener('touchstart', this._down, false);

        return this;
    }

    erase () {
        this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

        if (this.fill) {
            this._context.fillRect(0, 0, this._canvas.width, this._canvas.height);
            this._context.fillStyle = this.fill;
        }

        return this;
    }

    tick (method, events) {

        if (events.type !== 'resize' && events.cancelable) {
            events.preventDefault();
        }

        window.requestAnimationFrame(method.bind(this, events));
    }

    up () {
        this.flag = false;
        this.points.length = 0;
    }

    out () {
        this.flag = false;
        this.points.length = 0;
    }

    down (x, y) {
        this.flag = true;
        this.points.push({ x, y });
    }

    move (x, y) {
        if (!this.flag) return;
        this.points.push({ x, y });

        this._context.beginPath();
        this._context.moveTo(this.points[0].x, this.points[0].y);

        for (var i = 1; i < this.points.length; i++) {
            this._context.lineTo(this.points[i].x, this.points[i].y);
        }

        this._context.strokeStyle = this.line;
        this._context.shadowColor = this.line;
        this._context.lineWidth = this.width;
        this._context.lineCap = 'round';
        this._context.lineJoin = 'round';
        this._context.shadowBlur = 1;
        this._context.stroke();
        this._context.closePath();
    }

    change (type, e) {
        const bounds = this._canvas.getBoundingClientRect();
        const tx = e.touches ? e.touches[0].clientX : e.clientX;
        const ty = e.touches ? e.touches[0].clientY : e.clientY;
        const x = tx - bounds.left;
        const y = ty - bounds.top;
        this[type](x, y);
    }

    async reader (blob, type) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onerror = (error) => reject(error);
            reader.onload = () => resolve(reader.result);
            reader[type](blob);
        });
    }

    async image (data) {
        return new Promise((resolve, reject) => {
            const image = new Image();
            image.onerror = (error) => reject(error);
            image.onload = () => resolve(image);
            if (typeof data === 'string') image.src = data;
            else if (data instanceof Blob) image.src = URL.createObjectURL(data);
            else throw new Error('Draw - invalid image data type');
        });
    }

    async blob (blob) {
        if (blob) {
            const image = await this.image(blob);
            this._context.drawImage(image, 0, 0);
        } else {
            return new Promise(resolve => this._canvas.toBlob(resolve, this._type, this.quality));
        }
    }

    async url (url) {
        if (url) {
            const image = await this.image(url);
            this._context.drawImage(image, 0, 0);
        } else {
            const blob = await this.blob();
            return this.reader(blob, 'readAsDataURL');
        }
    }

    // stringToBase64Url (data) {
    //     return window
    //         .btoa(data)
    //         .replace(/\+/g, '-')
    //         .replace(/\//g, '_')
    //         .replace(/=/g, '');
    // }
    //
    // base64UrlToBase64 (data) {
    //     return (data + '==='.slice((data.length + 3) % 4))
    //         .replace(/-/g, '+')
    //         .replace(/_/g, '/');
    // }
    //
    // async url (url) {
    //     if (url) {
    //         const index = url.indexOf('base64,')+7;
    //         url = `${url.slice(0, index)}${this.base64UrlToBase64(url.slice(index))}`;
    //         const image = await this.image(url);
    //         this._context.drawImage(image, 0, 0);
    //     } else {
    //         const blob = await this.blob();
    //         const binary = await this.reader(blob, 'readAsBinaryString');
    //         const base64url = this.stringToBase64Url(binary);
    //         return `data:${blob.type};base64,${base64url}`;
    //     }
    // }

    async text () {
        const blob = await this.blob();
        return this.reader(blob, 'readAsText');
    }

    async binary () {
        const blob = await this.blob();
        return this.reader(blob, 'readAsBinaryString');
    }

    async buffer () {
        const blob = await this.blob();
        return this.reader(blob, 'readAsArrayBuffer');
    }

}
