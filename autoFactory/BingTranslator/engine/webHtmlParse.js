const fs = require("fs");
const path = require("path");
const getUrl = require("./getUrlFromString");
const downloadHTML = require("./DownLoadHTML");
const HTMLBuilder = require("./HTMLBuilder");
const getQueryString = require("./GetQueryString");
const getChildElementNode = require("./GetChildElementNode");
const unique = require("./utils/unique");
const xpath = require("xpath");
const dom = require("xmldom").DOMParser;
const CheckChinese = require("./CheckChinese");

class WebHtmlParse {
  constructor() {
    this.doc = null;
    this.nodes1 = null;
    this.nodes2 = null;
    this.countIds = 0;
    this.countAudioIds = 0;
    this.word = ""; //单词
    this.audioTextList = []; //例句文本
    this.audioList = []; //例句音频地址
    this.bigaudTextList = []; //发音文本
    this.bigaudList = []; //发音音频地址
    this.phraseList = []; //词型
    this.posList = []; //词性
    this.language = "en"; //默认英文
  }

  init() {
    this.doc = null;
    this.nodes1 = null;
    this.nodes2 = null;
    this.countIds = 0;
    this.countAudioIds = 0;
    this.word = ""; //单词
    this.audioTextList = []; //例句文本
    this.audioList = []; //例句音频地址
    this.bigaudTextList = []; //发音文本
    this.bigaudList = []; //发音音频地址
    this.phraseList = []; //词型
    this.posList = []; //词性
  }
  /**
   * 生成音频Icon
   * @returns
   */
  getImgIcon(id = "") {
    let tempString = `
        <svg t="1657110576655" id="icon-bigaud-${id ? id : this.countIds}" 
              class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7951" width="200" height="200"><path d="M447.82 165.51c-7.12 0-14.4 2.41-20.65 7.77L224 320h-96c-17.67 0-32 14.33-32 32v320c0 17.67 14.33 32 32 32h96l203.18 146.72c6.25 5.36 13.53 7.77 20.65 7.77 16.52 0 32.18-12.96 32.18-32.06V197.57c-0.01-19.1-15.67-32.06-32.19-32.06zM416 763.71L261.47 652.12 244.69 640H160V384h84.69l16.78-12.12L416 260.29v503.42zM715.19 113.25c-14.69-9.88-34.59-5.91-44.41 8.72-9.84 14.67-5.94 34.56 8.72 44.41C795.03 243.94 864 373.14 864 512c0 138.88-68.97 268.06-184.5 345.62-14.66 9.84-18.56 29.72-8.72 44.41 6.16 9.19 16.28 14.16 26.59 14.16 6.12 0 12.34-1.75 17.81-5.44C848.44 821.31 928 672.22 928 512s-79.56-309.28-212.81-398.75z" p-id="7952" fill="#A1A1AF"> </path><path d="M790.16 512c0-109.95-53.62-213.97-143.47-278.23-14.41-10.27-34.38-6.95-44.66 7.41-10.28 14.38-6.97 34.38 7.41 44.66C682.53 338.09 726.16 422.66 726.16 512s-43.62 173.91-116.72 226.16c-14.38 10.28-17.69 30.28-7.41 44.66 6.25 8.72 16.09 13.38 26.06 13.38 6.44 0 12.94-1.94 18.59-5.97C736.53 725.97 790.16 621.97 790.16 512z" p-id="7953" fill="#A1A1AF"> <path d="M578.91 356.14c-13.53-11.33-33.69-9.59-45.09 3.91-11.36 13.53-9.62 33.72 3.91 45.09 32.16 27.03 50.59 65.98 50.59 106.86s-18.44 79.81-50.59 106.84c-13.53 11.38-15.28 31.56-3.91 45.09 6.33 7.53 15.41 11.41 24.53 11.41 7.25 0 14.56-2.47 20.56-7.5 46.66-39.22 73.41-96 73.41-155.84-0.01-59.83-26.76-116.62-73.41-155.86z" p-id="7954" fill="#A1A1AF"> </path></svg>`;
    let tempDom = new dom().parseFromString(tempString, "text/html");
    if (!id) ++this.countIds;
    return tempDom;
  }

  /**
   * 生成音频路径文件
   * @param {*} src
   * @returns
   */
  getAudio(src, id = "") {
    let tempDom = `<span id="audio-id-${
      id ? id : this.countAudioIds
    }" src="${src}" style="display: none;"> </span>`;
    if (!id) ++this.countAudioIds;
    return tempDom;
  }

