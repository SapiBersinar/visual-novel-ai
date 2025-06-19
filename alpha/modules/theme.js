// modules/theme.js
// Mengelola fungsionalitas perubahan tema (terang, gelap, perlindungan mata).

import { DOM } from './domElements.js'; // Impor elemen DOM

// Ketergantungan (dependencies) akan diterima dari script.js utama
let _deps = {};

export function setupDependencies(dependencies) {
    _deps = dependencies;
}

export function toggleTheme() {
    const body = document.body;
    let currentTheme = localStorage.getItem('theme') || 'light-theme'; // Get current theme from local storage

    if (currentTheme === 'light-theme') {
        body.className = 'dark-theme';
        localStorage.setItem('theme', 'dark-theme');
    } else if (currentTheme === 'dark-theme') {
        body.className = 'eye-protection-theme';
        localStorage.setItem('theme', 'eye-protection-theme');
    } else { // currentTheme === 'eye-protection-theme'
        body.className = 'light-theme';
        localStorage.setItem('theme', 'light-theme');
    }
    updateThemeToggleButtonText();
}

export function applyStoredTheme() {
    const storedTheme = localStorage.getItem('theme') || 'light-theme';
    document.body.className = storedTheme;
    updateThemeToggleButtonText();
}

export function updateThemeToggleButtonText() {
    const currentTheme = document.body.className;
    const selectedLanguage = _deps.selectedLanguage.selectedLanguage; // Akses bahasa dari deps

    if (selectedLanguage === 'id') {
        if (currentTheme === 'light-theme') {
            DOM.themeToggleIcon.className = 'fas fa-moon';
            DOM.themeToggleText.textContent = 'Mode Gelap';
        } else if (currentTheme === 'dark-theme') {
            DOM.themeToggleIcon.className = 'fas fa-sun';
            DOM.themeToggleText.textContent = 'Mode Terang';
        } else if (currentTheme === 'eye-protection-theme') {
            DOM.themeToggleIcon.className = 'fas fa-eye';
            DOM.themeToggleText.textContent = 'Mode Perlindungan Mata';
        }
    } else { // English
        if (currentTheme === 'light-theme') {
            DOM.themeToggleIcon.className = 'fas fa-moon';
            DOM.themeToggleText.textContent = 'Dark Mode';
        } else if (currentTheme === 'dark-theme') {
            DOM.themeToggleIcon.className = 'fas fa-sun';
            DOM.themeToggleText.textContent = 'Light Mode';
        } else if (currentTheme === 'eye-protection-theme') {
            DOM.themeToggleIcon.className = 'fas fa-eye';
            DOM.themeToggleText.textContent = 'Eye Protection Mode';
        }
    }
}

export function setupThemeToggle(deps) {
    _deps = deps; // Set dependencies
    DOM.themeToggleButton.addEventListener('click', toggleTheme);
}


