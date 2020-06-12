
export default function (data) {
    const names = arguments[1] instanceof Array ? arguments[1] : Array.prototype.slice.call(arguments, 1);
    return names.find(name => name in data === false);
}
