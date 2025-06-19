// modules/renderFunctions.js
// Bertanggung jawab untuk merender elemen UI ke DOM.

import { DOM } from './domElements.js'; // Impor elemen DOM

// Ketergantungan (dependencies) akan diterima dari script.js utama
let _deps = {};

export function setupDependencies(dependencies) {
    _deps = dependencies;
}

/**
 * Menampilkan notifikasi pop-up singkat.
 * @param {string} message Pesan yang akan ditampilkan.
 * @param {string} type Tipe notifikasi (e.g., 'success', 'info', 'warning', 'error'). Belum digunakan sepenuhnya dalam styling saat ini.
 */
export function showNotification(message, type = 'info') {
    if (!DOM.notificationContainer) return;

    const notificationItem = document.createElement('div');
    notificationItem.className = `notification-item notification-${type}`; // Tambahkan class type untuk styling lebih lanjut
    notificationItem.textContent = message;

    DOM.notificationContainer.appendChild(notificationItem);

    // Hapus notifikasi setelah animasi selesai
    notificationItem.addEventListener('animationend', () => {
        notificationItem.remove();
    });
}


export function displayPrologue(prologData, prologContentDisplay, chapterContentDisplay, gameProgress, dynamicSystemsDisplay, choiceContainer, startRealStoryBtn, selectedLanguage, renderDynamicSystemsFn) {
    prologContentDisplay.innerHTML = `
        <div class="chapter-header-card">
            <h2>🌹 ${prologData.prologueTitle}</h2>
            <p class="chapter-meta">${prologData.genreDetails}</p>
        </div>
        <div class="narrative-content">
            ${prologData.prologueText.split('\n').filter(Boolean).map(p => {
                if (p.trim().startsWith('> ')) {
                    return `<p class="prolog-quote">${p.trim().substring(2)}</p>`;
                }
                return `<p>${p.trim()}</p>`;
            }).join('')}
        </div>
    `;
    prologContentDisplay.style.display = 'block';
    chapterContentDisplay.style.display = 'none';

    // Initialize gameProgress with initial systems from prologue
    gameProgress.pathTracker = prologData.initialSystems.pathTracker;
    
    // Ensure lockedPaths is an array; if AI returns a string, convert it
    if (typeof prologData.initialSystems.lockedPaths === 'string') {
        try {
            // Attempt to parse if it looks like a JSON array string
            gameProgress.lockedPaths = JSON.parse(prologData.initialSystems.lockedPaths);
            if (!Array.isArray(gameProgress.lockedPaths)) {
                 gameProgress.lockedPaths = [prologData.initialSystems.lockedPaths];
            }
        } catch (e) {
            console.error("Failed to parse lockedPaths as JSON string, treating as single item array:", prologData.initialSystems.lockedPaths, e);
            gameProgress.lockedPaths = [prologData.initialSystems.lockedPaths]; // Fallback to array with single string
        }
    } else if (Array.isArray(prologData.initialSystems.lockedPaths)) {
        gameProgress.lockedPaths = prologData.initialSystems.lockedPaths;
    } else {
        gameProgress.lockedPaths = []; // Default to empty array if unexpected format
    }
    
    // Ensure flagAwal is an object; if AI returns a string, store as such for now or parse if a JSON string.
    // Given previous `flagAwal: Kamu menganggap permaisuri hanya beban yang harus diamati`, it's likely a string.
    // If it's intended to be an object, the schema should enforce it better.
    if (typeof prologData.initialSystems.flagAwal === 'string') {
        // If it's a simple string, put it into an object under a generic key for consistent display
        gameProgress.flagAwal = { "initial": prologData.initialSystems.flagAwal }; 
    } else if (typeof prologData.initialSystems.flagAwal === 'object') {
        gameProgress.flagAwal = prologData.initialSystems.flagAwal;
    } else {
        gameProgress.flagAwal = {}; // Default to empty object
    }
    
    // Removed: Simpan konten prolog ke storyLog
    // gameProgress.storyLog = [{
    //     type: 'prologue-header',
    //     title: prologData.prologueTitle,
    //     meta: prologData.genreDetails,
    //     timestamp: new Date().toLocaleTimeString()
    // }];
    // prologData.prologueText.split('\n').filter(Boolean).forEach(p => {
    //     gameProgress.storyLog.push({
    //         type: 'narrative',
    //         text: p.trim(),
    //         timestamp: new Date().toLocaleTimeString()
    //     });
    // });


    renderDynamicSystemsFn(prologData.initialSystems, true, gameProgress, selectedLanguage); // True for initial display
    
    choiceContainer.innerHTML = '';
    startRealStoryBtn.style.display = 'block';
}

