const EMOJI = { rock: "✊", paper: "✋", scissors: "✌️" };
const RESULT_LABEL = { win: "WIN", lose: "LOSE", draw: "DRAW" };

const userEmoji    = document.getElementById("user-emoji");
const cpuEmoji     = document.getElementById("cpu-emoji");
const resultBadge  = document.getElementById("result-badge");
const scoreUser    = document.getElementById("score-user");
const scoreCpu     = document.getElementById("score-cpu");
const errorMsg     = document.getElementById("error-msg");
const buttons      = document.querySelectorAll(".btn");

function pop(el) {
  el.classList.remove("pop");
  void el.offsetWidth;
  el.classList.add("pop");
}

function flashScore(el, result) {
  el.classList.remove("flash-win", "flash-lose");
  void el.offsetWidth;
  if (result === "win")  el.classList.add("flash-win");
  if (result === "lose") el.classList.add("flash-lose");
}

async function play(choice) {
  errorMsg.textContent = "";
  buttons.forEach(b => b.classList.toggle("active", b.dataset.choice === choice));

  let data;
  try {
    const res = await fetch("/play", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ choice }),
    });
    data = await res.json();
    if (!res.ok) throw new Error(data.error || "Server error");
  } catch (err) {
    errorMsg.textContent = err.message;
    return;
  }

  userEmoji.textContent = EMOJI[data.user];
  cpuEmoji.textContent  = EMOJI[data.computer];
  pop(userEmoji);
  pop(cpuEmoji);

  resultBadge.textContent = RESULT_LABEL[data.result];
  resultBadge.className   = `result-badge ${data.result}`;

  scoreUser.textContent = data.score.user;
  scoreCpu.textContent  = data.score.computer;

  flashScore(scoreUser, data.result);
  flashScore(scoreCpu,  data.result === "lose" ? "win" : data.result === "win" ? "lose" : "draw");
}

buttons.forEach(btn => btn.addEventListener("click", () => play(btn.dataset.choice)));
