// modules/gameLogic.js
// Berisi logika inti permainan, seperti generasi cerita dan karakter, serta transisi antar bab.

import { DOM } from './domElements.js';
import { selectedLanguage, gameProgress, selectedStoryDetails, generatedCharacters, selectedMainCharacter, initializeGameState, autoReadActive, toggleAutoRead } from './gameState.js'; // Impor state langsung

// Ketergantungan (dependencies) akan diterima dari script.js utama
let _deps = {};

export function setupDependencies(dependencies) {
    _deps = dependencies;
}


export async function generateStoryContent(callGeminiAPI, selectedLanguage, storyListContainer, selectedStoryDisplay, continueToCharacterSelectionBtn, displayTitle, displayDescription, displayGenres, displaySubgenres, numStoriesInput, genreSelect, otherGenreInput, subgenreSelect, subgenreManualInput, loadingAi, loadingText, loadingAdditionalText, generateAiBtn, showMessageBox, selectedStoryDetailsState) {
    storyListContainer.innerHTML = '';
    selectedStoryDisplay.style.display = 'none';
    continueToCharacterSelectionBtn.style.display = 'none';
    selectedStoryDetailsState.selectedStoryDetails = null; // Update the state object

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

    try {
        const stories = await callGeminiAPI(prompt, storySchema, loadingAi, loadingText, loadingAdditionalText, generateAiBtn);

        if (stories && stories.length > 0) {
            const filteredStories = stories.slice(0, numStories);

            _deps.showScreen('ai-results-screen');
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

                    selectedStoryDetails.selectedStoryDetails = JSON.parse(storyCard.dataset.story); // Update global state
                    
                    displayTitle.textContent = selectedStoryDetails.selectedStoryDetails.title;
                    displayDescription.textContent = selectedStoryDetails.selectedStoryDetails.description;
                    displayGenres.textContent = selectedStoryDetails.selectedStoryDetails.genres.join(', ');
                    displaySubgenres.textContent = selectedStoryDetails.selectedStoryDetails.subgenres.join(', ');
                    
                    storyListContainer.style.display = 'none';
                    selectedStoryDisplay.style.display = 'block'; 
                    continueToCharacterSelectionBtn.style.display = 'block'; 
                });
            });
        } else {
             showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Cerita' : 'No Stories', selectedLanguage === 'id' ? 'AI tidak dapat menghasilkan cerita. Coba lagi dengan prompt yang berbeda.' : 'AI could not generate stories. Please try again with a different prompt.');
        }
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan API' : 'API Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memanggil API Gemini:' : 'Error calling Gemini API:'} ${error.message}`);
    }
}

export async function generateSubgenres(callGeminiAPI, selectedLanguage, mainGenre, subgenreSelect, otherGenreInput, subgenreManualInput, loadingAi, loadingText, loadingAdditionalText, generateAiBtn, showMessageBox) {
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
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Subgenre' : 'Subgenre Error', `${selectedLanguage === 'id' ? 'Tidak dapat menghasilkan subgenre. Menampilkan opsi "Lainnya...".' : 'Could not generate subgenres. Showing "Other..." option.'} ${error.message}`);
        const otherOption = document.createElement('option');
        otherOption.value = 'other';
        otherOption.textContent = selectedLanguage === 'id' ? 'Lainnya...' : 'Other...';
        subgenreSelect.appendChild(otherOption);
        subgenreSelect.style.display = 'block';
    } finally {
        loadingAi.style.display = 'none';
        generateAiBtn.disabled = false; 
    }
}

