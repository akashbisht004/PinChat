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
            bookmarks.push({ title, url });
            chrome.storage.local.set({ bookmarks }, displayBookmarks);
        });
    });

    function displayBookmarks() {
        chrome.storage.local.get("bookmarks", function (data) {
            bookmarkList.innerHTML = "";
            (data.bookmarks || []).forEach((bookmark, index) => {
                let li = document.createElement("li");
                let a = document.createElement("a");
                a.href = bookmark.url;
                a.textContent = bookmark.title;
                a.target = "_blank";

                let delButton = document.createElement("button");
                delButton.textContent = "X";
                delButton.style.marginLeft = "10px";
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