  /**
   * 对词型文本解析
   * @param {*} _tmpFormsDom
   * @returns
   */
  getPhraseString(_tmpFormsDom) {
    let spanNodes = xpath.select("//span", _tmpFormsDom);
    let aNodes = xpath.select("//a", _tmpFormsDom);
    let spanTextList = [];
    spanNodes.forEach((span) => {
      spanTextList.push(
        xpath.select(
          "string(//span)",
          new dom().parseFromString(span.toString())
        )
      );
    });
    let aTextList = [];
    aNodes.forEach((a) => {
      aTextList.push(
        xpath.select("string(//a)", new dom().parseFromString(a.toString()))
      );
    });
    // console.log(spanTextList.join(","));
    // console.log(aTextList.join(","));
    let formsList = [];
    for (let i = 0; i < aTextList.length; i++) {
      formsList.push({
        en: aTextList[i],
        zh: spanTextList[i],
      });
    }
    this.phraseList = [
      ...formsList.map((item) => {
        return { en: item.en.trim(), zh: item.zh.replace("：", "") };
      }),
    ]; //保存词型到类中
    return formsList
      .map((item) => {
        return `<span class="hd_section"><span class="b_primtxt">${item.zh}</span>
      <span class="p1-5">${item.en} </span></span>`;
      })
      .join("\n");
  }

  /**
   * 对词性进行处理
   * @param {*} node
   */
  rejectPos(node) {
    let tempList = [];
    // pos
    let liNodes = xpath.select("//li", node);
    // console.log(liNodes.toString());
    liNodes.forEach((item) => {
      let temDom = new dom().parseFromString(item.toString());
      let pos = xpath.select(
        `string(//span[@class="pos" or (@class="pos web")])`,
        temDom
      );
      let regtxts = xpath.select(
        `string(//span[@class="def b_regtxt"])`,
        temDom
      );
      tempList.push({
        verb: pos.replace(".", ""),
        examples: regtxts.split("；"),
      });
    });
    // console.log(
    //   tempList
    //     .map((item) => item.verb + ". " + item.examples.join("；"))
    //     .join("\n")
    // );
    this.posList = [...tempList];
  }

  /**
   * 修改a标签中的链接，由 /dict/search → /api/translate/bing/html
   * @param {*} node
   */
  changeLink(str) {
    return str.replace(/\/dict\/search/g, "/api/translate/bing/html");
  }

  /**
   * 对单次解释的内容进行处理
   * @param {*} node
   */
  qdefReject(node) {
    // 获取词型
    let phraseString = "";
    let content = new dom().parseFromString(node.toString());
    let ulNodesString = "";
    let ulNodes = xpath.select("//ul", content);
    if (ulNodes && ulNodes instanceof Array && ulNodes.length) {
      this.rejectPos(ulNodes[0]);
      // 对a标签跳转链接修改
      ulNodesString = this.changeLink(ulNodes[0].toString());
    }
    let wordNodes = xpath.select('//div[@id="headword"]', content);
    let div1Nodes = xpath.select('//div[@class="hd_div1"]', content);
    if (div1Nodes && div1Nodes instanceof Array && div1Nodes.length) {
      // 词的其它形式节点
      let formsNodes = xpath.select('//div[@class="hd_if"]', div1Nodes[0]);
      let tmpFormsDom = new dom().parseFromString(formsNodes[0].toString());
      phraseString = `<div class="hd_if">
      ${this.getPhraseString(tmpFormsDom)}
      </div>
    `;
    }

    // 获取音频链接
    let voNodes = xpath.select('//a[@class="bigaud"]', this.doc);
    // console.log(voNodes.length);
    let audioList = [];
    // 将所有音频存起来
    voNodes.forEach((item) => {
      audioList = audioList.concat(unique(getUrl(item.toString())));
    });
    // console.log(audioList);

    this.bigaudTextList = [];
    this.bigaudList = [];
    let primTextContent = "";
    // 英文才有下面发音模块
    if (this.language === "en") {
      // 美式发音
      let hdNodes1 = xpath.select(
        '//div[@class="hd_prUS b_primtxt"]',
        this.doc
      );
      hdNodes1[0].appendChild(this.getImgIcon());
      hdNodes1[0].setAttribute("id", "bigaud-0");
      let tempSrc1 = audioList.shift();
      hdNodes1[0].setAttribute("src", tempSrc1);
      this.bigaudList.push(tempSrc1); // 存到类变量

      let bigaudText1 = xpath.select(
        'string(//div[@class="hd_prUS b_primtxt"])',
        hdNodes1[0]
      );
      this.bigaudTextList.push({
        pr: bigaudText1.substring(0, 1),
        value: bigaudText1.substring(3, 6),
        audioSrc: tempSrc1,
      });

      // 英式发音
      let hdNodes2 = xpath.select('//div[@class="hd_pr b_primtxt"]', this.doc);
      hdNodes2[0].appendChild(this.getImgIcon());
      hdNodes2[0].setAttribute("id", "bigaud-1");
      let tempSrc2 = audioList.shift();
      hdNodes2[0].setAttribute("src", tempSrc2);
      this.bigaudList.push(tempSrc2); // 存到类变量

      let bigaudText2 = xpath.select(
        'string(//div[@class="hd_pr b_primtxt"])',
        hdNodes2[0]
      );
      this.bigaudTextList.push({
        pr: bigaudText2.substring(0, 1),
        value: bigaudText2.substring(3, 6),
        audioSrc: tempSrc2,
      });

      primTextContent = `<div id="primTextContent" class="primTextContent">
      ${hdNodes1.toString()}
      ${hdNodes2.toString()}
    </div>`;
    }

    // 剩下的音频全保存到dom文档内
    let noneContent = '<div id="srcContent" style="display: none;">';
    this.audioList = [...audioList]; // 存到类变量
    audioList.forEach((item) => {
      noneContent += this.getAudio(item);
    });
    noneContent += " </div>";

    node.toString = () => {
      return (
        noneContent +
        "\n" +
        wordNodes.toString() +
        "\n" +
        primTextContent +
        "\n" +
        ulNodesString +
        "\n" +
        phraseString
      );
    };
  }

