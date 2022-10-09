const fs = require("fs");
const path = require("path");
const WebHtmlParse = require("../engine/webHtmlParse");
const parser = new WebHtmlParse();
function CheckChinese(val) {
  let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(val);
}

const RunTest = (q) => {
  const config = JSON.parse(
    fs.readFileSync(path.join(__dirname, "../../../api/config.json"), {
      encoding: "utf-8",
    })
  );
  try {
    let htmlString = fs.readFileSync(
      path.join(__dirname, "../../BingHtml/translate/", q + ".html"),
      { encoding: "utf-8" }
    );
    console.log("已经有构造过的资源");
    // ctx.body = htmlString;
  } catch (error) {
    const url = `https://cn.bing.com/dict/search?q=${
      CheckChinese(q) ? encodeURI(q) : q
    }&cc=${config.cc}&form=${config.from}`;
    // parser.parse(url).then(
    //   (res) => {
    //     console.log(res);
    //     console.log("爬虫成功");
    //   },
    //   (err) => {
    //     console.log(err);
    //   }
    // );
    const htmlString = fs.readFileSync(
      path.join(__dirname, "../../BingHtml/origin/口罩.html"),
      {
        encoding: "utf-8",
      }
    );
    parser.parseWithHtml(htmlString, "口罩").then(
      (res) => {
        console.log(res);
        console.log("爬虫成功");
      },
      (err) => {
        console.log(err);
      }
    );
  }
};
RunTest("口罩");
