/**
 * 从给定的URL上的queryString上面取参数
 */
function getQueryString(url, name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
  let r = null;
  let search = url.substring(url.indexOf("?")) || window.location.search;
  try {
    r = search.substr(1).match(reg);
  } catch (err) {
    console.log(err);
  }
  if (r != null) {
    return unescape(r[2]);
  }
  return "";
}

module.exports = getQueryString;
