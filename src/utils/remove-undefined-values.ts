export type RemoveUndefinedValues<T extends object> = {
    [key in keyof T]: Exclude<T[key], undefined>;
};

export const removeUndefinedValues = <T extends object>(object: T): RemoveUndefinedValues<T> =>
    Object.fromEntries(
        Object.entries(object).filter(([, value]) => value !== undefined),
    ) as RemoveUndefinedValues<T>;
