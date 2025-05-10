class Util {
  static isStringUrl(value: string): boolean {
    try {
      const url = new URL(value);
      return true;
    } catch (err) {
      return false;
    }
  }
}

export default Util;
