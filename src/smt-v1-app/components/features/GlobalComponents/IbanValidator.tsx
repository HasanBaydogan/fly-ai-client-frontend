import { useState, useCallback } from 'react';

interface IbanValidationResult {
  isValid: boolean;
  error?: string;
  formattedIban?: string;
}

interface CountryCodeLengths {
  [key: string]: number;
}

const IBAN_COUNTRY_CODE_LENGTHS: CountryCodeLengths = {
  AD: 24,
  AE: 23,
  AL: 28,
  AT: 20,
  AZ: 28,
  BA: 20,
  BE: 16,
  BG: 22,
  BH: 22,
  BR: 29,
  CH: 21,
  CR: 21,
  CY: 28,
  CZ: 24,
  DE: 22,
  DK: 18,
  DO: 28,
  EE: 20,
  ES: 24,
  LC: 30,
  FI: 18,
  FO: 18,
  FR: 27,
  GB: 22,
  GI: 23,
  GL: 18,
  GR: 27,
  GT: 28,
  HR: 21,
  HU: 28,
  IE: 22,
  IL: 23,
  IS: 26,
  IT: 27,
  JO: 30,
  KW: 30,
  KZ: 20,
  LB: 28,
  LI: 21,
  LT: 20,
  LU: 20,
  LV: 21,
  MC: 27,
  MD: 24,
  ME: 22,
  MK: 19,
  MR: 27,
  MT: 31,
  MU: 30,
  NL: 18,
  NO: 15,
  PK: 24,
  PL: 28,
  PS: 29,
  PT: 25,
  QA: 29,
  RO: 24,
  RS: 22,
  SA: 24,
  SE: 24,
  SI: 19,
  SK: 24,
  SM: 27,
  TN: 24,
  TR: 26
};

/**
 * Calculates MOD 97 for IBAN validation
 */
const mod97 = (digits: string): number => {
  let checksum = digits.slice(0, 2);
  const length = digits.length;

  for (let i = 2; i < length; i += 7) {
    const chunk = checksum + digits.slice(i, i + 7);
    checksum = (parseInt(chunk, 10) % 97).toString();
  }

  return parseInt(checksum, 10);
};

/**
 * Custom hook for IBAN validation
 * @returns Object containing validation function and formatting function
 */
export const useIbanValidator = () => {
  const validateIban = useCallback((iban: string): IbanValidationResult => {
    // Return early if empty
    if (!iban) {
      return {
        isValid: false,
        error: 'IBAN is required'
      };
    }

    // Clean the IBAN - remove spaces and convert to uppercase
    const cleanIban = iban.toUpperCase().replace(/[^A-Z0-9]/g, '');

    // Extract country code and check format
    const codeMatch = cleanIban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/);

    if (!codeMatch) {
      return {
        isValid: false,
        error: 'Invalid IBAN format'
      };
    }

    const [, countryCode, checkDigits, accountNumber] = codeMatch;

    // Check if country code exists and length is correct
    const expectedLength = IBAN_COUNTRY_CODE_LENGTHS[countryCode];
    if (!expectedLength) {
      return {
        isValid: false,
        error: 'Invalid country code'
      };
    }

    if (cleanIban.length !== expectedLength) {
      return {
        isValid: false,
        error: `IBAN length should be ${expectedLength} characters for ${countryCode}`
      };
    }

    // Rearrange IBAN and convert letters to numbers for MOD97 check
    const digits = (accountNumber + countryCode + checkDigits).replace(
      /[A-Z]/g,
      (letter: string) => (letter.charCodeAt(0) - 55).toString()
    );

    // Perform MOD97 check
    const isValid = mod97(digits) === 1;

    // Format IBAN with spaces for display (groups of 4)
    const formattedIban = cleanIban.replace(/(.{4})/g, '$1 ').trim();

    return {
      isValid,
      formattedIban,
      error: isValid ? undefined : 'Invalid IBAN checksum'
    };
  }, []);

  const formatIban = useCallback((iban: string): string => {
    const cleanIban = iban.toUpperCase().replace(/[^A-Z0-9]/g, '');
    return cleanIban.replace(/(.{4})/g, '$1 ').trim();
  }, []);

  return {
    validateIban,
    formatIban
  };
};

/**
 * Example usage:
 *
 * import { useIbanValidator } from './IbanValidator';
 *
 * const MyComponent = () => {
 *   const { validateIban, formatIban } = useIbanValidator();
 *
 *   const handleIbanChange = (e) => {
 *     const { value } = e.target;
 *     const { isValid, error, formattedIban } = validateIban(value);
 *
 *     if (isValid) {
 *       // Process valid IBAN
 *       console.log('Valid IBAN:', formattedIban);
 *     } else {
 *       // Handle error
 *       console.log('IBAN Error:', error);
 *     }
 *   };
 *
 *   return (
 *     <input
 *       type="text"
 *       onChange={handleIbanChange}
 *       placeholder="Enter IBAN"
 *     />
 *   );
 * };
 */