export async function generateCharacters(callGeminiAPI, selectedLanguage, selectedStoryDetails, generatedCharactersState, selectedMainCharacterState, numCharactersSelect, characterClassInput, nameStyleSelect, loadingCharacters, loadingCharsText, loadingAdditionalTextChars, generateCharactersBtn, characterResultsDiv, mcSelectionHeading, characterActionButtons, showMessageBox, addCharacterCardEventListener, deps) {
    characterResultsDiv.innerHTML = '';
    mcSelectionHeading.style.display = 'none';
    characterActionButtons.style.display = 'none';
    selectedMainCharacterState.selectedMainCharacter = null; // Clear object
    generatedCharactersState.generatedCharacters = []; // Clear previous characters

    let numChars;
    const selectedNumOption = numCharactersSelect.value;
    const charClassHint = characterClassInput.value.trim();
    const nameStyle = nameStyleSelect.value; 

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

    if (charClassHint && numCharactersSelect.value !== 'ai-recommended') {
        prompt += ` One character should ideally have the class: "${charClassHint}".`;
    } else if (numCharactersSelect.value === 'ai-recommended') {
        prompt += ` Ensure varied character classes are generated automatically by AI.`;
    }
    switch (nameStyle) {
        case 'japanese': prompt += ` Character names should sound Japanese.`; break;
        case 'chinese': prompt += ` Character names should sound Chinese (e.g., Zhuo Jong).`; break;
        case 'arabic': prompt += ` Character names should sound Arabic.`; break;
        case 'fantasy': prompt += ` Character names should sound genuinely fantastical, unique, and not like common real-world or Indonesian names. For example, use names like 'Elara', 'Kaelen', 'Thorian', 'Lyra', 'Zephyr'.`; break;
        case 'european_medieval': prompt += ` Character names should sound like European Medieval names (e.g., Arthur, Eleanor, Geoffrey).`; break;
        case 'celtic': prompt += ` Character names should sound like Celtic names (e.g., Aoife, Cormac, Deirdre).`; break;
        case 'norse': prompt += ` Character names should sound like Norse names (e.g., Bjorn, Freya, Ragnar).`; break;
        case 'ancient_egyptian': prompt += ` Character names should sound like Ancient Egyptian names (e.g., Nefertari, Ramses, Imhotep).`; break;
        case 'indonesian': prompt += ` Character names should sound like common Indonesian names (e.g., Budi, Siti, Rahmat, Indah).`; break;
        case 'german': prompt += ` Character names should sound like common German names (e.g., Hans, Gretel, Klaus, Sofia).`; break;
        default: prompt += ` Character names should be diverse (e.g., Western, Asian, Middle Eastern, Fantasy-inspired).`; break;
    }
    prompt += ` Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} language for personality, description, class, and role values.`;
    prompt += ` Ensure the output is a JSON array containing exactly ${numChars} character objects.`;
    prompt += ` (Timestamp: ${Date.now()})`;

    try {
        const characters = await callGeminiAPI(prompt, charSchema, loadingCharacters, loadingCharsText, loadingAdditionalTextChars, generateCharactersBtn);

        if (characters && characters.length > 0) {
            generatedCharacters.generatedCharacters = characters.slice(0, numChars); // Update the state object

            const potentialMCs = generatedCharacters.generatedCharacters.filter(char => char.isPotentialMC);

            mcSelectionHeading.style.display = 'block';
            characterActionButtons.style.display = 'flex';
            characterResultsDiv.innerHTML = ''; 

            if (potentialMCs.length > 0) {
                const mcCandidatesTitle = document.createElement('h3');
                mcCandidatesTitle.className = 'text-xl font-bold mt-4 mb-3 text-center text-gray-700';
                mcCandidatesTitle.textContent = selectedLanguage === 'id' ? 'Pilih Karakter Utama Anda:' : 'Select Your Main Character:';
                characterResultsDiv.appendChild(mcCandidatesTitle);

                potentialMCs.forEach(char => {
                    const charCard = document.createElement('div');
                    charCard.className = 'character-card potential-mc';
                    charCard.dataset.characterId = char.id;
                    charCard.innerHTML = `
                        <h2><span class="icon-placeholder">✨</span> ${char.name}</h2>
                        <p><span class="char-detail">${selectedLanguage === 'id' ? 'Kelas' : 'Class'}:</span> ${char.class}</p>
                        <p><span class="char-detail">${selectedLanguage === 'id' ? 'Peran Awal' : 'Initial Role'}:</span> ${char.role}</p>
                        <p><span class="char-detail">${selectedLanguage === 'id' ? 'Sifat' : 'Personality'}:</span> ${char.personality}</p>
                        <p><span class="char-detail">${selectedLanguage === 'id' ? 'Tentang' : 'About'}:</span> ${char.description}</p>
                    `;
                    characterResultsDiv.appendChild(charCard);
                    addCharacterCardEventListener(charCard, char, deps);
                });
            } else {
                showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Kandidat MC' : 'No MC Candidates', selectedLanguage === 'id' ? 'AI tidak dapat mengidentifikasi kandidat karakter utama. Coba lagi atau sesuaikan prompt.' : 'AI could not identify main character candidates. Try again or adjust the prompt.');
            }
        } else {
            showMessageBox(selectedLanguage === 'id' ? 'Tidak Ada Karakter' : 'No Characters', selectedLanguage === 'id' ? 'AI tidak dapat menghasilkan karakter. Coba lagi.' : 'AI could not generate characters. Please try again.');
        }
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan API' : 'API Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memanggil API Gemini:' : 'Error calling Gemini API:'} ${error.message}`);
    }
}

