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
    sceneTextEl.innerHTML = "<p> error. wrong scene label.</p>";
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
    btn.style.animationDelay = `${0.25 + 0*ps.length * 0.12}s`;

    btn.onclick = () => showScene(choice.target);
    choicesEl.appendChild(btn);
  });

  noteEl.textContent = scene.note || "";

  setNavVisible(historyStack.length > 1);
}



/* navigation */
document.getElementById("nav-back").onclick = () => {
  if (historyStack.length <= 1) return;

  historyStack.pop();               
  const prev = historyStack.pop();  
  showScene(prev, { pushHistory: true });
};

document.getElementById("nav-home").onclick = () => {
  historyStack.length = 0;
  showScene("start");
};


document.addEventListener("DOMContentLoaded", () => {
  const title = document.querySelector(".cover-title");
  const quote = document.querySelector(".cover-quote");
  const btn   = document.getElementById("enter-story");

  // if (title) {
  //   title.style.opacity = 0;
  //   title.style.animation = "bookFade 1.2s ease forwards";
  // }

  if (quote) {
    quote.style.opacity = 0;
    quote.style.animation = "bookFade 1.2s ease forwards";
    quote.style.animationDelay = "0.7s";
  }

  if (btn) {
    btn.style.opacity = 0;
    btn.style.animation = "bookFade 0.8s ease forwards";
    btn.style.animationDelay = "2s";
  }
});

document.getElementById("enter-story").onclick = () => {
  const cover = document.getElementById("cover");

  cover.style.animation = "bookFade 0.6s ease forwards reverse";

  setTimeout(() => {
    cover.style.display = "none";
  }, 600);
  historyStack.length = 0;
  showScene("start");
};
