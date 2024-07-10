function scroll() {
    setTimeout(() => { window.scrollTo(0, document.body.scrollHeight) }, 8000)
}

function autoScroll (info) {
    //The wait is so that facebook doesn't ban your account for requesting too fast
    if (info.url === "https://www.facebook.com/api/graphql/") {
        chrome.tabs.query({active: true, currentWindow: true }, (tabs) => {
            console.log('tab: ',tabs)
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: scroll
            });
        });
    }
}

//add listener to listen extension button
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("in background");
    //start the crawler when the "Run" button is clicked
    if (message.action === 'injectContentScript') {
        console.log("in background");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['crawl.js']
            });
        });

         //if fb successfully fetch new comments, wait a moment and scroll down to bottom
        chrome.webRequest.onResponseStarted.addListener(
            autoScroll,
            {urls: []},[]
        );
    }

    if (message.action === 'removeContentScript') {
        console.log("in background");
        console.log(chrome.webRequest.onResponseStarted.hasListener(autoScroll))
        chrome.webRequest.onResponseStarted.removeListener(autoScroll);
    }


});


