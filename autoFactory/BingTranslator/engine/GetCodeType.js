/**
 * 判断句子的文本类型:
 * 1. 匹配到网址，则返回 address 类型
 * 2. 匹配到中文，则返回 zh 类型
 * 3. 匹配到不包含中文，则返回 en 类型
 * @param {*} str
 */
function getCodeType(str) {
  if (/(https:\/\/|http:\/\/){0,1}(\.[\w\-_]+)+/.test(str)) {
    return "ads";
  } else if (/[\u4e00-\u9fa5]/.test(str)) {
    return "zh";
  } else {
    return "en";
  }
}

module.exports = getCodeType;
