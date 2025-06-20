// --- API Key Handling ---
let API_KEY = ""; // This will be loaded from localStorage or set by user

// --- Global Game State ---
let currentStory = null;
let gameProgress = {
    currentChapterIndex: 0, // Untuk melacak bagian cerita yang sedang dibaca
    chapterContent: [],     // Akan menyimpan semua bagian cerita yang digenerate
    characterNames: {},     // Akan menyimpan nama-nama karakter yang ditentukan pengguna
    locationNames: {}       // Akan menyimpan nama-nama lokasi yang ditentukan pengguna
};
let storyContext = {
    title: '',
    description: '',
    genre: '',
    subgenre: '',
    language: 'id',
    mainCharacter: {}, // Akan menyimpan detail MC yang digenerate/dipilih AI
    culturalStyle: '' // Gaya budaya yang dipilih untuk penamaan
};
let availableCharacters = []; // Karakter yang digenerate AI untuk pemilihan (jika ada)

// --- DOM Elements ---
const apiKeyScreen = document.getElementById('api-key-screen');
const apiKeyInput = document.getElementById('api-key-input');
const saveApiKeyBtn = document.getElementById('save-api-key-btn');
const clearApiKeyBtn = document.getElementById('clear-api-key-btn');

const mainScreen = document.getElementById('main-screen');
const manualInputBtn = document.getElementById('manual-input-btn');
const aiGenerateBtn = document.getElementById('ai-generate-btn');

const manualInputScreen = document.getElementById('manual-input-screen');
const manualTitleInput = document.getElementById('manual-title');
const manualDescriptionInput = document.getElementById('manual-description');
const continueManualBtn = document.getElementById('continue-manual-btn');
const backFromManualBtn = document.getElementById('back-from-manual-btn');

const aiGenerateFormScreen = document.getElementById('ai-generate-form-screen');
const languageRadios = document.querySelectorAll('input[name="language"]');
const genreSelect = document.getElementById('genre-select');
const otherGenreInput = document.getElementById('other-genre-input');
const otherGenreContainer = document.getElementById('other-genre-container');
const subgenreSelect = document.getElementById('subgenre-select');
const subgenreManualInput = document.getElementById('subgenre-manual-input');
const subgenreManualInputContainer = document.getElementById('subgenre-manual-input-container');
const plotKeywordsInput = document.getElementById('plot-keywords-input');
const generateAiBtn = document.getElementById('generate-ai-btn'); // This is the button on the AI form screen
const backFromAiFormBtn = document.getElementById('back-from-ai-form-btn');
const loadingAi = document.getElementById('game-loading-overlay'); // Renamed for consistency

// Story Selection Screen Elements
const storySelectionScreen = document.getElementById('story-selection-screen');
const storySummaryTitle = document.getElementById('story-summary-title');
const storySummaryDescription = document.getElementById('story-summary-description');
const storySummaryProlog = document.getElementById('story-summary-prolog');
const cultureStyleSelect = document.getElementById('culture-style-select');
const selectStoryAndCultureBtn = document.getElementById('select-story-and-culture-btn');
const backFromStorySelectionBtn = document.getElementById('back-from-story-selection-btn');

// Character Naming Screen Elements
const characterNamingScreen = document.getElementById('character-naming-screen');
const selectedCultureDisplay = document.getElementById('selected-culture-display');
const characterInputArea = document.getElementById('character-input-area');
const startStoryBtn = document.getElementById('start-story-btn');
const backFromNamingBtn = document.getElementById('back-from-naming-btn');

// Story Reading Screen Elements
const storyReadingScreen = document.getElementById('story-reading-screen');
const storyTitleDisplay = document.getElementById('story-title-display');
const storyContent = document.getElementById('story-content');
const continueReadingBtn = document.getElementById('continue-reading-btn');
const backToMainMenuFromStoryBtn = document.getElementById('back-to-main-menu-from-story-btn');

const gameLoadingOverlay = document.getElementById('game-loading-overlay'); // Make sure this points to the single loading overlay
const customMessageBox = document.getElementById('custom-message-box');
const messageBoxTitle = document.getElementById('message-box-title');
const messageBoxContent = document.getElementById('message-box-content');
const messageBoxOkBtn = document.getElementById('message-box-ok-btn');

// --- Utility Functions ---

