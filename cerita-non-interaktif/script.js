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
const generateAiBtn = document.getElementById('generate-ai-btn');
const backFromAiFormBtn = document.getElementById('back-from-ai-form-btn');
const loadingAi = document.getElementById('loading-ai');
const loadingText = document.getElementById('loading-text');

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

const gameLoadingOverlay = document.getElementById('game-loading-overlay');
const customMessageBox = document.getElementById('custom-message-box');
const messageBoxTitle = document.getElementById('message-box-title');
const messageBoxContent = document.getElementById('message-box-content');
const messageBoxOkBtn = document.getElementById('message-box-ok-btn');

// --- Utility Functions ---

function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => screen.style.display = 'none');
    document.getElementById(screenId).style.display = 'flex';
    if (screenId === 'game-screen') {
        // Additional handling for game screen if needed
    }
}

function showMessageBox(title, message, onOk = null) {
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
    themeToggle.querySelector('span').textContent = isDarkMode ? 'Mode Terang' : 'Mode Gelap';
});

// Initial theme setup (from localStorage or default)
if (localStorage.getItem('theme') === 'dark') {
    body.classList.add('dark-theme');
    body.classList.remove('light-theme');
    themeToggle.querySelector('i').className = 'fas fa-sun text-yellow-300 text-xl';
    themeToggle.querySelector('span').textContent = 'Mode Terang';
} else {
    body.classList.add('light-theme');
    body.classList.remove('dark-theme');
    themeToggle.querySelector('i').className = 'fas fa-moon text-gray-700 text-xl';
    themeToggle.querySelector('span').textContent = 'Mode Gelap';
}

// --- AI Model Interaction ---
async function callGeminiAPI(prompt, isJson = false, schema = null) {
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
            if (isJson) {
                return JSON.parse(text);
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
    loadingAi.style.display = 'flex';
    loadingText.textContent = `Menghasilkan subgenre untuk ${genre}...`;

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
        loadingAi.style.display = 'none';
        return subgenres || [];
    } catch (error) {
        console.error("Error generating subgenres:", error);
        loadingAi.style.display = 'none';
        showMessageBox("Error", "Gagal menghasilkan subgenre. Coba lagi.");
        return [];
    }
}

// --- Story Generation (AI) ---
async function generateStoryOutline(language, genre, subgenre, plotKeywords) {
    loadingAi.style.display = 'flex';
    loadingText.textContent = "Menulis ide cerita Anda...";

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
        loadingAi.style.display = 'none';
        return story;
    } catch (error) {
        console.error("Error generating story outline:", error);
        loadingAi.style.display = 'none';
        showMessageBox("Error", "Gagal menghasilkan ide cerita. Coba lagi.");
        return null;
    }
}

// --- Story Continuation (AI) ---
async function generateStoryChapter(language, previousContent, currentChapterIndex, culturalStyle, characterNames, locationNames) {
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
        gameLoadingOverlay.style.display = 'none';
        return newChapter;
    } catch (error) {
        console.error("Error generating story chapter:", error);
        gameLoadingOverlay.style.display = 'none';
        showMessageBox("Error", "Gagal melanjutkan cerita. Coba lagi.");
        return null;
    }
}

// --- Cultural Naming Generation (AI) ---
async function generateNamesForCulture(culture, language, numCharacters, numLocations, existingCharacters = [], existingLocations = []) {
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
        gameLoadingOverlay.style.display = 'none';
        return names;
    } catch (error) {
        console.error("Error generating names:", error);
        gameLoadingOverlay.style.display = 'none';
        showMessageBox("Error", "Gagal menghasilkan nama-nama. Coba lagi.");
        return { character_names: [], location_names: [] };
    }
}


// --- Event Listeners ---

// API Key Screen
saveApiKeyBtn.addEventListener('click', () => {
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
    clearApiKey();
    apiKeyInput.value = '';
    showMessageBox("Info", "Kunci API telah dihapus dari penyimpanan lokal.");
    setMainButtonsEnabled(false);
});