export function renderGameContent(chapterData, chapterContentDisplay, selectedMainCharacter, gameProgress, dynamicSystemsDisplay, choiceContainer, showMessageBox, handleChoiceFn, selectedLanguage, showNotificationFn) {
    chapterContentDisplay.innerHTML = '';

    // Removed: Add chapter header to log
    // gameProgress.storyLog.push({
    //     type: 'chapter-header',
    //     title: chapterData.chapterTitle,
    //     meta: chapterData.chapterMeta.mcDisplay + ' | ' + chapterData.chapterMeta.activePath,
    //     timestamp: new Date().toLocaleTimeString()
    // });

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

    const narrativeContainer = document.createElement('div');
    narrativeContainer.className = 'narrative-content';
    chapterContentDisplay.appendChild(narrativeContainer);

    chapterData.chapterContent.forEach(block => {
        if (block.type === 'narrative') {
            const p = document.createElement('p');
            p.innerHTML = block.text.split('\n').filter(Boolean).map(line => {
                if (line.trim().startsWith('> ')) {
                    return `<p class="chapter-quote">${line.trim().substring(2)}</p>`;
                }
                return `<p>${line.trim()}</p>`;
            }).join('');
            narrativeContainer.appendChild(p);

            // Removed: Add narrative to log
            // gameProgress.storyLog.push({
            //     type: 'narrative',
            //     text: block.text.trim(),
            //     timestamp: new Date().toLocaleTimeString()
            // });

        } else if (block.type === 'dialogue') {
            const dialogueCard = document.createElement('div');
            let speakerNameDisplay = block.speaker;
            let dialogueText = block.text;

            if (block.speaker === selectedMainCharacter.name) {
                dialogueCard.className = 'character-dialogue-card mc-dialogue-card';
                speakerNameDisplay = `${selectedMainCharacter.name} [Aku]`;
            } else {
                dialogueCard.className = 'character-dialogue-card other-dialogue-card';
            }
            
            dialogueCard.innerHTML = `
                <strong class="speaker-name">${speakerNameDisplay}:</strong>
                <span>${dialogueText}</span>
            `;
            narrativeContainer.appendChild(dialogueCard);

            // Removed: Add dialogue to log
            // gameProgress.storyLog.push({
            //     type: 'dialogue',
            //     speaker: speakerNameDisplay, // Use the displayed name with [Aku]
            //     text: dialogueText.trim(),
            //     timestamp: new Date().toLocaleTimeString()
            // });
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
                // Show notification for trust changes
                const trustMessage = `${tu.character}: ${tu.change > 0 ? '+' : ''}${tu.change} Trust! ${tu.reason || ''}`;
                showNotificationFn(trustMessage, tu.change > 0 ? 'success' : 'error');
            });
        }

        if (updates.flagsTriggered) {
            updates.flagsTriggered.forEach(flag => {
                if (typeof gameProgress.flagAwal === 'string') { // If it was previously a string from prologue, convert to object
                    gameProgress.flagAwal = {};
                }
                gameProgress.flagAwal[flag] = true;
                // Show notification for flag triggered
                showNotificationFn(`${selectedLanguage === 'id' ? 'Flag Terpicu:' : 'Flag Triggered:'} ${flag}!`, 'info');
            });
        }

        if (updates.newAchievements) {
            updates.newAchievements.forEach(achievement => {
                if (!gameProgress.achievements.some(a => a.title === achievement.title)) {
                    gameProgress.achievements.push(achievement);
                    // Show notification for achievement
                    showNotificationFn(`${selectedLanguage === 'id' ? 'Pencapaian Baru:' : 'New Achievement:'} ${achievement.title}!`, 'success');
                }
            });
        }

        if (updates.dnaProfileChanges) {
            gameProgress.dnaProfile = { ...gameProgress.dnaProfile, ...updates.dnaProfileChanges };
            // Optional: Show notification for DNA changes (can be verbose)
            // showNotificationFn(`${selectedLanguage === 'id' ? 'Profil DNA Diperbarui!' : 'DNA Profile Updated!'}`, 'info');
        }

        if (updates.timeUpdate) {
            gameProgress.timeSystem.display = updates.timeUpdate; 
            // Show notification for time update
            showNotificationFn(`${selectedLanguage === 'id' ? 'Waktu Diperbarui:' : 'Time Updated:'} ${updates.timeUpdate}`, 'info');
        }

        if (updates.activeEvents) {
            gameProgress.timeSystem.activeEvents = updates.activeEvents;
            // Optional: Show notification for new active events (can be verbose)
            // if (updates.activeEvents.length > 0) {
            //     showNotificationFn(`${selectedLanguage === 'id' ? 'Event Baru Aktif!' : 'New Event Active!'}`, 'info');
            // }
        }

        if (updates.pathTrackerChange) {
            gameProgress.pathTracker = updates.pathTrackerChange;
            // Show notification for path change
            showNotificationFn(`${selectedLanguage === 'id' ? 'Jalur Cerita Berubah:' : 'Story Path Changed:'} ${updates.pathTrackerChange}`, 'info');
        }

        // Handle relationshipLabels update
        if (updates.relationshipLabels) {
            for (const charId in updates.relationshipLabels) {
                gameProgress.relationshipLabels[charId] = updates.relationshipLabels[charId];
                showNotificationFn(`${selectedLanguage === 'id' ? 'Label Hubungan dengan' : 'Relationship with'} ${charId} ${selectedLanguage === 'id' ? 'Diperbarui menjadi' : 'updated to'} ${updates.relationshipLabels[charId]}`, 'info');
            }
        }
    }

    renderDynamicSystems(chapterData.dynamicUpdates, false, gameProgress, selectedLanguage);

    choiceContainer.innerHTML = '';
    chapterData.choices.forEach(choice => {
        const choiceCard = document.createElement('div');
        choiceCard.className = 'choice-card';
        // Add a small visual indicator for choice type (if applicable, based on emote)
        let choiceIndicator = '';
        if (choice.emote) {
            choiceIndicator = `<span class="choice-emote">${choice.emote}</span>`;
        }
        choiceCard.innerHTML = `${choiceIndicator} ${choice.text}`;
        choiceCard.addEventListener('click', () => handleChoiceFn(choice, _deps)); // Pass _deps to handleChoice
        choiceContainer.appendChild(choiceCard);

        // Removed: Add choice to story log (will be marked as player choice)
        // gameProgress.storyLog.push({
        //     type: 'choice-option',
        //     text: choice.text,
        //     id: choice.id,
        //     emote: choice.emote,
        //     timestamp: new Date().toLocaleTimeString()
        // });
    });

    if (chapterData.consequenceNote) {
        const consequenceP = document.createElement('p');
        consequenceP.className = 'text-sm mt-4 text-gray-600 text-center italic';
        consequenceP.textContent = chapterData.consequenceNote;
        choiceContainer.appendChild(consequenceP);
    }
}

