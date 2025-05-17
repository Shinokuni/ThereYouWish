import {DomUtils, parseDocument} from 'htmlparser2';
import {Element} from 'domhandler';
import * as CSSSelect from 'css-select';

export interface ParsingResult {
  title?: string;
  description?: string;
  price?: string;
  url?: string;
  images?: string[];
}

class HtmlParser {
  parse(text: string): ParsingResult {
    const dom = parseDocument(text);

    const head = DomUtils.findOne(element => element.name === 'head', dom);

    if (head) {
      const jsonld = this.parseJsonLD(head);

      return jsonld ?? this.parseHead(head);
    } else {
      return {};
    }
  }

  private parseHead(head: Element): ParsingResult {
    return {
      title: this.parseTitle(head),
      description: this.parseDescription(head),
      price: this.parsePrice(head),
      url: this.parseUrl(head),
      images: this.parseImageUrl(head),
    };
  }

  private parseTitle(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'title,meta[name="title"],meta[property="og:title"],meta[name="twitter:title"]',
      head,
    );

    if (element?.name === 'title') {
      return DomUtils.innerText(element.firstChild!!)
        .replace(/[\n\r]+/g, '')
        .trim();
    } else {
      return element?.attribs.content.replace(/[\n\r]+/g, '').trim();
    }
  }

  private parseDescription(head: Element): string | undefined {
    const element = CSSSelect.selectOne(
      'meta[name="description"],meta[property="og:description"],meta[name="twitter:description"]',
      head,
    );

    return element?.attribs.content.trim();
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

  private parseImageUrl(head: Element): string[] | undefined {
    const elements = CSSSelect.selectAll(
      'meta[property="og:image"],meta[property="og:image:secure_url"],meta[name="twitter:image"]',
      head,
    );

    return elements.map(element => element.attribs.content);
  }

  private parseJsonLD(head: Element): ParsingResult | undefined {
    const elements = CSSSelect.selectAll(
      'script[type="application/ld+json"]',
      head,
    );

    if (elements) {
      for (const element of elements) {
        const content = DomUtils.innerText(element.childNodes);

        let jsonLD;
        try {
          jsonLD = JSON.parse(content);
        } catch (err) {
          console.log(err);
          continue;
        }

        if (jsonLD['@type'] !== 'Product') {
          continue;
        }

        const descriptionDoc = parseDocument(
          jsonLD.description ?? this.parseDescription(head),
        );

        return {
          title: jsonLD.name ?? this.parseTitle(head),
          description: DomUtils.textContent(descriptionDoc.childNodes),
          price: jsonLD.offers
            ? this.parseJsonLDPrice(jsonLD.offers)
            : this.parsePrice(head),
          url: this.parseUrl(head),
          images: jsonLD.image
            ? this.parseJsonLDImage(jsonLD.image)
            : this.parseImageUrl(head),
        };
      }
    }

    return undefined;
  }

  private parseJsonLDPrice(offers: any): string | undefined {
    if (Array.isArray(offers) && offers.length > 0) {
      const offer = offers[0];

      if (offer.priceSpecification) {
        if (
          Array.isArray(offer.priceSpecification) &&
          offer.priceSpecification.length > 0
        ) {
          return offer.priceSpecification[0].price?.toString();
        } else {
          return offer.priceSpecification.price?.toString();
        }
      } else {
        return offer.price?.toString();
      }
    } else {
      return offers.price?.toString();
    }
  }

  private parseJsonLDImage(image: any): string[] | undefined {
    switch (image.constructor) {
      case String:
        return [image];
      case Object:
        return [image.url];
      case Array:
        return image as string[];
    }
  }
}

export default HtmlParser;