// Main Screen
manualInputBtn.addEventListener('click', () => {
    showScreen('manual-input-screen');
});

aiGenerateBtn.addEventListener('click', () => {
    if (!API_KEY) {
        showScreen('api-key-screen');
        showMessageBox("Kunci API Diperlukan", "Harap masukkan kunci API Gemini Anda untuk menggunakan fitur AI.");
    } else {
        showScreen('ai-generate-form-screen');
    }
});

// Manual Input Screen
continueManualBtn.addEventListener('click', () => {
    const title = manualTitleInput.value.trim();
    const description = manualDescriptionInput.value.trim();

    if (!title || !description) {
        showMessageBox("Input Diperlukan", "Judul dan Deskripsi/Prolog tidak boleh kosong.");
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
    showScreen('story-selection-screen');
});

backFromManualBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

// AI Generate Form Screen
genreSelect.addEventListener('change', async () => {
    const selectedGenre = genreSelect.value;
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;

    otherGenreContainer.style.display = 'none';
    subgenreSelect.style.display = 'none';
    subgenreManualInputContainer.style.display = 'none';
    subgenreSelect.innerHTML = '<option value="">Pilih Subgenre</option>'; // Reset subgenre

    if (selectedGenre === 'other') {
        otherGenreContainer.style.display = 'block';
    } else if (selectedGenre) {
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
            // If no subgenres are generated, allow manual input directly
            subgenreManualInputContainer.style.display = 'block';
        }
    }
});

subgenreSelect.addEventListener('change', () => {
    if (subgenreSelect.value === 'other') {
        subgenreManualInputContainer.style.display = 'block';
    } else {
        subgenreManualInputContainer.style.display = 'none';
    }
});


generateAiBtn.addEventListener('click', async () => {
    const selectedLanguage = document.querySelector('input[name="language"]:checked').value;
    const selectedGenre = genreSelect.value;
    const plotKeywords = plotKeywordsInput.value.trim();
    let selectedSubgenre = subgenreSelect.value;

    if (selectedGenre === 'other' && !otherGenreInput.value.trim()) {
        showMessageBox("Input Diperlukan", "Mohon masukkan genre lainnya.");
        return;
    }
    if (selectedGenre && selectedSubgenre === 'other' && !subgenreManualInput.value.trim()) {
         showMessageBox("Input Diperlukan", "Mohon masukkan subgenre lainnya.");
         return;
    }

    if (!selectedGenre) {
        showMessageBox("Input Diperlukan", "Mohon pilih genre cerita.");
        return;
    }

    const genreToUse = selectedGenre === 'other' ? otherGenreInput.value.trim() : selectedGenre;
    const subgenreToUse = selectedSubgenre === 'other' ? subgenreManualInput.value.trim() : selectedSubgenre;


    loadingAi.style.display = 'flex';
    loadingText.textContent = 'Menghasilkan ide cerita...';

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
        showScreen('story-selection-screen');
    } else {
        showMessageBox("Gagal", "Gagal menghasilkan cerita. Silakan coba lagi.");
    }
    loadingAi.style.display = 'none';
});

backFromAiFormBtn.addEventListener('click', () => {
    showScreen('main-screen');
});

