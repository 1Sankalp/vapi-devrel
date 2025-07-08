// Background script for managing extension state
chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ isActive: false });
});

// Handle messages from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "getPageInfo") {
    // Get current tab info
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]) {
        sendResponse({
          url: tabs[0].url,
          title: tabs[0].title
        });
      }
    });
    return true; // Keep message channel open for async response
  }
  
  if (request.action === "toggleWidget") {
    chrome.storage.sync.get(['isActive'], (result) => {
      const newState = !result.isActive;
      chrome.storage.sync.set({ isActive: newState });
      
      // Broadcast to all tabs
      chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
          chrome.tabs.sendMessage(tab.id, {
            action: "widgetStateChanged",
            isActive: newState
          }).catch(() => {
            // Ignore errors for tabs that can't receive messages
          });
        });
      });
    });
  }
});

// Listen for storage changes to sync across tabs
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync' && changes.isActive) {
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach(tab => {
        chrome.tabs.sendMessage(tab.id, {
          action: "widgetStateChanged",
          isActive: changes.isActive.newValue
        }).catch(() => {
          // Ignore errors for tabs that can't receive messages
        });
      });
    });
  }
});