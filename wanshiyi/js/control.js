const historyStack = [];

function setNavVisible(visible) {
  const nav = document.getElementById("page-nav");
  nav.classList.toggle("is-visible", visible);
}

function showScene(id, { pushHistory = true } = {}) {
  const scene = SCENES[id];

  const sceneTextEl = document.getElementById("scene-text");
  const choicesEl = document.getElementById("choices");
  const noteEl = document.getElementById("footer-note");

  if (!scene) {
    sceneTextEl.innerHTML = "<p>（这个场景还没写好……）</p>";
    choicesEl.innerHTML = "";
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = "返回开头";
    btn.onclick = () => showScene("start");
    choicesEl.appendChild(btn);
    noteEl.textContent = "";
    setNavVisible(historyStack.length > 1);
    return;
  }

  if (pushHistory) {
    const encouragingNoDup = historyStack[historyStack.length - 1] !== id;
    if (encouragingNoDup) historyStack.push(id);
  }

  sceneTextEl.innerHTML = scene.text;
  const ps = sceneTextEl.querySelectorAll("p");

  choicesEl.innerHTML = "";
  (scene.choices || []).forEach((choice) => {
    const btn = document.createElement("div");
    btn.className = "choice";
    btn.textContent = choice.label;

    btn.style.opacity = 0;
    btn.style.animation = `bookFade 0.45s ease forwards`;
    btn.style.animationDelay = `${0.25 + ps.length * 0.12}s`;

    btn.onclick = () => showScene(choice.target);
    choicesEl.appendChild(btn);
  });

  noteEl.textContent = scene.note || "";

  setNavVisible(historyStack.length > 1);
}

/* 导航：前页 / 卷首 */
document.getElementById("nav-back").onclick = () => {
  if (historyStack.length <= 1) return;

  historyStack.pop();               // 弹出当前
  const prev = historyStack.pop();  // 拿到上一页并暂时弹出
  showScene(prev, { pushHistory: true });
};

document.getElementById("nav-home").onclick = () => {
  historyStack.length = 0;
  showScene("start");
};

/* 封面进入 */
document.getElementById("enter-story").onclick = () => {
  document.getElementById("cover").style.display = "none";
  historyStack.length = 0;
  showScene("start");
};
