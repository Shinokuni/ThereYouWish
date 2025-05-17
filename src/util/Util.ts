class Util {
  static isStringUrl(value: string): boolean {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const url = new URL(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  static getURLrootDomain(url: string): string | undefined {
    try {
      const parts = new URL(url).host.split('.');

      if (parts.length > 1) {
        return parts[parts.length - 2]; // get the before last
      }
    } catch (err) {
      return undefined;
    }
  }

  static formatPrice(
    price: number,
    languageCode: string,
    currency: string,
  ): string {
    return price.toLocaleString(languageCode, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    });
  }
}

export default Util;
