document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveBookmark");
    const bookmarkList = document.getElementById("bookmarkList");

    saveButton.addEventListener("click", async function () {
        let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        let title = tab.title;
        let url = tab.url;

        if (!url.includes("chatgpt.com")) {
            alert("This extension only works on ChatGPT chats!");
            return;
        }

        chrome.storage.local.get("bookmarks", function (data) {
            let bookmarks = data.bookmarks || [];

            if(bookmarks.find(bookmark => bookmark.url ===url)){
                alert("Already pinned");
                return;
            }
            
            bookmarks.push({ title, url });
            chrome.storage.local.set({ bookmarks }, displayBookmarks);
        });
    });

    function displayBookmarks() {
        chrome.storage.local.get("bookmarks", function (data) {
            bookmarkList.innerHTML = "";
            (data.bookmarks || []).forEach((bookmark, index) => {
                let li = document.createElement("li");
                li.style.padding = "8px";
                li.style.borderBottom = "1px solid rgba(255, 255, 255, 0.1)";
                li.style.backgroundColor = "rgba(255, 255, 255, 0.05)";
                li.style.borderRadius = "4px";
                li.style.marginBottom = "6px";
                li.style.display = "flex";
                li.style.justifyContent = "space-between";
                li.style.alignItems = "center";

                let a = document.createElement("a");
                a.href = bookmark.url;
                a.textContent = bookmark.title;
                a.target = "_blank";
                a.style.color = "#93c5fd";
                a.style.textDecoration = "none";
                a.style.flexGrow = "1";
                a.style.overflow = "hidden";
                a.style.whiteSpace = "nowrap";
                a.style.textOverflow = "ellipsis";

                a.href = bookmark.url;
                a.textContent = bookmark.title;
                a.target = "_blank";

                let delButton = document.createElement("button");
                delButton.textContent = "X";
                delButton.style.marginLeft = "10px";
                delButton.style.background = "red";
                delButton.style.color = "white";
                delButton.style.border = "none";
                delButton.style.borderRadius = "4px";
                delButton.style.cursor = "pointer";
                delButton.style.padding = "4px 8px";
                delButton.style.fontSize = "0.8rem";
                delButton.onclick = function () {
                    deleteBookmark(index);
                };

                li.appendChild(a);
                li.appendChild(delButton);
                bookmarkList.appendChild(li);
            });
        });
    }

    function deleteBookmark(index) {
        chrome.storage.local.get("bookmarks", function (data) {
            let bookmarks = data.bookmarks || [];
            bookmarks.splice(index, 1);
            chrome.storage.local.set({ bookmarks }, displayBookmarks);
        });
    }

    displayBookmarks();
});
