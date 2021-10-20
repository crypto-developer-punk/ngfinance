class MathHelper {
  static toFixed = (num, fixnumber=4) => {
    return parseFloat(num.toFixed(fixnumber));
  }

  static parseFixedFloat = (str, fixnumber=4) => {
    return parseFloat(parseFloat(str).toFixed(fixnumber))
  }
};

export default MathHelper;