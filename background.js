chrome.runtime.onInstalled.addListener(() => {
  chrome.alarms.create("dailyReminder", {
    delayInMinutes: 1,
    periodInMinutes: 1440
  });
});

chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "dailyReminder") {
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon128.png",
      title: "Subway Surfers Challenge",
      message: "Don't forget to check and complete your daily challenge!",
      priority: 1
    });
  }
});