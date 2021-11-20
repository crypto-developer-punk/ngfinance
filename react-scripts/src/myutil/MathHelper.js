class MathHelper {
  static toFixed = (num, fixnumber=4) => {
    return parseFloat(num.toFixed(fixnumber));
  }

  static parseFixedFloat = (str, fixnumber=4) => {
    return parseFloat(parseFloat(str).toFixed(fixnumber))
  }

  static getLastPointNumberTrimedStr = (str, precision=3) => {
    if (typeof(str) !== "string") {
      return str;
    }
    var nf = parseFloat(str);
    if (typeof nf === "number" && str.includes(".")) {
      const pointNumsStr = str.substring(str.indexOf("."), str.length-1);
      if (pointNumsStr.length < precision) {
        return str;
      }
      if (str.charAt(str.length-1) !== ".") {
        const newLastNum = parseInt(str.charAt(str.length-1)) - 1;
        str = str.substring(0, str.length-1);
        if (newLastNum !== 0) {
          str = str + newLastNum
        } 
        return str
      }
      str = str.substring(0, str.length-1);
      return str;
    }
    return str;
  }
};

export default MathHelper;