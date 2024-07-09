chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("in background");
    if (message.action === 'injectContentScript') {
        console.log("in background");
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                files: ['crawl.js']
            });
        });
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    function(info) {
      console.log("Cat intercepted: " + info.url);
      // Redirect the lolcal request to a random loldog URL.
    //   var i = Math.round(Math.random() * loldogs.length);
    //   return {redirectUrl: loldogs[i]};
    },
    // filters
    {
      urls: [
        "https://*/*"
      ]
    },
    // extraInfoSpec
    []
  );