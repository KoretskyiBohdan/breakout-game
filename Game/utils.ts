export const createArray = (size = 0) => {
  const arr: null[] = [];

  for (let i = 0; i < size; i++) arr[i] = null;
  return arr;
};
