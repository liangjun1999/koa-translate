function CheckChinese(val) {
  let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(val);
}
module.exports = CheckChinese;
