export const pick = <T extends Object, K extends (string | number | symbol) & keyof T>(
    names: readonly K[],
    obj: T,
): Pick<T, Exclude<keyof T, Exclude<keyof T, K>>> => {
    const result = {} as Pick<T, Exclude<keyof T, Exclude<keyof T, K>>>;
    let idx = 0;
    while (idx < names.length) {
        if (names[idx] in obj) {
            // @ts-expect-error(TS2536) Непонятки с типизацией
            result[names[idx]] = obj[names[idx]];
        }
        idx += 1;
    }
    return result;
};