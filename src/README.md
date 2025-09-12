# 🖼️ Image Downloader Chrome Extension

A simple and lightweight Chrome extension that allows users to **download all images** from any webpage, or **select specific images** to download. The images are bundled into a single `.zip` file for easy storage and sharing.

Built with **Vanilla JavaScript, HTML, CSS**, and powered by **[JSZip](https://stuk.github.io/jszip/)**.

---

## 🚀 Features

- 🔽 **Download All Images**  
  Instantly grab every image from the current webpage with a single click.

- ✅ **Select Images to Download**  
  Pick only the images you want to save and skip the rest.

- 📦 **Download as ZIP**  
  All images are compressed into a single `.zip` file for convenience.

- ⚡ **Lightweight & Fast**  
  No frameworks or heavy dependencies – just vanilla JavaScript + JSZip.

- 🖥️ **Clean & Simple UI**  
  Minimal design with focus on functionality.

---

## 🛠️ Tech Stack

- **Vanilla JavaScript** – Core logic for DOM handling and image extraction.
- **HTML + CSS** – Popup and options page UI.
- **[JSZip](https://stuk.github.io/jszip/)** – Zips the downloaded images into one file.
- **Chrome Extensions API** – Handles extension installation and interaction with web pages.

---

## 📷 Screenshots

### Popup UI
<img width="449" height="597" alt="image" src="https://github.com/user-attachments/assets/1b580b20-4023-4060-9613-b2378056eea7" />


### Select Images
*(Add screenshot here)*

### ZIP Download Example
*(Add screenshot here)*

---

## 📂 Project Structure
```
|── assets
├── manifest.json 
├── popup.html 
├── popup.js 
├── content.js 
├── style
    └── index.css
├── jszip.min.js
