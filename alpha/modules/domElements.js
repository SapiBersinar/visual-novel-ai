// modules/domElements.js
// Mengumpulkan semua referensi ke elemen DOM untuk akses yang terpusat.

export const DOM = {
    // API Key Input Screen
    apiKeyScreen: document.getElementById('api-key-screen'),
    apiKeyInput: document.getElementById('api-key-input'),
    saveApiKeyBtn: document.getElementById('save-api-key-btn'),
    clearApiKeyBtn: document.getElementById('clear-api-key-btn'),

    // Main Screen
    mainScreen: document.getElementById('main-screen'),
    manualInputBtn: document.getElementById('manual-input-btn'),
    aiGenerateBtn: document.getElementById('ai-generate-btn'),

    // Manual Input Screen
    manualInputScreen: document.getElementById('manual-input-screen'),
    manualTitleInput: document.getElementById('manual-title'),
    manualDescriptionInput: document.getElementById('manual-description'),
    continueManualBtn: document.getElementById('continue-manual-btn'),
    backFromManualBtn: document.getElementById('back-from-manual-btn'),

    // AI Generate Form Screen
    aiGenerateFormScreen: document.getElementById('ai-generate-form-screen'),
    languageRadios: document.querySelectorAll('input[name="language"]'),
    genreSelect: document.getElementById('genre-select'),
    otherGenreInput: document.getElementById('other-genre-input'),
    subgenreSelect: document.getElementById('subgenre-select'),
    subgenreManualInput: document.getElementById('subgenre-manual-input'),
    numStoriesInput: document.getElementById('num-stories'),
    generateAiBtn: document.getElementById('generate-ai-btn'),
    backFromAiFormBtn: document.getElementById('back-from-ai-form-btn'),
    loadingAi: document.getElementById('loading-ai'),
    loadingText: document.getElementById('loading-text'),
    loadingAdditionalText: document.getElementById('loading-additional-text'),

    // AI Results Screen
    aiResultsScreen: document.getElementById('ai-results-screen'),
    storyListContainer: document.getElementById('story-list-container'),
    selectedStoryDisplay: document.getElementById('selected-story-display'),
    displayTitle: document.getElementById('display-title'),
    displayDescription: document.getElementById('display-description'),
    displayGenres: document.getElementById('display-genres'),
    displaySubgenres: document.getElementById('display-subgenres'),
    continueToCharacterSelectionBtn: document.getElementById('continue-to-character-selection-btn'),
    backFromAiResultsBtn: document.getElementById('back-from-ai-results-btn'),

    // Character Creation Screen
    characterCreationScreen: document.getElementById('character-creation-screen'),
    numCharactersSelect: document.getElementById('num-characters-select'),
    characterClassInput: document.getElementById('character-class-input'),
    nameStyleSelect: document.getElementById('name-style-select'), 
    generateCharactersBtn: document.getElementById('generate-characters-btn'),
    backToStorySelectBtn: document.getElementById('back-to-story-select-btn'),
    loadingCharacters: document.getElementById('loading-characters'),
    loadingCharsText: document.getElementById('loading-chars-text'),
    loadingAdditionalTextChars: document.getElementById('loading-additional-text-chars'),
    characterResultsDiv: document.getElementById('character-results'),
    mcSelectionHeading: document.getElementById('mc-selection-heading'),
    characterActionButtons: document.getElementById('character-action-buttons'),
    continueToGameBtn: document.getElementById('continue-to-game-btn'),
    regenerateCharactersBtn: document.getElementById('regenerate-characters-btn'),

    // Summary screen
    summaryScreen: document.getElementById('summary-screen'),
    finalSummaryTitle: document.getElementById('final-summary-title'),
    finalSummaryDescription: document.getElementById('final-summary-description'),
    finalSummaryGenres: document.getElementById('final-summary-genres'),
    finalSummarySubgenres: document.getElementById('final-summary-subgenres'),
    finalMcNameClass: document.getElementById('final-mc-name-class'),
    finalMcPersonality: document.getElementById('final-mc-personality'),
    finalMcDescription: document.getElementById('final-mc-description'),
    startGameBtn: document.getElementById('start-game-btn'),
    backFromSummaryBtn: document.getElementById('back-from-summary-btn'),

    // Game Screen (Main Visual Novel Display)
    gameScreen: document.getElementById('game-screen'),
    gameLoadingOverlay: document.getElementById('game-loading-overlay'),
    gameLoadingAdditionalText: document.getElementById('game-loading-additional-text'),
    gamePlayScreen: document.getElementById('game-play-screen'),
    // Game Controls
    showLogBtn: document.getElementById('show-log-btn'), // NEW
    logButtonText: document.getElementById('log-button-text'), // NEW
    autoReadBtn: document.getElementById('auto-read-btn'), // NEW
    autoReadButtonText: document.getElementById('auto-read-button-text'), // NEW

    prologContentDisplay: document.getElementById('prolog-content-display'),
    chapterContentDisplay: document.getElementById('chapter-content-display'),
    dynamicSystemsDisplay: document.getElementById('dynamic-systems-display'),
    choiceContainer: document.getElementById('choice-container'),
    startRealStoryBtn: document.getElementById('start-real-story-btn'),

    // Game Over Screen
    gameOverScreen: document.getElementById('game-over-screen'),
    gameOverMessage: document.getElementById('game-over-message'),
    gameOverAnalysis: document.getElementById('game-over-analysis'),
    gameOverDnaProfile: document.getElementById('game-over-dna-profile'), // NEW
    dnaMoral: document.getElementById('dna-moral'), // NEW
    dnaHonesty: document.getElementById('dna-honesty'), // NEW
    dnaEmpathy: document.getElementById('dna-empathy'), // NEW
    dnaStyle: document.getElementById('dna-style'), // NEW
    gameOverEpilog: document.getElementById('game-over-epilog'), // NEW
    epilogContent: document.getElementById('epilog-content'), // NEW

    retryGameBtn: document.getElementById('retry-game-btn'),
    backToMainMenuBtn: document.getElementById('back-to-main-menu-btn'),

    // Custom Message Box
    customMessageBox: document.getElementById('custom-message-box'),
    messageBoxTitle: document.getElementById('message-box-title'),
    messageBoxContent: document.getElementById('message-box-content'),
    messageBoxOkBtn: document.getElementById('message-box-ok-btn'),

    // Theme Toggle Button
    themeToggleButton: document.getElementById('theme-toggle'),
    themeToggleIcon: document.getElementById('theme-toggle').querySelector('i'),
    themeToggleText: document.getElementById('theme-toggle-text'),

    // Notification Container (NEW)
    notificationContainer: document.getElementById('notification-container'),

    // Story Log Modal (NEW)
    storyLogModal: document.getElementById('story-log-modal'),
    storyLogCloseButton: document.querySelector('#story-log-modal .close-button'),
    logContent: document.getElementById('log-content')
};


