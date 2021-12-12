import { setupGround, updateGround } from "./ground.js";
import { setupDino, updateDino, getDinoRect, setDinoLoose } from "./dino.js";
import { updateCactus, setupCactus, getCactusRects } from "./cactus.js";

const WORLD_WIDTH = 100;
const WORLD_HEIGHT = 30;
const SPEED_SCALE_INCREASE = 0.00001;

const worldElem = document.querySelector("[data-world]");
const scoreELem = document.querySelector("[data-score]");
const startScreenElem = document.querySelector("[data-start-screen]");

setPixelToWorldScale();
window.addEventListener("resize", setPixelToWorldScale);
document.addEventListener("keydown", handleStart, { once: true });

let lastTime;
let speedScale;
let score;
function update(time) {
  if (lastTime == null) {
    lastTime = time;
    window.requestAnimationFrame(update);
    return;
  }
  const delta = time - lastTime;
  updateGround(delta, speedScale);
  updateDino(delta, speedScale);
  updateScpeedScale(delta);
  updateScore(delta);
  updateCactus(delta, speedScale);
  if (checkLoose()) {
    return handleLoose();
  }
  lastTime = time;
  window.requestAnimationFrame(update);
}

function checkLoose() {
  const dinoRect = getDinoRect();
  return getCactusRects().some((cactusRect) => {
    return (
      dinoRect.left < cactusRect.right &&
      dinoRect.right > cactusRect.left &&
      dinoRect.top < cactusRect.bottom &&
      dinoRect.bottom > cactusRect.top
    );
  });
}

function updateScpeedScale(delta) {
  speedScale += delta * SPEED_SCALE_INCREASE;
}

function updateScore(delta) {
  score += delta * 0.01;
  scoreELem.textContent = Math.floor(score);
}

function handleStart() {
  lastTime = null;
  speedScale = 1;
  score = 0;
  setupGround();
  setupDino();
  setupCactus();
  startScreenElem.classList.add("hide");
  window.requestAnimationFrame(update);
}

function handleLoose() {
  setDinoLoose();
  setTimeout(() => {
    document.addEventListener("keydown", handleStart, { once: true });
    startScreenElem.classList.remove("hide");
  }, 80);
}

function setPixelToWorldScale() {
  let worldToPixelScale;
  if (window.innerWidth / window.innerHeight < WORLD_WIDTH / WORLD_HEIGHT) {
    worldToPixelScale = window.innerWidth / WORLD_WIDTH;
  } else {
    worldToPixelScale = window.innerHeight / WORLD_HEIGHT;
  }

  worldElem.style.width = `${WORLD_WIDTH * worldToPixelScale}px`;
  worldElem.style.height = `${WORLD_HEIGHT * worldToPixelScale}px`;
}
