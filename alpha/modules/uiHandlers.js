// modules/uiHandlers.js
// Mengelola interaksi UI, tampilan layar, dan pesan.

import { DOM } from './domElements.js'; // Impor elemen DOM
import { selectedLanguage } from './gameState.js'; // Impor selectedLanguage langsung
// impor toggleAutoRead dari gameState jika fungsi ini didefinisikan di sana
import { toggleAutoRead } from './gameState.js'; // Import fungsi toggleAutoRead

// Parameter `deps` (dependencies) akan diterima dari script.js utama
// Ini adalah pola untuk menghindari dependensi melingkar.
let _deps = {};

// Fungsi untuk menginisialisasi dependensi
export function setupDependencies(dependencies) {
    _deps = dependencies;
}

export function showScreen(screenId) {
    const screens = [
        DOM.apiKeyScreen, DOM.mainScreen, DOM.manualInputScreen, 
        DOM.aiGenerateFormScreen, DOM.aiResultsScreen, DOM.characterCreationScreen, 
        DOM.summaryScreen, DOM.gameScreen, DOM.gameOverScreen
    ];
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

export function showMessageBox(title, message) {
    DOM.messageBoxTitle.textContent = title;
    DOM.messageBoxContent.textContent = message;
    DOM.customMessageBox.style.display = 'block';
}

export function setMainButtonsEnabled(enabled) {
    DOM.manualInputBtn.disabled = !enabled;
    DOM.aiGenerateBtn.disabled = !enabled;
}

export function updateLanguageText() {
    const currentLang = selectedLanguage; // Akses selectedLanguage langsung

    if (currentLang === 'id') {
        document.title = "Cerita Komik Interaktif";
        DOM.mainScreen.querySelector('h1').textContent = "Cerita Komik Interaktif";
        DOM.mainScreen.querySelector('p').textContent = "Dapatkan ide cerita baru atau masukkan cerita Anda sendiri.";
        DOM.manualInputBtn.textContent = "Masukkan Judul & Deskripsi Manual";
        DOM.aiGenerateBtn.textContent = "Hasilkan Cerita dengan AI";

        DOM.manualInputScreen.querySelector('h1').textContent = "Masukkan Cerita Anda";
        DOM.manualTitleInput.placeholder = "Judul Cerita";
        DOM.manualDescriptionInput.placeholder = "Deskripsi Cerita (fokus pada premis & konflik)";
        DOM.continueManualBtn.textContent = "Lanjutkan ke Pembuatan Karakter";
        DOM.backFromManualBtn.textContent = "Kembali";

        DOM.aiGenerateFormScreen.querySelector('h1').textContent = "Hasilkan Cerita dengan AI";
        DOM.aiGenerateFormScreen.querySelector('p').textContent = "AI akan membuat ide cerita berdasarkan preferensi Anda.";
        DOM.languageRadios[0].nextSibling.textContent = " Bahasa Indonesia";
        DOM.languageRadios[1].nextSibling.textContent = " English";
        DOM.genreSelect.options[0].textContent = "Pilih Genre";
        const otherGenreOption = Array.from(DOM.genreSelect.options).find(opt => opt.value === 'other');
        if (otherGenreOption) otherGenreOption.textContent = "Lainnya...";
        DOM.otherGenreInput.placeholder = "Masukkan Genre Lainnya";
        DOM.subgenreSelect.options[0].textContent = "Pilih Subgenre";
        DOM.subgenreManualInput.placeholder = "Masukkan Subgenre Lainnya";
        DOM.numStoriesInput.placeholder = "Jumlah Cerita (1-5)";
        DOM.generateAiBtn.textContent = "Hasilkan Cerita";
        DOM.backFromAiFormBtn.textContent = "Kembali";
        DOM.loadingText.textContent = "Sedang menulis kisah Anda...";
        DOM.loadingAdditionalText.textContent = "Mohon tunggu sebentar, AI sedang memproses.";

        DOM.aiResultsScreen.querySelector('h1').textContent = "Pilih Cerita Anda";
        DOM.aiResultsScreen.querySelector('p').textContent = "Pilih salah satu cerita yang dihasilkan AI.";
        DOM.continueToCharacterSelectionBtn.textContent = "Lanjutkan ke Pemilihan Karakter";
        DOM.backFromAiResultsBtn.textContent = "Kembali Cari Cerita Lain";

        DOM.characterCreationScreen.querySelector('h1').textContent = "Buat Karakter";
        DOM.characterCreationScreen.querySelector('p').textContent = "Anda dapat menentukan jumlah karakter atau membiarkan AI merekomendasikannya.";
        DOM.numCharactersSelect.options[0].textContent = "Pilihan ditentukan dari judul dan deskripsi oleh AI (rekomendasi)";
        for (let i = 0; i < DOM.numCharactersSelect.options.length; i++) {
            if (DOM.numCharactersSelect.options[i].value !== 'ai-recommended') {
                DOM.numCharactersSelect.options[i].textContent = `${DOM.numCharactersSelect.options[i].value} Karakter`;
            }
        }
        DOM.characterClassInput.placeholder = "Kelas Karakter (opsional, cth: Pahlawan)";
        Array.from(DOM.nameStyleSelect.options).forEach(option => {
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
        DOM.generateCharactersBtn.textContent = "Generate Karakter";
        DOM.backToStorySelectBtn.textContent = "Kembali ke Pemilihan Cerita";
        DOM.loadingCharsText.textContent = "Menciptakan karakter Anda...";
        DOM.loadingAdditionalTextChars.textContent = "Mohon tunggu sebentar, AI sedang memproses.";
        DOM.mcSelectionHeading.textContent = "Pilih Karakter Utama (MC):";
        DOM.continueToGameBtn.textContent = "Lanjutkan Cerita";
        DOM.regenerateCharactersBtn.textContent = "Cari Karakter Lagi";

        DOM.summaryScreen.querySelector('h1').textContent = "Ringkasan Cerita Anda";
        DOM.summaryScreen.querySelector('p').textContent = "Ini adalah ringkasan cerita dan karakter yang akan Anda mainkan.";
        DOM.summaryScreen.querySelector('.summary-section:nth-of-type(1) h2').textContent = "Judul Cerita";
        DOM.summaryScreen.querySelector('.summary-section:nth-of-type(1) p:nth-of-type(2)').previousElementSibling.textContent = "Deskripsi Cerita";
        DOM.summaryScreen.querySelector('.summary-section:nth-of-type(2) h2').textContent = "Karakter Utama (MC)";
        DOM.startGameBtn.textContent = "Mulai Game";
        DOM.backFromSummaryBtn.textContent = "Kembali";

        DOM.gameLoadingOverlay.querySelector('span').textContent = "Memuat cerita...";
        DOM.gameLoadingAdditionalText.textContent = "Mohon tunggu sebentar, AI sedang memproses.";
        DOM.startRealStoryBtn.textContent = "Mulai ke cerita sebenarnya";

        DOM.logButtonText.textContent = "Log"; // NEW
        DOM.autoReadButtonText.textContent = "Auto"; // NEW

        DOM.gameOverScreen.querySelector('h1').textContent = "💀 GAME OVER 💀";
        DOM.gameOverDnaProfile.querySelector('h2').textContent = "🧬 Profil Keputusan Akhir Anda"; // NEW
        DOM.gameOverEpilog.querySelector('h2').textContent = "📜 Epilog"; // NEW
        DOM.retryGameBtn.textContent = "Coba Lagi";
        DOM.backToMainMenuBtn.textContent = "Kembali ke Menu Utama";

    } else { // English
        document.title = "Interactive Comic Story";
        DOM.mainScreen.querySelector('h1').textContent = "Interactive Comic Story";
        DOM.mainScreen.querySelector('p').textContent = "Get new story ideas or input your own story.";
        DOM.manualInputBtn.textContent = "Enter Title & Description Manually";
        DOM.aiGenerateBtn.textContent = "Generate Story with AI";

        DOM.manualInputScreen.querySelector('h1').textContent = "Enter Your Story";
        DOM.manualTitleInput.placeholder = "Story Title";
        DOM.manualDescriptionInput.placeholder = "Story Description (focus on premise & conflict)";
        DOM.continueManualBtn.textContent = "Proceed to Character Creation";
        DOM.backFromManualBtn.textContent = "Back";

        DOM.aiGenerateFormScreen.querySelector('h1').textContent = "Generate Story with AI";
        DOM.aiGenerateFormScreen.querySelector('p').textContent = "AI will create story ideas based on your preferences.";
        DOM.languageRadios[0].nextSibling.textContent = " Indonesian";
        DOM.languageRadios[1].nextSibling.textContent = " English";
        DOM.genreSelect.options[0].textContent = "Select Genre";
        const otherGenreOption = Array.from(DOM.genreSelect.options).find(opt => opt.value === 'other');
        if (otherGenreOption) otherGenreOption.textContent = "Other...";
        DOM.otherGenreInput.placeholder = "Enter Other Genre";
        DOM.subgenreSelect.options[0].textContent = "Select Subgenre";
        DOM.subgenreManualInput.placeholder = "Enter Other Subgenre";
        DOM.numStoriesInput.placeholder = "Number of Stories (1-5)";
        DOM.generateAiBtn.textContent = "Generate Story";
        DOM.backFromAiFormBtn.textContent = "Back";
        DOM.loadingText.textContent = "Crafting your story...";
        DOM.loadingAdditionalText.textContent = "Please wait, AI is processing.";

        DOM.aiResultsScreen.querySelector('h1').textContent = "Select Your Story";
        DOM.aiResultsScreen.querySelector('p').textContent = "Select one of the AI generated stories.";
        DOM.continueToCharacterSelectionBtn.textContent = "Proceed to Character Selection";
        DOM.backFromAiResultsBtn.textContent = "Go Back, Find Another Story";

        DOM.characterCreationScreen.querySelector('h1').textContent = "Create Characters";
        DOM.characterCreationScreen.querySelector('p').textContent = "You can determine the number of characters or let AI recommend it.";
        DOM.numCharactersSelect.options[0].textContent = "AI-determined from title and description (recommended)";
        for (let i = 0; i < DOM.numCharactersSelect.options.length; i++) {
            if (DOM.numCharactersSelect.options[i].value !== 'ai-recommended') {
                DOM.numCharactersSelect.options[i].textContent = `${DOM.numCharactersSelect.options[i].value} Characters`;
            }
        }
        DOM.characterClassInput.placeholder = "Character Class (optional, e.g., Hero)";
        Array.from(DOM.nameStyleSelect.options).forEach(option => {
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
        DOM.generateCharactersBtn.textContent = "Generate Characters";
        DOM.backToStorySelectBtn.textContent = "Back to Story Selection";
        DOM.loadingCharsText.textContent = "Creating your characters...";
        DOM.loadingAdditionalTextChars.textContent = "Please wait, AI is processing.";
        DOM.mcSelectionHeading.textContent = "Select Main Character (MC):";
        DOM.continueToGameBtn.textContent = "Continue Story";
        DOM.regenerateCharactersBtn.textContent = "Find Other Characters";

        DOM.summaryScreen.querySelector('h1').textContent = "Your Story Summary";
        DOM.summaryScreen.querySelector('p').textContent = "Here is the summary of your story and characters.";
        DOM.summaryScreen.querySelector('.summary-section:nth-of-type(1) h2').textContent = "Story Title";
        DOM.summaryScreen.querySelector('.summary-section:nth-of-type(1) p:nth-of-type(2)').previousElementSibling.textContent = "Story Description";
        DOM.summaryScreen.querySelector('.summary-section:nth-of-type(2) h2').textContent = "Main Character (MC)";
        DOM.startGameBtn.textContent = "Start Game";
        DOM.backFromSummaryBtn.textContent = "Back";

        DOM.gameLoadingOverlay.querySelector('span').textContent = "Loading story...";
        DOM.gameLoadingAdditionalText.textContent = "Please wait, AI is processing.";
        DOM.startRealStoryBtn.textContent = "Start the real story";

        DOM.logButtonText.textContent = "Log"; // NEW
        DOM.autoReadButtonText.textContent = "Auto"; // NEW
        if (_deps.gameProgress.autoReadActive) {
            DOM.autoReadButtonText.textContent = "Auto ON";
        } else {
            DOM.autoReadButtonText.textContent = "Auto OFF";
        }

        DOM.gameOverScreen.querySelector('h1').textContent = "💀 GAME OVER 💀";
        DOM.gameOverDnaProfile.querySelector('h2').textContent = "🧬 Final Decision Profile"; // NEW
        DOM.gameOverEpilog.querySelector('h2').textContent = "📜 Epilogue"; // NEW
        DOM.retryGameBtn.textContent = "Retry";
        DOM.backToMainMenuBtn.textContent = "Back to Main Menu";
    }
    _deps.updateThemeToggleButtonText(); // Update button text after language change
}


export function setupEventListeners(deps) {
    _deps = deps; // Set dependencies

    // API Key Screen Events
    DOM.saveApiKeyBtn.addEventListener('click', () => {
        const key = DOM.apiKeyInput.value.trim();
        if (key) {
            _deps.saveApiKey(key);
            _deps.showScreen('main-screen');
            _deps.setMainButtonsEnabled(true);
        } else {
            _deps.showMessageBox(selectedLanguage === 'id' ? 'Kunci API Kosong' : 'Empty API Key', selectedLanguage === 'id' ? 'Mohon masukkan kunci API Anda.' : 'Please enter your API key.');
        }
    });

    DOM.clearApiKeyBtn.addEventListener('click', () => {
        _deps.clearApiKey();
        _deps.showMessageBox(selectedLanguage === 'id' ? 'Kunci API Dihapus' : 'API Key Cleared', selectedLanguage === 'id' ? 'Kunci API telah dihapus dari browser Anda. Silakan masukkan kunci baru.' : 'API Key has been cleared from your browser. Please enter a new key.');
        location.reload(); 
    });


    DOM.manualInputBtn.addEventListener('click', () => {
        _deps.showScreen('manual-input-screen');
        _deps.setMainButtonsEnabled(false); 
    });
    DOM.aiGenerateBtn.addEventListener('click', () => {
        _deps.showScreen('ai-generate-form-screen');
        _deps.setMainButtonsEnabled(false); 
    });

    DOM.backFromManualBtn.addEventListener('click', () => {
        _deps.showScreen('main-screen');
        _deps.setMainButtonsEnabled(true); 
    });
    DOM.backFromAiFormBtn.addEventListener('click', () => {
        _deps.showScreen('main-screen');
        _deps.setMainButtonsEnabled(true); 
    });

    DOM.backFromAiResultsBtn.addEventListener('click', () => {
        _deps.selectedStoryDetails.selectedStoryDetails = null; // Update the actual object
        DOM.continueToCharacterSelectionBtn.style.display = 'none';
        DOM.selectedStoryDisplay.style.display = 'none';
        DOM.storyListContainer.innerHTML = '';
        DOM.storyListContainer.style.display = 'block';
        _deps.showScreen('ai-generate-form-screen');
    });

    DOM.backToStorySelectBtn.addEventListener('click', () => {
        _deps.showScreen('ai-results-screen');
        if (_deps.selectedStoryDetails.selectedStoryDetails) {
            DOM.selectedStoryDisplay.style.display = 'block';
            DOM.storyListContainer.style.display = 'none';
            DOM.continueToCharacterSelectionBtn.style.display = 'block';
        } else {
            _deps.showScreen('ai-generate-form-screen');
        }
        // Reset character creation screen state
        DOM.numCharactersSelect.value = 'ai-recommended';
        DOM.characterClassInput.value = '';
        DOM.characterClassInput.style.display = 'none';
        DOM.characterResultsDiv.innerHTML = '';
        DOM.mcSelectionHeading.style.display = 'none';
        DOM.characterActionButtons.style.display = 'none';
        _deps.generatedCharacters.generatedCharacters = []; // Clear array
        _deps.selectedMainCharacter.selectedMainCharacter = null; // Clear object
    });

    DOM.backFromSummaryBtn.addEventListener('click', () => {
        _deps.showScreen('character-creation-screen');
        // Re-display only potential MCs if they were generated before
        const potentialMCs = _deps.generatedCharacters.generatedCharacters.filter(char => char.isPotentialMC);
        if (potentialMCs.length > 0) {
            DOM.mcSelectionHeading.style.display = 'block';
            DOM.characterActionButtons.style.display = 'flex';
            DOM.characterResultsDiv.innerHTML = ''; // Clear current display
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
                DOM.characterResultsDiv.appendChild(charCard);
                _deps.addCharacterCardEventListener(charCard, char, _deps);
            });
        }
    });

    DOM.messageBoxOkBtn.addEventListener('click', () => DOM.customMessageBox.style.display = 'none');

    DOM.languageRadios.forEach(radio => {
        radio.addEventListener('change', (event) => {
            _deps.updateSelectedLanguage(event.target.value); // Update state in gameState
            _deps.updateLanguageText(); // Update UI
        });
    });

    DOM.genreSelect.addEventListener('change', () => {
        if (DOM.genreSelect.value === 'other') {
            DOM.otherGenreInput.style.display = 'block';
            DOM.subgenreSelect.style.display = 'none';
            DOM.subgenreManualInput.style.display = 'none';
        } else if (DOM.genreSelect.value !== '') {
            DOM.otherGenreInput.style.display = 'none';
            _deps.generateSubgenres(_deps.callGeminiAPI, selectedLanguage, DOM.genreSelect.value, DOM.subgenreSelect, DOM.otherGenreInput, DOM.subgenreManualInput, DOM.loadingAi, DOM.loadingText, DOM.loadingAdditionalText, DOM.generateAiBtn, _deps.showMessageBox);
            DOM.subgenreSelect.style.display = 'block';
        } else {
            DOM.otherGenreInput.style.display = 'none';
            DOM.subgenreSelect.style.display = 'none';
            DOM.subgenreManualInput.style.display = 'none';
        }
    });

    DOM.subgenreSelect.addEventListener('change', () => {
        if (DOM.subgenreSelect.value === 'other') {
            DOM.subgenreManualInput.style.display = 'block';
        } else {
            DOM.subgenreManualInput.style.display = 'none';
        }
    });

    DOM.continueToCharacterSelectionBtn.addEventListener('click', () => {
        if (_deps.selectedStoryDetails.selectedStoryDetails) {
            _deps.showScreen('character-creation-screen');
            DOM.characterResultsDiv.innerHTML = '';
            DOM.mcSelectionHeading.style.display = 'none';
            DOM.characterActionButtons.style.display = 'none';
            _deps.generatedCharacters.generatedCharacters = [];
            _deps.selectedMainCharacter.selectedMainCharacter = null;
            DOM.numCharactersSelect.value = 'ai-recommended'; 
            DOM.characterClassInput.value = '';
            DOM.characterClassInput.style.display = 'none';
        } else {
            _deps.showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Silakan pilih cerita terlebih dahulu.' : 'Please select a story first.');
        }
    });

    DOM.continueManualBtn.addEventListener('click', () => {
        const title = DOM.manualTitleInput.value.trim();
        const description = DOM.manualDescriptionInput.value.trim();
        if (title && description) {
            _deps.selectedStoryDetails.selectedStoryDetails = { title, description, genres: [], subgenres: [] };
            _deps.showScreen('character-creation-screen');
            DOM.characterResultsDiv.innerHTML = '';
            DOM.mcSelectionHeading.style.display = 'none';
            DOM.characterActionButtons.style.display = 'none';
            _deps.generatedCharacters.generatedCharacters = [];
            _deps.selectedMainCharacter.selectedMainCharacter = null;
            DOM.numCharactersSelect.value = 'ai-recommended'; 
            DOM.characterClassInput.value = '';
            DOM.characterClassInput.style.display = 'none';
        } else {
            _deps.showMessageBox(selectedLanguage === 'id' ? 'Input Tidak Lengkap' : 'Incomplete Input', selectedLanguage === 'id' ? 'Mohon isi Judul Cerita dan Deskripsi Cerita.' : 'Please fill in both Story Title and Story Description.');
        }
    });

    DOM.generateAiBtn.addEventListener('click', () => _deps.generateStoryContent(
        _deps.callGeminiAPI, selectedLanguage,
        DOM.storyListContainer, DOM.selectedStoryDisplay, DOM.continueToCharacterSelectionBtn,
        DOM.displayTitle, DOM.displayDescription, DOM.displayGenres, DOM.displaySubgenres,
        DOM.numStoriesInput, DOM.genreSelect, DOM.otherGenreInput,
        DOM.subgenreSelect, DOM.subgenreManualInput, DOM.loadingAi, DOM.loadingText,
        DOM.loadingAdditionalText, DOM.generateAiBtn, _deps.showMessageBox, _deps.selectedStoryDetails
    ));
    
    DOM.generateCharactersBtn.addEventListener('click', () => _deps.generateCharacters(
        _deps.callGeminiAPI, selectedLanguage,
        _deps.selectedStoryDetails.selectedStoryDetails, _deps.generatedCharacters, _deps.selectedMainCharacter,
        DOM.numCharactersSelect, DOM.characterClassInput, DOM.nameStyleSelect,
        DOM.loadingCharacters, DOM.loadingCharsText, DOM.loadingAdditionalTextChars,
        DOM.generateCharactersBtn, DOM.characterResultsDiv, DOM.mcSelectionHeading,
        DOM.characterActionButtons, _deps.showMessageBox, _deps.addCharacterCardEventListener,
        _deps // pass all deps for nested calls
    ));

    DOM.regenerateCharactersBtn.addEventListener('click', () => _deps.generateCharacters(
        _deps.callGeminiAPI, selectedLanguage,
        _deps.selectedStoryDetails.selectedStoryDetails, _deps.generatedCharacters, _deps.selectedMainCharacter,
        DOM.numCharactersSelect, DOM.characterClassInput, DOM.nameStyleSelect,
        DOM.loadingCharacters, DOM.loadingCharsText, DOM.loadingAdditionalTextChars,
        DOM.regenerateCharactersBtn, DOM.characterResultsDiv, DOM.mcSelectionHeading,
        DOM.characterActionButtons, _deps.showMessageBox, _deps.addCharacterCardEventListener,
        _deps // pass all deps for nested calls
    ));
    
    DOM.continueToGameBtn.addEventListener('click', () => {
        if (_deps.selectedMainCharacter.selectedMainCharacter) {
            DOM.finalSummaryTitle.textContent = _deps.selectedStoryDetails.selectedStoryDetails.title;
            DOM.finalSummaryDescription.textContent = _deps.selectedStoryDetails.selectedStoryDetails.description;
            DOM.finalSummaryGenres.textContent = _deps.selectedStoryDetails.selectedStoryDetails.genres.join(', ');
            DOM.finalSummarySubgenres.textContent = _deps.selectedStoryDetails.selectedStoryDetails.subgenres.join(', ');

            DOM.finalMcNameClass.innerHTML = `<span class="selected-angel-icon">😇</span> ${_deps.selectedMainCharacter.selectedMainCharacter.name} (${_deps.selectedMainCharacter.selectedMainCharacter.class})`;
            DOM.finalMcPersonality.textContent = _deps.selectedMainCharacter.selectedMainCharacter.personality;
            DOM.finalMcDescription.textContent = _deps.selectedMainCharacter.selectedMainCharacter.description;

            _deps.showScreen('summary-screen');
        } else {
            _deps.showMessageBox(selectedLanguage === 'id' ? 'Peringatan' : 'Warning', selectedLanguage === 'id' ? 'Mohon pilih minimal 1 Karakter Utama (MC).' : 'Please select at least 1 Main Character (MC).');
        }
    });

    DOM.startGameBtn.addEventListener('click', () => _deps.startGame(
        _deps.callGeminiAPI, selectedLanguage, _deps.selectedMainCharacter.selectedMainCharacter,
        _deps.selectedStoryDetails.selectedStoryDetails, _deps.gameProgress,
        DOM.gameScreen, DOM.gameLoadingOverlay, DOM.gamePlayScreen, DOM.gameLoadingAdditionalText,
        DOM.prologContentDisplay, DOM.chapterContentDisplay, DOM.dynamicSystemsDisplay,
        DOM.choiceContainer, DOM.startRealStoryBtn, _deps.showMessageBox,
        _deps.displayPrologue, _deps.renderDynamicSystems
    ));

    DOM.startRealStoryBtn.addEventListener('click', () => _deps.startChapter1(
        _deps.callGeminiAPI, selectedLanguage, _deps.selectedMainCharacter.selectedMainCharacter,
        _deps.selectedStoryDetails.selectedStoryDetails, _deps.generatedCharacters.generatedCharacters, _deps.gameProgress,
        DOM.prologContentDisplay, DOM.startRealStoryBtn, DOM.gameLoadingOverlay, DOM.chapterContentDisplay,
        DOM.gamePlayScreen, DOM.gameLoadingAdditionalText,
        DOM.dynamicSystemsDisplay, DOM.choiceContainer, DOM.gameOverScreen, _deps.showMessageBox,
        _deps.renderGameContent
    ));

    DOM.retryGameBtn.addEventListener('click', () => {
        _deps.initializeGameState(); // Reset game state
        _deps.showScreen('main-screen');
        _deps.setMainButtonsEnabled(true); 
    });

    DOM.backToMainMenuBtn.addEventListener('click', () => {
        _deps.initializeGameState(); // Reset game state
        _deps.showScreen('main-screen');
        _deps.setMainButtonsEnabled(true); 
    });

    DOM.numCharactersSelect.addEventListener('change', () => {
        if (DOM.numCharactersSelect.value === 'ai-recommended') {
            DOM.characterClassInput.style.display = 'none';
            DOM.characterClassInput.value = '';
        } else {
            DOM.characterClassInput.style.display = 'block';
        }
    });

    // NEW: Game Play Screen Controls
    DOM.showLogBtn.addEventListener('click', () => {
        DOM.storyLogModal.style.display = 'flex';
        _deps.displayStoryLog(_deps.gameProgress.storyLog, selectedLanguage);
    });

    DOM.storyLogCloseButton.addEventListener('click', () => {
        DOM.storyLogModal.style.display = 'none';
    });

    // Close modal if click outside content
    window.addEventListener('click', (event) => {
        if (event.target === DOM.storyLogModal) {
            DOM.storyLogModal.style.display = 'none';
        }
    });

    DOM.autoReadBtn.addEventListener('click', () => {
        const isActive = toggleAutoRead(); // Toggle state in gameState
        _deps.updateLanguageText(); // Update button text based on new state
        if (isActive) {
            // Trigger auto-advance logic if currently in game content display
            if (DOM.chapterContentDisplay.style.display === 'block' && DOM.choiceContainer.children.length > 0) {
                // If auto-read is activated while choices are present, maybe automatically pick a choice?
                // Or wait for the next chapter. For now, we'll let handleChoice manage auto-advance.
            }
        }
    });
}


