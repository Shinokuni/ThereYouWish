class Util {
  static isStringUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return true;
    } catch (err) {
      return false;
    }
  }

  static getURLrootDomain(url: string): string | undefined {
    const parts = new URL(url).host.split('.');

    if (parts.length > 1) {
      return parts[parts.length - 2]; // get the before last
    }
  }
}

export default Util;
