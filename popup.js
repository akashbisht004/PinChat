document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("saveBookmark");
    const bookmarkList = document.getElementById("bookmarkList");

    // Initialize the popup
    displayBookmarks();

    saveButton.addEventListener("click", async function () {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            if (!tab) {
                showMessage("Unable to access current tab", "error");
                return;
            }

            const { title, url } = tab;

            if (!url.includes("chatgpt.com")) {
                showMessage("This extension only works on ChatGPT chats!", "error");
                return;
            }

            // Check if bookmark already exists
            const bookmarks = await getBookmarks();
            const exists = bookmarks.some(bookmark => 
                bookmark.title === title && bookmark.url === url
            );

            if (exists) {
                showMessage("This chat is already saved!", "info");
                return;
            }

            // Add new bookmark
            bookmarks.push({ title, url, dateAdded: new Date().toISOString() });
            await saveBookmarks(bookmarks);
            
            showMessage("Chat saved successfully!", "success");
            displayBookmarks();

        } catch (error) {
            console.error("Error saving bookmark:", error);
            showMessage("Failed to save chat. Please try again.", "error");
        }
    });

    async function getBookmarks() {
        return new Promise((resolve) => {
            chrome.storage.local.get("bookmarks", (data) => {
                resolve(data.bookmarks || []);
            });
        });
    }

    async function saveBookmarks(bookmarks) {
        return new Promise((resolve) => {
            chrome.storage.local.set({ bookmarks }, resolve);
        });
    }

    async function displayBookmarks() {
        try {
            const bookmarks = await getBookmarks();
            bookmarkList.innerHTML = "";

            if (bookmarks.length === 0) {
                bookmarkList.innerHTML = '<li style="text-align: center; color: #888; padding: 20px;">No saved chats yet</li>';
                return;
            }

            bookmarks.forEach((bookmark, index) => {
                const li = document.createElement("li");
                
                const a = document.createElement("a");
                a.href = bookmark.url;
                a.textContent = bookmark.title;
                a.target = "_blank";
                a.title = bookmark.title; // Tooltip for long titles

                const delButton = document.createElement("button");
                delButton.textContent = "×";
                delButton.className = "delete-btn";
                delButton.title = "Delete this chat";
                delButton.onclick = () => deleteBookmark(index);

                li.appendChild(a);
                li.appendChild(delButton);
                bookmarkList.appendChild(li);
            });
        } catch (error) {
            console.error("Error displaying bookmarks:", error);
            showMessage("Failed to load saved chats", "error");
        }
    }

    async function deleteBookmark(index) {
        try {
            const bookmarks = await getBookmarks();
            const deletedBookmark = bookmarks[index];
            
            bookmarks.splice(index, 1);
            await saveBookmarks(bookmarks);
            
            showMessage(`"${deletedBookmark.title}" removed`, "success");
            displayBookmarks();
        } catch (error) {
            console.error("Error deleting bookmark:", error);
            showMessage("Failed to delete chat", "error");
        }
    }

    function showMessage(message, type = "info") {
        // Remove existing message
        const existingMessage = document.querySelector(".message");
        if (existingMessage) {
            existingMessage.remove();
        }

        // Create new message element
        const messageEl = document.createElement("div");
        messageEl.className = `message message-${type}`;
        messageEl.textContent = message;
        messageEl.style.cssText = `
            position: fixed;
            top: 10px;
            left: 50%;
            transform: translateX(-50%);
            padding: 8px 16px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: 500;
            z-index: 1000;
            animation: fadeInOut 3s ease-in-out;
        `;

        // Add animation styles
        const style = document.createElement("style");
        style.textContent = `
            @keyframes fadeInOut {
                0% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
                10% { opacity: 1; transform: translateX(-50%) translateY(0); }
                90% { opacity: 1; transform: translateX(-50%) translateY(0); }
                100% { opacity: 0; transform: translateX(-50%) translateY(-10px); }
            }
        `;
        document.head.appendChild(style);

        // Set background color based on type
        switch (type) {
            case "success":
                messageEl.style.background = "#4caf50";
                messageEl.style.color = "#ffffff";
                break;
            case "error":
                messageEl.style.background = "#f44336";
                messageEl.style.color = "#ffffff";
                break;
            case "info":
            default:
                messageEl.style.background = "#2196f3";
                messageEl.style.color = "#ffffff";
                break;
        }

        document.body.appendChild(messageEl);

        // Remove message after animation
        setTimeout(() => {
            if (messageEl.parentNode) {
                messageEl.remove();
            }
        }, 3000);
    }
});
