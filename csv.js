
export default async function (data, option) {

    option = option || {};

    const formatter = function (result, row, column) {

        if (option.method) {
            const formatted = option.method(result, row, column);

            if (formatted !== undefined) {
                result[row][column] = formatted;
            }

        }

        if (option.defaults !== false) {
            result[row][column] = result[row][column].trim().toLowerCase();
        }

    };

    const result = [];

    // true means we are inside a quoted field
    let quote = false;
    // let l = typeof option.stop === 'number' ? option.stop : data.length

    // iterate over each character, keep track of current row and column
    for (let row = 0, column = 0, i = 0, l = data.length; i < l; i++) {

        const cc = data[i]; // current character
        const nc = data[i + 1]; // next character
        const pc = data[i - 1]; // previous character

        // create a new row if necessary
        result[row] = result[row] || [];

        // create a new column if necessary
        result[row][column] = result[row][column] || '';

        // If the current character is a quotation mark, and we're inside a
        // quoted field, and the next character is also a quotation mark,
        // add a quotation mark to the current column and skip the next character
        if (cc === '"' && quote && nc === '"') {
            result[row][column] += cc;
            ++i;
            continue;
        }

        // if it is just one quotation mark, begin/end quoted field
        if (cc === '"') {
            quote = !quote;
            continue;
        }

        // if it is a comma and we are not in a quoted field, move on to the next column
        if (cc === ',' && !quote) {
            formatter(result, row, column);
            ++column;
            continue;
        }

        // if it is a newline (CRLF) and we are not in a quoted field, skip the next character
        // and move on to the next row and move to column 0 of that new row
        if (cc === '\r' && nc === '\n' && !quote) {
            formatter(result, row, column);
            if (option.stop === row) break;
            ++i;
            ++row;
            column = 0;
            continue;
        }

        // if it is a newline (LF or CR) and we are not in a quoted field,
        // move on to the next row and move to column 0 of that new row
        if (cc === '\n' && !quote) {
            formatter(result, row, column);
            if (option.stop === row) break;
            ++row;
            column = 0;
            continue;
        }

        if (cc === '\r' && !quote) {
            formatter(result, row, column);
            if (option.stop === row) break;
            ++row;
            column = 0;
            continue;
        }

        const rc = result[row][column];
        // const rcc = rc[rc.length];

        // skip leading space
        if (cc === ' ' && rc.length === 0) {
            continue;
        }

        // skip double spaces
        if (cc === ' ' && rc[rc.length - 1] === ' ') {
            continue;
        }

        // append the current character to the current column
        result[row][column] += cc;
    }

    return result;
}