  /**
   * 获取所有例句的dom，并处理
   * @param {*} nodes
   */
  sectionText(nodes) {
    let res = "";
    let sentenceIds = 0;
    this.audioTextList = [];
    nodes.forEach((item) => {
      let sectionContent = xpath.select(
        '//div[@class="se_li1"]',
        new dom().parseFromString(item.toString())
      );
      // console.log(sectionContent);
      let tempRes = `<div class="sentenceContent" id="sentence-${sentenceIds}">`;
      ++sentenceIds;
      for (let sectionItem of sectionContent) {
        let liDom = new dom().parseFromString(sectionItem.toString());
        let contentEn = xpath.select(
          'string(//div[@class="sen_en b_regtxt"])',
          liDom
        );
        tempRes += `<span class="sentence en">${
          contentEn.trim() + this.getImgIcon("ce-" + sentenceIds)
        }</span>`;
        let contentZh = xpath.select(
          'string(//div[@class="sen_cn b_regtxt"])',
          liDom
        );
        tempRes += `<span class="sentence zh">${contentZh.trim()}</span>`;
        let contentAddr = xpath.select(
          'string(//div[@class="sen_li b_regtxt"])',
          liDom
        );
        tempRes += `<span class="sentence ads">${contentAddr.trim()}</span>`;
        this.audioTextList.push({
          en: contentEn.trim(),
          zh: contentZh.trim(),
          addr: contentAddr.trim(),
        });
      }
      res += tempRes + "</div>\n";
    });

    nodes.toString = () => {
      return res;
    };
  }

