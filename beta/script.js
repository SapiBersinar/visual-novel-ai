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

const continueToCharacterSelectionBtn = document.getElementById('continue-to-character-selection-btn');
const backFromAiResultsBtn = document.getElementById('back-from-ai-results-btn');

const characterCreationScreen = document.getElementById('character-creation-screen');
const numCharactersSelect = document.getElementById('num-characters-select');
const characterClassInput = document.getElementById('character-class-input');
const nameStyleSelect = document.getElementById('name-style-select'); 
const generateCharactersBtn = document.getElementById('generate-characters-btn');
const backToStorySelectBtn = document.getElementById('back-to-story-select-btn');
const loadingCharacters = document.getElementById('loading-characters');
const loadingCharsText = document.getElementById('loading-chars-text');
const loadingAdditionalTextChars = document.getElementById('loading-additional-text-chars');
const characterResultsDiv = document.getElementById('character-results');
const mcSelectionHeading = document.getElementById('mc-selection-heading');
const characterActionButtons = document.getElementById('character-action-buttons');
const continueToGameBtn = document.getElementById('continue-to-game-btn');
const regenerateCharactersBtn = document.getElementById('regenerate-characters-btn');

const summaryScreen = document.getElementById('summary-screen');
const finalSummaryTitle = document.getElementById('final-summary-title');
const finalSummaryDescription = document.getElementById('final-summary-description');
const finalSummaryGenres = document.getElementById('final-summary-genres');
const finalSummarySubgenres = document.getElementById('final-summary-subgenres');
const finalMcNameClass = document.getElementById('final-mc-name-class');
const finalMcPersonality = document.getElementById('final-mc-personality');
const finalMcDescription = document.getElementById('final-mc-description');
const startGameBtn = document.getElementById('start-game-btn');
const backFromSummaryBtn = document.getElementById('back-from-summary-btn');

const gameScreen = document.getElementById('game-screen');
const gameLoadingOverlay = document.getElementById('game-loading-overlay');
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
                screen.style.display = 'block';
            } else {
                screen.style.display = 'none';
            }
        }
    });
}

function showMessageBox(title, message) {
    messageBoxTitle.textContent = title;
    messageBoxContent.textContent = message;
    customMessageBox.style.display = 'block';
}

// Enable/disable main buttons
function setMainButtonsEnabled(enabled) {
    manualInputBtn.disabled = !enabled;
    aiGenerateBtn.disabled = !enabled;
}

// --- API Key Management ---
function getApiKey() {
    return localStorage.getItem('geminiApiKey');
}

function saveApiKey(key) {
    localStorage.setItem('geminiApiKey', key);
    API_KEY = key; // Update the global API_KEY variable
}

function clearApiKey() {
    localStorage.removeItem('geminiApiKey');
    API_KEY = ""; // Clear global API_KEY
    showMessageBox(selectedLanguage === 'id' ? 'Kunci API Dihapus' : 'API Key Cleared', selectedLanguage === 'id' ? 'Kunci API telah dihapus dari browser Anda. Silakan masukkan kunci baru.' : 'API Key has been cleared from your browser. Please enter a new key.');
    // Reload or redirect to API key input screen
    location.reload(); 
}

// --- Theme Toggling ---
function toggleTheme() {
    const body = document.body;
    let currentTheme = body.className;

    if (currentTheme === 'light-theme') {
        body.className = 'dark-theme';
        localStorage.setItem('theme', 'dark-theme');
    } else if (currentTheme === 'dark-theme') {
        body.className = 'eye-protection-theme';
        localStorage.setItem('theme', 'eye-protection-theme');
    } else {
        body.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    }
    updateThemeToggleButtonText();
}

function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = storedTheme;
    updateThemeToggleButtonText();
}

