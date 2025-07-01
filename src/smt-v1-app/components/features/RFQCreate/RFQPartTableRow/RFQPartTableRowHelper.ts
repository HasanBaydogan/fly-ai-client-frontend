export function formatNumber(value) {
  if (value === null || value === 0) {
    return 0;
  }
  return value.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}
