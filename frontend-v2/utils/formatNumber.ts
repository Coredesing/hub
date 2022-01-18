import BigNumber from 'bignumber.js';
//@ts-ignore
import removeTrailingZeros from 'remove-trailing-zeros'
var commaNumber = require('comma-number');


export function numberWithCommas(x: string | number = "", decimals: number = 2) {
  x = typeof x === 'string' ? x: (x as number).toFixed();
  return removeTrailingZeros(commaNumber(new BigNumber(x).toFixed(decimals), ",", "."));
}

export const formatRoundDown = (num: any, decimals = 2) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_DOWN)
    .toFixed(decimals, BigNumber.ROUND_DOWN);
};

export const formatRoundUp = (num: any, decimals = 2) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_UP)
    .toFixed(decimals, BigNumber.ROUND_UP);  // ROUND_UP: 4.999999999999999999987744 --> 5
};

export const formatRoundHalfDown = (num: any, decimals = 2) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_HALF_DOWN)
    .toFixed(decimals, BigNumber.ROUND_HALF_DOWN);
};

export const formatRoundHalfUp = (num: any, decimals = 2) => {
  return new BigNumber(num)
    .decimalPlaces(decimals, BigNumber.ROUND_HALF_UP)
    .toFixed(decimals, BigNumber.ROUND_HALF_UP);
};

