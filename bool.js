
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
