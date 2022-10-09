const fs = require("fs");
const path = require("path");
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;
// 获取指定标签的节点内容
const getChildElementNode = require("./GetChildElementNode");
// 加载模板文件内容
const htmlContent = fs.readFileSync(
  path.join(__dirname, "../template/index.html"),
  {
    encoding: "utf-8",
  }
);
const defaultJSContent = fs.readFileSync(
  path.join(__dirname, "../template/default.js"),
  {
    encoding: "utf-8",
  }
);

class HTMLBuilder {
  constructor() {}

  build(
    options = {
      body: null,
      script: null,
      style: null,
      head: null,
      title: null,
    }
  ) {
    const doms = new dom().parseFromString(htmlContent);
    const nodes = xpath.select("//*", doms);
    const headNode = getChildElementNode(nodes[0], "head");
    const bodyNode = getChildElementNode(nodes[0], "body");

    const { body, style, script, head, title } = options;

    // 添加默认脚本
    headNode.appendChild(
      new dom().parseFromString(
        ` <script>
            ${defaultJSContent}
          </script>
        `
      )
    );
    if (!style) {
      // 设置默认样式
      headNode.appendChild(
        new dom().parseFromString(
          `  <link id="default-css-local" rel="stylesheet" href="/css/bingTranslate/default.css">`
        )
      );
    } else {
      // 添加传入的样式文件内容
      headNode.appendChild(
        new dom().parseFromString(
          `  <style> 
            ${style}
            </style>`
        )
      );
    }
    // 设置浏览器title
    let titleName = title || "bing词典翻译";
    let tmpNode = getChildElementNode(headNode, "title");
    tmpNode.parentNode.replaceChild(
      new dom().parseFromString(`<title>${titleName}</title>`),
      tmpNode
    );
    // 添加body内容
    if (body) {
      // console.log(bodyNode);
      bodyNode.appendChild(new dom().parseFromString(body));
      // console.log(bodyNode.toString());
    }
    // 添加script内容
    if (script) {
      bodyNode.appendChild(
        new dom().parseFromString(
          `  <script> 
            ${script.toString()}
            </script>`
        )
      );
    }
    // 添加head内容
    if (head) {
      headNode.appendChild(new dom().parseFromString(head));
    }
    let result = nodes[0].toString();
    result = result.replace(/&amp;/g, "&");
    result = result.replace(/&lt;/g, "<");
    result = result.replace(/&gt;/g, ">");
    return result;
  }
}

module.exports = HTMLBuilder;
