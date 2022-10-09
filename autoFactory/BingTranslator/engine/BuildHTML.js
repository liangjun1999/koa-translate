function toHTML(
  options = {
    body: null,
    style: null,
    script: null,
  }
) {
  let { body, style, script } = options;
  let template = `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>bing词典翻译</title>
  </head>
  
  <style>
  ${style ? style : ""}
  </style>
  
  <body>
  <div id="noneViewer" style="position: fixed; left: - 100vw; top: 0; display: none;"></div>
  ${body ? body : ""}

  ${script ? "<script> \n" + script + "\n</script>" : ""}
  </body>
  
  </html>
  `;
  return template;
}

module.exports = toHTML;
