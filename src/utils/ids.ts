export const getSafeId = (item: Record<string, unknown> | null | undefined): string | null => {
  if (!item) return null;
  return (item.id as string) || (item._id as string) || null;
};

export const hasSafeId = (item: Record<string, unknown> | null | undefined, targetId: string): boolean => {
  if (!item) return false;
  const id = (item.id as string) || (item._id as string);
  return id === targetId;
};

export const getDisplayId = (obj: Record<string, unknown>, fallback = 'B2-XXXXXX'): string => {
  const id = getSafeId(obj);
  if (!id) return fallback;
  return id.toString().slice(-8).toUpperCase();
};