function showScreen(screenId) {
    console.log(`Menampilkan layar: ${screenId}`);
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.style.display = 'none');
    document.getElementById(screenId).style.display = 'flex';
}

function showMessageBox(title, message, onOk = null) {
    console.log(`Menampilkan pesan: ${title} - ${message}`);
    messageBoxTitle.textContent = title;
    messageBoxContent.textContent = message;
    customMessageBox.style.display = 'flex';
    messageBoxOkBtn.onclick = () => {
        customMessageBox.style.display = 'none';
        if (onOk) onOk();
    };
}

function getApiKey() {
    return localStorage.getItem('gemini_api_key');
}

function setApiKey(key) {
    localStorage.setItem('gemini_api_key', key);
    API_KEY = key;
}

function clearApiKey() {
    localStorage.removeItem('gemini_api_key');
    API_KEY = "";
}

function setMainButtonsEnabled(enabled) {
    manualInputBtn.disabled = !enabled;
    aiGenerateBtn.disabled = !enabled;
}

// --- Theme Toggle ---
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-theme');
    body.classList.toggle('light-theme');
    const isDarkMode = body.classList.contains('dark-theme');
    themeToggle.querySelector('i').className = isDarkMode ? 'fas fa-sun text-yellow-300 text-xl' : 'fas fa-moon text-gray-700 text-xl';
    // Removed the span update here as the HTML does not have a span for text
});

// Initial theme setup (from localStorage or default)
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    themeToggle.querySelector('i').className = 'fas fa-sun text-yellow-300 text-xl';
} else {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    themeToggle.querySelector('i').className = 'fas fa-moon text-gray-700 text-xl';
}


// --- AI Model Interaction ---
async function callGeminiAPI(prompt, isJson = false, schema = null) {
    console.log("Memanggil Gemini API dengan prompt:", prompt);
    if (!API_KEY) {
        showMessageBox("Kesalahan API", "Kunci API tidak ditemukan. Harap masukkan kunci API Anda di layar pengaturan.");
        return null;
    }

    let chatHistory = [];
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    let payload = { contents: chatHistory };

    if (isJson && schema) {
        payload.generationConfig = {
            responseMimeType: "application/json",
            responseSchema: schema
        };
    }

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            console.log("Respon API Gemini (mentah):", text);
            if (isJson) {
                try {
                    return JSON.parse(text);
                } catch (jsonError) {
                    showMessageBox("Error JSON Parsing", "Respon API bukan JSON yang valid. Coba lagi.");
                    console.error("Error parsing JSON from API:", jsonError, "Raw text:", text);
                    return null;
                }
            }
            return text;
        } else if (result.error) {
            showMessageBox("Error API Gemini", `Terjadi kesalahan: ${result.error.message}`);
            console.error("Gemini API Error:", result.error);
            return null;
        } else {
            showMessageBox("Error API Gemini", "Respon API tidak memiliki format yang diharapkan.");
            console.error("Unexpected Gemini API response:", result);
            return null;
        }
    } catch (error) {
        showMessageBox("Error Jaringan", "Gagal terhubung ke API Gemini. Periksa koneksi internet Anda atau kunci API.");
        console.error("Network or API error:", error);
        return null;
    }
}

// --- Subgenre Generation (AI-driven) ---
async function generateSubgenresForGenre(genre, language) {
    console.log(`Memulai generateSubgenresForGenre untuk genre: ${genre}, bahasa: ${language}`);
    gameLoadingOverlay.style.display = 'flex';
    gameLoadingOverlay.querySelector('span').textContent = `Menghasilkan subgenre untuk ${genre}...`;

    const prompt = `
    Berikan 5-10 subgenre yang sangat spesifik dan relevan untuk genre "${genre}".
    Format respons sebagai array JSON string dari nama subgenre.
    Contoh: ["Subgenre A", "Subgenre B", "Subgenre C"]
    Bahasa untuk subgenre: ${language === 'id' ? 'Bahasa Indonesia' : 'English'}.
    Pastikan respons hanya array JSON.
    `;

    const schema = {
        type: "ARRAY",
        items: { type: "STRING" }
    };

    try {
        const subgenres = await callGeminiAPI(prompt, true, schema);
        console.log("Subgenre yang dihasilkan:", subgenres);
        return subgenres || [];
    } catch (error) {
        console.error("Error generating subgenres:", error);
        showMessageBox("Error", "Gagal menghasilkan subgenre. Coba lagi.");
        return [];
    } finally {
        gameLoadingOverlay.style.display = 'none'; // Ensure loading is hidden
    }
}

