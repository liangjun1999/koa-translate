const request = require("request");
const fs = require("fs");
const getQueryString = require("./GetQueryString");
const path = require("path");
/**
 * 判断是否含有中文
 * @param {*} val
 * @returns
 */
function CheckChinese(val) {
  let reg = new RegExp("[\\u4E00-\\u9FFF]+", "g");
  return reg.test(val);
}
/**
 * 下载html文件
 * @param {*} url
 * @returns
 */
function downloadHTML(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, response, body) => {
      /*
        response 响应信息的集合
      */
      if (!err && response.statusCode == 200) {
        // console.log(body);
        let docName = getQueryString(decodeURI(url), "q");
        docName = docName || new Date().getTime();
        let result = rejectHTMLElement(body);
        fs.writeFileSync(
          path.join(__dirname, "../../BingHtml/origin/", docName + ".html"),
          result,
          {
            encoding: "utf-8",
          }
        );
        resolve(result);
      }
      if (err) {
        console.log(err);
        reject(err);
      }
    });
  });
}

function rejectHTMLElement(dom) {
  let len = dom.length;
  let status = 0;
  let startIdx = 0;
  let endIdx = 0;
  let word = "";
  let emStack = [];
  let w = "";
  for (let i = 0; i < len; i++) {
    w = dom[i].toLowerCase();
    if (status === 0) {
      // 未进入匹配HTML模式
      if (w === "<") {
        status = 1;
        startIdx = i;
        endIdx = i;
        word = w;
        emStack = [];
      } else {
        continue;
      }
    } else if (status === 1) {
      // console.log(startIdx, endIdx, word, w);
      // 开启标签匹配模式
      let wLen = word.length;
      //下标字符 0:< 1:h 2:t 3:m 4:l
      if (wLen === 1) {
        // 已有 word = "<"
        if (w === "h") {
          word += w;
        } else {
          status = 0;
          continue;
        }
      } else if (wLen === 2) {
        if (w === "t") {
          word += w;
        } else {
          status = 0;
          continue;
        }
      } else if (wLen === 3) {
        if (w === "m") {
          word += w;
        } else {
          status = 0;
          continue;
        }
      } else if (wLen === 4) {
        if (w === "l") {
          word += w;
        } else {
          status = 0;
          continue;
        }
      } else if (wLen === 5) {
        if (w === " ") {
          word += w;
        } else {
          status = 0;
          continue;
        }
      } else if (wLen > 5) {
        // 已经五个字符了,开启 匹配 > 字符
        // console.log(w);
        let emLen = emStack.length;
        if (w === '"' || w === "'" || w === "`") {
          if (emLen > 0) {
            if (emStack[emLen - 1] !== w) {
              word += w;
            } else {
              word += w;
              emStack.pop();
            }
          } else {
            word += w;
            emStack.push(w);
          }
        } else {
          word += w;
          if (w === ">") {
            // console.log("匹配成功");
            if (emLen > 0) {
              // 栈非空，不管
            } else {
              // console.log(endIdx, i);
              endIdx = i;
              break;
            }
          } else {
            // console.log("匹配失败", w);
          }
        }
      }
    }
  }
  // console.log(startIdx, endIdx);
  return (
    dom.substring(0, startIdx) + '<html lang="en">' + dom.substring(endIdx + 1)
  );
}

module.exports = downloadHTML;

// // 测试用例

// let url = `https://cn.bing.com/dict/search?q=contradiction&cc=cn&form=BDVSP6`;
// downloadHTML(url).then((res) => {
//   console.log(res);
// });

// // let content = `<!DOCTYPE html><html dir="ltr" lang="zh" xml:lang="zh" xmlns="http://www.w3.org/1999/xhtml" xmlns:Web="http://schemas.live.com/Web/"><script type="text/javascript" >//<![CDATA[
// //   si_ST=new Date`;
