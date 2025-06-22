// --- API Key Handling ---
let API_KEY = ""; // This will be loaded from localStorage or set by user

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
const subgenreSelect = document.getElementById('subgenre-select');
const subgenreManualInput = document.getElementById('subgenre-manual-input');
const numStoriesInput = document.getElementById('num-stories');
const generateAiBtn = document.getElementById('generate-ai-btn');
const backFromAiFormBtn = document.getElementById('back-from-ai-form-btn');
const loadingAi = document.getElementById('loading-ai');
const loadingText = document.getElementById('loading-text');
const loadingAdditionalText = document.getElementById('loading-additional-text');

const aiResultsScreen = document.getElementById('ai-results-screen');
const storyListContainer = document.getElementById('story-list-container');
const selectedStoryDisplay = document.getElementById('selected-story-display');
const displayTitle = document.getElementById('display-title');
const displayDescription = document.getElementById('display-description');
const displayGenres = document.getElementById('display-genres');
const displaySubgenres = document.getElementById('display-subgenres');
const displayRating = document.getElementById('display-rating');

const continueToCharacterSelectionBtn = document.getElementById('continue-to-character-selection-btn');
const backFromAiResultsBtn = document.getElementById('back-from-ai-results-btn');

const characterCreationScreen = document.getElementById('character-creation-screen');
const characterClassInput = document.getElementById('character-class-input');
const nameStyleSelect = document.getElementById('name-style-select');
const generateCharactersBtn = document.getElementById('generate-characters-btn');
const backToStorySelectBtn = document.getElementById('back-to-story-select-btn');
const loadingCharacters = document.getElementById('loading-characters');
const loadingCharsText = document.getElementById('loading-chars-text');
const loadingAdditionalTextChars = document.getElementById('loading-additional-text-chars');
const mcSelectionHeading = document.getElementById('mc-selection-heading');
const characterResultsDiv = document.getElementById('character-results');
const characterActionButtons = document.getElementById('character-action-buttons');
const continueToGameBtn = document.getElementById('continue-to-game-btn');
const regenerateCharactersBtn = document.getElementById('regenerate-characters-btn');

const summaryScreen = document.getElementById('summary-screen');
const finalSummaryTitle = document.getElementById('final-summary-title');
const finalSummaryDescription = document.getElementById('final-summary-description');
const finalSummaryGenres = document.getElementById('final-summary-genres');
const finalSummarySubgenres = document.getElementById('final-summary-subgenres');
const finalSummaryRating = document.getElementById('final-summary-rating');
const finalMcNameClass = document.getElementById('final-mc-name-class');
const finalMcPersonality = document.getElementById('final-mc-personality');
const finalMcDescription = document.getElementById('final-mc-description');
const startGameBtn = document.getElementById('start-game-btn');
const backFromSummaryBtn = document.getElementById('back-from-summary-btn');

const gameScreen = document.getElementById('game-screen');
const gameLoadingOverlay = document.getElementById('game-loading-overlay'); // This will be improved
const gameLoadingAdditionalText = document.getElementById('game-loading-additional-text');
const gamePlayScreen = document.getElementById('game-play-screen');
const prologContentDisplay = document.getElementById('prolog-content-display');
const chapterContentDisplay = document.getElementById('chapter-content-display');
const dynamicSystemsDisplay = document.getElementById('dynamic-systems-display');
const choiceContainer = document.getElementById('choice-container');
const startRealStoryBtn = document.getElementById('start-real-story-btn');


const gameOverScreen = document.getElementById('game-over-screen');
const gameOverMessage = document.getElementById('game-over-message');
const gameOverAnalysis = document.getElementById('game-over-analysis');
const retryGameBtn = document.getElementById('retry-game-btn');
const backToMainMenuBtn = document.getElementById('back-to-main-menu-btn');

const customMessageBox = document.getElementById('custom-message-box');
const messageBoxTitle = document.getElementById('message-box-title');
const messageBoxContent = document.getElementById('message-box-content');
const messageBoxOkBtn = document.getElementById('message-box-ok-btn');

const themeToggleButton = document.getElementById('theme-toggle');
const themeToggleIcon = themeToggleButton.querySelector('i');
const themeToggleText = document.getElementById('theme-toggle-text');


// --- Game State Variables ---
let selectedLanguage = 'id';
let selectedStoryDetails = null;
let generatedCharacters = []; // This will hold ALL generated characters
let selectedMainCharacter = null;
let selectedNameStyle = 'random'; // New: To store the chosen name style

// Game progress state to store dynamic system data
let gameProgress = {
    currentChapter: 0,
    currentScene: 0,
    trustPoints: {}, // {characterId: value}
    flagAwal: {}, // {flagName: boolean}
    pathTracker: null,
    lockedPaths: [],
    achievements: [],
    traumaSystem: {}, // {characterId: boolean}
    relationshipLabels: {}, // {characterId: label}
    timeSystem: {day: 1, partOfDay: "pagi", countdown: null, activeEvents: []},
    dnaProfile: {moral: "Netral", honesty: "Netral", empathy: "Netral", style: "Observasi"},
    playerChoices: [] // Stores objects like {chapter: 1, choiceIndex: 0, choiceText: "..."}
};

// --- Helper Functions ---
function showScreen(screenId) {
    const screens = [apiKeyScreen, mainScreen, manualInputScreen, aiGenerateFormScreen, aiResultsScreen, characterCreationScreen, summaryScreen, gameScreen, gameOverScreen];
    screens.forEach(screen => {
        if (screen) {
            if (screen.id === screenId) {
                screen.style.display = 'flex'; // Use flex for all screens for centering
            } else {
                screen.style.display = 'none';
            }
        }
    });
}

function showMessageBox(title, message) {
    messageBoxTitle.textContent = title;
    messageBoxContent.textContent = message;
    customMessageBox.style.display = 'flex'; // Use flex for the overlay
}

// Enable/disable main buttons
function setMainButtonsEnabled(enabled) {
    manualInputBtn.disabled = !enabled;
    aiGenerateBtn.disabled = !enabled;
}

// --- API Key Management ---
// Tidak menyimpan API key di localStorage
function getApiKey() {
    return API_KEY; // Cukup kembalikan nilai global
}

function saveApiKey(key) {
    API_KEY = key; // Update the global API_KEY variable
}

// Tidak perlu menghapus dari localStorage karena tidak disimpan di sana
function clearApiKey() {
    API_KEY = ""; // Clear global API_KEY
    showMessageBox(selectedLanguage === 'id' ? 'Kunci API Dihapus' : 'API Key Cleared', selectedLanguage === 'id' ? 'Kunci API telah dihapus dari browser Anda. Silakan masukkan kunci baru.' : 'API Key has been cleared from your browser. Please enter a new key.');
    // Memuat ulang halaman untuk memastikan API Key kembali kosong
    location.reload();
}

// --- Theme Toggling ---
function toggleTheme() {
    const body = document.body;
    let currentTheme = body.className;

    if (currentTheme.includes('light-theme')) {
        body.className = body.className.replace('light-theme', 'dark-theme');
        localStorage.setItem('theme', 'dark-theme');
    } else if (currentTheme.includes('dark-theme')) {
        body.className = body.className.replace('dark-theme', 'eye-protection-theme');
        localStorage.setItem('theme', 'eye-protection-theme');
    } else {
        body.className = body.className.replace('eye-protection-theme', 'light-theme');
        localStorage.setItem('theme', 'light-theme');
    }
    updateThemeToggleButtonText();
}

function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme') || 'light-theme';
    // Ensure existing Tailwind classes like 'flex', 'flex-col' are preserved
    document.body.className = document.body.className.split(' ').filter(c => !c.includes('-theme')).join(' ') + ' ' + storedTheme;
    updateThemeToggleButtonText();
}

function updateThemeToggleButtonText() {
    const currentTheme = document.body.className;
    if (selectedLanguage === 'id') {
        if (currentTheme.includes('light-theme')) {
            themeToggleIcon.className = 'fas fa-moon';
            themeToggleText.textContent = 'Mode Gelap';
        } else if (currentTheme.includes('dark-theme')) {
            themeToggleIcon.className = 'fas fa-sun';
            themeToggleText.textContent = 'Mode Terang';
        } else if (currentTheme.includes('eye-protection-theme')) {
            themeToggleIcon.className = 'fas fa-eye';
            themeToggleText.textContent = 'Mode Perlindungan Mata';
        }
    } else { // English
        if (currentTheme.includes('light-theme')) {
            themeToggleIcon.className = 'fas fa-moon';
            themeToggleText.textContent = 'Dark Mode';
        } else if (currentTheme.includes('dark-theme')) {
            themeToggleIcon.className = 'fas fa-sun';
            themeToggleText.textContent = 'Light Mode';
        } else if (currentTheme.includes('eye-protection-theme')) {
            themeToggleIcon.className = 'fas fa-eye';
            themeToggleText.textContent = 'Eye Protection Mode';
        }
    }
}


// --- Event Listeners ---
// API Key Screen Events
saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        // Validasi sederhana: API Key tidak boleh kosong
        saveApiKey(key);
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        // Debugger: Jeda eksekusi untuk inspeksi
        debugger;
        showMessageBox(selectedLanguage === 'id' ? 'Kunci API Tidak Valid' : 'Invalid API Key', selectedLanguage === 'id' ? 'Mohon masukkan kunci API yang valid. Kunci API tidak boleh kosong.' : 'Please enter a valid API key. API key cannot be empty.');
        // Tetap di layar API Key jika tidak valid
        showScreen('api-key-screen');
        setMainButtonsEnabled(false);
    }
});

clearApiKeyBtn.addEventListener('click', clearApiKey);


manualInputBtn.addEventListener('click', () => {
    showScreen('manual-input-screen');
    setMainButtonsEnabled(false);
});
aiGenerateBtn.addEventListener('click', () => {
    showScreen('ai-generate-form-screen');
    setMainButtonsEnabled(false);
});

backFromManualBtn.addEventListener('click', () => {
    showScreen('main-screen');
    setMainButtonsEnabled(true);
});
backFromAiFormBtn.addEventListener('click', () => {
    showScreen('main-screen');
    setMainButtonsEnabled(true);
});

backFromAiResultsBtn.addEventListener('click', () => {
    selectedStoryDetails = null;
    continueToCharacterSelectionBtn.style.display = 'none';
    selectedStoryDisplay.style.display = 'none';
    storyListContainer.innerHTML = '';
    storyListContainer.style.display = 'grid'; // Changed back to grid
    showScreen('ai-generate-form-screen');
});

backToStorySelectBtn.addEventListener('click', () => {
    showScreen('ai-results-screen');
    if (selectedStoryDetails) {
        selectedStoryDisplay.style.display = 'block';
        storyListContainer.style.display = 'none';
        continueToCharacterSelectionBtn.style.display = 'block';
    } else {
        showScreen('ai-generate-form-screen');
    }
    characterClassInput.value = '';
    characterClassInput.style.display = 'none';
    characterResultsDiv.innerHTML = '';
    mcSelectionHeading.style.display = 'none';
    characterActionButtons.style.display = 'none';
    generatedCharacters = [];
    selectedMainCharacter = null;
});

messageBoxOkBtn.addEventListener('click', () => customMessageBox.style.display = 'none');

languageRadios.forEach(radio => {
    radio.addEventListener('change', (event) => {
        selectedLanguage = event.target.value;
        updateLanguageText();
    });
});