// --- Story Generation (AI) ---
async function generateStoryOutline(language, genre, subgenre, plotKeywords) {
    console.log("Memulai generateStoryOutline...");
    gameLoadingOverlay.style.display = 'flex'; // Use gameLoadingOverlay
    gameLoadingOverlay.querySelector('span').textContent = "Menulis ide cerita Anda...";

    const genreText = genre === 'other' ? otherGenreInput.value : genre;
    const subgenreText = subgenre === 'other' ? subgenreManualInput.value : subgenre;

    let fullGenreDescription = genreText;
    if (subgenreText && subgenreText !== "Pilih Subgenre") {
        fullGenreDescription += ` (${subgenreText})`;
    }

    const prompt = `
    Buat ide cerita yang menarik dengan judul, deskripsi, dan prolog awal untuk sebuah cerita baca non-interaktif.
    Karakter utama sudah ditentukan dalam narasi prolog, tidak ada pemilihan MC terpisah.
    Penting: Prolog harus menjadi bagian cerita yang berkelanjutan, bukan sekadar ringkasan.
    Ini harus terasa seperti awal bab pertama.

    Format respons sebagai objek JSON:
    {
      "title": "Judul Cerita",
      "description": "Deskripsi singkat tentang premis cerita, konflik utama, dan karakter utama yang secara inheren cocok dengan alur non-interaktif.",
      "prolog": "Prolog awal cerita, yang memperkenalkan dunia dan karakter utama secara naratif. Ini harus menjadi bagian pertama dari cerita yang akan dibaca, bukan ringkasan."
    }

    Detail Cerita:
    - Bahasa: ${language === 'id' ? 'Bahasa Indonesia' : 'English'}
    - Genre: ${fullGenreDescription}
    - Kata Kunci/Ide Plot (jika ada): ${plotKeywords ? plotKeywords : 'Tidak ada'}
    - Fokus: Buat alur yang menarik untuk dibaca, dengan fokus pada narasi dan pengembangan karakter tanpa perlu pilihan.
    `;

    const schema = {
        type: "OBJECT",
        properties: {
            title: { type: "STRING" },
            description: { type: "STRING" },
            prolog: { type: "STRING" }
        },
        required: ["title", "description", "prolog"]
    };

    try {
        const story = await callGeminiAPI(prompt, true, schema);
        console.log("Story outline generated:", story);
        return story;
    } catch (error) {
        console.error("Error generating story outline:", error);
        showMessageBox("Error", "Gagal menghasilkan ide cerita. Coba lagi.");
        return null;
    } finally {
        gameLoadingOverlay.style.display = 'none'; // Ensure loading is hidden
    }
}

// --- Story Continuation (AI) ---
async function generateStoryChapter(language, previousContent, currentChapterIndex, culturalStyle, characterNames, locationNames) {
    console.log(`Memulai generateStoryChapter untuk chapter ${currentChapterIndex + 1}`);
    gameLoadingOverlay.style.display = 'flex';
    gameLoadingOverlay.querySelector('span').textContent = `Melanjutkan cerita bagian ${currentChapterIndex + 1}...`;

    // Replace placeholders with chosen names
    let contentForAI = previousContent;
    for (const key in characterNames) {
        const regex = new RegExp(`\\[KARAKTER_${key.toUpperCase()}\\]`, 'g');
        contentForAI = contentForAI.replace(regex, characterNames[key]);
    }
    for (const key in locationNames) {
        const regex = new RegExp(`\\[LOKASI_${key.toUpperCase()}\\]`, 'g');
        contentForAI = contentForAI.replace(regex, locationNames[key]);
    }

    const prompt = `
    Lanjutkan cerita berikut. Cerita ini adalah novel bacaan lurus tanpa pilihan atau sistem interaktif.
    Fokus pada pengembangan plot, pengembangan karakter, deskripsi adegan, dan dialog.
    Cerita harus terus berlanjut secara logis dan menarik.
    Jangan memperkenalkan pilihan atau pertanyaan kepada pembaca.
    Pastikan cerita tetap kohesif dengan bagian sebelumnya.

    Gaya penulisan: detail, mengalir, dan imersif.
    Panjang: sekitar 300-500 kata untuk satu bagian/chapter.
    Gaya budaya penamaan yang disukai: ${culturalStyle}.
    Nama Karakter yang harus digunakan (jika relevan, gunakan dalam cerita): ${JSON.stringify(characterNames)}
    Nama Lokasi yang harus digunakan (jika relevan, gunakan dalam cerita): ${JSON.stringify(locationNames)}

    Bagian cerita sebelumnya:
    ${previousContent}

    Lanjutkan ceritanya dari sini. Mulai langsung dengan narasi.
    `;

    try {
        const newChapter = await callGeminiAPI(prompt);
        console.log("New chapter generated:", newChapter);
        return newChapter;
    } catch (error) {
        console.error("Error generating story chapter:", error);
        showMessageBox("Error", "Gagal melanjutkan cerita. Coba lagi.");
        return null;
    } finally {
        gameLoadingOverlay.style.display = 'none'; // Ensure loading is hidden
    }
}

