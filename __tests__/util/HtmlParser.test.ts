import {readFileSync} from 'fs';
import HtmlParser from '../../src/util/HtmlParser';

const parser = new HtmlParser();

describe('regular head tags tests', () => {
  test('regular head', () => {
    const file = readFileSync(
      '__tests__/resources/head/basic_head.html',
      'utf-8',
    );
    const result = parser.parse(file);

    expect(result.title).toBe('The Baroque Bassoon Book | Wouter Verschuren');
    expect(result.description).toContain(
      'The idea to compile a book for beginning and medium-advanced baroque bassoon players',
    );
    expect(result.price).toBeUndefined();
    expect(result.url).toBe(
      'https://www.wouterverschuren.com/product/17571987/the-baroque-bassoon-book',
    );
    expect(result.images).toHaveLength(6);
  });

  // <title> instead of og:title
  // og:url instead of link[name="canonical"]
  test('head with only alternative tags', () => {
    const file = readFileSync(
      '__tests__/resources/head/basic_head_alternative.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.title).toBe('The Baroque Bassoon Book | Wouter Verschuren');
    expect(result.url).toBe(
      'https://www.wouterverschuren.com/product/17571987/the-baroque-bassoon-book',
    );
  });

  test('no head', () => {
    const file = readFileSync('__tests__/resources/head/no_head.html', 'utf-8');

    const result = parser.parse(file);

    expect(result.title).toBeUndefined();
  });
});

describe('json-ld tests', () => {
  test('multiple jsonld including one with image array, offer object', () => {
    const file = readFileSync(
      '__tests__/resources/jsonld/jsonld.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.title).toBe(
      'STORKLINTA 6-drawer dresser - white/anchor/unlock function 55 1/8x18 7/8x29 1/2 "',
    );
    expect(result.description).toBe(
      'STORKLINTA 6-drawer dresser - white/anchor/unlock function 55 1/8x18 7/8x29 1/2 ". Our safety feature Anchor and unlock enhances the safety of your chest of drawers by significantly reducing, but not completely eliminating, the tip-over risk. This furniture must be secured to the wall.',
    );
    expect(result.price).toBe('249.99');
    expect(result.url).toBe(
      'https://www.ikea.com/us/en/p/storklinta-6-drawer-dresser-white-anchor-unlock-function-60561248/',
    );
    expect(result.images).toHaveLength(4);
  });

  test('defective jsonld', () => {
    const file = readFileSync(
      '__tests__/resources/jsonld/defective_jsonld.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.title).toBe(
      'STORKLINTA 6-drawer dresser, white/anchor/unlock function,      551/8x187/8x291/2" - IKEA',
    );
  });

  test('empty jsonld', () => {
    const file = readFileSync(
      '__tests__/resources/jsonld/empty_jsonld.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.title).toBe(
      'STORKLINTA 6-drawer dresser, white/anchor/unlock function,      551/8x187/8x291/2" - IKEA',
    );
  });

  test('offers array with price specification array and image string', () => {
    const file = readFileSync(
      '__tests__/resources/jsonld/jsonld_pricespecification.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.price).toBe('120.00');
    expect(result.images).toHaveLength(1);
  });

  test('offers array with price specification object and image object', () => {
    const file = readFileSync(
      '__tests__/resources/jsonld/jsonld_pricespecification_object.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.price).toBe('120.00');
    expect(result.images).toHaveLength(1);
  });

  test('offers array', () => {
    const file = readFileSync(
      '__tests__/resources/jsonld/jsonld_offers_array.html',
      'utf-8',
    );

    const result = parser.parse(file);

    expect(result.price).toBe('249.99');
  });
});
