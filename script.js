const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const imageContainer = document.getElementById("imageContainer");

generateBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    statusEl.textContent = "Enter your OpenAI API key";
    return;
  }

  if (!prompt) {
    statusEl.textContent = "Enter a prompt";
    return;
  }

  generateBtn.disabled = true;
  statusEl.textContent = "Generating image...";
  imageContainer.innerHTML = "";

  try {
    const res = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024"
      })
    });

    if (!res.ok) {
      const err = await res.text();
      console.error(err);
      statusEl.textContent = `Error: ${res.status}`;
      generateBtn.disabled = false;
      return;
    }

    const data = await res.json();
    const base64 = data.data[0].b64_json;
    const img = new Image();
    img.src = "data:image/png;base64," + base64;

    imageContainer.appendChild(img);
    statusEl.textContent = "Done!";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Request failed";
  }

  generateBtn.disabled = false;
});
