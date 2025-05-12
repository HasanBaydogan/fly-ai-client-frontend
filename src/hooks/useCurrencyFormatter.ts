import { useCallback } from 'react';

const useCurrencyFormatter = () => {
  const formatNumberWithDecimals = useCallback(
    (value: number | string): string => {
      const numericValue =
        typeof value === 'number' ? value : parseFloat(value);
      if (isNaN(numericValue)) return '';

      const roundedValue = numericValue.toFixed(2);
      const [integerPartRaw, fractionalPartRaw] = roundedValue.split('.');

      const integerDigits = integerPartRaw.replace(/\D/g, '');
      const formattedInteger = integerDigits.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        ','
      );

      return `${formattedInteger}.${fractionalPartRaw}`;
    },
    []
  );

  return { formatNumberWithDecimals };
};

export default useCurrencyFormatter;

// Usage example:
// const { formatNumberWithDecimals } = useCurrencyFormatter();
// import useCurrencyFormatter from 'hooks/useCurrencyFormatter';
