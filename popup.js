let foundImages = [];

const toggleBtn = document.getElementById("themeToggle");
const root = document.documentElement;

const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  root.setAttribute("data-theme", savedTheme);
} else {
  root.setAttribute("data-theme", "dark");
}

toggleBtn.addEventListener("click", () => {
  const currentTheme = root.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  toggleBtn.innerHTML = newTheme === "dark" ? "light mode" : "dark mode";
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("DOM loaded");

  const scanBtn = document.getElementById("scanBtn");
  const downloadAllBtn = document.getElementById("downloadAllBtn");
  const downloadSelectedBtn = document.getElementById("downloadSelectedBtn");
  const selectAllCheckbox = document.getElementById("selectAll");
  const selectControls = document.getElementById("selectControls");
  const imageContainer = document.getElementById("imageContainer");
  const status = document.getElementById("status");
  const loading = document.getElementById("loading");
  const downloadProgress = document.getElementById("downloadProgress");
  const progressText = document.getElementById("progressText");

  // Scan for images
  scanBtn.addEventListener("click", async function () {
    loading.classList.add("show");
    imageContainer.style.display = "none";
    selectControls.style.display = "none";
    status.style.display = "none";

    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      });

      const results = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: scanFilteredImages,
      });

      foundImages = results[0].result || [];
      displayImages();
    } catch (error) {
      console.error("Error:", error);
      status.textContent = "Error: " + error.message;
      status.style.display = "block";
    }

    loading.classList.remove("show");
  });

  // Select all functionality
  selectAllCheckbox.addEventListener("change", function () {
    const checkboxes = document.querySelectorAll(".image-checkbox");
    checkboxes.forEach((cb) => (cb.checked = this.checked));
    updateDownloadButtons();
  });

  // Download all images as ZIP
  downloadAllBtn.addEventListener("click", function () {
    downloadImagesAsZip(foundImages, "all-images.zip");
  });

  // Download selected images as ZIP
  downloadSelectedBtn.addEventListener("click", function () {
    const selectedImages = getSelectedImages();
    downloadImagesAsZip(selectedImages, "selected-images.zip");
  });

  function displayImages() {
    if (foundImages.length === 0) {
      status.textContent =
        "No PNG, JPG, JPEG, or WEBP images found on this page.";
      status.style.display = "block";
      return;
    }

    status.textContent = `Found ${foundImages.length} supported images`;
    status.style.display = "block";
    imageContainer.style.display = "block";
    selectControls.style.display = "flex";

    imageContainer.innerHTML = "";

    foundImages.forEach((img, index) => {
      const imageItem = document.createElement("div");
      imageItem.className = "image-item";

      const extension = img.extension.toUpperCase();

      imageItem.innerHTML = `
                <input type="checkbox" class="image-checkbox" data-index="${index}" checked>
                <img src="${img.src}" alt="Image ${
        index + 1
      }" onerror="this.src='https://media.istockphoto.com/id/1147544807/vector/thumbnail-image-vector-graphic.jpg?s=612x612&w=0&k=20&c=rnCKVbdxqkjlcs3xH87-9gocETqpspHFXu5dIGB4wuM='">
                <div class="image-info">
                    <div class="image-url">${
                      img.filename || `image_${index + 1}`
                    }<span class="extension-badge">${extension}</span></div>
                    <div class="image-details">${img.width}×${img.height} • ${(
        img.src.length / 1024
      ).toFixed(1)}KB URL</div>
                </div>
            `;

      imageContainer.appendChild(imageItem);

      const checkbox = imageItem.querySelector(".image-checkbox");
      checkbox.addEventListener("change", updateDownloadButtons);
    });

    downloadAllBtn.disabled = false;
    updateDownloadButtons();
  }

  function updateDownloadButtons() {
    const selectedCheckboxes = document.querySelectorAll(
      ".image-checkbox:checked"
    );
    downloadSelectedBtn.disabled = selectedCheckboxes.length === 0;

    const allCheckboxes = document.querySelectorAll(".image-checkbox");
    selectAllCheckbox.indeterminate =
      selectedCheckboxes.length > 0 &&
      selectedCheckboxes.length < allCheckboxes.length;
    selectAllCheckbox.checked =
      selectedCheckboxes.length === allCheckboxes.length &&
      allCheckboxes.length > 0;
  }

  function getSelectedImages() {
    const selectedCheckboxes = document.querySelectorAll(
      ".image-checkbox:checked"
    );
    const selectedImages = [];
    selectedCheckboxes.forEach((cb) => {
      const index = parseInt(cb.dataset.index);
      selectedImages.push(foundImages[index]);
    });
    return selectedImages;
  }
  async function downloadImagesAsZip(images, zipFilename) {
    if (images.length === 0) {
      status.textContent = "No images selected for download.";
      status.style.display = "block";
      return;
    }

    console.log(images, zipFilename);
    console.log(zipFilename);
    console.log("++++++++++++++++++++++");

    try {
      downloadProgress.classList.add("show");
      progressText.textContent = `Preparing to download ${images.length} images...`;

      // Create ONE zip file for all images
      const zip = new JSZip();
      let downloadedCount = 0;

      for (let i = 0; i < images.length; i++) {
        const img = images[i];

        progressText.textContent = `Downloading image ${i + 1} of ${
          images.length
        }...`;

        try {
          console.log(img.src, "source image:url");
          debugger;
          const response = await fetch(img.src);
          if (response.ok) {
            const blob = await response.blob();
            const filename = `image_ooo_${i + 1}.${img.extension}`;

            // Add this image to the ZIP
            zip.file(filename, blob);
            downloadedCount++;
          } else {
            console.warn(`Failed to fetch image: ${img.src}`);
          }
        } catch (error) {
          console.warn(`Error downloading image ${img.src}:`, error);
        }

        // Small delay to prevent overwhelming the browser
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      if (downloadedCount === 0) {
        throw new Error("No images could be downloaded");
      }

      progressText.textContent = `Creating ZIP file with ${downloadedCount} images...`;

      // Generate the ZIP file
      debugger;
      const zipBlob = await zip.generateAsync({
        type: "blob",
        compression: "DEFLATE",
        compressionOptions: { level: 6 },
      });

      // Create download link

      debugger;
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = zipFilename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      debugger;
      progressText.textContent = `✅ Downloaded ${downloadedCount} images as ${zipFilename}`;

      // Hide progress after 3 seconds
      setTimeout(() => {
        downloadProgress.classList.remove("show");
      }, 3000);
    } catch (error) {
      console.error("Download error:", error);
      progressText.textContent = "❌ Error creating download: " + error.message;

      setTimeout(() => {
        downloadProgress.classList.remove("show");
      }, 5000);
    }
  }
});

