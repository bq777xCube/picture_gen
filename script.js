const API_BASE =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

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
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        // для имиджей важно указать, что нужны изображения в responseMimeType
        contents: [
          {
            role: "user",
            parts: [
              {
                text:
                  "Generate a single high quality image of a car. " +
                  "Description: " +
                  prompt
              }
            ]
          }
        ],
        generationConfig: {
          // просим именно картинку
          responseMimeType: "image/png"
        }
      })
    });

    if (!res.ok) {
      const errText = await res.text();
      statusEl.textContent = `Error: ${res.status} ${res.statusText}`;
      console.error("Gemini error:", errText);
      generateBtn.disabled = false;
      return;
    }

    const data = await res.json();
    /*
      Для image-ответов Gemini v1beta обычно возвращает base64
      в data.candidates[0].content.parts[0].inlineData.data
    */

    const candidate = data.candidates?.[0];
    if (!candidate) {
      statusEl.textContent = "No candidates returned from Gemini.";
      generateBtn.disabled = false;
      return;
    }

    const part = candidate.content?.parts?.find(
      (p) => p.inlineData && p.inlineData.data
    );

    if (!part) {
      statusEl.textContent = "No image data in response.";
      console.log("Response:", data);
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
