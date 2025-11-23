// Cloudflare Worker URL
const WORKER_URL = "https://odd-cloud-8496.islamyang123.workers.dev/";

const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const imageContainer = document.getElementById("imageContainer");

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();

  if (!prompt) {
    statusEl.textContent = "Enter a prompt.";
    return;
  }

  generateBtn.disabled = true;
  statusEl.textContent = "Generating...";
  imageContainer.innerHTML = "";

  try {
    const res = await fetch(WORKER_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Worker error:", errText);
      statusEl.textContent = "Error: " + res.status;
      generateBtn.disabled = false;
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const img = new Image();
    img.src = url;
    imageContainer.appendChild(img);

    statusEl.textContent = "Done!";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Request failed.";
  } finally {
    generateBtn.disabled = false;
  }
});
