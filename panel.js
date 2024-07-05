// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

chrome.devtools.network.onRequestFinished.addListener(
  (request) => {
    let result = request.request.url
    if(result.startsWith("https://www.facebook.com/api/graphql/"))
    { 
      let div = document.createElement("ul");
      for (var prop in request.response.headers[0]) {
        let li = document.createElement("li");
        li.innerText = prop + ": " + request.response.headers[10].name;
        div.appendChild(li)
      }
      div.innerText = JSON.stringify(request.cache);
      document.body.appendChild(div);
    }
  }
);