// --- Cultural Naming Generation (AI) ---
async function generateNamesForCulture(culture, language, numCharacters, numLocations, existingCharacters = [], existingLocations = []) {
    console.log(`Memulai generateNamesForCulture untuk budaya: ${culture}, chars: ${numCharacters}, locs: ${numLocations}`);
    gameLoadingOverlay.style.display = 'flex';
    gameLoadingOverlay.querySelector('span').textContent = `Menciptakan nama-nama ${culture}...`;

    const prompt = `
    Hasilkan nama-nama yang cocok dengan gaya budaya "${culture}".
    Sertakan ${numCharacters} nama karakter (nama depan dan nama keluarga jika sesuai) dan ${numLocations} nama lokasi (desa/kota, provinsi/wilayah) yang baru.
    Berikan nama-nama yang belum ada di daftar berikut: Karakter: ${existingCharacters.join(', ')}, Lokasi: ${existingLocations.join(', ')}.
    Penting: Pastikan nama-nama ini relevan dan otentik untuk budaya tersebut.
    Gunakan bahasa ${language === 'id' ? 'Indonesia' : 'Inggris'} untuk deskripsi.
    Format respons sebagai objek JSON:
    {
      "character_names": ["Nama Karakter 1", "Nama Karakter 2", ...],
      "location_names": ["Nama Lokasi 1", "Nama Lokasi 2", ...]
    }
    `;

    const schema = {
        type: "OBJECT",
        properties: {
            character_names: {
                type: "ARRAY",
                items: { type: "STRING" }
            },
            location_names: {
                type: "ARRAY",
                items: { type: "STRING" }
            }
        },
        required: ["character_names", "location_names"]
    };

    try {
        const names = await callGeminiAPI(prompt, true, schema);
        console.log("Nama-nama yang dihasilkan:", names);
        return names;
    } catch (error) {
        console.error("Error generating names:", error);
        showMessageBox("Error", "Gagal menghasilkan nama-nama. Coba lagi.");
        return { character_names: [], location_names: [] };
    } finally {
        gameLoadingOverlay.style.display = 'none'; // Ensure loading is hidden
    }
}


// --- Event Listeners ---

// API Key Screen
saveApiKeyBtn.addEventListener('click', () => {
    console.log("Tombol 'Simpan Kunci API' diklik.");
    const key = apiKeyInput.value.trim();
    if (key) {
        setApiKey(key);
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showMessageBox("Peringatan", "Kunci API tidak boleh kosong.");
    }
});

clearApiKeyBtn.addEventListener('click', () => {
    console.log("Tombol 'Hapus Kunci API' diklik.");
    clearApiKey();
    apiKeyInput.value = '';
    showMessageBox("Info", "Kunci API telah dihapus dari penyimpanan lokal.");
    setMainButtonsEnabled(false);
});

// Main Screen
manualInputBtn.addEventListener('click', () => {
    console.log("Tombol 'Input Cerita Manual' diklik.");
    showScreen('manual-input-screen');
});

