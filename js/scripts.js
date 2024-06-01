/**
 * Function to update the copyright year dynamically
 *
 * Updates the text content of the copyright element with the current year.
 * Ensures the displayed year is always up-to-date.
 */
function updateCopyrightYear() {
  const year = new Date().getFullYear();
  const copyrightElement = document.getElementById("copyright");

  // Ensure the element exists before attempting to update its content
  if (copyrightElement) {
    copyrightElement.textContent = `© ${year} Nick Tesh - All Rights Reserved.`;
  }
}

// Update the copyright year on load
document.addEventListener("DOMContentLoaded", () => {
  updateCopyrightYear();
});

/**
 * This script handles the dynamic updating and validation of foreground and background colors
 * to ensure they meet accessibility standards. It includes functionality to swap colors, 
 * calculate contrast ratios, and update the display with the new contrast information.

 */
document.addEventListener("DOMContentLoaded", function () {
  const fgColorInput = document.getElementById("foreground-color");
  const bgColorInput = document.getElementById("background-color");
  const fgHexInput = document.getElementById("foreground-hex");
  const bgHexInput = document.getElementById("background-hex");
  const swapColorsButton = document.getElementById("swap-colors");

  /**
   * Ensures that a given color value starts with a hash (#).
   */
  function ensureHash(value) {
    return value.startsWith("#") ? value : "#" + value;
  }

  /**
   * Updates the contrast ratio and the UI elements that depend on the foreground and background colors.
   */
  function updateContrast() {
    const fgColor = ensureHash(fgHexInput.value);
    const bgColor = ensureHash(bgHexInput.value);

    fgHexInput.value = fgColor;
    bgHexInput.value = bgColor;
    fgColorInput.value = fgColor;
    bgColorInput.value = bgColor;

    const contrastRatio = getContrastRatio(fgColor, bgColor);
    document.getElementById("contrast-ratio").textContent = contrastRatio.toFixed(2) + ":1";
    document.getElementById("contrast-text").textContent = getContrastDescription(contrastRatio);

    updateStatus("aa-small", checkAA(contrastRatio, "small"));
    updateStatus("aaa-small", checkAAA(contrastRatio, "small"));
    updateStatus("aa-large", checkAA(contrastRatio, "large"));
    updateStatus("aaa-large", checkAAA(contrastRatio, "large"));
    updateStatus("aa-ui", checkAAUI(contrastRatio));
    updateStatus("aaa-ui", checkAAAUI(contrastRatio));

    document.querySelectorAll(".text-example").forEach((el) => {
      el.style.color = fgColor;
      el.style.backgroundColor = bgColor;
    });
    document.querySelector(".ui-input").style.color = fgColor;
    document.querySelector(".ui-input").style.borderColor = fgColor;
    document.querySelector(".ui-example").style.backgroundColor = bgColor;
    document.querySelector(".checkmark").style.color = fgColor;
  }

  /**
   * Swaps the values of the foreground and background colors.
   */
  function swapColors() {
    const fgColor = fgHexInput.value;
    const bgColor = bgHexInput.value;
    fgHexInput.value = bgColor;
    bgHexInput.value = fgColor;
    updateContrast();
  }

  /**
   * Gets a description of the contrast quality based on the ratio.
   */
  function getContrastDescription(ratio) {
    if (ratio >= 7) return "PERFECT";
    if (ratio >= 4.5) return "GOOD";
    if (ratio >= 3) return "OK";
    return "POOR";
  }

  /**
   * Updates the status of a contrast check element based on whether it passes.
   */
  function updateStatus(id, isPass) {
    const element = document.getElementById(id);
    if (element) {
      element.textContent = isPass ? "PASS" : "FAIL";
      element.className = "status " + (isPass ? "pass" : "fail");
    }
  }

  fgColorInput.addEventListener("input", function () {
    fgHexInput.value = fgColorInput.value;
    updateContrast();
  });

  bgColorInput.addEventListener("input", function () {
    bgHexInput.value = bgColorInput.value;
    updateContrast();
  });

  fgHexInput.addEventListener("input", function () {
    fgHexInput.value = ensureHash(fgHexInput.value);
    fgColorInput.value = fgHexInput.value;
    updateContrast();
  });

  bgHexInput.addEventListener("input", function () {
    bgHexInput.value = ensureHash(bgHexInput.value);
    bgColorInput.value = bgHexInput.value;
    updateContrast();
  });

  swapColorsButton.addEventListener("click", swapColors);

  updateContrast();
});

/**
 * Calculates the luminance of a color.
 */
function getLuminance(color) {
  const rgb = parseInt(color.slice(1), 16); // Convert hex to RGB
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;

  const srgb = [r, g, b].map((c) => c / 255).map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));

  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2];
}

/**
 * Calculates the contrast ratio between two colors.
 */
function getContrastRatio(fg, bg) {
  const lum1 = getLuminance(fg);
  const lum2 = getLuminance(bg);
  return (Math.max(lum1, lum2) + 0.05) / (Math.min(lum1, lum2) + 0.05);
}

/**
 * Checks if the contrast ratio meets the AA standard.
 */
function checkAA(ratio, type) {
  return type === "large" ? ratio >= 3.0 : ratio >= 4.5;
}

/**
 * Checks if the contrast ratio meets the AAA standard.
 */
function checkAAA(ratio, type) {
  return type === "large" ? ratio >= 4.5 : ratio >= 7.0;
}

/**
 * Checks if the contrast ratio meets the AA standard for UI components.
 */
function checkAAUI(ratio) {
  return ratio >= 3.0;
}

/**
 * Checks if the contrast ratio meets the AAA standard for UI components.
 */
function checkAAAUI(ratio) {
  return ratio >= 4.5;
}
