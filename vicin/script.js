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

// Elemen tombol pengubah tema telah dihapus dari HTML dan tidak diperlukan di sini

// --- Variabel Status Game ---
let selectedLanguage = 'id';
let selectedStoryDetails = null;
let generatedCharacters = []; // Ini akan menampung SEMUA karakter yang dihasilkan
let selectedMainCharacter = null;
let selectedNameStyle = 'random'; // Baru: Untuk menyimpan gaya nama yang dipilih

// Status kemajuan game untuk menyimpan data sistem dinamis
let gameProgress = {
    currentChapter: 0,
    currentScene: 0,
    trustPoints: {}, // {characterId: nilai}
    flagAwal: {}, // {flagName: boolean}
    pathTracker: null,
    lockedPaths: [],
    achievements: [],
    traumaSystem: {}, // {characterId: boolean}
    relationshipLabels: {}, // {characterId: label}
    timeSystem: {day: 1, partOfDay: "pagi", countdown: null, activeEvents: []},
    dnaProfile: {moral: "Netral", honesty: "Netral", empathy: "Netral", style: "Observasi"},
    playerChoices: [] // Menyimpan objek seperti {chapter: 1, choiceIndex: 0, choiceText: "..."}
};

// --- Fungsi Pembantu ---
function showScreen(screenId) {
    const screens = [apiKeyScreen, mainScreen, manualInputScreen, aiGenerateFormScreen, aiResultsScreen, characterCreationScreen, summaryScreen, gameScreen, gameOverScreen];
    screens.forEach(screen => {
        if (screen) {
            if (screen.id === screenId) {
                screen.style.display = 'flex'; // Gunakan flex untuk semua layar untuk pemusatan
            } else {
                screen.style.display = 'none';
            }
        }
    });
}

function showMessageBox(title, message) {
    messageBoxTitle.textContent = title;
    messageBoxContent.textContent = message;
    customMessageBox.style.display = 'flex'; // Gunakan flex untuk overlay
}

// Mengaktifkan/menonaktifkan tombol utama
function setMainButtonsEnabled(enabled) {
    manualInputBtn.disabled = !enabled;
    aiGenerateBtn.disabled = !enabled;
}

// --- Manajemen Kunci API ---
function getApiKey() {
    return localStorage.getItem('geminiApiKey');
}

function saveApiKey(key) {
    localStorage.setItem('geminiApiKey', key);
    API_KEY = key; // Perbarui variabel global API_KEY
}

function clearApiKey() {
    localStorage.removeItem('geminiApiKey');
    API_KEY = ""; // Hapus API_KEY global
    showMessageBox(selectedLanguage === 'id' ? 'Kunci API Dihapus' : 'API Key Cleared', selectedLanguage === 'id' ? 'Kunci API telah dihapus dari browser Anda. Silakan masukkan kunci baru.' : 'API Key has been cleared from your browser. Please enter a new key.');
    location.reload();
}