// Function that runs on the webpage to scan for filtered images
function scanFilteredImages() {
  console.log("Scanning for PNG, JPG, JPEG, WEBP images...");

  const allowedExtensions = ["png", "jpg", "jpeg", "webp"];
  const images = [];

  // Get all img elements
  const allImages = document.getElementsByTagName("img");

  console.log(allImages);

  for (let i = 0; i < allImages.length; i++) {
    const img = allImages[i];

    if (!img.src || !img.src.startsWith("http")) continue;

    // Skip very small images (likely icons)
    if ((img.width && img.width < 50) || (img.height && img.height < 50))
      continue;

    // Get file extension from URL
    const extension = getImageExtension(img.src);

    if (allowedExtensions.includes(extension.toLowerCase())) {
      images.push({
        src: img.src,
        width: img.naturalWidth || img.width || 0,
        height: img.naturalHeight || img.height || 0,
        extension: extension.toLowerCase(),
        filename: getFilenameFromUrl(img.src),
      });
    }
  }

  // Also check background images in CSS
  const allElements = document.querySelectorAll("*");
  allElements.forEach((element, index) => {
    const style = window.getComputedStyle(element);
    const bgImage = style.backgroundImage;

    if (bgImage && bgImage !== "none") {
      const matches = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (matches && matches[1]) {
        const src = matches[1];

        if (!src.startsWith("http")) return;

        const extension = getImageExtension(src);

        if (allowedExtensions.includes(extension.toLowerCase())) {
          // Check if we already have this image
          if (!images.some((img) => img.src === src)) {
            images.push({
              src: src,
              width: element.offsetWidth || 100,
              height: element.offsetHeight || 100,
              extension: extension.toLowerCase(),
              filename:
                getFilenameFromUrl(src) || `bg_image_${index + 1}.${extension}`,
            });
          }
        }
      }
    }
  });

  console.log(`Found ${images.length} images with allowed extensions`);
  return images;

  function getImageExtension(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname.toLowerCase();
      const lastDot = pathname.lastIndexOf(".");

      if (lastDot === -1) return "jpg"; // Default fallback

      let extension = pathname.substring(lastDot + 1);

      // Clean up extension (remove query params, etc.)
      extension = extension.split("?")[0].split("#")[0];

      // Handle common cases
      if (extension === "jpeg") return "jpg";

      return extension || "jpg";
    } catch (e) {
      return "jpg";
    }
  }

  function getFilenameFromUrl(url) {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const filename = pathname.split("/").pop();
      return filename && filename.includes(".") ? filename : null;
    } catch (e) {
      return null;
    }
  }
}