aiGenerateBtn.addEventListener('click', () => {
    console.log("Tombol 'Buat Cerita dengan AI' (Main Screen) diklik.");
    if (!API_KEY) {
        showScreen('api-key-screen');
        showMessageBox("Kunci API Diperlukan", "Harap masukkan kunci API Gemini Anda untuk menggunakan fitur AI.");
    } else {
        showScreen('ai-generate-form-screen');
    }
});

// Manual Input Screen
continueManualBtn.addEventListener('click', () => {
    console.log("Tombol 'Lanjutkan (Manual Input)' diklik.");
    const title = manualTitleInput.value.trim();
    const description = manualDescriptionInput.value.trim();

    if (!title || !description) {
        showMessageBox("Input Diperlukan", "Judul dan Deskripsi/Prolog tidak boleh kosong.");
        console.log("Validasi input manual gagal.");
        return;
    }

    // Set story context for manual input
    storyContext.title = title;
    storyContext.description = description;
    storyContext.prolog = description; // For manual, description acts as prolog
    storyContext.genre = 'Manual'; // Mark as manual
    storyContext.subgenre = '';
    storyContext.language = 'id'; // Default to Indonesian for manual

    // Show story selection screen with manual input
    storySummaryTitle.textContent = storyContext.title;
    storySummaryDescription.textContent = storyContext.description;
    storySummaryProlog.textContent = storyContext.prolog;
    console.log("Menampilkan Story Selection Screen dari Manual Input.");
    showScreen('story-selection-screen');
});

backFromManualBtn.addEventListener('click', () => {
    console.log("Tombol 'Kembali (Manual Input)' diklik.");
    showScreen('main-screen');
});

// AI Generate Form Screen
genreSelect.addEventListener('change', async () => {
    console.log("Genre dipilih. Memulai pembaruan subgenre.");
    const selectedGenre = genreSelect.value;
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;

    otherGenreContainer.style.display = 'none';
    subgenreSelect.style.display = 'none';
    subgenreManualInputContainer.style.display = 'none';
    subgenreSelect.innerHTML = '<option value="">Pilih Subgenre</option>'; // Reset subgenre

    if (selectedGenre === 'other') {
        otherGenreContainer.style.display = 'block';
    } else if (selectedGenre) {
        try {
            const subgenres = await generateSubgenresForGenre(selectedGenre, selectedLanguage);
            if (subgenres && subgenres.length > 0) {
                subgenreSelect.style.display = 'block';
                subgenres.forEach(sub => {
                    const option = document.createElement('option');
                    option.value = sub;
                    option.textContent = sub;
                    subgenreSelect.appendChild(option);
                });
                // Add 'Other' option for subgenre if AI didn't provide enough or user wants custom
                const otherOption = document.createElement('option');
                otherOption.value = 'other';
                otherOption.textContent = 'Lainnya...';
                subgenreSelect.appendChild(otherOption);
            } else {
                console.log("Tidak ada subgenre yang dihasilkan AI, menampilkan input manual subgenre.");
                // If no subgenres are generated, allow manual input directly
                subgenreManualInputContainer.style.display = 'block';
            }
        } catch (error) {
            console.error("Kesalahan saat mengubah genre:", error);
            showMessageBox("Error", "Terjadi kesalahan saat memuat subgenre. Silakan coba lagi.");
            subgenreManualInputContainer.style.display = 'block'; // Fallback to manual input
        }
    }
});

subgenreSelect.addEventListener('change', () => {
    console.log("Subgenre dipilih.");
    if (subgenreSelect.value === 'other') {
        subgenreManualInputContainer.style.display = 'block';
    } else {
        subgenreManualInputContainer.style.display = 'none';
    }
});


