const uidList = new Map()

chrome.devtools.network.onRequestFinished.addListener(
  (request) => {
    let ul = document.createElement("ul");
    request.getContent((body) => {
      if (request.request.url.startsWith('https://www.facebook.com/api/graphql/')) {
        const parsedData = JSON.parse(body);

        if (parsedData?.data?.node?.__typename.includes("Feedback")) {
          //get the comment objects from response
          const comments = parsedData.data.node.comment_rendering_instance_for_feed_location.comments.edges;
          //get the uids and names from each comment
          comments.forEach(comment => {
            const uid = comment.node.user.id;
            const name = comment.node.user.name;
            if (!uidList.has(uid)) {
              uidList.set(uid, name)
            }
            const li = document.createElement("li");
            li.innerText = "uid: " + uid + "|| name: " + name;
            ul.appendChild(li);
          })
        }

        document.body.appendChild(ul);
      }
    })
  }
);

//listen to event
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.event === 'got-all-comments') {
    const header = document.getElementById('header');
    let button = document.createElement("a");
    button.innerText = "save";
    header.appendChild(button);
    //add listener for 'save' button

      const csv = generateCsv(uidList);
      button.setAttribute('href', csv);
      button.setAttribute('download', 'File.csv');
      button.textContent = 'Click to Download';
      uidList.clear();
  }
})

function generateCsv(data){
  const refinedData = []

  const headers = ['uid', 'name'];
  refinedData.push(headers);

  data.forEach((value, key) => {
    refinedData.push([key, value]);
  });

  let csvContent = '';
  refinedData.forEach(row => {
    csvContent += row.join(',') + '\n'
  });
  const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8,' })
  const objUrl = URL.createObjectURL(blob);
  return objUrl;
}

//add listener for run button
const runBtn = document.getElementById('run-script');
try {
  runBtn.addEventListener('click', () => {
    console.log("in dev panel");
    chrome.runtime.sendMessage({ action: 'injectContentScript' });
  });
} catch (error) {
  console.log(error)
}

//add listener for stop button
const stopBtn = document.getElementById('stop-script');
try {
  stopBtn.addEventListener('click', () => {
    console.log("in dev panel");
    chrome.runtime.sendMessage({ action: 'removeContentScript' });
  });
} catch (error) {
  console.log(error)
}