export function renderDynamicSystems(updates, isInitial = false, gameProgress, selectedLanguage) {
    DOM.dynamicSystemsDisplay.innerHTML = `<h3>🎮 Sistem Aktif:</h3>`;
    
    const appendSystemLine = (icon, title, value, className = '') => {
        if (value || value === 0) { // Check for 0 for trust points
            const p = document.createElement('p');
            p.innerHTML = `<span class="system-title">${icon} ${title}:</span> <span class="${className}">${value}</span>`;
            DOM.dynamicSystemsDisplay.appendChild(p);
        }
    };

    appendSystemLine('🧠', 'Trust System', selectedLanguage === 'id' ? 'Setiap karakter memiliki poin kepercayaan terhadap MC.' : 'Each character has trust points towards MC.');
    // Display individual character trust points
    if (Object.keys(gameProgress.trustPoints).length > 0) {
        const trustSection = document.createElement('div');
        trustSection.className = 'pl-4 mt-2 border-l border-dotted border-gray-400';
        for (const charName in gameProgress.trustPoints) {
            const trustValue = gameProgress.trustPoints[charName];
            let trustColorClass = 'neutral';
            if (trustValue > 0) trustColorClass = 'positive';
            else if (trustValue < 0) trustColorClass = 'negative';
            
            const trustLine = document.createElement('p');
            trustLine.className = `trust-update-item ${trustColorClass}`;
            trustLine.innerHTML = `🔸 ${charName}: ${trustValue.toFixed(1)}`; // Display with one decimal
            trustSection.appendChild(trustLine);
        }
        DOM.dynamicSystemsDisplay.appendChild(trustSection);
    }

    appendSystemLine('🩸', 'Death Trigger', selectedLanguage === 'id' ? 'MC atau karakter penting bisa mati jika pemain mengambil pilihan tertentu.' : 'MC or important characters can die based on choices.');
    
    // Flag Awal
    if (gameProgress.flagAwal) {
        if (typeof gameProgress.flagAwal === 'object' && Object.keys(gameProgress.flagAwal).length > 0) {
            const flagStrings = Object.keys(gameProgress.flagAwal).map(key => `${key}: ${gameProgress.flagAwal[key]}`);
            appendSystemLine('🎭', 'Flag Awal', flagStrings.join(', '));
        } else if (typeof gameProgress.flagAwal === 'string' && gameProgress.flagAwal.trim() !== "") {
            appendSystemLine('🎭', 'Flag Awal', gameProgress.flagAwal);
        }
    }
    if (gameProgress.pathTracker) {
        appendSystemLine('🔒', 'Path Tracker', gameProgress.pathTracker);
    }
    // Display locked paths with hints
    if (gameProgress.lockedPaths && gameProgress.lockedPaths.length > 0) {
        const lockedPathsContent = gameProgress.lockedPaths.map(path => {
            // Assume path might contain a hint in parentheses like "Jalur A (Membutuhkan Trust Tinggi)"
            return path;
        }).join(', ');
        appendSystemLine('🕊️', 'Jalur Cerita Terkunci Potensial', lockedPathsContent);
    }
    
    if (gameProgress.timeSystem.display) {
        appendSystemLine('⏳', 'Waktu & Event', gameProgress.timeSystem.display);
    } else if (gameProgress.timeSystem.day) {
        appendSystemLine('⏳', 'Waktu', `${selectedLanguage === 'id' ? 'Hari ke-' : 'Day '}${gameProgress.timeSystem.day}, ${gameProgress.timeSystem.partOfDay}`);
    }

    if (gameProgress.dnaProfile) {
        const dnaText = `Moral: ${gameProgress.dnaProfile.moral}, Kejujuran: ${gameProgress.dnaProfile.honesty}, Empati: ${gameProgress.dnaProfile.empathy}, Gaya: ${gameProgress.dnaProfile.style}`;
        appendSystemLine('🧬', 'Profil Keputusan', dnaText);
    }

    // Display relationship labels
    if (Object.keys(gameProgress.relationshipLabels).length > 0) {
        const relationshipSection = document.createElement('div');
        relationshipSection.className = 'pl-4 mt-2 border-l border-dotted border-gray-400';
        for (const charName in gameProgress.relationshipLabels) {
            const label = gameProgress.relationshipLabels[charName];
            const relationshipLine = document.createElement('p');
            relationshipLine.className = 'relationship-label-item';
            relationshipLine.innerHTML = `💖 ${charName}: ${label}`;
            relationshipSection.appendChild(relationshipLine);
        }
        DOM.dynamicSystemsDisplay.appendChild(relationshipSection);
    }


    if (updates && updates.trustUpdates && updates.trustUpdates.length > 0 && !isInitial) { // Only show updates, not full list on initial
        const trustUpdateTitle = document.createElement('p');
        trustUpdateTitle.className = 'system-title mt-2';
        trustUpdateTitle.textContent = 'Trust Update Terbaru:';
        DOM.dynamicSystemsDisplay.appendChild(trustUpdateTitle);

        updates.trustUpdates.forEach(tu => {
            const trustItem = document.createElement('p');
            let icon = '🟡';
            let textColorClass = 'neutral';
            if (tu.change > 0) { icon = '🔸'; textColorClass = 'positive'; }
            else if (tu.change < 0) { icon = '⚠️'; textColorClass = 'negative'; }
            
            trustItem.className = `trust-update-item ${textColorClass}`;
            trustItem.innerHTML = `${icon} ${tu.character}: ${tu.change > 0 ? '+' : ''}${tu.change.toFixed(1)}${tu.reason ? ` → "${tu.reason}"` : ''}`;
            DOM.dynamicSystemsDisplay.appendChild(trustItem);
        });
    }

    if (updates && updates.flagsTriggered && updates.flagsTriggered.length > 0 && !isInitial) {
         const flagTriggeredTitle = document.createElement('p');
         flagTriggeredTitle.className = 'system-title mt-2';
         flagTriggeredTitle.textContent = 'Flag Terpicu Terbaru:';
         DOM.dynamicSystemsDisplay.appendChild(flagTriggeredTitle);

         updates.flagsTriggered.forEach(flag => {
            const flagItem = document.createElement('p');
            flagItem.className = 'flag-item';
            flagItem.textContent = `🧩 ${flag}`;
            DOM.dynamicSystemsDisplay.appendChild(flagItem);
         });
    }

    if (updates && updates.newAchievements && updates.newAchievements.length > 0 && !isInitial) {
        const achievementTitle = document.createElement('p');
        achievementTitle.className = 'system-title mt-2';
        achievementTitle.textContent = '🎖️ Gelar Baru Ditemukan:';
        DOM.dynamicSystemsDisplay.appendChild(achievementTitle);

        updates.newAchievements.forEach(ach => {
            const achievementItem = document.createElement('p');
            achievementItem.className = 'achievement-item';
            achievementItem.innerHTML = `<strong>${ach.title}</strong>: ${ach.description}`;
            DOM.dynamicSystemsDisplay.appendChild(achievementItem);
        });
    }

    if (isInitial && updates && updates.notes) {
        const notesP = document.createElement('p');
        notesP.className = 'system-title mt-2';
        notesP.textContent = `🎯 Catatan: ${updates.notes}`;
        DOM.dynamicSystemsDisplay.appendChild(notesP);
    }
}

