
export default function (items, option) {
    const keys = Object.keys(option);
    return items.filter(item => {

        for (const key of keys) {
            const value = option[key];

            if (value === '' || value === null || value === undefined) continue;

            if (value === '*') continue;

            if (value instanceof Array) {
                let flag = false;

                for (const v of value) {
                    const iv = item[key];
                    flag = iv instanceof Array ? iv.includes(v) : iv === v;
                    if (flag) break;
                }

                if (flag) continue;
                else return false;
            }

            if (value !== item[key]) return false;

        }

        return true;
    });
}