// Function to update language-dependent texts
function updateLanguageText() {
    if (selectedLanguage === 'id') {
        document.title = "Cerita Komik Interaktif";
        mainScreen.querySelector('h1').textContent = "Visual Novel AI";
        mainScreen.querySelector('p').textContent = "Dapatkan ide cerita baru atau masukkan cerita Anda sendiri.";
        manualInputBtn.textContent = "Masukkan Judul & Deskripsi Manual";
        aiGenerateBtn.textContent = "Hasilkan Cerita dengan AI";

        manualInputScreen.querySelector('h1').textContent = "Masukkan Cerita Anda";
        manualTitleInput.placeholder = "Judul Cerita";
        manualDescriptionInput.placeholder = "Deskripsi Cerita (fokus pada premis & konflik)";
        continueManualBtn.textContent = "Lanjutkan ke Pembuatan Karakter";
        backFromManualBtn.textContent = "Kembali";

        aiGenerateFormScreen.querySelector('h1').textContent = "Hasilkan Cerita dengan AI";
        aiGenerateFormScreen.querySelector('p').textContent = "AI akan membuat ide cerita berdasarkan preferensi Anda.";
        languageRadios[0].nextSibling.textContent = " Bahasa Indonesia";
        languageRadios[1].nextSibling.textContent = " English";
        genreSelect.options[0].textContent = "Pilih Genre";
        const otherGenreOption = Array.from(genreSelect.options).find(opt => opt.value === 'other');
        if (otherGenreOption) otherGenreOption.textContent = "Lainnya...";
        otherGenreInput.placeholder = "Masukkan Genre Lainnya";
        subgenreSelect.options[0].textContent = "Pilih Subgenre";
        subgenreManualInput.placeholder = "Masukkan Subgenre Lainnya";
        numStoriesInput.placeholder = "Jumlah Cerita (1-5)";
        generateAiBtn.textContent = "Hasilkan Cerita";
        backFromAiFormBtn.textContent = "Kembali";
        loadingText.textContent = "Sedang menulis kisah Anda...";
        loadingAdditionalText.textContent = "Mohon tunggu sebentar, AI sedang memproses.";

        aiResultsScreen.querySelector('h1').textContent = "Pilih Cerita Anda";
        aiResultsScreen.querySelector('p').textContent = "Pilih salah satu cerita yang dihasilkan AI.";
        continueToCharacterSelectionBtn.textContent = "Lanjutkan ke Pemilihan Karakter";
        backFromAiResultsBtn.textContent = "Kembali Cari Cerita Lain";

        characterCreationScreen.querySelector('h1').textContent = "Buat Karakter";
        characterCreationScreen.querySelector('p').textContent = "AI akan membuat seluruh karakter untuk cerita Anda, termasuk memilih 2-4 kandidat Karakter Utama (MC).";
        characterClassInput.placeholder = "Kelas Karakter (opsional, cth: Pahlawan)";
        Array.from(nameStyleSelect.options).forEach(option => {
            switch (option.value) {
                case 'random': option.textContent = "Nama Acak AI"; break;
                case 'japanese': option.textContent = "Nama Ala Jepang"; break;
                case 'chinese': option.textContent = "Nama Ala Tiongkok"; break;
                case 'arabic': option.textContent = "Nama Ala Arab"; break;
                case 'fantasy': option.textContent = "Nama Ala Fantasi"; break;
                case 'european_medieval': option.textContent = "Nama Ala Eropa Abad Pertengahan"; break;
                case 'celtic': option.textContent = "Nama Ala Celtic"; break;
                case 'norse': option.textContent = "Nama Ala Norse"; break;
                case 'ancient_egyptian': option.textContent = "Nama Ala Mesir Kuno"; break;
                case 'indonesian': option.textContent = "Nama Ala Indonesia"; break;
                case 'german': option.textContent = "Nama Ala Jerman"; break;
            }
        });
        generateCharactersBtn.textContent = "Generate Karakter";
        backToStorySelectBtn.textContent = "Kembali ke Pemilihan Cerita";
        loadingCharsText.textContent = "Menciptakan karakter Anda...";
        loadingAdditionalTextChars.textContent = "Mohon tunggu sebentar, AI sedang memproses.";
        mcSelectionHeading.textContent = "Pilih Karakter Utama (MC):";
        continueToGameBtn.textContent = "Lanjutkan Cerita";
        regenerateCharactersBtn.textContent = "Cari Karakter Lagi";

        summaryScreen.querySelector('h1').textContent = "Ringkasan Cerita Anda";
        summaryScreen.querySelector('p').textContent = "Ini adalah ringkasan cerita dan karakter yang akan Anda mainkan.";
        summaryScreen.querySelector('.summary-card:nth-of-type(1) h2').textContent = "Judul Cerita";
        summaryScreen.querySelector('.summary-card:nth-of-type(1) h2:nth-of-type(2)').textContent = "Deskripsi Cerita";
        summaryScreen.querySelector('.summary-card:nth-of-type(2) h2').textContent = "Karakter Utama (MC)";
        startGameBtn.textContent = "Mulai Game";
        backFromSummaryBtn.textContent = "Kembali";

        gameLoadingOverlay.querySelector('span').textContent = "Memuat cerita...";
        gameLoadingAdditionalText.textContent = "Mohon tunggu sebentar, AI sedang memproses.";
        startRealStoryBtn.textContent = "Mulai ke cerita sebenarnya";


        gameOverScreen.querySelector('h1').textContent = "💀 GAME OVER 💀";
        retryGameBtn.textContent = "Coba Lagi";
        backToMainMenuBtn.textContent = "Kembali ke Menu Utama";

    } else { // English
        document.title = "Interactive Comic Story";
        mainScreen.querySelector('h1').textContent = "Visual Novel AI";
        mainScreen.querySelector('p').textContent = "Get new story ideas or input your own story.";
        manualInputBtn.textContent = "Enter Title & Description Manually";
        aiGenerateBtn.textContent = "Generate Story with AI";

        manualInputScreen.querySelector('h1').textContent = "Enter Your Story";
        manualTitleInput.placeholder = "Story Title";
        manualDescriptionInput.placeholder = "Story Description (focus on premise & conflict)";
        continueManualBtn.textContent = "Proceed to Character Creation";
        backFromManualBtn.textContent = "Back";

        aiGenerateFormScreen.querySelector('h1').textContent = "Generate Story with AI";
        aiGenerateFormScreen.querySelector('p').textContent = "AI will create story ideas based on your preferences.";
        languageRadios[0].nextSibling.textContent = " Indonesian";
        languageRadios[1].nextSibling.textContent = " English";
        genreSelect.options[0].textContent = "Select Genre";
        const otherGenreOption = Array.from(genreSelect.options).find(opt => opt.value === 'other');
        if (otherGenreOption) otherGenreOption.textContent = "Other...";
        otherGenreInput.placeholder = "Enter Other Genre";
        subgenreSelect.options[0].textContent = "Select Subgenre";
        subgenreManualInput.placeholder = "Enter Other Subgenre";
        numStoriesInput.placeholder = "Number of Stories (1-5)";
        generateAiBtn.textContent = "Generate Story";
        backFromAiFormBtn.textContent = "Back";
        loadingText.textContent = "Crafting your story...";
        loadingAdditionalText.textContent = "Please wait, AI is processing.";

        aiResultsScreen.querySelector('h1').textContent = "Select Your Story";
        aiResultsScreen.querySelector('p').textContent = "Select one of the AI generated stories.";
        continueToCharacterSelectionBtn.textContent = "Proceed to Character Selection";
        backFromAiResultsBtn.textContent = "Go Back, Find Another Story";

        characterCreationScreen.querySelector('h1').textContent = "Create Characters";
        characterCreationScreen.querySelector('p').textContent = "AI will create all characters for your story, including selecting 2-4 Main Character (MC) candidates.";
        characterClassInput.placeholder = "Character Class (optional, e.g., Hero)";
        Array.from(nameStyleSelect.options).forEach(option => {
            switch (option.value) {
                case 'random': option.textContent = "Random AI Name"; break;
                case 'japanese': option.textContent = "Japanese Style Name"; break;
                case 'chinese': option.textContent = "Chinese Style Name"; break;
                case 'arabic': option.textContent = "Arabic Style Name"; break;
                case 'fantasy': option.textContent = "Fantasy Style Name"; break;
                case 'european_medieval': option.textContent = "European Medieval Name"; break;
                case 'celtic': option.textContent = "Celtic Style Name"; break;
                case 'norse': option.textContent = "Norse Style Name"; break;
                case 'ancient_egyptian': option.textContent = "Ancient Egyptian Name"; break;
                case 'indonesian': option.textContent = "Indonesian Style Name"; break;
                case 'german': option.textContent = "German Style Name"; break;
            }
        });
        generateCharactersBtn.textContent = "Generate Characters";
        backToStorySelectBtn.textContent = "Back to Story Selection";
        loadingCharsText.textContent = "Creating your characters...";
        loadingAdditionalTextChars.textContent = "Please wait, AI is processing.";
        mcSelectionHeading.textContent = "Select Main Character (MC):";
        continueToGameBtn.textContent = "Continue Story";
        regenerateCharactersBtn.textContent = "Find Other Characters";

        summaryScreen.querySelector('h1').textContent = "Your Story Summary";
        summaryScreen.querySelector('p').textContent = "Here is the summary of your story and characters.";
        summaryScreen.querySelector('.summary-card:nth-of-type(1) h2').textContent = "Story Title";
        summaryScreen.querySelector('.summary-card:nth-of-type(1) h2:nth-of-type(2)').textContent = "Story Description";
        summaryScreen.querySelector('.summary-card:nth-of-type(2) h2').textContent = "Main Character (MC)";
        startGameBtn.textContent = "Start Game";
        backFromSummaryBtn.textContent = "Back";

        gameLoadingOverlay.querySelector('span').textContent = "Loading story...";
        gameLoadingAdditionalText.textContent = "Please wait, AI is processing.";
        startRealStoryBtn.textContent = "Start the real story";

        gameOverScreen.querySelector('h1').textContent = "💀 GAME OVER 💀";
        retryGameBtn.textContent = "Retry";
        backToMainMenuBtn.textContent = "Back to Main Menu";
    }
    updateThemeToggleButtonText();
}


genreSelect.addEventListener('change', () => {
    if (genreSelect.value === 'other') {
        otherGenreInput.style.display = 'block';
        subgenreSelect.style.display = 'none';
        subgenreManualInput.style.display = 'none';
    } else if (genreSelect.value !== '') {
        otherGenreInput.style.display = 'none';
        generateSubgenres(genreSelect.value);
        subgenreSelect.style.display = 'block';
    } else {
        otherGenreInput.style.display = 'none';
        subgenreSelect.style.display = 'none';
        subgenreManualInput.style.display = 'none';
    }
});

subgenreSelect.addEventListener('change', () => {
    if (subgenreSelect.value === 'other') {
        subgenreManualInput.style.display = 'block';
    } else {
        subgenreManualInput.style.display = 'none';
    }
});

continueToCharacterSelectionBtn.addEventListener('click', () => {
    if (selectedStoryDetails) {
        showScreen('character-creation-screen');
        characterResultsDiv.innerHTML = '';
        mcSelectionHeading.style.display = 'none';
        characterActionButtons.style.display = 'none';
        generatedCharacters = [];
        selectedMainCharacter = null;
        characterClassInput.value = '';
        characterClassInput.style.display = 'none';
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Silakan pilih cerita terlebih dahulu.' : 'Please select a story first.');
    }
});

