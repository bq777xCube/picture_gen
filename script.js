const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const imageContainer = document.getElementById("imageContainer");

generateBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    statusEl.textContent = "Enter Stability API key.";
    return;
  }
  if (!prompt) {
    statusEl.textContent = "Enter prompt.";
    return;
  }

  generateBtn.disabled = true;
  statusEl.textContent = "Generating…";
  imageContainer.innerHTML = "";

  try {
    const res = await fetch(
      "https://api.stability.ai/v2beta/flux/generate", 
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          prompt: prompt,
          aspect_ratio: "1:1",
          output_format: "png"
        })
      }
    );

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      statusEl.textContent = "Error: " + res.status;
      return;
    }

    const data = await res.json();

    if (!data.image) {
      statusEl.textContent = "No image returned";
      return;
    }

    const img = new Image();
    img.src = "data:image/png;base64," + data.image;
    imageContainer.appendChild(img);

    statusEl.textContent = "Done!";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Request failed.";
  }

  generateBtn.disabled = false;
});
