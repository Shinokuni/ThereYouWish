import {readFileSync} from 'fs';
import AmazonScrapper from '../../src/util/AmazonScrapper';

const scraper = new AmazonScrapper();

describe('Amazon tests', () => {
  test('regular content', () => {
    const file = readFileSync(
      '__tests__/resources/amazon/amazon.html',
      'utf-8',
    );

    const result = scraper.scrape(file);

    expect(result.title).toBe(
      'Instant Pot Duo 7-in-1 Electric Pressure Cooker, Slow Cooker, Rice Cooker, Steamer, Sauté, Yogurt Maker, Warmer & Sterilizer, Includes App With Over 800 Recipes, Stainless Steel, 6 Quart',
    );
    expect(result.price).toBe('99.95');
    expect(result.images).toHaveLength(1);
  });
});