continueManualBtn.addEventListener('click', () => {
    const title = manualTitleInput.value.trim();
    const description = manualDescriptionInput.value.trim();
    if (title && description) {
        selectedStoryDetails = { title, description, genres: [], subgenres: [], rating: "SU", initialCharacterMentions: [], initialPlaceMentions: [] }; // Added initialPlaceMentions
        showScreen('character-creation-screen');
        characterResultsDiv.innerHTML = '';
        mcSelectionHeading.style.display = 'none';
        characterActionButtons.style.display = 'none';
        generatedCharacters = [];
        selectedMainCharacter = null;
        characterClassInput.value = '';
        characterClassInput.style.display = 'none';
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Input Tidak Lengkap' : 'Incomplete Input', selectedLanguage === 'id' ? 'Mohon isi Judul Cerita dan Deskripsi Cerita.' : 'Please fill in both Story Title and Story Description.');
    }
});

generateAiBtn.addEventListener('click', generateStoryContent);
generateCharactersBtn.addEventListener('click', generateCharacters);
regenerateCharactersBtn.addEventListener('click', generateCharacters);

nameStyleSelect.addEventListener('change', (event) => {
    selectedNameStyle = event.target.value; // Update selectedNameStyle
});


continueToGameBtn.addEventListener('click', async () => {
    if (selectedMainCharacter) {
        // AI Call to rewrite story description with selected MC's name and cultural place names
        const originalDescription = selectedStoryDetails.description;
        const mcName = selectedMainCharacter.name;
        const initialCharacterMentions = selectedStoryDetails.initialCharacterMentions || [];
        const initialPlaceMentions = selectedStoryDetails.initialPlaceMentions || []; // Get initial place mentions

        const rewriteSchema = {
            type: "OBJECT",
            properties: {
                "rewrittenDescription": { "type": "STRING" }
            },
            "required": ["rewrittenDescription"]
        };

        const loadingElement = loadingCharacters;
        const loadingTxtElement = loadingCharsText;
        const loadingAdditionalElement = loadingAdditionalTextChars;

        const originalLoadingText = loadingTxtElement.textContent;
        const originalAdditionalText = loadingAdditionalElement.textContent;
        loadingTxtElement.textContent = selectedLanguage === 'id' ? 'Menyesuaikan deskripsi cerita...' : 'Adjusting story description...';
        loadingAdditionalElement.textContent = selectedLanguage === 'id' ? 'Mohon tunggu, AI sedang merevisi.' : 'Please wait, AI is revising.';

        let rewritePrompt = `Rewrite the following story description.
        The main character's name is "${mcName}".
        The chosen naming style for characters is "${selectedNameStyle}".

        Original Description: "${originalDescription}"
        Original Character Names Mentioned (if any, use these as targets for replacement): ${JSON.stringify(initialCharacterMentions)}
        Original Place Names Mentioned (if any, replace these with culturally appropriate names based on "${selectedNameStyle}" naming style): ${JSON.stringify(initialPlaceMentions)}

        Instructions:
        1. If any "Original Character Names Mentioned" are present, replace them with "${mcName}".
        2. If any "Original Place Names Mentioned" are present, replace them with *culturally appropriate equivalents* that match the "${selectedNameStyle}" naming style. For example, if "Jawa Timur" is mentioned and the style is "chinese", replace it with a Chinese-sounding province or region name. If "Desa Sukorame" and "japanese" style, replace with a Japanese-sounding village name. If no clear equivalent, use a generic but culturally fitting term (e.g., "desa di Tiongkok", "kota di Jepang").
        3. Ensure the rewritten description flows naturally and grammatically correct.
        4. The core plot, tone, and conflict of the original description must remain unchanged.
        5. Provide the rewritten description in ${selectedLanguage === 'id' ? 'Indonesian' : 'English'}.
        6. Do NOT include any introductory or concluding remarks, just the rewritten description string.
        7. Strictly avoid using the names "Arya" and "Anya".`; // Added instruction to avoid names

        const rewrittenDescriptionObj = await callGeminiAPI(
            rewritePrompt,
            rewriteSchema,
            loadingElement,
            loadingTxtElement,
            loadingAdditionalElement,
            continueToGameBtn
        );

        loadingTxtElement.textContent = originalLoadingText;
        loadingAdditionalElement.textContent = originalAdditionalText;

        if (rewrittenDescriptionObj && rewrittenDescriptionObj.rewrittenDescription) {
            selectedStoryDetails.description = rewrittenDescriptionObj.rewrittenDescription;
        }

        finalSummaryTitle.textContent = selectedStoryDetails.title;
        finalSummaryDescription.textContent = selectedStoryDetails.description;
        finalSummaryGenres.textContent = selectedStoryDetails.genres.join(', ');
        finalSummarySubgenres.textContent = selectedStoryDetails.subgenres.join(', ');
        finalSummaryRating.textContent = selectedStoryDetails.rating;

        finalMcNameClass.innerHTML = `<span class="selected-angel-icon">😇</span> ${selectedMainCharacter.name} (${selectedMainCharacter.class})`;
        finalMcPersonality.textContent = selectedMainCharacter.personality;
        finalMcDescription.textContent = selectedMainCharacter.description;

        showScreen('summary-screen');
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Mohon pilih minimal 1 Karakter Utama (MC).' : 'Please select at least 1 Main Character (MC).');
    }
});

startGameBtn.addEventListener('click', startGame);

startRealStoryBtn.addEventListener('click', startChapter1);

retryGameBtn.addEventListener('click', () => {
    selectedStoryDetails = null;
    generatedCharacters = [];
    selectedMainCharacter = null;
    gameProgress = {
        currentChapter: 0,
        currentScene: 0,
        trustPoints: {},
        flagAwal: {},
        pathTracker: null,
        lockedPaths: [],
        achievements: [],
        traumaSystem: {},
        relationshipLabels: {},
        timeSystem: {day: 1, partOfDay: "pagi", countdown: null, activeEvents: []},
        dnaProfile: {moral: "Netral", honesty: "Netral", empathy: "Netral", style: "Observasi"},
        playerChoices: []
    };
    showScreen('main-screen');
    setMainButtonsEnabled(true);
});

backToMainMenuBtn.addEventListener('click', () => {
    selectedStoryDetails = null;
    generatedCharacters = [];
    selectedMainCharacter = null;
    gameProgress = {
        currentChapter: 0,
        currentScene: 0,
        trustPoints: {},
        flagAwal: {},
        pathTracker: null,
        lockedPaths: [],
        achievements: [],
        traumaSystem: {},
        relationshipLabels: {},
        timeSystem: {day: 1, partOfDay: "pagi", countdown: null, activeEvents: []},
        dnaProfile: {moral: "Netral", honesty: "Netral", empathy: "Netral", style: "Observasi"},
        playerChoices: []
    };
    showScreen('main-screen');
    setMainButtonsEnabled(true);
});

themeToggleButton.addEventListener('click', toggleTheme);

// --- Gemini API Integration ---

async function callGeminiAPI(prompt, schema = null, loadingElement, loadingTxtElement, loadingAdditionalElement = null, buttonToDisable) {
    if (!API_KEY) {
        showMessageBox(selectedLanguage === 'id' ? 'Kunci API Hilang' : 'API Key Missing', selectedLanguage === 'id' ? 'Mohon masukkan kunci API Gemini Anda terlebih dahulu.' : 'Please enter your Gemini API key first.');
        return null;
    }

    // Apply loading classes for consistent look across all loading states
    loadingElement.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'mt-8', 'text-gray-700', 'dark:text-gray-300');
    loadingElement.style.display = 'flex'; // Ensure display flex is set
    // Remove specific spinner/text classes if they were inline or conflicting
    const spinner = loadingElement.querySelector('.spinner');
    if (spinner) {
        spinner.classList.add('border-t-4', 'border-blue-500', 'w-10', 'h-10', 'mb-4', 'rounded-full', 'animate-spin');
    }
    if (loadingTxtElement) {
        loadingTxtElement.classList.add('text-xl', 'font-semibold');
    }
    if (loadingAdditionalElement) {
        loadingAdditionalElement.classList.add('text-sm', 'mt-2', 'text-gray-500', 'dark:text-gray-400');
    }


    if (buttonToDisable) buttonToDisable.disabled = true;

    let loadingTimeout;
    if (loadingAdditionalElement) {
        loadingAdditionalElement.style.display = 'none';
        loadingTimeout = setTimeout(() => {
            loadingAdditionalElement.style.display = 'block';
        }, 6000);
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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
    console.log("Sending prompt to Gemini API:", prompt);
    console.log("Payload:", payload);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("API Error Response:", errorData);
            throw new Error(`API Error: ${response.status} - ${errorData.error.message}`);
        }

        const result = await response.json();
        console.log("Raw API Result:", result);

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            console.log("API Response Text:", text);
            try {
                const parsed = schema ? JSON.parse(text) : text;
                console.log("Parsed API Result:", parsed);
                return parsed;
            } catch (parseError) {
                console.error("Error parsing API response:", parseError, "Text:", text);
                showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Parsing Data' : 'Error Parsing Data', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memproses data AI.' : 'Error processing AI data.'} ${selectedLanguage === 'id' ? 'Coba lagi.' : 'Please try again.'}`);
                return null;
            }
        } else {
            throw new Error(selectedLanguage === 'id' ? "Tidak ada konten yang diterima dari API atau struktur respons tidak terduga." : "No content received from API or unexpected response structure.");
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan API' : 'API Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memanggil API Gemini:' : 'Error calling Gemini API:'} ${error.message}`);
        return null;
    } finally {
         loadingElement.style.display = 'none';
         if (buttonToDisable) buttonToDisable.disabled = false;
         if (loadingAdditionalElement) clearTimeout(loadingTimeout);
         if (loadingAdditionalElement) loadingAdditionalElement.style.display = 'none';
    }
}

