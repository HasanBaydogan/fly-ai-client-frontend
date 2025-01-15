export const parseDeadline = (deadlineString: string): Date => {
  const [day, month, year] = deadlineString.split('.').map(Number);
  return new Date(year, month - 1, day); // Note: Month is 0-indexed.
};

export function formatDateToString(date: Date) {
  const day = String(date.getDate()).padStart(2, '0'); // Get day and pad to 2 digits
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Get month (0-based, so +1) and pad to 2 digits
  const year = date.getFullYear(); // Get the full year
  return `${day}.${month}.${year}`;
}
