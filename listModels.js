const API_KEY = "AIzaSyDTXwlEQeAPW1I3GE-pDOmyDXBdDAT3dLI";

async function listModels() {
  const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    console.log("\nAvailable Models:\n");
    if (!data.models) {
      console.log("No models returned. Full response:");
      console.log(data);
      return;
    }

    data.models.forEach(m => {
      console.log("Model ID:", m.name);
      console.log("Supports:", m.supportedGenerationMethods);
      console.log("-----------------------------------");
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

listModels();