function updateThemeToggleButtonText() {
    const currentTheme = document.body.className;
    if (selectedLanguage === 'id') {
        if (currentTheme === 'light-theme') {
            themeToggleIcon.className = 'fas fa-moon';
            themeToggleText.textContent = 'Mode Gelap';
        } else if (currentTheme === 'dark-theme') {
            themeToggleIcon.className = 'fas fa-sun';
            themeToggleText.textContent = 'Mode Terang';
        } else if (currentTheme === 'eye-protection-theme') {
            themeToggleIcon.className = 'fas fa-eye';
            themeToggleText.textContent = 'Mode Perlindungan Mata';
        }
    } else { // English
        if (currentTheme === 'light-theme') {
            themeToggleIcon.className = 'fas fa-moon';
            themeToggleText.textContent = 'Dark Mode';
        } else if (currentTheme === 'dark-theme') {
            themeToggleIcon.className = 'fas fa-sun';
            themeToggleText.textContent = 'Light Mode';
        } else if (currentTheme === 'eye-protection-theme') {
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
    storyListContainer.style.display = 'block';
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
    // Reset character creation screen state
    numCharactersSelect.value = 'ai-recommended';
    characterClassInput.value = '';
    characterClassInput.style.display = 'none';
    characterResultsDiv.innerHTML = '';
    mcSelectionHeading.style.display = 'none';
    characterActionButtons.style.display = 'none';
    generatedCharacters = [];
    selectedMainCharacter = null;
});

backFromSummaryBtn.addEventListener('click', () => {
    showScreen('character-creation-screen');
    // Re-display only potential MCs if they were generated before
    const potentialMCs = generatedCharacters.filter(char => char.isPotentialMC);
    if (potentialMCs.length > 0) {
        mcSelectionHeading.style.display = 'block';
        characterActionButtons.style.display = 'flex';
        characterResultsDiv.innerHTML = ''; // Clear current display
        potentialMCs.forEach(char => {
            const charCard = document.createElement('div');
            charCard.className = 'character-card potential-mc';
            charCard.dataset.characterId = char.id;
            charCard.innerHTML = `
                <h2><span class="icon-placeholder">✨</span> ${char.name}</h2>
                <p><span class="char-detail">${selectedLanguage === 'id' ? 'Kelas' : 'Class'}:</span> ${char.class}</p>
                <p><span class="char-detail">${selectedLanguage === 'id' ? 'Peran' : 'Role'}:</span> ${char.role}</p>
                <p><span class="char-detail">${selectedLanguage === 'id' ? 'Sifat' : 'Personality'}:</span> ${char.personality}</p>
                <p><span class="char-detail">${selectedLanguage === 'id' ? 'Tentang' : 'About'}:</span> ${char.description}</p>
            `;
            characterResultsDiv.appendChild(charCard);
            addCharacterCardEventListener(charCard, char);

            // Re-apply selected state if this character was the MC
            if (selectedMainCharacter && selectedMainCharacter.id === char.id) {
                charCard.classList.add('selected-mc');
                charCard.style.backgroundColor = 'var(--char-card-selected-bg)'; // Use CSS variable
                const iconSpan = charCard.querySelector('.icon-placeholder');
                if (iconSpan) iconSpan.textContent = '😇';
            }
        });
    }
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
        mainScreen.querySelector('h1').textContent = "Cerita Komik Interaktif";
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
        // Update "Other" option for genre select
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
        characterCreationScreen.querySelector('p').textContent = "Anda dapat menentukan jumlah karakter atau membiarkan AI merekomendasikannya.";
        numCharactersSelect.options[0].textContent = "Pilihan ditentukan dari judul dan deskripsi oleh AI (rekomendasi)";
        // Dynamically update options for numCharactersSelect
        for (let i = 0; i < numCharactersSelect.options.length; i++) {
            if (numCharactersSelect.options[i].value !== 'ai-recommended') {
                numCharactersSelect.options[i].textContent = `${numCharactersSelect.options[i].value} Karakter`;
            }
        }
        characterClassInput.placeholder = "Kelas Karakter (opsional, cth: Pahlawan)";
        // Update new name style options
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
        summaryScreen.querySelector('.summary-section:nth-of-type(1) h2').textContent = "Judul Cerita";
        summaryScreen.querySelector('.summary-section:nth-of-type(1) p:nth-of-type(2)').previousElementSibling.textContent = "Deskripsi Cerita";
        summaryScreen.querySelector('.summary-section:nth-of-type(2) h2').textContent = "Karakter Utama (MC)";
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
        mainScreen.querySelector('h1').textContent = "Interactive Comic Story";
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
        // Update "Other" option for genre select
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
        characterCreationScreen.querySelector('p').textContent = "You can determine the number of characters or let AI recommend it.";
        numCharactersSelect.options[0].textContent = "AI-determined from title and description (recommended)";
        // Dynamically update options for numCharactersSelect
        for (let i = 0; i < numCharactersSelect.options.length; i++) {
            if (numCharactersSelect.options[i].value !== 'ai-recommended') {
                numCharactersSelect.options[i].textContent = `${numCharactersSelect.options[i].value} Characters`;
            }
        }
        characterClassInput.placeholder = "Character Class (optional, e.g., Hero)";
        // Update new name style options
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
        summaryScreen.querySelector('.summary-section:nth-of-type(1) h2').textContent = "Story Title";
        summaryScreen.querySelector('.summary-section:nth-of-type(1) p:nth-of-type(2)').previousElementSibling.textContent = "Story Description";
        summaryScreen.querySelector('.summary-section:nth-of-type(2) h2').textContent = "Main Character (MC)";
        startGameBtn.textContent = "Start Game";
        backFromSummaryBtn.textContent = "Back";

        gameLoadingOverlay.querySelector('span').textContent = "Loading story...";
        gameLoadingAdditionalText.textContent = "Please wait, AI is processing.";
        startRealStoryBtn.textContent = "Start the real story";
        
        gameOverScreen.querySelector('h1').textContent = "💀 GAME OVER 💀";
        retryGameBtn.textContent = "Retry";
        backToMainMenuBtn.textContent = "Back to Main Menu";
    }
    updateThemeToggleButtonText(); // Update button text after language change
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
        // Reset select to AI-recommended
        numCharactersSelect.value = 'ai-recommended'; 
        characterClassInput.value = ''; // Clear optional class input
        characterClassInput.style.display = 'none'; // Ensure it's hidden
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Silakan pilih cerita terlebih dahulu.' : 'Please select a story first.');
    }
});

continueManualBtn.addEventListener('click', () => {
    const title = manualTitleInput.value.trim();
    const description = manualDescriptionInput.value.trim();
    if (title && description) {
        selectedStoryDetails = { title, description, genres: [], subgenres: [] };
        showScreen('character-creation-screen');
        characterResultsDiv.innerHTML = '';
        mcSelectionHeading.style.display = 'none';
        characterActionButtons.style.display = 'none';
        generatedCharacters = [];
        selectedMainCharacter = null;
        // Reset select to AI-recommended
        numCharactersSelect.value = 'ai-recommended'; 
        characterClassInput.value = ''; // Clear optional class input
        characterClassInput.style.display = 'none'; // Ensure it's hidden
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Input Tidak Lengkap' : 'Incomplete Input', selectedLanguage === 'id' ? 'Mohon isi Judul Cerita dan Deskripsi Cerita.' : 'Please fill in both Story Title and Story Description.');
    }
});

generateAiBtn.addEventListener('click', generateStoryContent);
generateCharactersBtn.addEventListener('click', generateCharacters);
regenerateCharactersBtn.addEventListener('click', generateCharacters);

continueToGameBtn.addEventListener('click', () => {
    if (selectedMainCharacter) {
        finalSummaryTitle.textContent = selectedStoryDetails.title;
        finalSummaryDescription.textContent = selectedStoryDetails.description;
        finalSummaryGenres.textContent = selectedStoryDetails.genres.join(', ');
        finalSummarySubgenres.textContent = selectedStoryDetails.subgenres.join(', ');

        finalMcNameClass.innerHTML = `<span class="selected-angel-icon">😇</span> ${selectedMainCharacter.name} (${selectedMainCharacter.class})`;
        finalMcPersonality.textContent = selectedMainCharacter.personality;
        finalMcDescription.textContent = selectedMainCharacter.description;

        showScreen('summary-screen');
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Mohon pilih minimal 1 Karakter Utama (MC).' : 'Please select at least 1 Main Character (MC).');
    }
});

