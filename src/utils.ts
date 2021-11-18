export const sortByField: any = (arr: any[], field: any) => {
  return arr.sort((a: any, b: any) => (a[field] > b[field] ? 1 : -1));
};

export const paginate: any = (
  arr: any[],
  pageSize: number,
  pageNumber: number
) => {
  return arr.slice((pageNumber - 1) * pageSize, pageNumber * pageSize);
};
