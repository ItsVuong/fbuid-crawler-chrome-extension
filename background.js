// const runningTab=new Set([])
const runningTab = new Map();

//add request detail to map before the request
function addRequestToMap(request) {
    if (runningTab.has(request.tabId) && request.url === "https://www.facebook.com/api/graphql/") {
        runningTab.get(request.tabId).requestCounter++;
        console.log("before request: ", runningTab.get(request.tabId).requestCounter);
    }
}

function scroll() {
    return new Promise((resolve, error) => {
        setTimeout(() => {
            window.scrollTo(0, document.body.scrollHeight);
            resolve();
        }, 6000);
    })
}

function autoScroll(details) {
    // console.log("details: ", details)
    //The wait is so that facebook doesn't ban your account for requesting too fast
    if (details.url === "https://www.facebook.com/api/graphql/" && runningTab.has(details.tabId)) {

        console.log("running on tab: ", details.tabId);
        chrome.scripting.executeScript({
            target: { tabId: details.tabId },
            func: scroll
        })
            .then(() => {
                setTimeout(() => {
                    runningTab.get(details.tabId).scrollCounter++;
                    console.log("after request: ", runningTab.get(details.tabId).scrollCounter);
                    if (runningTab.get(details.tabId).scrollCounter == runningTab.get(details.tabId).requestCounter) {
                        chrome.runtime.sendMessage({ event: 'got-all-comments' });
                        runningTab.delete(tabId);
                    }
                }, 500)
            })
    }
}

//add listener to listen extension button
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    //start the crawler when the "Run" button is clicked
    if (message.action === 'injectContentScript') {
        console.log("in background");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            //set running tab and keep track of request number and scroll number to determine 
            //when every request has been scrolled
            runningTab.set(tabs[0].id, { 'requestCounter': 0, 'scrollCounter': 0 });
            //change filter to 'all comments'
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                files: ['crawl.js']
            });
        });

        chrome.webRequest.onBeforeRequest.addListener(
            addRequestToMap,
            { urls: ["https://www.facebook.com/*"] }, []
        );

        //add listener to scroll to bottm everytime new comments are successfully fetched
        chrome.webRequest.onResponseStarted.addListener(
            autoScroll,
            { urls: ["https://www.facebook.com/*"] }, []
        );
    }

    if (message.action === 'removeContentScript') {
        console.log("in background");
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            runningTab.delete(tabs[0].id)
        })
        // console.log(chrome.webRequest.onResponseStarted.hasListener(autoScroll))
        // chrome.webRequest.onResponseStarted.removeListener(autoScroll);
    }


});


