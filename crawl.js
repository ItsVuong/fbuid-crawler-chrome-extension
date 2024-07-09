function findByInnerText(xpath) {
    return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

function asyncGetElement(xpath, timeout) {
    const waitTime = 100;
    return new Promise((resolve, reject) => {
        const intervalId = setInterval(() => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element) {
                clearInterval(intervalId);
                resolve(element);
            } else if (timeout <= 0) {
                clearInterval(intervalId);
                reject(new Error("Element not found or not clickable within timeout"));
            }
            timeout -= waitTime;
        }, waitTime);
    });

}

function runCrawler() {
    //open all comments of a post if it is not opened
    console.log("run crawler")
    if (!findByInnerText("//span[text()='All comments']")) {
        findByInnerText("//span[text()='Most relevant' or text()='Newest']").click();

        asyncGetElement("//span[text()='All comments']", 5000)
            .then(result => { result.click() }, error => { console.log(error) });
    }
}

runCrawler();