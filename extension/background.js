chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (tab.url && tab.url.includes("wikipedia.org") && changeInfo.status === "complete") {
        // Wikipedia page detected, send a message to content.js to fetch the summary
        chrome.tabs.sendMessage(tabId, { action: "fetchSummary", url: tab.url });
    }
});
