let bigauds = document.querySelectorAll('*[id*="icon-bigaud-"]');
let audio = null;
// console.log(bigauds);
if (bigauds && bigauds instanceof NodeList) {
  bigauds.forEach((elm) => {
    elm.addEventListener("click", () => {
      // console.log("点击了第:  " + (idx + 1) + " 个音频");
      if (audio) {
        // console.log("已存在", audio);
        audio.pause();
        audio = null;
      }
      let src = "";
      let id = elm.getAttribute("id");
      // 例句音频
      let ids = id.split("-");
      if (id.indexOf("-ce-") !== -1) {
        src = document
          .getElementById(`audio-id-${Number(ids[ids.length - 1]) - 1}`)
          .getAttribute("src");
      } else {
        src = document
          .getElementById(`bigaud-${ids[ids.length - 1]}`)
          .getAttribute("src");
      }
      audio = document.createElement("audio");
      let audioSource = document.createElement("source");
      audio.setAttribute("id", "audio");
      audio.setAttribute("style", "display: none");
      audioSource.setAttribute("id", "audio-source");
      audioSource.setAttribute("src", src);
      audio.appendChild(audioSource);
      audio.play();
      audio.onended = () => {
        audio.remove();
      };
    });
  });
}
