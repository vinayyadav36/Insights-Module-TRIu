export function getStartOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getEndOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function bucketDate(dateStr: string, bucket: 'day' | 'week' | 'month'): string {
  const d = new Date(dateStr);

  const toLocalDateString = (date: Date) => {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  if (bucket === 'day') {
    return toLocalDateString(d);
  }
  if (bucket === 'week') {
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday as start of week
    const startOfWeek = new Date(d);
    startOfWeek.setDate(diff);
    return toLocalDateString(startOfWeek);
  }
  if (bucket === 'month') {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }
  return dateStr;
}