generateAiBtn.addEventListener('click', async () => {
    console.log("Tombol 'Buat Cerita (AI Generate Form)' diklik.");
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const selectedGenre = genreSelect.value;
    const plotKeywords = plotKeywordsInput.value.trim();
    let selectedSubgenre = subgenreSelect.value;

    if (selectedGenre === 'other' && !otherGenreInput.value.trim()) {
        showMessageBox("Input Diperlukan", "Mohon masukkan genre lainnya.");
        console.log("Validasi genre 'other' gagal.");
        return;
    }
    if (selectedGenre && selectedSubgenre === 'other' && !subgenreManualInput.value.trim()) {
         showMessageBox("Input Diperlukan", "Mohon masukkan subgenre lainnya.");
         console.log("Validasi subgenre 'other' gagal.");
         return;
    }

    if (!selectedGenre) {
        showMessageBox("Input Diperlukan", "Mohon pilih genre cerita.");
        console.log("Validasi genre kosong gagal.");
        return;
    }

    const genreToUse = selectedGenre === 'other' ? otherGenreInput.value.trim() : selectedGenre;
    const subgenreToUse = selectedSubgenre === 'other' ? subgenreManualInput.value.trim() : selectedSubgenre;


    gameLoadingOverlay.style.display = 'flex'; // Use gameLoadingOverlay for all main loading
    gameLoadingOverlay.querySelector('span').textContent = 'Menghasilkan ide cerita...';

    try {
        currentStory = await generateStoryOutline(selectedLanguage, genreToUse, subgenreToUse, plotKeywords);

        if (currentStory) {
            storyContext.title = currentStory.title;
            storyContext.description = currentStory.description;
            storyContext.prolog = currentStory.prolog;
            storyContext.genre = genreToUse;
            storyContext.subgenre = subgenreToUse;
            storyContext.language = selectedLanguage;

            storySummaryTitle.textContent = currentStory.title;
            storySummaryDescription.textContent = currentStory.description;
            storySummaryProlog.textContent = currentStory.prolog;
            console.log("Story outline berhasil digenerate. Menampilkan Story Selection Screen.");
            showScreen('story-selection-screen');
        } else {
            showMessageBox("Gagal", "Gagal menghasilkan cerita. Silakan coba lagi.");
            console.log("currentStory kosong setelah generateStoryOutline.");
        }
    } catch (error) {
        console.error("Kesalahan umum saat menghasilkan cerita AI:", error);
        showMessageBox("Error", "Terjadi kesalahan fatal saat menghasilkan cerita. Coba lagi.");
    } finally {
        gameLoadingOverlay.style.display = 'none'; // Ensure loading is hidden even on error
    }
});

backFromAiFormBtn.addEventListener('click', () => {
    console.log("Tombol 'Kembali (AI Form)' diklik.");
    showScreen('main-screen');
});

// Story Selection Screen
selectStoryAndCultureBtn.addEventListener('click', async () => {
    console.log("Tombol 'Lanjutkan ke Penamaan' diklik.");
    const culturalStyle = cultureStyleSelect.value;
    if (!culturalStyle) {
        showMessageBox("Pilihan Diperlukan", "Harap pilih ala budaya.");
        console.log("Validasi gaya budaya gagal.");
        return;
    }
    storyContext.culturalStyle = culturalStyle;
    selectedCultureDisplay.textContent = culturalStyle === 'custom' ? 'Kustom' : culturalStyle.charAt(0).toUpperCase() + culturalStyle.slice(1).replace('_', ' ');

    characterInputArea.innerHTML = ''; // Clear previous inputs

    // Add inputs for main character and 2 general locations initially
    let charCount = 0;
    let locCount = 0;

    // Try to extract a potential main character name from the prolog or a generic one
    // Note: This simple regex might not always catch the main character effectively.
    // For more robust extraction, a more advanced AI call might be needed,
    // but for now, we'll use a generic placeholder if detection fails.
    const mcNameMatch = currentStory.prolog.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)?)\s+(adalah|bernama|yang)/i);
    const mcPlaceholder = mcNameMatch && mcNameMatch[1] ? mcNameMatch[1].trim() : 'Karakter Utama';

    addNamingInput('char', 'Nama Karakter Utama', 'mc', mcPlaceholder);
    charCount++;

    addNamingInput('loc', 'Nama Desa/Kota Utama', 'loc1', 'Nama Desa/Kota');
    locCount++;
    addNamingInput('loc', 'Nama Provinsi/Wilayah Utama', 'loc2', 'Nama Provinsi/Wilayah');
    locCount++;


    if (culturalStyle !== 'custom') {
        try {
            const generatedNames = await generateNamesForCulture(culturalStyle, storyContext.language, charCount, locCount, [], []);

            // Fill in generated names into the inputs if they exist
            const mcInput = document.getElementById('char-mc');
            if (mcInput && generatedNames.character_names && generatedNames.character_names[0]) {
                mcInput.value = generatedNames.character_names[0];
            }

            const loc1Input = document.getElementById('loc-loc1');
            if (loc1Input && generatedNames.location_names && generatedNames.location_names[0]) {
                loc1Input.value = generatedNames.location_names[0];
            }

            const loc2Input = document.getElementById('loc-loc2');
            if (loc2Input && generatedNames.location_names && generatedNames.location_names[1]) {
                loc2Input.value = generatedNames.location_names[1];
            }
        } catch (error) {
            console.error("Kesalahan saat menghasilkan nama untuk budaya:", error);
            showMessageBox("Error", "Gagal menghasilkan nama budaya. Silakan isi manual.");
        }
    }
    console.log("Menampilkan Character Naming Screen.");
    showScreen('character-naming-screen');
});

