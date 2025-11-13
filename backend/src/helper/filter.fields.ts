export function filterFields<T>(dto: T, allowedFields: string[]): Partial<T> {
  return Object.keys(dto)
    .filter((key) => allowedFields.includes(key))
    .reduce((obj, key) => {
      obj[key] = dto[key];
      return obj;
    }, {} as Partial<T>);
}