  /**
   * 对bing的web页面解析
   * @param {*} url
   * @returns
   */
  parse(url) {
    this.init();
    return new Promise((resolve, reject) => {
      downloadHTML(url).then(
        (res) => {
          try {
            let content = res.replace("javascript:void(0)", "''");
            let docName =
              getQueryString(decodeURI(url), "q") || new Date().getTime();
            this.language = CheckChinese(docName) ? "zh" : "en";
            this.doc = new dom().parseFromString(content);
            this.nodes1 = xpath.select('//div[@class="qdef"]', this.doc);
            this.nodes2 = xpath.select('//div[@class="se_li1"]', this.doc);
            // console.log(this.nodes1[0].toString());

            this.sectionText(this.nodes2);
            this.qdefReject(this.nodes1[0]);
            let style = fs.readFileSync(
              path.join(__dirname, "../template/default.css"),
              {
                encoding: "utf-8",
              }
            );
            let script = fs.readFileSync(
              path.join(__dirname, "../template/index.js"),
              {
                encoding: "utf-8",
              }
            );
            this.word = docName;
            const builder = new HTMLBuilder();
            let htmlString = builder.build({
              body: this.nodes1[0].toString() + this.nodes2.toString(),
              style: style,
              script: script,
              title: docName + " - Bing 词典",
            });

            let adLen = this.audioTextList.length;
            for (let i = 0; i < adLen; i++) {
              try {
                this.audioTextList[i].audioSrc = this.audioList[i];
              } catch (error) {
                console.log(error);
              }
            }

            const apiData = {
              word: this.word,
              audioText: this.audioTextList,
              bigaudText: this.bigaudTextList,
              phrase: this.phraseList,
              pos: this.posList,
            };

            // console.log(
            //   "word: ",
            //   this.word,
            //   "audioTextList: ",
            //   this.audioTextList,
            //   // "audioList: ",
            //   // this.audioList,
            //   "bigaudTextList: ",
            //   this.bigaudTextList,
            //   // "bigaudList: ",
            //   // this.bigaudList,
            //   "phraseList: ",
            //   this.phraseList,
            //   "posList: ",
            //   this.posList
            // );
            fs.writeFileSync(
              path.join(
                __dirname,
                "../../BingHtml/translate/",
                docName + ".html"
              ),
              htmlString,
              {
                encoding: "utf-8",
              }
            );
            fs.writeFileSync(
              path.join(__dirname, "../../BingHtml/json", docName + ".json"),
              JSON.stringify(apiData),
              {
                encoding: "utf-8",
              }
            );
            resolve(htmlString);
          } catch (error) {
            reject(error);
          }
        },
        (err) => {
          reject(err);
        }
      );
    });
  }

  /**
   * 对bing的页面解析
   * @param {*} html
   * @returns
   */
  parseWithHtml(html, docName) {
    this.init();
    return new Promise((resolve, reject) => {
      try {
        let content = html.replace("javascript:void(0)", "''");
        this.language = CheckChinese(docName) ? "zh" : "en";
        this.doc = new dom().parseFromString(content);
        this.nodes1 = xpath.select('//div[@class="qdef"]', this.doc);
        this.nodes2 = xpath.select('//div[@class="se_li1"]', this.doc);
        // console.log(this.nodes1[0].toString());

        this.sectionText(this.nodes2);
        this.qdefReject(this.nodes1[0]);
        let style = fs.readFileSync(
          path.join(__dirname, "../template/default.css"),
          {
            encoding: "utf-8",
          }
        );
        let script = fs.readFileSync(
          path.join(__dirname, "../template/index.js"),
          {
            encoding: "utf-8",
          }
        );
        this.word = docName;
        const builder = new HTMLBuilder();
        let htmlString = builder.build({
          body: this.nodes1[0].toString() + this.nodes2.toString(),
          style: style,
          script: script,
          title: docName + " - Bing 词典",
        });

        let adLen = this.audioTextList.length;
        for (let i = 0; i < adLen; i++) {
          try {
            this.audioTextList[i].audioSrc = this.audioList[i];
          } catch (error) {
            console.log(error);
          }
        }

        const apiData = {
          word: this.word,
          audioText: this.audioTextList,
          bigaudText: this.bigaudTextList,
          phrase: this.phraseList,
          pos: this.posList,
        };

        // console.log(
        //   "word: ",
        //   this.word,
        //   "audioTextList: ",
        //   this.audioTextList,
        //   // "audioList: ",
        //   // this.audioList,
        //   "bigaudTextList: ",
        //   this.bigaudTextList,
        //   // "bigaudList: ",
        //   // this.bigaudList,
        //   "phraseList: ",
        //   this.phraseList,
        //   "posList: ",
        //   this.posList
        // );
        fs.writeFileSync(
          path.join(__dirname, "../../BingHtml/translate/", docName + ".html"),
          htmlString,
          {
            encoding: "utf-8",
          }
        );
        fs.writeFileSync(
          path.join(__dirname, "../../BingHtml/json", docName + ".json"),
          JSON.stringify(apiData),
          {
            encoding: "utf-8",
          }
        );
        resolve(htmlString);
      } catch (error) {
        reject(error);
      }
    });
  }
}

module.exports = WebHtmlParse;

// const _parser = new WebHtmlParse();
// _parser.parse("http://localhost:9999/api/translate/bing?q=mess");