backFromStorySelectionBtn.addEventListener('click', () => {
    console.log("Tombol 'Kembali (Story Selection)' diklik.");
    // Determine which screen to go back to based on how we got to story-selection-screen
    if (storyContext.genre === 'Manual') {
        showScreen('manual-input-screen');
    } else {
        showScreen('ai-generate-form-screen');
    }
});

// Character Naming Screen
startStoryBtn.addEventListener('click', async () => {
    console.log("Tombol 'Mulai Cerita' diklik.");
    gameProgress.characterNames = {};
    gameProgress.locationNames = {};

    let allInputsValid = true;
    const inputs = characterInputArea.querySelectorAll('input[type="text"]');
    inputs.forEach(input => {
        if (!input.value.trim()) {
            allInputsValid = false;
            input.classList.add('border-red-500'); // Highlight empty input
        } else {
            input.classList.remove('border-red-500');
            const type = input.id.split('-')[0];
            const key = input.id.split('-')[1];
            if (type === 'char') {
                gameProgress.characterNames[key] = input.value.trim();
            } else if (type === 'loc') {
                gameProgress.locationNames[key] = input.value.trim();
            }
        }
    });

    if (!allInputsValid) {
        showMessageBox("Input Diperlukan", "Harap isi semua bidang nama.");
        console.log("Validasi input nama karakter/lokasi gagal.");
        return;
    }

    // Initialize story content with prolog
    gameProgress.chapterContent = [];
    gameProgress.currentChapterIndex = 0;

    // Replace character and location placeholders in prolog with user-defined names
    let processedProlog = storyContext.prolog;
    for (const key in gameProgress.characterNames) {
        // Use a more generic placeholder format for replacement,
        // and ensure AI understands to use the names directly.
        // Example: replace "karakter utama" or specific AI-generated character tags in prolog
        // This is a simplification; a more robust solution might involve AI generating
        // the *prolog with placeholders* and then replacing them here.
        // For now, we assume the prolog might use generic terms like "sang pahlawan"
        // or AI might generate placeholder like [MC_NAME] that we replace.
        // If the prolog doesn't contain placeholders, this step won't do much.
        const charName = gameProgress.characterNames[key];
        // Simple heuristic: try to replace "Karakter Utama" with the chosen name
        if (key === 'mc') {
            processedProlog = processedProlog.replace(/Karakter Utama/g, charName);
            processedProlog = processedProlog.replace(/sang pahlawan/g, charName);
            processedProlog = processedProlog.replace(/seorang (pemuda|gadis|ksatria|penjelajah)/g, charName); // Example, might be too aggressive
        }
        // More robust: If AI uses specific tags like [MC_NAME], replace those.
        processedProlog = processedProlog.replace(new RegExp(`\\[${key.toUpperCase()}_NAME\\]`, 'g'), charName); // For [MC_NAME]
        processedProlog = processedProlog.replace(new RegExp(`\\[KARAKTER_${key.toUpperCase()}\\]`, 'g'), charName); // For [KARAKTER_MC]
    }
    for (const key in gameProgress.locationNames) {
        const locName = gameProgress.locationNames[key];
        // Similar replacement for locations
        processedProlog = processedProlog.replace(new RegExp(`\\[LOKASI_${key.toUpperCase()}\\]`, 'g'), locName); // For [LOKASI_LOC1]
        processedProlog = processedProlog.replace(new RegExp(`desa\\s+sukorame|provinsi\\s+jawa\\s+timur`, 'gi'), locName); // Example, be careful with broad replacements
    }


    gameProgress.chapterContent.push(processedProlog);
    storyTitleDisplay.textContent = storyContext.title;
    storyContent.innerHTML = `<p>${processedProlog.replace(/\n/g, '</p><p>')}</p>`; // Display prolog

    console.log("Mulai membaca cerita. Menampilkan Story Reading Screen.");
    showScreen('story-reading-screen');
});

