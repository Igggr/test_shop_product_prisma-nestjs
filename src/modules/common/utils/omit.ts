export const omit = <T, K extends keyof T & string>(names: readonly K[], obj: Readonly<T>): Omit<T, K> => {
    const result = {} as any;
    const index: Record<string, number> = {};
    let idx = 0;
    const len = names.length;

    while (idx < len) {
        index[names[idx]] = 1;
        idx += 1;
    }

    for (const prop in obj) {
        // eslint-disable-next-line no-prototype-builtins
        if (!index.hasOwnProperty(prop)) {
            result[prop] = obj[prop];
        }
    }
    return result;
};