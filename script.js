const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const imageContainer = document.getElementById("imageContainer");

generateBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    statusEl.textContent = "Enter your Together API key (tg-...).";
    return;
  }
  if (!prompt) {
    statusEl.textContent = "Enter a prompt describing the car.";
    return;
  }

  generateBtn.disabled = true;
  statusEl.textContent = "Generating image via Stable Diffusion 3...";
  imageContainer.innerHTML = "";

  try {
    const res = await fetch("https://api.together.xyz/v1/images/generations", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "stabilityai/stable-diffusion-3-medium",
        prompt: prompt,
        width: 1024,
        height: 1024,
        steps: 28,
        n: 1,
        response_format: "url"
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Together error:", errText);
      statusEl.textContent = `Error: ${res.status}`;
      generateBtn.disabled = false;
      return;
    }

    const data = await res.json();
    console.log("Together response:", data);

    if (!data.data || !data.data[0] || !data.data[0].url) {
      statusEl.textContent = "No image URL in response.";
      generateBtn.disabled = false;
      return;
    }

    const url = data.data[0].url;
    const img = new Image();
    img.src = url;
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);

    statusEl.textContent = "Done!";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Request failed (network/CORS?). Check console.";
  } finally {
    generateBtn.disabled = false;
  }
});
