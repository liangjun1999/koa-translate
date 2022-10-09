/**
 * 数组去重
 * @param {Array} arr
 * @returns
 */
function unique(arr) {
  return Array.from(new Set(arr));
}
module.exports = unique;