export async function startGame(callGeminiAPI, selectedLanguage, selectedMainCharacter, selectedStoryDetails, gameProgress, gameScreen, gameLoadingOverlay, gamePlayScreen, gameLoadingAdditionalText, prologContentDisplay, chapterContentDisplay, dynamicSystemsDisplay, choiceContainer, startRealStoryBtn, showMessageBox, displayPrologue, renderDynamicSystems) {
    showScreen('game-screen');
    gameLoadingOverlay.style.display = 'flex';
    gamePlayScreen.style.display = 'none';

    try {
        await generatePrologue(callGeminiAPI, selectedLanguage, selectedMainCharacter, selectedStoryDetails, gameProgress, gameLoadingOverlay, gameLoadingAdditionalText, prologContentDisplay, chapterContentDisplay, dynamicSystemsDisplay, choiceContainer, startRealStoryBtn, showMessageBox, displayPrologue, renderDynamicSystems);
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Memulai Game' : 'Game Start Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memulai game:' : 'Error starting game:'} ${error.message}`);
        _deps.showScreen('summary-screen'); // Ensure returning to summary screen on error
    }
}

export async function generatePrologue(callGeminiAPI, selectedLanguage, selectedMainCharacter, selectedStoryDetails, gameProgress, gameLoadingOverlay, gameLoadingAdditionalText, prologContentDisplay, chapterContentDisplay, dynamicSystemsDisplay, choiceContainer, startRealStoryBtn, showMessageBox, displayPrologueFn, renderDynamicSystemsFn) {
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
                    "lockedPaths": { "type": "ARRAY", "items": { "type": "STRING" }, "description": "Example: [\"🗡️ Ciuman Pengkhianat (Membutuhkan Trust Tinggi dengan Alice)\", \"👑 Ikrar di Ujung Senja (Memerlukan Flag 'Anugerah Raja' Terpicu)\"]" }, // NEW: Added hint example
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
    
    try {
        const prologData = await callGeminiAPI(prompt, prologSchema, gameLoadingOverlay, gameLoadingOverlay.querySelector('span'), gameLoadingAdditionalText, null);

        if (prologData) {
            displayPrologueFn(prologData, prologContentDisplay, chapterContentDisplay, gameProgress, dynamicSystemsDisplay, choiceContainer, startRealStoryBtn, selectedLanguage, renderDynamicSystemsFn);
            gameLoadingOverlay.style.display = 'none';
            gamePlayScreen.style.display = 'flex';
            gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });
        } else {
            throw new Error(selectedLanguage === 'id' ? 'Data prolog kosong atau tidak valid.' : 'Empty or invalid prologue data.');
        }
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Prolog' : 'Prologue Error', `${selectedLanguage === 'id' ? 'Tidak dapat menghasilkan prolog. Coba lagi.' : 'Could not generate prologue. Please try again.'} ${error.message}`);
        _deps.showScreen('summary-screen'); // Ensure returning to summary screen on error
        throw error; // Re-throw to propagate error for startGame to catch
    }
}

