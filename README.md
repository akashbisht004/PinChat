# 📌 PinChat - ChatGPT Chat Bookmarking Extension

PinChat is a lightweight Chrome extension that allows you to save and organize your important ChatGPT conversations for quick access later.

## ✨ Features
- Save your active ChatGPT chat with a single click.
- View a list of all saved chats within the extension.
- Open saved chats directly in a new tab.
- Delete bookmarks when no longer needed.
- Clean and simple UI for easy navigation.

## 📂 File Structure
```
📦 PinChat
 ┣ 📜 manifest.json
 ┣ 📜 popup.html
 ┣ 📜 popup.js
 ┗ 📜 icon.png
```

## 🚀 Installation Guide
1. **Download or Clone** this repository:
   ```sh
   git clone https://github.com/your-username/PinChat.git
   ```
2. **Load the Extension in Chrome:**
    - Open Chrome and navigate to `chrome://extensions/`
    - Enable **Developer Mode** (toggle in the top-right corner).
    - Click **Load unpacked** and select the project folder.

3. **Start Using** 🎉
    - Click the extension icon and press "Save Current Chat" to bookmark a conversation.
    - Access your saved chats anytime from the extension popup.

## 🔧 How It Works
- The extension retrieves the active tab’s title and URL.
- It saves the URL in Chrome’s local storage.
- The saved links are displayed in a list with delete options.

## 📜 Permissions
This extension requires:
- `storage`: To store bookmarked chats.
- `activeTab`: To fetch the current tab’s URL.
- `scripting`: To interact with the current tab.

## 🛠 Future Enhancements
- Export/import bookmarks for backup.
- Group and categorize saved chats.
- Sync bookmarks across devices.

## 📷 Screenshot
![PinChat UI](icon.png)

---

💡 **Developed by Anuj Anthwal**  
🔗 *Feel free to contribute and improve the extension!*