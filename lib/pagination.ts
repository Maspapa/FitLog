/** 把列表切成一页，越界页码自动夹到有效范围。 */
export function paginate<T>(items: T[], page: number, size: number): { items: T[]; page: number; pageCount: number } {
  const pageCount = Math.max(1, Math.ceil(items.length / size));
  const safePage = Math.min(Math.max(0, Math.trunc(page)), pageCount - 1);
  return {
    items: items.slice(safePage * size, safePage * size + size),
    page: safePage,
    pageCount,
  };
}