export async function startChapter1(callGeminiAPI, selectedLanguage, selectedMainCharacter, selectedStoryDetails, generatedCharacters, gameProgress, prologContentDisplay, startRealStoryBtn, gameLoadingOverlay, chapterContentDisplay, gamePlayScreen, gameLoadingAdditionalText, dynamicSystemsDisplay, choiceContainer, gameOverScreen, showMessageBox, renderGameContentFn) {
    gameProgress.currentChapter = 1;
    gameProgress.currentScene = 1;

    prologContentDisplay.style.display = 'none';
    startRealStoryBtn.style.display = 'none';
    gameLoadingOverlay.style.display = 'flex';

    try {
        await generateChapter(callGeminiAPI, selectedLanguage, selectedMainCharacter, selectedStoryDetails, generatedCharacters, gameProgress, gameLoadingOverlay, chapterContentDisplay, gamePlayScreen, gameLoadingAdditionalText, dynamicSystemsDisplay, choiceContainer, gameOverScreen, showMessageBox, renderGameContentFn);
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Memulai Bab 1' : 'Chapter 1 Start Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat memulai Bab 1:' : 'Error starting Chapter 1:'} ${error.message}`);
        _deps.endGame('bad', selectedLanguage === 'id' ? 'Cerita tidak dapat dilanjutkan.' : 'Story cannot be continued.', null, null); // Call endGame
    }
}


