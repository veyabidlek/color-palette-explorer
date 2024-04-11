document.addEventListener("DOMContentLoaded", function () {
  loadPalettes();
  document.getElementById("hue").addEventListener("input", updateColorInput);
  document
    .getElementById("saturation")
    .addEventListener("input", updateColorInput);
  document
    .getElementById("lightness")
    .addEventListener("input", updateColorInput);
  document
    .querySelector(".btn-add-color")
    .addEventListener("click", addColorInput);
  document
    .querySelector(".btn-save-palette")
    .addEventListener("click", savePalette);
  document.querySelector(".btn-reset").addEventListener("click", resetPalettes);
  addColorInput();
});

function updateColorInput() {
  const hue = document.getElementById("hue").value;
  const saturation = document.getElementById("saturation").value;
  const lightness = document.getElementById("lightness").value;
  document.getElementById("hue-value").textContent = hue;
  document.getElementById("saturation-value").textContent = saturation + "%";
  document.getElementById("lightness-value").textContent = lightness + "%";
  const lastColorInput = document.querySelector(
    ".color-picker-container input:last-of-type"
  );
  if (lastColorInput) {
    lastColorInput.value = hslToHex(hue, saturation, lightness);
  }
}

function addColorInput() {
  const hue = document.getElementById("hue").value;
  const saturation = document.getElementById("saturation").value;
  const lightness = document.getElementById("lightness").value;
  const colorInput = document.createElement("input");
  colorInput.type = "color";
  colorInput.value = `#${hslToHex(hue, saturation, lightness)}`;
  document.querySelector(".color-picker-container").appendChild(colorInput);
}

function savePalette() {
  const paletteName =
    document.getElementById("palette-name").value.trim() ||
    "nFactorial Palette";
  const colors = Array.from(
    document.querySelectorAll(".color-picker-container input")
  ).map((input) => input.value);
  if (colors.length === 0) return;
  const palette = { name: paletteName, colors };
  saveToLocalStorage(palette);
  displayPalette(palette);
  resetColorInput();
}

function displayPalette(palette) {
  const nameContainer = document.createElement("div");
  nameContainer.classList.add("palette-name-container");
  if (palette.colors.length > 0) {
    const nameLength = palette.name.length;
    let partLength = Math.floor(nameLength / palette.colors.length);
    for (let i = 0; i < palette.colors.length; i++) {
      const namePart = document.createElement("span");
      const start = i * partLength;
      let end =
        i === palette.colors.length - 1 ? nameLength : (i + 1) * partLength;
      namePart.textContent = palette.name.slice(start, end);
      namePart.style.color = palette.colors[i];
      nameContainer.appendChild(namePart);
    }
  } else {
    nameContainer.textContent = palette.name;
  }

  const paletteDiv = document.createElement("div");
  paletteDiv.classList.add("palette");
  palette.colors.forEach((color) => {
    const colorBlock = document.createElement("div");
    colorBlock.classList.add("color-block");
    colorBlock.style.backgroundColor = color;
    paletteDiv.appendChild(colorBlock);
  });

  const displayArea = document.querySelector(".palette-display");
  displayArea.appendChild(nameContainer);
  displayArea.appendChild(paletteDiv);
}

function loadPalettes() {
  const palettes = JSON.parse(localStorage.getItem("palettes")) || [];
  palettes.forEach(displayPalette);
}

function saveToLocalStorage(palette) {
  const palettes = JSON.parse(localStorage.getItem("palettes")) || [];
  palettes.push(palette);
  localStorage.setItem("palettes", JSON.stringify(palettes));
}

function resetPalettes() {
  localStorage.clear();
  document.querySelector(".palette-display").innerHTML = "";
}

function resetColorInput() {
  const container = document.querySelector(".color-picker-container");
  while (container.firstChild) {
    container.removeChild(container.firstChild);
  }
  document.getElementById("palette-name").value = "";
  addColorInput();
}

function hslToHex(h, s, l) {
  //gpt generated
  s /= 100;
  l /= 100;
  const k = (n) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
  return `#${[0, 8, 4]
    .map((x) =>
      Math.round(f(x) * 255)
        .toString(16)
        .padStart(2, "0")
    )
    .join("")}`;
}