startGameBtn.addEventListener('click', startGame);

startRealStoryBtn.addEventListener('click', startChapter1); // New event listener for the "Start Real Story" button

// These buttons are for the full game functionality which is not included in this iteration
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

// Event listener for the new character count select
numCharactersSelect.addEventListener('change', () => {
    // If "AI-recommended" is selected, hide the manual character class input
    if (numCharactersSelect.value === 'ai-recommended') {
        characterClassInput.style.display = 'none';
        characterClassInput.value = ''; // Clear input if hidden
    } else {
        // Otherwise, show it if they want to manually specify a class for a fixed number of characters
        characterClassInput.style.display = 'block';
    }
});

// Theme toggle button event listener
themeToggleButton.addEventListener('click', toggleTheme);

// --- Gemini API Integration ---

async function callGeminiAPI(prompt, schema = null, loadingElement, loadingTxtElement, loadingAdditionalElement = null, buttonToDisable) {
    // Check if API_KEY is available
    if (!API_KEY) {
        showMessageBox(selectedLanguage === 'id' ? 'Kunci API Hilang' : 'API Key Missing', selectedLanguage === 'id' ? 'Mohon masukkan kunci API Gemini Anda terlebih dahulu.' : 'Please enter your Gemini API key first.');
        return null;
    }

    loadingElement.style.display = 'flex';
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

    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`;
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
                showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Parsing Data' : 'Error Parsing Data', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memproses data AI.' : 'Error processing AI data.'} ${selectedLanguage === 'id' ? 'Coba lagi.' : 'Please try again.'}`);
                return null;
            }
        } else {
            throw new Error(selectedLanguage === 'id' ? "Tidak ada konten yang diterima dari API atau struktur respons tidak terduga." : "No content received from API atau struktur respons tidak terduga.");
        }
    } catch (error) {
        console.error("Kesalahan memanggil Gemini API:", error);
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan API' : 'API Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memanggil API Gemini:' : 'Error calling Gemini API:'} ${error.message}`);
        return null;
    } finally {
         loadingElement.style.display = 'none';
         if (buttonToDisable) buttonToDisable.disabled = false;
         if (loadingAdditionalElement) clearTimeout(loadingTimeout); // Clear timeout on completion
         if (loadingAdditionalElement) loadingAdditionalElement.style.display = 'none'; // Hide if shown
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
                }
            },
            "required": ["title", "description", "genres", "subgenres"]
        }
    };
    
    let prompt = `Generate ${numStories} *new and unique* visual novel story ideas. For each idea, provide:
    - A compelling story title.
    - A concise and intriguing story description (focus on premise, conflict, or theme).
    - A list of relevant genres, including "${selectedGenre}".
    - A list of relevant subgenres.
    IMPORTANT: Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes.
    Ensure the output is in JSON format according to the schema. Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} language. (Random seed: ${Math.random()})`;


    if (selectedSubgenre && selectedSubgenre !== (selectedLanguage === 'id' ? 'Pilih Subgenre' : 'Select Subgenre')) {
        prompt += ` Prioritize subgenre "${selectedSubgenre}" if relevant.`;
    }

    const stories = await callGeminiAPI(prompt, storySchema, loadingAi, loadingText, loadingAdditionalText, generateAiBtn);

    if (stories && stories.length > 0) {
        const filteredStories = stories.slice(0, numStories);

        showScreen('ai-results-screen');
        storyListContainer.style.display = 'block';
        
        filteredStories.forEach((story) => {
            const storyCard = document.createElement('div');
            storyCard.className = 'story-card';
            storyCard.dataset.story = JSON.stringify(story);
            storyCard.innerHTML = `
                <h2>${story.title}</h2>
                <p>${story.description}</p>
                <p class="genre">✨ ${selectedLanguage === 'id' ? 'Genre' : 'Genre'}: ${story.genres.join(', ')}</p>
                <p class="genre">✨ ${selectedLanguage === 'id' ? 'Subgenre' : 'Subgenre'}: ${story.subgenres.join(', ')}</p>
                <button class="button select-story-btn">${selectedLanguage === 'id' ? 'Pilih Ini' : 'Select This'}</button>
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
    
    const prompt = `Provide a list of 5-10 relevant subgenres for the main genre "${mainGenre}". Do NOT include any subgenres or themes related to explicit content, sexual content, LGBTQ+, Yuri, Yaoi, Harem, Reverse Harem, or any mature/adult themes. Ensure the output is in JSON array of strings format. Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} language.`;
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
    generatedCharacters = []; // Clear previous characters

    let numChars;
    const selectedNumOption = numCharactersSelect.value;
    const charClassHint = characterClassInput.value.trim();
    const nameStyle = nameStyleSelect.value; 

    // Determine numChars based on selection
    if (selectedNumOption === 'ai-recommended') {
        numChars = Math.floor(Math.random() * (7 - 3 + 1)) + 3; // Random between 3 and 7 for AI to generate
        console.log("AI-recommended numChars:", numChars);
    } else {
        numChars = parseInt(selectedNumOption);
    }

    if (isNaN(numChars) || numChars < 3 || numChars > 7) {
        showMessageBox(selectedLanguage === 'id' ? 'Input Tidak Valid' : 'Invalid Input', selectedLanguage === 'id' ? 'Jumlah karakter harus antara 3 dan 7 atau ditentukan AI.' : 'Number of characters must be between 3 and 7 or AI-determined.');
        return;
    }
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
                "role": { "type": "STRING" }, // New: Role of the character
                "isPotentialMC": { "type": "BOOLEAN" } // New: Is it a potential Main Character?
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
    // Potential MC roles for AI to prioritize assigning isPotentialMC: true
    const potentialMCRoles = ["Protagonis", "Antihero", "The Chosen One", "The Outcast", "The Rebel", "The Avenger", "The Legend"];


    let prompt = `Generate exactly ${numChars} *new and distinct* characters for a visual novel based on the following story:
    Title: "${selectedStoryDetails.title}"
    Description: "${selectedStoryDetails.description}".`;

    if (selectedStoryDetails.genres.length > 0) {
        prompt += ` Main genres: ${selectedStoryDetails.genres.join(', ')}.`;
    }
    if (selectedStoryDetails.subgenres.length > 0) {
        prompt += ` Subgenres: ${selectedStoryDetails.subgenres.join(', ')}.`;
    }

    prompt += `
    For each character, provide:
    - "id": a short unique string (e.g., "char1", "char2")
    - "name": full name. MUST NOT be "seseorang misterius" or any generic placeholder. Use actual names.
    - "class": character role/archetype (e.g., Hero, Mage, King, Guard).
    - "personality": 3-5 descriptive keywords (e.g., brave, loyal, cunning, melancholic, resourceful)
    - "description": a brief role/background in the story (e.g., "The exiled prince seeking his throne", "A mysterious mage from the enchanted forest").
    - "role": Assign a *distinct* narrative role from the following list or similar archetypes: ${rolesList.join(', ')}. Ensure roles are varied, relevant to the story, and unique among the generated characters.
    - "isPotentialMC": boolean. Set to true for 1 to 3 characters that would make a good main protagonist for the story. These characters MUST be highly relevant and suitable as the main protagonist for the story title "${selectedStoryDetails.title}" and description "${selectedStoryDetails.description}". Prioritize roles like Protagonist, Antihero, The Chosen One. The rest should be false.

    Ensure names are unique and in Latin alphabet.`;

    if (charClassHint && numCharactersSelect.value !== 'ai-recommended') { // Only add if input is visible and has value
        prompt += ` One character should ideally have the class: "${charClassHint}".`;
    } else if (numCharactersSelect.value === 'ai-recommended') {
        prompt += ` Ensure varied character classes are generated automatically by AI.`;
    }
    // Add naming style instruction
    switch (nameStyle) {
        case 'japanese':
            prompt += ` Character names should sound Japanese.`;
            break;
        case 'chinese':
            prompt += ` Character names should sound Chinese (e.g., Zhuo Jong).`;
            break;
        case 'arabic':
            prompt += ` Character names should sound Arabic.`;
            break;
        case 'fantasy':
            prompt += ` Character names should sound genuinely fantastical, unique, and not like common real-world or Indonesian names. For example, use names like 'Elara', 'Kaelen', 'Thorian', 'Lyra', 'Zephyr'.`;
            break;
        case 'european_medieval':
            prompt += ` Character names should sound like European Medieval names (e.g., Arthur, Eleanor, Geoffrey).`;
            break;
        case 'celtic':
            prompt += ` Character names should sound like Celtic names (e.g., Aoife, Cormac, Deirdre).`;
            break;
        case 'norse':
            prompt += ` Character names should sound like Norse names (e.g., Bjorn, Freya, Ragnar).`;
            break;
        case 'ancient_egyptian':
            prompt += ` Character names should sound like Ancient Egyptian names (e.g., Nefertari, Ramses, Imhotep).`;
            break;
        case 'indonesian':
            prompt += ` Character names should sound like common Indonesian names (e.g., Budi, Siti, Rahmat, Indah).`;
            break;
        case 'german':
            prompt += ` Character names should sound like common German names (e.g., Hans, Gretel, Klaus, Sofia).`;
            break;
        default: // 'random' or any other default
            prompt += ` Character names should be diverse (e.g., Western, Asian, Middle Eastern, Fantasy-inspired).`;
            break;
    }
    prompt += ` Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} language for personality, description, class, and role values.`;
    prompt += ` Ensure the output is a JSON array containing exactly ${numChars} character objects.`;
    prompt += ` (Timestamp: ${Date.now()})`;


    generatedCharacters = await callGeminiAPI(prompt, charSchema, loadingCharacters, loadingCharsText, loadingAdditionalTextChars, generateCharactersBtn);


    if (generatedCharacters && generatedCharacters.length > 0) {
        // Ensure we only use the number of characters explicitly requested or randomly determined by us
        // We keep all generated characters in `generatedCharacters` global variable
        // but only display potential MCs
        generatedCharacters = generatedCharacters.slice(0, numChars); // Trim if AI generates more than requested/randomly chosen

        const potentialMCs = generatedCharacters.filter(char => char.isPotentialMC);
        // No need to separate otherCharacters for display on this screen. They are in generatedCharacters.

        mcSelectionHeading.style.display = 'block';
        characterActionButtons.style.display = 'flex';
        characterResultsDiv.innerHTML = ''; // Clear previous display


        if (potentialMCs.length > 0) {
            const mcCandidatesTitle = document.createElement('h3');
            mcCandidatesTitle.className = 'text-xl font-bold mt-4 mb-3 text-center text-gray-700';
            mcCandidatesTitle.textContent = selectedLanguage === 'id' ? 'Pilih Karakter Utama Anda:' : 'Select Your Main Character:';
            characterResultsDiv.appendChild(mcCandidatesTitle);


            potentialMCs.forEach(char => {
                const charCard = document.createElement('div');
                charCard.className = 'character-card potential-mc'; // Add a class for styling potential MCs
                charCard.dataset.characterId = char.id;
                charCard.innerHTML = `
                    <h2><span class="icon-placeholder">✨</span> ${char.name}</h2>
                    <p><span class="char-detail">${selectedLanguage === 'id' ? 'Kelas' : 'Class'}:</span> ${char.class}</p>
                    <p><span class="char-detail">${selectedLanguage === 'id' ? 'Peran Awal' : 'Initial Role'}:</span> ${char.role}</p>
                    <p><span class="char-detail">${selectedLanguage === 'id' ? 'Sifat' : 'Personality'}:</span> ${char.personality}</p>
                    <p><span class="char-detail">${selectedLanguage === 'id' ? 'Tentang' : 'About'}:</span> ${char.description}</p>
                `;
                characterResultsDiv.appendChild(charCard);
                addCharacterCardEventListener(charCard, char);
            });
        } else {
            // Fallback if no potential MCs were generated (shouldn't happen with good prompt)
            showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Kandidat MC' : 'No MC Candidates', selectedLanguage === 'id' ? 'AI tidak dapat mengidentifikasi kandidat karakter utama. Coba lagi atau sesuaikan prompt.' : 'AI could not identify main character candidates. Try again or adjust the prompt.');
        }

    } else {
         showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Karakter' : 'No Characters', selectedLanguage === 'id' ? 'AI tidak dapat menghasilkan karakter. Coba lagi.' : 'AI could not generate characters. Please try again.');
    }
}

// Centralized function for adding event listeners to character cards
function addCharacterCardEventListener(charCard, charData) {
    charCard.addEventListener('click', () => {
        // Reset all cards' styles
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-mc');
            card.style.backgroundColor = 'var(--container-bg)'; // Reset background color to theme variable
            const iconSpan = card.querySelector('.icon-placeholder');
            // Reset icon for all cards to '✨' since only potential MCs are displayed
            if (iconSpan) iconSpan.textContent = '✨'; 
        });
        
        // Apply selected style to the clicked card
        charCard.classList.add('selected-mc');
        charCard.style.backgroundColor = 'var(--char-card-selected-bg)'; // Set background color for selected card
        selectedMainCharacter = charData;
        console.log("Selected MC:", selectedMainCharacter);

        // Change icon for the selected character
        const selectedIconSpan = charCard.querySelector('.icon-placeholder');
        if (selectedIconSpan) selectedIconSpan.textContent = '😇'; // Change to angel icon
    });
}

// --- Game Play Functions ---
async function startGame() {
    showScreen('game-screen');
    gameLoadingOverlay.style.display = 'flex';
    gamePlayScreen.style.display = 'none'; // Hide game play screen until content loads

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
            "genreDetails": { "type": "STRING", "description": "Example: 😇 Genre, Romantis, Bodyguard Romance" }
        },
        "required": ["prologueTitle", "prologueText", "prologueQuote", "initialSystems", "genreDetails"]
    };

    const mcName = selectedMainCharacter.name;
    const mcClass = selectedMainCharacter.class;
    const mcPersonality = selectedMainCharacter.personality;
    const storyTitle = selectedStoryDetails.title;
    const storyDescription = selectedStoryDetails.description;
    const genres = selectedStoryDetails.genres.join(', ');
    const subgenres = selectedStoryDetails.subgenres.join(', ');

    let prompt = `Generate a compelling visual novel prologue for the story "${storyTitle}" (Description: "${storyDescription}") focusing on the main character ${mcName} (${mcClass}, Personality: ${mcPersonality}). The prologue should set the scene, introduce the MC's initial perspective, and hint at the main conflict. Ensure the narrative flows smoothly and connects logically.

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
    `;
    
    const prologData = await callGeminiAPI(prompt, prologSchema, gameLoadingOverlay, gameLoadingOverlay.querySelector('span'), gameLoadingAdditionalText, null);

    if (prologData) {
        displayPrologue(prologData);
        gameLoadingOverlay.style.display = 'none';
        gamePlayScreen.style.display = 'flex'; // Show game play screen
        gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to top
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Prolog' : 'Prologue Error', selectedLanguage === 'id' ? 'Tidak dapat menghasilkan prolog. Coba lagi.' : 'Could not generate prologue. Please try again.');
        showScreen('summary-screen'); // Go back to summary
    }
}

function displayPrologue(prologData) {
    prologContentDisplay.innerHTML = `
        <div class="chapter-header-card">
            <h2>🌹 ${prologData.prologueTitle}</h2>
            <p class="chapter-meta">${prologData.genreDetails}</p>
        </div>
        <div class="narrative-content">
            ${prologData.prologueText.split('\n').filter(Boolean).map(p => {
                // Check for quotes in narrative blocks (now correctly handling quotes)
                if (p.trim().startsWith('> ')) {
                    return `<p class="prolog-quote">${p.trim().substring(2)}</p>`; // Remove the "> " from the text
                }
                return `<p>${p.trim()}</p>`;
            }).join('')}
        </div>
    `;
    prologContentDisplay.style.display = 'block';
    chapterContentDisplay.style.display = 'none'; // Hide chapter content

    // Initialize gameProgress with initial systems from prologue
    gameProgress.pathTracker = prologData.initialSystems.pathTracker;
    gameProgress.lockedPaths = prologData.initialSystems.lockedPaths;
    gameProgress.flagAwal = prologData.initialSystems.flagAwal; // Store as string for now
    
    // Render initial dynamic systems
    renderDynamicSystems(prologData.initialSystems, true); // True for initial display
    
    choiceContainer.innerHTML = ''; // Clear choices
    startRealStoryBtn.style.display = 'block'; // Show "Mulai Cerita Sebenarnya" button
}

async function startChapter1() {
    gameProgress.currentChapter = 1;
    gameProgress.currentScene = 1;

    prologContentDisplay.style.display = 'none';
    startRealStoryBtn.style.display = 'none'; // Hide this button
    gameLoadingOverlay.style.display = 'flex'; // Show loading for chapter

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
                            "moral": { "type": "STRING" },
                            "honesty": { "type": "STRING" },
                            "empathy": { "type": "STRING" },
                            "style": { "type": "STRING" }
                        }
                    },
                    "timeUpdate": { "type": "STRING" },
                    "activeEvents": { "type": "ARRAY", "items": { "type": "STRING" } },
                    "pathTrackerChange": { "type": "STRING" },
                    "lockedPathsInfo": { "type": "STRING" }
                }
            }
        },
        "required": ["chapterTitle", "chapterMeta", "chapterContent", "choices", "consequenceNote"]
    };

    const mcName = selectedMainCharacter.name;
    const mcClass = selectedMainCharacter.class;
    const storyTitle = selectedStoryDetails.title;

    // Get all character names (including MC) to ensure distinctness and personality matching
    const allCharacterNames = generatedCharacters.map(c => ({
        name: c.name,
        personality: c.personality,
        role: c.role,
        isMC: c.id === selectedMainCharacter.id
    }));

    // Prepare current game state for AI
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
            subgenres: selectedStoryDetails.subgenres
        },
        allCharactersInStory: allCharacterNames, // Pass all characters with their personalities
        gameProgress: {
            currentChapter: gameProgress.currentChapter,
            currentScene: gameProgress.currentScene,
            trustPoints: JSON.stringify(gameProgress.trustPoints), // Send as string to avoid schema issues
            flagAwal: gameProgress.flagAwal, // Send as string
            pathTracker: gameProgress.pathTracker,
            lockedPaths: gameProgress.lockedPaths,
            achievements: gameProgress.achievements,
            traumaSystem: JSON.stringify(gameProgress.traumaSystem),
            relationshipLabels: JSON.stringify(gameProgress.relationshipLabels),
            timeSystem: JSON.stringify(gameProgress.timeSystem),
            dnaProfile: JSON.stringify(gameProgress.dnaProfile),
            playerChoices: gameProgress.playerChoices.map(c => c.choiceText).join("; ") // Summarize past choices
        },
        previousChoice: previousChoiceText
    };

    let prompt = `Continue the visual novel story. The current game state is: ${JSON.stringify(currentGameStateForAI)}.
    
    Generate the content for Chapter ${chapterNum}, including:
    - A concise chapter title.
    - "chapterMeta": An object containing "mcDisplay" (e.g., "MC: Renessa – Penjaga Bayangan") and "activePath" (e.g., "Jalur Aktif: Bayangan di Atas Takhta").
    - "chapterContent": An ordered array of narrative and dialogue blocks.
        - For narrative blocks, use type "narrative" and include the text. **Ensure narrative flows logically from the previous scene/prologue and does not jump.**
        - For dialogue blocks, use type "dialogue", explicitly include the "speaker" name (e.g., 'Permaisuri', 'Kapten Drevan', or "${mcName}" for the MC). The speaker's name MUST be a concrete character name from 'allCharactersInStory' and NEVER a generic placeholder like "seseorang misterius".
        - The "text" of their dialogue. This text should ONLY contain the dialogue itself, without "Nama MC [Aku]:" or "Nama Karakter:". This prefix will be added by the client-side code. Quotes starting with '> ' can be part of any text block. **IMPORTANT: Ensure the dialogue sounds natural and is consistent with the speaker's personality and role as defined in 'allCharactersInStory'. Avoid stiff or unnatural phrasing.**
    - A set of 3 choices (dialogue or action) for the player.
    - A "consequenceNote" explaining what the choices will affect.
    - "dynamicUpdates": An object containing updates for various dynamic systems based on the narrative progression and previous choice.

    Perkaya narasi dan deskripsi adegan:
    - Tambahkan lebih banyak detail sensorik (apa yang terlihat, terdengar, tercium, terasa) untuk membuat adegan lebih hidup.
    - Sertakan lebih banyak pikiran dan perasaan internal Karakter Utama (MC) untuk membantu pemain terhubung lebih dalam dengan MC.
    - Variasikan kecepatan narasi (pacing dinamis); beberapa paragraf bisa cepat dan berurutan untuk adegan aksi, sementara yang lain lebih lambat dan deskriptif untuk adegan reflektif atau emosional.
    - "Show, Don't Tell": Tunjukkan emosi atau situasi melalui tindakan dan deskripsi, bukan hanya menyatakan.
    
    The dynamic systems are:
    1. Trust System: Each character has trust points towards MC. Trust can increase or decrease. High trust unlocks secrets, unique paths, or positive endings. Low trust can trigger betrayal, character death, or bad endings.
    2. Death Trigger: MC or important characters can die based on choices. Death can be immediate or chain reaction. If MC dies, game over.
    3. Flag Awal: Characters have hidden conditions from the start (e.g., betrayed before, secret, trauma). Triggered by words, actions, or time. Greatly influences initial attitude towards MC.
    4. Path Tracker: Shows main story path (e.g., “Shadows Between Two Crowns”). Changes based on key decisions. Can contain hidden sub-paths.
    5. Locked Story Paths: Some paths open only if certain conditions met (high/low trust, flags triggered, secret actions, specific DNA Profile).
    6. Trust Dynamic Update: Only appears for significant changes. Format: 🔸 Althea: +2.1, 🟡 Kael: -1.2 → “You broke it again?”, ⚠️ Shadow Guild: -4.0 → [Considers you a threat].
    7. Title / Achievement System: Player gets titles based on moral choices, play style, and ending. Example: 🗡️ Bloody Hand, 👑 Forgiving Hero, 🕷️ Master Deceiver. Titles can unlock unique dialogues or hidden paths.
    8. Inner Wound / Trauma System: Heavy decisions/events can trigger trauma on MC/characters. Effects: trust changes, locking choices, different emotional dialogues.
    9. Dynamic Character Dialogue: Adjusts based on Trust, Relationship Label, interaction history. Characters remember past actions.
    10. Character Relationship Label System: Stores labels like: Friend, Old Enemy, Hidden Love, Former Alliance. Changes based on choices and trust. Affects special dialogues, exclusive events, betrayal/sacrifice potential.
    11. Dynamic Time Event System: Events tied to time (morning, noon, night, specific hour). Each action advances time. Some events only appear at certain times. Format: 🕒 Time: Day 3, Night; ⏳ Countdown: 1 time left before South Gate closes; 📍 Active Event: Kael's Execution (terjadi saat fajar).
    12. Choice DNA / Decision Root System: Tracks player's moral patterns: Moral, Honesty, Empati, Decision Style. Format: 🧬 Decision Profile: - Moral: High, - Honesty: Low, - Empati: Netral, - Gaya: Manipulator Emosional. This DNA affects: secret paths, automatic trust, hidden endings.
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
    `;

    const chapterData = await callGeminiAPI(prompt, chapterSchema, gameLoadingOverlay, gameLoadingOverlay.querySelector('span'), gameLoadingAdditionalText, null);

    if (chapterData) {
        renderGameContent(chapterData);
        gameLoadingOverlay.style.display = 'none';
        chapterContentDisplay.style.display = 'block';
        gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' }); // Scroll to top
    } else {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Bab' : 'Chapter Error', selectedLanguage === 'id' ? 'Tidak dapat menghasilkan bab. Coba lagi.' : 'Could not generate chapter. Please try again.');
        showScreen('game-over-screen'); // Or go back to a safe state
    }
}

function renderGameContent(chapterData) {
    // Clear previous chapter content
    chapterContentDisplay.innerHTML = '';

    // Render Chapter Header Card
    const chapterHeaderCard = document.createElement('div');
    chapterHeaderCard.className = 'chapter-header-card';
    chapterHeaderCard.innerHTML = `
        <h2>🩸 ${chapterData.chapterTitle}</h2>
        <p class="chapter-meta">
            <span class="font-bold">🎭 MC:</span> ${chapterData.chapterMeta.mcDisplay} <br>
            <span class="font-bold">🔒 Jalur Aktif:</span> ${chapterData.chapterMeta.activePath}
        </p>
    `;
    chapterContentDisplay.appendChild(chapterHeaderCard);

    // Render Chapter Content (Narrative and Dialogues)
    const narrativeContainer = document.createElement('div');
    narrativeContainer.className = 'narrative-content';
    chapterContentDisplay.appendChild(narrativeContainer);


    chapterData.chapterContent.forEach(block => {
        if (block.type === 'narrative') {
            const p = document.createElement('p');
            p.innerHTML = block.text.split('\n').filter(Boolean).map(line => {
                // Check for quotes in narrative blocks (now correctly handling quotes)
                if (line.trim().startsWith('> ')) {
                    return `<p class="chapter-quote">${line.trim().substring(2)}</p>`; // Remove the "> " from the text
                }
                return `<p>${line.trim()}</p>`;
            }).join('');
            narrativeContainer.appendChild(p);
        } else if (block.type === 'dialogue') {
            const dialogueCard = document.createElement('div');
            let speakerNameDisplay = block.speaker;
            let dialogueText = block.text;

            if (block.speaker === selectedMainCharacter.name) {
                dialogueCard.className = 'character-dialogue-card mc-dialogue-card';
                speakerNameDisplay = `${selectedMainCharacter.name} [Aku]`; // Add [Aku] for MC
            } else {
                dialogueCard.className = 'character-dialogue-card other-dialogue-card';
            }
            
            dialogueCard.innerHTML = `
                <strong class="speaker-name">${speakerNameDisplay}:</strong>
                <span>${dialogueText}</span>
            `;
            narrativeContainer.appendChild(dialogueCard);
        }
    });


    // Update game progress based on dynamic updates
    if (chapterData.dynamicUpdates) {
        const updates = chapterData.dynamicUpdates;

        // Update Trust Points (simple simulation: just display for now)
        if (updates.trustUpdates) {
            updates.trustUpdates.forEach(tu => {
                if (!gameProgress.trustPoints[tu.character]) {
                    gameProgress.trustPoints[tu.character] = 0; // Initialize if not present
                }
                gameProgress.trustPoints[tu.character] += tu.change;
            });
        }

        // Update Flags Triggered
        if (updates.flagsTriggered) {
            updates.flagsTriggered.forEach(flag => {
                if (!gameProgress.flagAwal[flag]) {
                    gameProgress.flagAwal[flag] = true;
                }
            });
        }

        // Update Achievements
        if (updates.newAchievements) {
            updates.newAchievements.forEach(achievement => {
                if (!gameProgress.achievements.some(a => a.title === achievement.title)) {
                    gameProgress.achievements.push(achievement);
                }
            });
        }

        // Update DNA Profile
        if (updates.dnaProfileChanges) {
            gameProgress.dnaProfile = { ...gameProgress.dnaProfile, ...updates.dnaProfileChanges };
        }

        // Update Time System
        if (updates.timeUpdate) {
            gameProgress.timeSystem.display = updates.timeUpdate; 
        }

        // Update Active Events
        if (updates.activeEvents) {
            gameProgress.timeSystem.activeEvents = updates.activeEvents;
        }

        // Update Path Tracker
        if (updates.pathTrackerChange) {
            gameProgress.pathTracker = updates.pathTrackerChange;
        }

        // Update Locked Paths Info (AI provides a string, store as such)
        if (updates.lockedPathsInfo) {
            // This is more of a note, not a true state change for lockedPaths array
            // For a full system, you'd have conditions to add/remove from gameProgress.lockedPaths
        }
    }

    renderDynamicSystems(chapterData.dynamicUpdates); // Render updates to UI

    // Render choices
    choiceContainer.innerHTML = '';
    chapterData.choices.forEach(choice => {
        const choiceCard = document.createElement('div');
        choiceCard.className = 'choice-card';
        choiceCard.innerHTML = `<span class="choice-emote">${choice.emote}</span> ${choice.text}`;
        choiceCard.addEventListener('click', () => handleChoice(choice));
        choiceContainer.appendChild(choiceCard);
    });

    // Add consequence note
    if (chapterData.consequenceNote) {
        const consequenceP = document.createElement('p');
        consequenceP.className = 'text-sm mt-4 text-gray-600 text-center italic';
        consequenceP.textContent = chapterData.consequenceNote;
        choiceContainer.appendChild(consequenceP);
    }
}

function renderDynamicSystems(updates, isInitial = false) {
    dynamicSystemsDisplay.innerHTML = `<h3>🎮 Sistem Aktif:</h3>`;
    
    const appendSystemLine = (icon, title, value) => {
        if (value) { // Only append if value is not empty/null
            const p = document.createElement('p');
            p.innerHTML = `<span class="system-title">${icon} ${title}:</span> ${value}`;
            dynamicSystemsDisplay.appendChild(p);
        }
    };

    // Always display core systems from gameProgress state
    appendSystemLine('🧠', 'Trust System', selectedLanguage === 'id' ? 'Setiap karakter memiliki poin kepercayaan terhadap MC.' : 'Each character has trust points towards MC.');
    appendSystemLine('🩸', 'Death Trigger', selectedLanguage === 'id' ? 'MC atau karakter penting bisa mati jika pemain mengambil pilihan tertentu.' : 'MC or important characters can die based on choices.');
    
    // Display initial flag from gameProgress.flagAwal (which stores the string from prologue)
    if (gameProgress.flagAwal) {
        // Check if flagAwal is an object with properties
        if (typeof gameProgress.flagAwal === 'object' && Object.keys(gameProgress.flagAwal).length > 0) {
            const flagStrings = Object.keys(gameProgress.flagAwal).map(key => `${key}`); // Adjust if you want to show value too
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
    
    // Display current time/events if any
    if (gameProgress.timeSystem.display) {
        appendSystemLine('⏳', 'Waktu & Event', gameProgress.timeSystem.display);
    } else if (gameProgress.timeSystem.day) { // Default display if AI didn't provide specific string
        appendSystemLine('⏳', 'Waktu', `${selectedLanguage === 'id' ? 'Hari ke-' : 'Day '}${gameProgress.timeSystem.day}, ${gameProgress.timeSystem.partOfDay}`);
    }

    // Display current DNA Profile
    if (gameProgress.dnaProfile) {
        const dnaText = `Moral: ${gameProgress.dnaProfile.moral}, Kejujuran: ${gameProgress.dnaProfile.honesty}, Empati: ${gameProgress.dnaProfile.empathy}, Gaya: ${gameProgress.dnaProfile.style}`;
        appendSystemLine('🧬', 'Profil Keputusan', dnaText);
    }

    // Display trust updates received from the *current* chapter generation
    if (updates && updates.trustUpdates && updates.trustUpdates.length > 0) {
        const trustUpdateTitle = document.createElement('p');
        trustUpdateTitle.className = 'system-title mt-2';
        trustUpdateTitle.textContent = 'Trust Update:';
        dynamicSystemsDisplay.appendChild(trustUpdateTitle);

        updates.trustUpdates.forEach(tu => {
            const trustItem = document.createElement('p');
            let icon = '🟡'; // Default neutral/warning
            let textColorClass = 'neutral';
            if (tu.change > 0) { icon = '🔸'; textColorClass = 'positive'; }
            else if (tu.change < 0) { icon = '⚠️'; textColorClass = 'negative'; }
            
            trustItem.className = `trust-update-item ${textColorClass}`;
            trustItem.innerHTML = `${icon} ${tu.character}: ${tu.change > 0 ? '+' : ''}${tu.change}${tu.reason ? ` → "${tu.reason}"` : ''}`;
            dynamicSystemsDisplay.appendChild(trustItem);
        });
    }

    // Display flags triggered in the *current* chapter
    if (updates && updates.flagsTriggered && updates.flagsTriggered.length > 0) {
         const flagTriggeredTitle = document.createElement('p');
         flagTriggeredTitle.className = 'system-title mt-2';
         flagTriggeredTitle.textContent = 'Flag Terpicu:';
         dynamicSystemsDisplay.appendChild(flagTriggeredTitle);

         updates.flagsTriggered.forEach(flag => {
            const flagItem = document.createElement('p');
            flagItem.className = 'flag-item';
            flagItem.textContent = `🧩 ${flag}`;
            dynamicSystemsDisplay.appendChild(flagItem);
         });
    }

    // Display new achievements
    if (updates && updates.newAchievements && updates.newAchievements.length > 0) {
        const achievementTitle = document.createElement('p');
        achievementTitle.className = 'system-title mt-2';
        achievementTitle.textContent = '🎖️ Gelar Baru:';
        dynamicSystemsDisplay.appendChild(achievementTitle);

        updates.newAchievements.forEach(ach => {
            const achievementItem = document.createElement('p');
            achievementItem.className = 'achievement-item';
            achievementItem.innerHTML = `<strong>${ach.title}</strong>: ${ach.description}`;
            dynamicSystemsDisplay.appendChild(achievementItem);
        });
    }

    // Note section only for prologue
    if (isInitial && updates && updates.notes) {
        const notesP = document.createElement('p');
        notesP.className = 'system-title mt-2';
        notesP.textContent = `🎯 Catatan: ${updates.notes}`;
        dynamicSystemsDisplay.appendChild(notesP);
    }
}


async function handleChoice(choice) {
    // Record the choice
    gameProgress.playerChoices.push({
        chapter: gameProgress.currentChapter,
        scene: gameProgress.currentScene,
        choiceId: choice.id,
        choiceText: choice.text
    });

    // Increment scene/chapter (simple progression for now)
    gameProgress.currentScene++;

    // Clear choices and show loading
    choiceContainer.innerHTML = '';
    gameLoadingOverlay.style.display = 'flex';

    // Generate next chapter/scene
    await generateChapter(gameProgress.currentChapter, choice.text);
}

// --- Initialization ---
// On page load, check for API key and apply stored theme
window.onload = () => {
    API_KEY = getApiKey();
    if (API_KEY) {
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showScreen('api-key-screen');
        setMainButtonsEnabled(false); // Disable main buttons until API key is entered
    }
    updateLanguageText();
    applyStoredTheme(); // Apply the theme stored in localStorage
};