export async function generateChapter(callGeminiAPI, selectedLanguage, selectedMainCharacter, selectedStoryDetails, generatedCharacters, gameProgress, gameLoadingOverlay, chapterContentDisplay, gamePlayScreen, gameLoadingAdditionalText, dynamicSystemsDisplay, choiceContainer, gameOverScreen, showMessageBox, renderGameContentFn, previousChoiceText = null) {
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
                        "text": { "type": "STRING", "description": "The dialogue content. This text should ONLY contain the dialogue itself, without 'Nama MC [Aku]:' or 'Nama Karakter:'. This prefix will be added by the client-side code. Quotes starting with '> ' can be part of any text block." },
                        "nonVerbalReaction": { "type": "STRING", "description": "NEW: Non-verbal reaction of the speaker or other characters in the scene, e.g., 'Kael menatapku, senyumnya tipis, namun matanya menyiratkan kesedihan yang mendalam.'" } // NEW
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
                        "emote": { "type": "STRING", "description": "The actual emote character (e.g., '💬', '🦶', '🧊'), NOT descriptive words like 'confused' or 'question'." },
                        "typeIndicator": { "type": "STRING", "description": "NEW: Short indicator for choice type (e.g., 'direct_interaction', 'physical_action', 'reflection')." }, // NEW
                        "consequenceFlag": { "type": "STRING", "description": "NEW: An optional flag string that indicates a specific long-term consequence of this choice, e.g., 'Memicu Konflik Fraksi' or 'Membuka Rahasia Kuno'." } // NEW
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
                    "lockedPathsInfo": { "type": "STRING", "description": "A hint about locked paths, e.g., 'Membutuhkan Trust Tinggi dengan [Karakter X]' or 'Memerlukan Flag [Y] Terpicu'." }, // NEW: Explicit hint for locked paths
                    "gameOver": { // NEW: Game Over trigger
                        "type": "OBJECT",
                        "properties": {
                            "isGameOver": { "type": "BOOLEAN" },
                            "message": { "type": "STRING" },
                            "analysis": { "type": "STRING" },
                            "epilog": { "type": "STRING" } // NEW: Optional epilog for Game Over
                        }
                    },
                    "ending": { // NEW: Multi-ending trigger (Good, Neutral, Bad)
                        "type": "OBJECT",
                        "properties": {
                            "type": { "type": "STRING", "enum": ["good", "neutral", "bad"] },
                            "title": { "type": "STRING" },
                            "epilog": { "type": "STRING" },
                            "analysis": { "type": "STRING" }
                        }
                    },
                    "characterArcUpdates": { // NEW: Character development
                        "type": "ARRAY",
                        "items": {
                            "type": "OBJECT",
                            "properties": {
                                "characterId": { "type": "STRING" },
                                "newPersonality": { "type": "STRING" },
                                "newRole": { "type": "STRING" },
                                "reason": { "type": "STRING" }
                            },
                            "required": ["characterId", "newPersonality", "reason"]
                        }
                    },
                    "relationshipLabels": { // NEW: Explicit relationship label updates
                        "type": "OBJECT",
                        "additionalProperties": { "type": "STRING" } // { characterName: "Friend" | "Enemy" | "Lover" }
                    }
                }
            },
            "required": ["chapterTitle", "chapterMeta", "chapterContent", "choices", "consequenceNote"]
        }
    };

    const mcName = selectedMainCharacter.name;
    const mcClass = selectedMainCharacter.class;
    const storyTitle = selectedStoryDetails.title;

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
            subgenres: selectedStoryDetails.subgenres
        },
        allCharactersInStory: allCharacterNames,
        gameProgress: {
            currentChapter: gameProgress.currentChapter,
            currentScene: gameProgress.currentScene,
            trustPoints: gameProgress.trustPoints, // Pass object directly
            flagAwal: gameProgress.flagAwal, // Pass object directly
            pathTracker: gameProgress.pathTracker,
            lockedPaths: gameProgress.lockedPaths,
            achievements: gameProgress.achievements,
            traumaSystem: gameProgress.traumaSystem, // Pass object directly
            relationshipLabels: gameProgress.relationshipLabels, // Pass object directly
            timeSystem: gameProgress.timeSystem, // Pass object directly
            dnaProfile: gameProgress.dnaProfile, // Pass object directly
            playerChoices: gameProgress.playerChoices.map(c => c.choiceText).join("; ") // Summarize past choices
        },
        previousChoice: previousChoiceText
    };

    let prompt = `Continue the visual novel story. The current game state is: ${JSON.stringify(currentGameStateForAI)}.
    
    Generate the content for Chapter ${gameProgress.currentChapter}, including:
    - A concise chapter title.
    - "chapterMeta": An object containing "mcDisplay" (e.g., "MC: Renessa – Penjaga Bayangan") and "activePath" (e.g., "Jalur Aktif: Bayangan di Atas Takhta").
    - "chapterContent": An ordered array of narrative and dialogue blocks.
        - For narrative blocks, use type "narrative" and include the text. **Ensure narrative flows logically from the previous scene/prologue and does not jump.**
        - For dialogue blocks, use type "dialogue", explicitly include the "speaker" name (e.g., 'Permaisuri', 'Kapten Drevan', or "${mcName}" for the MC). The speaker's name MUST be a concrete character name from 'allCharactersInStory' and NEVER a generic placeholder like "seseorang misterius".
        - The "text" of their dialogue. This text should ONLY contain the dialogue itself, without "Nama MC [Aku]:" or "Nama Karakter:". This prefix will be added by the client-side code. Quotes starting with '> ' can be part of any text block.
        - **Include "nonVerbalReaction" property for dialogues or narrative blocks to describe character's body language or expressions.**
    - A set of 3 choices (dialogue or action) for the player.
        - **Each choice MUST have an "id", "text", and "emote".**
        - **Each choice MUST also include a "typeIndicator" (e.g., 'direct_interaction', 'physical_action', 'reflection', 'moral_dilemma', 'emotional_choice', 'strategic_move') to categorize the choice type.**
        - **Some choices should have a "consequenceFlag" string that indicates a specific long-term consequence of this choice, e.g., 'Memicu Konflik Fraksi' or 'Membuka Rahasia Kuno'.**
        - **Prioritize choices that present a "dilema moral/emosional" (moral/emotional dilemma) that influences MC's DNA Profile significantly.**
    - A "consequenceNote" explaining what the choices will affect (e.g., Kepercayaan sang Permaisuri, Jalur cerita aktif, DNA Pilihan, atau konsekuensi jangka panjang).
    - "dynamicUpdates": An object containing updates for various dynamic systems based on the narrative progression and previous choice.
        - **trustUpdates:** Update trust for characters based on choices, including reasons.
        - **flagsTriggered:** Trigger new flags based on story events or player choices.
        - **newAchievements:** Award achievements.
        - **dnaProfileChanges:** Update DNA profile (Moral, Honesty, Empati, Style) based on choices.
        - **timeUpdate/activeEvents:** Update time and active events.
        - **pathTrackerChange:** Change the active story path.
        - **lockedPathsInfo:** Provide hints for locked paths, e.g., 'Membutuhkan Trust Tinggi dengan [Karakter X]' or 'Memerlukan Flag [Y] Terpicu'.
        - **gameOver:** If MC or a critical NPC dies, set `isGameOver: true`, provide `message`, `analysis` (briefly explaining why it happened, potentially referencing DNA), and an optional `epilog`.
        - **ending:** If the story reaches a definitive end (not a game over from death), set `type` (good, neutral, bad), `title`, `epilog`, and `analysis`. This should trigger the multi-ending logic.
        - **characterArcUpdates:** Describe how NPCs (from `allCharactersInStory`) change personality or role due to events/MC interactions.
        - **relationshipLabels:** Update character relationship labels (e.g., { "Alice": "Friend", "Bob": "Enemy" }). Use values like "Friend", "Old Enemy", "Hidden Love", "Former Alliance", "Betrayer", "Loyal Companion".

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
    5. Locked Story Paths: Some paths open only if certain conditions met (high/low trust, flags triggered, secret actions, specific DNA Profile). AI should provide hints when displaying locked paths.
    6. Trust Dynamic Update: Only appears for significant changes. Format: 🔸 Althea: +2.1, 🟡 Kael: -1.2 → “You broke it again?”, ⚠️ Shadow Guild: -4.0 → [Considers you a threat].
    7. Title / Achievement System: Player gets titles based on moral choices, play style, and ending. Example: 🗡️ Bloody Hand, 👑 Forgiving Hero, 🕷️ Master Deceiver. Titles can unlock unique dialogues or hidden paths.
    8. Inner Wound / Trauma System: Heavy decisions/events can trigger trauma on MC/characters. Effects: trust changes, locking choices, different emotional dialogues.
    9. Dynamic Character Dialogue: Adjusts based on Trust, Relationship Label, interaction history. Characters remember past actions.
    10. Character Relationship Label System: Stores labels like: Friend, Old Enemy, Hidden Love, Former Alliance, Betrayer, Loyal Companion. Changes based on choices and trust. Affects special dialogues, exclusive events, betrayal/sacrifice potential.
    11. Dynamic Time Event System: Events tied to time (morning, noon, night, specific hour). Each action advances time. Some events only appear at certain times. Format: 🕒 Time: Day 3, Night; ⏳ Countdown: 1 time left before South Gate closes; 📍 Active Event: Kael's Execution (terjadi saat fajar).
    12. Choice DNA / Decision Root System: Tracks player's moral patterns: Moral, Honesty, Empati, Decision Style. Format: 🧬 Decision Profile: - Moral: High, - Honesty: Low, - Empati: Netral, - Gaya: Manipulator Emosional. This DNA affects: secret paths, automatic trust, hidden endings.
    13. MC Dialogue Choice System: MC speaks with characters. Dialogue can trigger trust changes, emotions, or story paths. Choices are provided. Example: 💬 What will you say to Kael? a. “I promise to return” b. “If you die, it's not my business.” c. (Remain silent).
    14. Action / Behavior Choice System: Not all choices are dialogue. Some are direct actions. Actions can trigger new scenes, paths, or flags. Example: 🧭 What will you do? a. Go investigate the dungeon b. Report to the General c. Hide and observe from afar. Can be combined with dialogue.
    15. **Multi-Ending:** The story should aim for multiple distinct endings (Good, Neutral, Bad) based on accumulated `trustPoints`, triggered `flagAwal`, `pathTracker`, and `DNA Profil Keputusan`. If an ending is reached, the `ending` object in `dynamicUpdates` should be populated.
    
    Format the output strictly as JSON according to the provided schema. Use ${selectedLanguage === 'id' ? 'Indonesian' : 'English'} for all content.
    
    For the "choices" emotes, ONLY use these specific characters: '💬' (dialogue), '🦶' (action/movement), '🧊' (silence/inaction), '✨' (magic/supernatural), '🗡️' (combat/threat), '❤️' (affection/emotion), '🧠' (thought/analysis), '🔍' (investigation/discovery), '⏳' (time-related action), '📜' (reading/lore). Do NOT use descriptive words like 'confused', 'question', 'silent'.
    Make sure all numerical trust changes are represented with positive or negative values like "+2.1" or "-1.2".
    Include at least 3 choices per step.
    Focus on creating a compelling and interactive story with clear progression. **Ensure narrative continuity, building directly on the previous chapter's events and the previous choice made. Avoid jumping in plot or introducing unrelated elements. The story must progress naturally from where it left off.**
    **If a character dies, the AI should indicate "MC mati" (MC died) or a specific character's death in the narrative/notes, or set the `gameOver` object. If MC dies, game over. If a critical NPC dies, it can lead to `gameOver` or a `bad` ending, as appropriate.**
    Do NOT include the "🎮 Sistem Aktif:" block in the chapter output, only provide the individual dynamic updates in the "dynamicUpdates" object.
    Always provide a "consequenceNote" explaining what the choices will affect (e.g., Kepercayaan sang Permaisuri, Jalur cerita aktif, DNA Pilihan, Konsekuensi jangka panjang: [nama konsekuensi flag]).
    `;

    try {
        const chapterData = await callGeminiAPI(prompt, chapterSchema, gameLoadingOverlay, gameLoadingOverlay.querySelector('span'), gameLoadingAdditionalText, null);

        if (chapterData) {
            // NEW: Check for Game Over condition
            if (chapterData.dynamicUpdates && chapterData.dynamicUpdates.gameOver && chapterData.dynamicUpdates.gameOver.isGameOver) {
                // If MC dies or a critical game-over event occurs
                _deps.endGame('game_over', chapterData.dynamicUpdates.gameOver.message, chapterData.dynamicUpdates.gameOver.analysis, chapterData.dynamicUpdates.gameOver.epilog);
                return; // Stop further processing for this chapter
            }
            // NEW: Check for Multi-Ending condition
            if (chapterData.dynamicUpdates && chapterData.dynamicUpdates.ending) {
                const ending = chapterData.dynamicUpdates.ending;
                _deps.endGame(ending.type, ending.title, ending.analysis, ending.epilog);
                return; // Stop further processing
            }

            renderGameContentFn(chapterData, chapterContentDisplay, selectedMainCharacter, gameProgress, dynamicSystemsDisplay, choiceContainer, showMessageBox, _deps.handleChoice, selectedLanguage, _deps.showNotification);
            gameLoadingOverlay.style.display = 'none';
            chapterContentDisplay.style.display = 'block';
            gamePlayScreen.scrollIntoView({ behavior: 'smooth', block: 'start' });

            // NEW: Implement Auto-Read logic here if active and choices are present
            if (autoReadActive && chapterData.choices.length > 0) {
                // Auto-read will wait for a short duration and then pick the first choice,
                // or you could add more complex logic here (e.g., pick a random choice, pick a specific choice type)
                setTimeout(() => {
                    const firstChoice = chapterData.choices[0]; // For simplicity, pick first choice
                    if (firstChoice) {
                        _deps.handleChoice(firstChoice, _deps);
                    }
                }, 3000); // Wait 3 seconds before auto-picking a choice
            }

        } else {
            throw new Error(selectedLanguage === 'id' ? 'Data bab kosong atau tidak valid.' : 'Empty or invalid chapter data.');
        }
    } catch (error) {
        showMessageBox(selectedLanguage === 'id' ? 'Kesalahan Bab' : 'Chapter Error', `${selectedLanguage === 'id' ? 'Terjadi kesalahan saat menghasilkan bab. Cerita akan berakhir.' : 'Error generating chapter. Story will end.'} ${error.message}`);
        _deps.endGame('bad', selectedLanguage === 'id' ? 'Cerita berakhir karena kesalahan.' : 'Story ended due to an error.', selectedLanguage === 'id' ? 'AI tidak dapat melanjutkan cerita. Mungkin ada masalah dengan data atau respons API.' : 'AI could not continue the story. There might be an issue with data or API response.', null);
    }
}

