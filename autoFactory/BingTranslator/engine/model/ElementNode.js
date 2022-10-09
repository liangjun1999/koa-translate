/**
 * 重新封装 xmldom 节点， 复制其所有原属性,增加设置自身值的属性
 */
class ElementNode {
  constructor(_value) {
    this.value = _value;
    // 复制当前节点的所有属性
    for (let k in _value) {
      this[k] = _value[k];
    }
  }
  setValue(newValue) {
    this.value.parentNode.replaceChild(newValue, this.value);
  }
}

module.exports = ElementNode;
