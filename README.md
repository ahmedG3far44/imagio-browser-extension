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
<p align="center">
  <img src="https://github.com/user-attachments/assets/0075fd03-7644-447e-b7de-0930f942e771" alt="extension preview features" width="400"/>
</p>


### Select Images
<p align="center">
  <img src="https://github.com/user-attachments/assets/33432296-9ed4-4fbe-9d71-e0a5ee8eb431" alt="extension preview features" width="400"/>
</p>


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