export async function handleChoice(choice, deps) {
    // Record the choice
    deps.gameProgress.playerChoices.push({
        chapter: deps.gameProgress.currentChapter,
        scene: deps.gameProgress.currentScene,
        choiceId: choice.id,
        choiceText: choice.text,
        timestamp: new Date().toLocaleTimeString() // NEW: Add timestamp
    });
    // Mark the chosen option in storyLog if it was previously added as an option
    // (This requires a bit more sophisticated logging, but for now we push a specific 'player-choice' entry)
    deps.gameProgress.storyLog.push({
        type: 'player-choice',
        text: choice.text,
        id: choice.id,
        timestamp: new Date().toLocaleTimeString()
    });


    // Increment scene/chapter (simple progression for now)
    deps.gameProgress.currentScene++;

    // Clear choices and show loading
    DOM.choiceContainer.innerHTML = '';
    DOM.gameLoadingOverlay.style.display = 'flex';

    // Generate next chapter/scene
    await deps.generateChapter(
        deps.callGeminiAPI, deps.selectedLanguage, deps.selectedMainCharacter.selectedMainCharacter,
        deps.selectedStoryDetails.selectedStoryDetails, deps.generatedCharacters.generatedCharacters, deps.gameProgress,
        DOM.gameLoadingOverlay, DOM.chapterContentDisplay, DOM.gamePlayScreen, DOM.gameLoadingAdditionalText,
        DOM.dynamicSystemsDisplay, DOM.choiceContainer, DOM.gameOverScreen, deps.showMessageBox,
        deps.renderGameContent, choice.text // Pass chosen text to next chapter generation
    );
}

