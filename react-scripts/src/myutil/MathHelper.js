class MathHelper {
  static toFixed = (num, fixnumber=4) => {
    return parseFloat(num.toFixed(fixnumber));
  }
};

export default MathHelper;