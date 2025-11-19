// script.js

// Модель именно для картинок
const API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-image:generateContent";

const apiKeyInput = document.getElementById("apiKey");
const promptInput = document.getElementById("prompt");
const generateBtn = document.getElementById("generateBtn");
const statusEl = document.getElementById("status");
const imageContainer = document.getElementById("imageContainer");

generateBtn.addEventListener("click", async () => {
  const apiKey = apiKeyInput.value.trim();
  const prompt = promptInput.value.trim();

  if (!apiKey) {
    statusEl.textContent = "Please paste your Gemini API key.";
    return;
  }
  if (!prompt) {
    statusEl.textContent = "Please enter a prompt describing the car.";
    return;
  }

  generateBtn.disabled = true;
  statusEl.textContent = "Generating image...";
  imageContainer.innerHTML = "";

  try {
    const res = await fetch(`${API_BASE}?key=${encodeURIComponent(apiKey)}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      // ВАЖНО: без responseMimeType, просто обычный generateContent
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Generate a single high-quality image of a car. " +
                  "Make it detailed and visually appealing. " +
                  "Description: " +
                  prompt,
              },
            ],
          },
        ],
        // Опционально: просим текст+картинку
        generationConfig: {
          responseModalities: ["TEXT", "IMAGE"],
          // можно добавить aspect_ratio: "16:9" и т.п. по желанию
        },
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error("Gemini error:", errText);
      statusEl.textContent = `Error: ${res.status} ${res.statusText}`;
      generateBtn.disabled = false;
      return;
    }

    const data = await res.json();
    console.log("Gemini response:", data);

    const candidate = data.candidates?.[0];
    if (!candidate) {
      statusEl.textContent = "No candidates returned from Gemini.";
      generateBtn.disabled = false;
      return;
    }

    // Ищем первую часть с картинкой
    const part =
      candidate.content?.parts?.find(
        (p) => p.inlineData && p.inlineData.data
      ) || null;

    if (!part) {
      statusEl.textContent = "No image data in response.";
      console.log("Full response (no inlineData):", data);
      generateBtn.disabled = false;
      return;
    }

    const base64 = part.inlineData.data;
    const mimeType = part.inlineData.mimeType || "image/png";

    const img = document.createElement("img");
    img.src = `data:${mimeType};base64,${base64}`;
    imageContainer.innerHTML = "";
    imageContainer.appendChild(img);

    statusEl.textContent = "Done.";
  } catch (e) {
    console.error(e);
    statusEl.textContent = "Request failed. See console for details.";
  } finally {
    generateBtn.disabled = false;
  }
});