/**
 * Mengakhiri permainan dan menampilkan layar akhir (Game Over, Good Ending, dll.).
 * @param {string} type Tipe ending ('game_over', 'good', 'neutral', 'bad').
 * @param {string} title Judul ending/pesan Game Over.
 * @param {string} analysis Analisis singkat mengapa ending ini terjadi.
 * @param {string} epilog Epilog cerita (opsional).
 */
export function endGame(type, title, analysis, epilog) {
    let gameOverMessageText = '';
    let analysisText = '';
    let finalEpilog = '';

    const currentDNA = gameProgress.dnaProfile;

    if (type === 'game_over') {
        gameOverMessageText = title || (selectedLanguage === 'id' ? 'Anda telah gagal dalam petualangan ini.' : 'You have failed in this adventure.');
        analysisText = analysis || (selectedLanguage === 'id' ? 'Pilihan Anda membawa Anda pada akhir yang tragis.' : 'Your choices led to a tragic end.');
        finalEpilog = epilog || '';
    } else { // good, neutral, bad endings
        gameOverMessageText = selectedLanguage === 'id' ? `🎉 ${type === 'good' ? 'Selamat!' : ''} Cerita Berakhir: ${title}` : `🎉 ${type === 'good' ? 'Congratulations!' : ''} Story End: ${title}`;
        analysisText = analysis || (selectedLanguage === 'id' ? `Anda mencapai ending ${type}.` : `You reached a ${type} ending.`);
        finalEpilog = epilog || (selectedLanguage === 'id' ? 'Tidak ada epilog khusus yang disediakan.' : 'No specific epilog provided.');
    }

    _deps.displayGameOverScreen(gameOverMessageText, analysisText, currentDNA, finalEpilog, selectedLanguage);
}

