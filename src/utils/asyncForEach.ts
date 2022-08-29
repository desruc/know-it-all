interface Callback<T> {
  (element: T, index: number, array: T[]): Promise<void>;
}

/**
 * An asynchronous forEach loop
 * @param arr The array to loop over
 * @param callback The callback to execute on each element
 */
export const asyncForEach = async <T>(
  arr: T[],
  callback: Callback<T>
): Promise<void> => {
  for (let i = 0; i < arr.length; i += 1) {
    // eslint-disable-next-line
      await callback(arr[i], i, arr);
  }
};
