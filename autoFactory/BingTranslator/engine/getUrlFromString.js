function getUrl(s) {
  let reg =
    /(https?|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|]/g;
  s = s.match(reg);
  console.log(s);
  return s;
}

module.exports = getUrl;