export function addCharacterCardEventListener(charCard, charData, deps) {
    charCard.addEventListener('click', () => {
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected-mc');
            card.style.backgroundColor = 'var(--container-bg)';
            const iconSpan = card.querySelector('.icon-placeholder');
            if (iconSpan) iconSpan.textContent = '✨'; 
        });
        
        charCard.classList.add('selected-mc');
        charCard.style.backgroundColor = 'var(--char-card-selected-bg)';
        deps.selectedMainCharacter.selectedMainCharacter = charData;
        console.log("Selected MC:", deps.selectedMainCharacter.selectedMainCharacter);

        const selectedIconSpan = charCard.querySelector('.icon-placeholder');
        if (selectedIconSpan) selectedIconSpan.textContent = '😇';
    });
}

// Removed: displayStoryLog function
// export function displayStoryLog(storyLog, selectedLanguage) {
//     DOM.logContent.innerHTML = ''; // Clear previous log content

//     if (storyLog.length === 0) {
//         DOM.logContent.textContent = selectedLanguage === 'id' ? "Log cerita masih kosong." : "Story log is empty.";
//         return;
//     }

//     storyLog.forEach(entry => {
//         const p = document.createElement('p');
//         p.className = 'log-entry';
        
//         const timestampSpan = document.createElement('span');
//         timestampSpan.className = 'log-timestamp';
//         timestampSpan.textContent = entry.timestamp;