async function generateStoryContent() {
    storyListContainer.innerHTML = '';
    selectedStoryDisplay.style.display = 'none';
    continueToCharacterSelectionBtn.style.display = 'none';
    selectedStoryDetails = null;

    const numStories = parseInt(numStoriesInput.value);
    const selectedGenre = genreSelect.value === 'other' ? otherGenreInput.value.trim() : genreSelect.value;
    const selectedSubgenre = subgenreSelect.value === 'other' ? subgenreManualInput.value.trim() : subgenreSelect.value;

    if (!selectedGenre) {
        showMessageBox(selectedLanguage === 'id' ? 'Input Tidak Lengkap' : 'Incomplete Input', selectedLanguage === 'id' ? 'Mohon pilih atau masukkan genre.' : 'Please select or enter a genre.');
        return;
    }
    if (numStories < 1 || numStories > 5) {
        showMessageBox(selectedLanguage === 'id' ? 'Input Tidak Valid' : 'Invalid Input', selectedLanguage === 'id' ? 'Jumlah cerita harus antara 1 dan 5.' : 'Number of stories must be between 1 and 5.');
        return;
    }

    const storySchema = {
        type: "ARRAY",
        items: {
            type: "OBJECT",
            properties: {
                "title": { "type": "STRING" },
                "description": { "type": "STRING" },
                "genres": {
                    "type": "ARRAY",
                    "items": { "type": "STRING" }
                },
                "subgenres": {
                    "type": "ARRAY",
                    "items": { "type": "STRING" }
                },
                "rating": { "type": "STRING", "enum": ["SU", "PG-13", "16+", "18+", "21+"] },
                "initialCharacterMentions": {
                    "type": "ARRAY",
                    "items": { "type": "STRING" },
                    "description": "Any character names explicitly mentioned in the story description. Return as an empty array if none."
                },
                "initialPlaceMentions": { // New field to capture initial place mentions
                    "type": "ARRAY",
                    "items": { "type": "STRING" },
                    "description": "Any specific geographical place names (cities, regions, countries) explicitly mentioned in the story description. Return as an empty array if none."
                }
            },
            "required": ["title", "description", "genres", "subgenres", "rating", "initialCharacterMentions", "initialPlaceMentions"]
        }
    };

    let prompt = `Generate ${numStories} *new and unique* visual novel story ideas. For each idea, provide:
    - A compelling story title.
    - A concise and intriguing story description (focus on premise, conflict, or theme). Character names and place names CAN be included in the description if relevant.
    - A list of relevant genres, including "${selectedGenre}".
    - A list of relevant subgenres.
    - An appropriate content rating from these options: "SU", "PG-13", "16+", "18+", "21+".
    - A list of any specific character names mentioned in the description (e.g., ["Lintang", "Budi"]). If no specific names, return an empty array.
    - A list of any specific geographical place names (cities, regions, countries) explicitly mentioned in the story description (e.g., ["Jawa Timur", "Desa Sukorame"]). If no specific place names, return an empty array.

    Rating Guidelines:
    - SU: Suitable for all audiences. No violence, no harsh language, no suggestive themes.
    - PG-13: Parental guidance suggested. May contain mild violence, some suggestive themes, or brief strong language.
    - 16+: Contains mature themes, moderate violence, strong language, and/or suggestive themes.
    - 18+: Contains mature themes, stronger violence, harsh language, and/or **non-explicit suggestive themes (implied sexual tension, romance, or situations without explicit detail)**.
    - 21+: Contains explicit violence, strong language, and mature themes (excluding explicit sexual content).

    Explicit sexual content (e.g., graphic descriptions of sexual acts, nudity intended to arouse) is STRICTLY FORBIDDEN for ALL ratings.
    Themes related to LGBTQ+, Yuri, Yaoi, Harem, and Reverse Harem are STRICTLY FORBIDDEN.
    Violence and harsh language are permitted only for ratings 16+, 18+ and 21+.

    Ensure the output is in JSON format according to the schema. Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} language. Strictly avoid using the names "Arya" and "Anya". (Random seed: ${Math.random()})`;


    if (selectedSubgenre && selectedSubgenre !== (selectedLanguage === 'id' ? 'Pilih Subgenre' : 'Select Subgenre')) {
        prompt += ` Prioritize subgenre "${selectedSubgenre}" if relevant.`;
    }

    const stories = await callGeminiAPI(prompt, storySchema, loadingAi, loadingText, loadingAdditionalText, generateAiBtn);

    if (stories && stories.length > 0) {
        const filteredStories = stories.slice(0, numStories);

        showScreen('ai-results-screen');
        storyListContainer.style.display = 'grid';

        filteredStories.forEach((story) => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out';
            storyCard.dataset.story = JSON.stringify(story);
            storyCard.innerHTML = `
                <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">${story.title}</h2>
                <p class="text-gray-700 dark:text-gray-300 mb-4">${story.description}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">✨ <span class="font-medium text-gray-800 dark:text-gray-200">Genre:</span> ${story.genres.join(', ')}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">✨ <span class="font-medium text-gray-800 dark:text-gray-200">Subgenre:</span> ${story.subgenres.join(', ')}</p>
                <p class="text-sm text-gray-600 dark:text-gray-400">⭐ <span class="font-medium text-gray-800 dark:text-gray-200">Rating:</span> ${story.rating}</p>
                <button class="btn btn-primary mt-4 py-2 px-4 text-base font-semibold rounded-md shadow-sm hover:shadow-md transition-all duration-300 ease-in-out select-story-btn">${selectedLanguage === 'id' ? 'Pilih Ini' : 'Select This'}</button>
            `;
            storyListContainer.appendChild(storyCard);

            storyCard.querySelector('.select-story-btn').addEventListener('click', (event) => {
                event.stopPropagation();

                document.querySelectorAll('.story-card').forEach(card => card.classList.remove('selected'));
                storyCard.classList.add('selected');

                selectedStoryDetails = JSON.parse(storyCard.dataset.story);

                displayTitle.textContent = selectedStoryDetails.title;
                displayDescription.textContent = selectedStoryDetails.description;
                displayGenres.textContent = selectedStoryDetails.genres.join(', ');
                displaySubgenres.textContent = selectedStoryDetails.subgenres.join(', ');
                displayRating.textContent = selectedStoryDetails.rating;

                storyListContainer.style.display = 'none';
                selectedStoryDisplay.style.display = 'block';
                continueToCharacterSelectionBtn.style.display = 'block';
            });
        });
    } else {
         showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Cerita' : 'No Stories', selectedLanguage === 'id' ? 'AI tidak dapat menghasilkan cerita. Coba lagi dengan prompt yang berbeda.' : 'AI could not generate stories. Please try again with a different prompt.');
    }
}

async function generateSubgenres(mainGenre) {
    subgenreSelect.innerHTML = `<option value="">${selectedLanguage === 'id' ? 'Pilih Subgenre' : 'Select Subgenre'}</option>`;
    subgenreSelect.style.display = 'none';
    otherGenreInput.style.display = 'none';
    subgenreManualInput.style.display = 'none';
    loadingAi.style.display = 'flex';
    generateAiBtn.disabled = true;

    const subgenreSchema = {
        type: "ARRAY",
        items: { "type": "STRING" }
    };

    let prompt;
    if (selectedLanguage === 'id') {
        prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre utama "${mainGenre}". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string.`;
        if (mainGenre === "Sadness") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Kesedihan". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Melankolis, Patah Hati, Kehilangan, Perpisahan, Kesendirian, Depresi.`;
        } else if (mainGenre === "Happiness") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Kebahagiaan". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Euforia, Kegembiraan, Ketenangan, Kedamaian, Sukacita, Optimisme.`;
        } else if (mainGenre === "Time Travel") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Time Travel". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Paradox Waktu, Sejarah Alternatif, Penjelajahan Masa Depan, Intervensi Masa Lalu, Perulangan Waktu.`;
        } else if (mainGenre === "Legal") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Legal". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Drama Pengadilan, Hukum Pidana, Hukum Perdata, Investigasi Hukum, Konspirasi Hukum.`;
        } else if (mainGenre === "Conspiracy") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Konspirasi". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Teori Konspirasi, Masyarakat Rahasia, Pemerintah Bayangan, Pengungkapan Kebenaran, Pembunuhan Terencana.`;
        } else if (mainGenre === "War") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Perang". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Perang Dunia, Perang Sipil, Konflik Futuristik, Taktik Militer, Survival di Medan Perang.`;
        } else if (mainGenre === "Boring") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Membosankan". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Rutinitas Harian, Kehidupan Perkantoran, Menunggu, Proses Membosankan, Monoton, Tanpa Konflik.`;
        } else if (mainGenre === "Isekai") {
            prompt = `Sediakan daftar 5-10 subgenre yang relevan untuk genre "Isekai". JANGAN sertakan subgenre atau tema apa pun yang terkait dengan konten eksplisit, konten seksual, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, atau tema dewasa/matang apa pun. Pastikan output dalam format array JSON string. Contoh: Reinkarnasi, Summoning, Petualangan Dunia Lain, Sistem Game, Pahlawan Terpilih, Kebangkitan Kekuatan.`;
        }
    } else { // English
        prompt = `Provide a list of 5-10 relevant subgenres for the main genre "${mainGenre}". Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format.`;
        if (mainGenre === "Sadness") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Sadness" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Melancholy, Heartbreak, Loss, Farewell, Loneliness, Depression.`;
        } else if (mainGenre === "Happiness") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Happiness" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Euphoria, Joy, Serenity, Peace, Cheer, Optimism.`;
        } else if (mainGenre === "Time Travel") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Time Travel" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Time Paradox, Alternate History, Future Exploration, Past Intervention, Time Loop.`;
        } else if (mainGenre === "Legal") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Legal" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Courtroom Drama, Criminal Law, Civil Law, Legal Investigation, Legal Conspiracy.`;
        } else if (mainGenre === "Conspiracy") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Conspiracy" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Conspiracy Theory, Secret Societies, Shadow Government, Truth Unveiling, Assassination Plot.`;
        } else if (mainGenre === "War") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "War" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: World War, Civil War, Futuristic Conflict, Military Tactics, Battlefield Survival.`;
        } else if (mainGenre === "Boring") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Boring" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Daily Routine, Office Life, Waiting, Tedious Processes, Monotony, No Conflict.`;
        } else if (mainGenre === "Isekai") {
            prompt = `Provide a list of 5-10 relevant subgenres for the "Isekai" genre. Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Example: Reincarnation, Summoning, Otherworld Adventure, Game System, Chosen Hero, Power Awakening.`;
        }
    }

    try {
        const subgenres = await callGeminiAPI(prompt, subgenreSchema, loadingAi, loadingText, loadingAdditionalText, generateAiBtn);

        if (subgenres && subgenres.length > 0) {
            subgenres.forEach(sub => {
                const option = document.createElement('option');
                option.value = sub;
                option.textContent = sub;
                subgenreSelect.appendChild(option);
            });
            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = selectedLanguage === 'id' ? 'Lainnya...' : 'Other...';
            subgenreSelect.appendChild(otherOption);
            subgenreSelect.style.display = 'block';
        } else {
            const otherOption = document.createElement('option');
            otherOption.value = 'other';
            otherOption.textContent = selectedLanguage === 'id' ? 'Lainnya...' : 'Other...';
            subgenreSelect.appendChild(otherOption);
            subgenreSelect.style.display = 'block';
        }
    } finally {
        loadingAi.style.display = 'none';
        generateAiBtn.disabled = false;
    }
}

