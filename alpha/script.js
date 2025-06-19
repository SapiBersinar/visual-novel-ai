// script.js (atau main.js)
// Ini adalah file JavaScript utama yang mengimpor dan menginisialisasi semua modul.

// Impor semua elemen DOM
import { DOM } from './modules/domElements.js';

// Impor fungsi-fungsi API
import { getApiKey, saveApiKey, clearApiKey, callGeminiAPI as originalCallGeminiAPI } from './modules/api.js';

// Impor state game dan fungsi terkait dari gameState
import { 
    gameProgress, selectedStoryDetails, generatedCharacters, selectedMainCharacter, 
    initializeGameState, updateSelectedLanguage, toggleAutoRead, autoReadActive 
} from './modules/gameState.js';

// Impor fungsi UI Handler
import { 
    showScreen, 
    showMessageBox, 
    setMainButtonsEnabled, 
    updateLanguageText, 
    setupEventListeners as setupUIEventListeners 
} from './modules/uiHandlers.js';

// Impor fungsi Game Logic
import { 
    generateStoryContent, 
    generateSubgenres, 
    generateCharacters, 
    startGame, 
    generatePrologue, 
    startChapter1, 
    handleChoice,
    endGame 
} from './modules/gameLogic.js';

// Impor fungsi Render
import { 
    displayPrologue, 
    renderGameContent, 
    renderDynamicSystems, 
    addCharacterCardEventListener,
    showNotification, 
    // Removed: displayStoryLog, 
    displayGameOverScreen 
} from './modules/renderFunctions.js';

// Impor fungsi Tema
import { 
    toggleTheme, 
    applyStoredTheme, 
    updateThemeToggleButtonText, 
    setupThemeToggle 
} from './modules/theme.js';


// API_KEY global yang akan digunakan oleh callGeminiAPI.
let API_KEY = ""; 

// Fungsi pembungkus untuk callGeminiAPI agar bisa menggunakan API_KEY global
const callGeminiAPI = (...args) => originalCallGeminiAPI(API_KEY, ...args);


// Logika inisialisasi aplikasi saat jendela dimuat
window.onload = () => {
    // Muat API Key dari localStorage
    API_KEY = getApiKey(); 

    // Tentukan layar awal berdasarkan ketersediaan API Key
    if (API_KEY) {
        showScreen('main-screen');
        setMainButtonsEnabled(true);
    } else {
        showScreen('api-key-screen');
        setMainButtonsEnabled(false);
    }

    // Perbarui teks UI berdasarkan bahasa yang dipilih (default 'id')
    updateLanguageText(); 

    // Terapkan tema yang tersimpan dari localStorage
    applyStoredTheme(); 

    // Setup semua event listener dari modul uiHandlers.
    // Kita perlu meneruskan semua fungsi dan state yang diperlukan oleh uiHandlers
    // untuk menghindari dependensi melingkar dan menjaga modularitas.
    setupUIEventListeners({
        getApiKey, saveApiKey, clearApiKey, 
        selectedLanguage, // Pass by reference for language
        showScreen, showMessageBox, setMainButtonsEnabled, updateLanguageText,
        selectedStoryDetails, // Pass by reference
        generatedCharacters, // Pass by reference
        selectedMainCharacter, // Pass by reference
        gameProgress, // Pass by reference
        DOM, // Pass the DOM elements object
        // Fungsi dari gameLogic
        generateStoryContent, generateSubgenres, generateCharacters, startGame, startChapter1, handleChoice, endGame, 
        // Fungsi dari renderFunctions
        displayPrologue, renderGameContent, renderDynamicSystems, addCharacterCardEventListener, 
        showNotification, displayGameOverScreen, // Removed: displayStoryLog
        // Update language state (for radio buttons)
        updateSelectedLanguage,
        // Update auto read state
        toggleAutoRead,
        autoReadActive, // Pass the state itself
        // Untuk akses API
        callGeminiAPI
    }); 
    
    // Setup event listener untuk tombol pengubah tema
    setupThemeToggle({
        updateThemeToggleButtonText,
        toggleTheme,
        DOM, // Diperlukan untuk mengakses tombol tema
        selectedLanguage // Perlu bahasa untuk teks tombol
    });
};