// Story Selection Screen
selectStoryAndCultureBtn.addEventListener('click', async () => {
    const culturalStyle = cultureStyleSelect.value;
    if (!culturalStyle) {
        showMessageBox("Pilihan Diperlukan", "Harap pilih ala budaya.");
        return;
    }
    storyContext.culturalStyle = culturalStyle;
    selectedCultureDisplay.textContent = culturalStyle === 'custom' ? 'Kustom' : culturalStyle.charAt(0).toUpperCase() + culturalStyle.slice(1).replace('_', ' ');

    // Determine initial character and location placeholders based on story content
    const detectedCharacters = (currentStory.prolog.match(/\b[A-Z][a-z]*\b/g) || []).slice(0, 3); // Simple regex for initial caps, limit to 3
    const detectedLocations = (currentStory.prolog.match(/\b(?:desa|kota|provinsi|wilayah)\s+([A-Z][a-z]*)/gi) || []).slice(0, 2); // Simple regex for common location terms

    characterInputArea.innerHTML = ''; // Clear previous inputs

    // Add inputs for main character and 2 general locations initially
    let charCount = 0;
    let locCount = 0;

    // Try to extract a potential main character name from the prolog or a generic one
    const mcNameMatch = currentStory.prolog.match(/([A-Z][a-z]+(?: [A-Z][a-z]+)?)\s+(adalah|bernama|yang)/i);
    const mcPlaceholder = mcNameMatch && mcNameMatch[1] ? mcNameMatch[1].trim() : 'Karakter Utama';

    addNamingInput('character', 'Nama Karakter Utama', 'mc', mcPlaceholder);
    charCount++;

    addNamingInput('location', 'Nama Desa/Kota Utama', 'loc1', 'Nama Desa/Kota');
    locCount++;
    addNamingInput('location', 'Nama Provinsi/Wilayah Utama', 'loc2', 'Nama Provinsi/Wilayah');
    locCount++;


    if (culturalStyle !== 'custom') {
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
    }


    showScreen('character-naming-screen');
});

backFromStorySelectionBtn.addEventListener('click', () => {
    // Determine which screen to go back to based on how we got to story-selection-screen
    if (storyContext.genre === 'Manual') {
        showScreen('manual-input-screen');
    } else {
        showScreen('ai-generate-form-screen');
    }
});

// Character Naming Screen
startStoryBtn.addEventListener('click', async () => {
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
        return;
    }

    // Initialize story content with prolog
    gameProgress.chapterContent = [];
    gameProgress.currentChapterIndex = 0;

    // Replace character and location placeholders in prolog with user-defined names
    let processedProlog = storyContext.prolog;
    for (const key in gameProgress.characterNames) {
        const regex = new RegExp(`\\[KARAKTER_${key.toUpperCase()}\\]`, 'g');
        processedProlog = processedProlog.replace(regex, gameProgress.characterNames[key]);
    }
    for (const key in gameProgress.locationNames) {
        const regex = new RegExp(`\\[LOKASI_${key.toUpperCase()}\\]`, 'g');
        processedProlog = processedProlog.replace(regex, gameProgress.locationNames[key]);
    }

    gameProgress.chapterContent.push(processedProlog);
    storyTitleDisplay.textContent = storyContext.title;
    storyContent.innerHTML = `<p>${processedProlog.replace(/\n/g, '</p><p>')}</p>`; // Display prolog

    showScreen('story-reading-screen');
});

backFromNamingBtn.addEventListener('click', () => {
    showScreen('story-selection-screen');
});

// Story Reading Screen
continueReadingBtn.addEventListener('click', async () => {
    gameProgress.currentChapterIndex++;
    // Check if we already have the next chapter generated
    if (gameProgress.currentChapterIndex < gameProgress.chapterContent.length) {
        displayCurrentChapter();
    } else {
        // If not, generate the next chapter
        const previousContent = gameProgress.chapterContent[gameProgress.chapterContent.length - 1];
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
            // Handle end of story or error
            showMessageBox("Akhir Cerita", "Anda telah mencapai akhir cerita atau terjadi kesalahan saat melanjutkan. Kembali ke menu utama.");
            backToMainMenuFromStoryBtn.click(); // Go back to main menu
        }
    }
});

backToMainMenuFromStoryBtn.addEventListener('click', () => {
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
}

// --- Display Current Chapter Function ---
function displayCurrentChapter() {
    if (gameProgress.chapterContent[gameProgress.currentChapterIndex]) {
        const chapterText = gameProgress.chapterContent[gameProgress.currentChapterIndex];
        storyContent.innerHTML = `<p>${chapterText.replace(/\n/g, '</p><p>')}</p>`;
        storyContent.scrollTop = 0; // Scroll to top for new chapter
    }
}


// --- Initialization ---
window.onload = () => {
    API_KEY = getApiKey();
    if (API_KEY) {
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showScreen('api-key-screen');
    }
};