async function generateCharacters() {
    characterResultsDiv.innerHTML = '';
    mcSelectionHeading.style.display = 'none';
    characterActionButtons.style.display = 'none';
    selectedMainCharacter = null;
    generatedCharacters = [];

    const totalNumChars = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
    console.log("AI-determined totalNumChars:", totalNumChars);

    const charClassHint = characterClassInput.value.trim();
    const nameStyle = nameStyleSelect.value; // Get the chosen name style
    selectedNameStyle = nameStyle; // Store it globally for later use

    if (!selectedStoryDetails) {
         showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Silakan pilih cerita terlebih dahulu sebelum membuat karakter.' : 'Please select a story first before generating characters.');
         return;
    }

    const charSchema = {
        type: "ARRAY",
        items: {
            type: "OBJECT",
            properties: {
                "id": { "type": "STRING" },
                "name": { "type": "STRING" },
                "class": { "type": "STRING" },
                "personality": { "type": "STRING" },
                "description": { "type": "STRING" },
                "role": { "type": "STRING" },
                "isPotentialMC": { "type": "BOOLEAN" }
            },
            "required": ["id", "name", "class", "personality", "description", "role", "isPotentialMC"]
        }
    };

    const rolesList = [
        "Protagonis", "Antagonis", "Deuteragonis", "Tritagonis", "Mentor", "Sidekick", "Love Interest", "Foil",
        "Antihero", "Villain", "Narrator", "Confidant", "Comic Relief", "Shapeshifter", "Threshold Guardian",
        "Background/Extras", "The Chosen One", "The Outcast", "The Rival", "The Trickster", "The Redeemed",
        "The Sacrificial Lamb", "The Puppetmaster", "The Innocent", "The Observer/Outsider", "The Catalyst",
        "The Guardian", "The Monster/Beast", "The Doppelgänger", "The Seer/Oracle", "The Witness", "The Herald",
        "The Fallen Hero", "The Cynic", "The Moral Compass", "The Martyr", "The Fake Ally", "The Loyal Beast",
        "The Healer", "The Joker/Agent of Chaos", "The Reincarnated", "The Traumatized", "The Puppet",
        "The Secret Royalty", "The Wild Card", "The Strategist", "The Rebel", "The Spy", "The Innocent Criminal",
        "The Double Agent", "The Survivor", "The Prophet", "The Lost Soul", "The Seducer", "The Judge",
        "The Peacemaker", "The Mercenary", "The Manipulator", "The Avenger", "The Legend"
    ];


    let prompt = `Generate exactly ${totalNumChars} *new and distinct* characters for a visual novel based on the following story:
    Title: "${selectedStoryDetails.title}"
    Description: "${selectedStoryDetails.description}".`;

    if (selectedStoryDetails.genres.length > 0) {
        prompt += ` Main genres: ${selectedStoryDetails.genres.join(', ')}.`;
    }
    if (selectedStoryDetails.subgenres.length > 0) {
        prompt += ` Subgenres: ${selectedStoryDetails.subgenres.join(', ')}.`;
    }
    prompt += ` Story Rating: ${selectedStoryDetails.rating}.`;

    prompt += `
    For each character, provide:
    - "id": a short unique string (e.g., "char1", "char2")
    - "name": full name. MUST NOT be "seseorang misterius" or any generic placeholder. Use actual names. Ensure names are unique within this list and are NOT repeated from previous generations. **STRICTLY AVOID USING THE NAMES "Arya" AND "Anya".**
    - "class": character role/archetype (e.g., Hero, Mage, King, Guard).
    - "personality": 3-5 descriptive keywords (e.g., brave, loyal, cunning, melancholic, resourceful)
    - "description": a brief role/background in the story (e.g., "The exiled prince seeking his throne", "A mysterious mage from the enchanted forest").
    - "role": Assign a *distinct* narrative role from the following list or similar archetypes: ${rolesList.join(', ')}. Ensure roles are varied, relevant to the story, and unique among the generated characters.
    - "isPotentialMC": boolean. Generate *at least 2 and up to 4* characters where 'isPotentialMC' is true. These characters MUST be highly relevant and suitable as the main protagonist for the story title "${selectedStoryDetails.title}" and description "${selectedStoryDetails.description}". Prioritize roles like Protagonist, Antihero, The Chosen One, Rebel, Avenger, Legend. The rest should be false.

    The character descriptions and personalities should be consistent with the story's rating (${selectedStoryDetails.rating}). Avoid generating characters that would lead to content violating the rating restrictions, especially regarding explicit sexual content (forbidden for all ratings). Themes related to LGBTQ+, Yuri, Yaoi, Harem, and Reverse Harem are STRICTLY FORBIDDEN.`;


    if (charClassHint) {
        prompt += ` One character should ideally have the class: "${charClassHint}".`;
    }

    switch (nameStyle) {
        case 'japanese':
            prompt += ` Character names MUST sound authentically Japanese (e.g., Akira, Sakura, Kenji, Yui, Haruki, Saya, Hiroshi, Rin, Takumi, Ami). Strictly use Japanese-sounding names.`;
            break;
        case 'chinese':
            prompt += ` Character names MUST sound authentically Chinese (e.g., Li Wei, Zhang Min, Wang Fang, Chen Bo, Liu Yang, Zhou Jie, Wu Fan, Zhao Lihua, Sun Lei, Xu Jing). Strictly use Chinese-sounding names.`;
            break;
        case 'arabic':
            prompt += ` Character names MUST sound authentically Arabic (e.g., Amir, Fatima, Omar, Layla, Jamal, Samira, Tariq, Zahra, Khalil, Aisha). Strictly use Arabic-sounding names.`;
            break;
        case 'fantasy':
            prompt += ` Character names MUST sound genuinely fantastical and unique, not like common real-world names (e.g., Elara, Kaelen, Lyra, Thorian, Zephyr, Seraphina, Orion, Aethelred, Faelan, Isolde). Strictly use fantasy-inspired names.`;
            break;
        case 'european_medieval':
            prompt += ` Character names MUST sound like authentic European Medieval names (e.g., Arthur, Eleanor, Geoffrey, Isolde, Roland, Guinevere, Percival, Beatrice, Edmund, Matilda). Strictly use European Medieval-sounding names.`;
            break;
        case 'celtic':
            prompt += ` Character names MUST sound like authentic Celtic names (e.g., Aoife, Cormac, Deirdre, Eilidh, Ronan, Siobhan, Ciaran, Niamh, Finn, Brigid). Strictly use Celtic-sounding names.`;
            break;
        case 'norse':
            prompt += ` Character names MUST sound like authentic Norse names (e.g., Bjorn, Freya, Ragnar, Astrid, Erik, Ingrid, Leif, Sigrid, Gunnar, Thora). Strictly use Norse-sounding names.`;
            break;
        case 'ancient_egyptian':
            prompt += ` Character names MUST sound like authentic Ancient Egyptian names (e.g., Nefertari, Ramses, Imhotep, Cleopatra, Akhenaten, Hatshepsut, Thutmose, Isis, Osiris, Anubis). Strictly use Ancient Egyptian-sounding names.`;
            break;
        case 'indonesian':
            prompt += ` Character names MUST sound like common Indonesian names (e.g., Budi, Siti, Rahmat, Indah, Agung, Ayu, Dani, Dewi, Fitri, Joko). Strictly use Indonesian-sounding names.`;
            break;
        case 'german':
            prompt += ` Character names MUST sound like common German names (e.g., Hans, Gretel, Klaus, Sofia, Lena, Max, Anna, Felix, Emma, Lukas). Strictly use German-sounding names.`;
            break;
        default:
            prompt += ` Character names should be diverse (e.g., Western, Asian, Middle Eastern, Fantasy-inspired).`;
            break;
    }
    prompt += ` Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} language for personality, description, class, and role values.`;
    prompt += ` Ensure the output is a JSON array containing exactly ${totalNumChars} character objects.`;
    prompt += ` (Timestamp: ${Date.now()})`;


    generatedCharacters = await callGeminiAPI(prompt, charSchema, loadingCharacters, loadingCharsText, loadingAdditionalTextChars, generateCharactersBtn);


    if (generatedCharacters && generatedCharacters.length > 0) {
        generatedCharacters = generatedCharacters.slice(0, totalNumChars);

        const potentialMCs = generatedCharacters.filter(char => char.isPotentialMC);

        mcSelectionHeading.style.display = 'block';
        characterActionButtons.style.display = 'flex';
        characterResultsDiv.innerHTML = '';


        if (potentialMCs.length > 0) {
            const mcCandidatesTitle = document.createElement('h3');
            mcCandidatesTitle.className = 'text-xl font-bold mt-4 mb-3 text-center text-gray-700 dark:text-gray-300';
            mcCandidatesTitle.textContent = selectedLanguage === 'id' ? 'Pilih Karakter Utama Anda:' : 'Select Your Main Character:';
            characterResultsDiv.appendChild(mcCandidatesTitle);


            potentialMCs.forEach(char => {
                const charCard = document.createElement('div');
                charCard.className = 'character-card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 cursor-pointer hover:shadow-xl transition-all duration-300 ease-in-out potential-mc';
                charCard.dataset.characterId = char.id;
                charCard.innerHTML = `
                    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2 flex items-center justify-center"><span class="icon-placeholder text-2xl mr-2">✨</span> ${char.name}</h2>
                    <p class="text-gray-700 dark:text-gray-300 text-sm mb-1"><span class="font-medium text-gray-800 dark:text-gray-200">${selectedLanguage === 'id' ? 'Kelas' : 'Class'}:</span> ${char.class}</p>
                    <p class="text-gray-700 dark:text-gray-300 text-sm mb-1"><span class="font-medium text-gray-800 dark:text-gray-200">${selectedLanguage === 'id' ? 'Peran Awal' : 'Initial Role'}:</span> ${char.role}</p>
                    <p class="text-gray-700 dark:text-gray-300 text-sm mb-1"><span class="font-medium text-gray-800 dark:text-gray-200">${selectedLanguage === 'id' ? 'Sifat' : 'Personality'}:</span> ${char.personality}</p>
                    <p class="text-gray-700 dark:text-gray-300 text-sm"><span class="font-medium text-gray-800 dark:text-gray-200">${selectedLanguage === 'id' ? 'Tentang' : 'About'}:</span> ${char.description}</p>
                `;
                characterResultsDiv.appendChild(charCard);
                addCharacterCardEventListener(charCard, char);
            });
        } else {
            showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Kandidat MC' : 'No MC Candidates', selectedLanguage === 'id' ? 'AI tidak dapat mengidentifikasi kandidat karakter utama. Coba lagi atau sesuaikan prompt.' : 'AI could not identify main character candidates. Try again or adjust the prompt.');
        }

    } else {
         showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Karakter' : 'No Characters', selectedLanguage === 'id' ? 'AI tidak dapat menghasilkan karakter. Coba lagi.' : 'AI could not generate characters. Please try again.');
    }
}

function addCharacterCardEventListener(charCard, charData) {
    charCard.addEventListener('click', () => {
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-mc');
            card.style.backgroundColor = '';
            const iconSpan = card.querySelector('.icon-placeholder');
            if (iconSpan) iconSpan.textContent = '✨';
        });

        charCard.classList.add('selected-mc');
        selectedMainCharacter = charData;
        console.log("Selected MC:", selectedMainCharacter);

        const selectedIconSpan = charCard.querySelector('.icon-placeholder');
        if (selectedIconSpan) selectedIconSpan.textContent = '😇';
    });
}

// --- Game Play Functions ---
async function startGame() {
    showScreen('game-screen');
    // Ensure gameLoadingOverlay uses the shared loading style
    gameLoadingOverlay.classList.add('loading-indicator'); // Apply base loading styles
    gameLoadingOverlay.style.display = 'flex';
    gamePlayScreen.style.display = 'none';

    await generatePrologue();
}

