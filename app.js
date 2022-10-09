const fs = require('fs');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const WebHtmlParse = require('./autoFactory/BingTranslator/engine/webHtmlParse');
const parser = new WebHtmlParse();
function CheckChinese(val) {
  let reg = new RegExp('[\\u4E00-\\u9FFF]+', 'g');
  return reg.test(val);
}

/**
 * 获取字典翻译页面
 */
router.get('/api/translate/bing/html', async (ctx) => {
  let { q } = ctx.query;
  if (!q || typeof q !== 'string') {
    ctx.body = '请求参数错误';
    return;
  }
  const config = fs.readFileSync(path.join(__dirname, './config.json'), {
    encoding: 'utf-8'
  });

  try {
    let htmlString = fs.readFileSync(path.join(__dirname, './autoFactory/BingHtml/translate/', q + '.html'), { encoding: 'utf-8' });
    ctx.body = htmlString;
  } catch (error) {
    const url = `https://cn.bing.com/dict/search?q=${CheckChinese(q) ? encodeURI(q) : q}&cc=${config.cc}&form=${config.from}`;
    return parser.parse(url).then(
      (res) => {
        // console.log(res);
        console.log('爬虫成功');
        ctx.body = res;
      },
      (err) => {
        console.log(err);
        ctx.body = err;
      }
    );
  }
});

/**
 * 获取json格式的内容
 */
router.get('/api/translate/bing/json', async (ctx) => {
  let { q } = ctx.query;
  if (!q || typeof q !== 'string') {
    ctx.body = '请求参数错误';
    return;
  }

  const config = fs.readFileSync(path.join(__dirname, './config.json'), {
    encoding: 'utf-8'
  });

  try {
    let jsonString = fs.readFileSync(path.join(__dirname, './autoFactory/BingHtml/json/', q + '.json'), { encoding: 'utf-8' });
    ctx.body = jsonString;
  } catch (error) {
    const url = `https://cn.bing.com/dict/search?q=${CheckChinese(q) ? encodeURI(q) : q}&cc=${config.cc}&form=${config.from}`;
    return parser.parse(url).then(
      (res) => {
        console.log(res);
        console.log('爬虫成功');
        let jsonString = fs.readFileSync(path.join(__dirname, './autoFactory/BingHtml/json/', q + '.json'), { encoding: 'utf-8' });
        ctx.body = jsonString;
      },
      (err) => {
        console.log(err);
        ctx.body = err;
      }
    );
  }
});

app.use(router.allowedMethods());
app.use(router.routes());
app.listen(9000, () => {
  console.log('启动成功');
  console.log(`http://localhost:9000`);
});
