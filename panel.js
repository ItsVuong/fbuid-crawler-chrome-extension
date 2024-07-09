chrome.devtools.network.onRequestFinished.addListener(
  (request) => {
    let ul = document.createElement("ul");
    request.getContent((body) => {
      if (request.request.url.startsWith('https://www.facebook.com/api/graphql/')) {
        const parsedData = JSON.parse(body);
        // const jsonString = JSON.stringify(parsedData, null, 2);
        // ul.innerText = jsonString;
        if (parsedData?.data?.node?.__typename.includes("Feedback")) {
          // ul.innerText = jsonString;
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
    // div.innerText = JSON.stringify(request.cache);
    // document.body.appendChild(div);
  }
);

const btn = document.getElementById('run-script');

try {
  btn.addEventListener('click', () => {
    console.log("in dev panel");
    chrome.runtime.sendMessage({action: 'injectContentScript'});
  });
} catch (error) {
  console.log(error)
}



