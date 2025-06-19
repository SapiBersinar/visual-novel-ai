// modules/gameState.js
// Mengelola semua variabel state permainan.

export let selectedLanguage = 'id';
export let selectedStoryDetails = null;
export let generatedCharacters = []; // This will hold ALL generated characters
export let selectedMainCharacter = null;
export let autoReadActive = false; // State untuk mode auto-read

// Game progress state to store dynamic system data
export let gameProgress = {
    currentChapter: 0,
    currentScene: 0,
    trustPoints: {}, // {characterId: value}
    flagAwal: {}, // {flagName: boolean}
    pathTracker: null,
    lockedPaths: [], // Array of locked path strings
    achievements: [],
    traumaSystem: {}, // {characterId: boolean}
    relationshipLabels: {}, // {characterId: "Friend" | "Enemy" | "Lover"}
    timeSystem: {day: 1, partOfDay: "pagi", countdown: null, activeEvents: []},
    dnaProfile: {moral: "Netral", honesty: "Netral", empathy: "Netral", style: "Observasi"},
    playerChoices: [] // Stores objects like {chapter: 1, choiceIndex: 0, choiceText: "..."}
    // Removed: storyLog: []
};

// Fungsi untuk menginisialisasi ulang state game (digunakan pada retry/kembali ke menu utama)
export function initializeGameState() {
    selectedStoryDetails = null;
    generatedCharacters = [];
    selectedMainCharacter = null;
    autoReadActive = false; // Reset auto-read state

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
        // Removed: storyLog: []
    };
}

// Fungsi untuk memperbarui bahasa yang dipilih
export function updateSelectedLanguage(lang) {
    selectedLanguage = lang;
}

// Fungsi untuk toggle auto-read state
export function toggleAutoRead() {
    autoReadActive = !autoReadActive;
    return autoReadActive; // Return new state
}