async function generatePrologue() {
    const prologSchema = {
        type: "OBJECT",
        properties: {
            "prologueTitle": { "type": "STRING" },
            "prologueText": { "type": "STRING" },
            "prologueQuote": { "type": "STRING", "description": "An optional, evocative quote to end the prolog" },
            "initialSystems": {
                "type": "OBJECT",
                "properties": {
                    "trustSystem": { "type": "STRING", "description": "Example: Trust System (active)" },
                    "deathTrigger": { "type": "STRING", "description": "Example: Death Trigger (active)" },
                    "flagAwal": { "type": "STRING", "description": "Example: Kamu menganggap permaisuri hanya beban yang harus diamati" },
                    "pathTracker": { "type": "STRING", "description": "Example: Bayangan di Atas Takhta" },
                    "lockedPaths": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Example: [\"🗡️ Ciuman Pengkhianat\", \"👑 Ikrar di Ujung Senja\"]" },
                    "notes": { "type": "STRING", "description": "Example: MC bisa membunuh atau menyelamatkan sang permaisuri tergantung pilihan dan trust" }
                },
                "required": ["trustSystem", "deathTrigger", "flagAwal", "pathTracker", "lockedPaths", "notes"]
            },
            "genreDetails": { "type": "STRING", "description": "Example: 😇 Genre, Romantis, Bodyguard Romance" },
            "rating": { "type": "STRING", "enum": ["SU", "PG-13", "16+", "18+", "21+"] }
        },
        "required": ["prologueTitle", "prologueText", "prologueQuote", "initialSystems", "genreDetails", "rating"]
    };

    const mcName = selectedMainCharacter.name;
    const mcClass = selectedMainCharacter.class;
    const mcPersonality = selectedMainCharacter.personality;
    const storyTitle = selectedStoryDetails.title;
    const storyDescription = selectedStoryDetails.description;
    const genres = selectedStoryDetails.genres.join(', ');
    const subgenres = selectedStoryDetails.subgenres.join(', ');
    const rating = selectedStoryDetails.rating;
    const initialPlaceMentions = selectedStoryDetails.initialPlaceMentions || []; // Get place mentions from story details

    let prompt = `Generate a compelling visual novel prologue for the story "${storyTitle}" (Description: "${storyDescription}") focusing on the main character ${mcName} (${mcClass}, Personality: ${mcPersonality}). The prologue should set the scene, introduce the MC's initial perspective, and hint at the main conflict. The story has a rating of ${rating}. Ensure the content is strictly compliant with this rating. **STRICTLY AVOID USING THE NAMES "Arya" AND "Anya".**

    Crucially, given the character naming style is "${selectedNameStyle}", ensure that any place names (cities, regions, provinces, villages, landmarks) mentioned in the prologue narrative or dialogue are *culturally appropriate* for that style. For example, if "${selectedNameStyle}" is "chinese", use Chinese-sounding place names (e.g., "Provinsi Shingyei", "Kota Longjing", "Desa Wuyue"). If "${selectedNameStyle}" is "indonesian", use Indonesian-sounding place names. If the original description contained specific place names like "Jawa Timur" or "Desa Sukorame" (${JSON.stringify(initialPlaceMentions)}), *replace them with culturally appropriate equivalents* based on the "${selectedNameStyle}" style. If no clear equivalent, use a generic but culturally fitting term (e.g., "desa di Tiongkok", "kota di Jepang").

    Perkaya narasi dan deskripsi adegan:
    - Tambahkan lebih banyak detail sensorik (apa yang terlihat, terdengar, tercium, terasa) untuk membuat adegan lebih hidup.
    - Sertakan lebih banyak pikiran dan perasaan internal Karakter Utama (MC) untuk membantu pemain terhubung lebih dalam dengan MC.
    - Variasikan kecepatan narasi (pacing dinamis); beberapa paragraf bisa cepat dan berurutan untuk adegan aksi, sementara yang lain lebih lambat dan deskriptif untuk adegan reflektif atau emosional.
    - "Show, Don't Tell": Tunjukkan emosi atau situasi melalui tindakan dan deskripsi, bukan hanya menyatakan.

    After the narrative, include the following dynamic systems' initial states as described by the user:
    ---
    🎮 SISTEM DINAMIS VISUAL NOVEL
    ---
    🧠 1. Trust System: Setiap karakter memiliki poin kepercayaan terhadap MC. Trust bisa naik atau turun tergantung pilihan, dialog, atau tindakan. Trust tinggi membuka rahasia, jalur unik, atau ending positif. Trust rendah bisa memicu pengkhianatan, kematian karakter, atau ending buruk.
    🩸 2. Death Trigger: MC atau karakter penting bisa mati jika pemain mengambil pilihan tertentu. Kematian bisa bersifat langsung atau karena efek berantai. Jika MC mati, cerita dianggap gagal.
    🎭 3. Flag Awal: Karakter membawa kondisi tersembunyi sejak awal (contoh: pernah dikhianati, menyimpan rahasia, trauma). Flag ini bisa terpicu oleh kata, tindakan, atau waktu tertentu. Pengaruh besar terhadap sikap awal karakter terhadap MC.
    🔒 4. Path Tracker: Menampilkan jalur besar cerita yang sedang ditempuh MC (contoh: “Bayangan Di Antara Dua Mahkota”). Jalur ini bisa berganti tergantung keputusan kunci. Path bisa berisi sub-jalur tersembunyi.
    🕊️ 5. Jalur Cerita Terkunci Potensial: Beberapa jalur hanya terbuka jika pemain memenuhi syarat tertentu: Trust tinggi/rendah, Flag terbuka, Tindakan rahasia, DNA Keputusan khusus.
    🎯 Catatan: [Peringatan atau info penting]

    Format the output strictly as JSON according to the provided schema. The prologue should be in ${selectedLanguage === 'id' ? 'Indonesian' : 'English'}.

    When referencing MC, use "${mcName}" instead of "MC".
    Make sure the initial Flag Awal is relevant to the MC's personality and the story premise.

    Rating Considerations:
    - Explicit sexual content (e.g., graphic descriptions of sexual acts, nudity intended to arouse): STRICTLY FORBIDDEN.
    - Themes related to LGBTQ+, Yuri, Yaoi, Harem, and Reverse Harem are STRICTLY FORBIDDEN.
    - Violence, harsh language, murder, crime, accusation: Permitted only for ratings 16+, 18+ and 21+. For SU and PG-13, these themes must be absent or very mild/implied.
    - For 18+ rating: Allows stronger violence and harsh language than 16+, and **non-explicit suggestive themes (implied sexual tension, romance, or situations without explicit detail)**.
    `;

    const prologData = await callGeminiAPI(
        prompt,
        prologSchema,
        gameLoadingOverlay,
        gameLoadingOverlay.querySelector('span'),
        gameLoadingAdditionalText,
        null // No button to disable for this loading
    );

    if (prologData) {
        displayPrologue(prologData);
        gameLoadingOverlay.style.display = 'none';
        gamePlayScreen.style.display = 'flex';
        gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Prolog' : 'Prologue Error', selectedLanguage === 'id' ? 'Tidak dapat menghasilkan prolog. Coba lagi.' : 'Could not generate prologue. Please try again.');
        showScreen('summary-screen');
    }
}

