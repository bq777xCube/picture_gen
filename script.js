// Using Hugging Face Inference API with FLUX.1-dev (image generator)

const HF_MODEL_URL =
  "https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-dev";

const hfTokenInput = document.getElementById("hfToken");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const imageContainer = document.getElementById("imageContainer");

generateBtn.addEventListener("click", async () => {
  const token = hfTokenInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!token) {
    statusEl.textContent = "Paste your Hugging Face API token (hf_...).";
    return;
  }
  if (!prompt) {
    statusEl.textContent = "Enter a prompt describing the car.";
    return;
  }

  generateBtn.disabled = true;
  statusEl.textContent = "Generating image via Hugging Face...";
  imageContainer.innerHTML = "";

  try {
    const res = await fetch(HF_MODEL_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "Accept": "image/png"
      },
      body: JSON.stringify({
        inputs: prompt,
        // можно добавить параметры под модель, если захочешь
        // options: { wait_for_model: true }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("HF error:", errText);
      if (res.status === 401 || res.status === 403) {
        statusEl.textContent =
          "Auth error. Check HF token and that it has Inference permission.";
      } else if (res.status === 503) {
        statusEl.textContent = "Model is loading on HF side. Try again in a bit.";
      } else {
        statusEl.textContent = `Error ${res.status}. See console for details.`;
      }
      generateBtn.disabled = false;
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);

    const img = document.createElement("img");
    img.src = url;
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);

    statusEl.textContent = "Done!";
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Request failed. Check console.";
  } finally {
    generateBtn.disabled = false;
  }
});
