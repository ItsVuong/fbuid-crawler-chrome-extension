chrome.devtools.network.onRequestFinished.addListener(
  (request) => {
    let ul = document.createElement("ul");
    request.getContent((body) => {
      if (request.request.url.startsWith('https://www.facebook.com/api/graphql/')) {
        const parsedData = JSON.parse(body);

        if (parsedData?.data?.node?.__typename.includes("Feedback")) {
          const comments = parsedData.data.node.comment_rendering_instance_for_feed_location.comments.edges;
          comments.forEach(comment => {
            const li = document.createElement("li");
            li.innerText = "uid: " + comment.node.user.id + "|| name: " + comment.node.user.name;
            ul.appendChild(li);
          })
        }

        document.body.appendChild(ul);
      }
    })
  }
);

//listen to event like finish...
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event === 'done') {
    let btn = document.createElement("btn");
    btn.innerText = "download csv file";
    document.body.appendChild(btn);
  }
})

//add listener for run button
const runBtn = document.getElementById('run-script');
try {
  runBtn.addEventListener('click', () => {
    console.log("in dev panel");
    chrome.runtime.sendMessage({action: 'injectContentScript'});
  });
} catch (error) {
  console.log(error)
}

//add listener for stop button
const stopBtn = document.getElementById('stop-script');
try {
  stopBtn.addEventListener('click', () => {
    console.log("in dev panel");
    chrome.runtime.sendMessage({action: 'removeContentScript'});
  });
} catch (error) {
  console.log(error)
}

