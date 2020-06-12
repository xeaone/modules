
export default function (properties, data) {
    const result = {};
    properties.forEach(property => result[property] = data[property]);
    return result;
}
