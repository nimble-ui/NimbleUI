export function noop() {}

export function safe_eq(x: any, y: any) {
    if (x === y) return true
    if (
        (typeof x == 'object' && x != null) &&
        (typeof y == 'object' && y != null)
    ) {
        if (Object.keys(x).length != Object.keys(y).length) return false
        for (const prop in x) {
            if (Object.hasOwnProperty.call(x, prop) && Object.hasOwnProperty.call(y, prop)) {
                if (!safe_eq(x[prop], y[prop])) return false
            } else return false
        }
        return true
    }
    return false
}