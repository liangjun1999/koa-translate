const downloadHTML = require("../engine/DownLoadHTML");
const getQueryString = require("../engine/GetQueryString");
const fs = require("fs");
const path = require("path");
function CheckChinese(val) {
  let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(val);
}

/**
 *
 */
const RunTest = (q) => {
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../../api/config.json"), {
      encoding: "utf-8",
    })
  );
  try {
    let htmlString = fs.readFileSync(
      path.join(__dirname, "../autoFactory/BingHtml/translate/", q + ".html"),
      { encoding: "utf-8" }
    );
    ctx.body = htmlString;
  } catch (error) {
    const url = `https://cn.bing.com/dict/search?q=${
      CheckChinese(q) ? encodeURI(q) : q
    }&cc=${config.cc}&form=${config.from}`;
    downloadHTML(url);
  }
};
RunTest("mask");
