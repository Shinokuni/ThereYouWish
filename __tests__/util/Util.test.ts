import Util from '../../src/util/Util';

describe('isStringUrl tests', () => {
  test('valid url test', () => {
    expect(Util.isStringUrl('https://test.org')).toBe(true);
  });

  test('unvalid url test', () => {
    expect(Util.isStringUrl('test')).toBe(false);
  });
});

describe('getRootDomain tests', () => {
  test('valid root domain', () => {
    expect(Util.getURLrootDomain('https://amazon.com')).toBe('amazon');
  });

  test('unvalid root domain', () => {
    expect(Util.getURLrootDomain('amazon')).toBe(undefined);
  });
});

describe('formatPrice tests', () => {
  test('en/USD price', () => {
    expect(Util.formatPrice(50, 'en', 'USD')).toBe('$50');
  });

  test('fr/EUR price', () => {
    expect(Util.formatPrice(100, 'en', 'EUR')).toBe('€100');
  });

  test('max digits', () => {
    expect(Util.formatPrice(100.5896, 'en', 'USD')).toBe('$100.59');
  });
});
