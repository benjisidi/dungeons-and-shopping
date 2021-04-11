export const asyncForEach = async <T extends unknown>(
  data: T[],
  callback: (datum?: T, index?: number, data?: T[]) => Promise<void>
) => {
  for (let i = 0; i < data.length; i++) {
    await callback(data[i], i, data);
  }
};
