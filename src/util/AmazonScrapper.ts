import {DomUtils, parseDocument} from 'htmlparser2';
import {ParsingResult} from './HtmlParser';
import {Document} from 'domhandler';

/**
 * Dedicated scrapper for Amazon which doesn't have any kind of metadata
 */
class AmazonScrapper {
  scrape(text: string): ParsingResult {
    const dom = parseDocument(text);
    const title = DomUtils.findOne(
      element =>
        element.name === 'span' && element.attribs.id === 'productTitle',
      dom,
    );
    const image = DomUtils.findOne(
      element =>
        element.name === 'img' && element.attribs.id === 'landingImage',
      dom,
    );

    return {
      title: title ? DomUtils.innerText(title.childNodes).trim() : undefined,
      images: image?.attribs.src ? [image?.attribs.src] : [],
      price: this.parsePrice(dom),
    };
  }

  private parsePrice(dom: Document): string | undefined {
    const priceWhole = DomUtils.findOne(
      element =>
        element.name === 'span' && element.attribs.class === 'a-price-whole',
      dom,
    );

    const priceDecimals = DomUtils.findOne(
      element =>
        element.name === 'span' && element.attribs.class === 'a-price-fraction',
      dom,
    );

    if (priceWhole && priceDecimals) {
      return (
        DomUtils.innerText(priceWhole.firstChild!!) +
        '.' +
        DomUtils.innerText(priceDecimals.firstChild!!)
      );
    } else if (priceWhole) {
      return DomUtils.innerText(priceWhole.firstChild!!);
    }
  }
}

export default AmazonScrapper;