//         if (entry.type === 'prologue-header') {
//             p.innerHTML = `<strong class="text-lg text-blue-600">🌹 ${entry.title}</strong> <br> <span class="text-sm italic text-gray-500">${entry.meta}</span>`;
//             p.className = 'log-header-prologue';
//         } else if (entry.type === 'chapter-header') {
//             p.innerHTML = `<strong class="text-lg text-purple-600">🩸 ${entry.title}</strong> <br> <span class="text-sm italic text-gray-500">${entry.meta}</span>`;
//             p.className = 'log-header-chapter';
//         } else if (entry.type === 'narrative') {
//             p.className = 'log-narrative';
//             p.textContent = entry.text;
//         } else if (entry.type === 'dialogue') {
//             p.className = 'log-dialogue';
//             p.innerHTML = `<strong>${entry.speaker}:</strong> ${entry.text}`;
//         } else if (entry.type === 'player-choice') { // The player's final choice
//             p.className = 'log-choice bg-yellow-100 p-2 rounded-md';
//             p.innerHTML = `<span class="font-bold">✅ ${selectedLanguage === 'id' ? 'Pilihan Anda' : 'Your Choice'}:</span> ${entry.text}`;
//         } else if (entry.type === 'choice-option') { // The options presented to the player
//             return; 
//         }

//         DOM.logContent.appendChild(p);
//         DOM.logContent.appendChild(timestampSpan); // Add timestamp after each entry
//     });
// }

// Fungsi untuk menampilkan layar Game Over dengan detail tambahan
export function displayGameOverScreen(message, analysis, dnaProfile, epilogContent, selectedLanguage) {
    _deps.showScreen('game-over-screen');
    DOM.gameOverMessage.textContent = message;
    DOM.gameOverAnalysis.textContent = analysis;

    // Tampilkan DNA Profile
    if (dnaProfile) {
        DOM.gameOverDnaProfile.style.display = 'block';
        DOM.dnaMoral.textContent = dnaProfile.moral;
        DOM.dnaHonesty.textContent = dnaProfile.honesty;
        DOM.dnaEmpathy.textContent = dnaProfile.empathy;
        DOM.dnaStyle.textContent = dnaProfile.style;
    } else {
        DOM.gameOverDnaProfile.style.display = 'none';
    }

    // Tampilkan Epilog
    if (epilogContent) {
        DOM.gameOverEpilog.style.display = 'block';
        DOM.epilogContent.innerHTML = epilogContent.split('\n').filter(Boolean).map(p => `<p>${p.trim()}</p>`).join('');
    } else {
        DOM.gameOverEpilog.style.display = 'none';
    }
}

