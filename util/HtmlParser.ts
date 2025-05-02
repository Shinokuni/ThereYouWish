import {DomUtils, parseDocument} from 'htmlparser2';
import {Element} from 'domhandler';
import * as CSSSelect from 'css-select';

export interface ParsingResult {
  title?: string;
  description?: string;
  price?: string;
  url?: string;
  imageUrl?: string;
}

class HtmlParser {
  parse(text: string): ParsingResult {
    const dom = parseDocument(text);

    const head = DomUtils.findOne(element => element.name === 'head', dom);

    if (head) {
      return {
        title: this.parseTitle(head),
        description: this.parseDescription(head),
        price: this.parsePrice(head),
        url: this.parseUrl(head),
        imageUrl: this.parseImageUrl(head),
      };
    } else {
      return {};
    }
  }

  private parseTitle(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'title,meta[property="og:title"],meta[name="twitter:title"]',
      head,
    );

    if (element?.name === 'title') {
      return DomUtils.innerText(element.firstChild!!);
    } else {
      console.log(element);

      element?.attribs.content;
    }
  }

  private parseDescription(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'meta[property="og:description"],meta[name="twitter:description"]',
      head,
    );

    return element?.attribs.content;
  }

  private parseUrl(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'link[rel="canonical"],meta[property="og:url"]',
      head,
    );

    if (element?.name === 'link') {
      return element.attribs.href;
    } else {
      return element?.attribs.content;
    }
  }

  private parsePrice(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'meta[property="og:price:amount"],meta[property="product:price:amount"]',
      head,
    );

    return element?.attribs.content;
  }

  private parseImageUrl(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'meta[property="og:image:secure_url"],meta[name="twitter:image"]',
      head,
    );

    return element?.attribs.content;
  }
}

export default HtmlParser;