// --- Pembaruan Teks Bahasa (fungsi terkait tema dihapus) ---
function updateLanguageText() {
    if (selectedLanguage === 'id') {
        document.title = "Cerita Komik Interaktif";
        mainScreen.querySelector('h1').textContent = "Visual Novel AI";
        mainScreen.querySelector('p').textContent = "Dapatkan ide cerita baru atau masukkan cerita Anda sendiri.";
        manualInputBtn.textContent = "Masukkan Judul & Deskripsi Manual";
        aiGenerateBtn.textContent = "Hasilkan Cerita dengan AI";

        apiKeyScreen.querySelector('h1').textContent = "Masukkan Kunci API Gemini Anda";
        apiKeyScreen.querySelector('p').innerHTML = `Untuk menggunakan fitur AI, Anda memerlukan kunci API Gemini.
        Anda bisa mendapatkannya di: <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-600 hover:underline dark:text-blue-400">aistudio.google.com/app/apikey</a>`;
        apiKeyInput.placeholder = "Masukkan Kunci API Gemini Anda";
        saveApiKeyBtn.textContent = "Simpan Kunci API";
        clearApiKeyBtn.textContent = "Hapus Kunci API";
        apiKeyScreen.querySelector('p:last-of-type').textContent = "Peringatan: Menyimpan kunci API di browser tidak disarankan untuk aplikasi produksi.";


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

        apiKeyScreen.querySelector('h1').textContent = "Enter Your Gemini API Key";
        apiKeyScreen.querySelector('p').innerHTML = `To use AI features, you need a Gemini API key.
        You can get one at: <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-blue-600 hover:underline dark:text-blue-400">aistudio.google.com/app/apikey</a>`;
        apiKeyInput.placeholder = "Enter Your Gemini API Key";
        saveApiKeyBtn.textContent = "Save API Key";
        clearApiKeyBtn.textContent = "Clear API Key";
        apiKeyScreen.querySelector('p:last-of-type').textContent = "Warning: Storing API keys in the browser is not recommended for production applications.";

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
}


// --- Pendengar Acara ---
// Acara Layar Kunci API
saveApiKeyBtn.addEventListener('click', () => {
    const key = apiKeyInput.value.trim();
    if (key) {
        saveApiKey(key);
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Kunci API Kosong' : 'Empty API Key', selectedLanguage === 'id' ? 'Mohon masukkan kunci API Anda.' : 'Please enter your API key.');
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
    storyListContainer.style.display = 'grid'; // Diubah kembali ke grid
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
        selectedStoryDetails = { title, description, genres: [], subgenres: [], rating: "SU", initialCharacterMentions: [], initialPlaceMentions: [] }; // Menambahkan initialPlaceMentions
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
    selectedNameStyle = event.target.value; // Perbarui selectedNameStyle
});


continueToGameBtn.addEventListener('click', async () => {
    if (selectedMainCharacter) {
        // Panggilan AI untuk menulis ulang deskripsi cerita dengan nama MC yang dipilih dan nama tempat budaya
        const originalDescription = selectedStoryDetails.description;
        const mcName = selectedMainCharacter.name;
        const initialCharacterMentions = selectedStoryDetails.initialCharacterMentions || [];
        const initialPlaceMentions = selectedStoryDetails.initialPlaceMentions || []; // Dapatkan penyebutan tempat awal

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
        7. Strictly avoid using the names "Arya" and "Anya".`; // Menambahkan instruksi untuk menghindari nama

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


// --- Integrasi Gemini API ---

async function callGeminiAPI(prompt, schema = null, loadingElement, loadingTxtElement, loadingAdditionalElement = null, buttonToDisable) {
    if (!API_KEY) {
        showMessageBox(selectedLanguage === 'id' ? 'Kunci API Hilang' : 'API Key Missing', selectedLanguage === 'id' ? 'Mohon masukkan kunci API Gemini Anda terlebih dahulu.' : 'Please enter your Gemini API key first.');
        return null;
    }

    // Terapkan kelas loading untuk tampilan yang konsisten di semua status loading
    loadingElement.classList.add('flex', 'flex-col', 'items-center', 'justify-center', 'mt-8', 'text-gray-700', 'dark:text-gray-300');
    loadingElement.style.display = 'flex'; // Pastikan display flex diatur
    // Hapus kelas spinner/teks tertentu jika ada yang sebaris atau bertentangan
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
    console.log("Mengirim prompt ke Gemini API:", prompt);
    console.log("Payload:", payload);

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("Respons Error API:", errorData);
            throw new Error(`Kesalahan API: ${response.status} - ${errorData.error.message}`);
        }

        const result = await response.json();
        console.log("Hasil Mentah API:", result);

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const text = result.candidates[0].content.parts[0].text;
            console.log("Teks Respons API:", text);
            try {
                const parsed = schema ? JSON.parse(text) : text;
                console.log("Hasil API yang diurai:", parsed);
                return parsed;
            } catch (parseError) {
                console.error("Error mengurai respons API:", parseError, "Teks:", text);
                showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Parsing Data' : 'Error Parsing Data', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memproses data AI.' : 'Error processing AI data.'} ${selectedLanguage === 'id' ? 'Coba lagi.' : 'Please try again.'}`);
                return null;
            }
        } else {
            throw new Error(selectedLanguage === 'id' ? "Tidak ada konten yang diterima dari API atau struktur respons tidak terduga." : "No content received from API or unexpected response structure.");
        }
    } catch (error) {
        console.error("Error memanggil Gemini API:", error);
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
                "initialPlaceMentions": { // Bidang baru untuk menangkap penyebutan tempat awal
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
    const nameStyle = nameStyleSelect.value; // Dapatkan gaya nama yang dipilih
    selectedNameStyle = nameStyle; // Simpan secara global untuk penggunaan nanti

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

// --- Fungsi Bermain Game ---
async function startGame() {
    showScreen('game-screen');
    // Pastikan gameLoadingOverlay menggunakan gaya loading yang sama
    gameLoadingOverlay.classList.add('loading-indicator'); // Terapkan gaya loading dasar
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
            "prologueQuote": { "type": "STRING", "description": "Kutipan opsional yang menggugah untuk mengakhiri prolog" },
            "initialSystems": {
                "type": "OBJECT",
                "properties": {
                    "trustSystem": { "type": "STRING", "description": "Contoh: Sistem Kepercayaan (aktif)" },
                    "deathTrigger": { "type": "STRING", "description": "Contoh: Pemicu Kematian (aktif)" },
                    "flagAwal": { "type": "STRING", "description": "Contoh: Kamu menganggap permaisuri hanya beban yang harus diamati" },
                    "pathTracker": { "type": "STRING", "description": "Contoh: Bayangan di Atas Takhta" },
                    "lockedPaths": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Contoh: [\"🗡️ Ciuman Pengkhianat\", \"👑 Ikrar di Ujung Senja\"]" },
                    "notes": { "type": "STRING", "description": "Contoh: MC bisa membunuh atau menyelamatkan sang permaisuri tergantung pilihan dan kepercayaan" }
                },
                "required": ["trustSystem", "deathTrigger", "flagAwal", "pathTracker", "lockedPaths", "notes"]
            },
            "genreDetails": { "type": "STRING", "description": "Contoh: 😇 Genre, Romantis, Bodyguard Romance" },
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
    const initialPlaceMentions = selectedStoryDetails.initialPlaceMentions || []; // Dapatkan penyebutan tempat dari detail cerita

    let prompt = `Buat prolog novel visual yang menarik untuk cerita "${storyTitle}" (Deskripsi: "${storyDescription}") yang berfokus pada karakter utama ${mcName} (${mcClass}, Kepribadian: ${mcPersonality}). Prolog harus mengatur latar, memperkenalkan perspektif awal MC, dan mengisyaratkan konflik utama. Cerita memiliki rating ${rating}. Pastikan konten sepenuhnya sesuai dengan rating ini. **SANGAT HINDARI PENGGUNAAN NAMA "Arya" DAN "Anya".**

    Yang terpenting, mengingat gaya penamaan karakter adalah "${selectedNameStyle}", pastikan bahwa setiap nama tempat (kota, wilayah, provinsi, desa, landmark) yang disebutkan dalam narasi prolog atau dialog adalah *sesuai budaya* untuk gaya tersebut. Misalnya, jika "${selectedNameStyle}" adalah "chinese", gunakan nama tempat yang terdengar seperti bahasa Tiongkok (misalnya, "Provinsi Shingyei", "Kota Longjing", "Desa Wuyue"). Jika "${selectedNameStyle}" adalah "indonesian", gunakan nama tempat yang terdengar seperti bahasa Indonesia. Jika deskripsi asli berisi nama tempat tertentu seperti "Jawa Timur" atau "Desa Sukorame" (${JSON.stringify(initialPlaceMentions)}), *ganti dengan padanan yang sesuai secara budaya* berdasarkan gaya "${selectedNameStyle}". Jika tidak ada padanan yang jelas, gunakan istilah umum yang sesuai secara budaya (misalnya, "desa di Tiongkok", "kota di Jepang").

    Perkaya narasi dan deskripsi adegan:
    - Tambahkan lebih banyak detail sensorik (apa yang terlihat, terdengar, tercium, terasa) untuk membuat adegan lebih hidup.
    - Sertakan lebih banyak pikiran dan perasaan internal Karakter Utama (MC) untuk membantu pemain terhubung lebih dalam dengan MC.
    - Variasikan kecepatan narasi (pacing dinamis); beberapa paragraf bisa cepat dan berurutan untuk adegan aksi, sementara yang lain lebih lambat dan deskriptif untuk adegan reflektif atau emosional.
    - "Show, Don't Tell": Tunjukkan emosi atau situasi melalui tindakan dan deskripsi, bukan hanya menyatakan.

    Setelah narasi, sertakan status awal sistem dinamis berikut seperti yang dijelaskan oleh pengguna:
    ---
    🎮 SISTEM DINAMIS VISUAL NOVEL
    ---
    🧠 1. Sistem Kepercayaan: Setiap karakter memiliki poin kepercayaan terhadap MC. Kepercayaan bisa naik atau turun tergantung pilihan, dialog, atau tindakan. Kepercayaan tinggi membuka rahasia, jalur unik, atau akhir positif. Kepercayaan rendah dapat memicu pengkhianatan, kematian karakter, atau akhir buruk.
    🩸 2. Pemicu Kematian: MC atau karakter penting bisa mati jika pemain mengambil pilihan tertentu. Kematian bisa bersifat langsung atau karena efek berantai. Jika MC mati, cerita dianggap gagal.
    🎭 3. Flag Awal: Karakter membawa kondisi tersembunyi sejak awal (contoh: pernah dikhianati, menyimpan rahasia, trauma). Flag ini bisa terpicu oleh kata, tindakan, atau waktu tertentu. Pengaruh besar terhadap sikap awal karakter terhadap MC.
    🔒 4. Pelacak Jalur: Menampilkan jalur besar cerita yang sedang ditempuh MC (contoh: “Bayangan Di Antara Dua Mahkota”). Jalur ini bisa berganti tergantung keputusan kunci. Jalur bisa berisi sub-jalur tersembunyi.
    🕊️ 5. Jalur Cerita Terkunci Potensial: Beberapa jalur hanya terbuka jika pemain memenuhi syarat tertentu: Kepercayaan tinggi/rendah, Flag terbuka, Tindakan rahasia, DNA Keputusan khusus.
    🎯 Catatan: [Peringatan atau info penting]

    Format output secara ketat sebagai JSON sesuai dengan skema yang diberikan. Prolog harus dalam bahasa ${selectedLanguage === 'id' ? 'Indonesian' : 'English'}.

    Saat merujuk MC, gunakan "${mcName}" alih-alih "MC".
    Pastikan Flag Awal relevan dengan kepribadian MC dan premis cerita.

    Pertimbangan Rating:
    - Konten seksual eksplisit (misalnya, deskripsi grafis tindakan seksual, ketelanjangan yang bertujuan untuk membangkitkan gairah): SANGAT DILARANG.
    - Tema terkait LGBTQ+, Yuri, Yaoi, Harem, dan Reverse Harem SANGAT DILARANG.
    - Kekerasan, bahasa kasar, pembunuhan, kejahatan, tuduhan: Diizinkan hanya untuk rating 16+, 18+, dan 21+. Untuk SU dan PG-13, tema ini harus tidak ada atau sangat ringan/tersirat.
    - Untuk rating 18+: Memungkinkan kekerasan dan bahasa kasar yang lebih kuat dari 16+, dan **tema sugestif non-eksplisit (ketegangan seksual tersirat, romansa, atau situasi tanpa detail eksplisit)**.
    `;

    const prologData = await callGeminiAPI(
        prompt,
        prologSchema,
        gameLoadingOverlay,
        gameLoadingOverlay.querySelector('span'),
        gameLoadingAdditionalText,
        null // Tidak ada tombol untuk dinonaktifkan untuk loading ini
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
    gameLoadingOverlay.classList.add('loading-indicator'); // Terapkan gaya loading dasar
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
                    "mcDisplay": { "type": "STRING", "description": "Contoh: MC: Renessa – Penjaga Bayangan" },
                    "activePath": { "type": "STRING", "description": "Contoh: Jalur Aktif: Bayangan di Atas Takhta" }
                },
                "required": ["mcDisplay", "activePath"]
            },
            "chapterContent": {
                "type": "ARRAY",
                "items": {
                    "type": "OBJECT",
                    "properties": {
                        "type": { "type": "STRING", "enum": ["narrative", "dialogue"] },
                        "speaker": { "type": "STRING", "description": "Nama karakter yang berbicara. Wajib jika type adalah 'dialogue'. HARUS berupa nama karakter tertentu (misalnya, 'Permaisuri', 'Kapten Drevan', atau nama asli MC seperti 'Aldi Saputra'), BUKAN 'seseorang misterius' atau placeholder generik lainnya." },
                        "text": { "type": "STRING", "description": "Konten dialog. Teks ini HANYA boleh berisi dialog itu sendiri, tanpa 'Nama MC [Aku]:' atau 'Nama Karakter:'. Prefix ini akan ditambahkan oleh kode sisi klien. Kutipan yang dimulai dengan '> ' bisa menjadi bagian dari blok teks apa pun." }
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
                        "emote": { "type": "STRING", "description": "Karakter Emoji untuk pilihan, cth: 💖, 🛡️, 💡, 🤫" },
                        "effect": {
                            "type": "OBJECT",
                            "properties": {
                                "trustChanges": {
                                    "type": "ARRAY",
                                    "items": {
                                        "type": "OBJECT",
                                        "properties": {
                                            "characterId": { "type": "STRING" },
                                            "change": { "type": "NUMBER", "description": "Perubahan poin kepercayaan (-10 hingga +10)" }
                                        },
                                        "required": ["characterId", "change"]
                                    }
                                },
                                "newFlags": {
                                    "type": "ARRAY",
                                    "items": { "type": "STRING" },
                                    "description": "Nama flag baru yang diaktifkan"
                                },
                                "unlockPaths": {
                                    "type": "ARRAY",
                                    "items": { "type": "STRING" },
                                    "description": "Nama jalur cerita yang tidak terkunci"
                                },
                                "dnaDecision": {
                                    "type": "OBJECT",
                                    "properties": {
                                        "moral": { "type": "STRING", "enum": ["Tinggi", "Rendah", "Netral"] },
                                        "honesty": { "type": "STRING", "enum": ["Tinggi", "Rendah", "Netral"] },
                                        "empathy": { "type": "STRING", "enum": ["Tinggi", "Rendah", "Netral"] },
                                        "style": { "type": "STRING", "enum": ["Agresif", "Diplomatik", "Kritis", "Impulsif", "Observasi", "Manipulatif"] }
                                    }
                                },
                                "gameOver": { "type": "BOOLEAN", "description": "Apakah pilihan ini mengarah ke game over?" },
                                "gameOverMessage": { "type": "STRING", "description": "Pesan jika game over." },
                                "gameOverAnalysis": { "type": "STRING", "description": "Analisis jika game over." }
                            }
                        }
                    },
                    "required": ["id", "text", "emote", "effect"]
                }
            },
            "dynamicSystemUpdates": {
                "type": "OBJECT",
                "properties": {
                    "trustUpdates": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "characterId": { "type": "STRING" },
                                "change": { "type": "NUMBER" },
                                "reason": { "type": "STRING" }
                            },
                            "required": ["characterId", "change", "reason"]
                        }
                    },
                    "flagChanges": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "flagName": { "type": "STRING" },
                                "status": { "type": "BOOLEAN" },
                                "reason": { "type": "STRING" }
                            },
                            "required": ["flagName", "status", "reason"]
                        }
                    },
                    "pathUpdates": { "type": "STRING", "description": "Pembaharuan pada pelacak jalur" },
                    "notes": { "type": "STRING", "description": "Catatan baru atau yang diperbarui untuk sistem dinamis" },
                    "achievements": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "name": { "type": "STRING" },
                                "description": { "type": "STRING" }
                            },
                            "required": ["name", "description"]
                        }
                    },
                    "traumaUpdates": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "characterId": { "type": "STRING" },
                                "triggered": { "type": "BOOLEAN" },
                                "details": { "type": "STRING" }
                            },
                            "required": ["characterId", "triggered", "details"]
                        }
                    },
                    "relationshipLabelUpdates": {
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "characterId": { "type": "STRING" },
                                "label": { "type": "STRING", "description": "Contoh: Rival, Sekutu, Kekasih" }
                            },
                            "required": ["characterId", "label"]
                        }
                    },
                    "timeUpdates": {
                        "type": "OBJECT",
                        "properties": {
                            "day": { "type": "NUMBER" },
                            "partOfDay": { "type": "STRING", "enum": ["pagi", "siang", "sore", "malam"] },
                            "countdown": { "type": ["NUMBER", "NULL"] }
                        }
                    },
                    "eventUpdates": {
                        "type": "ARRAY",
                        "items": { "type": "STRING" }
                    },
                    "dnaProfileChanges": {
                        "type": "OBJECT",
                        "properties": {
                            "moral": { "type": "STRING", "enum": ["Tinggi", "Rendah", "Netral"] },
                            "honesty": { "type": "STRING", "enum": ["Tinggi", "Rendah", "Netral"] },
                            "empathy": { "type": "STRING", "enum": ["Tinggi", "Rendah", "Netral"] },
                            "style": { "type": "STRING", "enum": ["Agresif", "Diplomatik", "Kritis", "Impulsif", "Observasi", "Manipulatif"] }
                        }
                    }
                }
            }
        },
        "required": ["chapterTitle", "chapterMeta", "chapterContent", "choices", "dynamicSystemUpdates"]
    };

    const mcName = selectedMainCharacter.name;
    const mcId = selectedMainCharacter.id;
    const storyTitle = selectedStoryDetails.title;
    const storyDescription = selectedStoryDetails.description;
    const currentChapter = gameProgress.currentChapter;
    const currentScene = gameProgress.currentScene;
    const previousChoices = JSON.stringify(gameProgress.playerChoices);
    const trustPoints = JSON.stringify(gameProgress.trustPoints);
    const flagAwal = JSON.stringify(gameProgress.flagAwal);
    const pathTracker = gameProgress.pathTracker;
    const lockedPaths = JSON.stringify(gameProgress.lockedPaths);
    const dnaProfile = JSON.stringify(gameProgress.dnaProfile);
    const timeSystem = JSON.stringify(gameProgress.timeSystem);
    const traumaSystem = JSON.stringify(gameProgress.traumaSystem);
    const relationshipLabels = JSON.stringify(gameProgress.relationshipLabels);
    const generatedCharNames = generatedCharacters.map(c => c.name);

    // Kumpulan karakter yang bisa berbicara
    const speakableCharacters = generatedCharacters.map(c => ({ id: c.id, name: c.name, role: c.role }));
    const speakableCharacterNames = generatedCharNames.join(', ');

    let prompt = `Continue the visual novel story "${storyTitle}" (Description: "${storyDescription}").
    Current MC: ${mcName} (ID: ${mcId}).
    Current Chapter: ${currentChapter}, Current Scene: ${currentScene}.
    Previous Choices made by player: ${previousChoices}.
    Current Trust Points: ${trustPoints}.
    Current Initial Flags: ${flagAwal}.
    Current Path Tracker: ${pathTracker}.
    Locked Paths: ${lockedPaths}.
    Current DNA Profile: ${dnaProfile}.
    Current Time System: ${timeSystem}.
    Current Trauma System: ${traumaSystem}.
    Current Relationship Labels: ${relationshipLabels}.
    All speakable character names for this story: ${speakableCharacterNames}.
    The naming style for characters in this story is "${selectedNameStyle}".

    ${previousChoiceText ? `The player's last choice was: "${previousChoiceText}". This choice should directly influence the beginning of this new chapter/scene.` : ''}

    Generate the next part of the story (Chapter ${currentChapter}, Scene ${currentScene}) as a series of narrative and dialogue blocks, followed by exactly 2-4 choices for the player.
    Crucially, ensure that any place names (cities, regions, provinces, villages, landmarks) mentioned in the narrative or dialogue are *culturally appropriate* for the "${selectedNameStyle}" naming style. For instance, if the style is "chinese", use Chinese-sounding place names. If the original story description had specific place names, try to re-contextualize them to match this style.

    **Narrative and Dialogue Guidelines:**
    - Each narrative block should be compelling, detailing events, character actions, and environmental descriptions.
    - Dialogue blocks must accurately reflect character personalities and advance the plot.
    - Vary the pacing: include moments of high tension, calm reflection, or emotional depth.
    - Incorporate sensory details (sights, sounds, smells, feelings) to immerse the player.
    - Reveal character thoughts and emotions through their actions and internal monologues.
    - Ensure logical flow from the previous scene/choice.
    - **Speaker names in dialogue must be specific character names from the list of 'All speakable character names', NOT generic terms like 'seseorang misterius' or 'prajurit'.**
    - **STRICTLY AVOID USING THE NAMES "Arya" AND "Anya".**

    **Choices Guidelines:**
    - Provide exactly 2-4 choices per scene.
    - Each choice must have a clear text, a relevant emoji (e.g., 💖, 🛡️, 💡, 🤫), and potential effects.
    - Effects can include:
        - `trustChanges`: Array of objects {characterId, change (e.g., -10 to +10)}
        - `newFlags`: Array of strings for flags that are now 'true' (e.g., ["FlagPahlawanTersembunyi"])
        - `unlockPaths`: Array of strings for newly unlocked story paths (e.g., ["JalurRahasiaHutanKuno"])
        - `dnaDecision`: Update to MC's DNA profile {moral, honesty, empathy, style}
        - `gameOver`: boolean (true if this choice leads to immediate game over)
        - `gameOverMessage`: string (required if gameOver is true)
        - `gameOverAnalysis`: string (required if gameOver is true, explaining why)

    **Dynamic System Updates:**
    - Provide realistic and relevant updates to the dynamic systems based on the narrative and choices.
    - `trustUpdates`: Array of objects {characterId, change, reason}. Update existing trust points or introduce new ones.
    - `flagChanges`: Array of objects {flagName, status (boolean), reason}. Change existing flags or introduce new ones.
    - `pathUpdates`: String. Describe any changes to the main path tracker.
    - `notes`: String. Any important notes for the player about system status or future implications.
    - `achievements`: Array of objects {name, description}. Unlock new achievements.
    - `traumaUpdates`: Array of objects {characterId, triggered (boolean), details}. Update character trauma status.
    - `relationshipLabelUpdates`: Array of objects {characterId, label}. Update character relationship labels.
    - `timeUpdates`: Object {day, partOfDay, countdown}. Advance time, manage countdowns.
    - `eventUpdates`: Array of strings. Describe new active events.
    - `dnaProfileChanges`: Object. Describe any direct changes to MC's DNA profile.

    **Game Progression:**
    - The story should naturally progress through scenes. After approximately 2-3 scenes within a chapter (or at a narrative breakpoint), **advance the `currentChapter` in `dynamicSystemUpdates.notes`**. For example, "Catatan: Bab 2 dimulai setelah ini!" atau "Notes: Chapter 2 starts after this!"
    - If `gameProgress.currentScene` reaches 3, consider generating content for `gameProgress.currentChapter + 1`. This means the *next* prompt to the AI after `handleChoice` will be for the *new chapter*.

    Ensure the JSON output strictly adheres to the schema. The content (chapterTitle, content, choices, etc.) must be in ${selectedLanguage === 'id' ? 'Indonesian' : 'English'}.
    The overall tone and themes must remain consistent with the story's selected genres, subgenres, and rating.
    REMEMBER: No explicit sexual content. No LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem themes. Violence and harsh language only for 16+, 18+, 21+.
    (Timestamp: ${Date.now()})
    `;

    const chapterData = await callGeminiAPI(
        prompt,
        chapterSchema,
        gameLoadingOverlay,
        gameLoadingOverlay.querySelector('span'),
        gameLoadingAdditionalText,
        null
    );

    if (chapterData) {
        displayChapter(chapterData);
        gameLoadingOverlay.style.display = 'none';
        gamePlayScreen.style.display = 'flex';
        gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Bab' : 'Chapter Error', selectedLanguage === 'id' ? 'Tidak dapat menghasilkan bab. Cerita mungkin berakhir atau ada kesalahan.' : 'Could not generate chapter. Story might have ended or there was an error.');
        showScreen('game-over-screen'); // Arahkan ke game over jika chapter tidak dapat dihasilkan
    }
}

function displayChapter(chapterData) {
    chapterContentDisplay.innerHTML = `
        <div class="chapter-header-card p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 mb-6 text-center">
            <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">📖 Chapter ${gameProgress.currentChapter}: ${chapterData.chapterTitle}</h2>
            <p class="chapter-meta text-sm text-gray-600 dark:text-gray-400">${chapterData.chapterMeta.mcDisplay}</p>
            <p class="chapter-meta text-sm text-gray-600 dark:text-gray-400">${chapterData.chapterMeta.activePath}</p>
        </div>
        <div class="narrative-content w-full">
            ${chapterData.chapterContent.map(block => {
                if (block.type === 'narrative') {
                    return `<p class="text-gray-700 dark:text-gray-300 text-base leading-relaxed mb-4 text-justify">${block.text}</p>`;
                } else if (block.type === 'dialogue') {
                    const speakerName = block.speaker.trim();
                    const isMC = (speakerName === selectedMainCharacter.name);
                    const dialogueClass = isMC ? 'mc-dialogue-card' : 'other-dialogue-card';
                    const displayedSpeaker = isMC ? `${selectedMainCharacter.name} [Aku]` : speakerName;
                    return `
                        <div class="character-dialogue-card ${dialogueClass} p-4 rounded-lg shadow-sm border border-gray-300 dark:border-gray-600 mb-4">
                            <strong class="speaker-name text-gray-900 dark:text-gray-100">${displayedSpeaker}:</strong>
                            <span class="text-gray-700 dark:text-gray-300">${block.text}</span>
                        </div>
                    `;
                }
                return '';
            }).join('')}
        </div>
    `;
    chapterContentDisplay.style.display = 'block';
    prologContentDisplay.style.display = 'none';

    renderDynamicSystems(chapterData.dynamicSystemUpdates);
    renderChoices(chapterData.choices);
}

function renderDynamicSystems(updates, isProlog = false) {
    dynamicSystemsDisplay.innerHTML = `
        <h3 class="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 text-center">🎮 Sistem Aktif:</h3>
    `;

    // Trust System
    let trustHtml = `<p class="system-item mb-2"><span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🧠 Sistem Kepercayaan:</span>`;
    if (Object.keys(gameProgress.trustPoints).length > 0) {
        trustHtml += `<ul class="list-disc list-inside ml-4 mt-1">`;
        for (const charId in gameProgress.trustPoints) {
            const character = generatedCharacters.find(c => c.id === charId);
            if (character) {
                const trustValue = gameProgress.trustPoints[charId];
                let trustColorClass = 'text-amber-500'; // Netral
                if (trustValue >= 70) trustColorClass = 'text-green-500'; // Tinggi
                else if (trustValue <= 30) trustColorClass = 'text-red-500'; // Rendah
                trustHtml += `<li class="text-sm text-gray-700 dark:text-gray-300">- ${character.name}: <span class="${trustColorClass}">${trustValue}</span></li>`;
            }
        }
        trustHtml += `</ul>`;
    } else {
        trustHtml += ` Tidak ada data kepercayaan.`;
    }
    trustHtml += `</p>`;
    dynamicSystemsDisplay.innerHTML += trustHtml;

    // Death Trigger
    const deathTriggerP = document.createElement('p');
    deathTriggerP.className = 'system-item mb-2';
    deathTriggerP.innerHTML = `<span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🩸 Pemicu Kematian:</span> ${updates.deathTrigger || 'Aktif'}`;
    dynamicSystemsDisplay.appendChild(deathTriggerP);

    // Flag Awal
    let flagHtml = `<p class="system-item mb-2"><span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🎭 Flag Awal:</span>`;
    if (Object.keys(gameProgress.flagAwal).length > 0) {
        flagHtml += `<ul class="list-disc list-inside ml-4 mt-1">`;
        for (const flagName in gameProgress.flagAwal) {
            const flagStatus = gameProgress.flagAwal[flagName];
            flagHtml += `<li class="text-sm text-gray-700 dark:text-gray-300">- ${flagName}: ${flagStatus ? 'Aktif' : 'Tidak Aktif'}</li>`;
        }
        flagHtml += `</ul>`;
    } else {
        flagHtml += ` Tidak ada flag aktif.`;
    }
    flagHtml += `</p>`;
    dynamicSystemsDisplay.innerHTML += flagHtml;

    // Path Tracker
    const pathTrackerP = document.createElement('p');
    pathTrackerP.className = 'system-item mb-2';
    pathTrackerP.innerHTML = `<span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🔒 Pelacak Jalur:</span> ${gameProgress.pathTracker}`;
    dynamicSystemsDisplay.appendChild(pathTrackerP);

    // Locked Paths
    const lockedPathsP = document.createElement('p');
    lockedPathsP.className = 'system-item mb-2';
    lockedPathsP.innerHTML = `<span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🕊️ Jalur Cerita Terkunci Potensial:</span> ${gameProgress.lockedPaths.length > 0 ? gameProgress.lockedPaths.join(', ') : 'Tidak ada'}`;
    dynamicSystemsDisplay.appendChild(lockedPathsP);

    // Achievements
    let achievementsHtml = `<p class="system-item mb-2"><span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🏆 Pencapaian:</span>`;
    if (gameProgress.achievements.length > 0) {
        achievementsHtml += `<ul class="list-disc list-inside ml-4 mt-1">`;
        gameProgress.achievements.forEach(achievement => {
            achievementsHtml += `<li class="text-sm text-gray-700 dark:text-gray-300">- ${achievement.name}: ${achievement.description}</li>`;
        });
        achievementsHtml += `</ul>`;
    } else {
        achievementsHtml += ` Belum ada pencapaian.`;
    }
    achievementsHtml += `</p>`;
    dynamicSystemsDisplay.innerHTML += achievementsHtml;

    // Trauma System
    let traumaHtml = `<p class="system-item mb-2"><span class="system-title text-gray-800 dark:text-gray-200 font-semibold">💔 Sistem Trauma:</span>`;
    if (Object.keys(gameProgress.traumaSystem).length > 0) {
        traumaHtml += `<ul class="list-disc list-inside ml-4 mt-1">`;
        for (const charId in gameProgress.traumaSystem) {
            const character = generatedCharacters.find(c => c.id === charId);
            if (character) {
                const traumaStatus = gameProgress.traumaSystem[charId];
                traumaHtml += `<li class="text-sm text-gray-700 dark:text-gray-300">- ${character.name}: ${traumaStatus.triggered ? `Terpicu (${traumaStatus.details})` : 'Tidak Terpicu'}</li>`;
            }
        }
        traumaHtml += `</ul>`;
    } else {
        traumaHtml += ` Tidak ada trauma aktif.`;
    }
    traumaHtml += `</p>`;
    dynamicSystemsDisplay.innerHTML += traumaHtml;

    // Relationship Labels
    let relationshipHtml = `<p class="system-item mb-2"><span class="system-title text-gray-800 dark:text-gray-200 font-semibold">💞 Label Hubungan:</span>`;
    if (Object.keys(gameProgress.relationshipLabels).length > 0) {
        relationshipHtml += `<ul class="list-disc list-inside ml-4 mt-1">`;
        for (const charId in gameProgress.relationshipLabels) {
            const character = generatedCharacters.find(c => c.id === charId);
            if (character) {
                const label = gameProgress.relationshipLabels[charId];
                relationshipHtml += `<li class="text-sm text-gray-700 dark:text-gray-300">- ${character.name}: ${label}</li>`;
            }
        }
        relationshipHtml += `</ul>`;
    } else {
        relationshipHtml += ` Tidak ada label hubungan.`;
    }
    relationshipHtml += `</p>`;
    dynamicSystemsDisplay.appendChild(relationshipHtml);

    // Time System
    const timeSystemP = document.createElement('p');
    timeSystemP.className = 'system-item mb-2';
    timeSystemP.innerHTML = `<span class="system-title text-gray-800 dark:text-gray-200 font-semibold">⏰ Sistem Waktu:</span> Hari ${gameProgress.timeSystem.day}, ${gameProgress.timeSystem.partOfDay}${gameProgress.timeSystem.countdown !== null ? `, Hitung Mundur: ${gameProgress.timeSystem.countdown}` : ''}`;
    dynamicSystemsDisplay.appendChild(timeSystemP);

    // DNA Profile
    const dnaProfileP = document.createElement('p');
    dnaProfileP.className = 'system-item mb-2';
    dnaProfileP.innerHTML = `
        <span class="system-title text-gray-800 dark:text-gray-200 font-semibold">🧬 DNA Profil MC:</span>
        <ul class="list-disc list-inside ml-4 mt-1">
            <li class="text-sm text-gray-700 dark:text-gray-300">- Moral: <span class="${getDnaColorClass(gameProgress.dnaProfile.moral)}">${gameProgress.dnaProfile.moral}</span></li>
            <li class="text-sm text-gray-700 dark:text-gray-300">- Kejujuran: <span class="${getDnaColorClass(gameProgress.dnaProfile.honesty)}">${gameProgress.dnaProfile.honesty}</span></li>
            <li class="text-sm text-gray-700 dark:text-gray-300">- Empati: <span class="${getDnaColorClass(gameProgress.dnaProfile.empathy)}">${gameProgress.dnaProfile.empathy}</span></li>
            <li class="text-sm text-gray-700 dark:text-gray-300">- Gaya: <span class="${getDnaColorClass(gameProgress.dnaProfile.style)}">${gameProgress.dnaProfile.style}</span></li>
        </ul>
    `;
    dynamicSystemsDisplay.appendChild(dnaProfileP);

    // Notes
    if (updates.notes) {
        const notesP = document.createElement('p');
        notesP.className = 'system-item text-gray-700 dark:text-gray-200 mt-2 text-sm';
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

    // Perbarui gameProgress berdasarkan efek pilihan
    if (choice.effect) {
        if (choice.effect.trustChanges) {
            choice.effect.trustChanges.forEach(tc => {
                gameProgress.trustPoints[tc.characterId] = (gameProgress.trustPoints[tc.characterId] || 0) + tc.change;
                // Pastikan nilai kepercayaan tidak melebihi 100 atau kurang dari 0
                gameProgress.trustPoints[tc.characterId] = Math.max(0, Math.min(100, gameProgress.trustPoints[tc.characterId]));
            });
        }
        if (choice.effect.newFlags) {
            choice.effect.newFlags.forEach(flag => {
                gameProgress.flagAwal[flag] = true;
            });
        }
        if (choice.effect.unlockPaths) {
            choice.effect.unlockPaths.forEach(path => {
                if (!gameProgress.lockedPaths.includes(path)) {
                    gameProgress.lockedPaths.push(path); // Atau hapus dari lockedPaths jika itu adalah daftar jalur yang terkunci
                }
            });
        }
        if (choice.effect.dnaDecision) {
            Object.assign(gameProgress.dnaProfile, choice.effect.dnaDecision);
        }
        if (choice.effect.gameOver) {
            showGameOver(choice.effect.gameOverMessage, choice.effect.gameOverAnalysis);
            return;
        }
    }

    gameProgress.currentScene++;

    // Logika untuk beralih bab
    // Jika sudah melewati 3 adegan dalam bab saat ini, atau jika ini adalah akhir bab secara naratif (disesuaikan berdasarkan kebutuhan cerita)
    // AI akan diberikan instruksi untuk secara otomatis meningkatkan nomor bab di "notes" jika mencapai titik naratif yang sesuai.
    // Kita akan memeriksa notes yang terakhir diberikan oleh AI di renderDynamicSystems atau chapterData.dynamicSystemUpdates.notes.
    // Untuk tujuan demonstrasi dan memastikan progres, kita akan memaksakan perpindahan bab setiap 3 adegan.
    if (gameProgress.currentScene > 3) {
        gameProgress.currentChapter++;
        gameProgress.currentScene = 1; // Reset adegan untuk bab baru
        showMessageBox(selectedLanguage === 'id' ? 'Bab Baru!' : 'New Chapter!', `${selectedLanguage === 'id' ? 'Anda telah memasuki Bab ' : 'You have entered Chapter '}${gameProgress.currentChapter}!`);
    }

    choiceContainer.innerHTML = '';
    gameLoadingOverlay.classList.add('loading-indicator'); // Apply base loading styles
    gameLoadingOverlay.style.display = 'flex';

    await generateChapter(gameProgress.currentChapter, choice.text);
}


function renderChoices(choices) {
    choiceContainer.innerHTML = '';
    choices.forEach(choice => {
        const choiceCard = document.createElement('button');
        choiceCard.className = 'choice-card btn btn-secondary w-full py-3 text-lg font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out flex items-center justify-center text-left';
        choiceCard.innerHTML = `<span class="choice-emote mr-3">${choice.emote}</span> ${choice.text}`;
        choiceCard.addEventListener('click', () => handleChoice(choice));
        choiceContainer.appendChild(choiceCard);
    });
}

function showGameOver(message, analysis) {
    gameOverMessage.textContent = message;
    gameOverAnalysis.textContent = analysis;
    showScreen('game-over-screen');
}


// --- Initialization ---
window.onload = () => {
    API_KEY = getApiKey();
    if (API_KEY) {
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showScreen('api-key-screen');
        setMainButtonsEnabled(false);
    }
    updateLanguageText(); // Perbarui teks bahasa saat memuat
};



