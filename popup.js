const challengeInput = document.getElementById("challenge");
const saveBtn = document.getElementById("saveBtn");
const completeBtn = document.getElementById("completeBtn");
const statusText = document.getElementById("status");
const historyList = document.getElementById("history");

function getTodayKey() {
  const today = new Date();
  return today.toISOString().split("T")[0];
}

function loadHistory() {
  chrome.storage.local.get(["history"], (data) => {
    const history = data.history || [];
    historyList.innerHTML = "";
    history.slice(-7).reverse().forEach(entry => {
      const li = document.createElement("li");
      li.textContent = `${entry.date}: ${entry.text} ${entry.done ? "✅" : "❌"}`;
      historyList.appendChild(li);
    });
  });
}

function updateTodayDisplay() {
  const todayKey = getTodayKey();
  chrome.storage.local.get([todayKey], (data) => {
    const todayData = data[todayKey] || { text: "", done: false };
    challengeInput.value = todayData.text || "";
    completeBtn.disabled = !!todayData.done;
    statusText.textContent = todayData.done ? "✅ Completed!" : "";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  updateTodayDisplay();
  loadHistory();
});

saveBtn.addEventListener("click", () => {
  const todayKey = getTodayKey();
  const text = challengeInput.value.trim();
  chrome.storage.local.set({ [todayKey]: { text, done: false } }, () => {
    statusText.textContent = "Challenge saved.";
    completeBtn.disabled = false;
    loadHistory();
  });
});

completeBtn.addEventListener("click", () => {
  const todayKey = getTodayKey();
  chrome.storage.local.get([todayKey, "history"], (data) => {
    const challenge = data[todayKey] || { text: "" };
    const history = data.history || [];
    challenge.done = true;
    history.push({ date: todayKey, text: challenge.text, done: true });

    chrome.storage.local.set({
      [todayKey]: challenge,
      history: history
    }, () => {
      statusText.textContent = "✅ Completed!";
      completeBtn.disabled = true;
      loadHistory();
    });
  });
});