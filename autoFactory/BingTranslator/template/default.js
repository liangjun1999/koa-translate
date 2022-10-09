// 默认脚本,这里添加公共样式报错后，自动请求本地样式
window.addEventListener(
  "error",
  function (e) {
    const tag = e.target.localName;
    if (tag === "link" || tag === "script") {
      // 错误处理
      console.log(e);
      if (e.target) {
        if (e.target.getAttribute("id") === "default-css-local") {
          let doc = document;
          let link = doc.createElement("link");
          link.setAttribute("rel", "stylesheet");
          link.setAttribute("type", "text/css");
          link.setAttribute("id", "default-css");
          link.setAttribute("href", "./default.css");
          let heads = doc.getElementsByTagName("head");
          if (heads.length) heads[0].appendChild(link);
          else doc.documentElement.appendChild(link);
        } else if (e.target.getAttribute("id") === "default-css") {
        }
      }
    }
  },
  true
);
