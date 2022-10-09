/**
 * 从输入的dom节点中，获取指定的标签元素, 如果没有则返回null
 * @param {*} node
 * @param {*} tagName
 * @returns
 */
function getChildElementNode(node, tagName) {
  if (!node.hasChildNodes()) {
    return null;
  }
  for (let key in node.childNodes) {
    let item = node.childNodes[key];
    if (item.tagName === tagName) {
      // return new ElementNode(key, node.childNodes[key], node);
      return node.childNodes[key];
    }
  }
  return null;
}

module.exports = getChildElementNode;