backFromNamingBtn.addEventListener('click', () => {
    console.log("Tombol 'Kembali (Character Naming)' diklik.");
    showScreen('story-selection-screen');
});

// Story Reading Screen
continueReadingBtn.addEventListener('click', async () => {
    console.log("Tombol 'Lanjutkan Cerita' diklik. Chapter saat ini:", gameProgress.currentChapterIndex);
    gameProgress.currentChapterIndex++;
    // Check if we already have the next chapter generated
    if (gameProgress.currentChapterIndex < gameProgress.chapterContent.length) {
        displayCurrentChapter();
    } else {
        // If not, generate the next chapter
        const previousContent = gameProgress.chapterContent[gameProgress.chapterContent.length - 1];
        try {
            const newChapter = await generateStoryChapter(
                storyContext.language,
                previousContent,
                gameProgress.currentChapterIndex,
                storyContext.culturalStyle,
                gameProgress.characterNames,
                gameProgress.locationNames
            );
            if (newChapter) {
                gameProgress.chapterContent.push(newChapter);
                displayCurrentChapter();
            } else {
                // This branch is reached if generateStoryChapter returns null (e.g., API error)
                showMessageBox("Akhir Cerita atau Error", "Anda telah mencapai akhir cerita atau terjadi kesalahan saat melanjutkan. Kembali ke menu utama.");
                backToMainMenuFromStoryBtn.click(); // Go back to main menu
            }
        } catch (error) {
            console.error("Kesalahan saat melanjutkan cerita:", error);
            showMessageBox("Error", "Terjadi kesalahan saat melanjutkan cerita. Silakan coba lagi.");
            backToMainMenuFromStoryBtn.click(); // Go back to main menu
        }
    }
});

backToMainMenuFromStoryBtn.addEventListener('click', () => {
    console.log("Tombol 'Kembali ke Menu Utama' diklik. Mereset game state.");
    showScreen('main-screen');
    // Reset game state
    currentStory = null;
    gameProgress = {
        currentChapterIndex: 0,
        chapterContent: [],
        characterNames: {},
        locationNames: {}
    };
    storyContext = {
        title: '',
        description: '',
        genre: '',
        subgenre: '',
        language: 'id',
        mainCharacter: {},
        culturalStyle: ''
    };
    // Clear display
    storyContent.innerHTML = '';
});

// --- Helper for dynamic naming inputs ---
function addNamingInput(type, labelText, idSuffix, placeholder) {
    const div = document.createElement('div');
    div.classList.add('input-group');
    const label = document.createElement('label');
    label.setAttribute('for', `${type}-${idSuffix}`);
    label.classList.add('form-label');
    label.textContent = labelText + ':';
    const input = document.createElement('input');
    input.type = 'text';
    input.id = `${type}-${idSuffix}`;
    input.classList.add('form-input');
    input.placeholder = placeholder;

    div.appendChild(label);
    div.appendChild(input);
    characterInputArea.appendChild(div);
    console.log(`Input penamaan ditambahkan: ${type}-${idSuffix}`);
}

// --- Display Current Chapter Function ---
function displayCurrentChapter() {
    console.log(`Menampilkan chapter ${gameProgress.currentChapterIndex}.`);
    if (gameProgress.chapterContent[gameProgress.currentChapterIndex]) {
        const chapterText = gameProgress.chapterContent[gameProgress.currentChapterIndex];
        storyContent.innerHTML = `<p>${chapterText.replace(/\n/g, '</p><p>')}</p>`;
        storyContent.scrollTop = 0; // Scroll to top for new chapter
    } else {
        console.warn(`Chapter ${gameProgress.currentChapterIndex} tidak ditemukan dalam chapterContent.`);
    }
}


// --- Initialization ---
window.onload = () => {
    console.log("Window loaded. Memulai inisialisasi aplikasi.");
    API_KEY = getApiKey();
    if (API_KEY) {
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showScreen('api-key-screen');
    }
};