function displayPrologue(prologData) {
    prologContentDisplay.innerHTML = `
        <div class="chapter-header-card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🌹 ${prologData.prologueTitle}</h2>
            <p class="chapter-meta text-sm text-gray-600 dark:text-gray-400">${prologData.genreDetails} | Rating: ${prologData.rating}</p>
        </div>
        <div class="narrative-content w-full">
            ${prologData.prologueText.split('\n').filter(Boolean).map(p => {
                if (p.trim().startsWith('> ')) {
                    return `<p class="prolog-quote text-gray-700 dark:text-gray-300 italic border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 text-center">${p.trim().substring(2)}</p>`;
                }
                return `<p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4 text-justify">${p.trim()}</p>`;
            }).join('')}
        </div>
    `;
    prologContentDisplay.style.display = 'block';
    chapterContentDisplay.style.display = 'none';

    gameProgress.pathTracker = prologData.initialSystems.pathTracker;
    gameProgress.lockedPaths = prologData.initialSystems.lockedPaths;
    gameProgress.flagAwal = prologData.initialSystems.flagAwal;

    renderDynamicSystems(prologData.initialSystems, true);

    choiceContainer.innerHTML = '';
    startRealStoryBtn.style.display = 'block';
}

async function startChapter1() {
    gameProgress.currentChapter = 1;
    gameProgress.currentScene = 1;

    prologContentDisplay.style.display = 'none';
    startRealStoryBtn.style.display = 'none';
    gameLoadingOverlay.classList.add('loading-indicator'); // Apply base loading styles
    gameLoadingOverlay.style.display = 'flex';

    await generateChapter(gameProgress.currentChapter);
}

async function generateChapter(chapterNum, previousChoiceText = null) {
    const chapterSchema = {
        type: "OBJECT",
        properties: {
            "chapterTitle": { "type": "STRING" },
            "chapterMeta": {
                "type": "OBJECT",
                "properties": {
                    "mcDisplay": { "type": "STRING", "description": "Example: MC: Renessa – Penjaga Bayangan" },
                    "activePath": { "type": "STRING", "description": "Example: Jalur Aktif: Bayangan di Atas Takhta" }
                },
                "required": ["mcDisplay", "activePath"]
            },
            "chapterContent": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "type": { "type": "STRING", "enum": ["narrative", "dialogue"] },
                        "speaker": { "type": "STRING", "description": "The name of the character speaking. Required if type is 'dialogue'. MUST be a specific character name (e.g., 'Permaisuri', 'Kapten Drevan', or the MC's actual name like 'Aldi Saputra'), NOT 'seseorang misterius' or any generic placeholder." },
                        "text": { "type": "STRING", "description": "The dialogue content. This text should ONLY contain the dialogue itself, without 'Nama MC [Aku]:' or 'Nama Karakter:'. This prefix will be added by the client-side code. Quotes starting with '> ' can be part of any text block." }
                    },
                    "required": ["type", "text"]
                }
            },
            "choices": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "id": { "type": "STRING" },
                        "text": { "type": "STRING" },
                        "emote": { "type": "STRING", "description": "The actual emote character (e.g., '💬', '🦶', '🧊'), NOT descriptive words like 'confused' or 'question'." }
                    },
                    "required": ["id", "text", "emote"]
                }
            },
            "consequenceNote": { "type": "STRING", "description": "Note about what choices will affect" },
            "dynamicUpdates": {
                "type": "OBJECT",
                "properties": {
                    "trustUpdates": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "character": { "type": "STRING" },
                                "change": { "type": "NUMBER" },
                                "reason": { "type": "STRING" }
                            },
                            "required": ["character", "change"]
                        }
                    },
                    "flagsTriggered": { "type": "ARRAY", "items": { "type": "STRING" } },
                    "newAchievements": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "title": { "type": "STRING" },
                                "description": { "type": "STRING" }
                            },
                            "required": ["title", "description"]
                        }
                    },
                    "dnaProfileChanges": {
                        "type": "OBJECT",
                        "properties": {
                            "moral": { "type": "STRING", "enum": ["Tinggi", "Netral", "Rendah"] },
                            "honesty": { "type": "STRING", "enum": ["Tinggi", "Netral", "Rendah"] },
                            "empathy": { "type": "STRING", "enum": ["Tinggi", "Netral", "Rendah"] },
                            "style": { "type": "STRING", "enum": ["Observasi", "Agresif", "Diplomatik", "Manipulatif", "Kritis", "Impulsif"] }
                        }
                    },
                    "timeUpdate": { "type": "STRING" },
                    "activeEvents": { "type": "ARRAY", "items": { "type": "STRING" } },
                    "pathTrackerChange": { "type": "STRING" },
                    "lockedPathsInfo": { "type": "STRING" }
                }
            },
            "rating": { "type": "STRING", "enum": ["SU", "PG-13", "16+", "18+", "21+"] }
        },
        "required": ["chapterTitle", "chapterMeta", "chapterContent", "choices", "consequenceNote", "rating"]
    };

    const mcName = selectedMainCharacter.name;
    const mcClass = selectedMainCharacter.class;
    const storyTitle = selectedStoryDetails.title;
    const rating = selectedStoryDetails.rating;

    const allCharacterNames = generatedCharacters.map(c => ({
        name: c.name,
        personality: c.personality,
        role: c.role,
        isMC: c.id === selectedMainCharacter.id
    }));

    const currentGameStateForAI = {
        mc: {
            name: mcName,
            class: mcClass,
            personality: selectedMainCharacter.personality,
            description: selectedMainCharacter.description
        },
        story: {
            title: storyTitle,
            description: selectedStoryDetails.description,
            genres: selectedStoryDetails.genres,
            subgenres: selectedStoryDetails.subgenres,
            rating: rating
        },
        allCharactersInStory: allCharacterNames,
        gameProgress: {
            currentChapter: gameProgress.currentChapter,
            currentScene: gameProgress.currentScene,
            trustPoints: JSON.stringify(gameProgress.trustPoints),
            flagAwal: gameProgress.flagAwal,
            pathTracker: gameProgress.pathTracker,
            lockedPaths: gameProgress.lockedPaths,
            achievements: gameProgress.achievements,
            traumaSystem: JSON.stringify(gameProgress.traumaSystem),
            relationshipLabels: JSON.stringify(gameProgress.relationshipLabels),
            timeSystem: JSON.stringify(gameProgress.timeSystem),
            dnaProfile: gameProgress.dnaProfile,
            playerChoices: gameProgress.playerChoices.map(c => c.choiceText).join("; ")
        },
        previousChoice: previousChoiceText
    };

    let prompt = `Continue the visual novel story. The current game state is: ${JSON.stringify(currentGameStateForAI)}.

    Generate the content for Chapter ${chapterNum}, including:
    - A concise chapter title.
    - "chapterMeta": An object containing "mcDisplay" (e.g., "MC: Renessa – Penjaga Bayangan") and "activePath" (e.g., "Jalur Aktif: Bayangan di Atas Takhta").
    - "chapterContent": An ordered array of narrative and dialogue blocks.
        - For narrative blocks, use type "narrative" and include the text. **Ensure narrative flows logically from the previous scene/prologue and does not jump.**
        - For dialogue blocks, use type "dialogue", explicitly include the "speaker" name (e.g., 'Permaisuri', 'Kapten Drevan', or "${mcName}" for the MC). The speaker's name MUST be a concrete character name from 'allCharactersInStory' and NEVER a generic placeholder like "seseorang misterius". **STRICTLY AVOID USING THE NAMES "Arya" AND "Anya".**
        - The "text" of their dialogue. This text should ONLY contain the dialogue itself, without "Nama MC [Aku]:" or "Nama Karakter:". This prefix will be added by the client-side code. Quotes starting with '> ' can be part of any text block. **IMPORTANT: Ensure the dialogue sounds natural and is consistent with the speaker's personality and role as defined in 'allCharactersInStory'. Avoid stiff or unnatural phrasing.**
    - A set of 3 choices (dialogue or action) for the player.
    - A "consequenceNote" explaining what the choices will affect.
    - "dynamicUpdates": An object containing updates for various dynamic systems based on the narrative progression and previous choice.
        - **Specifically for 'dnaProfileChanges'**: Based on the 'previousChoice' made by the player, determine the new state of 'moral', 'honesty', 'empathy', and 'style' for the MC.
            - Possible values for moral, honesty, empathy: "Tinggi", "Netral", "Rendah".
            - Possible values for style: "Observasi", "Agresif", "Diplomatik", "Manipulatif", "Kritis", "Impulsif".
            - If a choice leans towards kindness, 'empathy' might become "Tinggi". If a choice is deceptive, 'honesty' might become "Rendah" and 'style' "Manipulatif". A decisive, action-oriented choice might make 'style' "Agresif". If a choice has no significant moral/stylistic implication, keep them "Netral" or "Observasi" or based on their current state. Only include the properties that *change*.
    - "rating": The determined rating for the chapter content based on the story's overall rating. This must be one of "SU", "PG-13", "16+", "18+", "21+".

    Crucially, given the character naming style is "${selectedNameStyle}", ensure that any place names (cities, regions, provinces, villages, landmarks) mentioned in the chapter narrative or dialogue are *culturally appropriate* for that style. If the original story description or previous chapters contained specific place names that do not match this style, *replace them with culturally appropriate equivalents* (e.g., "Jawa Timur" becomes "Provinsi Shingyei" for "chinese" style). If no clear equivalent, use a generic but culturally fitting term (e.g., "desa di Tiongkok", "kota di Jepang").

    Perkaya narasi dan deskripsi adegan:
    - Tambahkan lebih banyak detail sensorik (apa yang terlihat, terdengar, tercium, terasa) untuk membuat adegan lebih hidup.
    - Sertakan lebih banyak pikiran dan perasaan internal Karakter Utama (MC) untuk membantu pemain terhubung lebih dalam dengan MC.
    - Variasikan kecepatan narasi (pacing dinamis); beberapa paragraf bisa cepat dan berurutan untuk adegan aksi, sementara yang lain lebih lambat dan deskriptif untuk adegan reflektif atau emosional.
    - "Show, Don't Tell": Tunjukkan emosi atau situasi melalui tindakan dan deskripsi, bukan hanya menyatakan.

    The dynamic systems are:
    1. Trust System: Each character has trust points towards MC. Trust can increase or decrease. High trust unlocks secrets, unique paths, or positive endings. Low trust can trigger betrayal, character death, or bad endings.
    2. Death Trigger: MC or important characters can die based on choices. Death can be immediate or chain reaction. If MC dies, game over.
    3. Flag Awal: Characters have hidden conditions from the start (e.g., betrayed before, secret, trauma). Triggered by words, actions, or time. Greatly influences initial attitude towards MC.
    4. Path Tracker: Shows main story path (e.g., “Shadows Between Two Crowns”). This path can change based on key decisions. Paths can contain hidden sub-paths.
    5. Locked Story Paths: Some paths open only if certain conditions met (high/low trust, flags triggered, secret actions, specific DNA Profile).
    6. Trust Dynamic Update: Only appears for significant changes. Format: 🔸 Althea: +2.1, 🟡 Kael: -1.2 → “You broke it again?”, ⚠️ Shadow Guild: -4.0 → [Considers you a threat].
    7. Title / Achievement System: Player gets titles based on moral choices, play style, and ending. Example: 🗡️ Bloody Hand, 👑 Forgiving Hero, 🕷️ Master Deceiver. Titles can unlock unique dialogues or hidden paths.
    8. Inner Wound / Trauma System: Heavy decisions/events can trigger trauma on MC/characters. Effects: trust changes, locking choices, different emotional dialogues.
    9. Dynamic Character Dialogue: Adjusts based on Trust, Relationship Label, interaction history. Characters remember past actions.
    10. Character Relationship Label System: Stores labels like: Friend, Old Enemy, Hidden Love, Former Alliance. Changes based on choices and trust. Affects special dialogues, exclusive events, betrayal/sacrifice potential.
    11. Dynamic Time Event System: Events tied to time (morning, noon, night, specific hour). Each action advances time. Some events only appear at certain times. Format: 🕒 Time: Day 3, Night; ⏳ Countdown: 1 time left before South Gate closes; 📍 Active Event: Kael's Execution (terjadi saat fajar).
    12. Choice DNA / Decision Root System: Tracks player's moral patterns: Moral, Honesty, Empathy, Decision Style. This DNA affects: secret paths, automatic trust, hidden endings.
    13. MC Dialogue Choice System: MC speaks with characters. Dialogue can trigger trust changes, emotions, or story paths. Choices are provided. Example: 💬 What will you say to Kael? a. “I promise to return” b. “If you die, it's not my business.” c. (Remain silent).
    14. Action / Behavior Choice System: Not all choices are dialogue. Some are direct actions. Actions can trigger new scenes, paths, or flags. Example: 🧭 What will you do? a. Go investigate the dungeon b. Report to the General c. Hide and observe from afar. Can be combined with dialogue.

    Format the output strictly as JSON according to the provided schema. Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} for all content.

    For the "choices" emotes, ONLY use these specific characters: '💬' (dialogue), '🦶' (action/movement), '🧊' (silence/inaction), '✨' (magic/supernatural), '🗡️' (combat/threat), '❤️' (affection/emotion), '🧠' (thought/analysis), '🔍' (investigation/discovery), '⏳' (time-related action), '📜' (reading/lore). Do NOT use descriptive words like 'confused', 'question', 'silent'.
    Make sure all numerical trust changes are represented with positive or negative values like "+2.1" or "-1.2".
    Include at least 3 choices per step.
    Focus on creating a compelling and interactive story with clear progression. **Ensure narrative continuity, building directly on the previous chapter's events and the previous choice made. Avoid jumping in plot or introducing unrelated elements. The story must progress naturally from where it left off.**
    If a character dies, the AI should indicate "MC mati" (MC died) or a specific character's death in the narrative/notes, which will trigger the game over logic.
    Do NOT include the "🎮 Sistem Aktif:" block in the chapter output, only provide the individual dynamic updates in the "dynamicUpdates" object.
    Always provide a "consequenceNote" explaining what the choices will affect (e.g., Kepercayaan sang Permaisuri, Jalur cerita aktif, DNA Pilihan).

    Rating Guidelines for this chapter (must adhere to story's overall rating of ${rating}):
    - SU: Suitable for all audiences. No violence, no harsh language, no suggestive themes.
    - PG-13: Parental guidance suggested. May contain mild violence, some suggestive themes, or brief strong language.
    - 16+: Contains mature themes, moderate violence, strong language, and/or suggestive themes.
    - 18+: Contains mature themes, stronger violence, harsh language, and/or **non-explicit suggestive themes (implied sexual tension, romance, or situations without explicit detail)**.
    - 21+: Contains explicit violence, strong language, and mature themes (excluding explicit sexual content).
    Explicit sexual content (e.g., graphic descriptions of sexual acts, nudity intended to arouse): STRICTLY FORBIDDEN.
    Themes related to LGBTQ+, Yuri, Yaoi, Harem, and Reverse Harem are STRICTLY FORBIDDEN.
    Violence, harsh language, murder, crime, accusation: Permitted only for ratings 16+, 18+, and 21+.
    `;

    const chapterData = await callGeminiAPI(
        prompt,
        chapterSchema,
        gameLoadingOverlay,
        gameLoadingOverlay.querySelector('span'),
        gameLoadingAdditionalText,
        null // No button to disable for this loading
    );

    if (chapterData) {
        renderGameContent(chapterData);
        gameLoadingOverlay.style.display = 'none';
        chapterContentDisplay.style.display = 'block';
        gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Bab' : 'Chapter Error', selectedLanguage === 'id' ? 'Tidak dapat menghasilkan bab. Coba lagi.' : 'Could not generate chapter. Please try again.');
        showScreen('game-over-screen');
    }
}

function renderGameContent(chapterData) {
    chapterContentDisplay.innerHTML = '';

    const chapterHeaderCard = document.createElement('div');
    chapterHeaderCard.className = 'chapter-header-card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 mb-6 text-center';
    chapterHeaderCard.innerHTML = `
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">🩸 ${chapterData.chapterTitle}</h2>
        <p class="chapter-meta text-sm text-gray-600 dark:text-gray-400">
            <span class="font-medium text-gray-800 dark:text-gray-200">🎭 MC:</span> ${chapterData.chapterMeta.mcDisplay} <br>
            <span class="font-medium text-gray-800 dark:text-gray-200">🔒 Jalur Aktif:</span> ${chapterData.chapterMeta.activePath} <br>
            <span class="font-medium text-gray-800 dark:text-gray-200">⭐ Rating:</span> ${chapterData.rating}
        </p>
    `;
    chapterContentDisplay.appendChild(chapterHeaderCard);

    const narrativeContainer = document.createElement('div');
    narrativeContainer.className = 'narrative-content w-full';
    chapterContentDisplay.appendChild(narrativeContainer);


    chapterData.chapterContent.forEach(block => {
        if (block.type === 'narrative') {
            const p = document.createElement('p');
            p.innerHTML = block.text.split('\n').filter(Boolean).map(line => {
                if (line.trim().startsWith('> ')) {
                    return `<p class="chapter-quote text-gray-700 dark:text-gray-300 italic border-l-4 border-gray-300 dark:border-gray-600 pl-4 my-4 text-center">${line.trim().substring(2)}</p>`;
                }
                return `<p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4 text-justify">${line.trim()}</p>`;
            }).join('');
            narrativeContainer.appendChild(p);
        } else if (block.type === 'dialogue') {
            const dialogueCard = document.createElement('div');
            let speakerNameDisplay = block.speaker;
            let dialogueText = block.text;

            if (block.speaker === selectedMainCharacter.name) {
                dialogueCard.className = 'character-dialogue-card p-4 rounded-lg mb-3 shadow-sm transition-all duration-300 ease-in-out mc-dialogue-card ml-auto';
                speakerNameDisplay = `${selectedMainCharacter.name} [Aku]`;
            } else {
                dialogueCard.className = 'character-dialogue-card p-4 rounded-lg mb-3 shadow-sm transition-all duration-300 ease-in-out other-dialogue-card mr-auto';
            }

            dialogueCard.innerHTML = `
                <strong class="speaker-name text-sm font-semibold">${speakerNameDisplay}:</strong>
                <span class="text-gray-700 dark:text-gray-300 text-base">${dialogueText}</span>
            `;
            narrativeContainer.appendChild(dialogueCard);
        }
    });

    if (chapterData.dynamicUpdates) {
        const updates = chapterData.dynamicUpdates;

        if (updates.trustUpdates) {
            updates.trustUpdates.forEach(tu => {
                if (!gameProgress.trustPoints[tu.character]) {
                    gameProgress.trustPoints[tu.character] = 0;
                }
                gameProgress.trustPoints[tu.character] += tu.change;
            });
        }

        if (updates.flagsTriggered) {
            updates.flagsTriggered.forEach(flag => {
                if (!gameProgress.flagAwal[flag]) {
                    gameProgress.flagAwal[flag] = true;
                }
            });
        }

        if (updates.newAchievements) {
            updates.newAchievements.forEach(achievement => {
                if (!gameProgress.achievements.some(a => a.title === achievement.title)) {
                    gameProgress.achievements.push(achievement);
                }
            });
        }

        if (updates.dnaProfileChanges) {
            gameProgress.dnaProfile = { ...gameProgress.dnaProfile, ...updates.dnaProfileChanges };
        }

        if (updates.timeUpdate) {
            gameProgress.timeSystem.display = updates.timeUpdate;
        }

        if (updates.activeEvents) {
            gameProgress.timeSystem.activeEvents = updates.activeEvents;
        }

        if (updates.pathTrackerChange) {
            gameProgress.pathTracker = updates.pathTrackerChange;
        }

        if (updates.lockedPathsInfo) {
            // This is more of a note, not a true state change for lockedPaths array
        }
    }

    renderDynamicSystems(chapterData.dynamicUpdates);

    choiceContainer.innerHTML = '';
    chapterData.choices.forEach(choice => {
        const choiceCard = document.createElement('div');
        choiceCard.className = 'choice-card p-4 rounded-lg border border-blue-300 dark:border-blue-600 shadow-md cursor-pointer hover:shadow-lg transition-all duration-300 ease-in-out flex items-center gap-3 bg-blue-50 dark:bg-blue-900 text-gray-900 dark:text-gray-100';
        choiceCard.innerHTML = `<span class="choice-emote text-lg">${choice.emote}</span> <span class="text-base font-semibold">${choice.text}</span>`;
        choiceCard.addEventListener('click', () => handleChoice(choice));
        choiceContainer.appendChild(choiceCard);
    });

    if (chapterData.consequenceNote) {
        const consequenceP = document.createElement('p');
        consequenceP.className = 'text-sm mt-4 text-gray-600 dark:text-gray-400 text-center italic';
        consequenceP.textContent = chapterData.consequenceNote;
        choiceContainer.appendChild(consequenceP);
    }
}

