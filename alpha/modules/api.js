// modules/api.js
// Mengelola logika terkait API Key dan panggilan ke Gemini API.

const API_KEY_STORAGE_KEY = 'geminiApiKey'; // Kunci untuk localStorage

export function getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
}

export function saveApiKey(key) {
    localStorage.setItem(API_KEY_STORAGE_KEY, key);
}

export function clearApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
}

// callGeminiAPI menerima API_KEY sebagai argumen pertama dari pemanggil
// Ini memungkinkan API_KEY dikelola di luar modul ini jika diperlukan,
// tetapi modul ini tetap bertanggung jawab atas panggilan fetch.
export async function callGeminiAPI(apiKey, prompt, schema = null, loadingElement, loadingTxtElement, loadingAdditionalElement = null, buttonToDisable) {
    if (!apiKey) {
        throw new Error("API Key Missing: Please enter your Gemini API key first.");
    }

    if (loadingElement) loadingElement.style.display = 'flex';
    if (buttonToDisable) buttonToDisable.disabled = true;
    
    let loadingTimeout;
    if (loadingAdditionalElement) {
        loadingAdditionalElement.style.display = 'none'; // Hide initially
        loadingTimeout = setTimeout(() => {
            loadingAdditionalElement.style.display = 'block';
        }, 6000); // Show message after 6 seconds
    }

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    let payload = { contents: chatHistory };

    if (schema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: schema
        };
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;
    console.log("Mengirim prompt ke Gemini API:", prompt); // Debugging: log prompt
    console.log("Payload:", payload); // Debugging: log payload

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Respons Error API:", errorData); // Debugging: log full error
            throw new Error(`Kesalahan API: ${response.status} - ${errorData.error.message}`);
        }

        const result = await response.json();
        console.log("Hasil Mentah API:", result); // Debugging: log raw result
        
        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            console.log("Teks Respons API:", text); // Debugging: log response text
            try {
                const parsed = schema ? JSON.parse(text) : text;
                console.log("Hasil Parsing API:", parsed); // Debugging: log parsed result
                return parsed;
            } catch (parseError) {
                console.error("Kesalahan mem-parsing respons API:", parseError, "Teks:", text);
                throw new Error(`Terjadi kesalahan saat memproses data AI. Coba lagi. Detail: ${parseError.message}`);
            }
        } else {
            throw new Error("Tidak ada konten yang diterima dari API atau struktur respons tidak terduga.");
        }
    } catch (error) {
        console.error("Kesalahan memanggil Gemini API:", error);
        throw error; // Melempar error agar bisa ditangkap oleh pemanggil
    } finally {
        if (loadingElement) loadingElement.style.display = 'none';
        if (buttonToDisable) buttonToDisable.disabled = false;
        if (loadingAdditionalElement) clearTimeout(loadingTimeout);
        if (loadingAdditionalElement) loadingAdditionalElement.style.display = 'none';
    }
}