function renderDynamicSystems(updates, isInitial = false) {
    dynamicSystemsDisplay.innerHTML = `<h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">🎮 Sistem Aktif:</h3>`;

    const appendSystemLine = (icon, title, value) => {
        if (value) {
            const p = document.createElement('p');
            p.className = 'text-sm text-gray-700 dark:text-gray-300 mb-1';
            p.innerHTML = `<span class="font-medium text-gray-800 dark:text-gray-200">${icon} ${title}:</span> ${value}`;
            dynamicSystemsDisplay.appendChild(p);
        }
    };

    appendSystemLine('🧠', 'Trust System', selectedLanguage === 'id' ? 'Setiap karakter memiliki poin kepercayaan terhadap MC.' : 'Each character has trust points towards MC.');
    appendSystemLine('🩸', 'Death Trigger', selectedLanguage === 'id' ? 'MC atau karakter penting bisa mati jika pemain mengambil pilihan tertentu.' : 'MC or important characters can die based on choices.');

    if (gameProgress.flagAwal) {
        if (typeof gameProgress.flagAwal === 'object' && Object.keys(gameProgress.flagAwal).length > 0) {
            const flagStrings = Object.keys(gameProgress.flagAwal).map(key => `${key}`);
            appendSystemLine('🎭', 'Flag Awal', flagStrings.join(', '));
        } else if (typeof gameProgress.flagAwal === 'string' && gameProgress.flagAwal.trim() !== "") {
            appendSystemLine('🎭', 'Flag Awal', gameProgress.flagAwal);
        }
    }
    if (gameProgress.pathTracker) {
        appendSystemLine('🔒', 'Path Tracker', gameProgress.pathTracker);
    }
    if (gameProgress.lockedPaths && gameProgress.lockedPaths.length > 0) {
        appendSystemLine('🕊️', 'Jalur Cerita Terkunci Potensial', gameProgress.lockedPaths.join(', '));
    }

    if (gameProgress.timeSystem.display) {
        appendSystemLine('⏳', 'Waktu & Event', gameProgress.timeSystem.display);
    } else if (gameProgress.timeSystem.day) {
        appendSystemLine('⏳', 'Waktu', `${selectedLanguage === 'id' ? 'Hari ke-' : 'Day '}${gameProgress.timeSystem.day}, ${gameProgress.timeSystem.partOfDay}`);
    }

    // Display current DNA Profile
    if (gameProgress.dnaProfile) {
        const dnaText = `Moral: <span class="${getDnaColorClass(gameProgress.dnaProfile.moral)}">${gameProgress.dnaProfile.moral}</span>, Kejujuran: <span class="${getDnaColorClass(gameProgress.dnaProfile.honesty)}">${gameProgress.dnaProfile.honesty}</span>, Empati: <span class="${getDnaColorClass(gameProgress.dnaProfile.empathy)}">${gameProgress.dnaProfile.empathy}</span>, Gaya: <span class="${getDnaColorClass(gameProgress.dnaProfile.style)}">${gameProgress.dnaProfile.style}</span>`;
        appendSystemLine('🧬', 'Profil Keputusan', dnaText);
    }

    if (updates && updates.trustUpdates && updates.trustUpdates.length > 0) {
        const trustUpdateTitle = document.createElement('p');
        trustUpdateTitle.className = 'font-bold text-gray-800 dark:text-gray-200 mt-2 text-sm';
        trustUpdateTitle.textContent = 'Trust Update:';
        dynamicSystemsDisplay.appendChild(trustUpdateTitle);

        updates.trustUpdates.forEach(tu => {
            const trustItem = document.createElement('p');
            let icon = '🟡';
            let textColorClass = 'text-amber-500';
            if (tu.change > 0) { icon = '🔸'; textColorClass = 'text-green-500'; }
            else if (tu.change < 0) { icon = '⚠️'; textColorClass = 'text-red-500'; }

            trustItem.className = `text-sm text-gray-700 dark:text-gray-300 ${textColorClass}`;
            trustItem.innerHTML = `${icon} ${tu.character}: <span class="font-semibold">${tu.change > 0 ? '+' : ''}${tu.change}</span>${tu.reason ? ` → "${tu.reason}"` : ''}`;
            dynamicSystemsDisplay.appendChild(trustItem);
        });
    }

    if (updates && updates.flagsTriggered && updates.flagsTriggered.length > 0) {
         const flagTriggeredTitle = document.createElement('p');
         flagTriggeredTitle.className = 'font-bold text-gray-800 dark:text-gray-200 mt-2 text-sm';
         flagTriggeredTitle.textContent = 'Flag Terpicu:';
         dynamicSystemsDisplay.appendChild(flagTriggeredTitle);

         updates.flagsTriggered.forEach(flag => {
            const flagItem = document.createElement('p');
            flagItem.className = 'text-sm text-gray-700 dark:text-gray-300';
            flagItem.textContent = `🧩 ${flag}`;
            dynamicSystemsDisplay.appendChild(flagItem);
         });
    }

    if (updates && updates.newAchievements && updates.newAchievements.length > 0) {
        const achievementTitle = document.createElement('p');
        achievementTitle.className = 'font-bold text-gray-800 dark:text-gray-200 mt-2 text-sm';
        achievementTitle.textContent = '🎖️ Gelar Baru:';
        dynamicSystemsDisplay.appendChild(achievementTitle);

        updates.newAchievements.forEach(ach => {
            const achievementItem = document.createElement('p');
            achievementItem.className = 'text-sm text-gray-700 dark:text-gray-300';
            achievementItem.innerHTML = `<strong>${ach.title}</strong>: ${ach.description}`;
            dynamicSystemsDisplay.appendChild(achievementItem);
        });
    }

    if (isInitial && updates && updates.notes) {
        const notesP = document.createElement('p');
        notesP.className = 'font-bold text-gray-800 dark:text-gray-200 mt-2 text-sm';
        notesP.textContent = `🎯 Catatan: ${updates.notes}`;
        dynamicSystemsDisplay.appendChild(notesP);
    }
}

// Helper function for DNA color class
function getDnaColorClass(value) {
    switch (value) {
        case 'Tinggi':
        case 'Agresif':
        case 'Diplomatik':
        case 'Kritis':
        case 'Impulsif':
            return 'text-green-500 font-semibold';
        case 'Rendah':
        case 'Manipulatif':
            return 'text-red-500 font-semibold';
        case 'Netral':
        case 'Observasi':
            return 'text-amber-500 font-semibold';
        default:
            return '';
    }
}


async function handleChoice(choice) {
    gameProgress.playerChoices.push({
        chapter: gameProgress.currentChapter,
        scene: gameProgress.currentScene,
        choiceId: choice.id,
        choiceText: choice.text
    });

    gameProgress.currentScene++;

    choiceContainer.innerHTML = '';
    gameLoadingOverlay.classList.add('loading-indicator'); // Apply base loading styles
    gameLoadingOverlay.style.display = 'flex';

    await generateChapter(gameProgress.currentChapter, choice.text);
}

// --- Initialization ---
window.onload = () => {
    // Selalu tampilkan layar API Key saat refresh
    showScreen('api-key-screen');
    setMainButtonsEnabled(false); // Pastikan tombol utama dinonaktifkan sampai API Key diisi
    updateLanguageText();
    applyStoredTheme();
};

